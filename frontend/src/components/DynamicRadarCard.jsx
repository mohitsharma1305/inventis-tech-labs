import React from 'react';
import {
  ArrowLeft,
  MoreHorizontal,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function DynamicRadarCard({
  result,
  totalScans = 65,
  criticalCount = 3,
  suspiciousCount = 2,
  safeCount = 5,
  onOpenInterstitial,
  onSelectBenchmark,
  benchmarks = []
}) {
  // Determine dial values based on current analysis result or baseline
  const score = result ? result.risk_score : 10;
  const isCritical = result?.risk_level === 'CRITICAL';
  const isSuspicious = result?.risk_level === 'SUSPICIOUS';
  const isSafe = result?.risk_level === 'SAFE';

  // Arc length for SVG circle: circumference = 2 * PI * 65 ≈ 408.4; semicircle ≈ 204.2
  // strokeDasharray = `${(score / 100) * 204.2} 408.4`
  const strokeLength = (score / 100) * 204.2;

  let gaugeColor = '#10b981'; // default emerald mint from screenshot
  let gaugeLabel = 'Manually Resolved';
  if (result) {
    if (isCritical) {
      gaugeColor = '#ff6b2b';
      gaugeLabel = 'Critical Phishing';
    } else if (isSuspicious) {
      gaugeColor = '#f59e0b';
      gaugeLabel = 'Suspicious Hazard';
    } else {
      gaugeColor = '#10b981';
      gaugeLabel = 'Verified Safe';
    }
  }

  return (
    <div className="dynamic-hero-card">
      {/* Card Header Row */}
      <div className="dynamic-header">
        <div className="dynamic-title-group">
          <button className="back-btn" title="Back to Overview">
            <ArrowLeft size={16} />
          </button>
          <h2 className="dynamic-title">Dynamic View</h2>
        </div>

        <div className="dynamic-meta-group">
          <div className="live-feed-indicator">
            <span className="live-dot"></span>
            <span>Live Feed</span>
          </div>

          <div className="time-pill">24h</div>

          <button className="icon-more-btn" title="Options">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Main 3-Column Cockpit Layout */}
      <div className="dynamic-cockpit-grid">
        {/* Left Column: Ingestion & Incident Counters */}
        <div className="cockpit-left">
          <div>
            <div className="stat-heading">Data Ingestion</div>
            <div className="stat-large">
              <span>{totalScans}</span>
              <span className="stat-unit">Total</span>
            </div>

            {/* Sparkline wave chart SVG */}
            <div className="sparkline-wrapper">
              <svg viewBox="0 0 120 40" className="sparkline-svg">
                <path
                  d="M 5,28 Q 25,36 40,24 T 75,30 T 95,14 T 115,10"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.75)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <circle cx="115" cy="10" r="3" fill="#ff6b2b" />
              </svg>
            </div>
          </div>

          <div className="incidents-block">
            <div className="stat-heading">Open Incidents</div>
            <div className="incident-pills-row">
              <div className="incident-badge-item">
                <div className="incident-circle bg-orange">{criticalCount}</div>
                <span className="incident-label">C</span>
              </div>
              <div className="incident-badge-item">
                <div className="incident-circle bg-orange">{suspiciousCount}</div>
                <span className="incident-label">H</span>
              </div>
              <div className="incident-badge-item">
                <div className="incident-circle bg-orange">{safeCount}</div>
                <span className="incident-label">M</span>
              </div>
              <div className="incident-badge-item">
                <div className="incident-circle bg-dark">0</div>
                <span className="incident-label">L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Semicircular Radar with Concentric Orbit Rings & Center Dial */}
        <div className="cockpit-center">
          <div className="radar-stage">
            {/* Top Endpoint counters */}
            <div className="radar-top-stats">
              <div className="radar-stat-item left-pos">
                <span className="count">+68</span>
                <span className="sub">Sources</span>
              </div>
              <div className="radar-stat-item center-pos">
                <span className="count">4.7k</span>
                <span className="sub">Endpoints</span>
                <div className="node-hazard" style={{ marginTop: '4px' }}>
                  <AlertTriangle size={13} color="#ff6b2b" />
                </div>
              </div>
            </div>

            {/* Concentric Arcs Radar SVG */}
            <svg viewBox="0 0 540 280" className="radar-rings-svg">
              {/* Outer Arc 1 */}
              <path
                d="M 40,270 A 230,230 0 0,1 500,270"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.2"
                strokeDasharray="3 4"
              />
              {/* Middle Arc 2 */}
              <path
                d="M 90,270 A 180,180 0 0,1 450,270"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.4"
                strokeDasharray="4 5"
              />
              {/* Inner Arc 3 */}
              <path
                d="M 140,270 A 130,130 0 0,1 400,270"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.2"
                strokeDasharray="2 3"
              />

              {/* Connecting ticks */}
              <line x1="270" y1="40" x2="270" y2="140" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2 2" />
              <line x1="160" y1="90" x2="210" y2="170" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2 2" />
              <line x1="380" y1="90" x2="330" y2="170" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2 2" />
            </svg>

            {/* Floating Brand & Hazard Nodes on the Orbit Arcs */}
            <div className="radar-nodes-overlay">
              {/* Okta Node with Hazard */}
              <div className="radar-brand-tag" style={{ left: '22%', top: '48%' }}>
                <span className="brand-pill-text">okta</span>
              </div>

              {/* Apache Node */}
              <div className="radar-brand-tag" style={{ left: '16%', top: '78%' }}>
                <span className="brand-pill-text" style={{ fontSize: '0.75rem', opacity: 0.85 }}>APACHE</span>
              </div>

              {/* Vultr Node */}
              <div className="radar-brand-tag" style={{ right: '27%', top: '38%' }}>
                <span className="brand-icon-symbol">▲</span>
                <span className="brand-pill-text" style={{ fontSize: '0.72rem' }}>VULTR</span>
              </div>

              {/* AWS Node with Hazard */}
              <div className="radar-brand-tag" style={{ right: '18%', top: '60%' }}>
                <div className="mini-hazard-triangle">
                  <AlertTriangle size={11} color="#ff6b2b" />
                </div>
                <span className="brand-pill-text" style={{ fontWeight: 600 }}>aws</span>
              </div>

              {/* Alibaba Cloud Node */}
              <div className="radar-brand-tag" style={{ right: '12%', top: '82%' }}>
                <span className="brand-pill-text" style={{ fontSize: '0.68rem', opacity: 0.75 }}>[-] Alibaba Cloud</span>
              </div>

              {/* Hazard tags */}
              <div className="hazard-indicator-dot" style={{ left: '33%', top: '65%' }}>
                <AlertTriangle size={12} color="#ff6b2b" />
              </div>
              <div className="hazard-indicator-dot" style={{ left: '46%', top: '32%' }}>
                <AlertTriangle size={12} color="#ff6b2b" />
              </div>
            </div>

            {/* Semicircular Speedometer Dial Centerpiece */}
            <div className="dial-container">
              <svg viewBox="0 0 160 90" className="dial-svg">
                {/* Background arc */}
                <path
                  d="M 15,85 A 65,65 0 0,1 145,85"
                  fill="none"
                  stroke="#1c2520"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Active progress arc */}
                <path
                  d="M 15,85 A 65,65 0 0,1 145,85"
                  fill="none"
                  stroke={gaugeColor}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={`${strokeLength} 250`}
                  style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.4s ease' }}
                />
              </svg>

              <div className="dial-content">
                <div className="dial-percent" style={{ color: gaugeColor }}>
                  {score}%
                </div>
                <div className="dial-status-label">{gaugeLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed & Notification Cards */}
        <div className="cockpit-right">
          <div className="feed-cards-stack">
            {/* Pill 1 */}
            <div className="feed-pill">
              <span className="feed-icon-box">📋</span>
              <span className="feed-text">3 Incidents reopened</span>
            </div>

            {/* Highlighted Orange Card: Active Intercept / Hazard */}
            <div
              className={`feed-pill-alert ${isCritical ? 'glow-alert' : ''}`}
              onClick={result?.interstitial_warning_needed ? onOpenInterstitial : undefined}
              style={{ cursor: result?.interstitial_warning_needed ? 'pointer' : 'default' }}
              title={result?.interstitial_warning_needed ? "Click to view Pre-Interaction Interstitial Modal" : ""}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="#fff" />
                <span className="alert-bold">
                  {result?.brand_impersonation ? `${result.brand_impersonation} | Impersonation` : 'okta | Connection error'}
                </span>
              </div>
              {result?.interstitial_warning_needed && (
                <ExternalLink size={14} color="#fff" style={{ opacity: 0.85 }} />
              )}
            </div>

            {/* Pill 3 */}
            <div className="feed-pill">
              <span className="feed-icon-box">🛡️</span>
              <span className="feed-text">2 Incidents reopened</span>
            </div>

            {/* Pill 4 */}
            <div className="feed-pill">
              <span className="feed-icon-box">⚡</span>
              <span className="feed-text">Incident created | ID-997</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
