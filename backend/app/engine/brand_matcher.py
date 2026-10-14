"""
Brand Impersonation & Typosquatting Detection Engine.
Identifies when an attacker invokes a trusted brand (e.g., SBI, HDFC, Paytm, SKIT)
while providing an unauthorized, foreign, or typosquatted domain.
"""

import re
from typing import Optional, Tuple, List
from ..config import TARGET_BRANDS

def levenshtein_distance(s1: str, s2: str) -> int:
    """Computes standard edit distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def detect_brand_impersonation(text: str, domain: Optional[str] = None) -> Tuple[Optional[str], float, List[str]]:
    """
    Evaluates whether the message claims to represent a brand while steering
    traffic to an unverified or typosquatted destination.
    Returns: (brand_name, impersonation_score [0.0 - 1.0], reasons)
    """
    reasons = []
    text_lower = text.lower()
    matched_brand = None
    max_impersonation_score = 0.0

    domain_lower = (domain or "").lower()

    for brand, legit_domains in TARGET_BRANDS.items():
        # Check brand name tokens in text
        brand_tokens = [tok.lower() for tok in re.split(r"[\s/()]+", brand) if len(tok) >= 3]
        brand_in_text = any(tok in text_lower for tok in brand_tokens)

        # Check brand name tokens in unverified domain
        brand_in_domain = any(tok in domain_lower for tok in brand_tokens)

        if brand_in_text or brand_in_domain:
            matched_brand = brand

            # If there is a domain provided, check whether it is in the authorized whitelist
            if domain_lower:
                is_authorized = any(domain_lower == d or domain_lower.endswith("." + d) for d in legit_domains)

                if is_authorized:
                    # Legitimate domain match! Score remains 0 for impersonation
                    return brand, 0.0, [f"Verified domain for {brand} ({domain_lower})"]
                else:
                    # Brand mentioned, but destination domain is NOT authorized
                    max_impersonation_score = 0.85
                    reasons.append(
                        f"Message references '{brand}', but link points to unauthorized domain '{domain_lower}'"
                    )

                    # Check for typosquatting / lookalike domain
                    for legit in legit_domains:
                        legit_core = legit.split(".")[0]
                        domain_core = domain_lower.split(".")[0]
                        dist = levenshtein_distance(domain_core, legit_core)
                        if 1 <= dist <= 2:
                            max_impersonation_score = 1.0
                            reasons.append(
                                f"Typosquatting alert: Hostname '{domain_core}' closely mimics '{legit_core}' (edit distance: {dist})"
                            )
                            break
            else:
                # Brand claimed in text without verifiable domain (e.g. asking for OTP / phone call)
                max_impersonation_score = 0.40
                reasons.append(f"Message claims affiliation with '{brand}' without verifiable sender authorization")

            break

    return matched_brand, max_impersonation_score, reasons
