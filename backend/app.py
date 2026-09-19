import os
import sys
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure backend root directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load environment variables from .env
load_dotenv(BASE_DIR / ".env")

from services.ml_service import MLService
from services.gemini_service import GeminiService

DISCLAIMER_TEXT = "This prediction is AI-generated and should not be treated as definitive fact-checking."
MAX_TEXT_LENGTH = 25000

app = Flask(__name__)
# Enable CORS for cross-origin requests from React (Vite dev server and production frontend)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize services
ml_service = MLService.get_instance()
gemini_service = GeminiService()


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "project": "NewsLens AI - Fake News Detection & AI Explanation System",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "metrics": "/metrics",
            "predict": "/predict",
            "explain": "/explain",
            "analyze": "/analyze"
        },
        "disclaimer": DISCLAIMER_TEXT
    }), 200


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint exposing runtime readiness and trained metrics."""
    return jsonify({
        "status": "healthy",
        "model_loaded": ml_service.is_ready(),
        "gemini_configured": gemini_service.is_configured(),
        "metrics": ml_service.get_metrics(),
        "disclaimer": DISCLAIMER_TEXT
    }), 200


@app.route("/metrics", methods=["GET"])
def get_metrics():
    """Returns the trained model evaluation metrics."""
    return jsonify({
        "metrics": ml_service.get_metrics(),
        "model_loaded": ml_service.is_ready()
    }), 200


@app.route("/predict", methods=["POST"])
def predict():
    """
    Dedicated endpoint for ML classification only (no Generative AI call).
    """
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' parameter in JSON payload."}), 400

    raw_text = str(data["text"]).strip()
    if not raw_text:
        return jsonify({"error": "Article text cannot be empty."}), 400

    if len(raw_text) > MAX_TEXT_LENGTH:
        raw_text = raw_text[:MAX_TEXT_LENGTH]

    if not ml_service.is_ready():
        return jsonify({
            "error": "ML model is not loaded. Ensure 'train_model.py' has been executed."
        }), 503

    try:
        result = ml_service.predict(raw_text)
        result["disclaimer"] = DISCLAIMER_TEXT
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


@app.route("/explain", methods=["POST"])
def explain():
    """
    Dedicated endpoint for Gemini AI analysis and verification suggestions.
    """
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' parameter in JSON payload."}), 400

    raw_text = str(data["text"]).strip()
    if not raw_text:
        return jsonify({"error": "Article text cannot be empty."}), 400

    if len(raw_text) > MAX_TEXT_LENGTH:
        raw_text = raw_text[:MAX_TEXT_LENGTH]

    prediction = data.get("prediction", "UNVERIFIED")
    confidence = float(data.get("confidence", 0.50))
    top_keywords = data.get("top_keywords", [])

    try:
        explanation_data = gemini_service.generate_explanation(
            news_text=raw_text,
            ml_prediction=prediction,
            ml_confidence=confidence,
            top_keywords=top_keywords
        )
        explanation_data["disclaimer"] = DISCLAIMER_TEXT
        return jsonify(explanation_data), 200
    except Exception as e:
        return jsonify({"error": f"Explanation failed: {str(e)}"}), 500


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Primary Unified Endpoint:
    1. Preprocesses text
    2. Runs Machine Learning model (TF-IDF + Logistic Regression) -> REAL/FAKE + Confidence
    3. Invokes Google Gemini API to extract claims, summary, and verification guidance
       (without overriding the ML classification result)
    4. Returns unified response
    """
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request body."}), 400

    raw_text = str(data.get("text", "")).strip()
    if not raw_text:
        return jsonify({"error": "News article text cannot be empty."}), 400

    if len(raw_text) > MAX_TEXT_LENGTH:
        raw_text = raw_text[:MAX_TEXT_LENGTH]

    # Step 1 & 2: ML Model Inference
    if not ml_service.is_ready():
        ml_service.load_artifacts()
        if not ml_service.is_ready():
            return jsonify({
                "error": "ML model artifacts not found on server. Please run 'python train_model.py'."
            }), 503

    try:
        ml_result = ml_service.predict(raw_text)
    except Exception as e:
        return jsonify({"error": f"ML classification failed: {str(e)}"}), 500

    # Step 3: Generative AI Analysis (Gemini)
    # The application MUST still succeed even if Gemini fails or is unconfigured.
    explanation_result = gemini_service.generate_explanation(
        news_text=raw_text,
        ml_prediction=ml_result["prediction"],
        ml_confidence=ml_result["confidence"],
        top_keywords=ml_result.get("top_keywords", [])
    )

    # Step 4: Assemble consolidated response
    response_payload = {
        "prediction": ml_result["prediction"],
        "confidence": ml_result["confidence"],
        "probabilities": ml_result["probabilities"],
        "summary": explanation_result.get("summary", ""),
        "key_claims": explanation_result.get("key_claims", []),
        "suspicious_indicators": explanation_result.get("suspicious_indicators", []),
        "verification_suggestions": explanation_result.get("verification_suggestions", []),
        "explanation": explanation_result.get("explanation", ""),
        "ml_details": {
            "model": "Logistic Regression",
            "vectorizer": "TF-IDF (1-2 n-grams, sublinear_tf=True)",
            "cleaned_text": ml_result["cleaned_text"],
            "top_keywords": ml_result["top_keywords"],
            "ml_summary": ml_result["ml_summary"]
        },
        "gemini_source": explanation_result.get("source", "rule_based_fallback"),
        "is_fallback": explanation_result.get("is_fallback", False),
        "disclaimer": DISCLAIMER_TEXT
    }

    return jsonify(response_payload), 200


def run_server():
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"

    try:
        app.run(host="0.0.0.0", port=port, debug=debug)
    except OSError as e:
        if "Address already in use" in str(e) and port == 5000:
            print(f"[Notice] Port 5000 is occupied (often by macOS AirPlay Receiver). Falling back to port 5002.")
            app.run(host="0.0.0.0", port=5002, debug=debug)
        else:
            raise e


if __name__ == "__main__":
    run_server()
