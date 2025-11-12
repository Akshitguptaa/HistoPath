import numpy as np
import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import io

app = FastAPI()

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = "model.h5"
try:
    model = load_model(model_path)
    print(f"Successfully loaded model from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes))
    
    if img.mode != "RGB":
        img = img.convert("RGB")
        
    img = img.resize((96, 96))
    
    img_array = np.array(img)
    
    img_array = img_array / 255.0
    
    return np.expand_dims(img_array, axis=0)

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if not model:
        return {"error": "Model is not loaded."}, 500

    try:
        # Read the image file
        image_bytes = await file.read()
        
        # Preprocess the image
        processed_image = preprocess_image(image_bytes)
        
        # Make a prediction
        prediction = model.predict(processed_image)
        
        confidence_score = float(prediction[0][0])
        
        # result formating
        threshold = 0.5
        if confidence_score >= threshold:
            prediction_label = "Metastatic"
            confidence = confidence_score
        else:
            prediction_label = "Non-Metastatic"
            confidence = 1.0 - confidence_score
            
        return {
            "prediction": prediction_label,
            "confidence": confidence,
            "heatmapUrl": generate_fake_heatmap(prediction_label == "Metastatic") 
        }
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}, 500

def generate_fake_heatmap(is_metastatic: bool) -> str:
    return "" 

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)