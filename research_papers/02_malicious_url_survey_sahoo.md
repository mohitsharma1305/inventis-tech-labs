# Research Paper 02: Sahoo et al. (Foundational Malicious URL Survey)

## Citation & Metadata
- **Authors:** Doyen Sahoo, Chenghao Liu, Steven C. H. Hoi
- **Institutions:** School of Information Systems, **Singapore Management University (SMU)**
- **Publication:** *Malicious URL Detection using Machine Learning: A Survey* (IEEE / arXiv:1701.07179, 2017)
- **Citations:** 410+ citations across IEEE, ACM, Springer, Elsevier.
- **Authenticity Rating:** 10/10 (The definitive standard reference cited by virtually all malicious URL detection papers).

---

## Core Findings & Academic Value

1. **Why Blacklists Fail:**
   - Blacklists (e.g., standard DNS blocklists) suffer from **Zero-Hour Blindness**: new phishing domains are registered, weaponized, and discarded within 4 to 24 hours.
   - Attackers use dynamic DNS, fast-flux domains, and domain generation algorithms (DGAs).
   - Machine Learning on structural/lexical features detects malicious patterns *even before* threat intelligence lists identify them.

2. **The 3 Feature Families Defined by Sahoo et al.:**
   - **Family 1: Lexical Features (Client-side fast extraction, zero-latency):**
     - URL length and URL depth (number of `/` slashes).
     - Number of periods (`.`), hyphens (`-`), underscores (`_`), and `@` symbols.
     - Presence of IP address instead of domain name (e.g., `http://192.168.1.1/login`).
     - Brand typosquatting / Levenshtein edit distance (e.g., `paytmm.com`, `sbi-bank-verify.in`).
     - Shannon Entropy of the domain name (high entropy indicates random generated DGA names).
     - Top-level domain (TLD) risk score (e.g., `.xyz`, `.top`, `.tk`, `.buzz` vs `.edu`, `.gov`, `.ac.in`).
   - **Family 2: Host-based / Network Features:**
     - WHOIS data: Domain creation date, registrar age, expiration date. (Newly registered domains < 30 days are high risk).
     - Autonomous System Number (ASN) and geographic hosting jurisdiction.
   - **Family 3: Content-based Features:**
     - HTML title mismatch, iframe presence, password input fields on non-HTTPS origins.

---

## What Our MVP Directly Borrows
- Our **URL Intelligence Engine** implements the exact lexical feature extractor from Sahoo et al.:
  1. Shannon entropy calculation.
  2. Suspicious symbol counters (`@`, `//`, `-`, multi-subdomain nesting).
  3. Levenshtein distance check against target brands (SBI, HDFC, ICICI, Paytm, Google, Microsoft, SKIT Campus portal).
  4. Domain age heuristic flags.
