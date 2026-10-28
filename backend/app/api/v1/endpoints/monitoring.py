import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.core.db import SessionLocal, get_db
from app.deps import require_admin
from app.models.camera import Camera
from app.models.detection import VehicleDetection
from app.models.parking_zone import ParkingZone
from app.models.parking_slot import ParkingSlot
from app.schemas.monitoring import (
    CameraCreate,
    CameraResponse,
    DemoIngestRequest,
    DetectionResponse,
    MonitoringSummary,
    ZoneCreate,
    ZoneResponse,
)
from app.services.monitoring import ingest_demo_frame, is_slot_stale, monitoring_summary, utc_now

router = APIRouter()


@router.get("/summary", response_model=MonitoringSummary)
async def get_summary(db: Session = Depends(get_db), _=Depends(require_admin)):
    return monitoring_summary(db)


@router.get("/zones", response_model=list[ZoneResponse])
async def list_zones(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(ParkingZone).order_by(ParkingZone.zone_code).all()


@router.post("/zones", response_model=ZoneResponse)
async def create_zone(data: ZoneCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(ParkingZone).filter(ParkingZone.zone_code == data.zone_code).first():
        raise HTTPException(409, "Zone code already exists")
    zone = ParkingZone(**data.dict())
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone


@router.get("/cameras", response_model=list[CameraResponse])
async def list_cameras(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Camera).order_by(Camera.camera_code).all()


@router.post("/cameras", response_model=CameraResponse)
async def create_camera(data: CameraCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(Camera).filter(Camera.camera_code == data.camera_code).first():
        raise HTTPException(409, "Camera code already exists")
    camera = Camera(**data.dict())
    db.add(camera)
    db.commit()
    db.refresh(camera)
    return camera


@router.get("/detections", response_model=list[DetectionResponse])
async def list_detections(limit: int = 50, db: Session = Depends(get_db), _=Depends(require_admin)):
    limit = min(max(limit, 1), 200)
    return db.query(VehicleDetection).order_by(VehicleDetection.detected_at.desc()).limit(limit).all()


@router.get("/slots")
async def list_monitoring_slots(db: Session = Depends(get_db), _=Depends(require_admin)):
    now = utc_now()
    result = []
    for slot in db.query(ParkingSlot).all():
        stale = is_slot_stale(slot, now)
        result.append({
            "id": slot.id,
            "slot_code": slot.slot_code,
            "zone": slot.zone,
            "type": slot.type,
            "status": slot.status if not stale else "UNKNOWN",
            "stale": stale,
            "updated_at": slot.updated_at,
        })
    return result


@router.post("/demo/ingest", response_model=list[DetectionResponse])
async def ingest_demo(data: DemoIngestRequest, db: Session = Depends(get_db), _=Depends(require_admin)):
    camera = db.query(Camera).filter(Camera.id == data.camera_id, Camera.enabled.is_(True)).first()
    if not camera:
        raise HTTPException(404, "Enabled camera not found")
    return ingest_demo_frame(db, camera, data.occupied_slot_codes, data.vehicle_plates, data.source)


@router.websocket("/ws")
async def monitoring_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            db = SessionLocal()
            try:
                await websocket.send_text(json.dumps(monitoring_summary(db), default=str))
            finally:
                db.close()
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        return
