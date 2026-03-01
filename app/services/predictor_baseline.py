import logging
from app.services.predictor_base import BasePredictor, PredictionResult
from app.services.red_flags import detect_red_flags

logger = logging.getLogger(__name__)

class BaselinePredictor(BasePredictor):
    def predict(self, transcript, language="en"):
        result = detect_red_flags(transcript)
        score = result["total_score"]
        label = "fraud" if score >= 0.5 else "normal"
        reasons = result["reasons"] if result["reasons"] else ["No fraud indicators detected"]
        if label == "normal" and score > 0.0:
            reasons.append(f"Some suspicious patterns found but below threshold ({score:.2f} < 0.5)")
        return PredictionResult(label=label, risk_score=round(score, 4), reasons=reasons, red_flags=result["matched_keywords"], model_version="baseline-v1.0")
