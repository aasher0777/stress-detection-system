import numpy as np
from typing import Dict, Tuple
from sklearn.ensemble import RandomForestClassifier as SklearnRF
from ..models.hrv_eda_features import HrvEdaFeatures
from ..models.stress_state import StressLevel

class RandomForestClassifier:
    """
    Random Forest ensemble model composed of bootstrap-aggregated decision trees.
    Provides robust non-linear boundaries and feature importances for stress diagnosis.
    """
    def __init__(self, n_estimators: int = 100, max_depth: int = 10):
        self.model = SklearnRF(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=42,
            class_weight='balanced'
        )
        self.is_trained = False
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
        Loads pre-trained market-ready model weights if available,
        otherwise initializes bootstrap weights.
        """
        import os
        import joblib
        saved_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "saved_models",
            "random_forest_model.joblib"
        )
        if os.path.exists(saved_path):
            try:
                self.model = joblib.load(saved_path)
                self.is_trained = True
                print(f"[*] Loaded market-ready Random Forest weights from: {saved_path}")
                return
            except Exception as e:
                print(f"[!] Warning: Could not load saved RF model: {e}")
        """
        Initializes the Random Forest with synthetic physiological feature vectors.
        """
        np.random.seed(42)
        baseline = np.random.normal([68, 48, 55, 25, 1.2, 2.0, 1.8, 1.0, 34.0, 0.02], [4, 8, 8, 5, 0.3, 0.5, 0.4, 0.8, 0.3, 0.01], (50, 10))
        low_stress = np.random.normal([78, 32, 38, 12, 2.1, 4.5, 3.8, 3.5, 33.2, -0.02], [5, 6, 6, 4, 0.4, 0.8, 0.6, 1.2, 0.4, 0.02], (45, 10))
        high_stress = np.random.normal([92, 18, 22, 3, 3.8, 8.2, 7.1, 6.5, 31.8, -0.08], [6, 4, 5, 2, 0.6, 1.2, 1.0, 1.8, 0.5, 0.03], (40, 10))

        X = np.vstack([baseline, low_stress, high_stress])
        y = np.array(
            [StressLevel.BASELINE.value] * 50 +
            [StressLevel.LOW_STRESS.value] * 45 +
            [StressLevel.HIGH_STRESS.value] * 40
        )

        self.model.fit(X, y)
        self.is_trained = True

    def train(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)
        self.is_trained = True

    def predict(self, features: HrvEdaFeatures) -> Tuple[StressLevel, float, Dict[str, float]]:
        vec = self._feature_vector(features).reshape(1, -1)
        probs = self.model.predict_proba(vec)[0]
        pred_label = self.model.classes_[np.argmax(probs)]
        confidence = float(np.max(probs))

        prob_dict = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(self.model.classes_, probs)
        }
        return StressLevel(pred_label), confidence, prob_dict
