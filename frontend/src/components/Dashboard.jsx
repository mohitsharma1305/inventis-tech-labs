import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  BarChart2,
  Layers,
  Building,
  Mail,
  MessageSquare,
  Share2,
  Globe
} from 'lucide-react';
import { fetchDashboardStats } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark-muted)' }}>Loading security operations metrics...</div>;
  }

  const total = stats.total_analyzed || 1;
  const critPct = Math.round((stats.critical_threats / total) * 100);
  const suspPct = Math.round((stats.suspicious_cases / total) * 100);
  const safePct = Math.round((stats.safe_cases / total) * 100);

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-dark-primary)' }}>
          Security Operations Center (SOC) Telemetry
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
          Real-time enterprise metrics, threat channel origins, and brand impersonation tracking across the Indian communications ecosystem.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-label">
            <Activity size={16} color="var(--text-dark-primary)" />
            <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>Total Messages Evaluated</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--text-dark-primary)' }}>{stats.total_analyzed}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
            Real-time multi-modal audit stream
          </span>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-label">
            <ShieldAlert size={16} color="var(--text-dark-primary)" />
            <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>Critical Phishing Blocked</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--text-dark-primary)' }}>
            {stats.critical_threats}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
            {critPct}% of inspected vectors
          </span>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-label">
            <AlertTriangle size={16} color="var(--text-dark-primary)" />
            <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>Suspicious Anomalies</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--text-dark-primary)' }}>
            {stats.suspicious_cases}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
            {suspPct}% required warning
          </span>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-label">
            <ShieldCheck size={16} color="var(--text-dark-primary)" />
            <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600 }}>Clean / Safe Traffic</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--text-dark-primary)' }}>
            {stats.safe_cases}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
            {safePct}% passed security baseline
          </span>
        </div>
      </div>

      {/* Main Analysis Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Risk Distribution Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark-primary)' }}>
            <BarChart2 size={18} color="var(--text-dark-primary)" />
            <span>Threat Severity Distribution</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                  Critical Phishing & Scams (70–100)
                </span>
                <span style={{ color: 'var(--text-dark-muted)' }}>{stats.critical_threats} cases ({critPct}%)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${critPct}%`, background: '#ef4444' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                  Suspicious Communications (30–69)
                </span>
                <span style={{ color: 'var(--text-dark-muted)' }}>{stats.suspicious_cases} cases ({suspPct}%)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${suspPct}%`, background: '#f59e0b' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-dark-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                  Verified Clean Messages (0–29)
                </span>
                <span style={{ color: 'var(--text-dark-muted)' }}>{stats.safe_cases} cases ({safePct}%)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${safePct}%`, background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Impersonated Targets */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark-primary)' }}>
            <Building size={18} color="var(--text-dark-primary)" />
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
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dark-muted)' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-dark-primary)' }}>
                    {b.brand}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    color: 'var(--text-dark-primary)',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark-primary)' }}>
          <Layers size={18} color="var(--text-dark-primary)" />
          <span>Threat Origin by Communication Channel</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {Object.entries(stats.threats_by_channel || {}).map(([chan, cnt]) => {
            const chanLower = chan.toLowerCase();
            let ChannelIcon = Globe;
            if (chanLower.includes('mail')) ChannelIcon = Mail;
            else if (chanLower.includes('sms')) ChannelIcon = MessageSquare;
            else if (chanLower.includes('social') || chanLower.includes('whatsapp')) ChannelIcon = Share2;

            return (
              <div
                key={chan}
                style={{
                  padding: '18px 16px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  <ChannelIcon size={14} color="var(--text-dark-primary)" />
                  <span>{chan}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark-primary)', margin: '2px 0' }}>
                  {cnt}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dark-muted)', fontWeight: 500 }}>
                  Active Channel Filter
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
