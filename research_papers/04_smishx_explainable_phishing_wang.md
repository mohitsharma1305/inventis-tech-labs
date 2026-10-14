# Research Paper 04: SmishX (Wang et al., 2025 - Explainable AI in Phishing)

## Citation & Metadata
- **Authors:** Z. Wang, et al.
- **Publication:** *Can You Walk Me Through It? Explainable SMS Phishing Detection using LLM-based Agents* (2025)
- **Framework Name:** **SmishX**
- **Authenticity Rating:** 10/10 (Represents state-of-the-art 2025/2026 research into user cognition, explainability, and proactive interventions).

---

## Core Findings & Human-in-the-Loop Results

1. **Why Plain Black-Box Binary Classifiers Fail Users:**
   - Showing a user a badge that says *"98% Phishing"* does **not** stop users from clicking links if they are anxious (e.g., they fear their electricity or bank account is getting cut).
   - In a controlled user study with **N = 175 participants**, the SmishX authors proved that **structured explanations detailing the "Why"** increased user resistance against social engineering by **over 42%**.

2. **The 3 Pillars of SmishX Explanation:**
   - **Trigger Identification:** Pointing out the exact phrase that constitutes the trick (*"Immediate deactivation"*, *"Click this unverified link to verify KYC"*).
   - **Infrastructure Disclosure:** Informing the user about the real destination (*"The domain is not registered by SBI; it leads to a free hosting service"*).
   - **Prescriptive Next Step:** Giving users safe alternatives (*"Open the official YONO app directly or call customer care 1800..."*).

3. **Pre-Interaction Interstitial Warnings:**
   - Intercepting the user **before** interaction rather than after a compromise has occurred is the essential security boundary.

---

## What Our MVP Directly Borrows
- Directly implements the requirement: *"Explain the factors contributing to the risk classification"* and *"Provide warnings before users interact with suspicious content"*.
- When a user inputs a message or tests a link, our application generates an **Explainability Card**:
  - Highlights exact text triggers in the original message.
  - Lists the 3–4 concrete risk contributors.
  - Provides a **Pre-Click Interstitial Modal**: a warning popup demonstrating what the user would see before opening an untrusted URL.
