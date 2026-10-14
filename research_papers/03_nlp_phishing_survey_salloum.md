# Research Paper 03: Salloum et al. (Systematic NLP Phishing Survey)

## Citation & Metadata
- **Authors:** Said Salloum, Tarek Gaber, Sunil Vadera, Khaled Shaalan
- **Institutions:** 
  - School of Science, Engineering and Environment, **University of Salford, Manchester, UK**
  - Faculty of Computers and Artificial Intelligence, Suez Canal University
  - The British University in Dubai (BUiD)
- **Publication:** *A Systematic Literature Review on Phishing Email Detection Using Natural Language Processing Techniques*, **IEEE Access**, Vol. 10, pp. 65703-65727, 2022.
- **Authenticity Rating:** 10/10 (Premier IEEE Access publication synthesizing 100 peer-reviewed NLP phishing papers).

---

## Key Takeaways for Hackathon Judges

1. **Which Classifiers Actually Work Best in Practice?**
   - After surveying 100 academic papers, the authors found:
     - **TF-IDF + Support Vector Machines (SVM) / Logistic Regression / Random Forest** consistently deliver **96%–98.5% accuracy** while maintaining sub-millisecond inference latency.
     - While deep neural networks (BERT/RoBERTa) achieve marginal gains (+0.5%–1.2%), their inference latency and memory requirements make them brittle for real-time edge or client-side warning systems.
     - A tuned classical model is far more reproducible and auditable for a production defense pipeline.

2. **Benchmark Datasets Identified in the Literature:**
   - **Nazario Phishing Corpus:** Gold standard for email phishing bodies and headers.
   - **Enron Corpus:** Legitimate enterprise email benchmark.
   - **SpamAssassin & UCI:** Public baseline comparisons.

3. **Linguistic Dimensions of Phishing & Social Engineering:**
   The paper classifies deceptive linguistic patterns into four psychological exploit categories:
   - **Urgency / Time Scarcity:** Manipulating decision-making speed (*"Act within 2 hours or forfeit..."*).
   - **Fear / Intimidation:** Threat of account closure, legal action, power disconnection.
   - **Greed / Incentive:** Reward points, unexpected refunds, prize winnings.
   - **Authority Impersonation:** Pretending to be an institution administrator, tax department, or campus authority.

---

## What Our MVP Directly Borrows
- Fast, deterministic TF-IDF feature extraction pipeline with Logistic Regression/Linear SVM weights.
- Linguistic feature flags structured around the 4 psychological vectors (Urgency, Fear, Greed, Authority).
- Scientific justification for our hackathon model choice: high interpretability, instant execution, zero cloud dependency during live defense.
