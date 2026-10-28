from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DelegationCreate(BaseModel):
    session_id: int
    delegatee_name: str
    delegatee_phone: str
    relation: str
    valid_from: datetime
    valid_until: datetime
    purpose: str

class DelegationResponse(BaseModel):
    id: int
    delegation_code: str
    session_id: int
    vehicle_id: int
    owner_id: int
    delegatee_name: str
    delegatee_phone: str
    relation: str
    valid_from: datetime
    valid_until: datetime
    purpose: str
    status: str
    otp: Optional[str]
    qr_payload: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class DelegationValidate(BaseModel):
    delegation_code: str
    otp: str
