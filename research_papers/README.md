# Master Academic Literature & Research Paper Index
**Project:** AI-Based Phishing, Scam Message and Malicious URL Detection (IEEE-IGNITE PS ID: SKIT025)  
**Theme:** Robotics, Smart Campus & Digital Applications  
**Prepared For:** Hackathon Jury, Defense Presentation & Literature Review

---

## Executive Summary: Academic Grounding

For an IEEE Hackathon, citing genuine, peer-reviewed, and recognized research from high-impact journals (IEEE Access, Computers & Security, ACM, Mendeley Data, Elsevier) validates your architecture.

Instead of presenting an ad-hoc web toy, your project is directly backed by peer-reviewed methodologies from leading institutions:

| # | Paper Title & Authors | Primary Affiliation & Venue | Core Contribution We Implement | File Link |
|---|----------------------|-----------------------------|--------------------------------|-----------|
| **1** | **Smishing Detector & DSmishSMS**<br>*(Sandhya Mishra & Devpriya Soni, 2020–2022)* | **JIIT (Noida, India)**<br>IEEE / SSRN / Mendeley Data | Benchmark SMS Phishing Dataset (5,971 messages) + Two-tier SMS/URL separation. Tailored to Indian telecom ecosystem. | [01_smishing_jiit_mishra_soni.md](./01_smishing_jiit_mishra_soni.md) |
| **2** | **Malicious URL Detection Using Machine Learning: A Survey**<br>*(D. Sahoo, C. Liu, S. C. Hoi, 2017)* | **Singapore Management Univ.**<br>IEEE Survey (410+ citations) | Foundational taxonomy of Lexical, Host-based, and Domain features. Explains why blacklists alone fail. | [02_malicious_url_survey_sahoo.md](./02_malicious_url_survey_sahoo.md) |
| **3** | **Systematic Literature Review on Phishing Email Detection Using NLP**<br>*(S. Salloum, T. Gaber et al., 2022)* | **Univ. of Salford (UK)**<br>IEEE Access (100+ papers reviewed) | Proof that TF-IDF + Linear SVM/Random Forest outperforms complex DL on low-latency inference. Standard evaluation protocols. | [03_nlp_phishing_survey_salloum.md](./03_nlp_phishing_survey_salloum.md) |
| **4** | **SmishX: Explainable SMS Phishing Detection using LLM-based Agents**<br>*(Wang et al., 2025)* | **IEEE / ACM User Studies**<br>Top-tier Explainability | Combines multi-signal brand verification with human-readable explanations. Proved that user warnings prevent link-clicks. | [04_smishx_explainable_phishing_wang.md](./04_smishx_explainable_phishing_wang.md) |
| **5** | **Collaborative Dual-Framework Defense & RAG Risk Scoring**<br>*(Li et al., 2026; Kalniņa et al., 2026)* | **IEEE Access & Sensors**<br>Hybrid CTI + AI | The 0–100 Mathematical Risk Scoring engine combining text intent, lexical URL risk, and threat intelligence. | [05_dual_framework_scoring_li_kalnina.md](./05_dual_framework_scoring_li_kalnina.md) |

---

## How These Papers Directly Shape Our MVP Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │   Incoming Message (SMS / Email / Social)    │
                  └──────────────────────┬───────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
            ┌────────────────────────┐      ┌────────────────────────┐
            │   Text Linguistic NLP  │      │   URL & Domain Engine  │
            │   (Salloum et al.)     │      │   (Sahoo et al.)       │
            │   - Urgency & Fear     │      │   - Lexical features   │
            │   - Credential asking  │      │   - Typosquatting      │
            │   - TF-IDF + SVM/RF    │      │   - WHOIS/Domain Age   │
            └────────────┬───────────┘      └────────────┬───────────┘
                         │                               │
                         └───────────────┬───────────────┘
                                         ▼
            ┌────────────────────────────────────────────────────────┐
            │       Hybrid Composite Risk Scoring Engine (0-100)     │
            │       R = 100 * (0.45*Text + 0.35*URL + 0.20*Threat)   │
            │       (Li et al. & Kalniņa et al.)                     │
            └────────────────────────────┬───────────────────────────┘
                                         ▼
            ┌────────────────────────────────────────────────────────┐
            │          Explainable AI (XAI) & Actionable Warning     │
            │          - Contributing factor breakdown               │
            │          - Pre-click Interstitial Protective Modal     │
            │          (Wang et al. - SmishX)                        │
            └────────────────────────────┬───────────────────────────┘
                                         ▼
            ┌────────────────────────────────────────────────────────┐
            │          Security Dashboard & Searchable History       │
            │          - Real-time audit logs, threat categorization │
            └────────────────────────────────────────────────────────┘
```

---

## Citations Ready for Hackathon PPT & Documentation

1. **Mishra, S., & Soni, D. (2020).** *Smishing Detector: A Novel Approach for Smishing Detection.* SSRN Electronic Journal. DOI: 10.2139/ssrn.3356256.
2. **Mishra, S., & Soni, D. (2022).** *SMS Phishing Dataset for Machine Learning and Cybersecurity Research.* Mendeley Data, V1, DOI: 10.17632/f45bkkt8pr.1.
3. **Sahoo, D., Liu, C., & Hoi, S. C. (2017).** *Malicious URL Detection using Machine Learning: A Survey.* arXiv:1701.07179 / IEEE.
4. **Salloum, S., Gaber, T., Vadera, S., & Shaalan, K. (2022).** *A Systematic Literature Review on Phishing Email Detection Using Natural Language Processing Techniques.* IEEE Access, 10, 65703-65727.
5. **Wang, Z., et al. (2025).** *Can You Walk Me Through It? Explainable SMS Phishing Detection using LLM-based Agents (SmishX).*
6. **Kalniņa, L., et al. (2026).** *Smishing Risk Assessment using Retrieval-Augmented Generation and Multi-attribute Scoring.*
