/**
 * SHERDETECT - Global Forensic Data & Case Records
 * Domain-Independent General-Purpose Document Analysis Dataset
 */

export const mockTelemetryStats = {
  totalAnalyzed: 28490,
  fraudDetected: 614,
  flaggedRisk: 248,
  passedClean: 27628,
  accuracyRate: "99.89%",
  avgProcessingTime: "0.85s",
  activeSensors: 32,
  tamperingMethodDistribution: [
    { id: "pixel", name: "Pixel Splicing (ELA)", percentage: 42, count: 258, color: "#97d700" },
    { id: "ocr", name: "Font Kerning & Typography Shift", percentage: 28, count: 172, color: "#00E5FF" },
    { id: "metadata", name: "Metadata/EXIF Inconsistency", percentage: 18, count: 110, color: "#FFAB00" },
    { id: "semantic", name: "Semantic & Checksum Contradiction", percentage: 12, count: 74, color: "#FF3B30" },
  ]
};

export const mockSampleDocuments = [
  {
    id: 'sample-forged-doc-1',
    name: 'Official_Identity_Credential_Modified.png',
    type: 'Altered Credential (ELA + Font Tampered)',
    preview: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&auto=format&fit=crop&q=60',
    forged: true,
    expectedRiskScore: 94,
    description: "Modified alphanumeric string and altered expiration year. Clear compression variance under ELA scan."
  },
  {
    id: 'sample-forged-doc-2',
    name: 'Transactional_Statement_Spliced.png',
    type: 'Financial & Contractual Record (Spliced Figures)',
    preview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=60',
    forged: true,
    expectedRiskScore: 88,
    description: "Modified beneficiary account number and copy-pasted authorization signature block."
  },
  {
    id: 'sample-clean-doc-3',
    name: 'Accreditation_Certificate_Authentic.png',
    type: 'Authentic Document (Clean Uniform Baseline)',
    preview: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&auto=format&fit=crop&q=60',
    forged: false,
    expectedRiskScore: 4,
    description: "Unadulterated original scan. Passed all 4 forensic layers with 99.4% confidence."
  }
];

export const mockInvestigationCases = [
  {
    id: "SHER-2026-9042",
    caseNumber: "CASE-88210",
    documentName: "Identity_Credential_Record_Spliced.pdf",
    documentType: "Universal Identification",
    riskLevel: "CRITICAL FRAUD",
    riskScore: 94,
    status: "CONFIRMED FORGERY",
    detectedAt: "2026-08-28 14:30:10 UTC",
    analyst: "Lead Investigator Alex Chen",
    summary: "Pixel Error Level Analysis detected high-frequency quantization delta around identification number and date of birth. EXIF header confirms Photoshop editing on 2026-08-27.",
    anomalies: [
      { id: 1, type: "Pixel Quantization Inconsistency (ELA)", severity: "CRITICAL", detail: "Significant compression discrepancy detected around numeric ID block. ELA delta +89%." },
      { id: 2, type: "Font Vector Variance", severity: "HIGH", detail: "Typography baseline shifted +4.2px relative to template grid line." },
      { id: 3, type: "Metadata Checksum Mismatch", severity: "HIGH", detail: "Binary EXIF tag indicates export via Adobe Photoshop CC 2026." },
      { id: 4, type: "Semantic Logical Contradiction", severity: "MEDIUM", detail: "Internal checksum formula does not match calculated parity value." }
    ],
    layerScores: {
      visualEla: 96,
      metadata: 90,
      ocrStructure: 88,
      semanticAi: 95
    },
    auditTrail: [
      { timestamp: "2026-08-28 14:30:10", action: "7-Stage Pipeline Scan Completed", user: "SHERDETECT Engine v4.2" },
      { timestamp: "2026-08-28 14:30:12", action: "Flagged CRITICAL FRAUD (Risk: 94%)", user: "Fusion Decision Layer" },
      { timestamp: "2026-08-28 14:35:00", action: "Opened Investigation Dossier", user: "Alex Chen" },
      { timestamp: "2026-08-28 15:02:40", action: "Confirmed Pixel Splicing with ELA Evidence", user: "Alex Chen" }
    ]
  },
  {
    id: "SHER-2026-9041",
    caseNumber: "CASE-88204",
    documentName: "Vendor_Agreement_Payment_Terms.png",
    documentType: "Legal & Commercial Record",
    riskLevel: "HIGH RISK",
    riskScore: 82,
    status: "UNDER REVIEW",
    detectedAt: "2026-08-28 13:12:00 UTC",
    analyst: "Unassigned",
    summary: "Payment beneficiary code altered with copy-move cloning. Character spacing on clause 4 deviates by 22% from rest of document.",
    anomalies: [
      { id: 1, type: "Beneficiary Code Alteration", severity: "CRITICAL", detail: "Account numbers spliced into preexisting text block with mismatching noise profile." },
      { id: 2, type: "Typography Kerning Anomaly", severity: "MEDIUM", detail: "Clause 4 font kerning does not match primary document typeface." }
    ],
    layerScores: {
      visualEla: 86,
      metadata: 75,
      ocrStructure: 89,
      semanticAi: 84
    },
    auditTrail: [
      { timestamp: "2026-08-28 13:12:00", action: "Document Ingested via Gateway", user: "API Client" },
      { timestamp: "2026-08-28 13:12:02", action: "Visual & OCR Anomaly Flagged", user: "SHERDETECT Rule #14" }
    ]
  },
  {
    id: "SHER-2026-9040",
    caseNumber: "CASE-88190",
    documentName: "Accreditation_Degree_Clean.pdf",
    documentType: "Certification Record",
    riskLevel: "SAFE / CLEAN",
    riskScore: 3,
    status: "VERIFIED AUTHENTIC",
    detectedAt: "2026-08-28 11:45:00 UTC",
    analyst: "Automated System",
    summary: "Uniform compression baseline across all canvas coordinates. Watermark seal integrity confirmed and digital certificate validated.",
    anomalies: [],
    layerScores: {
      visualEla: 2,
      metadata: 1,
      ocrStructure: 3,
      semanticAi: 4
    },
    auditTrail: [
      { timestamp: "2026-08-28 11:45:00", action: "Verification Successful - 99.1% Confidence", user: "SHERDETECT Engine" }
    ]
  }
];

export const mockRecentStream = [
  { id: "SCAN-10491", name: "Executive_Contract_Clause.pdf", status: "AUTHENTIC", score: 99.4, time: "Just now", type: "Contract" },
  { id: "SCAN-10490", name: "Government_Issued_ID.png", status: "CRITICAL FRAUD", score: 93.8, time: "2 mins ago", type: "Identification" },
  { id: "SCAN-10489", name: "Commercial_Invoice_0911.pdf", status: "SUSPICIOUS", score: 78.2, time: "7 mins ago", type: "Invoice" },
  { id: "SCAN-10488", name: "Institutional_Diploma.png", status: "AUTHENTIC", score: 98.7, time: "14 mins ago", type: "Certificate" },
  { id: "SCAN-10487", name: "Employment_Reference_Letter.pdf", status: "AUTHENTIC", score: 99.1, time: "25 mins ago", type: "Document" },
];
