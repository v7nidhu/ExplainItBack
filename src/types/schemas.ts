import { z } from 'zod';

export const AnalysisScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  reasoning: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
});

export const TargetedChallengeSchema = z.object({
  question: z.string().min(1),
  target_gap: z.string().min(1),
});

export const ExplanationAnalysisSchema = z.object({
  scores: AnalysisScoresSchema,
  understood: z.array(z.string()),
  missing: z.array(z.string()),
  misconceptions: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  challenge: TargetedChallengeSchema,
  improvement_target: z.string(),
});

export const ChallengeEvaluationSchema = z.object({
  addressed_gap: z.boolean(),
  score: z.number().min(0).max(100),
  what_improved: z.string(),
  remaining_gap: z.string(),
  feedback: z.string(),
  retry: z.boolean(),
});

export type ExplanationAnalysisData = z.infer<typeof ExplanationAnalysisSchema>;
export type ChallengeEvaluationData = z.infer<typeof ChallengeEvaluationSchema>;
