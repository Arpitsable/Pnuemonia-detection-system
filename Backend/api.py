import io
import json
import os
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.densenet import preprocess_input

BASE_DIR = Path(__file__).resolve().parent

# Check standard models directory first, then fallback to nested directory if present
if (BASE_DIR / "models" / "chest_xray_model.keras").is_file():
    MODEL_DIR = BASE_DIR / "models"
elif (BASE_DIR / "Dataset" / "train_model" / "models" / "chest_xray_model.keras").is_file():
    MODEL_DIR = BASE_DIR / "Dataset" / "train_model" / "models"
else:
    MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "chest_xray_model.keras"
LABELS_PATH = MODEL_DIR / "class_names.json"

if not MODEL_PATH.is_file():
    raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

if not LABELS_PATH.is_file():
    raise FileNotFoundError(f"Class labels not found at: {LABELS_PATH}")

with LABELS_PATH.open("r") as f:
    CLASS_NAMES = json.load(f)

# Load the trained model once when the API starts.
print(f"Loading trained model from {MODEL_PATH}...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

app = FastAPI(
    title="Chest X-Ray Pneumonia Detection API",
    description="FastAPI service for DenseNet121 Chest X-Ray Pneumonia Classification",
    version="1.0.0",
)

# Configure CORS so Vercel frontend or local dev can access without blockage
origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "Pneumonia Detection API",
        "model": "DenseNet121",
        "classes": CLASS_NAMES,
    }


@app.get("/health")
def health():
    return {
        "status": "ready",
        "model_loaded": True,
        "classes": CLASS_NAMES,
        "model_path": str(MODEL_PATH.name),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in {
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/octet-stream",
    }:
        # Attempt to inspect by file extension if octet-stream
        filename = (file.filename or "").lower()
        if not any(filename.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]):
            raise HTTPException(
                status_code=415,
                detail="Upload a JPEG, PNG, or WebP image.",
            )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Image must be 10 MB or smaller.",
        )

    try:
        image = Image.open(io.BytesIO(contents))
        image = ImageOps.exif_transpose(image).convert("RGB")
        image = image.resize((224, 224))
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    # Match DenseNet121 preprocessing used during training.
    image_array = np.asarray(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)
    image_array = preprocess_input(image_array)

    probabilities = model.predict(image_array, verbose=0)[0]
    predicted_index = int(np.argmax(probabilities))

    return {
        "predicted_class": CLASS_NAMES[predicted_index],
        "probabilities": {
            name: round(float(prob), 6)
            for name, prob in zip(CLASS_NAMES, probabilities)
        },
        "model": "DenseNet121",
        "disclaimer": (
            "Experimental research output only; not a medical diagnosis."
        ),
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
