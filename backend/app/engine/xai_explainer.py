"""
Explainable AI (XAI) & Actionable Guidance Generator (SmishX, Wang et al. 2025).
Produces human-understandable factor breakdowns and context-specific safety advice.
"""

from typing import List, Optional, Tuple
from ..models.schemas import FactorDetail, UrlAnalysisResult

def generate_explanation_and_guidance(
    risk_level: str,
    risk_score: int,
    factors: List[FactorDetail],
    brand: Optional[str] = None,
    url_result: Optional[UrlAnalysisResult] = None
) -> Tuple[str, str, bool]:
    """
    Returns: (summary_explanation, recommended_action, interstitial_warning_needed)
    """
    warning_needed = False

    if risk_level == "CRITICAL":
        warning_needed = True
        reasons_summary = []
        if brand:
            reasons_summary.append(f"deceptive impersonation targeting {brand}")
        if url_result and (url_result.suspicious_tld or url_result.is_shortener or url_result.is_ip_host):
            reasons_summary.append("unverified/obfuscated link infrastructure")

        urgency_factor = any(f.category == "Psychological Urgency" for f in factors)
        cred_factor = any(f.category == "Credential Harvesting" for f in factors)

        if urgency_factor:
            reasons_summary.append("coercive artificial urgency")
        if cred_factor:
            reasons_summary.append("sensitive credential harvesting (OTP/KYC)")

        joined_reasons = ", ".join(reasons_summary) if reasons_summary else "multiple high-risk anomalies"
        summary = (
            f"High-confidence threat detected (Risk Score: {risk_score}/100). "
            f"The content exhibits {joined_reasons} characteristic of social engineering."
        )

        recommended_action = (
            "DO NOT click links, download attachments, or share OTPs/passwords. "
            "If claiming to be a bank or service, verify via official apps only. "
            "Report fraudulent numbers to Chakshu (sancharsaathi.gov.in) or dial National Cyber Crime Helpline 1930."
        )

    elif risk_level == "SUSPICIOUS":
        # Warning shown if link is present or medium risk
        warning_needed = (url_result is not None)
        summary = (
            f"Suspicious indicators detected (Risk Score: {risk_score}/100). "
            "While not definitively confirmed as malicious, certain linguistic patterns or link elements deviate from standard communications."
        )
        recommended_action = (
            "Exercise caution. Do not input credentials or authorize payments. "
            "Double-check sender address and verify links through trusted search engines before proceeding."
        )

    else:  # SAFE
        summary = (
            f"Content verified as Low Risk (Risk Score: {risk_score}/100). "
            "No aggressive phishing vectors, deceptive brand impersonation, or malicious URL signatures were detected."
        )
        recommended_action = (
            "Standard security hygiene applies. Always verify sender identity when sharing personal information."
        )

    return summary, recommended_action, warning_needed
