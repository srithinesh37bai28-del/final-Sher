import React, { useState, useEffect } from 'react';
import { mockInvestigationCases } from '../data/mockData';
import { 
  ShieldAlert, FileText, CheckCircle2, UserCheck, Clock, Download, 
  Share2, MessageSquare, AlertOctagon, Send, FileJson, ArrowLeft,
  Crosshair, Layers, Printer, Sparkles, Database
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function FraudReportsPage({ setActiveTab }) {
  const [liveCases, setLiveCases]     = useState([]);
  const [selectedCase, setSelectedCase] = useState(mockInvestigationCases[0]);
  const [notes, setNotes] = useState([
    { author: "Lead Analyst (Sherlock Core)", time: "2026-08-28 14:35", text: "Confirmed pixel manipulation around numeric identifier field. EXIF software tag specifies Adobe Photoshop export." },
    { author: "SHERDETECT Sentinel Core", time: "2026-08-28 14:30", text: "Automated 7-stage pipeline alert generated. Risk index: 94%." }
  ]);
  const [newNote, setNewNote] = useState('');

  // Fetch real dossiers from Supabase
  useEffect(() => {
    async function fetchCloudCases() {
      try {
        const { data, error } = await supabase
          .from('verification_dossiers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          const mapped = data.map((d, i) => ({
            id: `CASE-2026-00${i + 1}`,
            documentName: d.file_name || 'Document.png',
            documentType: d.file_type || 'PNG',
            fileSize: d.file_size_bytes || '1.2 MB',
            analyzedAt: d.analyzed_at ? d.analyzed_at.slice(0, 16).replace('T', ' ') : '2026-08-28 10:14',
            riskLevel: d.risk_level || 'VERIFIED AUTHENTIC',
            riskScore: d.risk_score || 0,
            isForged: d.is_forged,
            summaryVerdict: d.summary_verdict || 'Passed all forensic layers.',
            software: d.detected_software || 'Direct Hardware Capture',
            explainabilityReasons: d.explainability_reasons || [],
            layerScores: {
              ela: d.ela_score || 0,
              metadata: d.metadata_score || 0,
              ocr: d.ocr_score || 0,
              ai: d.ai_score || 0
            }
          }));

          setLiveCases(mapped);
          setSelectedCase(mapped[0]);
        }
      } catch (err) {
        console.warn('Supabase cases fetch notice:', err.message);
      }
    }

    fetchCloudCases();
  }, []);

  const casesList = liveCases.length > 0 ? liveCases : mockInvestigationCases;

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
    downloadAnchor.setAttribute("download", `${selectedCase.id || 'CASE'}_Forensic_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-body">
      {/* 1. TOP HEADER & CASE TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono mb-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping"></span>
            <span><span className="text-[#97d700]">SHER</span><span className="text-[#00E5FF]">DETECT</span> FORENSIC CASEBOOK & DOSSIERS</span>
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
          {casesList.map((c) => (
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
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-0.5">{selectedCase.documentName}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">FORMAT & SIZE</span>
            <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{selectedCase.documentType} ({selectedCase.fileSize})</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">ANALYZED TIMESTAMP</span>
            <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{selectedCase.analyzedAt}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0e1115] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 block text-[10px]">SOFTWARE FOOTPRINT</span>
            <span className="font-bold text-[#00E5FF] truncate block mt-0.5">{selectedCase.software}</span>
          </div>
        </div>

        {/* Verdict Summary */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-gray-200 flex items-center gap-2">
            <AlertOctagon size={18} className={selectedCase.riskScore > 50 ? 'text-red-500' : 'text-[#97d700]'} />
            <span>{selectedCase.summaryVerdict}</span>
          </p>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white/10 text-white text-xs font-mono font-bold hover:bg-slate-800 dark:hover:bg-white/20 transition flex items-center gap-2 shrink-0"
          >
            <FileJson size={15} /> Export JSON Dossier
          </button>
        </div>
      </div>

      {/* 3. INVESTIGATOR NOTES & EVIDENCE FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-[#15191e] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <h2 className="text-xl font-headline font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#00E5FF]" /> Analyst Audit Trail & Field Notes
          </h2>

          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add investigator field observation, evidence note, or verification remark…"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF] resize-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider shadow-md hover:bg-cyan-400 transition flex items-center gap-2 ml-auto"
            >
              <Send size={14} /> Post Note
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {notes.map((n, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">{n.author}</span>
                  <span className="text-slate-400 text-[10px]">{n.time}</span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FORENSIC PILLARS SCORES SIDEBAR */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-[#15191e] p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <h3 className="text-base font-headline font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#97d700]" /> 4-Pillar Score Summary
            </h3>

            <div className="space-y-3 text-xs font-mono">
              {[
                { name: 'Visual & ELA Layer', score: selectedCase.layerScores?.ela || 0, color: 'text-[#97d700]' },
                { name: 'Metadata & EXIF Stream', score: selectedCase.layerScores?.metadata || 0, color: 'text-[#00E5FF]' },
                { name: 'OCR Typography Vector', score: selectedCase.layerScores?.ocr || 0, color: 'text-[#FFAB00]' },
                { name: 'AI Semantic Parity', score: selectedCase.layerScores?.ai || 0, color: 'text-purple-400' },
              ].map(p => (
                <div key={p.name} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-300">{p.name}</span>
                  <span className={`font-black ${p.score >= 50 ? 'text-red-500' : p.color}`}>{p.score}% Risk</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
