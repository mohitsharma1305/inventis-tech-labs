import React from 'react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onQuickPreset }) {
  return (
    <nav className="cyberguard-navbar">
      {/* Brand Section: Full Name and Logo on White Background */}
      <div className="brand-group" onClick={() => setActiveTab('analyze')}>
        <div className="brand-white-pill">
          <img src="/logoandname.png" alt="Inventis" className="brand-logoandname-img" />
        </div>
        <span className="brand-tag-skit">SKIT025</span>
      </div>

      {/* Center Navigation Pills */}
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
    </nav>
  );
}
