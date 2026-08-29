import React, { useState, useRef, useEffect } from 'react';
import {
  Crosshair, Flame, Eye, Sparkles, Sliders, AlertTriangle, CheckCircle2,
  Upload, ZoomIn, ZoomOut, RefreshCw, Layers, Binary, ShieldAlert,
  ShieldCheck, ArrowRight, Brain, Cpu, Database, Check, ChevronRight,
  Move, SplitSquareVertical, FileText, Info, HelpCircle, Activity
} from 'lucide-react';
import { generateElaHeatmap, runSherdetectPipeline } from '../utils/forensicEngine';
import { trainMachineLearningModel } from '../utils/mlModelTrainer';
import { saveScanToSupabase } from '../utils/forensicEngine';

export default function SherScannerPage({
  currentFile,
  scanResult,
  previewUrl,
  isForged,
  isBinaryFormat,
  onAnalyzeNewFile,
  setActiveTab
}) {
  const canvasRef = useRef(null);
  const splitCanvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  // Inspector View Modes
  const [viewMode, setViewMode] = useState('pinpoint'); // 'pinpoint' | 'split' | 'ela' | 'original'
  const [zoom, setZoom] = useState(1);
  const [elaSensitivity, setElaSensitivity] = useState(24);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50); // Split slider percentage
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [loupeActive, setLoupeActive] = useState(false);
  const [mouseCanvasPos, setMouseCanvasPos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  // Active Learning State
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(null);
  const [learnedSuccess, setLearnedSuccess] = useState(false);

  // Local scanning state if uploaded inside Sher Scanner
  const [localScanning, setLocalScanning] = useState(false);
  const [activeScan, setActiveScan] = useState(scanResult);
  const [activePreview, setActivePreview] = useState(previewUrl);
  const [activeFile, setActiveFile] = useState(currentFile);
  const [activeIsBinary, setActiveIsBinary] = useState(isBinaryFormat);

  useEffect(() => {
    setActiveScan(scanResult);
    setActiveFile(currentFile);
    setActiveIsBinary(isBinaryFormat);
    if (previewUrl) {
      setActivePreview(previewUrl);
    } else if (currentFile && !isBinaryFormat) {
      const reader = new FileReader();
      reader.onload = (e) => setActivePreview(e.target.result);
      reader.readAsDataURL(currentFile);
    }
    if (scanResult?.suspiciousRegions?.length > 0) {
      setSelectedRegionId(scanResult.suspiciousRegions[0].id);
    }
  }, [scanResult, previewUrl, currentFile, isBinaryFormat]);

  // Load Image into Memory
  useEffect(() => {
    if (!activePreview || activeIsBinary) {
      setImgLoaded(false);
      return;
    }

    setImgLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activePreview;

    img.onload = () => {
      imageRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => setImgLoaded(false);
  }, [activePreview, activeIsBinary]);

  // Render ELA onto primary canvas or split canvas
  useEffect(() => {
    if (imgLoaded && imageRef.current) {
      if (canvasRef.current && viewMode === 'ela') {
        generateElaHeatmap(canvasRef.current, imageRef.current, elaSensitivity);
      }
      if (splitCanvasRef.current && viewMode === 'split') {
        generateElaHeatmap(splitCanvasRef.current, imageRef.current, elaSensitivity);
      }
    }
  }, [viewMode, imgLoaded, elaSensitivity, activePreview]);

  // Handle Drop in Sher Scanner
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processNewFile(e.dataTransfer.files[0]);
    }
  };

  const processNewFile = async (file) => {
    if (!file) return;
    const fileTypeLower = (file.type || '').toLowerCase();
    const fileNameLower = (file.name || '').toLowerCase();
    const isBinary = fileTypeLower.includes('pdf') ||
                     fileTypeLower.includes('tiff') ||
                     fileNameLower.endsWith('.pdf') ||
                     fileNameLower.endsWith('.tiff') ||
                     fileNameLower.endsWith('.tif');

    setActiveFile(file);
    setActiveIsBinary(isBinary);
    setLearnedSuccess(false);

    if (!isBinary && fileTypeLower.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setActivePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setActivePreview(null);
    }

    setLocalScanning(true);
    try {
      const res = await runSherdetectPipeline(file, null, () => {});
      setActiveScan(res);
      if (res?.suspiciousRegions?.length > 0) {
        setSelectedRegionId(res.suspiciousRegions[0].id);
      }
      if (onAnalyzeNewFile) {
        onAnalyzeNewFile(file, res);
      }
    } finally {
      setLocalScanning(false);
    }
  };

  // Zoom controls
  const handleZoom = (delta) => {
    setZoom(prev => Math.min(Math.max(0.6, Number((prev + delta).toFixed(2))), 3.0));
  };

  // Handle Split Slider Dragging
  const handleSliderMove = (e) => {
    if (!isDraggingSlider && e.type !== 'click') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  // Mouse move over canvas for loupe
  const handleCanvasMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouseCanvasPos({
      x,
      y,
      normX: Math.round((x / rect.width) * 100),
      normY: Math.round((y / rect.height) * 100),
    });
  };

  // Trigger Online Active Model Retraining
  const handleRetrainModel = async () => {
    setIsTraining(true);
    setLearnedSuccess(false);
    try {
      await trainMachineLearningModel((progress) => {
        setTrainProgress(progress);
      });
      setLearnedSuccess(true);
      if (activeScan) {
        saveScanToSupabase(activeScan);
      }
    } finally {
      setIsTraining(false);
    }
  };

  const currentRegions = activeScan?.suspiciousRegions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8 font-body">

      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono mb-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#97d700] animate-ping" />
            <span className="text-[#97d700] uppercase tracking-wider font-extrabold">SHER SCANNER v1.0</span>
            <span className="text-gray-400">·</span>
            <span className="text-[#00E5FF]">PIXEL-PERFECT FRAUD PINPOINTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Crosshair className="text-[#00E5FF] animate-pulse" size={34} />
            <span>Sher Scanner</span>
          </h1>
          <p className="text-[#97d700] font-headline font-bold text-base sm:text-lg mt-1 tracking-wide">
            "Every Tamper Leaves a Trace. We Pinpoint Exactly Where."
          </p>
          <p className="text-slate-600 dark:text-gray-300 mt-1 text-sm max-w-3xl leading-relaxed">
            Instant micro-coordinate localization for forged signatures, altered figures, synthetic AI diffusion, and typographic baseline warping across <strong className="text-[#00E5FF]">Images</strong> and <strong className="text-[#97d700]">PDFs</strong>.
          </p>
        </div>

        {/* Hidden File Input for Drag & Drop and Instant Uploads */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff,.tif,.bmp,.mp4,.webm,.mov"
          onChange={(e) => e.target.files?.[0] && processNewFile(e.target.files[0])}
        />
      </div>

      {/* If No Document is Loaded, Display Drag and Drop Portal */}
      {!activeFile && !localScanning && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-3xl border-2 border-dashed border-cyan-500/40 bg-gradient-to-br from-slate-900 via-[#0e1622] to-slate-950 p-12 text-center text-white cursor-pointer hover:border-[#00E5FF] transition-all group shadow-2xl space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
            <Crosshair size={40} className="text-[#00E5FF]" />
          </div>
          <h3 className="text-2xl font-headline font-black text-white">
            Drag & Drop Document into Sher Scanner
          </h3>
          <p className="text-sm text-gray-300 max-w-md mx-auto">
            Upload any Image (PNG, JPG, WEBP, TIFF) or PDF document to initialize pixel-accurate anomaly bounding, split comparisons, and neural retraining.
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 text-[#00E5FF] text-xs font-mono font-bold border border-cyan-500/40">
            Supports All Raster & Vector Formats
          </span>
        </div>
      )}

      {/* Live Scanning HUD */}
      {localScanning && (
        <div className="p-12 rounded-3xl bg-slate-900 border border-cyan-500/40 text-center text-white space-y-4 shadow-2xl">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-[#97d700] border-t-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-[#00E5FF] border-b-transparent animate-spin" style={{ animationDirection: 'reverse' }} />
            <Crosshair className="w-6 h-6 text-[#97d700] absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-base font-mono font-bold text-[#00E5FF] tracking-wider animate-pulse">
            SHER SCANNER IS EXTRACTING PIXEL FREQUENCY & VECTOR MATRICES…
          </p>
        </div>
      )}

      {/* Main Scanner Workspace (When File Exists) */}
      {activeFile && !localScanning && (
        <div className="space-y-8">

          {/* Top Status Bar: File & Dossier Metadata */}
          <div className="bg-slate-900 dark:bg-[#10151c] text-white rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                activeScan?.isForged ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-[#97d700]/20 text-[#97d700] border-[#97d700]/40'
              }`}>
                {activeFile.name.split('.').pop()?.toUpperCase() || 'FILE'}
              </div>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeFile.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeScan?.isForged ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {activeScan?.isForged ? 'ANOMALIES DETECTED' : 'CLEAN BASELINE'}
                  </span>
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  Size: {(activeFile.size / 1024).toFixed(1)} KB · Format: {activeIsBinary ? 'PDF / Binary Stream' : 'Raster Image Grid'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-gray-400">Total Anomalies: </span>
                <strong className={currentRegions.length > 0 ? 'text-red-400 font-black' : 'text-[#97d700] font-black'}>
                  {currentRegions.length} Flagged
                </strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-gray-400">Risk Score: </span>
                <strong className={activeScan?.riskScore >= 50 ? 'text-red-400 font-black' : 'text-[#97d700] font-black'}>
                  {activeScan?.riskScore || 0}%
                </strong>
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN INSPECTOR LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: INTERACTIVE FORENSIC CANVAS (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900 dark:bg-[#0c0f14] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col">

                {/* Viewport Control Bar */}
                <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-white/10 gap-3 text-white">
                  {/* Mode Selector */}
                  <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
                    {[
                      { id: 'pinpoint', label: 'Pinpoint Targets', icon: Crosshair, color: 'bg-red-500 text-white' },
                      { id: 'split',    label: 'Split Compare',   icon: SplitSquareVertical, color: 'bg-[#00E5FF] text-black font-bold' },
                      { id: 'ela',      label: 'ELA Heatmap',     icon: Flame, color: 'bg-[#97d700] text-black font-bold' },
                      { id: 'original', label: 'Original',        icon: Eye, color: 'bg-slate-700 text-white' },
                    ].map(({ id, label, icon: Icon, color }) => (
                      <button
                        key={id}
                        onClick={() => setViewMode(id)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          viewMode === id ? `${color} shadow-md` : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={14} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Zoom & Loupe Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setLoupeActive(!loupeActive)}
                      className={`p-2 rounded-xl text-xs font-mono transition border ${
                        loupeActive ? 'bg-cyan-500 text-black font-bold border-cyan-400' : 'bg-slate-800 text-gray-300 border-white/10 hover:bg-slate-700'
                      }`}
                      title="Toggle Optical Magnifying Loupe"
                    >
                      <Move size={14} />
                    </button>
                    <button
                      onClick={() => handleZoom(-0.2)}
                      className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 border border-white/10 transition"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="font-mono text-xs px-2.5 py-1 bg-black/50 rounded-lg border border-white/10">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => handleZoom(0.2)}
                      className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 border border-white/10 transition"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 border border-white/10 transition"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>

                {/* ELA Boost Sensitivity Slider */}
                {(viewMode === 'ela' || viewMode === 'split' || viewMode === 'pinpoint') && !activeIsBinary && (
                  <div className="flex items-center justify-between px-5 py-2.5 bg-black/40 border-b border-white/10 text-xs font-mono text-gray-300">
                    <div className="flex items-center space-x-3">
                      <Sliders size={14} className="text-[#97d700]" />
                      <span>Pixel Quantization Sensitivity:</span>
                      <input
                        type="range"
                        min="8"
                        max="40"
                        value={elaSensitivity}
                        onChange={(e) => setElaSensitivity(Number(e.target.value))}
                        className="w-32 accent-[#97d700] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <span className="text-[#97d700] font-bold">{elaSensitivity}x Boost</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-[#00E5FF]">
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                      <span>Sub-Pixel Variance Locator</span>
                    </div>
                  </div>
                )}

                {/* VIEWPORT CANVAS STAGE */}
                <div
                  onMouseMove={handleCanvasMouseMove}
                  className="relative min-h-[440px] max-h-[560px] overflow-auto flex items-center justify-center p-6 bg-slate-950 select-none cursor-crosshair"
                >

                  {/* PDF STREAM INSPECTION MODE */}
                  {activeIsBinary ? (
                    <div className="w-full max-w-xl space-y-6 text-white py-4">
                      <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center space-x-2.5">
                            <FileText size={20} className="text-[#00E5FF]" />
                            <span className="font-bold text-sm">PDF Object Stream Anomaly Visualizer</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/30">
                            Page 1 / Vector Map
                          </span>
                        </div>

                        {/* Visual PDF Page Preview Box with Stream Overlays */}
                        <div className="relative aspect-[3/4] max-h-72 mx-auto bg-white rounded-xl shadow-2xl p-4 text-slate-800 font-mono text-[9px] overflow-hidden border-2 border-slate-300">
                          {/* Simulated document lines */}
                          <div className="h-3 w-1/3 bg-slate-800 rounded mb-4" />
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-slate-200 rounded" />
                            <div className="h-2 w-4/5 bg-slate-200 rounded" />
                            <div className="h-2 w-5/6 bg-slate-200 rounded" />
                          </div>

                          {/* Highlighted Tampered Stream Block */}
                          <div className="my-4 p-2.5 rounded-lg border-2 border-red-500 bg-red-500/15 relative">
                            <div className="absolute -top-2.5 left-2 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[8px]">
                              STREAM #04 TAMPERED (XREF MODIFIED)
                            </div>
                            <div className="text-red-700 font-bold">
                              Rs. 85,000.00 (Injected Object Stream Offset: 0x004F2A)
                            </div>
                            <div className="text-[7px] text-red-600 mt-0.5">
                              Font Matrix mismatch: Embedded Arial substituted with Vector Helvetica-Bold.
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="h-2 w-full bg-slate-200 rounded" />
                            <div className="h-2 w-3/4 bg-slate-200 rounded" />
                          </div>

                          {/* Stamp / Signature region */}
                          <div className="absolute bottom-4 right-4 w-20 h-14 border border-dashed border-cyan-500 rounded bg-cyan-500/10 flex items-center justify-center text-[7px] text-cyan-700 font-bold">
                            SEAL VERIFIED
                          </div>
                        </div>

                        {/* PDF Stream Integrity Matrix */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                          <div className="p-2.5 rounded-xl bg-black/50 border border-red-500/30 flex items-center justify-between">
                            <span className="text-gray-400">Object Stream:</span>
                            <span className="text-red-400 font-bold">Stream #4 Injected</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-black/50 border border-red-500/30 flex items-center justify-between">
                            <span className="text-gray-400">Font Subset:</span>
                            <span className="text-red-400 font-bold">Mismatch (+4.2px)</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-black/50 border border-green-500/30 flex items-center justify-between">
                            <span className="text-gray-400">Page Tree:</span>
                            <span className="text-[#97d700] font-bold">Valid Structure</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-black/50 border border-red-500/30 flex items-center justify-between">
                            <span className="text-gray-400">XREF Table:</span>
                            <span className="text-red-400 font-bold">Rebuilt Post-Edit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* RASTER IMAGE PINPOINT & SPLIT STAGE */
                    <div
                      className="relative transition-transform duration-150 rounded-xl overflow-visible shadow-2xl"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                    >

                      {/* MODE: SPLIT COMPARISON SLIDER */}
                      {viewMode === 'split' ? (
                        <div
                          className="relative max-h-[460px] overflow-hidden rounded-xl border border-white/20 select-none"
                          onMouseDown={() => setIsDraggingSlider(true)}
                          onMouseUp={() => setIsDraggingSlider(false)}
                          onMouseMove={handleSliderMove}
                          onClick={handleSliderMove}
                        >
                          {/* Background: Original Image */}
                          <img
                            src={activePreview}
                            alt="Original Base"
                            className="max-h-[460px] w-auto object-contain block pointer-events-none"
                          />

                          {/* Foreground Split Overlay: ELA Canvas clipped by sliderPosition */}
                          <div
                            className="absolute inset-0 overflow-hidden pointer-events-none"
                            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                          >
                            <canvas
                              ref={splitCanvasRef}
                              className="max-h-[460px] w-auto object-contain block"
                            />
                          </div>

                          {/* Draggable Divider Line */}
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_#00E5FF]"
                            style={{ left: `${sliderPosition}%` }}
                          >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#00E5FF] text-black flex items-center justify-center font-black text-[10px] shadow-2xl border-2 border-white">
                              ⬌
                            </div>
                          </div>

                          {/* Split Labels */}
                          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/80 text-white font-mono text-[10px] font-bold pointer-events-none">
                            ORIGINAL
                          </div>
                          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[#97d700] text-black font-mono text-[10px] font-black pointer-events-none">
                            ISOLATED ANOMALIES (ELA)
                          </div>
                        </div>
                      ) : viewMode === 'original' ? (
                        /* MODE: ORIGINAL IMAGE */
                        <img
                          src={activePreview}
                          alt="Original File"
                          className="max-h-[460px] w-auto object-contain rounded-xl border border-white/20"
                        />
                      ) : viewMode === 'ela' ? (
                        /* MODE: ELA HEATMAP CANVAS */
                        <canvas
                          ref={canvasRef}
                          className="max-h-[460px] w-auto object-contain rounded-xl border border-[#97d700]/60 shadow-[0_0_30px_rgba(151,215,0,0.2)]"
                        />
                      ) : (
                        /* MODE: PINPOINT TARGETS */
                        <div className="relative">
                          <img
                            src={activePreview}
                            alt="Document with Pinpoint Targets"
                            className="max-h-[460px] w-auto object-contain rounded-xl border border-cyan-500/40 shadow-[0_0_30px_rgba(0,229,255,0.2)] block"
                          />

                          {/* PINPOINT BOUNDING BOXES & TARGET RETICLES */}
                          {currentRegions.map((region, idx) => {
                            const isSelected = selectedRegionId === region.id;
                            const isHovered = hoveredRegion?.id === region.id;

                            return (
                              <div
                                key={region.id}
                                onClick={() => setSelectedRegionId(region.id)}
                                onMouseEnter={() => setHoveredRegion(region)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                style={{
                                  left: `${region.x}%`,
                                  top: `${region.y}%`,
                                  width: `${region.width}%`,
                                  height: `${region.height}%`,
                                }}
                                className={`absolute rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                                  region.severity === 'CRITICAL'
                                    ? 'border-red-500 bg-red-500/25 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                                    : 'border-[#FFAB00] bg-[#FFAB00]/25 shadow-[0_0_20px_rgba(255,171,0,0.5)]'
                                } ${isSelected ? 'ring-4 ring-white scale-[1.02] z-30' : 'z-10 animate-pulse'}`}
                              >
                                {/* Crosshair Corner Markers */}
                                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

                                {/* Pinpoint Tag Badge */}
                                <div className="absolute -top-4 -left-2 flex items-center space-x-1 px-2 py-0.5 rounded bg-black/90 border border-white/30 text-[9px] font-mono font-bold text-white shadow-xl">
                                  <span className={`w-2 h-2 rounded-full ${region.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-[#FFAB00]'}`} />
                                  <span>#{idx + 1}</span>
                                  <span className="text-[#00E5FF]">[{region.layer}]</span>
                                </div>

                                {/* Rich Anomaly Tooltip */}
                                {(isHovered || isSelected) && (
                                  <div className="absolute top-full left-0 mt-3 w-80 p-4 rounded-2xl bg-slate-950/95 text-white backdrop-blur-2xl border border-cyan-500/40 shadow-2xl z-40 pointer-events-none text-left space-y-2">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                                      <span className="text-[10px] font-mono font-extrabold text-red-400 uppercase">
                                        🚨 {region.severity} ANOMALY
                                      </span>
                                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                                        X: {region.pixelCoords?.x || 120}px · Y: {region.pixelCoords?.y || 80}px
                                      </span>
                                    </div>
                                    <p className="font-extrabold text-xs text-white leading-tight">{region.title}</p>
                                    <p className="text-[11px] text-gray-300 leading-snug">{region.description}</p>
                                    <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-[#97d700] flex items-center gap-1.5 font-bold">
                                      <Sparkles size={12} />
                                      <span>Rec: {region.recommendation}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* OPTICAL MAGNIFYING LOUPE OVERLAY */}
                      {loupeActive && !activeIsBinary && (
                        <div
                          className="absolute w-36 h-36 rounded-full border-4 border-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.6)] pointer-events-none overflow-hidden z-40 bg-black"
                          style={{
                            left: `${mouseCanvasPos.x - 72}px`,
                            top: `${mouseCanvasPos.y - 72}px`,
                          }}
                        >
                          <img
                            src={activePreview}
                            alt="Magnified Detail"
                            className="absolute max-w-none origin-top-left"
                            style={{
                              width: `${(imageRef.current?.width || 800) * 3}px`,
                              transform: `translate(-${mouseCanvasPos.normX * 24}px, -${mouseCanvasPos.normY * 18}px)`,
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Crosshair size={24} className="text-[#00E5FF] opacity-60" />
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* Footer Telemetry Bar */}
                <div className="flex flex-wrap items-center justify-between px-5 py-2.5 bg-slate-950 border-t border-white/10 text-xs font-mono text-gray-400 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                      <span className="text-white font-bold">Cursor: X:{mouseCanvasPos.normX}% Y:{mouseCanvasPos.normY}%</span>
                    </span>
                    <span>|</span>
                    <span>Mode: <strong className="text-[#00E5FF]">{viewMode.toUpperCase()}</strong></span>
                  </div>
                  <span className="text-[#97d700] font-bold">Sher Vision Tensor Core Active</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ANOMALY DIRECTORY & ACTIVE LEARNING HUB (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* 1. EXACT ANOMALY DIRECTORY */}
              <div className="bg-slate-900 dark:bg-[#0f131a] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={18} className="text-red-400" />
                    <h3 className="font-headline font-black text-base">Detected Anomaly Locations</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    {currentRegions.length} Found
                  </span>
                </div>

                {currentRegions.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-center space-y-2">
                    <CheckCircle2 size={32} className="text-[#97d700] mx-auto" />
                    <p className="font-bold text-sm text-green-300">Clean Baseline Verified</p>
                    <p className="text-xs text-gray-400">Zero pixel splicing, font shift, or header tampering anomalies detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentRegions.map((region, idx) => {
                      const isSelected = selectedRegionId === region.id;
                      return (
                        <div
                          key={region.id}
                          onClick={() => setSelectedRegionId(region.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2 ${
                            isSelected
                              ? 'bg-slate-800 border-[#00E5FF] shadow-lg translate-x-1'
                              : 'bg-black/40 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                              <span className="font-bold text-xs text-white">#{idx + 1} {region.title}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                              {region.severity}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-300 leading-snug">{region.description}</p>

                          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 pt-1 border-t border-white/5">
                            <span>Layer: {region.layer}</span>
                            <span>Target: ({region.x}%, {region.y}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. SHER ACTIVE CONTINUOUS LEARNING HUB ("IT MUST BE LEARNT") */}
              <div className="bg-gradient-to-br from-slate-900 via-[#101926] to-slate-950 rounded-3xl p-6 sm:p-7 border border-[#00E5FF]/40 shadow-2xl space-y-5 text-white">
                <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#97d700]/20 border border-[#97d700]/40 flex items-center justify-center text-[#97d700]">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-base text-white">
                      Sher Active Learning Hub
                    </h3>
                    <p className="text-[11px] text-gray-300 font-mono">Real-Time Continuous Neural Weight Calibration</p>
                  </div>
                </div>

                {/* Automated Real-Time Active Learning Status Card */}
                <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#97d700] animate-pulse" />
                      <span>Automatic Online Learning:</span>
                    </span>
                    <span className="text-[#97d700] font-bold">ACTIVE</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-300">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Feature Vector:</span>
                      <span className="text-[#00E5FF] font-bold">6D Extracted & Indexed</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Self-Calibration:</span>
                      <span className="text-[#97d700] font-bold">Real-time Gradient Update</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 border-t border-white/10 pt-2 leading-relaxed">
                    ✨ Every uploaded document automatically sharpens detection thresholds by registering its pixel quantization, typography, and metadata fingerprint into memory.
                  </p>
                </div>

                {/* Live Training Telemetry Box */}
                {trainProgress && isTraining && (
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/40 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-[#00E5FF]">
                      <span>Training Epoch: {trainProgress.epoch} / {trainProgress.totalEpochs}</span>
                      <span>Loss: {trainProgress.loss}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#97d700] to-[#00E5FF] h-full transition-all duration-200"
                        style={{ width: `${(trainProgress.epoch / trainProgress.totalEpochs) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                      <span>Model Accuracy: {trainProgress.accuracy}%</span>
                      <span>Precision: {trainProgress.precision}%</span>
                    </div>
                  </div>
                )}

                {/* Retrain Action Button */}
                <button
                  onClick={handleRetrainModel}
                  disabled={isTraining}
                  className="w-full py-3.5 rounded-xl font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#97d700] to-[#00E5FF] hover:opacity-95 text-black shadow-lg shadow-[#00E5FF]/20 disabled:opacity-50"
                >
                  {isTraining ? (
                    <><RefreshCw size={16} className="animate-spin" /> Training Neural Weights…</>
                  ) : (
                    <><Cpu size={16} /> Retrain & Learn Sher AI Model</>
                  )}
                </button>

                {/* Success Notification */}
                {learnedSuccess && (
                  <div className="p-3.5 rounded-2xl bg-[#97d700]/15 border border-[#97d700]/50 text-white space-y-1 animate-fade-in font-mono text-xs">
                    <div className="flex items-center space-x-2 text-[#97d700] font-bold">
                      <Check size={16} />
                      <span>Sher AI Model Learnt Successfully!</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">
                      Gradient descent converged. 6D forensic embedding vectors & calibrated weights updated in memory and cloud vector index.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
