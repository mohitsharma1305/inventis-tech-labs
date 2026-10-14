import React from 'react';
import { MessageSquare, Mail, Share2, Globe, ScanSearch, RefreshCw } from 'lucide-react';

export default function Scanner({
  inputText,
  setInputText,
  inputUrl,
  setInputUrl,
  channel,
  setChannel,
  isAnalyzing,
  onAnalyze,
  triggers
}) {
  // Render highlighted message spans if triggers are available
  const renderHighlightedText = () => {
    if (!triggers || triggers.length === 0 || !inputText) {
      return null;
    }

    // Sort triggers by start position
    const sorted = [...triggers].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIdx = 0;

    sorted.forEach((trig, i) => {
      // Unhighlighted text before trigger
      if (trig.start > lastIdx) {
        elements.push(
          <span key={`text-${i}`}>{inputText.substring(lastIdx, trig.start)}</span>
        );
      }

      // Highlighted trigger chip
      let className = 'hl-urgency';
      if (trig.category === 'coercion') className = 'hl-coercion';
      if (trig.category === 'credential') className = 'hl-credential';
      if (trig.category === 'greed') className = 'hl-greed';

      elements.push(
        <mark
          key={`trig-${i}`}
          className={className}
          title={`Detected Pattern: ${trig.category.toUpperCase()}`}
        >
          {inputText.substring(trig.start, trig.end)}
        </mark>
      );
      lastIdx = trig.end;
    });

    if (lastIdx < inputText.length) {
      elements.push(
        <span key="text-end">{inputText.substring(lastIdx)}</span>
      );
    }

    return (
      <div style={{ marginTop: '14px' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Real-time Linguistic Trigger Map (Salloum et al. 2022):
        </p>
        <div className="highlight-container">
          {elements}
        </div>
      </div>
    );
  };

  return (
    <div className="input-section glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
            Inspect Suspect Message or Link
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Evaluates text intent, typosquatting, urgency tension, and domain infrastructure.
          </p>
        </div>
      </div>

      {/* Channel Selector */}
      <div className="channel-selector">
        <button
          id="channel-sms-btn"
          className={`channel-btn ${channel === 'sms' ? 'active' : ''}`}
          onClick={() => setChannel('sms')}
        >
          <MessageSquare size={15} />
          <span>SMS Text</span>
        </button>

        <button
          id="channel-email-btn"
          className={`channel-btn ${channel === 'email' ? 'active' : ''}`}
          onClick={() => setChannel('email')}
        >
          <Mail size={15} />
          <span>Email</span>
        </button>

        <button
          id="channel-social-btn"
          className={`channel-btn ${channel === 'social' ? 'active' : ''}`}
          onClick={() => setChannel('social')}
        >
          <Share2 size={15} />
          <span>WhatsApp / Social</span>
        </button>

        <button
          id="channel-url-btn"
          className={`channel-btn ${channel === 'url' ? 'active' : ''}`}
          onClick={() => setChannel('url')}
        >
          <Globe size={15} />
          <span>Standalone URL</span>
        </button>
      </div>

      {/* Message Text Input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Message Content
          </label>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {inputText.length} characters
          </span>
        </div>
        <textarea
          id="message-textarea"
          className="text-input-area"
          placeholder="Paste suspect message text here (e.g. fake electricity bill, bank KYC alert, lottery notification, job offer)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {/* Optional Standalone URL Field */}
      <div>
        <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Destination URL (Optional / Auto-extracted from text)
        </label>
        <input
          id="url-input"
          type="text"
          className="url-input-field"
          placeholder="e.g. http://bijli-bill-update.online/pay or https://onlinesbi.sbi"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
      </div>

      {/* Real-time trigger visualizer if triggers exist */}
      {renderHighlightedText()}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
        <button
          id="run-analysis-btn"
          className="btn-primary"
          style={{ flex: 1 }}
          onClick={onAnalyze}
          disabled={isAnalyzing || (!inputText.trim() && !inputUrl.trim())}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={18} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing Vectors...</span>
            </>
          ) : (
            <>
              <ScanSearch size={18} />
              <span>Execute AI Threat Analysis</span>
            </>
          )}
        </button>

        {inputText && (
          <button
            id="clear-input-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: '10px',
              padding: '0 16px',
              cursor: 'pointer'
            }}
            onClick={() => {
              setInputText('');
              setInputUrl('');
            }}
          >
            Clear
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
