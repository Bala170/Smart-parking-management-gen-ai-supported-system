from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from app.deps import get_current_user

router = APIRouter()

@router.get("", response_model=list[VehicleResponse])
async def list_vehicles(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Vehicle).filter(Vehicle.owner_id == current_user.id).all()

@router.post("", response_model=VehicleResponse)
async def create_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if db.query(Vehicle).filter(Vehicle.vehicle_number == vehicle_in.vehicle_number).first():
        raise HTTPException(status_code=400, detail="Vehicle already registered")
    v = Vehicle(**vehicle_in.dict(), owner_id=current_user.id, rfid_status="Pending Verification", parking_status="Idle")
    db.add(v)
    db.commit()
    db.refresh(v)
    return v
