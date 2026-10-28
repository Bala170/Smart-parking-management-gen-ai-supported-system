from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.parking_slot import ParkingSlot
from app.schemas.parking_slot import SlotCreate, SlotResponse
from app.deps import require_admin

router = APIRouter()

@router.post("", response_model=SlotResponse)
async def create_slot(data: SlotCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(ParkingSlot).filter(ParkingSlot.slot_code == data.slot_code).first():
        raise HTTPException(400, "Slot code already exists")
    slot = ParkingSlot(**data.dict())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@router.get("", response_model=list[SlotResponse])
async def list_slots(zone: str | None = None, db: Session = Depends(get_db)):
    q = db.query(ParkingSlot)
    if zone:
        q = q.filter(ParkingSlot.zone == zone)
    return q.all()
