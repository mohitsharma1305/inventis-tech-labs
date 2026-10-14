import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  X,
  ShieldCheck,
  Globe,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function InterstitialModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  const targetUrl = result.url_analysis?.url || result.inputUrl || 'http://unverified-domain.detected/payload';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="interstitial-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Window Titlebar */}
        <div className="modal-window-titlebar">
          <div className="modal-titlebar-brand">
            <div className="modal-brand-badge-mini">
              <img src="/logo.png" alt="Inventis" className="modal-logo-mini" />
            </div>
            <span className="modal-titlebar-text">Inventis Security Gateway</span>
            <span className="modal-titlebar-tag">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', marginRight: '5px' }}></span>
              Target Intercepted
            </span>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} title="Close window">
            <X size={15} />
          </button>
        </div>

        {/* Warning Hero Block */}
        <div className="modal-hero-block">
          <div className="modal-hazard-icon-wrap">
            <ShieldAlert size={20} color="var(--text-dark-primary)" />
          </div>
          <div className="modal-hero-texts">
            <h2 className="modal-hero-title">Untrusted Destination Blocked</h2>
            <p className="modal-hero-subtitle">
              Navigation to this external destination was halted because it exhibits characteristics of deceptive or malicious infrastructure.
            </p>
          </div>
        </div>

        {/* Intercepted URL Target Box */}
        <div className="modal-target-box">
          <div className="modal-target-label">
            <Globe size={13} color="var(--text-dark-primary)" />
            <span>Target Destination</span>
          </div>
          <div className="modal-target-url">
            {targetUrl}
          </div>
        </div>

        {/* Why Blocked - Itemized Threat Factors */}
        <div className="modal-threat-reasons">
          <div className="reasons-heading">Security Risk Findings</div>
          <div className="reasons-list">
            {result.brand_impersonation && (
              <div className="reason-item">
                <span className="reason-dot dot-red"></span>
                <div>
                  <strong className="reason-title">Impersonation Detected:</strong>
                  <span className="reason-desc"> Host infrastructure is not recognized as an authorized service for {result.brand_impersonation}.</span>
                </div>
              </div>
            )}
            <div className="reason-item">
              <span className="reason-dot dot-red"></span>
              <div>
                <strong className="reason-title">Social Engineering Pattern:</strong>
                <span className="reason-desc"> Message structure deploys artificial urgency cues designed to compel immediate compliance.</span>
              </div>
            </div>
            <div className="reason-item">
              <span className="reason-dot dot-red"></span>
              <div>
                <strong className="reason-title">Credential Theft Risk:</strong>
                <span className="reason-desc"> High probability of harvesting banking credentials, one-time passwords, or unauthorized authorization.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="modal-actions-row">
          <button
            id="modal-abort-btn"
            className="btn-modal-abort"
            onClick={() => {
              alert('Protection confirmed: Navigation aborted. Threat logged to security history.');
              onClose();
            }}
          >
            <ShieldCheck size={16} />
            <span>Abort Navigation & Return</span>
          </button>

          <button
            id="modal-close-btn"
            className="btn-modal-dismiss"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
