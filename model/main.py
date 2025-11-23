import numpy as np
import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model, Model
from PIL import Image
import io
import tensorflow as tf
import cv2
import base64

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://histopath-ai.vercel.app"
    "https://histopath-ai.vercel.app/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = "custom.h5"
try:
    model = load_model(model_path)
    print(f"Successfully loaded model from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_image(image_bytes: bytes) -> tuple:
    img = Image.open(io.BytesIO(image_bytes))
    
    if img.mode != "RGB":
        img = img.convert("RGB")
        
    img = img.resize((96, 96))
    img_array = np.array(img)
    original_img = img_array.copy()
    img_array = img_array / 255.0
    
    return np.expand_dims(img_array, axis=0), original_img

def generate_gradcam(model, img_array, last_conv_layer_name=None):
    try:
        if last_conv_layer_name is None:
            for layer in reversed(model.layers):
                if 'Conv' in layer.__class__.__name__:
                    last_conv_layer_name = layer.name
                    print(f"Using layer for Grad-CAM: {last_conv_layer_name}")
                    break
        
        if last_conv_layer_name is None:
            print("No convolutional layer found for Grad-CAM")
            return None
        
        if not model.built:
            model.build(input_shape=(None, 96, 96, 3))
        
        last_conv_layer = None
        for idx in range(len(model.layers) - 1, -1, -1):
            if 'Conv' in model.layers[idx].__class__.__name__:
                last_conv_layer = model.layers[idx]
                print(f"Using conv layer at index {idx}: {model.layers[idx].name}")
                break
        
        if last_conv_layer is None:
            print("No convolutional layer found")
            return None
        
        last_conv_layer_model = tf.keras.Model(model.inputs, last_conv_layer.output)
        
        classifier_input = tf.keras.Input(shape=last_conv_layer.output.shape[1:])
        x = classifier_input
        for layer in model.layers[model.layers.index(last_conv_layer) + 1:]:
            x = layer(x)
        classifier_model = tf.keras.Model(classifier_input, x)
        
        with tf.GradientTape() as tape:
            last_conv_layer_output = last_conv_layer_model(img_array)
            tape.watch(last_conv_layer_output)
            preds = classifier_model(last_conv_layer_output)
            top_pred_index = tf.argmax(preds[0])
            top_class_channel = preds[:, top_pred_index]
        
        grads = tape.gradient(top_class_channel, last_conv_layer_output)
        
        if grads is None:
            print("Failed to compute gradients")
            return None
        
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        last_conv_layer_output = last_conv_layer_output.numpy()[0]
        pooled_grads = pooled_grads.numpy()
        for i in range(pooled_grads.shape[0]):
            last_conv_layer_output[:, :, i] *= pooled_grads[i]
        
        heatmap = np.mean(last_conv_layer_output, axis=-1)
        
        heatmap = np.maximum(heatmap, 0) / (np.max(heatmap) + 1e-10)
        
        return heatmap
    except Exception as e:
        print(f"Grad-CAM generation failed: {e}")
        import traceback
        traceback.print_exc()
        return None

def create_heatmap_visualizations(original_img, heatmap):
    try:
        heatmap_resized = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        superimposed = cv2.addWeighted(original_img, 0.6, heatmap_colored, 0.4, 0)
        
        _, buffer_original = cv2.imencode('.png', cv2.cvtColor(original_img, cv2.COLOR_RGB2BGR))
        original_base64 = base64.b64encode(buffer_original).decode('utf-8')
        
        _, buffer_heatmap = cv2.imencode('.png', cv2.cvtColor(heatmap_colored, cv2.COLOR_RGB2BGR))
        heatmap_base64 = base64.b64encode(buffer_heatmap).decode('utf-8')
        
        _, buffer_overlay = cv2.imencode('.png', cv2.cvtColor(superimposed, cv2.COLOR_RGB2BGR))
        overlay_base64 = base64.b64encode(buffer_overlay).decode('utf-8')
        
        return {
            "original": f"data:image/png;base64,{original_base64}",
            "heatmap": f"data:image/png;base64,{heatmap_base64}",
            "overlay": f"data:image/png;base64,{overlay_base64}"
        }
    except Exception as e:
        print(f"Heatmap visualization creation failed: {e}")
        return {
            "original": "",
            "heatmap": "",
            "overlay": ""
        }

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if not model:
        return {"error": "Model is not loaded."}, 500

    try:
        image_bytes = await file.read()
        processed_image, original_img = preprocess_image(image_bytes)
        
        prediction = model.predict(processed_image)
        confidence_score = float(prediction[0][0])
        
        threshold = 0.5
        if confidence_score >= threshold:
            prediction_label = "Metastatic"
            confidence = confidence_score
        else:
            prediction_label = "Non-Metastatic"
            confidence = 1.0 - confidence_score
        
        gradcam_images = {
            "original": "",
            "heatmap": "",
            "overlay": ""
        }

        if prediction_label == "Metastatic":
            heatmap = generate_gradcam(model, processed_image)
            print(f"Heatmap generated: {heatmap is not None}")
            
            if heatmap is not None:
                print(f"Heatmap shape: {heatmap.shape}")
                gradcam_images = create_heatmap_visualizations(original_img, heatmap)
                print(f"Gradcam images generated. Original length: {len(gradcam_images['original'])}")
            else:
                print("Heatmap is None, skipping visualization")
        else:
            print("Prediction is Non-Metastatic, skipping heatmap generation")
        
        return {
            "prediction": prediction_label,
            "confidence": confidence,
            "gradcam": gradcam_images
        }
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}, 500

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)