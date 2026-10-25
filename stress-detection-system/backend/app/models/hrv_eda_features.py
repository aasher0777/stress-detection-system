from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class HrvEdaFeatures(BaseModel):
    """
    Extracted feature vector computed over a temporal sliding window (e.g. 30s or 60s).
    """
    subject_id: str
    window_start: datetime
    window_end: datetime
    
    # Heart Rate Variability (Time-Domain)
    mean_hr: float = Field(..., description="Average heart rate (BPM)")
    mean_rr: float = Field(..., description="Average RR / IBI duration (ms)")
    sdnn: float = Field(..., description="Standard deviation of NN/RR intervals (ms)")
    rmssd: float = Field(..., description="Root mean square of successive differences (ms)")
    pnn50: float = Field(..., description="Percentage of successive RR intervals differing by >50ms (%)")
    
    # Heart Rate Variability (Frequency-Domain via Spectral Analysis)
    vlf_power: Optional[float] = Field(0.0, description="Very Low Frequency power (0.0033 - 0.04 Hz)")
    lf_power: float = Field(..., description="Low Frequency power (0.04 - 0.15 Hz)")
    hf_power: float = Field(..., description="High Frequency power (0.15 - 0.40 Hz)")
    lf_hf_ratio: float = Field(..., description="Sympathovagal balance ratio (LF / HF)")
    
    # Electrodermal Activity (Tonic & Phasic components)
    eda_mean: float = Field(..., description="Mean skin conductance level (uS)")
    eda_scl: float = Field(..., description="Tonic Skin Conductance Level baseline")
    eda_scr_peaks: int = Field(..., description="Count of discrete Phasic Skin Conductance Responses")
    eda_scr_amplitude: float = Field(..., description="Mean peak amplitude of SCR responses")
    
    # Skin Temperature Dynamics
    temp_mean: float = Field(..., description="Mean peripheral skin temperature (C)")
    temp_slope: float = Field(..., description="Temperature rate of change / gradient (C/min)")
