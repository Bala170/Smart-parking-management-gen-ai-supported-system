from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.db import get_db
from app.models.retrieval import RetrievalRequest
from app.models.parking_session import ParkingSession
from app.models.payment import Payment
from app.models.digital_token import DigitalParkingToken
from app.models.delegation import DelegationAuthorization
from app.models.audit import AuditEvent
from app.schemas.retrieval import RetrievalValidate, RetrievalResponse
from app.deps import get_current_user, require_admin
from app.services.nonce_service import check_and_mark_nonce
from app.services.genai_boundary import GenAIAuthorizationBoundary, AuthorizationSource, AuthorizationContext

router = APIRouter()

@router.post('/validate', response_model=RetrievalResponse)
async def validate_retrieval(data: RetrievalValidate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Create authorization context - backend authorization required
    auth_context = GenAIAuthorizationBoundary.create_authorization_context(
        AuthorizationSource.USER_REQUEST,
        user_id=current_user.id,
        session_id=data.session_id,
        method=data.method
    )
    GenAIAuthorizationBoundary.validate_action('release_vehicle', auth_context.source)
    
    session = db.query(ParkingSession).filter(ParkingSession.id == data.session_id).first()
    if not session:
        raise HTTPException(404, 'Session not found')
    
    # Verify session belongs to user
    if session.user_id != current_user.id:
        raise HTTPException(403, 'Not authorized for this session')
    
    # Check payment
    payment = db.query(Payment).filter(Payment.session_id == session.id, Payment.status == 'SUCCESS').first()
    payment_ok = payment is not None
    
    auth_ok = False
    auth_method = data.method
    used_nonce = None
    
    if data.method == 'TOKEN':
        if not data.token_code:
            raise HTTPException(400, 'Token code required')
        token = db.query(DigitalParkingToken).filter(DigitalParkingToken.token_code == data.token_code, DigitalParkingToken.session_id == session.id).first()
        if token and token.status == 'ACTIVE' and datetime.utcnow() <= token.valid_until:
            # Replay prevention: check nonce
            nonce = 'TOKEN:' + data.token_code + ':' + str(session.id)
            if not check_and_mark_nonce(db, nonce, 'TOKEN_USE', data.token_code):
                raise HTTPException(409, 'Token already used (replay detected)')
            auth_ok = True
            token.status = 'USED'
            token.used_at = datetime.utcnow()
            used_nonce = nonce
    elif data.method == 'DELEGATION':
        if not data.delegation_code or not data.otp:
            raise HTTPException(400, 'Delegation code and OTP required')
        delegation = db.query(DelegationAuthorization).filter(DelegationAuthorization.delegation_code == data.delegation_code, DelegationAuthorization.session_id == session.id).first()
        if delegation and delegation.status == 'ACTIVE' and datetime.utcnow() >= delegation.valid_from and datetime.utcnow() <= delegation.valid_until and delegation.otp == data.otp:
            # Replay prevention
            nonce = 'DELEGATION:' + data.delegation_code + ':' + str(session.id)
            if not check_and_mark_nonce(db, nonce, 'DELEGATION_USE', data.delegation_code):
                raise HTTPException(409, 'Delegation already used (replay detected)')
            auth_ok = True
            delegation.status = 'COMPLETED'
            delegation.completed_at = datetime.utcnow()
            used_nonce = nonce
    elif data.method == 'RECOVERY':
        if not data.token_code:
            raise HTTPException(400, 'Recovery token required')
        token = db.query(DigitalParkingToken).filter(DigitalParkingToken.token_code == data.token_code, DigitalParkingToken.session_id == session.id).first()
        if token and token.status == 'ACTIVE' and datetime.utcnow() <= token.valid_until:
            nonce = 'RECOVERY:' + data.token_code + ':' + str(session.id)
            if not check_and_mark_nonce(db, nonce, 'RECOVERY_USE', data.token_code):
                raise HTTPException(409, 'Recovery token already used (replay detected)')
            auth_ok = True
            token.status = 'USED'
            token.used_at = datetime.utcnow()
            used_nonce = nonce
    elif data.method == 'RFID':
        # Hardware would validate - SIMULATED
        auth_ok = True
        used_nonce = 'RFID:' + str(session.id) + ':' + datetime.utcnow().isoformat()
        check_and_mark_nonce(db, used_nonce, 'RFID_USE', str(session.id))
    else:
        raise HTTPException(400, 'Invalid method')
    
    if not auth_ok:
        audit = AuditEvent(event='RETRIEVAL_ATTEMPT', user_id=current_user.id, vehicle_id=session.vehicle_id,
                           action='RETRIEVAL_REJECTED', status='REJECTED',
                           gate_node='Exit Gate', details='Method ' + data.method + ' failed auth')
        db.add(audit)
        db.commit()
        raise HTTPException(401, 'Authorization failed')
    
    if not payment_ok:
        raise HTTPException(402, 'Payment required before exit')
    
    # Create retrieval request record
    request_code = 'RET-' + str(datetime.utcnow().year) + '-' + str(db.query(RetrievalRequest).count()+1).zfill(4)
    retrieval = RetrievalRequest(
        request_code=request_code,
        session_id=session.id,
        vehicle_id=session.vehicle_id,
        user_id=current_user.id,
        method=data.method,
        auth_status='AUTHORIZED',
        payment_status='Paid' if payment_ok else 'Pending',
        gate_status='READY_TO_OPEN',
        delegation_id=delegation.id if data.method == 'DELEGATION' and 'delegation' in locals() else None,
        notes='Validated via ' + data.method + (' [nonce:' + used_nonce + ']' if used_nonce else '')
    )
    db.add(retrieval)
    
    # Update session
    session.gate_status = 'READY_TO_OPEN'
    session.retrieval_method = data.method
    
    audit = AuditEvent(event='RETRIEVAL_AUTHORIZED', user_id=current_user.id, vehicle_id=session.vehicle_id,
                       action='RETRIEVAL_' + data.method, status='SUCCESS',
                       gate_node='Exit Gate', details='Retrieval ' + request_code + ' authorized via ' + data.method)
    db.add(audit)
    db.commit()
    db.refresh(retrieval)
    return retrieval

@router.get('/my', response_model=list[RetrievalResponse])
async def my_retrievals(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(RetrievalRequest).filter(RetrievalRequest.user_id == current_user.id).order_by(RetrievalRequest.created_at.desc()).all()
