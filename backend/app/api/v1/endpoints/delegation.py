from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import secrets
from app.core.db import get_db
from app.models.delegation import DelegationAuthorization
from app.models.parking_session import ParkingSession
from app.models.vehicle import Vehicle
from app.models.audit import AuditEvent
from app.schemas.delegation import DelegationCreate, DelegationResponse, DelegationValidate
from app.deps import get_current_user
from app.services.nonce_service import check_and_mark_nonce

router = APIRouter()

@router.post('', response_model=DelegationResponse)
async def create_delegation(data: DelegationCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == data.session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, 'Session not found')
    if session.status != 'ACTIVE':
        raise HTTPException(400, 'Session not active')
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == session.vehicle_id).first()
    
    delegation_code = f'DEL-{datetime.utcnow().year}-{secrets.randbelow(9000) + 1000:04d}'
    otp = f'{secrets.randbelow(900000) + 100000:06d}'
    qr_payload = 'SEC-DEL:' + delegation_code + ':' + vehicle.vehicle_number.replace('-', '') + ':EXP-' + str(int(data.valid_until.timestamp())) + ':SIG-' + secrets.token_hex(3)
    
    delegation = DelegationAuthorization(
        delegation_code=delegation_code,
        session_id=session.id,
        vehicle_id=session.vehicle_id,
        owner_id=current_user.id,
        delegatee_name=data.delegatee_name,
        delegatee_phone=data.delegatee_phone,
        relation=data.relation,
        valid_from=data.valid_from,
        valid_until=data.valid_until,
        purpose=data.purpose,
        status='ACTIVE',
        otp=otp,
        qr_payload=qr_payload,
    )
    db.add(delegation)
    db.commit()
    db.refresh(delegation)
    
    audit = AuditEvent(event='DELEGATION_CREATED', user_id=current_user.id, vehicle_id=vehicle.id,
                       action='DELEGATION_CREATE', status='SUCCESS',
                       gate_node='Web Client (Portal)', details='Delegation ' + delegation_code + ' for ' + data.delegatee_name + ' (' + data.delegatee_phone + ')')
    db.add(audit)
    db.commit()
    return delegation

@router.get('/my', response_model=list[DelegationResponse])
async def my_delegations(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(DelegationAuthorization).filter(DelegationAuthorization.owner_id == current_user.id).order_by(DelegationAuthorization.created_at.desc()).all()

@router.post('/validate')
async def validate_delegation(data: DelegationValidate, db: Session = Depends(get_db)):
    delegation = db.query(DelegationAuthorization).filter(DelegationAuthorization.delegation_code == data.delegation_code).first()
    if not delegation:
        return {'valid': False, 'reason': 'Delegation not found'}
    
    now = datetime.utcnow()
    if delegation.status != 'ACTIVE':
        return {'valid': False, 'reason': 'Status: ' + delegation.status}
    if now < delegation.valid_from:
        return {'valid': False, 'reason': 'Not yet valid'}
    if now > delegation.valid_until:
        delegation.status = 'EXPIRED'
        db.commit()
        return {'valid': False, 'reason': 'Expired'}
    if delegation.otp != data.otp:
        audit = AuditEvent(event='DELEGATION_OTP_FAILED', user_id=delegation.owner_id, vehicle_id=delegation.vehicle_id,
                           action='DELEGATION_OTP_FAILED', status='FAILED',
                           gate_node='Exit Gate', details='Invalid OTP for ' + delegation.delegation_code)
        db.add(audit)
        db.commit()
        return {'valid': False, 'reason': 'Invalid OTP'}
    
    # Replay prevention
    nonce = 'DELEGATION_USE:' + delegation.delegation_code + ':' + str(delegation.session_id)
    if not check_and_mark_nonce(db, nonce, 'DELEGATION_USE', delegation.delegation_code):
        return {'valid': False, 'reason': 'Delegation already used (replay detected)'}
    
    return {'valid': True, 'delegation': {'id': delegation.id, 'session_id': delegation.session_id, 'vehicle_id': delegation.vehicle_id}}

@router.post('/{delegation_id}/revoke')
async def revoke_delegation(delegation_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    delegation = db.query(DelegationAuthorization).filter(DelegationAuthorization.id == delegation_id, DelegationAuthorization.owner_id == current_user.id).first()
    if not delegation:
        raise HTTPException(404, 'Delegation not found')
    if delegation.status != 'ACTIVE':
        raise HTTPException(400, 'Delegation not active')
    
    delegation.status = 'REVOKED'
    delegation.revoked_at = datetime.utcnow()
    db.commit()
    
    audit = AuditEvent(event='DELEGATION_REVOKED', user_id=current_user.id, vehicle_id=delegation.vehicle_id,
                       action='DELEGATION_REVOKE', status='SUCCESS',
                       gate_node='Web Client', details='Delegation ' + delegation.delegation_code + ' revoked by owner')
    db.add(audit)
    db.commit()
    return {'success': True}
