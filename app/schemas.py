from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    transcript: str = Field(..., min_length=10)
    language: str = Field(default="en")
    mode: str = Field(default="baseline")

class PredictResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    label: str
    risk_score: float = Field(ge=0.0, le=1.0)
    reasons: list[str]
    red_flags: list[str]
    model_version: str
    request_id: str
    created_at: datetime

class FeedbackRequest(BaseModel):
    transcript: str = Field(..., min_length=10)
    predicted_label: str
    true_label: str
    notes: Optional[str] = None

class FeedbackResponse(BaseModel):
    status: str = "saved"
    message: str = "Feedback recorded. Thank you!"

class HealthResponse(BaseModel):
    status: str = "ok"
