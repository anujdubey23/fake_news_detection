import json
import os
import sys
from pathlib import Path
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split

# Ensure backend root is on sys.path for direct script execution
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from utils.text_preprocessing import clean_text


def train():
    data_path = BASE_DIR / "data" / "news_dataset.csv"
    model_dir = BASE_DIR / "model"
    model_dir.mkdir(parents=True, exist_ok=True)

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)

    # Basic data validation
    if "text" not in df.columns or "label" not in df.columns:
        raise ValueError("Dataset must contain 'text' and 'label' columns.")

    # Drop missing values
    initial_count = len(df)
    df = df.dropna(subset=["text", "label"])
    df["label"] = df["label"].astype(int)
    print(f"Loaded {len(df)} valid records (dropped {initial_count - len(df)} nulls).")
    print(f"Class distribution: REAL (0) = {(df['label'] == 0).sum()}, FAKE (1) = {(df['label'] == 1).sum()}")

    # Apply text cleaning
    print("Preprocessing text data...")
    df["cleaned_text"] = df["text"].apply(clean_text)

    # Filter out records where text became completely empty after cleaning
    df = df[df["cleaned_text"].str.strip().str.len() > 0]

    X = df["cleaned_text"]
    y = df["label"]

    # Stratified Train/Test Split (75% train, 25% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    print(f"Dataset split: {len(X_train)} train samples, {len(X_test)} test samples.")

    # TF-IDF Vectorizer with unigrams and bigrams
    print("Fitting TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Train Logistic Regression Classifier
    print("Training Logistic Regression classifier...")
    model = LogisticRegression(solver='liblinear', C=1.0, max_iter=1000, random_state=42)
    model.fit(X_train_tfidf, y_train)

    # Evaluate on unseen test split
    print("Evaluating model performance on test split...")
    y_pred = model.predict(X_test_tfidf)
    y_proba = model.predict_proba(X_test_tfidf)

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "dataset_size": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_real_pred_real": cm[0][0],
            "true_real_pred_fake": cm[0][1],
            "true_fake_pred_real": cm[1][0],
            "true_fake_pred_fake": cm[1][1],
            "raw_matrix": cm
        },
        "model_type": "Logistic Regression",
        "vectorizer_type": "TF-IDF (1-2 n-grams, sublinear_tf=True)",
        "classes": {"0": "REAL", "1": "FAKE"},
        "note": "Metrics computed strictly on held-out test split (25%). Replace news_dataset.csv with larger Kaggle/WELFake datasets for scaled deployment."
    }

    # Save artifacts using joblib and json
    model_path = model_dir / "fake_news_model.pkl"
    vec_path = model_dir / "tfidf_vectorizer.pkl"
    metrics_path = model_dir / "metrics.json"

    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vec_path)
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("\n--- Model Training & Evaluation Summary ---")
    print(f"Accuracy : {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall   : {metrics['recall']:.4f}")
    print(f"F1-Score : {metrics['f1_score']:.4f}")
    print(f"Confusion Matrix (TN, FP / FN, TP):\n{cm}")
    print(f"\nArtifacts saved successfully:")
    print(f" -> {model_path}")
    print(f" -> {vec_path}")
    print(f" -> {metrics_path}")


if __name__ == "__main__":
    train()
