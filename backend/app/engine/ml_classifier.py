"""
Machine Learning Text Classification Module (Salloum et al. 2022).
Implements TF-IDF vectorization and Logistic Regression classifier.
Provides deterministic, sub-millisecond inference and calibrated probability scores.
"""

import os
import json
import logging
from typing import Tuple, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

logger = logging.getLogger(__name__)

class MLPhishingClassifier:
    def __init__(self):
        self.model: Pipeline = None
        self._init_model()

    def _init_model(self):
        """Initializes and trains the baseline classifier on the curated benchmark dataset."""
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "seed_corpus.json")
        model_cache_path = os.path.join(os.path.dirname(__file__), "..", "data", "cached_model.joblib")

        # Try to load existing model
        if os.path.exists(model_cache_path):
            try:
                self.model = joblib.load(model_cache_path)
                logger.info("Loaded cached ML model successfully.")
                return
            except Exception as e:
                logger.warning(f"Could not load cached model: {e}. Retraining...")

        # Train new pipeline
        try:
            with open(data_path, "r", encoding="utf-8") as f:
                corpus = json.load(f)

            texts = [item["text"] for item in corpus]
            labels = [item["label"] for item in corpus]

            self.model = Pipeline([
                ("tfidf", TfidfVectorizer(
                    ngram_range=(1, 2),
                    max_features=2500,
                    sublinear_tf=True
                )),
                ("clf", LogisticRegression(
                    C=1.5,
                    solver="liblinear",
                    random_state=42
                ))
            ])

            self.model.fit(texts, labels)
            joblib.dump(self.model, model_cache_path)
            logger.info(f"Model trained and cached on {len(texts)} benchmark samples.")
        except Exception as e:
            logger.error(f"Failed to train ML model: {e}")
            self.model = None

    def predict_phishing_probability(self, text: str) -> Tuple[float, Dict[str, Any]]:
        """
        Returns (phishing_probability [0.0 - 1.0], explanation_metadata)
        """
        if not self.model:
            return 0.5, {"status": "model_uninitialized"}

        try:
            # Predict probabilities [P(legit), P(phishing)]
            probs = self.model.predict_proba([text])[0]
            phishing_prob = float(probs[1])

            # Extract top contributing TF-IDF tokens
            vectorizer = self.model.named_steps["tfidf"]
            classifier = self.model.named_steps["clf"]

            feature_names = vectorizer.get_feature_names_out()
            coefs = classifier.coef_[0]

            transformed = vectorizer.transform([text]).toarray()[0]
            token_scores = []
            for idx, count in enumerate(transformed):
                if count > 0:
                    weight = coefs[idx] * count
                    token_scores.append((feature_names[idx], weight))

            # Sort tokens by positive phishing influence
            token_scores.sort(key=lambda x: x[1], reverse=True)
            top_influential_tokens = [tok for tok, score in token_scores[:5] if score > 0]

            return round(phishing_prob, 3), {
                "top_tokens": top_influential_tokens,
                "model_type": "TF-IDF + Logistic Regression"
            }
        except Exception as e:
            logger.error(f"Inference error: {e}")
            return 0.5, {"error": str(e)}

# Singleton instance
classifier_instance = MLPhishingClassifier()
