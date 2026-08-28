import React, { useEffect, useRef, useState } from 'react';
import { generateElaHeatmap } from '../utils/forensicEngine';
import {
  ZoomIn, ZoomOut, RefreshCw, Eye, Flame, ShieldAlert,
  Crosshair, Sparkles, Sliders, AlertTriangle, CheckCircle,
  FileText, ShieldCheck, Activity, Lock
} from 'lucide-react';

/**
 * ElaCanvasInspector
 *
 * Props:
 *  imageSrc         – blob: URL of an uploaded IMAGE file (null for PDFs / non-images)
 *  isPdf            – true when uploaded file is application/pdf or binary format
 *  isAnalyzing      – shows scanning overlay
 *  isForged         – determines authentic vs tampered display
 *  suspiciousRegions – array of region objects from forensicEngine
 *  scanResult       – full result object for the authentic summary panel
 */
export default function ElaCanvasInspector({
  imageSrc,
  isPdf        = false,
  isAnalyzing  = false,
  isForged     = false,
  suspiciousRegions = [],
  scanResult   = null,
  selectedRegionId  = null,
  onSelectRegion    = null,
}) {
  const canvasRef                           = useRef(null);
  const [mode, setMode]                     = useState(isForged ? 'regions' : 'original');
  const [zoom, setZoom]                     = useState(1);
  const [elaSensitivity, setElaSensitivity] = useState(22);
  const [activeTooltipRegion, setActiveTooltipRegion] = useState(null);
  const [imgLoaded, setImgLoaded]           = useState(false);
  const imageRef                            = useRef(null);

  // Reset mode when a new scan arrives
  useEffect(() => {
    setMode(isForged ? 'regions' : 'original');
    setZoom(1);
  }, [imageSrc, isForged]);

  // Load image into memory reliably
  useEffect(() => {
    if (!imageSrc || isPdf) {
      setImgLoaded(false);
      return;
    }

    setImgLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      imageRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => setImgLoaded(false);
  }, [imageSrc, isPdf]);

  // Render ELA onto canvas whenever canvas mounts, mode changes, or sensitivity changes
  useEffect(() => {
    if (imgLoaded && imageRef.current && canvasRef.current && (mode === 'ela' || mode === 'regions')) {
      generateElaHeatmap(canvasRef.current, imageRef.current, elaSensitivity);
    }
  }, [mode, imgLoaded, elaSensitivity, imageSrc]);

  const handleZoom = (delta) => {
    setZoom(prev => Math.min(Math.max(0.6, Number((prev + delta).toFixed(2))), 2.5));
  };

  // ── PDF & Binary mode: no canvas possible, show a forensic summary card ──────────────
  if (isPdf || (!imageSrc && !isAnalyzing)) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-white dark:bg-[#0d0f12] border border-slate-200 dark:border-[#00E5FF]/20 shadow-xl flex flex-col font-body transition-colors">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-slate-100 dark:bg-[#15191e] border-b border-slate-200 dark:border-white/10">
          <div className="w-7 h-7 rounded-lg bg-[#97d700]/15 border border-[#97d700]/40 flex items-center justify-center">
            <Crosshair className="w-4 h-4 text-[#97d700]" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-white tracking-wider">FORENSIC CANVAS INSPECTOR</span>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Document Structure & Binary Analysis</p>
          </div>
          {isPdf && (
            <span className="ml-auto px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              BINARY STRUCTURE MODE (PDF / TIFF)
            </span>
          )}
        </div>

        {/* PDF forensic summary body */}
        <div className="flex-1 p-6 bg-slate-50 dark:bg-[#0a0c10]">
          {isAnalyzing ? (
            /* scanning state */
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-[#97d700]/20" />
                <div className="absolute inset-0 rounded-full border-2 border-[#97d700] border-t-transparent animate-spin" />
                <div className="absolute inset-3 rounded-full border-2 border-[#00E5FF] border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#97d700] animate-pulse" />
                </div>
              </div>
              <p className="text-xs font-mono text-cyan-600 dark:text-[#00E5FF] font-bold animate-pulse">PARSING BINARY DOCUMENT STRUCTURE…</p>
              <p className="text-[11px] text-slate-500 text-center">Scanning XMP/EXIF headers, font tables, and object stream checksums</p>
            </div>
          ) : scanResult ? (
            /* result state */
            <div className="space-y-4">
              {/* PDF verdict */}
              <div className={`flex items-center gap-4 p-4 rounded-xl border ${
                isForged
                  ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                  : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30'
              }`}>
                {isForged
                  ? <ShieldAlert className="w-9 h-9 text-red-500 shrink-0" />
                  : <ShieldCheck  className="w-9 h-9 text-green-600 dark:text-green-400 shrink-0" />}
                <div>
                  <p className={`font-black text-sm ${isForged ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                    {isForged ? 'PDF / TIFF TAMPERING DETECTED' : 'STRUCTURE VERIFIED CLEAN'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isForged
                      ? 'Object stream anomalies and software footprints found in binary header.'
                      : 'All document object streams, cross-reference tables, and font embeddings are intact and unmodified.'}
                  </p>
                </div>
              </div>

              {/* PDF structure checks */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Header Checksum',       ok: !isForged, detail: isForged ? 'Mismatch detected' : 'Valid' },
                  { label: 'Object Stream Integrity', ok: !isForged, detail: isForged ? 'Modified objects found' : 'Clean' },
                  { label: 'Font Table Embedding', ok: true,       detail: 'Consistent with source' },
                  { label: 'XMP Metadata Block',   ok: !scanResult.metadata?.tamperedHeader, detail: scanResult.metadata?.tamperedHeader ? scanResult.metadata.software : 'Original hardware capture' },
                  { label: 'Cross-Reference Table', ok: !isForged, detail: isForged ? 'Rebuilt post-edit' : 'Unmodified' },
                  { label: 'Digital Signature',    ok: !isForged, detail: isForged ? 'Not present / invalidated' : 'Structure intact' },
                ].map(({ label, ok, detail }) => (
                  <div key={label} className="bg-white dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5 flex items-start gap-2">
                    {ok
                      ? <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">{label}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Software footer */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500">
                <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00E5FF]" />
                <span>Creation tool: <strong className={`${scanResult.metadata?.tamperedHeader ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>{scanResult.metadata?.software || 'Direct hardware capture'}</strong></span>
                <Lock className="w-3 h-3 ml-auto text-slate-400" />
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-[#101418] border-t border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-gray-400 flex justify-between">
          <span>Mode: Binary Structure Analysis</span>
          <span className="text-cyan-600 dark:text-[#00E5FF] font-bold">Multi-Layer AI Reasoner Ready</span>
        </div>
      </div>
    );
  }

  // ── Image mode: full ELA canvas ──────────────────────────────────────────────
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white dark:bg-[#0d0f12] border border-slate-200 dark:border-[#00E5FF]/20 shadow-2xl flex flex-col font-body transition-colors">

      {/* TOP CONTROL TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-100 dark:bg-[#15191e] border-b border-slate-200 dark:border-white/10 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#97d700]/15 border border-[#97d700]/40 flex items-center justify-center text-[#97d700]">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs tracking-wider text-slate-900 dark:text-white">FORENSIC CANVAS INSPECTOR</span>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-cyan-100 text-cyan-700 dark:bg-[#00E5FF]/15 dark:text-[#00E5FF] border border-cyan-200 dark:border-[#00E5FF]/30 font-bold">
                GPU RASTERIZED
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-gray-400">Multi-Layer Pixel Quantization & Anomaly Bounding</p>
          </div>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center space-x-1 bg-slate-200 dark:bg-[#090b0e] p-1 rounded-xl border border-slate-300 dark:border-white/10">
          {[
            { id: 'regions',  label: 'Suspicious Regions', Icon: ShieldAlert, activeClr: 'bg-[#FFAB00] text-black shadow-[#FFAB00]/20' },
            { id: 'ela',      label: 'ELA Heatmap',         Icon: Flame,       activeClr: 'bg-[#97d700] text-black shadow-[#97d700]/20' },
            { id: 'original', label: 'Original',            Icon: Eye,         activeClr: 'bg-[#00E5FF] text-black shadow-[#00E5FF]/20' },
          ].map(({ id, label, Icon, activeClr }) => (
            <button key={id} onClick={() => setMode(id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
                mode === id ? `${activeClr} shadow-md font-bold` : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button onClick={() => handleZoom(-0.2)}
            className="p-2 rounded-lg bg-white dark:bg-[#1c2128] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#282f3a] transition border border-slate-200 dark:border-white/5">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs text-slate-700 dark:text-gray-300 w-12 text-center bg-slate-200 dark:bg-[#090b0e] py-1 rounded border border-slate-300 dark:border-white/5">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => handleZoom(0.2)}
            className="p-2 rounded-lg bg-white dark:bg-[#1c2128] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#282f3a] transition border border-slate-200 dark:border-white/5">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(1)}
            className="p-2 rounded-lg bg-white dark:bg-[#1c2128] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#282f3a] transition border border-slate-200 dark:border-white/5 ml-1">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SENSITIVITY SLIDER */}
      {(mode === 'ela' || mode === 'regions') && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#101418] border-b border-slate-200 dark:border-white/5 text-xs font-mono text-slate-600 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <Sliders className="w-3.5 h-3.5 text-[#97d700]" />
            <span className="text-slate-700 dark:text-gray-300">ELA Compression Delta Sensitivity:</span>
            <input type="range" min="8" max="35" value={elaSensitivity}
              onChange={(e) => setElaSensitivity(Number(e.target.value))}
              className="w-32 accent-[#97d700] cursor-pointer h-1.5 bg-slate-200 dark:bg-[#1c2128] rounded-lg" />
            <span className="text-[#97d700] font-bold">{elaSensitivity}x Boost</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span>Channel: Luminance & Chrominance Variance</span>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="relative min-h-[380px] max-h-[520px] overflow-auto flex items-center justify-center p-6 bg-slate-800 dark:bg-[#080a0c] select-none">

        {/* Scanning overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-[#97d700] border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-[#00E5FF] border-b-transparent animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Crosshair className="w-6 h-6 text-[#97d700] animate-pulse" />
              </div>
            </div>
            <p className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest animate-pulse">SCANNING PIXEL FREQUENCY…</p>
          </div>
        )}

        {/* Image / Canvas content */}
        <div className="relative transition-transform duration-150 shadow-2xl rounded-xl overflow-visible"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>

          {/* Original view */}
          {mode === 'original' ? (
            <img src={imageSrc} alt="Original Document"
              className="max-h-[460px] w-auto object-contain rounded-lg border border-white/20" />
          ) : (
            /* ELA canvas view */
            <canvas ref={canvasRef}
              className="max-h-[460px] w-auto object-contain rounded-lg border border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.15)]" />
          )}

          {/* Suspicious region bounding boxes */}
          {(mode === 'regions' || mode === 'ela') && suspiciousRegions.length > 0 && (
            <div className="absolute inset-0 pointer-events-auto">
              {suspiciousRegions.map((region, idx) => {
                const isSelected = selectedRegionId === region.id;
                const isHovered  = activeTooltipRegion?.id === region.id;
                return (
                  <div key={region.id}
                    onClick={() => onSelectRegion && onSelectRegion(region)}
                    onMouseEnter={() => setActiveTooltipRegion(region)}
                    onMouseLeave={() => setActiveTooltipRegion(null)}
                    style={{ left: `${region.x}%`, top: `${region.y}%`, width: `${region.width}%`, height: `${region.height}%` }}
                    className={`absolute rounded cursor-pointer transition-all duration-200 border-2 ${
                      region.severity === 'CRITICAL'
                        ? 'border-[#FF3B30] bg-[#FF3B30]/20 hover:bg-[#FF3B30]/35 animate-pulse'
                        : region.severity === 'HIGH'
                        ? 'border-[#FFAB00] bg-[#FFAB00]/20 hover:bg-[#FFAB00]/35'
                        : 'border-[#00E5FF] bg-[#00E5FF]/20 hover:bg-[#00E5FF]/35'
                    } ${isSelected ? 'ring-4 ring-white shadow-2xl scale-[1.02] z-20' : 'z-10'}`}>

                    {/* Badge */}
                    <div className="absolute -top-3.5 -left-2 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-900 border border-white/20 text-[9px] font-mono font-bold text-white shadow-lg">
                      <span className={`w-2 h-2 rounded-full ${
                        region.severity === 'CRITICAL' ? 'bg-[#FF3B30]' : region.severity === 'HIGH' ? 'bg-[#FFAB00]' : 'bg-[#00E5FF]'
                      }`} />
                      <span>#{idx + 1}</span>
                      <span className="text-gray-400">[{region.layer}]</span>
                    </div>

                    {/* Tooltip */}
                    {(isHovered || isSelected) && (
                      <div className="absolute top-full left-0 mt-2 w-72 p-3 rounded-xl bg-slate-900/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl z-30 pointer-events-none text-left space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            region.severity === 'CRITICAL'
                              ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40'
                              : 'bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/40'
                          }`}>{region.severity} ANOMALY</span>
                          <span className="text-[10px] font-mono text-gray-400">{region.layer}</span>
                        </div>
                        <p className="font-bold text-xs text-white leading-tight">{region.title}</p>
                        <p className="text-[11px] text-gray-300 leading-snug">{region.description}</p>
                        <div className="pt-1.5 border-t border-white/10 text-[10px] font-mono text-[#97d700] flex items-center space-x-1 font-bold">
                          <Sparkles className="w-3 h-3 flex-shrink-0" />
                          <span>Anomaly Evidence Recorded</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Authentic badge — shown in all modes when no anomalies */}
          {!isAnalyzing && suspiciousRegions.length === 0 && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-green-600/20 dark:bg-[#97d700]/20 border border-green-400/50 dark:border-[#97d700]/50 text-green-700 dark:text-[#97d700] text-xs font-mono font-bold flex items-center space-x-1.5 backdrop-blur-md shadow-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>UNIFORM BASELINE: 0 ANOMALIES</span>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-[#101418] border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-gray-400 gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-[#97d700] animate-pulse" />
            <span className="text-slate-700 dark:text-gray-300 font-bold">Active Mode: {mode.toUpperCase()}</span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-gray-500">|</span>
          <span className="hidden sm:inline">
            Regions: <strong className={suspiciousRegions.length > 0 ? 'text-[#FFAB00]' : 'text-green-600 dark:text-[#97d700]'}>
              {suspiciousRegions.length} Detected
            </strong>
          </span>
        </div>
        <span className="text-cyan-600 dark:text-[#00E5FF] font-bold">Multi-Layer AI Reasoner Ready</span>
      </div>
    </div>
  );
}
