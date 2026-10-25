import numpy as np
from typing import Dict, Tuple
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from ..models.hrv_eda_features import HrvEdaFeatures
from ..models.stress_state import StressLevel

class SvmClassifier:
    """
    Support Vector Machine classifier utilizing a Radial Basis Function (RBF) kernel
    with probabilistic outputs (Platt scaling) for acute stress classification.
    """
    def __init__(self, C: float = 1.0, gamma: str = 'scale'):
        self.scaler = StandardScaler()
        self.model = SVC(C=C, gamma=gamma, kernel='rbf', probability=True, random_state=42)
        self.is_trained = False
        self.classes_ = [StressLevel.BASELINE.value, StressLevel.LOW_STRESS.value, StressLevel.HIGH_STRESS.value]
        self._bootstrap_default_model()

    def _feature_vector(self, f: HrvEdaFeatures) -> np.ndarray:
        return np.array([
            f.mean_hr,
            f.rmssd,
            f.sdnn,
            f.pnn50,
            f.lf_hf_ratio,
            f.eda_mean,
            f.eda_scl,
            float(f.eda_scr_peaks),
            f.temp_mean,
            f.temp_slope
        ], dtype=float)

    def _bootstrap_default_model(self):
        """
        Loads pre-trained market-ready SVM weights if available,
        otherwise initializes bootstrap weights.
        """
        import os
        import joblib
        base_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "saved_models"
        )
        svm_path = os.path.join(base_path, "svm_model.joblib")
        scaler_path = os.path.join(base_path, "scaler.joblib")

        if os.path.exists(svm_path) and os.path.exists(scaler_path):
            try:
                self.model = joblib.load(svm_path)
                self.scaler = joblib.load(scaler_path)
                self.is_trained = True
                self.classes_ = list(self.model.classes_)
                print(f"[*] Loaded market-ready SVM weights from: {svm_path}")
                return
            except Exception as e:
                print(f"[!] Warning: Could not load saved SVM model: {e}")

        np.random.seed(42)
        # Synthetic baseline (Calm: high HRV, low EDA, warm skin)
        baseline = np.random.normal([68, 48, 55, 25, 1.2, 2.0, 1.8, 1.0, 34.0, 0.02], [4, 8, 8, 5, 0.3, 0.5, 0.4, 0.8, 0.3, 0.01], (40, 10))
        # Synthetic low stress (Mild arousal)
        low_stress = np.random.normal([78, 32, 38, 12, 2.1, 4.5, 3.8, 3.5, 33.2, -0.02], [5, 6, 6, 4, 0.4, 0.8, 0.6, 1.2, 0.4, 0.02], (35, 10))
        # Synthetic high stress (Acute stress: depressed HRV, elevated EDA, vasoconstriction drop)
        high_stress = np.random.normal([92, 18, 22, 3, 3.8, 8.2, 7.1, 6.5, 31.8, -0.08], [6, 4, 5, 2, 0.6, 1.2, 1.0, 1.8, 0.5, 0.03], (30, 10))

        X = np.vstack([baseline, low_stress, high_stress])
        y = np.array(
            [StressLevel.BASELINE.value] * 40 +
            [StressLevel.LOW_STRESS.value] * 35 +
            [StressLevel.HIGH_STRESS.value] * 30
        )

        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True

    def train(self, X: np.ndarray, y: np.ndarray):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True

    def predict(self, features: HrvEdaFeatures) -> Tuple[StressLevel, float, Dict[str, float]]:
        vec = self._feature_vector(features).reshape(1, -1)
        vec_scaled = self.scaler.transform(vec)
        probs = self.model.predict_proba(vec_scaled)[0]
        pred_label = self.model.classes_[np.argmax(probs)]
        confidence = float(np.max(probs))

        prob_dict = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(self.model.classes_, probs)
        }
        return StressLevel(pred_label), confidence, prob_dict
