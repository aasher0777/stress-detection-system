import numpy as np
from typing import List, Tuple
from scipy import signal

class SignalPreprocessor:
    """
    Digital signal conditioning module for physiological signals.
    Applies Butterworth filtering, baseline drift correction, and artifact removal.
    """
    def __init__(self, sampling_rate_hz: float = 64.0):
        self.fs = sampling_rate_hz

    def bandpass_filter(self, data: np.ndarray, lowcut: float = 0.5, highcut: float = 8.0, order: int = 3) -> np.ndarray:
        """
        Applies zero-phase Butterworth bandpass filter to eliminate low-frequency baseline drift
        and high-frequency electronic noise.
        """
        if len(data) <= order * 3:
            return data
        nyq = 0.5 * self.fs
        low = max(0.01, lowcut / nyq)
        high = min(0.99, highcut / nyq)
        b, a = signal.butter(order, [low, high], btype='band')
        return signal.filtfilt(b, a, data)

    def lowpass_filter(self, data: np.ndarray, cutoff: float = 1.0, order: int = 2) -> np.ndarray:
        """
        Low-pass filter for EDA / GSR signals to capture the slow tonic component (SCL).
        """
        if len(data) <= order * 3:
            return data
        nyq = 0.5 * self.fs
        normal_cutoff = min(0.99, cutoff / nyq)
        b, a = signal.butter(order, normal_cutoff, btype='low', analog=False)
        return signal.filtfilt(b, a, data)

    def remove_motion_artifacts(self, data: np.ndarray, z_threshold: float = 3.0) -> np.ndarray:
        """
        Replaces sudden outlier spikes exceeding z_threshold with local median.
        """
        mean = np.mean(data)
        std = np.std(data)
        if std == 0:
            return data
        z_scores = np.abs((data - mean) / std)
        cleaned = data.copy()
        median_val = np.median(data)
        cleaned[z_scores > z_threshold] = median_val
        return cleaned

    def detect_rr_peaks(self, bvp_signal: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Detects systolic pulse peaks in BVP/PPG signals and computes inter-beat intervals (RR/IBI) in ms.
        """
        min_distance = int(0.4 * self.fs) # Max heart rate ~150 bpm
        peaks, _ = signal.find_peaks(bvp_signal, distance=min_distance, prominence=np.std(bvp_signal) * 0.5)
        
        if len(peaks) < 2:
            return peaks, np.array([])

        # Calculate time difference between consecutive peaks in milliseconds
        rr_intervals = (np.diff(peaks) / self.fs) * 1000.0
        # Filter physiological bounds (300ms to 1500ms -> 40 to 200 BPM)
        valid_indices = (rr_intervals >= 300.0) & (rr_intervals <= 1500.0)
        return peaks, rr_intervals[valid_indices]
