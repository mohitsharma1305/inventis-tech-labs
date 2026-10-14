import React from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  Network,
  Settings,
  Monitor,
  Laptop,
  Smartphone,
  HardDrive,
  User,
  Plus
} from 'lucide-react';

export default function BottomGrid({ onOpenTimeline, onTriggerAutomation }) {
  return (
    <div className="bottom-section-wrapper">
      {/* 4 Grid Cards */}
      <div className="bottom-cards-grid">
        {/* Card 1: Sources (with warm rose/coral glow) */}
        <div className="sage-card card-sources">
          <div className="card-top-row">
            <div>
              <h3 className="card-title">Telemetry Sources</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', display: 'block', marginTop: '2px' }}>
                Monitored streams & endpoint sensors
              </span>
            </div>
            <ArrowUpRight size={16} className="card-arrow" />
          </div>

          <div className="sources-list">
            <div className="source-item">
              <div className="source-meta">
                <span className="source-icon">
                  <Network size={14} color="var(--text-dark-secondary)" />
                </span>
                <span className="source-name">XDR Agent</span>
              </div>
              <div className="source-count-grp">
                <span className="source-num">37</span>
                <span className="source-badge">
                  <Settings size={12} color="var(--text-dark-muted)" />
                </span>
              </div>
            </div>

            <div className="source-item">
              <div className="source-meta">
                <span className="source-icon">
                  <Monitor size={14} color="var(--text-dark-secondary)" />
                </span>
                <span className="source-name">XDR Analitics BIOS</span>
              </div>
              <div className="source-count-grp">
                <span className="source-num">29</span>
                <span className="source-badge">
                  <Settings size={12} color="var(--text-dark-muted)" />
                </span>
              </div>
            </div>

            <div className="source-item">
              <div className="source-meta">
                <span className="source-icon">
                  <HardDrive size={14} color="var(--text-dark-secondary)" />
                </span>
                <span className="source-name">XDR BIOS</span>
              </div>
              <div className="source-count-grp">
                <span className="source-num">18</span>
                <span className="source-badge">
                  <Settings size={12} color="var(--text-dark-muted)" />
                </span>
              </div>
            </div>
          </div>

          {/* Pagination dots from screenshot */}
          <div className="card-pagination-dots">
            <span className="dot dot-active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Card 2: Alerts (with striped/segmented progress bars) */}
        <div className="sage-card card-alerts">
          <div className="card-top-row">
            <div>
              <h3 className="card-title">Alert Breakdown</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', display: 'block', marginTop: '2px' }}>
                Incidents segmented by threat severity
              </span>
            </div>
            <ArrowUpRight size={16} className="card-arrow" />
          </div>

          <div className="alerts-bars-list">
            {/* High */}
            <div className="alert-bar-row">
              <span className="alert-label">High</span>
              <div className="segmented-bar-track">
                <div className="segmented-bar-fill bar-red" style={{ width: '82%' }}></div>
              </div>
              <span className="alert-count">23</span>
            </div>

            {/* Medium */}
            <div className="alert-bar-row">
              <span className="alert-label">Medium</span>
              <div className="segmented-bar-track">
                <div className="segmented-bar-fill bar-orange" style={{ width: '56%' }}></div>
              </div>
              <span className="alert-count">15</span>
            </div>

            {/* Neutral */}
            <div className="alert-bar-row">
              <span className="alert-label">Neutral</span>
              <div className="segmented-bar-track dashed-track">
                <div className="segmented-bar-fill bar-neutral" style={{ width: '0%' }}></div>
              </div>
              <span className="alert-count">-</span>
            </div>

            {/* Low */}
            <div className="alert-bar-row">
              <span className="alert-label">Low</span>
              <div className="segmented-bar-track">
                <div className="segmented-bar-fill bar-emerald" style={{ width: '34%' }}></div>
              </div>
              <span className="alert-count">8</span>
            </div>

            {/* Errors */}
            <div className="alert-bar-row">
              <span className="alert-label">Errors</span>
              <div className="segmented-bar-track">
                <div className="segmented-bar-fill bar-crimson" style={{ width: '18%' }}></div>
              </div>
              <span className="alert-count">3</span>
            </div>
          </div>
        </div>

        {/* Card 3: Automation */}
        <div className="sage-card card-automation">
          <div className="card-top-row">
            <div>
              <h3 className="card-title">Automated Playbooks</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', display: 'block', marginTop: '2px' }}>
                Automated containment & quarantine workflows
              </span>
            </div>
            <ArrowUpRight size={16} className="card-arrow" />
          </div>

          <div className="automation-list">
            <div className="automation-item" onClick={() => onTriggerAutomation && onTriggerAutomation('playbooks')}>
              <div className="auto-icon-box">
                <ChevronRight size={14} />
              </div>
              <div>
                <span className="auto-code">/01</span>
                <span className="auto-title">Playbooks Complete</span>
              </div>
            </div>

            <div className="automation-item" onClick={() => onTriggerAutomation && onTriggerAutomation('analysis')}>
              <div className="auto-icon-box">
                <ChevronRight size={14} />
              </div>
              <div>
                <span className="auto-code">/02</span>
                <span className="auto-title">Waiting for Analysis</span>
              </div>
            </div>

            <div className="automation-item" onClick={() => onTriggerAutomation && onTriggerAutomation('recommendations')}>
              <div className="auto-icon-box">
                <ChevronRight size={14} />
              </div>
              <div>
                <span className="auto-code">/03</span>
                <span className="auto-title">Playbook Recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Assets */}
        <div className="sage-card card-assets">
          <div className="card-top-row">
            <div>
              <h3 className="card-title">Monitored Endpoints</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', display: 'block', marginTop: '2px' }}>
                Connected workstation and user devices
              </span>
            </div>
            <ArrowUpRight size={16} className="card-arrow" />
          </div>

          <div className="assets-content">
            <div className="assets-list">
              <div className="asset-row">
                <div className="asset-info">
                  <span className="asset-icon">
                    <Monitor size={14} color="var(--text-dark-secondary)" />
                  </span>
                  <span className="asset-status-dot dot-green"></span>
                  <span className="asset-name">pc1</span>
                </div>
              </div>

              <div className="asset-row">
                <div className="asset-info">
                  <span className="asset-icon">
                    <Laptop size={14} color="var(--text-dark-secondary)" />
                  </span>
                  <span className="asset-status-dot dot-orange"></span>
                  <span className="asset-name">ws-it20</span>
                </div>
              </div>

              <div className="asset-row">
                <div className="asset-info">
                  <span className="asset-icon">
                    <Smartphone size={14} color="var(--text-dark-secondary)" />
                  </span>
                  <span className="asset-status-dot dot-gray"></span>
                  <span className="asset-name">ip-4</span>
                </div>
              </div>
            </div>

            <div className="asset-large-stat">
              <span className="stat-big-num">12</span>
              <span className="stat-sub">New</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Strip (from screenshot) */}
      <div className="bottom-timeline-strip">
        <div className="timeline-segment">
          <div className="timeline-avatar">
            <User size={15} color="var(--text-dark-secondary)" />
          </div>
          <div className="timeline-meta">
            <span className="timeline-label">Created on</span>
            <span className="timeline-time">Sep 24th 2024 11:05:02</span>
          </div>
        </div>

        <button className="timeline-add-pill" title="Add incident note">
          <Plus size={14} />
        </button>

        <div className="timeline-segment">
          <div className="timeline-meta">
            <span className="timeline-label">Last alert added on</span>
            <span className="timeline-time">Sep 28th 2024 08:13:24</span>
          </div>
        </div>

        <div className="timeline-segment">
          <div className="timeline-avatar">
            <User size={15} color="var(--text-dark-secondary)" />
          </div>
          <div className="timeline-meta">
            <span className="timeline-label">Assign on</span>
            <span className="timeline-time">Oct 15th 2024 10:42:11</span>
          </div>
        </div>
      </div>
    </div>
  );
}
