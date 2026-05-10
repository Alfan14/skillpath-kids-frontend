/**
 * Gemini client — SERVER ONLY.
 * Never import this file in a Client Component or in any file
 * under app/(dashboard)/ unless it's a Server Component or Route Handler.
 *
 * The API key stays on the server; it is never sent to the browser.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AssessmentAnswers } from '@/types';
import { assessmentQuestions } from '@/data/questions';
import { LIKERT_SCORE } from '@/types';

let genai: GoogleGenerativeAI | null = null;
let model: any = null;

function getModel() {
  if (model) return model;
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable. Add it to .env.local');
  }

  genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  return model;
}

export interface ScoringResult {
  overallScore: number;         // 0–100
  category: string;             // "Bagus" | "Cukup" | "Perlu Latihan"
  focusSummary: string;         // One-sentence note for "Area Perhatian"
  focusAreas: string[];         // Tag chips, e.g. ["Ketelitian", "Koordinasi"]
  skills: {
    label: string;
    score: number;
    status: string;
  }[];
}

/**
 * Score an assessment using Gemini.
 * Called only from the /api/assess Route Handler.
 */
export async function scoreAssessment(answers: AssessmentAnswers): Promise<ScoringResult> {
  // Build a readable summary of answers for the prompt
  const answerLines = assessmentQuestions.map((q) => {
    const val = answers[q.id] ?? 'TS';
    const score = LIKERT_SCORE[val];
    return `- [${q.category}] "${q.text}" → ${val} (${score}/4)`;
  });

  const prompt = `
Kamu adalah ahli perkembangan motorik anak usia 2-6 tahun berbasis Montessori.
Berikut adalah jawaban orang tua dari kuesioner asesmen motorik anak mereka (skala Likert 1-4):

${answerLines.join('\n')}

Berikan analisis dalam format JSON berikut (HANYA JSON, tanpa teks tambahan):
{
  "overallScore": <angka 0-100>,
  "category": "<Bagus|Cukup|Perlu Latihan>",
  "focusSummary": "<kalimat singkat tentang area yang perlu ditingkatkan>",
  "focusAreas": ["<tag1>", "<tag2>"],
  "skills": [
    { "label": "Motorik Kasar", "score": <0-100>, "status": "<Bagus|Cukup|Perlu Latihan>" },
    { "label": "Motorik Halus", "score": <0-100>, "status": "<Bagus|Cukup|Perlu Latihan>" },
    { "label": "Keseimbangan", "score": <0-100>, "status": "<Bagus|Cukup|Perlu Latihan>" },
    { "label": "Koordinasi Mata & Tangan", "score": <0-100>, "status": "<Bagus|Cukup|Perlu Latihan>" }
  ]
}
`.trim();

  const result = await getModel().generateContent(prompt);
  const text = result.response.text();

  // Strip any accidental markdown fences before parsing
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as ScoringResult;
}
