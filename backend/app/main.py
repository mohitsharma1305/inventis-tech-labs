"""
FastAPI Application Entry Point for PhishGuard AI (SKIT025).
Provides high-performance REST APIs for multi-channel analysis,
threat history search, and security dashboard telemetry.
"""

import uuid
from datetime import datetime, timezone
import json
import os
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import RISK_THRESHOLD_CRITICAL
from .models.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    FactorDetail,
    HistoryItem,
    DashboardStats,
    BenchmarkCase,
    SandboxInspectRequest,
    SandboxInspectResponse
)
from .engine.url_analyzer import extract_urls, analyze_url
from .engine.brand_matcher import detect_brand_impersonation
from .engine.linguistic_analyzer import analyze_linguistic_patterns
from .engine.ml_classifier import classifier_instance
from .engine.risk_scorer import compute_composite_risk
from .engine.xai_explainer import generate_explanation_and_guidance
from .engine.sandbox_runner import run_virtual_sandbox_inspection
from .database import init_db, save_case, search_cases, get_dashboard_metrics

app = FastAPI(
    title="Inventis — Multi-Vector Threat Defense Platform",
    description="AI-driven Phishing, Scam, and Malicious URL Detection Engine (IEEE-IGNITE SKIT025)",
    version="1.0.0"
)

# Enable CORS for local web dev and frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Inventis Backend",
        "version": "1.0.0",
        "models_loaded": classifier_instance.model is not None
    }

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_content(req: AnalyzeRequest):
    case_id = f"pg-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. URL Extraction & Inspection
    target_url = req.url
    if not target_url:
        extracted = extract_urls(req.text)
        if extracted:
            target_url = extracted[0]

    url_result = None
    url_score = None
    target_domain = None

    if target_url:
        url_result = analyze_url(target_url)
        url_score = url_result.lexical_score
        target_domain = url_result.domain

    # 2. Brand Impersonation & Typosquatting
    matched_brand, brand_score, brand_reasons = detect_brand_impersonation(req.text, target_domain)

    # 3. Linguistic Intent & Pattern Analysis
    ling_score, triggers, linguistic_factors = analyze_linguistic_patterns(req.text)

    # 4. Statistical ML Classifier Inference (TF-IDF + Logistic Regression)
    ml_prob, ml_meta = classifier_instance.predict_phishing_probability(req.text)

    # 5. Compile all contributing factors (XAI)
    all_factors: List[FactorDetail] = list(linguistic_factors)

    if brand_score > 0 and matched_brand:
        all_factors.append(FactorDetail(
            category="Brand Impersonation",
            name=f"Unauthorized {matched_brand} Claim",
            description="; ".join(brand_reasons),
            severity="critical" if brand_score >= 0.7 else "warning",
            points=brand_score
        ))

    if url_result and url_result.reasons:
        for r in url_result.reasons:
            all_factors.append(FactorDetail(
                category="URL & Domain Anomaly",
                name="Suspicious Link Infrastructure",
                description=r,
                severity="critical" if url_result.is_ip_host or url_result.suspicious_tld else "warning",
                points=url_result.lexical_score
            ))

    # Check if critical credential harvesting is happening
    has_cred_harvest = any(f.category == "Credential Harvesting" for f in all_factors)

    # 6. Composite Risk Score Computation (0 - 100)
    risk_score, risk_level, breakdown = compute_composite_risk(
        text_prob=ml_prob,
        linguistic_score=ling_score,
        url_score=url_score,
        brand_score=brand_score,
        has_critical_credential_harvesting=has_cred_harvest
    )

    # 7. SmishX Explainability & Interstitial Trigger Evaluation
    summary, recommended_action, interstitial_warning = generate_explanation_and_guidance(
        risk_level=risk_level,
        risk_score=risk_score,
        factors=all_factors,
        brand=matched_brand,
        url_result=url_result
    )

    # 8. Construct response
    response_data = AnalyzeResponse(
        id=case_id,
        timestamp=now_iso,
        channel=req.channel or "sms",
        risk_score=risk_score,
        risk_level=risk_level,
        is_phishing=(risk_level == "CRITICAL"),
        summary=summary,
        recommended_action=recommended_action,
        factors=all_factors,
        triggers=triggers,
        url_analysis=url_result,
        brand_impersonation=matched_brand,
        ml_confidence=ml_prob,
        interstitial_warning_needed=interstitial_warning
    )

    # 9. Persist to SQLite Case Audit Trail
    save_case({
        "id": case_id,
        "timestamp": now_iso,
        "channel": req.channel or "sms",
        "text": req.text,
        "url": target_url,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "brand_impersonation": matched_brand,
        "factors": [f.dict() for f in all_factors],
        "summary": summary,
        "recommended_action": recommended_action
    })

    return response_data

@app.get("/api/history", response_model=List[HistoryItem])
def get_history(
    query: Optional[str] = Query(None, description="Keyword search query"),
    risk_level: Optional[str] = Query("ALL", description="Filter by risk level: SAFE, SUSPICIOUS, CRITICAL, ALL"),
    channel: Optional[str] = Query("all", description="Filter by channel: sms, email, social, all"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    return search_cases(query=query, risk_level=risk_level, channel=channel, limit=limit, offset=offset)

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_statistics():
    return get_dashboard_metrics()

@app.get("/api/benchmarks", response_model=List[BenchmarkCase])
def get_benchmark_cases():
    benchmarks_path = os.path.join(os.path.dirname(__file__), "data", "benchmark_cases.json")
    if os.path.exists(benchmarks_path):
        with open(benchmarks_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []
