import type { ModelKey } from './models';

export interface PredictionResult {
  prediction: 'Pneumonia Detected' | 'Normal';
  isPneumonia: boolean;
  confidence: number;
  modelKey: ModelKey;
  modelName: string;
  fileName: string;
  uploadedAt: string;
  isDemo?: boolean;
}

interface ApiPredictionResponse {
  predicted_class: 'NORMAL' | 'PNEUMONIA';
  probabilities: Record<string, number>;
  model: string;
  runtime?: string;
  disclaimer?: string;
}

export const resolveApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, '');
  }

  // When deployed to production (e.g. Vercel) or when running on any remote host,
  // use the same-origin '/api' serverless endpoint.
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocal) {
      return '/api';
    }
  }

  // In local dev, use relative /api (proxied by Vite) or fallback to 127.0.0.1:8000
  return '/api';
};

export const API_URL = resolveApiBase();

export async function predictXRay(
  file: File,
  modelKey: ModelKey,
  modelName: string,
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const base = resolveApiBase();
  // Primary attempt using resolved base URL
  let response: Response;
  try {
    response = await fetch(`${base}/predict`, {
      method: 'POST',
      body: formData,
    });
  } catch (initialErr) {
    // If local proxy failed and base is '/api', fallback to direct localhost:8000
    if (base === '/api') {
      try {
        response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          body: formData,
        });
      } catch {
        throw initialErr;
      }
    } else {
      throw initialErr;
    }
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Prediction failed (${response.status}): ${message}`);
  }

  const data: ApiPredictionResponse = await response.json();

  const predictedClass = (data.predicted_class || '').trim().toUpperCase();
  if (predictedClass !== 'NORMAL' && predictedClass !== 'PNEUMONIA') {
    throw new Error('The prediction API returned an unexpected class.');
  }

  const isPneumonia = predictedClass === 'PNEUMONIA';
  const rawProb = data.probabilities?.[predictedClass] ?? 0.95;
  const confidence = Math.min(100, Math.max(0, rawProb * 100));

  return {
    prediction: isPneumonia ? 'Pneumonia Detected' : 'Normal',
    isPneumonia,
    confidence: Math.round(confidence * 10) / 10,
    modelKey,
    modelName: data.runtime ? `${data.model} (${data.runtime})` : data.model || modelName,
    fileName: file.name,
    uploadedAt: new Date().toLocaleString(),
    isDemo: false,
  };
}

export async function simulatePrediction(
  file: File,
  modelKey: ModelKey,
  modelName: string,
): Promise<PredictionResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerName = file.name.toLowerCase();
  let isPneumonia = true;
  if (lowerName.includes('normal') || lowerName.includes('healthy')) {
    isPneumonia = false;
  } else if (
    lowerName.includes('pneumonia') ||
    lowerName.includes('bacteria') ||
    lowerName.includes('virus')
  ) {
    isPneumonia = true;
  } else {
    let hash = 0;
    for (let i = 0; i < file.name.length; i++) {
      hash = (hash << 5) - hash + file.name.charCodeAt(i);
      hash |= 0;
    }
    isPneumonia = Math.abs(hash) % 2 === 0;
  }

  const baseConfidence = 92 + Math.random() * 6;
  const confidence = Math.round(baseConfidence * 10) / 10;

  return {
    prediction: isPneumonia ? 'Pneumonia Detected' : 'Normal',
    isPneumonia,
    confidence,
    modelKey,
    modelName: `${modelName} (Demo Mode)`,
    fileName: file.name,
    uploadedAt: new Date().toLocaleString(),
    isDemo: true,
  };
}
