import React, { useState } from 'react';
import { mockInvestigationCases } from '../data/mockData';
import { 
  ShieldAlert, FileText, CheckCircle2, UserCheck, Clock, Download, 
  Share2, MessageSquare, AlertOctagon, Send, FileJson, ArrowLeft,
  Crosshair, Layers, Printer, Sparkles
} from 'lucide-react';

export default function FraudReportsPage({ setActiveTab }) {
  const [selectedCase, setSelectedCase] = useState(mockInvestigationCases[0]);
  const [notes, setNotes] = useState([
    { author: "Alex Chen (Lead Investigator)", time: "2026-08-28 14:35", text: "Confirmed pixel manipulation around the numeric identifier and birthdate field. EXIF software tag specifies Adobe Photoshop export." },
    { author: "SHERDETECT Sentinel Core", time: "2026-08-28 14:30", text: "Automated 7-stage pipeline alert generated. Risk index: 94%." }
  ]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes(prev => [
      { author: "Forensic Analyst (You)", time: new Date().toISOString().slice(0, 16).replace('T', ' '), text: newNote.trim() },
      ...prev
    ]);
    setNewNote('');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${selectedCase.id}_Forensic_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-body">
      {/* 1. TOP HEADER & CASE TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3B30] mb-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping"></span>
            <span>SHERDETECT FORENSIC CASEBOOK & DOSSIERS</span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <span>Case Investigation Record</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              selectedCase.riskScore > 50 
                ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40'
                : 'bg-[#97d700]/20 text-[#97d700] border border-[#97d700]/40'
            }`}>
              {selectedCase.riskLevel}
            </span>
          </h1>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center space-x-2 bg-white dark:bg-[#15191e] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto">
          {mockInvestigationCases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedCase.id === c.id
                  ? 'bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-bold shadow-lg shadow-[#97d700]/25'
                  : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CASE SUMMARY BANNER */}
      <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">DOCUMENT NAME</span>
            <span className="text-slate-900 dark:text-white font-bold font-body text-sm mt-0.5 block truncate">{selectedCase.documentName}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">CASE NUMBER & TYPE</span>
            <span className="text-[#00E5FF] font-bold text-sm mt-0.5 block">{selectedCase.caseNumber} ({selectedCase.documentType})</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">ASSIGNED ANALYST</span>
            <span className="text-[#97d700] font-bold text-sm mt-0.5 block">{selectedCase.analyst}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">DETECTED TIMESTAMP</span>
            <span className="text-slate-700 dark:text-gray-300 text-sm mt-0.5 block">{selectedCase.detectedAt}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-700 dark:text-gray-300 font-body max-w-4xl leading-relaxed">
            <strong className="text-[#FFAB00] font-mono">INVESTIGATOR SUMMARY: </strong>
            {selectedCase.summary}
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-slate-900 dark:bg-[#1c2128] hover:bg-slate-800 dark:hover:bg-[#282f3a] text-white border border-slate-700 dark:border-white/10 rounded-xl text-xs font-mono flex items-center space-x-2 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Export Case Dossier</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-100 dark:bg-[#1c2128] hover:bg-slate-200 dark:hover:bg-[#282f3a] text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-mono transition"
              title="Print Case"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MULTI-LAYER RISK TELEMETRY & DETECTED ANOMALIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: DETECTED ANOMALIES LIST (7 COLS) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-[#FF3B30]" />
            <span>Forensic Anomaly Evidence Registry</span>
          </h2>

          {selectedCase.anomalies.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-[#0e1115] rounded-2xl border border-[#97d700]/40 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#97d700] mx-auto" />
              <p className="font-headline font-bold text-slate-900 dark:text-white text-sm">No Anomalies Detected</p>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-body">
                This document passed all Error Level Analysis, typography vector, and metadata checksum tests.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedCase.anomalies.map((anom) => (
                <div key={anom.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        anom.severity === 'CRITICAL' ? 'bg-[#FF3B30]' : 'bg-[#FFAB00]'
                      }`}></span>
                      <span>{anom.type}</span>
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      anom.severity === 'CRITICAL' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-[#FFAB00]/20 text-[#FFAB00]'
                    }`}>
                      {anom.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-300 font-body leading-relaxed">
                    {anom.detail}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* AUDIT TRAIL */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              <span>Chain of Custody & Audit Trail</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {selectedCase.auditTrail.map((trail, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
                    <span>{trail.action}</span>
                  </div>
                  <div className="text-slate-500 dark:text-gray-500 text-[11px] space-x-2">
                    <span>{trail.user}</span>
                    <span>•</span>
                    <span>{trail.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: LAYER SCORES & ANALYST LOG (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 4-Layer Scores */}
          <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#97d700]" />
              <span>Layer Risk Indices</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Visual (ELA)", score: selectedCase.layerScores.visualEla },
                { title: "EXIF Metadata", score: selectedCase.layerScores.metadata },
                { title: "OCR Structure", score: selectedCase.layerScores.ocrStructure },
                { title: "AI Semantic", score: selectedCase.layerScores.semanticAi },
              ].map((layer, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block">{layer.title}</span>
                  <span className={`text-xl font-headline font-bold ${
                    layer.score > 50 ? 'text-[#FF3B30]' : 'text-[#97d700]'
                  }`}>
                    {layer.score}%
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-[#1c2128] h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full ${layer.score > 50 ? 'bg-[#FF3B30]' : 'bg-[#97d700]'}`}
                      style={{ width: `${layer.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Analyst Notes */}
          <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#00E5FF]" />
              <span>Investigator Case Notes</span>
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={2}
                placeholder="Add forensic notes or observations..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] font-body"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 dark:bg-[#1c2128] hover:bg-slate-800 dark:hover:bg-[#282f3a] text-white border border-slate-700 dark:border-white/10 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-[#97d700]" />
                <span>Append Note to Case File</span>
              </button>
            </form>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {notes.map((n, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0e1115] p-3 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400">
                    <span className="text-[#97d700] font-bold">{n.author}</span>
                    <span>{n.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-gray-300 font-body leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
