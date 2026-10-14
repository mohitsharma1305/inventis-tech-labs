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
    fetchBenchmarks().then((data) => {
      setBenchmarks(data);
      if (data && data.length > 0) {
        setInputText(data[0].sample_text);
        setInputUrl(data[0].sample_url || '');
        setChannel(data[0].channel);
        // Pre-run analysis so dashboard has data, but DO NOT auto-open popup on start
        handleRunAnalysis(data[0].sample_text, data[0].sample_url || '', data[0].channel, false);
      }
    });
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
      // NOTE: Do NOT auto-open modal on scans or presets. 
      // The modal only opens when the user explicitly clicks "Simulate Link Intercept".
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
    // Execute analysis smoothly without popping up any modal
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
            onTriggerAutomation={() => handleQuickPreset()}
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




      {/* Pre-Interaction Protective Modal (SKIT025 Interstitial Shield) */}
      <InterstitialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
      />
    </div>
  );
}
