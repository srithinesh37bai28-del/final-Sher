/**
 * SHERDETECT — Gemini Multimodal Vision AI Forensic Engine
 * 
 * Powered by Google GenAI SDK (@google/genai) & gemini-2.5-flash
 * Performs real-time multimodal deep visual inspection to catch AI-generated certificates,
 * synthetic deepfake documents, altered signatures, and overwritten numerical figures.
 */

import { GoogleGenAI } from '@google/genai';

/**
 * Convert File object to Base64 data string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const maxDim = 1024;
      let w = img.naturalWidth || 800;
      let h = img.naturalHeight || 600;

      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      resolve(dataUrl.split(',')[1]);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    };
  });
}

/**
 * Analyze document image via Gemini 2.5 Flash Multimodal Vision
 */
export async function analyzeDocumentWithGeminiVision(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');

  if (!apiKey || apiKey.length < 10) {
    console.log('ℹ️ Gemini API Key not set. Using Local High-Precision Multi-Pass ELA + Binary Stream Inspector.');
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'image/png';

    const prompt = `You are SHERDETECT, an elite Forensic Document Intelligence Auditor. 
Analyze this document/certificate/ID card image with extreme precision to determine whether it is GENUINE AUTHENTIC or a DIGITAL FORGERY / AI GENERATION.

IMPORTANT AUDIT GUIDELINES:
1. AUTHENTIC PHYSICAL DOCUMENTS: Real camera photographs of physical identity cards (e.g. College/University Student IDs, Government IDs, Passports, Driver Licenses) in plastic pouches, on tables/fabric, or with natural camera lighting, real student photographs, real signatures, and legitimate institution details (e.g. Mepco Schlenk Engg. College) are VERIFIED AUTHENTIC (riskScore: 0 to 5%). Physical card wear, plastic reflections, or camera compression are NOT tampering.
2. DIGITAL FORGERIES & AI GENERATED: If and only if you find actual digital tampering (e.g. mismatched fonts, spliced numbers/names, Photoshop copy-paste halos, AI-generated synthetic garbled text, impossible dates, or AI face diffusion artifacts), flag it as CRITICAL RISK (riskScore: 80 to 98%).

Respond strictly in valid JSON format:
{
  "isForged": boolean,
  "isAiGenerated": boolean,
  "riskScore": number (integer between 0 and 100, where 0-10 means genuine clean authentic),
  "riskLevel": string ("VERIFIED AUTHENTIC (CLEAN)" or "CRITICAL RISK (AI-GENERATED SYNTHETIC FRAUD)" or "CRITICAL RISK (PIXEL SPLICING & OVERWRITING)"),
  "detectedSoftware": string ("Direct Hardware Capture / Camera" for real photos, or "Generative AI Model / Diffusion Engine" or "Adobe Photoshop" if forged),
  "forensicReasons": [ string array of 3-4 specific detailed audit findings explaining exactly why it is authentic or what specific flaw was found ],
  "layerScores": {
    "ela": number (0-10 for clean, 80-100 for forged),
    "metadata": number (0-10 for clean, 80-100 for forged),
    "ocr": number (0-10 for clean, 80-100 for forged),
    "ai": number (0-10 for clean, 80-100 for forged)
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { text: prompt },
        { inlineData: { mimeType, data: base64Data } }
      ]
    });

    const responseText = response.text || '';
    // Robustly extract JSON from markdown code fences or raw JSON
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) || responseText.match(/(\{[\s\S]*\})/);
    const cleanedText = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
    const parsedJSON = JSON.parse(cleanedText);

    // Sanity-clamp riskScore to 0-100 integer
    if (typeof parsedJSON.riskScore === 'number') {
      parsedJSON.riskScore = Math.max(0, Math.min(100, Math.round(parsedJSON.riskScore)));
    }

    console.log('✨ Gemini Multimodal Vision Analysis Complete:', parsedJSON);
    return parsedJSON;

  } catch (err) {
    console.warn('Gemini Vision API notice:', err.message);
    return null;
  }
}
