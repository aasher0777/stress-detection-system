from typing import List, Optional
from datetime import datetime, timedelta
from ..config.db_config import get_database
from ..models.sensor_data import SensorData
from ..models.stress_state import StressState

class TelemetryRepository:
    """
    Asynchronous repository for storing and querying sensor telemetry and stress predictions.
    Gracefully falls back to high-speed in-memory store when MongoDB is offline.
    """
    def __init__(self):
        self._in_memory_telemetry: List[dict] = []
        self._in_memory_stress: List[dict] = []

    @property
    def telemetry_col(self):
        db = get_database()
        return db["telemetry_samples"] if db is not None else None

    @property
    def stress_col(self):
        db = get_database()
        return db["stress_evaluations"] if db is not None else None

    async def save_sensor_data(self, data: SensorData) -> bool:
        record = data.model_dump()
        # Always maintain fast local rolling buffer
        self._in_memory_telemetry.append(record)
        if len(self._in_memory_telemetry) > 500:
            self._in_memory_telemetry.pop(0)

        if self.telemetry_col is not None:
            try:
                await self.telemetry_col.insert_one(record)
                return True
            except Exception as e:
                print(f"[!] Error saving sensor sample to Mongo: {e}")
        return True

    async def get_recent_sensor_data(self, subject_id: str, limit: int = 100) -> List[dict]:
        if self.telemetry_col is not None:
            try:
                cursor = self.telemetry_col.find(
                    {"subject_id": subject_id}
                ).sort("timestamp", -1).limit(limit)
                results = await cursor.to_list(length=limit)
                for r in results:
                    r["_id"] = str(r["_id"])
                return results
            except Exception as e:
                print(f"[!] Error reading from MongoDB, returning cached buffer: {e}")

        # In-memory fallback
        matching = [s for s in self._in_memory_telemetry if s.get("subject_id") == subject_id]
        return list(reversed(matching[-limit:]))

    async def save_stress_state(self, state: StressState) -> bool:
        record = state.model_dump()
        self._in_memory_stress.append(record)
        if len(self._in_memory_stress) > 200:
            self._in_memory_stress.pop(0)

        if self.stress_col is not None:
            try:
                await self.stress_col.insert_one(record)
                return True
            except Exception as e:
                print(f"[!] Error saving stress state to Mongo: {e}")
        return True

    async def get_stress_history(self, subject_id: str, limit: int = 50) -> List[dict]:
        if self.stress_col is not None:
            try:
                cursor = self.stress_col.find(
                    {"subject_id": subject_id}
                ).sort("timestamp", -1).limit(limit)
                results = await cursor.to_list(length=limit)
                for r in results:
                    r["_id"] = str(r["_id"])
                return results
            except Exception as e:
                print(f"[!] Error reading stress history from MongoDB: {e}")

        # In-memory fallback
        matching = [s for s in self._in_memory_stress if s.get("subject_id") == subject_id]
        return list(reversed(matching[-limit:]))

telemetry_repo = TelemetryRepository()
