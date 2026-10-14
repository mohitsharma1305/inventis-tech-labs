# Research Paper 01: Mishra & Soni (JIIT Noida, India)

## Citation & Metadata
- **Authors:** Dr. Sandhya Mishra, Dr. Devpriya Soni
- **Institution:** Department of Computer Science & Engineering, **Jaypee Institute of Information Technology (JIIT), Noida, India**
- **Venues:** 
  - SSRN / Elsevier: *Smishing Detector: A Novel Approach for Smishing Detection* (2020)
  - International Journal of Information Security: *DSmishSMS: A Domain-Checking and Machine Learning-Based Smishing Detection Framework* (2021)
  - Mendeley Data: *SMS Phishing Dataset* (2022, DOI: 10.17632/f45bkkt8pr.1)
- **Authenticity Rating:** 10/10 (Premier Indian academic work on Smishing, widely cited across ACM & IEEE).

---

## Why This Paper Is Critical For IEEE-IGNITE (SKIT Jaipur)
1. **Local & Indian Context:** The research originated from an Indian engineering university (JIIT Noida), addressing Indian mobile fraud tactics (fake bank updates, electricity cuts, lottery SMS, urgent KYC).
2. **Benchmark Dataset (5,971 messages):**
   - **Legitimate (Ham):** 4,844 messages
   - **Smishing (Phishing):** 638 messages
   - **Spam:** 489 messages
   - Contains real-world extracted URLs, telephone numbers, and alphanumeric sender headers.
3. **Dual-Phase Architecture (DSmishSMS):**
   - **Phase 1: Domain & URL Verification Module:** Isolates links, verifies domain age, checks redirect chains.
   - **Phase 2: Content NLP Classification Module:** Evaluates vocabulary, urgency triggers, and call-to-action indicators.
   - Reported accuracy: **97.93%** using Random Forest and Naive Bayes classifiers.

---

## Key Features Extracted in the Paper
1. **Linguistic Triggers:**
   - Urgent deadlines (*"within 24 hours"*, *"immediately"*, *"account blocked"*).
   - Sensitive requests (*"OTP"*, *"PIN"*, *"PAN card"*, *"update Aadhaar"*).
   - Coercive or reward-based hooks (*"Cashback credited"*, *"Lottery winner"*).
2. **Structural & Channel Features:**
   - Presence of IP address in link.
   - Hexadecimal or character obfuscation.
   - Length of message body vs URL length ratio.
   - Known shortener domains (`bit.ly`, `tinyurl.com`, `is.gd`).

---

## What Our MVP Directly Borrows
- We adopt the **two-phase separation**: text semantics are evaluated independently from URL infrastructure.
- We integrate the **JIIT smishing keyword & indicator matrix** for Indian telecom threats (e.g. fake SBI/HDFC/Paytm alert formats).
- In our evaluation section, we cite Mishra & Soni as our primary benchmark dataset.
