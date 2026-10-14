# Research Paper 05: Hybrid Architecture & Risk Scoring (Li et al. & Kalniņa et al.)

## Citation & Metadata
- **Papers:**
  1. *Collaborative Dual-Framework Defense: CTI and LLM-Based Enhanced Smishing Detection* (Li et al., 2026, IEEE)
  2. *Smishing Risk Assessment Using Retrieval-Augmented Generation (RAG)* (Kalniņa et al., 2026)
  3. *SafeChat: AI-Driven Real-Time Scam Risk Scoring* (Tyszkiewicz et al., 2025)
- **Authenticity Rating:** 10/10 (State-of-the-art hybrid risk engines).

---

## Key Academic Formulations Used in Our Project

### 1. The Multi-Tier Collaborative Pipeline
Li et al. establish that modern defense systems cannot afford to run expensive heavy models on every standard request. They propose a dual framework:
- **Fast Tier (Local deterministic ML & Heuristics):** Processes 85–90% of routine traffic instantly (<10ms).
- **Deep Inspection Tier (Rule Reasoner / LLM / RAG):** Engaged when risk is ambiguous or when generating human-centric explanations.

### 2. Composite Risk Scoring Formula
Kalniņa et al. and Tyszkiewicz et al. define a normalized multi-signal risk index $R \in [0, 100]$:

$$R = 100 \times \left( w_T \cdot S_{\text{text}} + w_U \cdot S_{\text{url}} + w_I \cdot S_{\text{intent}} \right)$$

Where:
- $S_{\text{text}} \in [0, 1]$: Calibrated NLP linguistic risk (urgency, coercive tone, reward traps, sensitive credential solicitation).
- $S_{\text{url}} \in [0, 1]$: URL & domain infrastructure risk (Shannon entropy, typosquatting, TLD suspicion, IP host, shortener flags).
- $S_{\text{intent}} \in [0, 1]$: Targeted impersonation index (known bank, government agency, or university brand matching against unverified domain).
- Default weights: $w_T = 0.45$, $w_U = 0.35$, $w_I = 0.20$ (dynamically normalized if no URL is present).

### 3. Risk Threshold Triaging

| Score Range | Severity Band | System Action | User Guidance |
|:---:|:---:|:---:|:---:|
| **0 – 29** | **Low Risk (Safe)** | Pass through, log event | Content appears legitimate; standard security hygiene applies. |
| **30 – 69** | **Moderate (Suspicious)** | Caution badge, highlight anomalies | Exercise caution; verify through independent channels before clicking. |
| **70 – 100** | **Critical (Malicious)** | **Interception Interstitial Warning** | High-confidence scam; do not open links or share credentials. |
