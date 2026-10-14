import React from 'react';
import { Shield, Activity, Search, BarChart3, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const isOnline = backendStatus?.status === 'online';

  return (
    <nav className="navbar glass-panel">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Shield size={26} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">PhishGuard AI</span>
            <span className="brand-tag">SKIT025</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            IEEE-IGNITE Hackathon | Hybrid Phishing & URL Defense
          </p>
        </div>
      </div>

      <div className="nav-links">
        <button
          id="nav-scanner-btn"
          className={`nav-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <Activity size={17} />
          <span>Threat Scanner</span>
        </button>

        <button
          id="nav-history-btn"
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Search size={17} />
          <span>Case History</span>
        </button>

        <button
          id="nav-dashboard-btn"
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={17} />
          <span>Security Operations</span>
        </button>

        <button
          id="nav-research-btn"
          className={`nav-btn ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setActiveTab('research')}
        >
          <BookOpen size={17} />
          <span>Research & Papers</span>
        </button>
      </div>

      <div className="system-status-badge">
        <span className="pulse-dot" style={{ backgroundColor: isOnline ? 'var(--risk-safe)' : 'var(--risk-suspicious)' }}></span>
        <span>{isOnline ? 'AI Pipeline Active' : 'Client Resilient Mode'}</span>
      </div>
    </nav>
  );
}
