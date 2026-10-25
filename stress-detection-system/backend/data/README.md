# 📊 NeuroPulse Dataset Directory

This directory contains training, evaluation, and test datasets for the autonomic stress classification pipeline.

---

## 📁 Directory Structure

```
backend/data/
├── README.md                     # Dataset documentation and download instructions
├── sample_train_dataset.csv      # Lightweight sample dataset for rapid verification
├── sample_test_dataset.csv       # Lightweight test dataset for pipeline validation
├── raw/                          # (Optional) Full raw biometric datasets (git-ignored)
│   └── hrv_dataset/              # SWELL-KW / PPG / HRV raw training CSVs
└── processed/                    # (Optional) Preprocessed feature sets (git-ignored)
```

---

## 🚀 Quick Start (Pre-Trained Models)

The repository includes pre-calibrated, ready-to-run models in `backend/saved_models/`:
- `random_forest_model.joblib` (150 estimators, balanced via SMOTE)
- `svm_model.joblib` (RBF kernel with Platt probability scaling)
- `scaler.joblib` (StandardScaler fitted on physiological feature space)

You do **not** need to download the full ~800MB raw dataset to run or test the system. The backend will load and perform real-time inference immediately out of the box.

---

## 🔬 Downloading the Full Dataset for Retraining

If you wish to retrain the classifiers from scratch on the complete physiological dataset:

1. **Source Dataset**: SWELL-KW (Stress and Workload Dataset) / HRV Physiological Corpus.
   - Reference: *Koldijk et al., "The SWELL Knowledge Work Dataset for Stress and User Modeling Research"*.
2. Download the `train.csv` and `test.csv` files.
3. Place them in:
   ```
   backend/data/raw/hrv_dataset/train.csv
   backend/data/raw/hrv_dataset/test.csv
   ```
4. Execute the training pipeline:
   ```bash
   python -m app.ml.train_on_hrv_dataset
   ```

The updated weights and evaluation metrics will be written to `backend/saved_models/`.
