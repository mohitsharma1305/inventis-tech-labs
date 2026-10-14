"""
Configuration constants, threat dictionaries, and scoring parameters
for PhishGuard AI (SKIT025).
"""

from typing import List, Dict

# Risk Classification Bands
RISK_THRESHOLD_SAFE = 29
RISK_THRESHOLD_SUSPICIOUS = 69
RISK_THRESHOLD_CRITICAL = 70

# Default weights for the composite scoring formula:
# R = 100 * (w_text * S_text + w_url * S_url + w_brand * S_brand)
WEIGHT_TEXT_DEFAULT = 0.45
WEIGHT_URL_DEFAULT = 0.35
WEIGHT_BRAND_DEFAULT = 0.20

# Dynamic fallback when no URL exists in message:
WEIGHT_TEXT_NO_URL = 0.65
WEIGHT_BRAND_NO_URL = 0.35

# High-Risk Top-Level Domains commonly leveraged in smishing / disposable campaigns
SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "work", "click",
    "live", "loan", "cam", "vip", "icu", "rest", "support", "online",
    "site", "website", "cyou", "racing", "win", "party", "monster"
}

# Known URL shorteners that conceal the real landing host
KNOWN_URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "is.gd", "t.co", "cutt.ly", "rb.gy",
    "shorturl.at", "ow.ly", "rebrandly.com", "t.ly", "v.gd", "tiny.cc",
    "buff.ly", "bl.ink", "hyperurl.co"
}

# Target Brands heavily targeted in Indian telecom & campus ecosystems
# Mapping of Canonical Brand Name -> Legitimate Official Domains
TARGET_BRANDS: Dict[str, List[str]] = {
    "State Bank of India (SBI)": [
        "onlinesbi.sbi", "sbi.co.in", "bank.sbi", "sbicard.com"
    ],
    "HDFC Bank": [
        "hdfcbank.com", "hdfc.com"
    ],
    "ICICI Bank": [
        "icicibank.com"
    ],
    "Punjab National Bank (PNB)": [
        "pnbindia.in", "netpnb.com"
    ],
    "Paytm": [
        "paytm.com", "paytmbank.com"
    ],
    "PhonePe": [
        "phonepe.com"
    ],
    "Google / Google Pay": [
        "google.com", "google.co.in", "pay.google.com"
    ],
    "SKIT Jaipur / Campus ERP": [
        "skit.ac.in", "erp.skit.ac.in", "rtu.ac.in"
    ],
    "Electricity Board / Bijli Nigam": [
        "energy.rajasthan.gov.in", "jvvnldiscom.com", "bescom.karnataka.gov.in", "uppcl.org"
    ],
    "India Post": [
        "indiapost.gov.in", "indiapostgdsonline.gov.in"
    ],
    "Income Tax Department": [
        "incometax.gov.in", "tin-nsdl.com"
    ],
    "Amazon": [
        "amazon.in", "amazon.com"
    ],
    "Telegram": [
        "telegram.org", "t.me"
    ],
    "WhatsApp": [
        "whatsapp.com", "wa.me"
    ],
    "Microsoft / Office 365": [
        "microsoft.com", "office.com", "live.com"
    ],
    "Apple": [
        "apple.com", "icloud.com"
    ]
}

# Linguistic Threat Dictionaries (Mishra & Soni 2022 + Salloum et al. 2022)
URGENCY_PATTERNS = [
    r"\b(immediately|urgent|urgently|today|tonight|within\s+\d+\s*(hours?|hrs?|mins?|minutes?))\b",
    r"\b(before\s+\d{1,2}(:\d{2})?\s*(pm|am)?)\b",
    r"\b(last\s+(chance|reminder|notice))\b",
    r"\b(action\s+required|immediate\s+action)\b",
    r"\b(expires?\s+(today|soon|within))\b",
    r"\b(suspended\s+today|blocked\s+today)\b"
]

COERCION_FEAR_PATTERNS = [
    r"\b(blocked|suspended|deactivated|disconnected|terminated|closed|locked)\b",
    r"\b(legal\s+action|police|fir|penalty|court\s+notice|arrest\s+warrant)\b",
    r"\b(power\s+cut|electricity\s+disconnected|power\s+office)\b",
    r"\b(fine\s+of\s+rs|debarment|cancelled)\b"
]

GREED_REWARD_PATTERNS = [
    r"\b(won|winner|lottery|lucky\s+draw|cashback|reward\s+points|bonus)\b",
    r"\b(credited|refund\s+approved|claim\s+your\s+prize|earn\s+daily)\b",
    r"\b(part-time\s+job|work\s+from\s+home|review\s+products?\s+earn)\b",
    r"\b(rs\.?\s*\d{3,7}|inr\s*\d{3,7})\s*(credited|won|prize)\b"
]

CREDENTIAL_HARVESTING_PATTERNS = [
    r"\b(otp|one\s+time\s+password|pin|mpin|cvv|password)\b",
    r"\b(pan\s+card|aadhaar|kyc\s+update|verify\s+kyc|submit\s+documents)\b",
    r"\b(card\s+number|expiry\s+date|bank\s+details|login\s+credentials)\b",
    r"\b(download\s+(the\s+)?app|install\s+apk|update\s+app)\b"
]
