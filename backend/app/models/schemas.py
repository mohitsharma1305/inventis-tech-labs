"""
Pydantic data schemas for PhishGuard AI API.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="The message body or email content to inspect")
    url: Optional[str] = Field(None, description="Optional standalone or supplementary URL")
    channel: Optional[str] = Field("sms", description="Source channel: 'sms', 'email', 'social', 'url'")
    sender_header: Optional[str] = Field(None, description="Sender ID or email address if available")

class FactorDetail(BaseModel):
    category: str
    name: str
    description: str
    severity: str  # 'critical', 'warning', 'info'
    points: float

class TriggerSpan(BaseModel):
    text: str
    start: int
    end: int
    category: str  # 'urgency', 'coercion', 'credential', 'greed'

class UrlAnalysisResult(BaseModel):
    url: str
    domain: str
    is_ip_host: bool
    is_shortener: bool
    suspicious_tld: bool
    entropy: float
    lexical_score: float
    subdomain_count: int
    typosquatting_target: Optional[str] = None
    reasons: List[str] = []

class AnalyzeResponse(BaseModel):
    id: str
    timestamp: str
    channel: str
    risk_score: int  # 0 to 100
    risk_level: str  # 'SAFE', 'SUSPICIOUS', 'CRITICAL'
    is_phishing: bool
    summary: str
    recommended_action: str
    factors: List[FactorDetail]
    triggers: List[TriggerSpan]
    url_analysis: Optional[UrlAnalysisResult] = None
    brand_impersonation: Optional[str] = None
    ml_confidence: float
    interstitial_warning_needed: bool

class HistoryItem(BaseModel):
    id: str
    timestamp: str
    channel: str
    preview: str
    risk_score: int
    risk_level: str
    brand_impersonation: Optional[str] = None
    url: Optional[str] = None

class DashboardStats(BaseModel):
    total_analyzed: int
    critical_threats: int
    suspicious_cases: int
    safe_cases: int
    avg_risk_score: float
    threats_by_channel: Dict[str, int]
    top_impersonated_brands: List[Dict[str, Any]]
    recent_activity: List[HistoryItem]

class BenchmarkCase(BaseModel):
    id: str
    title: str
    category: str
    channel: str
    expected_risk: str
    description: str
    sample_text: str
    sample_url: Optional[str] = None
