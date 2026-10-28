# Trained Models

This folder contains the trained deep learning weights and evaluation artifacts for the Pneumonia Detection System.

## Architecture
- **Base Network**: DenseNet121 (pre-trained on ImageNet)
- **Top Layers**: GlobalAveragePooling2D → Dropout(0.3) → Dense(2, activation='softmax')
- **Input Size**: 224 × 224 × 3 RGB
- **Classes**: `["NORMAL", "PNEUMONIA"]`
- **Optimizer**: Adam (learning rate = 0.001)
- **Loss**: Sparse Categorical Crossentropy

## Files
- `chest_xray_model.keras`: Trained TensorFlow/Keras DenseNet121 model (~95% accuracy).
- `class_names.json`: Classification labels (`NORMAL`, `PNEUMONIA`).
- `training_log.csv`: Training and validation loss/accuracy across epochs.
