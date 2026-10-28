from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from app.core.db import get_db
from app.models.digital_token import DigitalParkingToken
from app.models.parking_session import ParkingSession
from app.models.vehicle import Vehicle
from app.models.audit import AuditEvent
from app.schemas.token import TokenGenerate, TokenResponse, TokenValidate
from app.deps import get_current_user
from app.services.nonce_service import check_and_mark_nonce

router = APIRouter()

@router.post('/generate', response_model=TokenResponse)
async def generate_token(data: TokenGenerate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == data.session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, 'Session not found')
    if session.status != 'ACTIVE':
        raise HTTPException(400, 'Session not active')
    
    token_code = f'DTK-{secrets.token_hex(4).upper()}-{secrets.token_hex(2).upper()}'
    qr_payload = f'SEC-TOKEN:{token_code}:{session.session_code}:EXP-{int(data.valid_until.timestamp())}'
    
    token = DigitalParkingToken(
        token_code=token_code,
        session_id=session.id,
        vehicle_id=session.vehicle_id,
        user_id=current_user.id,
        status='ACTIVE',
        valid_until=data.valid_until,
        qr_payload=qr_payload,
    )
    db.add(token)
    db.commit()
    db.refresh(token)
    
    audit = AuditEvent(event='DIGITAL_TOKEN_ISSUED', user_id=current_user.id, vehicle_id=session.vehicle_id,
                       action='TOKEN_GENERATION', status='SUCCESS',
                       gate_node='Core Session Manager', details=f'Token {token_code} for session {session.session_code}')
    db.add(audit)
    db.commit()
    return token

@router.get('/my', response_model=list[TokenResponse])
async def my_tokens(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(DigitalParkingToken).filter(DigitalParkingToken.user_id == current_user.id).order_by(DigitalParkingToken.created_at.desc()).all()

@router.post('/validate')
async def validate_token(data: TokenValidate, db: Session = Depends(get_db)):
    token = db.query(DigitalParkingToken).filter(DigitalParkingToken.token_code == data.token_code).first()
    if not token:
        raise HTTPException(404, 'Token not found')
    if token.status != 'ACTIVE':
        return {'valid': False, 'reason': f'Token status: {token.status}'}
    if datetime.utcnow() > token.valid_until:
        token.status = 'EXPIRED'
        db.commit()
        return {'valid': False, 'reason': 'Token expired'}
    return {'valid': True, 'token': {'id': token.id, 'session_id': token.session_id, 'vehicle_id': token.vehicle_id}}

@router.post('/{token_id}/use')
async def use_token(token_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    token = db.query(DigitalParkingToken).filter(DigitalParkingToken.id == token_id, DigitalParkingToken.user_id == current_user.id).first()
    if not token:
        raise HTTPException(404, 'Token not found')
    if token.status != 'ACTIVE':
        raise HTTPException(400, f'Token not usable: {token.status}')
    if datetime.utcnow() > token.valid_until:
        token.status = 'EXPIRED'
        db.commit()
        raise HTTPException(400, 'Token expired')
    
    # Replay prevention
    nonce = f'TOKEN_USE:{token.token_code}:{token.session_id}'
    if not check_and_mark_nonce(db, nonce, 'TOKEN_USE', token.token_code):
        raise HTTPException(409, 'Token already used (replay detected)')
    
    token.status = 'USED'
    token.used_at = datetime.utcnow()
    db.commit()
    
    audit = AuditEvent(event='TOKEN_USED', user_id=current_user.id, vehicle_id=token.vehicle_id,
                       action='TOKEN_VALIDATION', status='SUCCESS',
                       gate_node='Exit Gate', details=f'Token {token.token_code} used for exit')
    db.add(audit)
    db.commit()
    return {'success': True, 'message': 'Token validated for exit'}
