import hashlib, json, logging, uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.pii import mask_pii
from app.db.session import get_db
from app.db.models import Prediction, Feedback
from app.schemas import PredictRequest, PredictResponse, FeedbackRequest, FeedbackResponse, HealthResponse
from app.services.predictor_baseline import BaselinePredictor
from app.services.predictor_llm import LLMPredictor

logger = logging.getLogger(__name__)
router = APIRouter()
baseline_predictor = BaselinePredictor()
llm_predictor = LLMPredictor()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok")

@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest, db: Session = Depends(get_db)):
    if request.mode == "baseline": predictor = baseline_predictor
    elif request.mode == "llm": predictor = llm_predictor
    else: raise HTTPException(status_code=400, detail=f"Invalid mode '{request.mode}'. Use 'baseline' or 'llm'.")
    result = predictor.predict(request.transcript, request.language)
    request_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)
    db.add(Prediction(request_id=request_id, transcript_hash=hashlib.sha256(request.transcript.encode()).hexdigest(),
        masked_transcript=mask_pii(request.transcript), label=result.label, risk_score=result.risk_score,
        reasons_json=json.dumps(result.reasons), red_flags_json=json.dumps(result.red_flags),
        mode=request.mode, model_version=result.model_version, created_at=created_at))
    db.commit()
    return PredictResponse(label=result.label, risk_score=result.risk_score, reasons=result.reasons,
        red_flags=result.red_flags, model_version=result.model_version, request_id=request_id, created_at=created_at)

@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(request: FeedbackRequest, db: Session = Depends(get_db)):
    for field, val in [("predicted_label", request.predicted_label), ("true_label", request.true_label)]:
        if val not in ("fraud", "normal"): raise HTTPException(status_code=400, detail=f"{field} must be 'fraud' or 'normal'")
    db.add(Feedback(transcript_hash=hashlib.sha256(request.transcript.encode()).hexdigest(),
        predicted_label=request.predicted_label, true_label=request.true_label, notes=request.notes))
    db.commit()
    return FeedbackResponse()
