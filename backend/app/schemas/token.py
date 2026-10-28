from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TokenGenerate(BaseModel):
    session_id: int
    valid_until: datetime

class TokenResponse(BaseModel):
    id: int
    token_code: str
    session_id: int
    vehicle_id: int
    user_id: int
    status: str
    valid_until: datetime
    qr_payload: Optional[str]
    used_at: Optional[datetime]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class TokenValidate(BaseModel):
    token_code: str
