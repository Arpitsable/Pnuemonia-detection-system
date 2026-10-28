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
  disclaimer?: string;
}

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_URL = RAW_API_URL.replace(/\/$/, '');

export async function predictXRay(
  file: File,
  modelKey: ModelKey,
  modelName: string,
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

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
    modelName: data.model || modelName,
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
  // Add realistic simulated processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Determine prediction based on filename or pseudo-random hash
  const lowerName = file.name.toLowerCase();
  let isPneumonia = true;
  if (lowerName.includes('normal') || lowerName.includes('healthy')) {
    isPneumonia = false;
  } else if (lowerName.includes('pneumonia') || lowerName.includes('bacteria') || lowerName.includes('virus')) {
    isPneumonia = true;
  } else {
    // Hash file name for consistent demo result per file
    let hash = 0;
    for (let i = 0; i < file.name.length; i++) {
      hash = (hash << 5) - hash + file.name.charCodeAt(i);
      hash |= 0;
    }
    isPneumonia = Math.abs(hash) % 2 === 0;
  }

  const baseConfidence = 92 + Math.random() * 6; // 92% to 98%
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
