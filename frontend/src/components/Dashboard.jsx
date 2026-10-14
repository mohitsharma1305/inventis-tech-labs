import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, AlertTriangle, Activity, BarChart2, TrendingUp, Layers, Building } from 'lucide-react';
import { fetchDashboardStats } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading security operations metrics...</div>;
  }

  const total = stats.total_analyzed || 1;
  const critPct = Math.round((stats.critical_threats / total) * 100);
  const suspPct = Math.round((stats.suspicious_cases / total) * 100);
  const safePct = Math.round((stats.safe_cases / total) * 100);

  return (
    <div>
      {/* KPI Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-label">
            <Activity size={16} color="var(--accent-cyan)" />
            <span>Total Messages Evaluated</span>
          </div>
          <div className="stat-value">{stats.total_analyzed}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time multi-modal audit stream
          </span>
        </div>

        <div className="stat-card glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="stat-label">
            <Flame size={16} color="#ef4444" />
            <span>Critical Phishing Blocked</span>
          </div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {stats.critical_threats}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
            {critPct}% of inspected vectors
          </span>
        </div>

        <div className="stat-card glass-panel" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="stat-label">
            <AlertTriangle size={16} color="#f59e0b" />
            <span>Suspicious Anomalies</span>
          </div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.suspicious_cases}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fcd34d' }}>
            {suspPct}% required warning
          </span>
        </div>

        <div className="stat-card glass-panel" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className="stat-label">
            <ShieldCheck size={16} color="#10b981" />
            <span>Clean / Safe Traffic</span>
          </div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.safe_cases}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#86efac' }}>
            {safePct}% passed security baseline
          </span>
        </div>
      </div>

      {/* Main Analysis Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Risk Distribution Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="var(--accent-cyan)" />
            <span>Threat Severity Distribution</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Critical Phishing & Scams (70–100)</span>
                <span>{stats.critical_threats} cases ({critPct}%)</span>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${critPct}%`, background: '#ef4444' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>Suspicious Communications (30–69)</span>
                <span>{stats.suspicious_cases} cases ({suspPct}%)</span>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${suspPct}%`, background: '#f59e0b' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Verified Clean Messages (0–29)</span>
                <span>{stats.safe_cases} cases ({safePct}%)</span>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${safePct}%`, background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Impersonated Targets */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={18} color="var(--accent-cyan)" />
            <span>Top Impersonated Entities (Indian Ecosystem)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.top_impersonated_brands && stats.top_impersonated_brands.map((b, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#fff' }}>
                    {b.brand}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171'
                  }}
                >
                  {b.count} attempts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attack Vectors by Channel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-cyan)" />
          <span>Threat Origin by Communication Channel</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {Object.entries(stats.threats_by_channel || {}).map(([chan, cnt]) => (
            <div
              key={chan}
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {chan}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
                {cnt}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                Active Channel Filter
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
