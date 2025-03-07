##EcoDetect

##Project Description

EcoDetect is an AI-powered garden diseases monitoring system that identifies diseases from leaf images. The model processes an input image and predicts the type of disease, helping gardeners and farmers in classification for diseases detection. The system provides a confidence percentage indicating the likelihood of a match.

##Features

IOS and Andriod Application
Website

Accepts an image as input and predicts waste type or environmental factor.
Uses a trained deep learning model for classification trained from tomato diseases.
Provides a confidence score for each prediction.
Designed for real-time inference with optimized performance.

##Technologies Used

Model Building: TensorFlow, CNN, data augmentation, TensorFlow Dataset
Backend Server and ML Ops: TensorFlow Serving, FastAPI
Model Optimization: Quantization, TensorFlow Lite
Frontend: React.js, React Native
Deployment: GCP (Google Cloud Platform), GCF (Google Cloud Functions)

##Installation
##Prerequisites

Ensure you have the following installed:

Python 3.x
Required dependencies (install using the command below)

##Setup

Clone the repository by running git clone followed by your repository link, then navigate into the project directory using cd ecodetect.
Install dependencies by running pip install -r requirements.txt.
Start the backend server by running python3 server.py.
Open the frontend in your browser or mobile emulator.

##Usage

Send an image via an HTTP request to the backend API.
The API returns the predicted classification along with a confidence score.

Example API request using cURL:
Use curl -X POST -F "file=@image.jpg" http://localhost:5000/predict to send an image to the API.

Example response:
The API responds with a JSON object containing the classification and confidence score, such as:
classification: "Target Spot", confidence: 97.8

##Contributors

Harsh Patel