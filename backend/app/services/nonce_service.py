from sqlalchemy.orm import Session
from app.models.nonce import NonceRecord

def check_and_mark_nonce(db: Session, nonce: str, purpose: str, reference_id: str) -> bool:
    '''
    Check if nonce has been used before. If not, mark it as used.
    Returns True if nonce is fresh (not used), False if already used (replay attack).
    '''
    existing = db.query(NonceRecord).filter(NonceRecord.nonce == nonce).first()
    if existing:
        return False  # Replay detected
    
    record = NonceRecord(nonce=nonce, purpose=purpose, reference_id=reference_id)
    db.add(record)
    db.commit()
    return True

def is_nonce_used(db: Session, nonce: str) -> bool:
    return db.query(NonceRecord).filter(NonceRecord.nonce == nonce).first() is not None
