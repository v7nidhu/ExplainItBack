import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, ArrowUpRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ChallengeEvaluation, ExplanationAnalysis } from '../types';

interface ReEvaluationStepProps {
  topic: string;
  originalExplanation: string;
  challengeQuestion: string;
  challengeAnswer: string;
  analysis: ExplanationAnalysis;
  evaluation: ChallengeEvaluation;
  onReExplain: () => void;
  onFinishSession: () => void;
  onRetryChallenge: () => void;
}

export const ReEvaluationStep: React.FC<ReEvaluationStepProps> = ({
  topic,
  challengeQuestion,
  challengeAnswer,
  analysis,
  evaluation,
  onReExplain,
  onFinishSession,
  onRetryChallenge,
}) => {
  const [showChallengeDetail, setShowChallengeDetail] = useState(false);
  const initialScore = analysis.scores.overall;
  const finalScore = evaluation.score;
  const improvementDelta = finalScore - initialScore;

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 animate-fade-rise">
      {/* Top Editorial Breadcrumbs */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-editorial-borderSubtle">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-ink-muted">
          <span>Evaluation Summary</span>
          <span className="text-ink-faint">/</span>
          <span>Step 05 / Re-Evaluation</span>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-ink-muted">
          Concept: {topic}
        </div>
      </div>

      {/* Main Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ink-primary tracking-tight">
            Understanding Re-Evaluated
          </h2>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
            Measuring how your follow-up answer addressed the missing gap.
          </p>
        </div>

        {/* Restrained Status Badge */}
        <div className="shrink-0">
          {evaluation.addressed_gap ? (
            <div className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 text-foundation px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gap Addressed</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 border border-amber-600 bg-amber-50 text-amber-900 px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Gap Needs More Detail</span>
            </div>
          )}
        </div>
      </div>

      {/* Score Shift Card */}
      <div className="border border-editorial-border bg-foundation-pure p-8 rounded-sm mb-10 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="border-b sm:border-b-0 sm:border-r border-editorial-borderSubtle pb-4 sm:pb-0 sm:pr-4">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">
              Initial Understanding
            </span>
            <div className="font-serif text-4xl sm:text-5xl text-ink-secondary">
              {initialScore}%
            </div>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-editorial-borderSubtle pb-4 sm:pb-0 sm:pr-4">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">
              Revised Understanding
            </span>
            <div className="font-serif text-4xl sm:text-5xl text-ink-primary font-normal">
              {finalScore}%
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">
              Measured Growth
            </span>
            <div className="font-serif text-4xl sm:text-5xl text-ink-primary font-normal flex items-center justify-center sm:justify-start">
              <span>{improvementDelta >= 0 ? `+${improvementDelta}` : improvementDelta}%</span>
              {improvementDelta > 0 && <ArrowUpRight className="w-6 h-6 text-neutral-800 ml-1" />}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Question & User Answer Drawer */}
      <div className="mb-8 border border-editorial-borderSubtle bg-foundation-subtle rounded-sm p-4">
        <button
          onClick={() => setShowChallengeDetail(!showChallengeDetail)}
          className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary cursor-pointer"
        >
          <span>Review Challenge & Your Answer</span>
          {showChallengeDetail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showChallengeDetail && (
          <div className="pt-4 mt-3 border-t border-editorial-borderSubtle space-y-3 text-xs sm:text-sm text-ink-secondary">
            <div>
              <span className="font-mono text-[11px] text-ink-muted block uppercase">Question</span>
              <p className="font-serif italic text-ink-primary text-base">“{challengeQuestion}”</p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-ink-muted block uppercase">Your Response</span>
              <p className="font-sans text-ink-primary">"{challengeAnswer}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Evaluation Insights */}
      <div className="space-y-6 mb-12">
        {/* What Improved */}
        <div className="border border-editorial-border bg-foundation-pure p-6 rounded-sm shadow-2xs">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
            What Improved
          </span>
          <p className="font-sans text-sm sm:text-base text-ink-primary leading-relaxed">
            {evaluation.what_improved}
          </p>
        </div>

        {/* Remaining Gap */}
        <div className="border border-editorial-border bg-foundation-pure p-6 rounded-sm shadow-2xs">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
            Next Step for Mastery
          </span>
          <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
            {evaluation.remaining_gap || 'You have grasped the core mechanism. Keep practicing by explaining real-world scenarios.'}
          </p>
        </div>

        {/* Targeted Feedback */}
        {evaluation.feedback && (
          <div className="border border-editorial-borderSubtle bg-editorial-warmGray/50 p-6 rounded-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
              Summary Feedback
            </span>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary italic leading-relaxed">
              “{evaluation.feedback}”
            </p>
          </div>
        )}
      </div>

      {/* Loop Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-editorial-borderSubtle">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {evaluation.retry && (
            <button
              onClick={onRetryChallenge}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-editorial-border bg-white text-ink-primary text-xs sm:text-sm font-medium px-5 py-3.5 rounded-sm hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Answer</span>
            </button>
          )}

          <button
            onClick={onFinishSession}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-editorial-border bg-white text-ink-primary text-xs sm:text-sm font-medium px-5 py-3.5 rounded-sm hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Finish & View History</span>
          </button>
        </div>

        {/* Primary CTA: Re-explain the original concept */}
        <button
          onClick={onReExplain}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-ink-primary text-foundation text-xs sm:text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <span>Re-explain original concept</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
