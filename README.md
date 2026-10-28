# 🫁 Chest X-Ray Pneumonia Detection System

[![Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-FF6F00?style=for-the-badge&logo=tensorflow)](https://tensorflow.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

An end-to-end deep learning web application for automated detection of pneumonia from chest X-ray radiographs. Built with a modern **React + TypeScript + Tailwind CSS** frontend ready for **Vercel** deployment and a high-performance **FastAPI + TensorFlow (DenseNet121)** backend.

---

## ✨ Features

- **Deep Learning Inference**: Powered by a fine-tuned DenseNet121 convolutional neural network with transfer learning.
- **High Classification Accuracy**: Achieves ~95% test accuracy on chest X-ray validation benchmarks.
- **Vercel-Ready Frontend**: Pre-configured with `vercel.json` for single-page application (SPA) routing and zero-configuration deployments.
- **Dual Mode (Live & Demo Preview)**:
  - **Live Backend Mode**: Communicates directly with the trained FastAPI model service.
  - **Demo Preview Mode**: Allows instant testing and UI evaluation on Vercel even before spinning up the Python backend.
- **Interactive Model Comparison**: Explore benchmark metrics across multiple architectures:
  - **DenseNet121** (Trained production model)
  - **ResNet-50**
  - **GoogLeNet / Inception v1**
  - **VGG-16**
- **Responsive Medical UI**: Clean, accessible, clinician-inspired interface featuring drag-and-drop upload, image previews, confidence visualizations, and detailed diagnostic breakdowns.

---

## 📁 Repository Structure

```text
├── api/
│   ├── index.py                     # Vercel Serverless Function (FastAPI + ONNX Runtime)
│   ├── requirements.txt             # Lightweight dependencies for Vercel (<100MB)
│   └── models/
│       ├── chest_xray_model.onnx    # High-speed ONNX format of the trained DenseNet121 model
│       └── class_names.json         # Label mapping (["NORMAL", "PNEUMONIA"])
│
├── Backend/
│   ├── models/
│   │   ├── chest_xray_model.keras   # Trained Keras model weights
│   │   ├── class_names.json         # Label mapping
│   │   ├── training_log.csv         # Training epochs, loss, and accuracy history
│   │   └── README.md                # Model specifications & training hyperparameters
│   ├── api.py                       # Local FastAPI prediction service (TensorFlow)
│   ├── train_model.py               # Model training and evaluation script
│   └── requirements.txt             # Full Python dependencies (TensorFlow, Scikit-learn)
│
├── public/
│   └── favicon.svg                  # Project icon
├── src/
│   ├── components/                  # UI components (UploadBox, ResultCard, Navbar, etc.)
│   ├── data/                        # Model definitions and prediction services
│   ├── pages/                       # Home, Upload, Comparison, and About pages
│   ├── App.tsx                      # Root application & routing
│   └── main.tsx                     # React entrypoint
│
├── .env.example                     # Environment template for frontend
├── .gitignore                       # Clean Git rules (excludes heavy datasets & venvs)
├── index.html                       # HTML template
├── package.json                     # NPM dependencies & build scripts
├── requirements.txt                 # Serverless dependencies for Vercel
├── tailwind.config.js               # Tailwind styling configuration
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel deployment & API rewrite configuration
├── vite.config.ts                   # Vite bundler & local dev proxy configuration
└── README.md                        # Documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **npm** or **pnpm** / **yarn**

---

### 1. Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python api.py
```

The API will start at:
- **Server**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

---

### 2. Frontend Setup

In a new terminal window:

```bash
# From the project root
npm install

# Start the Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser. The frontend will automatically detect the local backend at `http://localhost:8000`.

---

## ☁️ Deploying to Vercel (Full-Stack: Frontend + Serverless Backend)

This repository is **100% full-stack ready for Vercel**. When imported into Vercel, both the React frontend and the FastAPI/ONNX serverless backend deploy automatically without any separate servers required!

### Step 1: Import Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `Arpitsable/Pnuemonia-detection-system`.

### Step 2: Zero Configuration Needed
Vercel automatically detects the configuration from `vercel.json`:
- **Framework Preset**: Vite
- **Frontend SPA**: Serves `dist/` with client routing.
- **Backend API**: Automatically runs `api/index.py` on Vercel Serverless Functions with ONNX Runtime.

### Step 3: Deploy
Click **Deploy**. Your entire system (frontend + AI prediction backend) is now live online!

*(Optional: If you ever want to point to a custom external backend, you can set the `VITE_API_URL` environment variable in Vercel Project Settings).*

---

## 🌐 Deploying the FastAPI Backend (Cloud Options)

Because TensorFlow models require dedicated Python runtime environments, you can host the `Backend/` folder on any of these free or low-cost services:

### Option A: Render.com (Web Service)
- **Root Directory**: `Backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`

### Option B: Railway.app
- Deploy from GitHub repository → Set root to `Backend` → Start command: `python api.py`.

### Option C: Hugging Face Spaces (Docker / Gradio / FastAPI)
- Create a new Space with FastAPI / Docker SDK and push the `Backend/` directory.

After deploying the backend, set `VITE_API_URL` in your Vercel project settings to connect frontend and backend.

---

## 🧠 Model Architecture & Training

- **Backbone**: DenseNet121 with pre-trained ImageNet feature extractors
- **Head**: Global Average Pooling 2D → Dropout(0.3) → Dense(2, Softmax)
- **Input Resolution**: 224 × 224 × 3 RGB
- **Classes**: `NORMAL` (0), `PNEUMONIA` (1)
- **Optimizer**: Adam (`learning_rate=0.001`)
- **Loss**: Sparse Categorical Crossentropy

### Retraining the Model
To retrain with the Kaggle Chest X-Ray dataset:
1. Download the [Kaggle Chest X-Ray Images (Pneumonia) Dataset](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia).
2. Place the dataset folders into `Backend/Dataset/chest_xray/` (with `train`, `val`, and `test` subdirectories).
3. Run the training pipeline:
   ```bash
   cd Backend
   python train_model.py
   ```
4. Checkpoints and evaluation reports will be saved directly into `Backend/models/`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, React Router 7
- **Tooling**: Vite 7, PostCSS, ESLint
- **Backend**: FastAPI, Uvicorn, Python 3.10+
- **Machine Learning**: TensorFlow 2.15, Keras, NumPy, Pillow, Scikit-learn
- **Hosting**: Vercel (Frontend), Render / Railway / Local (Backend)

---

## ⚠️ Medical Disclaimer

This project is intended solely for **educational, academic, and research purposes**. It is not a certified diagnostic device, medical software, or clinical decision support tool. Output predictions should never replace consultation with a qualified medical professional or certified radiologist.

---

## 👤 Author

**Arpit Sable**
- GitHub: [@Arpitsable](https://github.com/Arpitsable)
- Repository: [Pnuemonia-detection-system](https://github.com/Arpitsable/Pnuemonia-detection-system)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

