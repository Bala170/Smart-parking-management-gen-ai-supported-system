from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime, date, timedelta
from app.core.db import get_db
from app.models.audit import AuditEvent
from app.deps import require_admin

router = APIRouter()

@router.get("")
async def list_audit_logs(
    event: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    _=Depends(require_admin)
):
    q = db.query(AuditEvent)
    if event:
        q = q.filter(AuditEvent.event.ilike(f"%{event}%"))
    if status:
        q = q.filter(AuditEvent.status == status)
    if start_date:
        q = q.filter(AuditEvent.timestamp >= start_date)
    if end_date:
        q = q.filter(AuditEvent.timestamp <= end_date)
    logs = q.order_by(AuditEvent.timestamp.desc()).offset(offset).limit(limit).all()
    return logs

@router.get("/stats")
async def audit_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    return {
        "total_events": db.query(AuditEvent).count(),
        "today_events": db.query(AuditEvent).filter(AuditEvent.timestamp >= today_start).count(),
        "failed_events": db.query(AuditEvent).filter(AuditEvent.status == "FAILED").count(),
        "rejected_events": db.query(AuditEvent).filter(AuditEvent.status == "REJECTED").count(),
        "by_event": [{"event": e, "count": c} for e, c in db.query(AuditEvent.event, func.count(AuditEvent.id)).group_by(AuditEvent.event).all()],
    }
