"""
URL & Domain Analysis Engine based on Sahoo et al. (2017).
Extracts lexical, structural, entropy, and domain-reputation indicators.
"""

import math
import re
from urllib.parse import urlparse
from typing import Tuple, List, Optional
from ..config import SUSPICIOUS_TLDS, KNOWN_URL_SHORTENERS
from ..models.schemas import UrlAnalysisResult

IPV4_PATTERN = re.compile(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$")
URL_REGEX = re.compile(
    r"(?:https?://|www\.)[^\s/$.?#].[^\s]*|"
    r"\b[a-zA-Z0-9-]+\.(?:com|org|net|in|top|xyz|live|online|edu|ac\.in|gov\.in|biz|info|site)[^\s]*",
    re.IGNORECASE
)

def extract_urls(text: str) -> List[str]:
    """Finds all URL candidates within raw text."""
    matches = URL_REGEX.findall(text)
    cleaned = []
    for m in matches:
        m = m.rstrip(".,;!?:)'\"")
        if not m.startswith("http://") and not m.startswith("https://"):
            m = "http://" + m
        cleaned.append(m)
    return list(dict.fromkeys(cleaned))

def calculate_entropy(string: str) -> float:
    """Calculates Shannon entropy to detect DGA (Domain Generation Algorithm) randomness."""
    if not string:
        return 0.0
    probabilities = [float(string.count(c)) / len(string) for c in set(string)]
    return -sum(p * math.log2(p) for p in probabilities if p > 0)

def analyze_url(url_str: str) -> UrlAnalysisResult:
    """
    Performs comprehensive lexical and infrastructure analysis of a URL.
    Returns structured analysis with risk score component [0.0 - 1.0].
    """
    if not url_str.startswith("http://") and not url_str.startswith("https://"):
        url_str = "http://" + url_str

    parsed = urlparse(url_str)
    netloc = (parsed.netloc or "").lower().split(":")[0]  # remove port if present
    path = parsed.path or ""
    full_target = url_str.lower()

    reasons: List[str] = []
    lexical_score = 0.0

    # 1. IP address as Host Check (Major Phishing Indicator)
    is_ip = bool(IPV4_PATTERN.match(netloc))
    if is_ip:
        lexical_score += 0.45
        reasons.append("Host is a direct raw IP address rather than a verified domain name")

    # 2. Known URL Shortener
    is_shortener = netloc in KNOWN_URL_SHORTENERS
    if is_shortener:
        lexical_score += 0.30
        reasons.append(f"URL uses shortener ({netloc}) concealing the final landing host")

    # 3. Suspicious / Disposable TLD
    domain_parts = netloc.split(".")
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    suspicious_tld = tld in SUSPICIOUS_TLDS
    if suspicious_tld:
        lexical_score += 0.35
        reasons.append(f"Uses high-risk/disposable Top-Level Domain (.{tld}) commonly used in malicious campaigns")

    # 4. Subdomain nesting / obfuscation
    subdomain_count = max(0, len(domain_parts) - 2)
    if subdomain_count >= 3:
        lexical_score += 0.25
        reasons.append(f"Excessive subdomain depth ({subdomain_count} nested levels) attempting domain cloaking")

    # 5. Shannon Entropy of Domain
    entropy = calculate_entropy(netloc)
    if entropy > 3.8 and len(netloc) > 14:
        lexical_score += 0.20
        reasons.append(f"High domain character entropy ({entropy:.2f}) indicates auto-generated or randomized name")

    # 6. Deceptive character patterns
    if "@" in full_target:
        lexical_score += 0.35
        reasons.append("Contains '@' symbol designed to manipulate browser credential authentication")

    if full_target.count("//") > 1:
        lexical_score += 0.25
        reasons.append("Multiple redirection slashes ('//') detected in path")

    if full_target.count("-") >= 3:
        lexical_score += 0.15
        reasons.append("Multiple hyphens in hostname mimicking authentic service names")

    # Clamp lexical score between 0.0 and 1.0
    final_score = min(1.0, max(0.0, lexical_score))

    return UrlAnalysisResult(
        url=url_str,
        domain=netloc,
        is_ip_host=is_ip,
        is_shortener=is_shortener,
        suspicious_tld=suspicious_tld,
        entropy=round(entropy, 2),
        lexical_score=round(final_score, 2),
        subdomain_count=subdomain_count,
        reasons=reasons
    )
