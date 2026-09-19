export interface AnalysisScores {
  overall: number;
  accuracy: number;
  completeness: number;
  reasoning: number;
  clarity: number;
}

export interface TargetedChallenge {
  question: string;
  target_gap: string;
}

export interface ExplanationAnalysis {
  scores: AnalysisScores;
  understood: string[];
  missing: string[];
  misconceptions: string[];
  strengths: string[];
  weaknesses: string[];
  challenge: TargetedChallenge;
  improvement_target: string;
}

export interface ChallengeEvaluation {
  addressed_gap: boolean;
  score: number;
  what_improved: string;
  remaining_gap: string;
  feedback: string;
  retry: boolean;
}

export interface SessionRecord {
  id: string;
  topic: string;
  date: string;
  initialUnderstanding: number;
  finalUnderstanding: number;
  improvement: number;
  originalExplanation: string;
  analysis: ExplanationAnalysis;
  challengeAnswer?: string;
  evaluation?: ChallengeEvaluation;
  reExplanation?: string;
}

export type AppStep =
  | 'hero'
  | 'topic'
  | 'explain'
  | 'analyzing'
  | 'analysis'
  | 'challenge'
  | 'evaluating'
  | 'reevaluation'
  | 'how-it-works'
  | 'history'
  | 'about';
