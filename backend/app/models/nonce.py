from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, text
from sqlalchemy.sql import func
from app.core.db import Base

class NonceRecord(Base):
    __tablename__ = "nonce_records"
    id = Column(Integer, primary_key=True, index=True)
    nonce = Column(String(255), unique=True, index=True, nullable=False)
    used_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    purpose = Column(String(100))  # TOKEN_USE, DELEGATION_USE, RECOVERY_USE, RETRIEVAL_ATTEMPT
    reference_id = Column(String(100))  # token_code, delegation_code, etc.
