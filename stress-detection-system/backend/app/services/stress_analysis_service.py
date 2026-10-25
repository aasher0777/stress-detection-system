from datetime import datetime
from typing import Optional
from ..models.sensor_data import SensorData
from ..models.stress_state import StressState, StressLevel
from ..ml.feature_extractor import FeatureExtractor
from ..ml.svm_classifier import SvmClassifier
from ..ml.random_forest_classifier import RandomForestClassifier
from ..repositories.telemetry_repository import telemetry_repo
from ..config.websocket_config import websocket_manager
from .data_pipeline_service import data_pipeline_service

class StressAnalysisService:
    """
    Coordinates real-time signal analysis:
    - Buffers sensor samples
    - Runs FeatureExtractor
    - Dispatches to active ML Classifier (Random Forest or SVM)
    - Triggers biofeedback alerts
    - Broadcasts results to subscribed WebSocket frontends
    """
    def __init__(self):
        self.feature_extractor = FeatureExtractor(sampling_rate_hz=4.0)
        self.rf_classifier = RandomForestClassifier()
        self.svm_classifier = SvmClassifier()
        self.active_classifier_name = "random_forest"
        self.latest_state: Optional[StressState] = None

    def set_classifier(self, name: str):
        if name in ["random_forest", "svm"]:
            self.active_classifier_name = name

    async def process_telemetry(self, sample: SensorData) -> Optional[StressState]:
        # 1. Ingest into sliding window buffer
        data_pipeline_service.ingest_sample(sample)
        
        # Save sample asynchronously
        await telemetry_repo.save_sensor_data(sample)

        # 2. Check if window has enough samples for inference
        window = data_pipeline_service.get_window(sample.subject_id)
        if not window:
            # Not enough history yet, still broadcast raw sensor telemetry
            await websocket_manager.broadcast({
                "type": "TELEMETRY_FRAME",
                "data": sample.model_dump(mode="json")
            })
            return None

        # 3. Extract HRV and EDA feature representations
        features = self.feature_extractor.extract(window)

        # 4. Perform ML Inference
        if self.active_classifier_name == "svm":
            pred_level, conf, probs = self.svm_classifier.predict(features)
        else:
            pred_level, conf, probs = self.rf_classifier.predict(features)

        # 5. Alert & Recommendation Logic
        alert = pred_level == StressLevel.HIGH_STRESS and conf >= 0.70
        rec = None
        if pred_level == StressLevel.HIGH_STRESS:
            rec = "High sympathetic arousal detected. Initiating 4-7-8 diaphragmatic breathing sequence."
        elif pred_level == StressLevel.LOW_STRESS:
            rec = "Mild cognitive load observed. Recommended posture adjustment & hydration."

        state = StressState(
            subject_id=sample.subject_id,
            timestamp=datetime.utcnow(),
            stress_level=pred_level,
            confidence=conf,
            classifier_used=self.active_classifier_name,
            probabilities=probs,
            alert_triggered=alert,
            recommendation=rec
        )
        self.latest_state = state

        # 6. Persist state
        await telemetry_repo.save_stress_state(state)

        # 7. Broadcast via WebSocket
        await websocket_manager.broadcast({
            "type": "STRESS_UPDATE",
            "telemetry": sample.model_dump(mode="json"),
            "features": features.model_dump(mode="json"),
            "state": state.model_dump(mode="json")
        })

        return state

stress_analysis_service = StressAnalysisService()
