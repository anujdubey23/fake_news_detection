import json
import sys
from pathlib import Path
from typing import Any, Dict, Optional
import joblib

# Ensure backend root directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from utils.text_preprocessing import clean_text

MODEL_PATH = BASE_DIR / "model" / "fake_news_model.pkl"
VEC_PATH = BASE_DIR / "model" / "tfidf_vectorizer.pkl"
METRICS_PATH = BASE_DIR / "model" / "metrics.json"


class MLService:
    _instance: Optional["MLService"] = None

    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.metrics: Dict[str, Any] = {}
        self.load_artifacts()

    @classmethod
    def get_instance(cls) -> "MLService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_artifacts(self) -> bool:
        """Loads serialized model, vectorizer, and evaluation metrics."""
        try:
            if MODEL_PATH.exists() and VEC_PATH.exists():
                self.model = joblib.load(MODEL_PATH)
                self.vectorizer = joblib.load(VEC_PATH)
            else:
                self.model = None
                self.vectorizer = None

            if METRICS_PATH.exists():
                with open(METRICS_PATH, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            else:
                self.metrics = {}

            return self.is_ready()
        except Exception as e:
            print(f"[MLService] Error loading artifacts: {e}")
            self.model = None
            self.vectorizer = None
            return False

    def is_ready(self) -> bool:
        return self.model is not None and self.vectorizer is not None

    def get_metrics(self) -> Dict[str, Any]:
        return self.metrics

    def predict(self, raw_text: str) -> Dict[str, Any]:
        """
        Runs the ML inference pipeline on raw news text.
        """
        if not self.is_ready():
            raise RuntimeError(
                "ML model artifacts not found. Please run 'python train_model.py' to generate model weights."
            )

        cleaned = clean_text(raw_text)
        if not cleaned:
            return {
                "prediction": "UNVERIFIED",
                "label": -1,
                "confidence": 0.50,
                "probabilities": {"real": 0.50, "fake": 0.50},
                "cleaned_text": "",
                "top_keywords": [],
                "ml_summary": "Input text contains insufficient lexical tokens for statistical classification."
            }

        tfidf_features = self.vectorizer.transform([cleaned])

        probs = self.model.predict_proba(tfidf_features)[0]
        real_prob = float(probs[0])
        fake_prob = float(probs[1])

        predicted_label = int(self.model.predict(tfidf_features)[0])
        prediction_str = "FAKE" if predicted_label == 1 else "REAL"
        confidence = fake_prob if predicted_label == 1 else real_prob

        # Extract top influential vocabulary words present in this sample
        feature_names = self.vectorizer.get_feature_names_out()
        coefficients = self.model.coef_[0]

        sample_indices = tfidf_features.nonzero()[1]
        word_scores = []
        for idx in sample_indices:
            word = feature_names[idx]
            weight = tfidf_features[0, idx]
            coef = coefficients[idx]
            impact = weight * coef
            word_scores.append((word, impact))

        word_scores.sort(key=lambda x: abs(x[1]), reverse=True)
        top_keywords = [w for w, _ in word_scores[:6]]

        ml_summary = (
            f"The Logistic Regression model evaluated {len(sample_indices)} vocabulary n-grams. "
            f"Key contributing tokens include: {', '.join(top_keywords) if top_keywords else 'general vocabulary'}."
        )

        return {
            "prediction": prediction_str,
            "label": predicted_label,
            "confidence": round(confidence, 4),
            "probabilities": {
                "real": round(real_prob, 4),
                "fake": round(fake_prob, 4)
            },
            "cleaned_text": cleaned,
            "top_keywords": top_keywords,
            "ml_summary": ml_summary
        }
