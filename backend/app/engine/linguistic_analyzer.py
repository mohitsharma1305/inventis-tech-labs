"""
Linguistic Intent & Psychological Pattern Analyzer.
Identifies urgency, coercive threats, greed traps, and credential solicitation
as formulated in Salloum et al. (2022) and Mishra & Soni (2022).
"""

import re
from typing import List, Tuple, Dict
from ..config import (
    URGENCY_PATTERNS,
    COERCION_FEAR_PATTERNS,
    GREED_REWARD_PATTERNS,
    CREDENTIAL_HARVESTING_PATTERNS
)
from ..models.schemas import TriggerSpan, FactorDetail

# Safe Context Dampeners (e.g., genuine transactional bank message saying 'Do not share OTP')
GENUINE_SAFETY_DISCLAIMER_PATTERN = re.compile(
    r"\b(do\s+not\s+share\s+(this\s+)?(otp|password|pin)|never\s+share\s+otp|bank\s+never\s+asks\s+for)\b",
    re.IGNORECASE
)

BENIGN_ACADEMIC_PATTERN = re.compile(
    r"\b(orientation|seminar|auditorium|circular|students\s+are\s+informed|principal|hod|ieee\s+student\s+branch)\b",
    re.IGNORECASE
)

def analyze_linguistic_patterns(text: str) -> Tuple[float, List[TriggerSpan], List[FactorDetail]]:
    """
    Analyzes psychological vectors and returns:
    (linguistic_score [0.0 - 1.0], trigger_spans, contributing_factors)
    """
    triggers: List[TriggerSpan] = []
    factors: List[FactorDetail] = []
    text_lower = text.lower()

    urgency_hits = 0
    coercion_hits = 0
    greed_hits = 0
    credential_hits = 0

    # 1. Scan Urgency Patterns
    for pattern in URGENCY_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            urgency_hits += 1
            triggers.append(TriggerSpan(
                text=match.group(0),
                start=match.start(),
                end=match.end(),
                category="urgency"
            ))

    if urgency_hits > 0:
        pts = min(0.35, 0.15 + (urgency_hits * 0.10))
        factors.append(FactorDetail(
            category="Psychological Urgency",
            name="Artificial Time Scarcity",
            description=f"Detected {urgency_hits} deadline or urgency cues designed to panic the victim into hasty compliance.",
            severity="critical" if urgency_hits > 1 else "warning",
            points=pts
        ))

    # 2. Scan Coercion & Fear Patterns
    for pattern in COERCION_FEAR_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            coercion_hits += 1
            triggers.append(TriggerSpan(
                text=match.group(0),
                start=match.start(),
                end=match.end(),
                category="coercion"
            ))

    if coercion_hits > 0:
        pts = min(0.40, 0.20 + (coercion_hits * 0.10))
        factors.append(FactorDetail(
            category="Coercion & Intimidation",
            name="Threat of Penalty or Disconnection",
            description=f"Detected {coercion_hits} threats of legal action, account suspension, or power disconnection.",
            severity="critical",
            points=pts
        ))

    # 3. Scan Greed / Incentive Traps
    for pattern in GREED_REWARD_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            greed_hits += 1
            triggers.append(TriggerSpan(
                text=match.group(0),
                start=match.start(),
                end=match.end(),
                category="greed"
            ))

    if greed_hits > 0:
        pts = min(0.35, 0.15 + (greed_hits * 0.10))
        factors.append(FactorDetail(
            category="Financial Lure",
            name="Unrealistic Reward or Job Offer",
            description=f"Detected {greed_hits} lottery, unverified cashback, or high-payout part-time job lures.",
            severity="warning",
            points=pts
        ))

    credential_text = list(text)
    for disclaimer in GENUINE_SAFETY_DISCLAIMER_PATTERN.finditer(text):
        credential_text[disclaimer.start():disclaimer.end()] = ' ' * (disclaimer.end()-disclaimer.start())
    credential_text = ''.join(credential_text)

    # 4. Scan Credential & Sensitive Harvesting
    for pattern in CREDENTIAL_HARVESTING_PATTERNS:
        for match in re.finditer(pattern, credential_text, re.IGNORECASE):
            credential_hits += 1
            triggers.append(TriggerSpan(
                text=match.group(0),
                start=match.start(),
                end=match.end(),
                category="credential"
            ))

    # Check for genuine safety disclaimer (e.g. "Do not share OTP")
    has_disclaimer = bool(GENUINE_SAFETY_DISCLAIMER_PATTERN.search(text))
    has_academic = bool(BENIGN_ACADEMIC_PATTERN.search(text))

    if credential_hits > 0:
        if has_disclaimer and not re.search(r"\b(enter|submit|send|provide|share|verify|update|login)\b", GENUINE_SAFETY_DISCLAIMER_PATTERN.sub("", text), re.I):
            # Genuine security advice included by bank
            factors.append(FactorDetail(
                category="Security Warning Included",
                name="Legitimate OTP Warning",
                description="Message includes official security notice advising user NOT to disclose credentials.",
                severity="info",
                points=-0.25
            ))
        else:
            pts = min(0.45, 0.25 + (credential_hits * 0.10))
            factors.append(FactorDetail(
                category="Credential Harvesting",
                name="Sensitive Information Solicitation",
                description="Requests entry of OTP, PAN, Aadhaar KYC, or banking credentials.",
                severity="critical",
                points=pts
            ))

    # Compute raw linguistic score
    raw_score = sum(f.points for f in factors)

    # Benign dampeners
    if has_academic and raw_score < 0.3:
        raw_score = max(0.0, raw_score - 0.2)

    linguistic_score = min(1.0, max(0.0, raw_score))

    # Sort triggers by start index
    triggers.sort(key=lambda t: t.start)

    return round(linguistic_score, 2), triggers, factors
