import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ExternalLink, ShieldCheck, Flame, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchHistory } from '../api/client';

export default function CaseHistory({ onSelectCase }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await fetchHistory(searchQuery, riskFilter, channelFilter);
      setHistory(items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, riskFilter, channelFilter]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `phishguard_audit_log_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700 }}>
            Searchable Threat Case Audit History
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Satisfies SKIT025 requirement: Search, filter, and review historical threat evaluations.
          </p>
        </div>

        <button
          id="export-audit-btn"
          className="preset-chip"
          style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'var(--accent-cyan)' }}
          onClick={exportJSON}
        >
          <Download size={14} color="var(--accent-cyan)" />
          <span style={{ color: '#fff', fontWeight: 600 }}>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
          <input
            id="history-search-input"
            type="text"
            className="url-input-field"
            style={{ paddingLeft: '38px', fontFamily: 'var(--font-body)' }}
            placeholder="Search keywords, domains, brands, or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Risk Level Filter */}
        <select
          id="risk-filter-select"
          className="url-input-field"
          style={{ width: '160px', cursor: 'pointer' }}
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="ALL">All Risk Levels</option>
          <option value="CRITICAL">Critical (High Risk)</option>
          <option value="SUSPICIOUS">Suspicious</option>
          <option value="SAFE">Safe / Verified</option>
        </select>

        {/* Channel Filter */}
        <select
          id="channel-filter-select"
          className="url-input-field"
          style={{ width: '140px', cursor: 'pointer' }}
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
        >
          <option value="all">All Channels</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="social">WhatsApp / Social</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>ID & Time</th>
              <th>Channel</th>
              <th>Message Preview</th>
              <th>Target Brand</th>
              <th>Risk Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((row) => {
                const isCrit = row.risk_level === 'CRITICAL';
                const isSusp = row.risk_level === 'SUSPICIOUS';
                const color = isCrit ? '#ef4444' : (isSusp ? '#f59e0b' : '#10b981');

                return (
                  <tr key={row.id}>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                        {row.id}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        {row.channel}
                      </span>
                    </td>

                    <td style={{ maxWidth: '380px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.preview}
                      </div>
                      {row.url && (
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                          {row.url}
                        </div>
                      )}
                    </td>

                    <td>
                      {row.brand_impersonation ? (
                        <span style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 500 }}>
                          {row.brand_impersonation}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>

                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: color
                        }}
                      >
                        {isCrit ? <Flame size={14} /> : (isSusp ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />)}
                        {row.risk_score} / 100
                      </span>
                    </td>

                    <td>
                      <button
                        className="preset-chip"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => onSelectCase && onSelectCase(row)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  {isLoading ? 'Loading records...' : 'No historical cases found matching current filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
