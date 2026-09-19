# NewsLens AI — Fake News Detection & AI Explanation System

[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-green.svg)](https://palletsprojects.com/p/flask/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.x-orange.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API%20GenAI-8e75ff.svg)](https://aistudio.google.com/)

> **NewsLens AI** is a full-stack, production-ready AI application that unites **Classical Machine Learning** (TF-IDF Vectorization + Logistic Regression) for statistical classification with **Generative AI** (Google Gemini API) for objective article summarization, factual claim extraction, and independent fact-checking roadmaps.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Quick Start Guide (Local Setup)](#quick-start-guide-local-setup)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#environment-variables)
- [REST API Endpoints](#rest-api-endpoints)
- [Production Deployment Guide](#production-deployment-guide)
  - [Backend Deployment on Render](#backend-deployment-on-render)
  - [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
- [Git & GitHub Push Commands](#git--github-push-commands)
- [Interview Q&A Guide (B.Tech CSE / AI & ML)](#interview-qa-guide-btech-cse--ai--ml)
- [Limitations & Ethical Considerations](#limitations--ethical-considerations)
- [Future Enhancements](#future-enhancements)

---

## 🔎 Overview

In today's digital information landscape, misleading content and hyper-partisan disinformation propagate faster than traditional fact-checkers can verify. Modern language models are powerful, but relying on an LLM alone for fake news detection introduces severe challenges:
1. **Hallucinations & Stochastic Variability**: LLMs can hallucinate veracity judgments without consistent reproducibility.
2. **Inference Latency & Cost**: Calling frontier LLMs for every high-volume classification creates high latency and compute expense.
3. **Black-Box Confusion**: Users often do not know *why* an article was deemed fake or *what* to check next.

**NewsLens AI solves this by introducing a Decoupled Dual-Engine Architecture:**
- **Machine Learning Layer**: An L2-regularized **Logistic Regression** classifier trained on **TF-IDF $n$-grams** performs fast, reproducible, and mathematically calibrated binary classification (`REAL` vs `FAKE`).
- **Generative AI Layer**: The **Google Gemini API** does **not** classify or override the ML decision. Instead, it acts as an intelligent media advisor: generating a neutral summary, breaking down individual claims, identifying linguistic cues, and providing an actionable verification checklist.

> **Mandatory System Disclaimer:**
> *"This prediction is AI-generated and should not be treated as definitive fact-checking."*

---

## ✨ Key Features

- **Decoupled Prediction & Reasoning**: Machine Learning decides the label (`REAL` / `FAKE`); Generative AI explains the claims and context.
- **Calibrated Probability Scores**: Direct probabilistic confidence percentages derived from Logistic Regression `predict_proba()`.
- **Top Feature Attribution**: Real-time extraction of influential vocabulary tokens from the TF-IDF feature space.
- **Structured Gemini GenAI Insights**:
  - 2–3 sentence objective executive summary.
  - Granular factual claim decomposition.
  - Analysis of sensationalist rhetoric vs. journalistic patterns.
  - Interactive, step-by-step verification checklist.
- **Graceful Fallback Resilience**: If `GEMINI_API_KEY` is missing or the network experiences rate limits, the system seamlessly transitions to a rule-based analytical engine without interrupting ML classification.
- **Interactive React Dashboard**: Sleek dark-mode interface built with Tailwind CSS, Lucide icons, responsive confidence gauges, and interactive pre-loaded test samples.
- **Built-in Model Transparency Modal**: Exposes genuine test split metrics (Accuracy, Precision, Recall, F1, Confusion Matrix) directly from `metrics.json`.

---

## 🏛 System Architecture

```
User Input (Headline / Article)
             │
             ▼
   [Text Preprocessing]
   • Lowercasing & Regex Cleaning
   • HTML & URL Stripping
   • Contraction Expansion
   • Stopword Filtering
             │
             ├────────────────────────────────────────────────┐
             │                                                │
             ▼                                                ▼
  [TF-IDF Vectorization]                         [Google Gemini GenAI API]
  • 1-2 n-grams, sublinear TF                    • gemini-2.5-flash
  • 5,000 feature vocabulary                     • Strict neutral persona
             │                                   • Isolates factual assertions
             ▼                                   • Identifies sensational cues
  [Logistic Regression]                          • Outlines verification steps
  • Sigmoid probability function                  (Gemini CANNOT override ML)
             │                                                │
             ▼                                                │
     REAL / FAKE Label                                        │
     + Confidence Score                                       │
             │                                                │
             └───────────────────────┬────────────────────────┘
                                     │
                                     ▼
                           [Unified REST API]
                           Flask /analyze Endpoint
                                     │
                                     ▼
                           [React 18 Dashboard]
                   Real-time interactive visualization
```

---

## 🛠 Tech Stack

| Layer | Technologies | Role / Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance, responsive UI and single-page client |
| **Data Viz & Icons** | Recharts, Lucide React | Probability charts, confidence gauges, and UI icons |
| **Backend API** | Python 3, Flask, Flask-CORS | REST API handling text processing, ML, and LLM requests |
| **Server Runtime** | Gunicorn | Production WSGI HTTP server for Render deployment |
| **Machine Learning** | scikit-learn, joblib | TF-IDF vectorization, Logistic Regression classifier |
| **Data Processing** | pandas, NumPy, regex | Corpus ingestion, dataset splitting, cleaning |
| **Generative AI** | Google GenAI SDK (`google-genai`) | Gemini 2.5/1.5 Flash for summarization and fact-checking |
| **Hosting & CI/CD** | Vercel (Frontend), Render (Backend) | Cloud platform deployment ready with zero configuration |

---

## 📂 Project Directory Structure

```
fake_news_detection/
├── backend/
│   ├── app.py                     # Flask application & REST endpoints (/analyze, /health, etc.)
│   ├── train_model.py             # ML training, evaluation, and artifact serialization
│   ├── requirements.txt           # Python backend dependencies
│   ├── .env.example               # Template for environment variables
│   │
│   ├── data/
│   │   └── news_dataset.csv       # Training dataset (text, label: 0=REAL, 1=FAKE)
│   │
│   ├── model/
│   │   ├── fake_news_model.pkl    # Serialized Logistic Regression model
│   │   ├── tfidf_vectorizer.pkl   # Serialized TF-IDF Vectorizer
│   │   └── metrics.json           # Real evaluation metrics from held-out test split
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ml_service.py          # Singleton ML inference & feature extraction
│   │   └── gemini_service.py      # Google Gemini client & fallback engine
│   │
│   └── utils/
│       ├── __init__.py
│       └── text_preprocessing.py  # Regex cleaning, contraction expansion, stopword filtering
│
├── frontend/
│   ├── package.json               # Node.js dependencies (React, Vite, Tailwind, Recharts)
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind styling setup
│   ├── postcss.config.js          # PostCSS configuration
│   ├── index.html                 # HTML entry point
│   ├── vercel.json                # SPA routing rewrites for Vercel
│   ├── .env.example               # Frontend environment template (VITE_API_URL)
│   │
│   └── src/
│       ├── main.jsx               # React DOM root mounting
│       ├── App.jsx                # Main dashboard state & coordinator
│       ├── index.css              # Tailwind base & custom scrollbar styles
│       ├── components/
│       │   ├── Header.jsx         # Branding, backend health, and metrics trigger
│       │   ├── InputSection.jsx   # Textarea, word counter, and quick-sample cards
│       │   ├── PredictionCard.jsx # REAL/FAKE hero, confidence meter, probability breakdown
│       │   ├── GeminiExplanation.jsx # AI summary, claims, red flags, verification checklist
│       │   ├── ArchitecturePipeline.jsx # Dual-pipeline diagram & token inspection
│       │   ├── MetricsModal.jsx   # Test-split metrics viewer (Accuracy, Confusion Matrix)
│       │   └── Disclaimer.jsx     # AI fact-checking disclaimer banner
│       └── services/
│           └── api.js             # Fetch client with auto-fallback support
│
├── render.yaml                    # Render Infrastructure-as-Code blueprint
├── vercel.json                    # Root Vercel configuration
├── .gitignore                     # Git exclusion rules
└── README.md                      # Comprehensive project documentation & interview guide
```

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- **Python 3.9+** installed (`python3 --version`)
- **Node.js 18+** and **npm** installed (`node --version`)
- *(Optional)* A free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Backend Setup

Open a terminal and navigate to the project directory:

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install required packages
pip install --upgrade pip
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
```

*(Optional)* Add your Gemini API key in `backend/.env`:
```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
PORT=5000
FLASK_ENV=development
```
> **Note:** If `GEMINI_API_KEY` is not provided, the application will automatically run in **Rule-Based Fallback Mode**, providing full ML predictions and template analysis without errors!

**Train the Machine Learning Model:**
```bash
python train_model.py
```
*This processes `news_dataset.csv`, splits the data into 75% train / 25% test, trains the TF-IDF vectorizer and Logistic Regression model, computes genuine evaluation metrics, and saves `fake_news_model.pkl`, `tfidf_vectorizer.pkl`, and `metrics.json`.*

**Start the Flask Backend:**
```bash
python app.py
```
The server will start on `http://localhost:5000` (or `http://localhost:5002` if port 5000 is occupied by macOS AirPlay Receiver).

Verify health status:
```bash
curl http://localhost:5000/health
```

---

### 2. Frontend Setup

Open a **new** terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create local environment config
cp .env.example .env

# Start development server
npm run dev
```

Open your browser and visit:
```
http://localhost:3000
```
*(Or the URL printed in your Vite console, such as `http://localhost:5173`).*

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `GEMINI_API_KEY` | Optional | `""` | Google AI Studio API key for Gemini 2.5/1.5 Flash. If absent, fallback engine activates. |
| `PORT` | Optional | `5000` | Port for the Flask application. Automatically injected on Render. |
| `FLASK_ENV` | Optional | `development` | Environment mode (`development` or `production`). |

### Frontend (`frontend/.env`)
| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `VITE_API_URL` | Optional | `http://localhost:5000` | Target URL of the backend Flask server (set to Render URL in production). |

---

## 📡 REST API Endpoints

### 1. Unified Analysis: `POST /analyze` *(Primary)*
Runs both the ML classification and Gemini GenAI explanation in a single call.
- **Request Body**:
  ```json
  {
    "text": "NASA James Webb Space Telescope discovers atmospheric carbon dioxide on distant exoplanet."
  }
  ```
- **Response**:
  ```json
  {
    "prediction": "REAL",
    "confidence": 0.5633,
    "probabilities": {
      "real": 0.5633,
      "fake": 0.4367
    },
    "summary": "NASA's James Webb Space Telescope has identified carbon dioxide signatures in an exoplanetary atmosphere.",
    "key_claims": [
      "Atmospheric carbon dioxide detected on an exoplanet."
    ],
    "suspicious_indicators": [
      "No prominent disinformation red flags detected in lexical composition"
    ],
    "verification_suggestions": [
      "Confirm findings in peer-reviewed journals such as Nature or Astrophysical Journal.",
      "Check the official NASA exoplanet archive announcement."
    ],
    "explanation": "The statistical ML classifier evaluated this text as REAL with 56.3% confidence...",
    "ml_details": {
      "model": "Logistic Regression",
      "vectorizer": "TF-IDF (1-2 n-grams, sublinear_tf=True)",
      "cleaned_text": "nasa james webb space telescope discovers atmospheric carbon dioxide...",
      "top_keywords": ["carbon", "atmospheric", "dioxide"]
    },
    "gemini_source": "Google Gemini (gemini-2.5-flash)",
    "is_fallback": false,
    "disclaimer": "This prediction is AI-generated and should not be treated as definitive fact-checking."
  }
  ```

### 2. Fast ML Prediction Only: `POST /predict`
Used for high-throughput batch classification without invoking LLM tokens.
- **Request Body**: `{"text": "article content"}`
- **Response**: `{"prediction": "FAKE", "confidence": 0.88, "probabilities": {"real": 0.12, "fake": 0.88}}`

### 3. Explain Only: `POST /explain`
Passes text and optional prediction to Gemini for dedicated factual extraction.

### 4. Health & Readiness: `GET /health`
Returns backend service readiness, model load status, Gemini status, and evaluation metrics.

### 5. Evaluation Metrics: `GET /metrics`
Returns raw test evaluation scores and confusion matrix from `metrics.json`.

---

## 🌐 Production Deployment Guide

### Backend Deployment on Render

1. Create a free account at [render.com](https://render.com/).
2. Click **New +** $\rightarrow$ **Web Service** $\rightarrow$ Connect your GitHub repository: `anujdubey23/fake_news_detection`.
3. Configure the service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python train_model.py`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Key)*
   - `FLASK_ENV`: `production`
5. Click **Create Web Service**.
6. Note down your backend URL (e.g., `https://newslens-backend.onrender.com`).

*(Alternatively, connect via the included [`render.yaml`](file:///Users/anuj/Downloads/Student%20Performance%20system/fake_news_prediction_system/render.yaml) blueprint).*

---

### Frontend Deployment on Vercel

1. Create a free account at [vercel.com](https://vercel.com/).
2. Click **Add New...** $\rightarrow$ **Project** $\rightarrow$ Import your GitHub repository: `anujdubey23/fake_news_detection`.
3. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://newslens-backend.onrender.com` *(Your Render backend URL)*
5. Click **Deploy**. Your application will be live across worldwide edge networks!

---

## 📦 Git & GitHub Push Commands

To push this project to your repository (`anujdubey23/fake_news_detection`), execute the following commands from the project root:

```bash
# Initialize git repository (if not already initialized)
git init

# Add remote origin
git remote add origin https://github.com/anujdubey23/fake_news_detection.git

# Stage all files (respects .gitignore)
git add .

# Commit changes
git commit -m "feat: complete production-grade Fake News Detection & AI Explanation System"

# Ensure main branch and push
git branch -M main
git push -u origin main
```

---

## 🎓 Interview Q&A Guide (B.Tech CSE / AI & ML)

This section provides concise, technically rigorous answers to the most common interview questions about this project.

### 1. Why did you use TF-IDF?
**Answer:** TF-IDF (Term Frequency-Inverse Document Frequency) transforms unstructured textual data into a sparse numeric matrix by balancing how frequently a term appears in a document against how common it is across the entire corpus. In fake news detection, clickbait terms (e.g., *"shocking"*, *"miracle"*, *"bombshell"*) carry distinct statistical weight compared to neutral reporting terms (e.g., *"spokesperson"*, *"reuters"*, *"study"*). We utilized unigram and bigram ranges (`ngram_range=(1, 2)`) with `sublinear_tf=True` (logarithmic term frequency scaling $1 + \log(\text{tf})$) to dampen the dominance of repetitive words.

### 2. Why Logistic Regression?
**Answer:** Logistic Regression is an optimal baseline classifier for high-dimensional, sparse text vectors:
1. **Mathematical Interpretability**: The model learns a linear weight vector $w$. Positive coefficients point towards the FAKE class, while negative coefficients point towards REAL, enabling transparent feature attribution.
2. **True Probabilistic Confidence**: Via the sigmoid activation $\sigma(z) = \frac{1}{1 + e^{-z}}$, it outputs a true probability between $0$ and $1$, avoiding arbitrary thresholds.
3. **Efficiency & Low Overhead**: It trains in seconds, runs inference in sub-milliseconds, and does not require GPU acceleration.

### 3. Why not directly use Gemini or an LLM for fake news detection?
**Answer:** Directly relying on an LLM for binary veracity classification has three significant drawbacks:
1. **Hallucination Risk & Inconsistency**: LLMs lack an internal real-time fact database and may generate contradictory answers when prompted with different phrasings.
2. **High Latency & Cost**: In a production setting processing thousands of news feeds per minute, calling an external LLM for every single article is cost-prohibitive and slow (1–3 seconds vs. <5ms for Logistic Regression).
3. **Decoupled Architecture**: By allowing the statistical ML model to make the classification and reserving the LLM strictly for explanation and claim decomposition, we combine deterministic speed with generative reasoning.

### 4. What is the role of Generative AI in your system?
**Answer:** Google Gemini serves as an **Explanatory and Analytical Layer**. It receives the raw article alongside the ML prediction and performs tasks that classical models cannot do:
- Synthesizing an objective executive summary.
- Extracting specific factual claims for human fact-checkers.
- Highlighting rhetorical cues (such as sensationalism, absence of sources, or appeals to emotion).
- Generating an actionable verification checklist directing users to authoritative primary sources.
**Crucially, Gemini is explicitly constrained not to override the ML prediction.**

### 5. How does TF-IDF mathematically work?
**Answer:**
$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$
Where:
- $\text{TF}(t, d) = 1 + \log(f_{t, d})$ (sublinear scaling).
- $\text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$ (smooth IDF).
Features are subsequently normalized using Euclidean ($L_2$) norm:
$$\hat{v} = \frac{v}{\|v\|_2}$$

### 6. How does Logistic Regression classify text?
**Answer:** Logistic Regression computes a linear combination of the input TF-IDF feature vector $x$ with learned weights $w$ and bias $b$:
$$z = w^T x + b = \sum_{i=1}^{n} w_i x_i + b$$
The log-odds $z$ are passed through the sigmoid (logistic) function:
$$P(Y = 1 | x) = \sigma(z) = \frac{1}{1 + e^{-z}}$$
If $P(Y = 1 | x) \ge 0.5$, the prediction is `FAKE` (1); otherwise, it is `REAL` (0).

### 7. How did you calculate confidence?
**Answer:** Confidence is obtained directly from scikit-learn's `model.predict_proba(X)`:
$$\text{Confidence} = \max\left(P(\text{REAL}), P(\text{FAKE})\right)$$
For example, if the predicted class is `FAKE` with probability $0.87$ and `REAL` has probability $0.13$, the confidence score displayed is $87.0\%$.

### 8. How does Gemini integrate with Flask?
**Answer:** The Flask backend communicates with the Google GenAI SDK (`google-genai`). When a user submits an article, the endpoint `/analyze`:
1. Executes `ml_service.predict(text)`.
2. Assembles a structured prompt containing the text and the ML prediction.
3. Calls Gemini (`gemini-2.5-flash`) requesting a strictly formatted JSON response.
4. Cleans any markdown formatting, parses the JSON payload, and merges it with the ML result into a single unified response.

### 9. How is the API secured?
**Answer:**
1. **Zero Frontend Secret Exposure**: The `GEMINI_API_KEY` is strictly confined to the backend environment variables; the React frontend never touches or stores API secrets.
2. **CORS Validation**: Cross-Origin Resource Sharing is explicitly managed via `Flask-CORS`.
3. **Payload Sanitization**: Inputs are typed, stripped, and capped at 25,000 characters to prevent denial-of-service (DoS) memory exhaustion.
4. **Environment Isolation**: Production credentials are differentiated using `.env` and excluded from source control via `.gitignore`.

### 10. How would you improve the model?
**Answer:**
1. **Pretrained Transformer Embeddings**: Fine-tune a domain-adapted language model such as **RoBERTa-fake-news** or **DeBERTa** to capture deep contextual semantics beyond n-gram statistics.
2. **Publisher Credibility Graph**: Incorporate metadata such as domain reputation, author credentials, and domain age.
3. **Retrieval-Augmented Generation (RAG)**: Query external live news APIs (e.g., NewsAPI, Google Fact Check Tools API) to ground claims against verified databases.

### 11. What are the limitations?
**Answer:**
- **Lexical Bias**: Classical TF-IDF relies on vocabulary patterns; sophisticated propaganda written in calm, formal language may slip past lexical indicators.
- **Probabilistic Nature**: An ML prediction is statistical evidence, not legal or definitive fact-checking.
- **Dataset Size**: Small starter datasets can overfit specific topics; replacing them with datasets like WELFake or ISOT is recommended for production scale.

### 12. Why React + Flask?
**Answer:**
- **Separation of Concerns**: Decouples the presentation layer from the compute-intensive ML/LLM backend.
- **Independent Scaling**: The frontend is a static bundle hosted on Vercel's global CDN (sub-second TTFB), while the Flask backend runs as an elastic service on Render.
- **Developer Productivity**: React allows componentized, state-driven UI (dynamic confidence meters, checklists), while Flask offers lightweight Python integration for scikit-learn and Google GenAI.

### 13. How did you deploy it?
**Answer:**
- **Backend (Render)**: Containerized/virtualized via Gunicorn WSGI (`gunicorn app:app --bind 0.0.0.0:$PORT`). The build script installs dependencies and automatically trains the model if artifacts are missing.
- **Frontend (Vercel)**: Built with `npm run build` using Vite. Output static files in `dist/` are served with single-page routing rewrites defined in `vercel.json`.

---

## ⚠️ Limitations & Ethical Considerations

1. **Not a Substitute for Fact-Checkers**: NewsLens AI provides probabilistic indications and research assistance. It must not be cited as definitive legal proof of truth or falsehood.
2. **Corpus Drift**: As disinformation tactics evolve, static models must be periodically retrained with active learning pipelines.
3. **Generative Model Nuances**: While prompted for neutrality, LLMs can occasionally display biases or make inaccurate inferences regarding niche historical contexts.

---

## 🔮 Future Enhancements

- [ ] **RAG Fact-Checking**: Integrate Google Fact Check API and Wikipedia API to retrieve live verification references.
- [ ] **Transformer Fine-Tuning**: Add an optional switch to toggle between fast Logistic Regression and a fine-tuned DistilBERT model.
- [ ] **Multilingual Detection**: Support Hindi, Spanish, and European languages via mBERT and multilingual stopword processing.
- [ ] **Chrome Browser Extension**: A one-click extension allowing users to highlight text on any webpage and receive an instant NewsLens inspection.

---

## 👨‍💻 Author & Repository

- **Project Developer**: Anuj Dubey
- **GitHub Repository**: [anujdubey23/fake_news_detection](https://github.com/anujdubey23/fake_news_detection)
- **Course**: Generative AI / B.Tech Computer Science & Engineering (AI & ML)
