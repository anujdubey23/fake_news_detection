import json
import os
import re
from typing import Any, Dict, List, Optional

# Attempt to import modern Google GenAI SDK (recommended), fall back to legacy if necessary
try:
    from google import genai
    from google.genai import types as genai_types
    MODERN_SDK = True
except ImportError:
    try:
        import google.generativeai as legacy_genai
        MODERN_SDK = False
    except ImportError:
        MODERN_SDK = None


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.client = None
        self.client_ready = False

        if self.api_key:
            self._init_client()

    def _init_client(self):
        try:
            if MODERN_SDK is True:
                self.client = genai.Client(api_key=self.api_key)
                self.client_ready = True
            elif MODERN_SDK is False:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=self.api_key)
                self.client_ready = True
        except Exception as e:
            print(f"[GeminiService] Failed to configure Gemini client: {e}")
            self.client_ready = False

    def is_configured(self) -> bool:
        # Re-check in case environment variable was updated dynamically
        if not self.client_ready:
            key = os.getenv("GEMINI_API_KEY", "").strip()
            if key and key != self.api_key:
                self.api_key = key
                self._init_client()
        return bool(self.api_key and self.client_ready)

    def generate_explanation(
        self,
        news_text: str,
        ml_prediction: str,
        ml_confidence: float,
        top_keywords: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generates an AI-driven explanation, summary, factual claim extraction,
        and verification suggestions using Google Gemini.

        CRITICAL ARCHITECTURAL PRINCIPLE:
        Gemini NEVER overrides the ML model's REAL/FAKE prediction. It serves
        purely as an explanatory, fact-checking guidance layer.
        """
        if not self.is_configured():
            return self._generate_fallback(
                news_text=news_text,
                ml_prediction=ml_prediction,
                ml_confidence=ml_confidence,
                top_keywords=top_keywords,
                reason="GEMINI_API_KEY is not set or unconfigured in environment variables."
            )

        prompt = f"""
You are an expert, neutral media analyst and fact-checking advisor assisting a fake news detection system.

A Machine Learning model (TF-IDF + Logistic Regression) has classified the following news text.

[ML CLASSIFICATION RESULT]
- Prediction: {ml_prediction}
- Confidence: {ml_confidence * 100:.1f}%
- Notable Lexical Tokens: {', '.join(top_keywords or [])}

[NEWS TEXT TO ANALYZE]
\"\"\"{news_text}\"\"\"

[INSTRUCTIONS]
1. DO NOT override or dispute the ML model's prediction. Your role is strictly analytical and explanatory.
2. Maintain an objective, professional, neutral journalistic tone.
3. NEVER state definitively that the article is 'guaranteed fake' or '100% true'. Use calibrated advisory phrasing such as:
   "The ML model classified this article as {ml_prediction} with {ml_confidence * 100:.1f}% confidence. The following claims should be independently cross-referenced..."
4. Provide your response as a valid JSON object matching this exact schema:
{{
  "summary": "2-3 sentence neutral objective summary of the main points.",
  "key_claims": [
    "Specific factual assertion 1",
    "Specific factual assertion 2",
    "Specific factual assertion 3"
  ],
  "explanation": "Detailed explanation of linguistic cues, sensationalist patterns, sourcing credibility, or authentic reporting structures that align with the ML model's assessment.",
  "suspicious_indicators": [
    "Specific indicator or potential red flag (or 'None prominent' if real)"
  ],
  "verification_suggestions": [
    "Actionable step 1 for independent cross-verification",
    "Actionable step 2 for checking authoritative registries/sources",
    "Actionable step 3 for reverse-checking claims"
  ]
}}

Return ONLY the raw JSON object, without markdown formatting or surrounding explanation.
"""

        try:
            response_text = ""
            model_name = "gemini-2.5-flash"

            if MODERN_SDK is True and self.client is not None:
                # Modern google-genai SDK
                try:
                    response = self.client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=prompt,
                    )
                    response_text = response.text or ""
                except Exception:
                    # Fallback to gemini-1.5-flash if gemini-2.5-flash is not available for the tier
                    model_name = "gemini-1.5-flash"
                    response = self.client.models.generate_content(
                        model="gemini-1.5-flash",
                        contents=prompt,
                    )
                    response_text = response.text or ""

            elif MODERN_SDK is False:
                # Legacy google.generativeai SDK
                import google.generativeai as legacy_genai
                model = legacy_genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                response_text = response.text or ""
                model_name = "gemini-1.5-flash (legacy)"

            response_text = response_text.strip()
            # Clean possible markdown json fences
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            parsed = json.loads(response_text.strip())

            return {
                "source": f"Google Gemini ({model_name})",
                "summary": parsed.get("summary", "No summary generated."),
                "key_claims": parsed.get("key_claims", []),
                "explanation": parsed.get("explanation", ""),
                "suspicious_indicators": parsed.get("suspicious_indicators", []),
                "verification_suggestions": parsed.get("verification_suggestions", []),
                "is_fallback": False
            }

        except Exception as e:
            print(f"[GeminiService] API generation failed: {e}")
            return self._generate_fallback(
                news_text=news_text,
                ml_prediction=ml_prediction,
                ml_confidence=ml_confidence,
                top_keywords=top_keywords,
                reason=f"Gemini API request error: {str(e)}"
            )

    def _generate_fallback(
        self,
        news_text: str,
        ml_prediction: str,
        ml_confidence: float,
        top_keywords: Optional[List[str]] = None,
        reason: str = ""
    ) -> Dict[str, Any]:
        """Graceful rule-based analytical fallback when Gemini API is unavailable."""
        sentences = [s.strip() for s in re.split(r"[.!?]", news_text) if s.strip()]
        summary = " ".join(sentences[:2]) if sentences else news_text[:160] + "..."

        if ml_prediction == "FAKE":
            explanation = (
                f"The statistical ML classifier flagged this text as FAKE with {ml_confidence * 100:.1f}% confidence. "
                f"The text exhibits sensationalist vocabulary, emotionally charged assertions, or high-weight trigger terms "
                f"({', '.join(top_keywords or ['unverified statements'])}) commonly observed in misleading or clickbait media."
            )
            suspicious_indicators = [
                "Presence of emotive or sensationalist vocabulary",
                "Absence of primary peer-reviewed or verifiable institutional citations",
                "High statistical resonance with historical disinformation patterns"
            ]
            verification_suggestions = [
                "Cross-check key assertions with established news wire services (e.g. Reuters, Associated Press)",
                "Search international fact-checking databases such as Snopes or PolitiFact",
                "Inspect official agency press rooms to verify if any formal announcements were released"
            ]
        else:
            explanation = (
                f"The statistical ML classifier evaluated this text as REAL with {ml_confidence * 100:.1f}% confidence. "
                f"The linguistic structure demonstrates objective terminology, institutional or empirical references "
                f"({', '.join(top_keywords or ['formal reporting'])}), and neutral framing characteristic of authentic journalism."
            )
            suspicious_indicators = [
                "No prominent disinformation red flags detected in lexical composition"
            ]
            verification_suggestions = [
                "Confirm that the reporting agency or author has established subject-matter credentials",
                "Review corroborating coverage across independent mainstream publications",
                "Verify publication timestamps and context to ensure information is current"
            ]

        key_claims = sentences[:3] if sentences else [news_text[:100]]

        return {
            "source": "Rule-Based Analytical Fallback",
            "summary": summary,
            "key_claims": key_claims,
            "explanation": explanation,
            "suspicious_indicators": suspicious_indicators,
            "verification_suggestions": verification_suggestions,
            "is_fallback": True,
            "fallback_reason": reason
        }
