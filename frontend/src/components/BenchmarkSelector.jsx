import React from 'react';
import { Zap } from 'lucide-react';

export default function BenchmarkSelector({ benchmarks, onSelectBenchmark }) {
  if (!benchmarks || benchmarks.length === 0) return null;

  return (
    <div className="benchmarks-bar glass-panel">
      <div className="benchmarks-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="var(--accent-orange)" />
          <span style={{ fontWeight: 600, color: 'var(--text-dark-primary)' }}>Live Scam Test Scenarios (1-Click Simulation Presets)</span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)' }}>
          Click any preset to simulate real-world attacks (banking KYC, campus ERP fee fraud, power bill scam, or safe alerts) and see how the defense system responds.
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
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isCritical ? '#ef4444' : '#10b981',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              />
              <span style={{ color: 'var(--text-dark-primary)', fontWeight: 500 }}>{bench.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
