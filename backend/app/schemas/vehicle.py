from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VehicleBase(BaseModel):
    vehicle_number: str
    model: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    rfid_tag: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int
    rfid_status: Optional[str]
    parking_status: Optional[str]
    owner_id: int
    slot_id: Optional[int]
    active_session_id: Optional[int]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
