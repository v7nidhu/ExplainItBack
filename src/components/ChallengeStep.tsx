import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  BookOpen,
  Check,
  FileEdit,
  Compass,
} from 'lucide-react';
import type { TargetedChallenge, ExplanationAnalysis } from '../types';

interface ChallengeStepProps {
  topic: string;
  originalExplanation: string;
  analysis: ExplanationAnalysis;
  onReExplain: () => void;
  onBackToAnalysis: () => void;
  onFinishSession?: () => void;
  // Optional backward compatible props
  challenge?: TargetedChallenge;
  isEvaluating?: boolean;
  error?: string | null;
  onSubmitAnswer?: (answer: string) => void;
}

export const ChallengeStep: React.FC<ChallengeStepProps> = ({
  topic,
  originalExplanation,
  analysis,
  onReExplain,
  onBackToAnalysis,
  onFinishSession,
}) => {
  const { scores, understood, missing, misconceptions, strengths, weaknesses, challenge, improvement_target } = analysis;

  const wordCount = originalExplanation.trim()
    ? originalExplanation.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Primary suggestion from target_gap or improvement_target
  const primaryGap = challenge?.target_gap || improvement_target || 'The core underlying mechanism';

  return (
    <section className="max-w-5xl mx-auto px-6 py-10 animate-fade-rise">
      {/* Top Editorial Breadcrumbs */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-editorial-borderSubtle">
        <button
          onClick={onBackToAnalysis}
          className="text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>← Return to Evaluation Report</span>
        </button>
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-ink-muted">
          <span>Suggestions & Summary</span>
          <span className="text-ink-faint">/</span>
          <span>Step 04</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-ink-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
            Detailed Summary & Actionable Suggestions
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ink-primary tracking-tight mb-3">
          Suggestions for {topic}
        </h2>
        <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed max-w-3xl">
          Here is a visual summary of what you explained, what key concepts were missing, and all specific suggestions to help you build a complete, master-level explanation.
        </p>
      </div>

      {/* Visual Section 1: Detailed Summary of What the User Did */}
      <div className="border border-editorial-border bg-foundation-pure rounded-sm p-6 sm:p-8 mb-10 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-editorial-borderSubtle">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-ink-muted" />
            <h3 className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink-primary">
              Summary of What You Submitted
            </h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-ink-muted">
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="text-ink-primary font-medium">{scores.overall}% Initial Score</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User's Original Text */}
          <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-editorial-borderSubtle pb-6 lg:pb-0 lg:pr-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block mb-2">
                Your Formulation
              </span>
              <div className="bg-neutral-50/80 border border-editorial-borderSubtle p-4 rounded-sm text-xs sm:text-sm text-ink-secondary italic leading-relaxed font-sans">
                "{originalExplanation || 'No text submitted'}"
              </div>
            </div>

            {strengths.length > 0 && (
              <div className="mt-5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 block mb-2">
                  What You Did Well
                </span>
                <ul className="space-y-1.5">
                  {strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-ink-secondary flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Visual Concept Coverage Map */}
          <div className="lg:col-span-7 space-y-6 lg:pl-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">
                  Concept Coverage Map
                </span>
                <span className="text-xs font-mono text-ink-primary font-medium">
                  {scores.completeness}% Coverage
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-ink-primary rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(5, Math.min(100, scores.completeness))}%` }}
                />
              </div>
            </div>

            {/* Covered vs Missing Concept Tags */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block mb-2">
                  Concepts You Accurately Covered ({understood.length})
                </span>
                {understood.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {understood.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted italic">
                    None of the core principles were clearly identified yet.
                  </p>
                )}
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-primary block mb-2">
                  Concepts You Left Out ({missing.length})
                </span>
                {missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missing.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans bg-neutral-100 text-neutral-800 border border-neutral-200 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted italic">All major key concepts were mentioned.</p>
                )}
              </div>

              {misconceptions.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 block mb-2">
                    Points of Confusion ({misconceptions.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {misconceptions.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans bg-neutral-100 text-neutral-800 border border-neutral-300 shadow-2xs"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Section 2: Visual Concept Bridge Flow Diagram */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-ink-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-ink-primary font-medium">
            Visual Learning Path: From Your Answer to Complete Mastery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-editorial-border bg-neutral-50/60 p-6 rounded-sm">
          {/* Node 1: What You Have */}
          <div className="bg-white border border-editorial-borderSubtle p-5 rounded-sm shadow-2xs flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">Stage 01</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-ink-secondary">Current</span>
              </div>
              <h4 className="font-serif text-lg text-ink-primary font-normal mb-2">What You Covered</h4>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans mb-3">
                {understood.length > 0
                  ? `You established the foundation by mentioning: ${understood.slice(0, 2).join(', ')}.`
                  : 'You introduced the topic but omitted the operational mechanisms.'}
              </p>
            </div>
            <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-emerald-700 flex items-center gap-1">
              <Check className="w-3 h-3" /> Baseline established
            </div>
          </div>

          {/* Node 2: The Core Bridge (Suggestions) - Clean Neutral Box */}
          <div className="bg-white border-2 border-ink-primary p-5 rounded-sm shadow-xs flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-primary font-semibold">Stage 02</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-ink-primary font-medium">Key Suggestion</span>
              </div>
              <h4 className="font-serif text-lg text-ink-primary font-normal mb-2">Bridge the Core Gap</h4>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans mb-3">
                Explain <strong className="text-ink-primary font-medium">"{primaryGap}"</strong>. Show how and why this happens step-by-step.
              </p>
            </div>
            <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-ink-primary flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Connect cause and effect
            </div>
          </div>

          {/* Node 3: Full Mastery Target */}
          <div className="bg-white border border-editorial-borderSubtle p-5 rounded-sm shadow-2xs flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">Stage 03</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-white">Target</span>
              </div>
              <h4 className="font-serif text-lg text-ink-primary font-normal mb-2">Mastery State</h4>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans mb-3">
                A simple, cohesive explanation connecting initial causes, the core mechanism, and the observed result without jargon.
              </p>
            </div>
            <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-ink-muted flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Complete intuitive grasp
            </div>
          </div>
        </div>
      </div>

      {/* Visual Section 3: All Suggestions (Comprehensive Cards, No Questions) */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-ink-primary" />
            <h3 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-primary">
              All Actionable Suggestions
            </h3>
          </div>
          <span className="text-xs font-mono text-ink-muted">
            Detailed Guide to Improve Your Answer
          </span>
        </div>

        {/* Suggestion Card 1: Core Mechanism */}
        <div className="border border-editorial-border bg-foundation-pure p-6 sm:p-7 rounded-sm shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
              01
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-sans text-base font-semibold text-ink-primary">
                  Explain the Primary Driver: {primaryGap}
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-ink-secondary w-fit">
                  Highest Impact
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                Your explanation lacked the engine that makes this work. Clarify what physically or logically triggers this process and what steps happen next.
              </p>
              <div className="p-3 bg-foundation-subtle rounded text-xs text-ink-primary border-l-2 border-ink-primary font-sans mt-2">
                <strong className="font-medium">How to include it:</strong> State explicitly what role "{primaryGap}" plays and why the concept could not function without it.
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Card 2: Incorporate Missing Elements */}
        {missing.length > 0 && (
          <div className="border border-editorial-border bg-foundation-pure p-6 sm:p-7 rounded-sm shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                02
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-sans text-base font-semibold text-ink-primary">
                    Incorporate These Missing Core Details
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-ink-primary w-fit font-medium">
                    Completeness
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                  A listener would need these specific details to follow the whole story:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {missing.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-foundation-subtle border border-editorial-borderSubtle rounded text-xs text-ink-secondary flex items-start gap-2"
                    >
                      <span className="font-mono text-ink-primary font-bold shrink-0">•</span>
                      <div>
                        <span className="font-medium text-ink-primary">{item}</span>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          Mention where this fits into the sequence.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion Card 3: Strengthen Reasoning & Cause-and-Effect */}
        <div className="border border-editorial-border bg-foundation-pure p-6 sm:p-7 rounded-sm shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
              03
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-sans text-base font-semibold text-ink-primary">
                  Connect the Cause to the Effect
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-ink-secondary w-fit">
                  Logical Flow
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                {weaknesses.length > 0
                  ? weaknesses[0]
                  : 'Avoid merely listing names or components. Always explain why one event leads directly to the next.'}
              </p>
              <div className="p-3 bg-foundation-subtle rounded text-xs text-ink-secondary font-sans mt-2">
                <span className="font-medium text-ink-primary">Helpful framing: </span>
                Use linking phrases like <em>"because X occurs, it causes Y, which results in Z."</em>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Card 4: Plain Everyday Words */}
        <div className="border border-editorial-border bg-foundation-pure p-6 sm:p-7 rounded-sm shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
              04
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-sans text-base font-semibold text-ink-primary">
                  The Feynman Technique: Use Everyday Language
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-ink-secondary w-fit">
                  Clarity
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                True understanding is proven when you can explain a concept without hiding behind textbook jargon. If you use a technical term, define what it means using a simple real-world analogy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-editorial-borderSubtle">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBackToAnalysis}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-editorial-border bg-white text-ink-primary text-xs sm:text-sm font-medium px-5 py-3.5 rounded-sm hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
          >
            <span>← Evaluation Report</span>
          </button>

          {onFinishSession && (
            <button
              onClick={onFinishSession}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-editorial-border bg-white text-ink-primary text-xs sm:text-sm font-medium px-5 py-3.5 rounded-sm hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span>View History</span>
            </button>
          )}
        </div>

        {/* Primary CTA: Edit / Re-explain with these Suggestions */}
        <button
          onClick={onReExplain}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-ink-primary text-foundation text-xs sm:text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <FileEdit className="w-4 h-4" />
          <span>Apply Suggestions & Re-explain</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
