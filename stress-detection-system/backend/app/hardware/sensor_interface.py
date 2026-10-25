import asyncio
import math
import random
from abc import ABC, abstractmethod
from datetime import datetime
from typing import AsyncGenerator, Optional
from ..models.sensor_data import SensorData

class SensorInterface(ABC):
    """
    Abstract hardware interface for physical or virtual bio-signal telemetry capture.
    """
    @abstractmethod
    async def connect(self) -> bool:
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        pass

    @abstractmethod
    async def stream_telemetry(self) -> AsyncGenerator[SensorData, None]:
        pass

class VirtualTelemetryGenerator(SensorInterface):
    """
    Synthetic physiological telemetry generator mimicking wearable bio-sensors (e.g., Empatica E4, Shimmer).
    Dynamically modulates between calm baseline and acute sympathetic arousal states.
    """
    def __init__(self, subject_id: str = "SUBJ-001", sampling_rate_hz: int = 4):
        self.subject_id = subject_id
        self.sampling_rate_hz = sampling_rate_hz
        self.is_running = False
        self.current_stress_bias = 0.0 # 0.0 = relaxed, 1.0 = stressed
        self._step = 0

    async def connect(self) -> bool:
        self.is_running = True
        return True

    async def disconnect(self) -> None:
        self.is_running = False

    def set_stress_bias(self, bias: float):
        """Allows test harness to inject stress surges (0.0 to 1.0)."""
        self.current_stress_bias = max(0.0, min(1.0, bias))

    async def stream_telemetry(self) -> AsyncGenerator[SensorData, None]:
        delay = 1.0 / self.sampling_rate_hz
        while self.is_running:
            self._step += 1
            # Periodic wave with subtle random walk + injected stress bias
            drift = math.sin(self._step * 0.05) * 0.2
            stress_factor = self.current_stress_bias + drift
            stress_factor = max(0.0, min(1.0, stress_factor))

            # Stress elevates HR and decreases HRV (RMSSD/RR intervals)
            base_hr = 68.0 + (stress_factor * 32.0) + random.uniform(-2.0, 2.0)
            rr_interval = (60000.0 / base_hr) + random.uniform(-15.0, 15.0)

            # Stress dramatically increases Electrodermal Activity (GSR)
            eda_val = 1.5 + (stress_factor * 9.5) + (random.random() * 0.4 if random.random() > 0.85 else 0.0)

            # Peripheral vasoconstriction causes finger skin temperature to drop under stress
            skin_temp = 34.2 - (stress_factor * 2.8) + random.uniform(-0.1, 0.1)

            data = SensorData(
                subject_id=self.subject_id,
                timestamp=datetime.utcnow(),
                heart_rate=round(base_hr, 2),
                bvp=round(math.sin(self._step * 0.8) * 0.8, 3),
                eda=round(eda_val, 3),
                temperature=round(skin_temp, 2),
                ibi=round(rr_interval, 2),
                device_id="VIRTUAL-BIO-SENSOR-E4"
            )
            yield data
            await asyncio.sleep(delay)
