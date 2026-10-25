import numpy as np
from datetime import datetime
from typing import List
from scipy import signal
from ..models.sensor_data import SensorData
from ..models.hrv_eda_features import HrvEdaFeatures

class FeatureExtractor:
    """
    Transforms raw physiological sensor series into statistical, time-domain,
    and frequency-domain features for stress classification models.
    """
    def __init__(self, sampling_rate_hz: float = 4.0):
        self.fs = sampling_rate_hz

    def extract(self, window_samples: List[SensorData]) -> HrvEdaFeatures:
        """
        Extracts biometric feature vector from a time window of SensorData samples.
        """
        if not window_samples:
            raise ValueError("Window samples cannot be empty")

        subject_id = window_samples[0].subject_id
        window_start = window_samples[0].timestamp
        window_end = window_samples[-1].timestamp

        hr_vals = np.array([s.heart_rate for s in window_samples], dtype=float)
        eda_vals = np.array([s.eda for s in window_samples], dtype=float)
        temp_vals = np.array([s.temperature for s in window_samples], dtype=float)
        
        # Collect RR / IBI intervals (derived from instantaneous HR or explicit IBI)
        rr_vals = np.array([
            s.ibi if s.ibi is not None else (60000.0 / s.heart_rate)
            for s in window_samples
        ], dtype=float)

        # 1. Time-Domain HRV Features
        mean_hr = float(np.mean(hr_vals))
        mean_rr = float(np.mean(rr_vals))
        sdnn = float(np.std(rr_vals, ddof=1)) if len(rr_vals) > 1 else 0.0
        
        diff_rr = np.diff(rr_vals)
        rmssd = float(np.sqrt(np.mean(diff_rr ** 2))) if len(diff_rr) > 0 else 0.0
        pnn50 = float(np.sum(np.abs(diff_rr) > 50.0) / len(diff_rr) * 100.0) if len(diff_rr) > 0 else 0.0

        # 2. Frequency-Domain HRV Features via Periodogram / Welch
        lf_power, hf_power, lf_hf = self._calculate_spectral_hrv(rr_vals)

        # 3. EDA Features (Tonic SCL and Phasic Peaks)
        eda_mean = float(np.mean(eda_vals))
        eda_scl = float(np.percentile(eda_vals, 10)) # approximate tonic baseline
        eda_peaks, eda_amp = self._calculate_scr_peaks(eda_vals)

        # 4. Temperature Features
        temp_mean = float(np.mean(temp_vals))
        time_seconds = len(temp_vals) / self.fs
        temp_slope = float((temp_vals[-1] - temp_vals[0]) / (time_seconds / 60.0)) if time_seconds > 0 else 0.0

        return HrvEdaFeatures(
            subject_id=subject_id,
            window_start=window_start,
            window_end=window_end,
            mean_hr=round(mean_hr, 2),
            mean_rr=round(mean_rr, 2),
            sdnn=round(sdnn, 2),
            rmssd=round(rmssd, 2),
            pnn50=round(pnn50, 2),
            vlf_power=0.0,
            lf_power=round(lf_power, 4),
            hf_power=round(hf_power, 4),
            lf_hf_ratio=round(lf_hf, 3),
            eda_mean=round(eda_mean, 3),
            eda_scl=round(eda_scl, 3),
            eda_scr_peaks=eda_peaks,
            eda_scr_amplitude=round(eda_amp, 4),
            temp_mean=round(temp_mean, 2),
            temp_slope=round(temp_slope, 4)
        )

    def _calculate_spectral_hrv(self, rr_intervals: np.ndarray) -> tuple:
        """
        Computes LF (0.04-0.15 Hz) and HF (0.15-0.40 Hz) power and LF/HF ratio.
        """
        if len(rr_intervals) < 16:
            # Fallback estimation for short windows
            return 0.05, 0.03, 1.67

        try:
            # Resample non-uniformly sampled RR to 4Hz
            time_series = np.cumsum(rr_intervals) / 1000.0
            fs_interp = 4.0
            t_even = np.arange(time_series[0], time_series[-1], 1.0 / fs_interp)
            if len(t_even) < 8:
                return 0.05, 0.03, 1.67

            rr_interp = np.interp(t_even, time_series, rr_intervals)
            # Remove DC component
            rr_interp = rr_interp - np.mean(rr_interp)

            freqs, psd = signal.welch(rr_interp, fs=fs_interp, nperseg=min(len(rr_interp), 64))

            lf_band = (freqs >= 0.04) & (freqs < 0.15)
            hf_band = (freqs >= 0.15) & (freqs <= 0.40)

            lf_power = float(np.trapz(psd[lf_band], freqs[lf_band])) if np.any(lf_band) else 0.01
            hf_power = float(np.trapz(psd[hf_band], freqs[hf_band])) if np.any(hf_band) else 0.01
            hf_power = max(1e-5, hf_power)
            lf_hf = lf_power / hf_power

            return lf_power, hf_power, lf_hf
        except Exception:
            return 0.04, 0.02, 2.0

    def _calculate_scr_peaks(self, eda_vals: np.ndarray) -> tuple:
        """
        Detects phasic skin conductance response peaks above baseline threshold.
        """
        if len(eda_vals) < 4:
            return 0, 0.0
        peaks, props = signal.find_peaks(eda_vals, height=np.mean(eda_vals) * 0.8, distance=int(self.fs * 1.5))
        peak_count = len(peaks)
        avg_amp = float(np.mean(eda_vals[peaks] - np.min(eda_vals))) if peak_count > 0 else 0.0
        return peak_count, avg_amp
