from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(String(36), unique=True, nullable=False, index=True)
    transcript_hash = Column(String(64), nullable=False, index=True)
    masked_transcript = Column(Text, nullable=False)
    label = Column(String(10), nullable=False)
    risk_score = Column(Float, nullable=False)
    reasons_json = Column(Text, nullable=False)
    red_flags_json = Column(Text, nullable=False)
    mode = Column(String(20), nullable=False)
    model_version = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, autoincrement=True)
    transcript_hash = Column(String(64), nullable=False, index=True)
    predicted_label = Column(String(10), nullable=False)
    true_label = Column(String(10), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
