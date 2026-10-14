"""
Hybrid Composite Risk Scoring Engine (Li et al. 2026 & Kalniņa et al. 2026).
Synthesizes machine learning text probabilities, lexical URL indicators,
and brand impersonation signals into a calibrated 0-100 risk score.
"""

from typing import Tuple, Dict, Any, Optional
from ..config import (
    RISK_THRESHOLD_SAFE,
    RISK_THRESHOLD_SUSPICIOUS,
    RISK_THRESHOLD_CRITICAL,
    WEIGHT_TEXT_DEFAULT,
    WEIGHT_URL_DEFAULT,
    WEIGHT_BRAND_DEFAULT,
    WEIGHT_TEXT_NO_URL,
    WEIGHT_BRAND_NO_URL
)

def compute_composite_risk(
    text_prob: float,
    linguistic_score: float,
    url_score: Optional[float] = None,
    brand_score: float = 0.0,
    has_critical_credential_harvesting: bool = False
) -> Tuple[int, str, Dict[str, Any]]:
    """
    Computes unified risk score [0 - 100] and risk category (SAFE, SUSPICIOUS, CRITICAL).
    """
    # Blended text score: 50% statistical ML model + 50% deterministic linguistic heuristics
    blended_text_score = (0.50 * text_prob) + (0.50 * linguistic_score)

    if url_score is not None:
        # Standard full tri-factor scoring
        raw_score = (
            (WEIGHT_TEXT_DEFAULT * blended_text_score) +
            (WEIGHT_URL_DEFAULT * url_score) +
            (WEIGHT_BRAND_DEFAULT * brand_score)
        )
    else:
        # Dual-factor scoring when no URL exists
        raw_score = (
            (WEIGHT_TEXT_NO_URL * blended_text_score) +
            (WEIGHT_BRAND_NO_URL * brand_score)
        )

    # Floor overrides for high-confidence attack combinations:
    # 1. Impersonation of major bank + unauthorized domain -> At least 78 (CRITICAL)
    if brand_score >= 0.85 and (url_score is not None and url_score >= 0.30):
        raw_score = max(raw_score, 0.82)

    # 2. Credential harvesting + high urgency -> At least 75 (CRITICAL)
    if has_critical_credential_harvesting and linguistic_score >= 0.50:
        raw_score = max(raw_score, 0.76)

    # Convert to 0-100 integer
    risk_score = int(round(raw_score * 100))
    risk_score = min(100, max(0, risk_score))

    # Determine Risk Classification Band
    if risk_score <= RISK_THRESHOLD_SAFE:
        risk_level = "SAFE"
    elif risk_score <= RISK_THRESHOLD_SUSPICIOUS:
        risk_level = "SUSPICIOUS"
    else:
        risk_level = "CRITICAL"

    breakdown = {
        "text_contribution": round(blended_text_score, 2),
        "url_contribution": round(url_score, 2) if url_score is not None else None,
        "brand_contribution": round(brand_score, 2),
        "final_raw": round(raw_score, 3)
    }

    return risk_score, risk_level, breakdown
