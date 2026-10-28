from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecoveryRequest(BaseModel):
    vehicle_number: str
    phone: str

class RecoveryOTPRequest(BaseModel):
    vehicle_number: str
    phone: str
    otp: str

class RecoveryResponse(BaseModel):
    success: bool
    recovery_id: str
    message: str
    new_token_code: Optional[str] = None
