#!/usr/bin/env python3

import requests
import base64
from pathlib import Path

test_image_path = Path("/home/sudolife/Documents/sudo/histopath/ui/public/confusion_matrix.png")

if not test_image_path.exists():
    print(f"Test image not found: {test_image_path}")
    exit(1)

with open(test_image_path, "rb") as f:
    image_bytes = f.read()

files = {
    'file': ('test_image.png', image_bytes, 'image/png')
}

print("Testing Grad-CAM API endpoint...")
print(f"Using test image: {test_image_path}")

try:
    response = requests.post(
        "http://127.0.0.1:8000/predict",
        files=files,
        timeout=30
    )
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\nAPI Response Successful!")
        print(f"Prediction: {result.get('prediction')}")
        print(f"Confidence: {result.get('confidence', 0) * 100:.2f}%")
        
        gradcam = result.get('gradcam', {})
        print(f"\nGrad-CAM Images:")
        print(f"  - Original: {'Present' if gradcam.get('original') else 'Missing'} ({len(gradcam.get('original', ''))} chars)")
        print(f"  - Heatmap: {'Present' if gradcam.get('heatmap') else 'Missing'} ({len(gradcam.get('heatmap', ''))} chars)")
        print(f"  - Overlay: {'Present' if gradcam.get('overlay') else 'Missing'} ({len(gradcam.get('overlay', ''))} chars)")
        
        output_dir = Path("/tmp/gradcam_test")
        output_dir.mkdir(exist_ok=True)
        
        for name, data_url in gradcam.items():
            if data_url and data_url.startswith('data:image/png;base64,'):
                base64_data = data_url.split(',')[1]
                image_data = base64.b64decode(base64_data)
                
                output_path = output_dir / f"{name}.png"
                with open(output_path, 'wb') as f:
                    f.write(image_data)
                print(f"\nSaved {name} to: {output_path}")
        
        print(f"\nAll Grad-CAM visualizations generated successfully!")
        
    else:
        print(f"\nAPI Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"\nError: {e}")
    import traceback
    traceback.print_exc()
