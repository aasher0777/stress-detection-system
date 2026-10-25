from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SensorData(BaseModel):
    """
    Represents an incoming frame of multi-modal physiological telemetry.
    """
    subject_id: str = Field(..., description="Subject or patient unique identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC sample timestamp")
    heart_rate: float = Field(..., ge=30.0, le=220.0, description="Instantaneous pulse rate in BPM")
    bvp: Optional[float] = Field(None, description="Blood Volume Pulse raw amplitude")
    eda: float = Field(..., ge=0.0, le=50.0, description="Electrodermal Activity / GSR in microSiemens (uS)")
    temperature: float = Field(..., ge=20.0, le=45.0, description="Peripheral skin temperature in Celsius")
    ibi: Optional[float] = Field(None, description="Inter-beat interval in milliseconds (RR interval)")
    device_id: Optional[str] = Field("DEVICE-SIM-01", description="Hardware capture device ID")

    class Config:
        json_schema_extra = {
            "example": {
                "subject_id": "SUBJ-1029",
                "timestamp": "2026-09-02T16:45:00Z",
                "heart_rate": 78.5,
                "bvp": 0.42,
                "eda": 4.15,
                "temperature": 32.8,
                "ibi": 764.3,
                "device_id": "EMPATICA-E4-VIRT"
            }
        }
