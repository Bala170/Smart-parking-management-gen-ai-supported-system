from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.deps import require_admin

router = APIRouter()

@router.get("", response_model=list[UserResponse])
async def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).all()
