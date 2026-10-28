export type ModelKey = 'vggnet' | 'googlenet' | 'resnet';

export interface ModelInfo {
  key: ModelKey;
  name: string;
  fullName: string;
  description: string;
  color: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    trainingTime: string;
    trainingMinutes: number;
  };
}

export const models: ModelInfo[] = [
  {
    key: 'vggnet',
    name: 'VGGNet',
    fullName: 'VGG-16',
    description:
      'Simple and strong CNN baseline using repeated convolutional layers with small 3×3 filters.',
    color: '#3b82f6',
    metrics: {
      accuracy: 91.2,
      precision: 89.8,
      recall: 94.1,
      f1Score: 91.9,
      rocAuc: 95.3,
      trainingTime: '12 min',
      trainingMinutes: 12,
    },
  },
  {
    key: 'googlenet',
    name: 'GoogLeNet',
    fullName: 'GoogLeNet (Inception v1)',
    description:
      'Uses inception modules to extract features at multiple scales efficiently while keeping the model light.',
    color: '#14b8a6',
    metrics: {
      accuracy: 92.7,
      precision: 91.4,
      recall: 94.8,
      f1Score: 93.1,
      rocAuc: 96.1,
      trainingTime: '9 min',
      trainingMinutes: 9,
    },
  },
  {
    key: 'resnet',
    name: 'ResNet',
    fullName: 'ResNet-50',
    description:
      'Uses residual (skip) connections to train much deeper networks and improve feature learning.',
    color: '#6366f1',
    metrics: {
      accuracy: 94.5,
      precision: 93.6,
      recall: 96.2,
      f1Score: 94.9,
      rocAuc: 97.4,
      trainingTime: '11 min',
      trainingMinutes: 11,
    },
  },
];

export const getModelByKey = (key: ModelKey): ModelInfo =>
  models.find((m) => m.key === key) ?? models[0];
