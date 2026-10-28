from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
