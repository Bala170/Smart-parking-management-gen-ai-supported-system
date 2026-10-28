from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.camera import Camera
from app.models.detection import VehicleDetection
from app.models.parking_slot import ParkingSlot

STALE_AFTER = timedelta(seconds=90)


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def ingest_demo_frame(
    db: Session,
    camera: Camera,
    occupied_slot_codes: list[str],
    vehicle_plates: dict[str, str],
    source: str = "demo",
) -> list[VehicleDetection]:
    now = utc_now()
    occupied = set(occupied_slot_codes)
    detections = []
    for slot in db.query(ParkingSlot).all():
        if slot.slot_code not in occupied or slot.status == "MAINTENANCE":
            continue
        detection = VehicleDetection(
            camera_id=camera.id,
            slot_id=slot.id,
            vehicle_plate=vehicle_plates.get(slot.slot_code),
            vehicle_type=slot.type,
            confidence=0.97,
            detected_at=now,
            source=source,
        )
        slot.status = "OCCUPIED"
        slot.updated_at = now
        db.add(detection)
        detections.append(detection)

    camera.status = "ONLINE"
    camera.last_seen_at = now
    db.commit()
    for detection in detections:
        db.refresh(detection)
    return detections


def is_slot_stale(slot: ParkingSlot, now: datetime | None = None) -> bool:
    now = now or utc_now()
    updated_at = slot.updated_at or slot.created_at
    return bool(updated_at and now - updated_at > STALE_AFTER)


def monitoring_summary(db: Session) -> dict:
    now = utc_now()
    slots = db.query(ParkingSlot).all()
    cameras = db.query(Camera).all()
    last_detection = db.query(VehicleDetection).order_by(VehicleDetection.detected_at.desc()).first()
    return {
        "total_slots": len(slots),
        "occupied_slots": sum(1 for slot in slots if slot.status == "OCCUPIED"),
        "available_slots": sum(1 for slot in slots if slot.status == "AVAILABLE"),
        "stale_slots": sum(1 for slot in slots if is_slot_stale(slot, now)),
        "online_cameras": sum(
            1 for camera in cameras
            if camera.status == "ONLINE"
            and camera.last_seen_at
            and now - camera.last_seen_at <= STALE_AFTER
        ),
        "total_cameras": len(cameras),
        "last_event_at": last_detection.detected_at if last_detection else None,
    }
