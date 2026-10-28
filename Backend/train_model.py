
from pathlib import Path
import json

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, CSVLogger
)
from sklearn.metrics import classification_report, confusion_matrix

# Paths for dataset and model output.
BACKEND_DIR = Path(__file__).resolve().parent
candidates = [
    BACKEND_DIR / "Dataset" / "chest_xray" / "chest_xray",
    BACKEND_DIR / "Dataset" / "chest_xray",
    BACKEND_DIR.parent / "Dataset" / "chest_xray" / "chest_xray",
    BACKEND_DIR.parent / "Backend" / "Dataset" / "chest_xray" / "chest_xray",
]
DATA_DIR = next((p for p in candidates if (p / "train").is_dir()), candidates[0])
OUT_DIR = BACKEND_DIR / "models"
OUT_DIR.mkdir(parents=True, exist_ok=True)

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 10
SEED = 42

# Verify the three dataset splits.
for split in ("train", "val", "test"):
    if not (DATA_DIR / split).is_dir():
        raise FileNotFoundError(f"Missing: {DATA_DIR / split}")

train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "train",
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=True,
    seed=SEED,
)

class_names = train_ds.class_names
print("Classes:", class_names)

if len(class_names) != 2:
    raise ValueError(f"Expected 2 classes, found: {class_names}")

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "val",
    class_names=class_names,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=False,
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "test",
    class_names=class_names,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=False,
)

# Match DenseNet121's required input preprocessing.
AUTOTUNE = tf.data.AUTOTUNE

def prepare(images, labels):
    images = preprocess_input(tf.cast(images, tf.float32))
    return images, labels

train_ds = train_ds.map(prepare).prefetch(AUTOTUNE)
val_ds = val_ds.map(prepare).prefetch(AUTOTUNE)
test_ds = test_ds.map(prepare).prefetch(AUTOTUNE)

# Load pretrained features and freeze them for initial training.
base = DenseNet121(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3),
)
base.trainable = False

inputs = layers.Input(shape=(224, 224, 3))
x = base(inputs, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(len(class_names), activation="softmax")(x)
model = Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

callbacks = [
    ModelCheckpoint(
        str(OUT_DIR / "best_model.keras"),
        monitor="val_loss",
        save_best_only=True,
        verbose=1,
    ),
    EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True,
        verbose=1,
    ),
    CSVLogger(str(OUT_DIR / "training_log.csv")),
]

# Train on real images.
model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=callbacks,
)

# Load the best validation checkpoint for evaluation.
model = tf.keras.models.load_model(OUT_DIR / "best_model.keras")

loss, accuracy = model.evaluate(test_ds, verbose=1)
print(f"\nTest loss: {loss:.4f}")
print(f"Test accuracy: {accuracy:.4f}")

y_true = np.concatenate([y.numpy() for _, y in test_ds])
probs = model.predict(test_ds, verbose=1)
y_pred = np.argmax(probs, axis=1)

print(classification_report(
    y_true,
    y_pred,
    labels=list(range(len(class_names))),
    target_names=class_names,
    zero_division=0,
))
print("Confusion matrix:")
print(confusion_matrix(y_true, y_pred))

model.save(OUT_DIR / "chest_xray_model.keras")
with open(OUT_DIR / "class_names.json", "w") as f:
    json.dump(class_names, f, indent=2)

print("\nTraining finished.")
print("Saved model:", OUT_DIR / "chest_xray_model.keras")
print("Saved labels:", OUT_DIR / "class_names.json")
