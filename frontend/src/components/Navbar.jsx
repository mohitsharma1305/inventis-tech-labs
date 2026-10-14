import React from 'react';
import { Eye, Mail, LayoutGrid, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onQuickPreset }) {
  const isOnline = backendStatus?.status === 'online';

  return (
    <nav className="cyberguard-navbar">
      {/* Brand Section: Full Name and Logo on White Background */}
      <div className="brand-group" onClick={() => setActiveTab('analyze')}>
        <div className="brand-white-pill">
          <img src="/logoandname.png" alt="Inventis" className="brand-logoandname-img" />
        </div>
        <span className="brand-tag-skit">SKIT025</span>
      </div>

      {/* Center Navigation Pills (Restored original names, Executions removed) */}
      <div className="center-nav-pills">
        <button
          id="nav-overview-btn"
          className={`nav-pill-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          Threat Scanner
        </button>

        <button
          id="nav-alerts-btn"
          className={`nav-pill-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Case History
        </button>

        <button
          id="nav-insights-btn"
          className={`nav-pill-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Security Operations
        </button>

        <button
          id="nav-quick-plus-btn"
          className="nav-pill-plus"
          title="Quick 1-Click Scenario Preset"
          onClick={onQuickPreset}
        >
          +
        </button>
      </div>

      {/* Right Quick Action Group */}
      <div className="right-nav-actions">
        <button
          id="nav-alerts-table-btn"
          className="pill-action-btn"
          onClick={() => setActiveTab('history')}
        >
          Alerts Table
        </button>

        <button
          className="icon-circle-btn"
          title={isOnline ? "AI Pipeline Active (Port 8000)" : "Client Mode"}
          onClick={() => setActiveTab('analyze')}
        >
          <Eye size={15} color={isOnline ? '#10b981' : '#ff6b2b'} />
        </button>

        <button
          className="icon-circle-btn"
          title="Security Incidents Mail"
          onClick={() => setActiveTab('history')}
        >
          <Mail size={15} />
        </button>

        <button
          className="icon-circle-btn"
          title="Threat Radar Layout"
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutGrid size={15} />
        </button>
      </div>
    </nav>
  );
}
