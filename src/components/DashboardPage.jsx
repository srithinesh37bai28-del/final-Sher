import React, { useState } from 'react';
import { mockTelemetryStats, mockRecentStream } from '../data/mockData';
import { 
  ShieldAlert, ShieldCheck, FileCheck, FileText, BadgeCheck, 
  ArrowUpRight, AlertTriangle, Filter, Search, UploadCloud, Play,
  Activity, Layers, Crosshair, Binary, Clock, CheckCircle2
} from 'lucide-react';

export default function DashboardPage({ setActiveTab, setSelectedReportId }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStream = mockRecentStream.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-body">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00E5FF] mb-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#97d700] animate-pulse"></span>
            <span>SHERDETECT GLOBAL FORENSIC TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white tracking-tight">
            Universal Forensic Dashboard
          </h1>
        </div>

        <button
          onClick={() => setActiveTab('verification')}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider shadow-lg shadow-[#97d700]/25 hover:scale-105 transition"
        >
          <UploadCloud className="w-4 h-4" />
          <span>VERIFY NEW DOCUMENT</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">TOTAL ANALYZED</span>
            <FileCheck className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white">
            {mockTelemetryStats.totalAnalyzed.toLocaleString()}
          </p>
          <p className="text-xs text-[#97d700] font-mono font-bold">+14.8% verification throughput</p>
        </div>

        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-red-200 dark:border-[#FF3B30]/30 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">FLAGGED FRAUD</span>
            <ShieldAlert className="w-4 h-4 text-[#FF3B30]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#FF3B30]">
            {mockTelemetryStats.fraudDetected}
          </p>
          <p className="text-xs text-[#FF3B30] font-mono font-bold">2.15% overall fraud rate</p>
        </div>

        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">SYSTEM ACCURACY</span>
            <ShieldCheck className="w-4 h-4 text-[#97d700]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#97d700]">
            {mockTelemetryStats.accuracyRate}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">Synthesized across 4 layers</p>
        </div>

        <div className="bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-xs font-mono">AVERAGE LATENCY</span>
            <span className="material-symbols-outlined text-[#00E5FF] text-lg">bolt</span>
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#00E5FF]">
            {mockTelemetryStats.avgProcessingTime}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">Real-time client GPU pipeline</p>
        </div>
      </div>

      {/* 3. TAMPERING METHOD DISTRIBUTION & RECENT VERIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: TAMPERING PATTERN DISTRIBUTION (5 COLS) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-[#97d700]" />
              <span>Tampering Method Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Distribution of detected forensic alteration categories.
            </p>
          </div>

          <div className="space-y-4">
            {mockTelemetryStats.tamperingMethodDistribution.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-700 dark:text-gray-300 font-semibold">{item.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.percentage}% ({item.count} cases)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#0d0f12] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1115] border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-gray-400 font-body space-y-2">
            <div className="flex items-center space-x-2 text-[#00E5FF] font-mono font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>FORENSIC OBSERVATION</span>
            </div>
            <p>
              Pixel Splicing & Error Level Analysis discrepancies constitute over 42% of all digital document tampering attempts.
            </p>
          </div>
        </div>

        {/* RIGHT: RECENT VERIFICATION STREAM (7 COLS) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#15191e] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#00E5FF]" />
                <span>Live Verification Stream</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Real-time forensic pipeline scan activity.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-100 dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] font-mono"
              />
            </div>
          </div>

          {/* Stream List */}
          <div className="space-y-3">
            {filteredStream.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50 dark:bg-[#0e1115] p-4 rounded-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    item.status === 'AUTHENTIC' ? 'bg-[#97d700]/20 text-[#97d700]' : 'bg-[#FF3B30]/20 text-[#FF3B30]'
                  }`}>
                    {item.status === 'AUTHENTIC' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-headline font-semibold text-xs text-slate-900 dark:text-white">{item.name}</p>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 dark:text-gray-400 mt-0.5">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                    item.status === 'AUTHENTIC' 
                      ? 'bg-[#97d700]/15 text-[#97d700] border border-[#97d700]/40'
                      : 'bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/40'
                  }`}>
                    {item.status} ({item.score}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
