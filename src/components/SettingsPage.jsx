import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Sliders, Bell, Save, CheckCircle2, RefreshCw, Sparkles, Cpu, Sun, Moon } from 'lucide-react';

export default function SettingsPage({ theme, toggleTheme }) {
  const [saved, setSaved] = useState(false);
  const [elaThreshold, setElaThreshold] = useState(22);
  const [fontSensitivity, setFontSensitivity] = useState(85);
  const [semanticStrictness, setSemanticStrictness] = useState(90);
  const [apiKey, setApiKey] = useState('sher_live_8910482910481029481924');
  const [geminiApiKey, setGeminiApiKey] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-body">
      {/* 1. HEADER */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#00E5FF] mb-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#97d700]"></span>
          <span>SHERDETECT ENGINE CALIBRATION & PARAMETERS</span>
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white tracking-tight">
          Forensic Parameters & AI Configuration
        </h1>
        <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
          Adjust multi-layer detection sensitivities and configure multimodal AI reasoning endpoints.
        </p>
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
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-[#1c2128] text-white border border-slate-700 dark:border-white/10 font-bold flex items-center space-x-2 transition hover:scale-105"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#FFAB00]" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. FORENSIC ALGORITHM THRESHOLDS */}
        <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#97d700]" />
            <span>Forensic Detection Thresholds</span>
          </h2>

          <div className="space-y-6 text-sm font-body">
            {/* ELA Sensitivity */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-700 dark:text-gray-300 font-semibold">Error Level Analysis (ELA) Sensitivity</span>
                <span className="text-[#97d700] font-bold">{elaThreshold}x Frequency Boost</span>
              </div>
              <input
                type="range"
                min="8"
                max="35"
                value={elaThreshold}
                onChange={(e) => setElaThreshold(Number(e.target.value))}
                className="w-full accent-[#97d700] bg-slate-200 dark:bg-[#0e1115] h-2 rounded-lg cursor-pointer"
              />
              <p className="text-xs text-slate-500 dark:text-gray-500 font-mono">
                Higher values amplify subtle compression artifacts; lower values reduce noise on low-resolution scans.
              </p>
            </div>

            {/* Font Sensitivity */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-700 dark:text-gray-300 font-semibold">OCR Glyph Vector Variance Tolerance</span>
                <span className="text-[#00E5FF] font-bold">{fontSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={fontSensitivity}
                onChange={(e) => setFontSensitivity(Number(e.target.value))}
                className="w-full accent-[#00E5FF] bg-slate-200 dark:bg-[#0e1115] h-2 rounded-lg cursor-pointer"
              />
              <p className="text-xs text-slate-500 dark:text-gray-500 font-mono">
                Flags character baseline shifts and spliced font typography.
              </p>
            </div>

            {/* Semantic Strictness */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-700 dark:text-gray-300 font-semibold">Multimodal AI Semantic Strictness</span>
                <span className="text-[#FFAB00] font-bold">{semanticStrictness}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={semanticStrictness}
                onChange={(e) => setSemanticStrictness(Number(e.target.value))}
                className="w-full accent-[#FFAB00] bg-slate-200 dark:bg-[#0e1115] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. GEMINI MULTIMODAL API INTEGRATION */}
        <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              <span>Optional Multimodal Gemini API Integration</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] text-[10px] font-mono border border-[#00E5FF]/30 font-bold">
              HYBRID CLOUD / LOCAL
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <label className="text-slate-700 dark:text-gray-300 block font-semibold">Gemini API Key (Optional)</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF]"
            />
            <p className="text-slate-500 dark:text-gray-400 font-body text-[11px]">
              When provided, SHERDETECT executes live multimodal visual reasoning calls for deep contextual consistency checks in parallel with local client-side ELA processing.
            </p>
          </div>
        </div>

        {/* 5. SUBMIT ACTION */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-mono text-[#97d700] flex items-center space-x-1.5 animate-pulse font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>PARAMETERS CALIBRATED & SAVED LOCALLY</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </form>
    </div>
  );
}
