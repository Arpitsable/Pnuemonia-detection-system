import io
import json
import os
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent

# Check potential model locations
MODEL_CANDIDATES = [
    BASE_DIR / "models" / "chest_xray_model.onnx",
    BASE_DIR.parent / "Backend" / "models" / "chest_xray_model.onnx",
    BASE_DIR / "chest_xray_model.onnx",
]

LABELS_CANDIDATES = [
    BASE_DIR / "models" / "class_names.json",
    BASE_DIR.parent / "Backend" / "models" / "class_names.json",
    BASE_DIR / "class_names.json",
]

MODEL_PATH = next((p for p in MODEL_CANDIDATES if p.is_file()), None)
LABELS_PATH = next((p for p in LABELS_CANDIDATES if p.is_file()), None)

CLASS_NAMES = ["NORMAL", "PNEUMONIA"]
if LABELS_PATH and LABELS_PATH.is_file():
    try:
        with LABELS_PATH.open("r") as f:
            CLASS_NAMES = json.load(f)
    except Exception as e:
        print(f"Warning: could not read labels from {LABELS_PATH}: {e}")

session = None
input_name = None
output_name = None

def get_session():
    global session, input_name, output_name
    if session is None:
        if not MODEL_PATH or not MODEL_PATH.is_file():
            raise FileNotFoundError(f"ONNX model file not found in candidates: {MODEL_CANDIDATES}")
        # Configure inference session
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 2
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        session = ort.InferenceSession(str(MODEL_PATH), sess_options=opts)
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
    return session, input_name, output_name

# Initialize session on startup
try:
    get_session()
    print(f"Loaded ONNX model from {MODEL_PATH}")
except Exception as e:
    print(f"Deferring session initialization: {e}")

app = FastAPI(
    title="Chest X-Ray Pneumonia Detection Serverless API",
    description="Vercel Serverless Function running fine-tuned DenseNet121 via ONNX Runtime",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def build_health_response():
    model_ready = False
    try:
        get_session()
        model_ready = True
    except Exception:
        pass
    return {
        "status": "ready" if model_ready else "error",
        "model_loaded": model_ready,
        "classes": CLASS_NAMES,
        "model": "DenseNet121",
        "runtime": "Vercel Serverless (ONNX)",
    }

@app.get("/")
@app.get("/api")
def root():
    return {
        "status": "online",
        "service": "Pneumonia Detection Serverless API",
        "model": "DenseNet121",
        "classes": CLASS_NAMES,
        "runtime": "Vercel Serverless",
    }

@app.get("/health")
@app.get("/api/health")
def health():
    return build_health_response()

async def process_predict(file: UploadFile):
    filename = (file.filename or "").lower()
    valid_exts = (".jpg", ".jpeg", ".png", ".webp")
    if file.content_type not in {
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/octet-stream",
    } and not any(filename.endswith(ext) for ext in valid_exts):
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

    # Preprocess image for DenseNet121:
    # Scale to [0, 1] then apply ImageNet standardization
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_array = np.asarray(image, dtype=np.float32) / 255.0
    img_array = (img_array - mean) / std
    img_array = np.expand_dims(img_array, axis=0)

    sess, in_name, out_name = get_session()
    raw_outputs = sess.run([out_name], {in_name: img_array})[0][0]

    probabilities = [float(p) for p in raw_outputs]
    predicted_index = int(np.argmax(probabilities))

    return {
        "predicted_class": CLASS_NAMES[predicted_index],
        "probabilities": {
            name: round(prob, 6)
            for name, prob in zip(CLASS_NAMES, probabilities)
        },
        "model": "DenseNet121",
        "runtime": "Vercel Serverless (ONNX)",
        "disclaimer": (
            "Experimental research output only; not a medical diagnosis."
        ),
    }

@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    return await process_predict(file)
