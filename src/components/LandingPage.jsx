import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, Zap, Lock, Cpu, Eye, CheckCircle2, ArrowRight, 
  FileSearch, Layers, Binary, SearchCheck, Scale, History, ShieldAlert,
  Flame, Crosshair, ChevronRight, ChevronLeft, Play, Pause, Check, AlertTriangle, 
  Activity, Briefcase, GraduationCap, Receipt, CreditCard, HeartPulse, FileText,
  FileCheck2, Fingerprint, Award, FilePlus2, Sparkle
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeDomainIdx, setActiveDomainIdx] = useState(0);
  const [isDomainAutoPlay, setIsDomainAutoPlay] = useState(true);

  // 6 Focused Domains Data
  const focusedDomains = [
    {
      id: 'hr',
      title: 'HR & RESUMES',
      subtitle: 'CV, Offer Letter, Experience',
      icon: Briefcase,
      accentColor: '#F59E0B', // Amber
      glassBg: 'from-amber-500/15 via-amber-400/5 to-transparent',
      borderColor: 'border-amber-400/40 dark:border-amber-400/30',
      textColor: 'text-amber-500 dark:text-amber-400',
      badgeBg: 'bg-amber-400/10 text-amber-500 border-amber-400/30',
      lightTileBg: 'bg-[#FFFBEB] text-[#92400E] border-amber-200 shadow-amber-500/10',
      stats: '99.7% Accuracy · 120ms Latency',
      docTypes: ['Resume & CV PDF', 'Employment Offer Letter', 'Experience Certificate', 'Salary Slip & CTC Breakdown', 'Relieving Letter'],
      fraudVectors: [
        'Overwritten tenure dates & fabricated employment durations',
        'Altered compensation figures & spliced salary slips',
        'Forged company letterheads & cloned HR stamp signatures',
        'AI-generated synthetic resume profiles & non-existent employers'
      ],
      highlight: 'Prevents candidate credential fraud and false experience claims instantly.'
    },
    {
      id: 'identity',
      title: 'IDENTITY & PASSPORTS',
      subtitle: 'Passport, DL, National ID',
      icon: CreditCard,
      accentColor: '#00E5FF', // Cyan
      glassBg: 'from-cyan-500/15 via-[#00E5FF]/5 to-transparent',
      borderColor: 'border-cyan-400/40 dark:border-cyan-400/30',
      textColor: 'text-cyan-600 dark:text-[#00E5FF]',
      badgeBg: 'bg-cyan-400/10 text-cyan-500 border-cyan-400/30',
      lightTileBg: 'bg-[#ECFEFF] text-[#155E75] border-cyan-200 shadow-cyan-500/10',
      stats: '99.9% Accuracy · 95ms Latency',
      docTypes: ['International Passport Bio Page', 'Driving License', 'National ID / Aadhaar / SSN', 'Voter Registration Card', 'Residence Permit'],
      fraudVectors: [
        'Face-swap deepfakes & synthetic portrait replacement',
        'Modified date of birth and validity expiry dates',
        'Spliced Machine Readable Zone (MRZ) checksum vectors',
        'AI diffusion synthetic ID template generation'
      ],
      highlight: 'Secures digital KYC, onboarding, and border immigration document checks.'
    },
    {
      id: 'bills',
      title: 'BILLS & INVOICES',
      subtitle: 'Utility Bills, Receipts, Tax',
      icon: Receipt,
      accentColor: '#EC4899', // Pink
      glassBg: 'from-pink-500/15 via-pink-400/5 to-transparent',
      borderColor: 'border-pink-400/40 dark:border-pink-400/30',
      textColor: 'text-pink-600 dark:text-pink-400',
      badgeBg: 'bg-pink-400/10 text-pink-500 border-pink-400/30',
      lightTileBg: 'bg-[#FDF2F8] text-[#9D174D] border-pink-200 shadow-pink-500/10',
      stats: '99.8% Accuracy · 110ms Latency',
      docTypes: ['Electricity & Gas Utility Bill', 'Retail & POS Purchase Receipts', 'GST / VAT Tax Invoices', 'Bank Statements & Wire Proof', 'Vendor Purchase Orders'],
      fraudVectors: [
        'Overwritten billing totals and altered decimal points',
        'Modified billing addresses and consumer account numbers',
        'Mathematical checksum & arithmetic balance contradictions',
        'Repeated invoice numbers generated via Canva / PDF editors'
      ],
      highlight: 'Eliminates tax evasion, expense reimbursement fraud, and loan document tampering.'
    },
    {
      id: 'education',
      title: 'EDUCATION & DEGREES',
      subtitle: 'Diploma, Transcripts, Certs',
      icon: GraduationCap,
      accentColor: '#97d700', // Lime
      glassBg: 'from-[#97d700]/15 via-[#97d700]/5 to-transparent',
      borderColor: 'border-[#97d700]/40 dark:border-[#97d700]/30',
      textColor: 'text-[#659b00] dark:text-[#97d700]',
      badgeBg: 'bg-[#97d700]/10 text-[#97d700] border-[#97d700]/30',
      lightTileBg: 'bg-[#F4FCE3] text-[#3F6212] border-lime-200 shadow-lime-500/10',
      stats: '99.9% Accuracy · 140ms Latency',
      docTypes: ['University Degree & Diploma', 'Semester Grade Transcripts', 'Professional Training Certifications', 'Standardized Test Scorecards', 'Dean Honor Letters'],
      fraudVectors: [
        'Photorealistic AI-generated certificates with synthetic seals',
        'Overwritten GPA grades, grade points, and honors designations',
        'Forged registrar signatures & distorted university seal vectors',
        'Manipulated issue dates and certificate verification IDs'
      ],
      highlight: 'Protects university credentials and enterprise professional certification verifications.'
    },
    {
      id: 'legal',
      title: 'LEGAL CONTRACTS',
      subtitle: 'Deeds, Leases, Agreements',
      icon: Scale,
      accentColor: '#8B5CF6', // Purple
      glassBg: 'from-purple-500/15 via-purple-400/5 to-transparent',
      borderColor: 'border-purple-400/40 dark:border-purple-400/30',
      textColor: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-400/10 text-purple-500 border-purple-400/30',
      lightTileBg: 'bg-[#F5F3FF] text-[#5B21B6] border-purple-200 shadow-purple-500/10',
      stats: '99.6% Accuracy · 160ms Latency',
      docTypes: ['Property Deeds & Title Records', 'Commercial Lease Agreements', 'Non-Disclosure Agreements (NDA)', 'Corporate Power of Attorney', 'Notarized Affidavits'],
      fraudVectors: [
        'Inserted/deleted clauses & altered contractual obligations',
        'Copy-pasted notary public stamps & digital stamp splicing',
        'Modified survey boundary coordinates & asset valuation numbers',
        'Backdated execution dates and unauthorized digital signature blocks'
      ],
      highlight: 'Safeguards property transactions, commercial leases, and corporate legal contracts.'
    },
    {
      id: 'medical',
      title: 'MEDICAL & HEALTH',
      subtitle: 'Health Records, Claims',
      icon: HeartPulse,
      accentColor: '#FB923C', // Orange / Coral
      glassBg: 'from-orange-500/15 via-orange-400/5 to-transparent',
      borderColor: 'border-orange-400/40 dark:border-orange-400/30',
      textColor: 'text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-400/10 text-orange-500 border-orange-400/30',
      lightTileBg: 'bg-[#FFF7ED] text-[#9A3412] border-orange-200 shadow-orange-500/10',
      stats: '99.8% Accuracy · 130ms Latency',
      docTypes: ['Hospital Discharge Summary', 'Diagnostic Lab Pathology Report', 'Health Insurance Claim Dossier', 'Doctor Prescription & Medical Bill', 'Disability Assessment Form'],
      fraudVectors: [
        'Inflated hospital diagnostic & treatment billing amounts',
        'Fabricated lab test results and modified pathology markers',
        'Altered prescription dates and unauthorized medication quantities',
        'Forged physician license numbers and hospital stamp seals'
      ],
      highlight: 'Combats fraudulent health insurance claims and medical report falsifications.'
    }
  ];

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

  // Focused Domains Slideshow Timer
  useEffect(() => {
    if (!isDomainAutoPlay) return;
    const domainTimer = setInterval(() => {
      setActiveDomainIdx((prev) => (prev + 1) % focusedDomains.length);
    }, 3800);
    return () => clearInterval(domainTimer);
  }, [isDomainAutoPlay, focusedDomains.length]);

  const activeLayer = algorithmLayers[currentSlide];
  const SlideIcon   = activeLayer.icon;

  const currentDomain = focusedDomains[activeDomainIdx];
  const DomainIcon = currentDomain.icon;

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

      {/* 2. ✨ FOCUSED DOMAINS: GLASSMORPHISM INTERACTIVE SLIDESHOW & SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#97d700]/10 border border-[#97d700]/30 text-[#97d700] text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkle size={14} className="animate-spin text-[#97d700]" />
            <span>Target Industry Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-headline font-extrabold text-slate-900 dark:text-white tracking-tight">
            Domains Focused by <span className="text-[#97d700]">Sher</span><span className="text-[#00E5FF]">Detect</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">
            Tailored multi-layer forensic detection across critical enterprise and consumer document verticals.
          </p>
        </div>

        {/* 6 Glassmorphic Domain Cards Grid (Matching the Exact Pastel Palette) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {focusedDomains.map((domain, idx) => {
            const IconComponent = domain.icon;
            const isSelected = activeDomainIdx === idx;
            return (
              <motion.div
                key={domain.id}
                onClick={() => {
                  setActiveDomainIdx(idx);
                  setIsDomainAutoPlay(false);
                }}
                whileHover={{ scale: 1.025, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group cursor-pointer rounded-3xl p-6 sm:p-7 transition-all duration-300 backdrop-blur-xl border flex flex-col justify-between overflow-hidden shadow-xl
                  ${isSelected
                    ? `border-2 ${domain.borderColor} bg-gradient-to-br ${domain.glassBg} shadow-2xl dark:bg-slate-900/90 ring-2 ring-offset-2 ring-offset-slate-900 ring-${domain.accentColor}`
                    : 'bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
              >
                {/* Glow Backdrop */}
                <div 
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}
                  style={{ backgroundColor: domain.accentColor }}
                />

                {/* Top: Icon Tile & Selection Pulse */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 border
                    ${isSelected
                      ? 'bg-slate-900 text-white dark:bg-black/60 border-white/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <IconComponent size={28} style={{ color: domain.accentColor }} />
                  </div>

                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: domain.accentColor }}></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: domain.accentColor }}></span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-500 dark:text-gray-400">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Center: Title & Subtitle */}
                <div className="mt-5 space-y-1.5">
                  <h3 className={`font-headline font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:${domain.textColor} transition-colors`}>
                    {domain.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-300 leading-snug">
                    {domain.subtitle}
                  </p>
                </div>

                {/* Bottom: Micro Status Tag */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-gray-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck size={13} style={{ color: domain.accentColor }} />
                    Active Guard
                  </span>
                  <span className={`text-[10px] font-bold ${isSelected ? domain.textColor : 'text-slate-400'}`}>
                    {isSelected ? 'INSPECTING' : 'CLICK TO VIEW'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Glassmorphism Spotlight Banner for Selected Domain */}
        <div 
          onMouseEnter={() => setIsDomainAutoPlay(false)}
          onMouseLeave={() => setIsDomainAutoPlay(true)}
          className="max-w-6xl mx-auto relative rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 text-white p-7 sm:p-10 transition-all duration-500"
        >
          {/* Ambient Glow */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: currentDomain.accentColor }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDomain.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
            >
              {/* Left Column: Domain Info & Vectors */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs font-mono font-black px-3.5 py-1 rounded-full border ${currentDomain.badgeBg}`}>
                    DOMAIN {activeDomainIdx + 1} OF 6
                  </span>
                  <span className="text-xs font-mono text-cyan-300 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10">
                    ⚡ {currentDomain.stats}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 shadow-xl"
                    style={{ 
                      backgroundColor: `${currentDomain.accentColor}20`,
                      borderColor: `${currentDomain.accentColor}60`
                    }}
                  >
                    <DomainIcon size={32} style={{ color: currentDomain.accentColor }} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-headline font-black text-white tracking-tight">
                      {currentDomain.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-300 mt-0.5">
                      {currentDomain.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-body">
                  {currentDomain.highlight}
                </p>

                {/* Fraud Attacks Prevented Box */}
                <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-2.5 shadow-inner">
                  <p className="text-[11px] font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 text-red-400">
                    <ShieldAlert size={14} className="text-red-400" /> Tamper Attacks Caught in this Sector:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentDomain.fraudVectors.map((vec, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-gray-300 leading-snug">
                        <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                        <span>{vec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Supported Document Types & Action */}
              <div className="lg:col-span-5 bg-white/5 dark:bg-black/40 rounded-2xl p-6 sm:p-7 border border-white/10 space-y-5 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#97d700]">
                    <CheckCircle2 size={15} />
                    <span>ACCEPTED DOCUMENT TYPES</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">5 Formats</span>
                </div>

                <ul className="space-y-2.5">
                  {currentDomain.docTypes.map((doc, idx) => (
                    <li key={idx} className="flex items-center space-x-2.5 text-xs sm:text-sm text-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>

                {/* Quick Action Button */}
                <button
                  onClick={() => setActiveTab('verification')}
                  className="w-full py-3.5 px-5 rounded-xl font-headline font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-black"
                  style={{
                    background: `linear-gradient(to right, #97d700, #00E5FF)`,
                    boxShadow: `0 0 20px rgba(0, 229, 255, 0.3)`
                  }}
                >
                  <Sparkles size={16} />
                  <span>Verify {currentDomain.title} File</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slideshow Bottom Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDomainAutoPlay(!isDomainAutoPlay)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs font-mono font-bold flex items-center gap-1.5 text-gray-300"
                title={isDomainAutoPlay ? 'Pause Auto-Slideshow' : 'Resume Auto-Slideshow'}
              >
                {isDomainAutoPlay ? <Pause size={13} /> : <Play size={13} />}
                <span>{isDomainAutoPlay ? 'Auto-Cycle Active' : 'Paused'}</span>
              </button>
              <span className="text-xs text-gray-500 font-mono">Hover to pause</span>
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center space-x-2">
              {focusedDomains.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveDomainIdx(i);
                    setIsDomainAutoPlay(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeDomainIdx === i 
                      ? 'w-8 bg-[#00E5FF]' 
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveDomainIdx((prev) => (prev - 1 + focusedDomains.length) % focusedDomains.length);
                  setIsDomainAutoPlay(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
                aria-label="Previous Domain"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setActiveDomainIdx((prev) => (prev + 1) % focusedDomains.length);
                  setIsDomainAutoPlay(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
                aria-label="Next Domain"
              >
                <ChevronRight size={16} />
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

