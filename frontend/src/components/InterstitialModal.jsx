import React from 'react';
import { ShieldAlert, AlertOctagon, XCircle, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function InterstitialModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  const targetUrl = result.url_analysis?.url || result.inputUrl || 'http://unverified-domain.detected/payload';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="interstitial-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-brand">
          <div className="modal-brand-pill">
            <img src="/logoandname.png" alt="Inventis Safety Shield" className="modal-brand-img" />
          </div>
        </div>

        <div className="interstitial-shield">
          <img src="/logo.png" alt="Inventis Intercept Shield" className="modal-shield-logo" />
        </div>

        <div>
          <h2 className="interstitial-title">
            Pre-Interaction Threat Intercept
          </h2>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#fca5a5', marginTop: '4px' }}>
            IEEE-IGNITE Safety Shield intervened before your browser accessed untrusted content.
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Destination Target Intercepted:
          </span>
          <div className="interstitial-dest">
            {targetUrl}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '0.82rem' }}>
          <div style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
            Why Access Was Blocked:
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.brand_impersonation && (
              <li>
                <strong style={{ color: '#f87171' }}>Impersonation Hazard:</strong> Host does not belong to authorized servers of {result.brand_impersonation}.
              </li>
            )}
            <li>
              <strong style={{ color: '#f87171' }}>Urgency Manipulation:</strong> Message text utilizes artificial deadlines to panic the reader.
            </li>
            <li>
              <strong style={{ color: '#f87171' }}>Credential Harvesting Risk:</strong> Detected high likelihood of fake login or payment deceptions.
            </li>
          </ul>
        </div>

        <div className="interstitial-actions">
          <button
            id="modal-abort-btn"
            className="btn-abort"
            onClick={() => {
              alert('Protection confirmed: Navigation aborted. Threat logged to security history.');
              onClose();
            }}
          >
            <ShieldCheck size={18} />
            <span>Abort & Block Link (Safe Choice)</span>
          </button>

          <button
            id="modal-close-btn"
            className="btn-bypass"
            onClick={onClose}
          >
            Close Shield
          </button>
        </div>
      </div>
    </div>
  );
}
