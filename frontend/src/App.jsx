import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BenchmarkSelector from './components/BenchmarkSelector';
import Scanner from './components/Scanner';
import AnalysisResult from './components/AnalysisResult';
import InterstitialModal from './components/InterstitialModal';
import CaseHistory from './components/CaseHistory';
import Dashboard from './components/Dashboard';
import AcademicDocs from './components/AcademicDocs';
import { checkBackendHealth, analyzeContent, fetchBenchmarks } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [backendStatus, setBackendStatus] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);

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

  const handleSelectCaseFromHistory = (historyRow) => {
    setInputText(historyRow.preview);
    setInputUrl(historyRow.url || '');
    setChannel(historyRow.channel);
    setActiveTab('analyze');
    handleRunAnalysis(historyRow.preview, historyRow.url || '', historyRow.channel);
  };

  return (
    <div className="app-container">
      {/* Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {/* Main Tab Routing */}
      {activeTab === 'analyze' && (
        <>
          {/* 1-Click Test Scenarios for Hackathon Presentation */}
          <BenchmarkSelector
            benchmarks={benchmarks}
            onSelectBenchmark={handleSelectBenchmark}
          />

          {/* Scanner & Real-Time Intelligence View */}
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
        </>
      )}

      {activeTab === 'history' && (
        <CaseHistory onSelectCase={handleSelectCaseFromHistory} />
      )}

      {activeTab === 'dashboard' && (
        <Dashboard />
      )}

      {activeTab === 'research' && (
        <AcademicDocs />
      )}

      {/* Pre-Interaction Protective Modal (SKIT025 Key Requirement) */}
      <InterstitialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
      />
    </div>
  );
}
