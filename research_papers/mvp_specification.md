# Hackathon MVP Specification — PhishGuard / ScamShield (SKIT025)

## 1. Project Overview & Identity
- **Name:** **PhishGuard AI — Intelligent Multi-Vector Threat Defense Platform**
- **Hackathon:** IEEE-IGNITE Hackathon (SKIT Jaipur)
- **Problem Statement ID:** `SKIT025`
- **Domain:** AI Cybersecurity, Smart Campus, Fraud Prevention

---

## 2. Direct Feature Mapping Matrix to SKIT025

| # | SKIT025 Problem Statement Requirement | Corresponding Module in PhishGuard AI | Implementation Detail |
|---|---|---|---|
| 1 | **Analyze message text and URLs** | Multi-Modal Input & Ingestion Pipeline | Ingests Email bodies, SMS, WhatsApp/Telegram messages, and standalone URLs. |
| 2 | **Identify suspicious linguistic patterns** | NLP Linguistic Intent Analyzer | Scans for artificial urgency, fear tactics, lottery/reward baits, OTP/PIN/KYC requests. |
| 3 | **Extract and analyze URLs, domains, metadata** | URL & Domain Intelligence Engine (Sahoo et al.) | Parses lexical features, Shannon entropy, TLD risk, IP host, shortener unmasking. |
| 4 | **Detect impersonation & urgency-based scam patterns** | Target Brand & Impersonation Matcher | Levenshtein distance check against Indian banks (SBI, HDFC, ICICI, Paytm), Telecom, and SKIT Campus ERP. |
| 5 | **Classify messages according to risk level** | Hybrid Composite Risk Scoring Engine | Computes normalized 0–100 score triaged into **Safe (0–29)**, **Suspicious (30–69)**, **Critical (70–100)**. |
| 6 | **Explain factors contributing to classification** | Explainable AI (XAI) Reasoner (SmishX) | Highlights suspicious keywords in original text, provides itemized risk factor breakdown. |
| 7 | **Provide warnings before users interact** | **Pre-Interaction Interstitial Modal** | Intercepts link clicks or action attempts with an explicit threat warning and advice. |
| 8 | **Maintain searchable history of analyzed cases** | Persistent Case Audit Log | Searchable table with real-time text query, risk filter, date stamps, and export capability. |
| 9 | **Provide dashboard for security analysis** | Security Operations Analytics Dashboard | Real-time charts for threat breakdown, brand impersonation trends, and aggregate metrics. |

---

## 3. High-Value Demonstration Presets (Indian & Campus Context)
To guarantee a winning presentation, PhishGuard comes pre-loaded with authentic test scenarios:
1. **Fake Electricity Bill Disconnection SMS:**
   *"Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the power office because your previous month bill was not updated. Please immediately contact our officer at 88234-XXXXX or pay via http://bijli-bill-update.online/pay"*
2. **Indian Banking KYC Deactivation Scam (SBI/Paytm):**
   *"Your SBI Yono account has been suspended due to pending PAN/Aadhaar KYC. Click here immediately to update: http://onlinesbi-yono-kyc.top/verify. Do not ignore."*
3. **Smart Campus / SKIT Jaipur Exam Fee Fraud:**
   *"Urgent: RTU & SKIT Semester Examination admit card registration closes in 2 hours. Pay pending fine of ₹500 to avoid debarment at: http://skit-exam-portal.live/fee"*
4. **Telegram / WhatsApp Part-Time Work from Home Scam:**
   *"Congratulations! You are selected for Amazon product review job. Earn ₹3,000 to ₹8,000 daily from home. Join official manager telegram: http://t.me/earn_daily_job"*
5. **Legitimate Bank Transaction OTP (Zero False Positive Test):**
   *"OTP for transaction of Rs. 4,500 at Amazon India is 849201. Valid for 10 mins. Do not share OTP with anyone - State Bank of India."*
6. **Legitimate Campus Circular (Zero False Positive Test):**
   *"All 3rd year B.Tech students are informed that IEEE-IGNITE Hackathon orientation will be held in the Mini Auditorium at 2:00 PM today. Principal, SKIT."*
