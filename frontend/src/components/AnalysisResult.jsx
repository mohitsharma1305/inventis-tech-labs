import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Flame,
  CheckCircle,
  HelpCircle,
  Info,
  Lock,
  Globe2,
  PhoneCall
} from 'lucide-react';

export default function AnalysisResult({ result, onOpenInterstitial }) {
  if (!result) {
    return (
      <div className="result-section glass-panel inspection-guide-card">
        <div className="guide-header">
          <div className="guide-title-wrap">
            <ShieldCheck size={20} color="var(--accent-emerald)" />
            <h3 className="guide-title">Threat Detection Pipeline Online</h3>
          </div>
          <span className="badge-online">Active</span>
        </div>

        <p className="guide-description">
          Awaiting input. Select any test scenario above or paste suspect text / URL on the left to trigger the multi-attribute detection engine.
        </p>

        <div className="engine-checklist">
          <div className="engine-check-item">
            <div className="engine-check-dot dot-emerald"></div>
            <div>
              <div className="engine-name">NLP Linguistic Urgency & Coercion</div>
              <div className="engine-desc">Scans for artificial panic, fear tactics & credential harvesting (Salloum et al.)</div>
            </div>
          </div>

          <div className="engine-check-item">
            <div className="engine-check-dot dot-emerald"></div>
            <div>
              <div className="engine-name">Shannon Entropy & URL Engine</div>
              <div className="engine-desc">Calculates algorithmic domain randomness & disposable TLDs (Sahoo et al.)</div>
            </div>
          </div>

          <div className="engine-check-item">
            <div className="engine-check-dot dot-emerald"></div>
            <div>
              <div className="engine-name">Brand Impersonation Matcher</div>
              <div className="engine-desc">Levenshtein distance against Indian banks, power offices & campus ERP</div>
            </div>
          </div>

          <div className="engine-check-item">
            <div className="engine-check-dot dot-emerald"></div>
            <div>
              <div className="engine-name">Statistical ML Classifier</div>
              <div className="engine-desc">TF-IDF + Calibrated Logistic Regression model for edge inference</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCritical = result.risk_level === 'CRITICAL';
  const isSuspicious = result.risk_level === 'SUSPICIOUS';
  const isSafe = result.risk_level === 'SAFE';

  let statusClass = 'status-safe';
  let statusColor = 'var(--risk-safe)';
  let StatusIcon = ShieldCheck;

  if (isCritical) {
    statusClass = 'status-critical';
    statusColor = 'var(--risk-critical)';
    StatusIcon = Flame;
  } else if (isSuspicious) {
    statusClass = 'status-suspicious';
    statusColor = 'var(--risk-suspicious)';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="result-section glass-panel">
      {/* Card Header Row */}
      <div style={{ marginBottom: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', paddingBottom: '10px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark-primary)' }}>
          Threat Evaluation & Risk Diagnosis
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
          Multi-vector assessment breakdown including composite risk score, detected deceptive tactics, and website safety.
        </p>
      </div>

      {/* Risk Dial & Classification Banner */}
      <div className="risk-meter-container">
        <div className="risk-dial">
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="rgba(0, 0, 0, 0.08)"
              strokeWidth="9"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={statusColor}
              strokeWidth="9"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * result.risk_score) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span className="risk-number" style={{ color: 'var(--text-dark-primary)' }}>
              {result.risk_score}
            </span>
            <div className="risk-scale" style={{ color: 'var(--text-dark-muted)' }}>/ 100</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '4px 12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: 'var(--text-dark-primary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: (isCritical || isSuspicious) ? '#ef4444' : '#10b981',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              />
              <span>{result.risk_level} THREAT</span>
            </span>

            {result.brand_impersonation && (
              <span
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-dark-primary)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
                }}
              >
                Target: {result.brand_impersonation}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-primary)', lineHeight: 1.45, fontWeight: 600 }}>
            {result.summary}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
            Case ID: <code style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>{result.id}</code> | ML Confidence: {Math.round(result.ml_confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Pre-Interaction Warning Interstitial Trigger Button (PS Requirement) */}
      {(result.url_analysis || isCritical || isSuspicious) && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={24} color={statusColor} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark-primary)' }}>
                Pre-Interaction Protective Shield
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)' }}>
                Simulate what a user experiences when clicking a dangerous link before entering credentials.
              </div>
            </div>
          </div>

          <button
            id="trigger-interstitial-btn"
            style={{
              backgroundColor: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={onOpenInterstitial}
          >
            <span>Simulate Link Intercept</span>
            <ExternalLink size={14} />
          </button>
        </div>
      )}

      {/* Itemized Explainable AI (XAI) Contributing Factors */}
      <div>
        <div style={{ marginBottom: '8px' }}>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-dark-primary)', fontWeight: 600, marginBottom: '2px' }}>
            Evidence & Detected Attack Patterns (Explainable AI):
          </h4>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dark-muted)' }}>
            Itemized breakdown of specific deceptive tactics found in message wording and link infrastructure.
          </span>
        </div>
        <div className="factors-list">
          {result.factors && result.factors.length > 0 ? (
            result.factors.map((factor, idx) => (
              <div key={idx} className={`factor-card ${factor.severity}`}>
                <div style={{ marginTop: '2px' }}>
                  {factor.severity === 'critical' ? (
                    <Flame size={16} color="#ef4444" />
                  ) : factor.severity === 'warning' ? (
                    <AlertTriangle size={16} color="#f59e0b" />
                  ) : (
                    <Info size={16} color="#3b82f6" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="factor-title">
                    {factor.category} — {factor.name}
                  </div>
                  <div className="factor-desc">{factor.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-dark-muted)' }}>
              No malicious linguistic or domain indicators detected.
            </div>
          )}
        </div>
      </div>

      {/* URL Deep Analysis Breakdown (Sahoo et al. 2017) */}
      {result.url_analysis && (
        <div style={{ padding: '14px', borderRadius: '12px', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
            <Globe2 size={16} color="var(--text-dark-primary)" style={{ marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark-primary)', display: 'block' }}>
                Website & Domain Infrastructure Telemetry:
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dark-muted)' }}>
                Technical inspection of domain randomness (entropy), disposable TLDs, and hosting safety.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-dark-muted)' }}>Host Domain: </span>
              <code style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>{result.url_analysis.domain}</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-dark-muted)' }}>Entropy: </span>
              <code style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>{result.url_analysis.entropy} bits</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-dark-muted)' }}>Raw IP Host: </span>
              <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: result.url_analysis.is_ip_host ? '#ef4444' : '#10b981', display: 'inline-block' }}></span>
                {result.url_analysis.is_ip_host ? 'YES (DANGEROUS)' : 'No'}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dark-muted)' }}>Disposable TLD: </span>
              <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: result.url_analysis.suspicious_tld ? '#ef4444' : '#10b981', display: 'inline-block' }}></span>
                {result.url_analysis.suspicious_tld ? 'YES (HIGH RISK)' : 'Standard'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Advice & Official Help Banner */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: '12px',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.07)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
          <PhoneCall size={15} color="var(--text-dark-primary)" style={{ marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dark-primary)', display: 'block' }}>
              Recommended Security Action & Reporting:
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dark-muted)' }}>
              Prescribed defensive steps and official incident reporting channels.
            </span>
          </div>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-dark-secondary)', lineHeight: 1.5, marginTop: '6px' }}>
          {result.recommended_action}
        </p>
      </div>
    </div>
  );
}
