import type {
  ExplanationAnalysis,
  ChallengeEvaluation,
  SessionRecord,
} from '../types';
import {
  ExplanationAnalysisSchema,
  ChallengeEvaluationSchema,
} from '../types/schemas';
import {
  analyzeSemantically,
  evaluateChallengeSemantically,
} from '../server/semanticEngine';

class AIService {
  /**
   * AI CALL 1:
   * Explanation -> structured analysis via Gemini 3.8 Flash (server-side) or semantic engine fallback
   */
  async analyzeExplanation(
    topic: string,
    explanation: string
  ): Promise<ExplanationAnalysis> {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, explanation }),
      });

      if (res.ok) {
        const data = await res.json();
        // Check for error wrapper
        if (data && !data.error) {
          const validated = ExplanationAnalysisSchema.safeParse(data);
          if (validated.success) {
            return validated.data;
          }
        }
      }
    } catch {
      // Graceful offline/transient fallback
    }

    // Always guarantee a valid, structured diagnosis without crashing or leaking raw error objects
    return analyzeSemantically(topic, explanation);
  }

  /**
   * AI CALL 2:
   * Original gap + challenge + answer -> challenge evaluation
   */
  async evaluateChallenge(params: {
    topic: string;
    originalExplanation: string;
    targetGap: string;
    challengeQuestion: string;
    answer: string;
  }): Promise<ChallengeEvaluation> {
    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          const validated = ChallengeEvaluationSchema.safeParse(data);
          if (validated.success) {
            return validated.data;
          }
        }
      }
    } catch {
      // Graceful offline/transient fallback
    }

    return evaluateChallengeSemantically(
      params.topic,
      params.targetGap,
      params.challengeQuestion,
      params.answer
    );
  }

  /**
   * Session history persistence
   */
  async getHistory(): Promise<SessionRecord[]> {
    let serverRecords: SessionRecord[] = [];
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          serverRecords = data;
        }
      }
    } catch {
      // Expected fallback to localStorage
    }

    let localRecords: SessionRecord[] = [];
    try {
      const local = localStorage.getItem('explainitback_history');
      if (local) {
        localRecords = JSON.parse(local);
      }
    } catch {
      localRecords = [];
    }

    // Merge records by id without duplicates (preserving richest data)
    const map = new Map<string, SessionRecord>();

    // Put local first, then server records can supplement or override
    for (const item of [...localRecords, ...serverRecords]) {
      if (item && item.id) {
        const existing = map.get(item.id);
        if (!existing) {
          map.set(item.id, item);
        } else {
          // If the new one has evaluation/challengeAnswer and the existing doesn't, upgrade it
          if (item.challengeAnswer && !existing.challengeAnswer) {
            map.set(item.id, item);
          }
        }
      }
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    try {
      localStorage.setItem('explainitback_history', JSON.stringify(merged));
    } catch {
      // Non-blocking
    }

    return merged;
  }

  async saveSession(session: SessionRecord): Promise<void> {
    // Save to localStorage immediately
    try {
      const local = localStorage.getItem('explainitback_history');
      const list: SessionRecord[] = local ? JSON.parse(local) : [];
      const updated = [session, ...list.filter((s) => s.id !== session.id)].slice(0, 100);
      localStorage.setItem('explainitback_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Also persist to backend
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session }),
      });
    } catch {
      // Non-blocking
    }
  }

  async clearHistory(): Promise<void> {
    try {
      localStorage.removeItem('explainitback_history');
    } catch {}

    try {
      await fetch('/api/history', {
        method: 'DELETE',
      });
    } catch {}
  }
}

export const aiService = new AIService();
