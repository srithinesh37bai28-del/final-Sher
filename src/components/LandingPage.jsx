import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, Zap, Lock, Cpu, Eye, CheckCircle2, ArrowRight, 
  FileSearch, Layers, Binary, SearchCheck, Scale, History, ShieldAlert,
  Flame, Crosshair, ChevronRight, ChevronLeft, Play, Pause, Check, AlertTriangle, 
  Activity, Briefcase, GraduationCap, Receipt, CreditCard, HeartPulse, FileText,
  FileCheck2, Fingerprint, Award, FilePlus2, Sparkle, ShieldCheck
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const algorithmLayers = [
    {
      step: "01",
      name: "Error Level Analysis (ELA) Algorithm",
      category: "VISUAL LAYER (30% WEIGHT)",
      badgeColor: "border-[#97d700] text-[#97d700] bg-[#97d700]/10",
      icon: Flame,
      formula: "D_ela = |J0(x,y) - J1(x,y)| => Var(Grid) > 15.0",
      summary: "Dual-pass JPEG recompression delta scan to detect post-capture text edits and spliced image pixels.",
      details: [
        "Performs real-time HTML5 Canvas rasterization across 16 grid sectors.",
        "Identifies compression frequency discrepancies between original and recompressed streams.",
        "Detects localized pixel splicing where text/numbers were inserted after document creation."
      ]
    },
    {
      step: "02",
      name: "EXIF & Binary Metadata Extraction",
      category: "METADATA LAYER (20% WEIGHT)",
      badgeColor: "border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10",
      icon: Binary,
      formula: "Check(Header_Slice) => Photoshop, GIMP, Canva, ModDate != CreationDate",
      summary: "Binary slice header parser to trace digital manipulation software footprints and PDF timestamp shifts.",
      details: [
        "Reads up to 128KB binary stream headers for XMP/EXIF software tags.",
        "Detects Adobe Photoshop, GIMP, Canva, Photopea, and Pixelmator footprints.",
        "Parses PDF object streams for ModDate vs CreationDate timestamp discrepancies."
      ]
    },
    {
      step: "03",
      name: "OCR Typographic Geometry Algorithm",
      category: "STRUCTURE LAYER (25% WEIGHT)",
      badgeColor: "border-[#FFAB00] text-[#FFAB00] bg-[#FFAB00]/10",
      icon: Layers,
      formula: "Delta_Kerning = |Vector_Shift(glyph) - Grid_Baseline| > 18.5%",
      summary: "Vector typography analyzer to detect font kerning anomalies and baseline alignment shifts.",
      details: [
        "Measures character bounding box baseline shifts relative to standard print grids.",
        "Calculates letter spacing (kerning) variance across adjacent text blocks.",
        "Identifies spliced text glyphs that deviate from institutional font matrices."
      ]
    },
    {
      step: "04",
      name: "AI Multimodal Semantic Reasoner",
      category: "CONTEXT LAYER (25% WEIGHT)",
      badgeColor: "border-[#97d700] text-[#97d700] bg-[#97d700]/10",
      icon: Cpu,
      formula: "Verify(Entity_Context) => Date_Parity AND Checksum_Balance",
      summary: "Multimodal AI validation of context coherence, field checksums, date logic, and seal perimeters.",
      details: [
        "Validates internal arithmetic balance in financial invoices and bank statements.",
        "Cross-checks issuing authority seal boundaries for copy-move blur artifacts.",
        "Ensures date sequences (Issue Date vs Expiry Date) are logically valid."
      ]
    },
    {
      step: "05",
      name: "Copy-Move Clone Region Detector",
      category: "RASTER ANOMALY SCAN",
      badgeColor: "border-purple-400 text-purple-400 bg-purple-400/10",
      icon: SearchCheck,
      formula: "Autocorrelation(Block_i, Block_j) > 0.92",
      summary: "Block-matching autocorrelation algorithm to identify cloned seals, signatures, and duplicated text fields.",
      details: [
        "Scans image sectors for identical pixel block replication (copy-paste forgery).",
        "Detects artificial blur smoothing at official stamp and signature perimeters.",
        "Highlights duplicated text segments copied from other document regions."
      ]
    },
    {
      step: "06",
      name: "Neural Diffusion Noise Frequency Analysis",
      category: "SYNTHETIC AI FRAUD SCAN",
      badgeColor: "border-pink-400 text-pink-400 bg-pink-400/10",
      icon: Zap,
      formula: "U_noise = Var(Background) < 0.6 AND Synthetic_Tag",
      summary: "Neural frequency analysis to identify AI-generated / deepfake synthetic documents.",
      details: [
        "Detects unnaturally flat or uniform background noise typical of canvas renderers.",
        "Traces Midjourney, Stable Diffusion, DALL-E, and Python-PIL synthetic generator tags.",
        "Flags AI-generated synthetic ID cards, diplomas, and fake financial statements."
      ]
    },
    {
      step: "07",
      name: "Multi-Layer Evidence Fusion Engine",
      category: "FINAL SYNTHESIS ENGINE (100% COMPOSITE)",
      badgeColor: "border-emerald-400 text-emerald-400 bg-emerald-400/20",
      icon: Scale,
      formula: "Risk = 0.30(Visual) + 0.20(Meta) + 0.25(OCR) + 0.25(AI) => Dossier",
      summary: "Algorithmic fusion engine combining evidence from all 6 layers into a unified explainable dossier.",
      details: [
        "Fuses visual ELA, metadata, OCR geometry, and semantic AI into a unified risk vector.",
        "Generates plain-language explainability rationale detailing why the document can/cannot be trusted.",
        "Maps suspicious region coordinates (#1, #2, #3) onto the visual canvas for inspection."
      ]
    }
  ];

  // Algorithms Slideshow Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % algorithmLayers.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [algorithmLayers.length]);

  const activeLayer = algorithmLayers[currentSlide];
  const SlideIcon   = activeLayer.icon;

  return (
    <div className="space-y-24 pb-24 font-body">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#97d700]/15 via-[#00E5FF]/20 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#15191e] border border-slate-300 dark:border-[#00E5FF]/30 text-xs font-mono text-slate-800 dark:text-[#00E5FF] shadow-xl shadow-[#00E5FF]/10 transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#97d700] animate-ping" />
              <span>AI POWERED FRAUD DETECTION SYSTEM</span>
            </div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl font-headline font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Autonomous Document Integrity & <br />
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-[#97d700] via-[#00E5FF] to-indigo-400 dark:to-cyan-200 bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                Real-Time AI Fraud Prevention.
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Instantly verify documents and detect digital tampering using multi-layer AI forensic analysis.
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('verification')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-sm tracking-wider shadow-xl shadow-[#97d700]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
              >
                <Sparkles className="w-5 h-5" />
                <span>LAUNCH REAL-TIME VERIFICATION</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-[#1c2128] hover:bg-slate-100 dark:hover:bg-[#282f3a] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 font-headline font-semibold text-sm tracking-wide shadow-sm transition flex items-center justify-center space-x-2"
              >
                <FileSearch className="w-5 h-5 text-[#00E5FF]" />
                <span>EXPLORE FORENSIC TELEMETRY</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW SHERDETECT WORKS — HIGH-END AUTOMATED ALGORITHMIC CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-headline font-extrabold text-slate-900 dark:text-white tracking-tight">
            How SHERDETECT Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed">
            Every document flows continuously through 6 forensic detection algorithms before executing final synthesis in the Layer 7 Multi-Layer Evidence Fusion Engine.
          </p>
        </div>

        {/* High-End Animated Slide Card Container (Spring Left to Right Motion) */}
        <div className="relative overflow-hidden rounded-3xl min-h-[380px] max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`p-8 sm:p-12 rounded-3xl border shadow-2xl transition-all ${
                currentSlide === 6
                  ? 'bg-gradient-to-br from-slate-900 via-[#0d1e18] to-slate-900 dark:from-[#0d1612] dark:via-[#112419] dark:to-[#0d1612] border-emerald-500/50 text-white shadow-emerald-500/10'
                  : 'bg-white dark:bg-[#15191e] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Meta, Title & Formula */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-black px-3.5 py-1 rounded-full bg-slate-900 text-white dark:bg-white/10 dark:text-[#97d700] shadow-md">
                      LAYER {activeLayer.step}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-3.5 py-1 rounded-full border shadow-sm ${activeLayer.badgeColor}`}>
                      {activeLayer.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#97d700]/20 to-[#00E5FF]/20 border border-[#97d700]/40 flex items-center justify-center shrink-0 shadow-lg shadow-[#97d700]/10">
                      <SlideIcon className="w-8 h-8 text-[#97d700]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight">
                      {activeLayer.name}
                    </h3>
                  </div>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed font-body">
                    {activeLayer.summary}
                  </p>

                  {/* Formula Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-100 dark:bg-[#0a0c0e] dark:text-[#00E5FF] border border-slate-800 dark:border-[#00E5FF]/40 font-mono text-xs sm:text-sm space-y-1.5 shadow-2xl">
                    <p className="text-[10px] text-gray-400 font-sans uppercase tracking-wider font-bold">Algorithmic Detection Formula:</p>
                    <p className="font-bold text-[#97d700] tracking-wide">{activeLayer.formula}</p>
                  </div>
                </div>

                {/* Right Column: Capabilities Box */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-[#0d0f12] p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-inner">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-700 dark:text-gray-300 border-b border-slate-200 dark:border-white/10 pb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#97d700]" />
                    <span>FORENSIC CAPABILITIES</span>
                  </div>

                  <ul className="space-y-3.5">
                    {activeLayer.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-body">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. COMPARISON: BEFORE AI VS SHERDETECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#97d700] tracking-widest font-bold">FORENSIC EVOLUTION</span>
          <h2 className="text-3xl font-headline font-bold text-slate-900 dark:text-white">Why Single-Layer OCR Fails</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Old Approach */}
          <div className="bg-white dark:bg-[#15191e] p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                Traditional Single-Pass OCR Check
              </h3>
            </div>
            <ul className="space-y-4 text-xs font-body text-slate-600 dark:text-gray-400">
              <li className="flex items-start space-x-3">
                <span className="text-red-500 text-sm font-bold">✗</span>
                <span><strong>Superficial Text Extraction:</strong> Reads text values without inspecting underlying pixel compression or ELA frequency deltas.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 text-sm font-bold">✗</span>
                <span><strong>Ignored Metadata Footprints:</strong> Completely blind to digital editing traces from Photoshop, Canva, GIMP, and modified PDF timestamps.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 text-sm font-bold">✗</span>
                <span><strong>High False Negative Rate:</strong> Easily bypassed by visually matching fonts or copy-pasted seal stamps.</span>
              </li>
            </ul>
          </div>

          {/* Upgraded SHERDETECT */}
          <div className="bg-slate-900 dark:bg-gradient-to-br dark:from-[#15191e] dark:to-[#1a231b] text-white p-8 rounded-3xl border border-[#97d700]/40 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-[#97d700]" />
              <h3 className="font-headline font-bold text-lg text-white">
                Upgraded Multi-Layer Engine — SHERDETECT
              </h3>
            </div>
            <ul className="space-y-4 text-xs font-body text-gray-200">
              <li className="flex items-start space-x-3">
                <span className="text-[#97d700] text-sm font-bold">✓</span>
                <span><strong>Error Level Analysis (ELA):</strong> Identifies post-capture pixel manipulation and spliced text fields.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#97d700] text-sm font-bold">✓</span>
                <span><strong>EXIF & Binary Metadata Tracing:</strong> Automatically flags software footprints from Photoshop, Canva, GIMP, and modified timestamps.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#97d700] text-sm font-bold">✓</span>
                <span><strong>Explainable Multi-Layer Dashboard:</strong> Combines evidence into a confidence score with highlighted suspicious bounding regions.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

