from collections import deque
from typing import Dict, List, Optional
from ..models.sensor_data import SensorData
from ..hardware.signal_preprocessor import SignalPreprocessor
from ..repositories.telemetry_repository import telemetry_repo

class DataPipelineService:
    """
    Buffers real-time multi-channel sensor streams and triggers preprocessing / windowing.
    Supports configurable window duration (e.g., 30s, 60s, 300s baseline calculation).
    """
    def __init__(self, window_size: int = 60, sampling_rate_hz: float = 4.0):
        self.sampling_rate_hz = sampling_rate_hz
        self.window_duration_seconds = 60
        self.window_size = int(self.window_duration_seconds * self.sampling_rate_hz)
        # Map of subject_id -> deque of SensorData
        self.buffers: Dict[str, deque] = {}
        self.preprocessor = SignalPreprocessor(sampling_rate_hz=self.sampling_rate_hz)

    def set_window_duration(self, seconds: int) -> int:
        self.window_duration_seconds = max(10, min(600, seconds))
        self.window_size = int(self.window_duration_seconds * self.sampling_rate_hz)
        # Resize all active deques
        for subj in self.buffers:
            old_samples = list(self.buffers[subj])
            self.buffers[subj] = deque(old_samples, maxlen=self.window_size)
        return self.window_duration_seconds

    def ingest_sample(self, sample: SensorData) -> None:
        """
        Pushes an incoming sample into the subject's FIFO buffer.
        """
        subj = sample.subject_id
        if subj not in self.buffers:
            self.buffers[subj] = deque(maxlen=self.window_size)
        self.buffers[subj].append(sample)

    def get_window(self, subject_id: str) -> Optional[List[SensorData]]:
        """
        Returns buffered samples if enough have accumulated for feature calculation.
        """
        if subject_id in self.buffers and len(self.buffers[subject_id]) >= 10:
            return list(self.buffers[subject_id])
        return None

    def clear_buffer(self, subject_id: str) -> None:
        if subject_id in self.buffers:
            self.buffers[subject_id].clear()

data_pipeline_service = DataPipelineService()
