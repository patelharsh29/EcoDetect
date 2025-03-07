from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TensorFlow serving endpoint
ENDPOINT = "http://localhost:8501/v1/models/tomatoes_model:predict"

CLASS_NAMES = ["Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot",
               "Spider Mites Two Spotted Spider Mite", "Target Spot", "YellowLeaf Curl Virus", "Mosaic Virus",
               "Healthy"]

# Ensure correct image format, size, and normalization
def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
        file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, axis=0)  # Add batch dimension

    json_data = {
        "instances": img_batch.tolist()  # Convert NumPy array to list for JSON serialization
    }

    # Send request to TensorFlow Serving
    response = requests.post(ENDPOINT, json=json_data)

    # Handle potential request errors
    #if response.status_code != 200:
    #    return {"error": f"Failed to get prediction. Status Code: {response.status_code}"}

    # Extract predictions
    predictions = np.array(response.json()["predictions"][0])

    predicted_class = CLASS_NAMES[np.argmax(predictions)]
    confidence = np.max(predictions)

    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
