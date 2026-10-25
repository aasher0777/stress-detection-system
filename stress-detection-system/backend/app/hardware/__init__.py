"""
Hardware acquisition and signal pre-processing module.
"""
from .sensor_interface import SensorInterface, VirtualTelemetryGenerator
from .signal_preprocessor import SignalPreprocessor

__all__ = ["SensorInterface", "VirtualTelemetryGenerator", "SignalPreprocessor"]
