import React from 'react';
import { Zap, AlertCircle, ShieldCheck, Flame } from 'lucide-react';

export default function BenchmarkSelector({ benchmarks, onSelectBenchmark }) {
  if (!benchmarks || benchmarks.length === 0) return null;

  return (
    <div className="benchmarks-bar glass-panel">
      <div className="benchmarks-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 600, color: '#fff' }}>IEEE-IGNITE Demonstration Scenarios (1-Click Test Presets)</span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Click any preset to auto-populate and test real-world Indian & campus scam vectors
        </span>
      </div>

      <div className="preset-chip-list">
        {benchmarks.map((bench) => {
          const isCritical = bench.expected_risk === 'CRITICAL';
          return (
            <button
              key={bench.id}
              id={`preset-${bench.id}`}
              className="preset-chip"
              onClick={() => onSelectBenchmark(bench)}
              title={bench.description}
            >
              {isCritical ? (
                <Flame size={14} color="#ef4444" />
              ) : (
                <ShieldCheck size={14} color="#10b981" />
              )}
              <span>{bench.title}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isCritical ? '#fca5a5' : '#86efac',
                  fontWeight: 600
                }}
              >
                {bench.expected_risk}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
