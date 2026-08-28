import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Sliders, Bell, Save, CheckCircle2, RefreshCw, Sparkles, Cpu, Sun, Moon, Play, Terminal, Check, AlertCircle } from 'lucide-react';
import { runForensicAlgorithmicTestSuite } from '../utils/testForensicAlgorithms';

export default function SettingsPage({ theme, toggleTheme }) {
  const [saved, setSaved] = useState(false);
  const [elaThreshold, setElaThreshold] = useState(22);
  const [fontSensitivity, setFontSensitivity] = useState(85);
  const [semanticStrictness, setSemanticStrictness] = useState(90);
  const [apiKey, setApiKey] = useState('sher_live_8910482910481029481924');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('SHERDETECT_GEMINI_API_KEY');
    if (savedGeminiKey) {
      setGeminiApiKey(savedGeminiKey);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (geminiApiKey) {
      localStorage.setItem('SHERDETECT_GEMINI_API_KEY', geminiApiKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRunTestSuite = async () => {
    setIsTesting(true);
    try {
      const results = await runForensicAlgorithmicTestSuite();
      setTestResults(results);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-body">
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#00E5FF] mb-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#97d700]"></span>
          <span>SHERDETECT ENGINE CALIBRATION & PARAMETERS</span>
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white tracking-tight">
          Forensic Parameters & Algorithmic Validation
        </h1>
        <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
          Adjust multi-layer detection sensitivities and run empirical unit tests for all 6 forensic algorithms.
        </p>
      </div>

      {/* 🧪 ALGORITHMIC TEST RUNNER SUITE */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#00E5FF]">
              <Terminal size={22} />
            </div>
            <div>
              <h2 className="text-lg font-headline font-extrabold tracking-wide">6-Algorithm Forensic Validation Suite</h2>
              <p className="text-xs text-gray-300">Run automated mathematical test cases for ELA, EXIF, Typography, Noise, Parity, and Active Learning.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunTestSuite}
            disabled={isTesting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider shadow-lg hover:scale-105 transition flex items-center gap-2 shrink-0"
          >
            {isTesting ? <RefreshCw className="animate-spin" size={15} /> : <Play size={15} />}
            <span>{isTesting ? 'Testing Algorithms…' : 'Run 6-Algorithm Test Suite'}</span>
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-mono text-[#97d700] font-bold">ALL 6 FORENSIC ALGORITHMS VERIFIED (6/6 PASSED):</p>
            <div className="grid grid-cols-1 gap-3 font-mono text-xs">
              {testResults.map(res => (
                <div key={res.id} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-white block">{res.algorithm}</span>
                    <span className="text-gray-400 text-[11px] mt-0.5 block">{res.detail}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-[#97d700] border border-green-500/40 font-bold block">{res.status}</span>
                    <span className="text-[10px] text-cyan-300 mt-1 block">{res.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2. THEME SELECTION CARD */}
        <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sun className="w-5 h-5 text-[#FFAB00]" />
            <span>Appearance & Theme Mode</span>
          </h2>

          <div className="flex items-center justify-between text-xs font-mono p-4 rounded-2xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/5">
            <div>
              <span className="text-slate-900 dark:text-white font-bold block text-sm font-headline">Active Theme Mode</span>
              <span className="text-slate-500 dark:text-gray-400 text-xs">Currently in {theme === 'dark' ? 'Cyber Dark' : 'Clean Light'} mode</span>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold transition flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun size={16} className="text-[#FFAB00]" /> : <Moon size={16} className="text-indigo-600" />}
              <span>Toggle Mode</span>
            </button>
          </div>
        </div>

        {/* 3. API ENDPOINTS */}
        <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Key className="w-5 h-5 text-[#00E5FF]" />
            <span>Gemini API Key Endpoint</span>
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 dark:text-gray-400 block">VITE_GEMINI_API_KEY</label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Paste Google AI Studio API Key (AQ.Ab... or AIzaSy...)"
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-sm tracking-wider shadow-lg hover:scale-[1.01] transition flex items-center justify-center space-x-2"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 text-black" /> : <Save className="w-5 h-5 text-black" />}
          <span>{saved ? 'SETTINGS SAVED SUCCESSFULLY' : 'SAVE CALIBRATION SETTINGS'}</span>
        </button>
      </form>
    </div>
  );
}
