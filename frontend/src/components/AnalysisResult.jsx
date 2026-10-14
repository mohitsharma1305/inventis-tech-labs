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
      <div className="result-section glass-panel ready-state-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div className="ready-brand-container">
          <div className="ready-brand-pill">
            <img src="/logoandname.png" alt="Inventis Detection Engine" className="ready-brand-img" />
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.25rem', marginTop: '16px', fontWeight: 700 }}>
          Inventis Engine Ready
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '8px auto 0' }}>
          Paste suspect content on the left or select an IEEE-IGNITE test preset to trigger real-time AI linguistic, URL entropy, and brand impersonation analysis.
        </p>
        <div className="ready-state-badges">
          <span className="ready-badge">
            <img src="/logo.png" alt="Emblem" className="ready-badge-icon" />
            <span>Sub-millisecond NLP Engine</span>
          </span>
          <span className="ready-badge">
            <img src="/logo.png" alt="Emblem" className="ready-badge-icon" />
            <span>Shannon Entropy Scanner</span>
          </span>
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
      {/* Risk Dial & Classification Banner */}
      <div className="risk-meter-container">
        <div className="risk-dial">
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
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
            <span className="risk-number" style={{ color: statusColor }}>
              {result.risk_score}
            </span>
            <div className="risk-scale">/ 100</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`risk-status-badge ${statusClass}`}>
              <StatusIcon size={16} />
              <span>{result.risk_level} THREAT</span>
            </span>
            {result.brand_impersonation && (
              <span
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontWeight: 600
                }}
              >
                Target: {result.brand_impersonation}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.45, fontWeight: 500 }}>
            {result.summary}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Case ID: <code style={{ color: 'var(--accent-cyan)' }}>{result.id}</code> | ML Confidence: {Math.round(result.ml_confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Pre-Interaction Warning Interstitial Trigger Button (PS Requirement) */}
      {(result.url_analysis || isCritical || isSuspicious) && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={24} color={statusColor} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                Pre-Interaction Protective Shield Ready
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Demonstrate user protection before link interaction.
              </div>
            </div>
          </div>

          <button
            id="trigger-interstitial-btn"
            style={{
              backgroundColor: statusColor,
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
        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>
          Evidence & Contributing Factors (SmishX Explainability):
        </h4>
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
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              No malicious linguistic or domain indicators detected.
            </div>
          )}
        </div>
      </div>

      {/* URL Deep Analysis Breakdown (Sahoo et al. 2017) */}
      {result.url_analysis && (
        <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Globe2 size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>
              URL Infrastructure Inspection (Sahoo et al.):
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Host Domain: </span>
              <code style={{ color: '#fff' }}>{result.url_analysis.domain}</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Entropy: </span>
              <code style={{ color: 'var(--accent-cyan)' }}>{result.url_analysis.entropy} bits</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Raw IP Host: </span>
              <span style={{ color: result.url_analysis.is_ip_host ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                {result.url_analysis.is_ip_host ? 'YES (DANGEROUS)' : 'No'}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Disposable TLD: </span>
              <span style={{ color: result.url_analysis.suspicious_tld ? '#ef4444' : '#10b981', fontWeight: 600 }}>
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
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <PhoneCall size={15} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            Recommended Security Action:
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {result.recommended_action}
        </p>
      </div>
    </div>
  );
}
