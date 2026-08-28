import React, { useState, useEffect } from 'react';
import { mockTelemetryStats, mockRecentStream } from '../data/mockData';
import { 
  ShieldAlert, ShieldCheck, FileCheck, FileText, BadgeCheck, 
  ArrowUpRight, AlertTriangle, Filter, Search, UploadCloud, Play,
  Activity, Layers, Crosshair, Binary, Clock, CheckCircle2, RefreshCw, Database
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function DashboardPage({ setActiveTab, setSelectedReportId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveScans, setLiveScans]   = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [stats, setStats]           = useState({
    total: mockTelemetryStats.totalAnalyzed,
    fraud: mockTelemetryStats.fraudDetected,
    cleanRate: '97.85%',
    avgRisk: '4.2%'
  });

  // Fetch real telemetry & dossiers from Supabase
  useEffect(() => {
    async function fetchSupabaseTelemetry() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('verification_dossiers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && data && data.length > 0) {
          setLiveScans(data);

          const total = data.length;
          const fraud = data.filter(d => d.is_forged).length;
          const cleanRate = total > 0 ? (( (total - fraud) / total) * 100).toFixed(1) + '%' : '98.5%';
          const avgRisk = total > 0 ? (data.reduce((acc, curr) => acc + (curr.risk_score || 0), 0) / total).toFixed(1) + '%' : '4.2%';

          setStats({ total, fraud, cleanRate, avgRisk });
        }
      } catch (err) {
        console.warn('Supabase dashboard fetch notice:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSupabaseTelemetry();
  }, []);

  const displayStream = liveScans.length > 0 ? liveScans : mockRecentStream;

  const filteredStream = displayStream.filter(item => {
    const name = item.file_name || item.name || '';
    const type = item.file_type || item.type || '';
    const status = item.risk_level || item.status || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-body">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono mb-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#97d700] animate-pulse"></span>
            <span><span className="text-[#97d700]">SHER</span><span className="text-[#00E5FF]">DETECT</span> GLOBAL FORENSIC TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white tracking-tight">
            Universal Forensic Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('verification')}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider shadow-lg shadow-[#97d700]/25 hover:scale-105 transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>VERIFY NEW DOCUMENT</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">TOTAL ANALYZED</span>
            <FileCheck className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white">
            {stats.total.toLocaleString()}
          </p>
          <p className="text-xs text-[#97d700] font-mono font-bold">Live Supabase Cloud Telemetry</p>
        </div>

        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-red-200 dark:border-[#FF3B30]/30 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">FLAGGED FRAUD</span>
            <ShieldAlert className="w-4 h-4 text-[#FF3B30]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#FF3B30]">
            {stats.fraud}
          </p>
          <p className="text-xs text-[#FF3B30] font-mono font-bold">Critical risk alerts</p>
        </div>

        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">CLEAN PASS RATE</span>
            <ShieldCheck className="w-4 h-4 text-[#97d700]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#97d700]">
            {stats.cleanRate}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">Verified authentic</p>
        </div>

        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">AVERAGE RISK INDEX</span>
            <Activity className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white">
            {stats.avgRisk}
          </p>
          <p className="text-xs text-[#00E5FF] font-mono font-bold">Synthesized across 4 layers</p>
        </div>
      </div>

      {/* 3. RECENT FORENSIC STREAM */}
      <div className="bg-white dark:bg-[#15191e] rounded-3xl border border-slate-200 dark:border-white/5 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-headline font-extrabold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00E5FF]" /> Live Verification Stream
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">Real-time audit log of incoming document verification dossiers</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search file, type or risk status…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF] w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Document File</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Software Signature</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-body">
              {filteredStream.map((item, idx) => {
                const fileName = item.file_name || item.name || 'Document.png';
                const fileType = item.file_type || item.type || 'PNG';
                const riskLevel = item.risk_level || item.status || 'VERIFIED AUTHENTIC';
                const riskScore = item.risk_score !== undefined ? item.risk_score : (item.score || 0);
                const software = item.detected_software || item.software || 'Direct Hardware Capture';
                const isForged = item.is_forged || riskScore >= 50;

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate max-w-xs">{fileName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-gray-400">{fileType}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        isForged
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : 'bg-green-500/15 text-green-700 dark:text-[#97d700] border border-green-500/30'
                      }`}>
                        {riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={isForged ? 'text-red-500' : 'text-[#97d700]'}>{riskScore}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-gray-400 font-mono text-[11px] truncate max-w-[180px]">
                      {software}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReportId(item.id || idx);
                          setActiveTab('fraud-reports');
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/20 transition text-[11px] font-mono font-semibold"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
