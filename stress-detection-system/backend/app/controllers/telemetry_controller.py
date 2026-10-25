from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..models.sensor_data import SensorData
from ..repositories.telemetry_repository import telemetry_repo
from ..services.stress_analysis_service import stress_analysis_service

router = APIRouter(prefix="/api/telemetry", tags=["Telemetry"])

@router.post("/ingest", summary="Ingest real-time bio-sensor sample")
async def ingest_telemetry(data: SensorData):
    """
    Receives raw physiological telemetry from hardware or mobile gateway,
    feeds the signal analysis pipeline, and returns evaluated stress if window is full.
    """
    try:
        evaluation = await stress_analysis_service.process_telemetry(data)
        return {
            "status": "success",
            "message": "Telemetry frame ingested",
            "evaluation": evaluation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent/{subject_id}", summary="Retrieve recent telemetry history")
async def get_recent_telemetry(
    subject_id: str,
    limit: int = Query(default=100, ge=1, le=500)
):
    """
    Returns recent chronological telemetry samples for a given subject.
    """
    samples = await telemetry_repo.get_recent_sensor_data(subject_id, limit=limit)
    return {"subject_id": subject_id, "count": len(samples), "samples": samples}
