from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class PredictionResult:
    label: str
    risk_score: float
    reasons: list[str]
    red_flags: list[str]
    model_version: str

class BasePredictor(ABC):
    @abstractmethod
    def predict(self, transcript, language="en") -> PredictionResult:
        pass
