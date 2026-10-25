from enum import Enum
from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime

class StressLevel(str, Enum):
    BASELINE = "BASELINE"
    LOW_STRESS = "LOW_STRESS"
    HIGH_STRESS = "HIGH_STRESS"
    RECOVERY = "RECOVERY"

class StressState(BaseModel):
    """
    Evaluated acute stress classification payload.
    """
    subject_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    stress_level: StressLevel = Field(..., description="Categorical classified state")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model prediction probability")
    classifier_used: str = Field("random_forest", description="Active classifier algorithm ('random_forest' or 'svm')")
    probabilities: Dict[str, float] = Field(default_factory=dict, description="Multi-class probability distribution")
    alert_triggered: bool = Field(False, description="Flag indicates high sustained stress warning")
    recommendation: Optional[str] = Field(None, description="Guided biofeedback or relaxation suggestion")
