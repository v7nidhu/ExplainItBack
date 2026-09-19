import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { analyzeSemantically, evaluateChallengeSemantically } from './semanticEngine.ts';
import {
  ExplanationAnalysisSchema,
  ChallengeEvaluationSchema,
  type ExplanationAnalysisData,
  type ChallengeEvaluationData,
} from '../types/schemas.ts';
import type { SessionRecord } from '../types/index.ts';

const HISTORY_FILE_PATH = path.resolve(process.cwd(), 'data', 'history.json');

function ensureHistoryFile(): void {
  try {
    const dir = path.dirname(HISTORY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(HISTORY_FILE_PATH)) {
      fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Storage] Notice initializing history file directory:', err);
  }
}

export function loadHistoryFromDisk(): SessionRecord[] {
  try {
    ensureHistoryFile();
    if (fs.existsSync(HISTORY_FILE_PATH)) {
      const data = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.warn('[Storage] Notice reading history from disk:', err);
    return [];
  }
}

export function saveSessionToDisk(session: SessionRecord): void {
  try {
    ensureHistoryFile();
    const history = loadHistoryFromDisk();
    const updated = [session, ...history.filter((s) => s.id !== session.id)].slice(0, 50);
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Storage] Notice saving session to disk:', err);
  }
}

export function clearHistoryOnDisk(): void {
  try {
    ensureHistoryFile();
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Storage] Notice clearing history on disk:', err);
  }
}

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Helper to execute Gemini generation with retries, exponential backoff, and fallback models
 * to handle temporary capacity spikes (503 / 429) gracefully.
 */
async function generateContentWithResilience(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string
): Promise<string | null> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const text = response.text;
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err: any) {
        const msg = String(err?.message || err || '');
        const isTransient =
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('timeout') ||
          msg.includes('ECONNRESET');

        if (isTransient && attempt < 1) {
          const delay = 500 + Math.random() * 500;
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }

        // Try next model fallback
        break;
      }
    }
  }

  return null;
}

function extractAndParseJson<T>(
  rawText: string,
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T } }
): T | null {
  try {
    let clean = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(clean);
    const validated = schema.safeParse(parsed);
    if (validated.success && validated.data) {
      return validated.data;
    }
  } catch {
    // Return null to allow graceful fallback
  }
  return null;
}

/**
 * Honest, calibrated evaluation using Gemini or semantic fallback.
 */
export async function handleAnalyzeExplanation(
  topic: string,
  explanation: string
): Promise<ExplanationAnalysisData> {
  const ai = getGenAI();

  if (!ai) {
    return analyzeSemantically(topic, explanation);
  }

  try {
    const systemInstruction = `You are ExplainItBack's evaluation tool.
Your purpose is to honestly evaluate whether the user genuinely understands a concept based on their explanation in their own words.

CRITICAL ACCURACY & SCORING RULES - BE STRICT AND HONEST:
1. If the user's explanation is random letters (e.g. "asdf", "qwerty"), nonsense, completely off-topic, or says "I don't know", the overall score MUST be between 0% and 15%. NEVER give 50%+ to random or irrelevant input.
2. If the explanation only mentions 1 keyword without explaining how it works, give a low score (20%-35%).
3. If the explanation is partially correct, give a balanced score (40%-65%).
4. Only give 75%+ if the user accurately explains the core principles and how they connect.
5. In 'understood', list ONLY concepts that the user ACTUALLY and accurately explained. If they explained nothing accurately, return an empty array [].
6. In 'missing', list the important ideas and mechanisms they did not mention, in very simple words.
7. In 'misconceptions', note any wrong statements or misunderstandings.
8. In 'strengths' and 'weaknesses', write in plain, everyday English. DO NOT use jargon like "mitigation", "stabilization", "causal links", or "tautologies".
9. In 'challenge', point out the single biggest gap in simple words, and give a friendly question to help them understand it.

Return STRICT JSON matching this schema:
{
  "scores": {
    "overall": 78,
    "accuracy": 84,
    "completeness": 69,
    "reasoning": 76,
    "clarity": 82
  },
  "understood": ["..."],
  "missing": ["..."],
  "misconceptions": ["..."],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "challenge": {
    "question": "...",
    "target_gap": "..."
  },
  "improvement_target": "..."
}`;

    const prompt = `Topic: "${topic}"\nUser Explanation:\n"""\n${explanation}\n"""\nEvaluate the user's explanation honestly and in simple language.`;

    const rawJson = await generateContentWithResilience(ai, prompt, systemInstruction);

    if (rawJson) {
      const result = extractAndParseJson<ExplanationAnalysisData>(rawJson, ExplanationAnalysisSchema);
      if (result) {
        return result;
      }
    }

    // Smooth fallback without noisy error log
    return analyzeSemantically(topic, explanation);
  } catch {
    return analyzeSemantically(topic, explanation);
  }
}

/**
 * Evaluates the targeted challenge response.
 */
export async function handleEvaluateChallenge(params: {
  topic: string;
  originalExplanation: string;
  targetGap: string;
  challengeQuestion: string;
  answer: string;
}): Promise<ChallengeEvaluationData> {
  const ai = getGenAI();

  if (!ai) {
    return evaluateChallengeSemantically(
      params.topic,
      params.targetGap,
      params.challengeQuestion,
      params.answer
    );
  }

  try {
    const systemInstruction = `You are ExplainItBack's re-evaluation tool.
Evaluate whether the user's answer successfully addresses the previously detected gap in their understanding.

CRITICAL ACCURACY & HONESTY RULES:
1. If the user's answer is random letters, nonsense, completely off-topic, or does not address the question at all:
   - "addressed_gap" MUST be false
   - "score" MUST be between 5% and 25%
   - "retry" MUST be true
2. If the user answered the question well and explained the missing concept clearly:
   - "addressed_gap" MUST be true
   - "score" should be between 75% and 98%
   - "retry" should be false
3. Language must be very simple, friendly, and plain English. Avoid fancy academic jargon.

Return STRICT JSON matching this schema:
{
  "addressed_gap": true,
  "score": 87,
  "what_improved": "...",
  "remaining_gap": "...",
  "feedback": "...",
  "retry": false
}`;

    const prompt = `Topic: "${params.topic}"
Missing Gap: "${params.targetGap}"
Question: "${params.challengeQuestion}"
User's Answer: """
${params.answer}
"""
Determine if the gap is addressed and compute an accurate score in simple English.`;

    const rawJson = await generateContentWithResilience(ai, prompt, systemInstruction);

    if (rawJson) {
      const result = extractAndParseJson<ChallengeEvaluationData>(rawJson, ChallengeEvaluationSchema);
      if (result) {
        return result;
      }
    }

    return evaluateChallengeSemantically(
      params.topic,
      params.targetGap,
      params.challengeQuestion,
      params.answer
    );
  } catch {
    return evaluateChallengeSemantically(
      params.topic,
      params.targetGap,
      params.challengeQuestion,
      params.answer
    );
  }
}
