from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

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

# Load the model using TensorFlow SavedModel format
MODEL = tf.saved_model.load("../saved_models/1")
infer = MODEL.signatures["serving_default"]  # Use the serving function

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

    # Using TensorFlow SavedModel signature function instead of .predict()
    img_tensor = tf.convert_to_tensor(img_batch, dtype=tf.float32)
    predictions = infer(img_tensor)["output_0"].numpy()

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
