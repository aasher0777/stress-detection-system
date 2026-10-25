"""
Model Training & Evaluation Pipeline for NeuroPulse Stress Detection System.
Reads train/test CSV data from backend/data/, applies SMOTE class balancing,
trains both Random Forest and SVM classifiers, evaluates metrics,
and saves model weights to backend/saved_models/.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Ensure app package is importable
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)

from app.ml.smote_oversampler import SmoteOversampler
from app.ml.svm_classifier import SvmClassifier
from app.ml.random_forest_classifier import RandomForestClassifier

DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODEL_DIR, exist_ok=True)

FEATURE_COLS = [
    "mean_hr", "rmssd", "sdnn", "pnn50", "lf_hf_ratio",
    "eda_mean", "eda_scl", "eda_scr_peaks", "temp_mean", "temp_slope"
]

def load_dataset(filename: str) -> pd.DataFrame:
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset file not found at: {path}")
    df = pd.read_csv(path)
    print(f"[*] Loaded {len(df)} samples from {filename}")
    return df

def train_and_evaluate(train_file="sample_train_dataset.csv", test_file="sample_test_dataset.csv"):
    print("=" * 70)
    print("🧠 NEUROPULSE: MODEL TRAINING & EVALUATION PIPELINE")
    print(f"Data Directory: {DATA_DIR}")
    print("=" * 70)

    # 1. Load Data
    train_df = load_dataset(train_file)
    test_df = load_dataset(test_file)

    X_train = train_df[FEATURE_COLS].values
    y_train = train_df["label"].values

    X_test = test_df[FEATURE_COLS].values
    y_test = test_df["label"].values

    print("\n[1] Class distribution before SMOTE:")
    unique, counts = np.unique(y_train, return_counts=True)
    for cls_name, count in zip(unique, counts):
        print(f"    - {cls_name}: {count} samples")

    # 2. Apply SMOTE to handle class imbalance
    print("\n[2] Applying SMOTE oversampling to training set...")
    oversampler = SmoteOversampler(k_neighbors=2, random_state=42)
    X_train_res, y_train_res = oversampler.fit_resample(X_train, y_train)

    unique_res, counts_res = np.unique(y_train_res, return_counts=True)
    print("[*] Post-SMOTE balanced distribution:")
    for cls_name, count in zip(unique_res, counts_res):
        print(f"    - {cls_name}: {count} samples")

    # 3. Train Random Forest
    print("\n[3] Training Random Forest Ensemble...")
    rf = RandomForestClassifier()
    rf.train(X_train_res, y_train_res)
    rf_preds = rf.model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    print(f"[*] Random Forest Test Accuracy: {rf_acc * 100:.2f}%")
    print(classification_report(y_test, rf_preds, zero_division=0))

    # 4. Train SVM (RBF)
    print("[4] Training Support Vector Machine (RBF Kernel)...")
    svm = SvmClassifier()
    svm.train(X_train_res, y_train_res)
    X_test_scaled = svm.scaler.transform(X_test)
    svm_preds = svm.model.predict(X_test_scaled)
    svm_acc = accuracy_score(y_test, svm_preds)
    print(f"[*] SVM Test Accuracy: {svm_acc * 100:.2f}%")
    print(classification_report(y_test, svm_preds, zero_division=0))

    # 5. Persist Checkpoints
    rf_path = os.path.join(MODEL_DIR, "random_forest_model.joblib")
    svm_path = os.path.join(MODEL_DIR, "svm_model.joblib")
    scaler_path = os.path.join(MODEL_DIR, "scaler.joblib")

    joblib.dump(rf.model, rf_path)
    joblib.dump(svm.model, svm_path)
    joblib.dump(svm.scaler, scaler_path)

    print(f"\n[5] Model weights saved to: {MODEL_DIR}")
    print(f"    - {rf_path}")
    print(f"    - {svm_path}")
    print(f"    - {scaler_path}")
    print("=" * 70)
    print("✅ TRAINING & PERSISTENCE COMPLETE!")
    print("=" * 70)

if __name__ == "__main__":
    train_and_evaluate()
