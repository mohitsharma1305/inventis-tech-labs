import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DynamicRadarCard from './components/DynamicRadarCard';
import BenchmarkSelector from './components/BenchmarkSelector';
import Scanner from './components/Scanner';
import AnalysisResult from './components/AnalysisResult';
import BottomGrid from './components/BottomGrid';
import InterstitialModal from './components/InterstitialModal';
import CaseHistory from './components/CaseHistory';
import Dashboard from './components/Dashboard';
import AcademicDocs from './components/AcademicDocs';
import { checkBackendHealth, analyzeContent, fetchBenchmarks } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [backendStatus, setBackendStatus] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [presetIndex, setPresetIndex] = useState(0);

  // Scanner state
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [channel, setChannel] = useState('sms');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Pre-interaction modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkBackendHealth().then((status) => setBackendStatus(status));
    fetchBenchmarks().then((data) => setBenchmarks(data));
  }, []);

  const handleRunAnalysis = async (customText, customUrl, customChannel) => {
    const textToScan = customText !== undefined ? customText : inputText;
    const urlToScan = customUrl !== undefined ? customUrl : inputUrl;
    const chanToScan = customChannel !== undefined ? customChannel : channel;

    if (!textToScan.trim() && !urlToScan.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await analyzeContent({
        text: textToScan,
        url: urlToScan || null,
        channel: chanToScan
      });
      setResult(res);

      // Auto-open interstitial warning if threat is critical
      if (res.interstitial_warning_needed && res.risk_level === 'CRITICAL') {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectBenchmark = (bench) => {
    setInputText(bench.sample_text);
    setInputUrl(bench.sample_url || '');
    setChannel(bench.channel);
    setActiveTab('analyze');
    // Auto-execute analysis for smooth 1-click jury demo
    handleRunAnalysis(bench.sample_text, bench.sample_url || '', bench.channel);
  };

  const handleQuickPreset = () => {
    if (!benchmarks || benchmarks.length === 0) return;
    const nextIdx = (presetIndex + 1) % benchmarks.length;
    setPresetIndex(nextIdx);
    handleSelectBenchmark(benchmarks[nextIdx]);
  };

  const handleSelectCaseFromHistory = (historyRow) => {
    setInputText(historyRow.preview);
    setInputUrl(historyRow.url || '');
    setChannel(historyRow.channel);
    setActiveTab('analyze');
    handleRunAnalysis(historyRow.preview, historyRow.url || '', historyRow.channel);
  };

  return (
    <div className="app-container">
      {/* Top Navbar Matching Screenshot */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onQuickPreset={handleQuickPreset}
      />

      {/* Main Tab Routing */}
      {activeTab === 'analyze' && (
        <>
          {/* Flagship Dynamic Radar Cockpit (Matching Dark Hero Card in Screenshot) */}
          <DynamicRadarCard
            result={result}
            totalScans={65}
            criticalCount={3}
            suspiciousCount={2}
            safeCount={5}
            onOpenInterstitial={() => setIsModalOpen(true)}
            onSelectBenchmark={handleSelectBenchmark}
            benchmarks={benchmarks}
          />

          {/* 1-Click Demonstration Scenarios Presets Bar */}
          <BenchmarkSelector
            benchmarks={benchmarks}
            onSelectBenchmark={handleSelectBenchmark}
          />

          {/* Scanner Console & XAI Intelligence View */}
          <div className="scanner-grid">
            <Scanner
              inputText={inputText}
              setInputText={setInputText}
              inputUrl={inputUrl}
              setInputUrl={setInputUrl}
              channel={channel}
              setChannel={setChannel}
              isAnalyzing={isAnalyzing}
              onAnalyze={() => handleRunAnalysis()}
              triggers={result?.triggers}
            />

            <AnalysisResult
              result={result}
              onOpenInterstitial={() => setIsModalOpen(true)}
            />
          </div>

          {/* 4 Bottom Sage Cards & Timeline Strip (Matching Bottom Grid in Screenshot) */}
          <BottomGrid
            onOpenTimeline={() => setActiveTab('history')}
            onTriggerAutomation={(type) => {
              if (type === 'playbooks') setIsModalOpen(true);
              else handleQuickPreset();
            }}
          />
        </>
      )}

      {activeTab === 'history' && (
        <>
          <CaseHistory onSelectCase={handleSelectCaseFromHistory} />
          <BottomGrid
            onOpenTimeline={() => setActiveTab('history')}
            onTriggerAutomation={() => handleQuickPreset()}
          />
        </>
      )}

      {activeTab === 'dashboard' && (
        <>
          <DynamicRadarCard
            result={result}
            onOpenInterstitial={() => setIsModalOpen(true)}
          />
          <Dashboard />
          <BottomGrid
            onOpenTimeline={() => setActiveTab('history')}
            onTriggerAutomation={() => handleQuickPreset()}
          />
        </>
      )}


      {/* Global Application Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand-lockup">
            <div className="footer-logo-pill">
              <img src="/logoandname.png" alt="Inventis" className="footer-logo-img" />
            </div>
            <span className="brand-tag-skit">SKIT025</span>
          </div>
          <p className="footer-text">
            Inventis — IEEE-IGNITE Hackathon | Swami Keshvanand Institute of Technology, Jaipur
          </p>
          <div className="footer-security-status">
            <img src="/logo.png" alt="Shield Emblem" className="footer-emblem-mini" />
            <span>Dual-Framework Threat Defense Pipeline Active</span>
          </div>
        </div>
      </footer>

      {/* Pre-Interaction Protective Modal (SKIT025 Interstitial Shield) */}
      <InterstitialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
      />
    </div>
  );
}
