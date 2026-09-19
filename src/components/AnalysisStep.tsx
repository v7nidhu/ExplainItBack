import React, { useState } from 'react';
import { ArrowRight, Check, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { ExplanationAnalysis } from '../types';

interface AnalysisStepProps {
  topic: string;
  originalExplanation: string;
  analysis: ExplanationAnalysis;
  onProceedToChallenge: () => void;
  onReviseExplanation: () => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  topic,
  originalExplanation,
  analysis,
  onProceedToChallenge,
  onReviseExplanation,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const { scores, understood, missing, misconceptions, strengths, weaknesses } = analysis;

  const scoreMetrics = [
    { label: 'Accuracy (Correct Facts)', value: scores.accuracy },
    { label: 'Completeness (Key Ideas Covered)', value: scores.completeness },
    { label: 'How Things Connect (Logic & Cause)', value: scores.reasoning },
    { label: 'Clarity (Clear Words)', value: scores.clarity },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-10 animate-fade-rise">
      {/* Top Editorial Breadcrumbs */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-editorial-borderSubtle">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-ink-muted">
          <span>Evaluation Report</span>
          <span className="text-ink-faint">/</span>
          <span>Step 03</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{showOriginal ? 'Hide Text' : 'View Submitted Text'}</span>
            {showOriginal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onReviseExplanation}
            className="text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
          >
            Edit Explanation
          </button>
        </div>
      </div>

      {/* Submitted Text Drawer */}
      {showOriginal && (
        <div className="mb-8 p-6 border border-editorial-border bg-foundation-subtle rounded-sm text-xs sm:text-sm text-ink-secondary leading-relaxed animate-fade-rise">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted block mb-2">
            Your Original Formulation
          </span>
          <p className="font-sans italic">"{originalExplanation}"</p>
        </div>
      )}

      {/* Target Topic Statement */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">Evaluation Target</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ink-primary tracking-tight mt-1">
          {topic}
        </h2>
      </div>

      {/* Primary Score & Clean Metric Progress Bars */}
      <div className="border border-editorial-border bg-foundation-pure p-8 sm:p-10 rounded-sm mb-12 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Understanding Score */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-editorial-borderSubtle pb-6 lg:pb-0 lg:pr-8">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
              Assessed Understanding
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-6xl sm:text-8xl font-normal text-ink-primary tracking-tighter">
                {scores.overall}
              </span>
              <span className="font-serif text-3xl text-ink-muted font-light">%</span>
            </div>
            <p className="text-xs text-ink-secondary mt-3 leading-relaxed">
              Based on the accuracy of your facts, how well you showed how things work, and the clarity of your words.
            </p>
          </div>

          {/* Clean Metric Indicators with Authentic Real Data */}
          <div className="lg:col-span-8 space-y-5 lg:pl-4">
            {scoreMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-ink-secondary">{metric.label}</span>
                  <span className="font-mono text-ink-primary font-medium">{metric.value}%</span>
                </div>
                {/* Responsive progress bar */}
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ink-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(2, Math.min(100, metric.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Evaluation Distinction Rule Banner */}
      <div className="mb-10 px-5 py-3.5 border border-editorial-borderSubtle bg-editorial-warmGray/70 rounded-sm flex items-center justify-between text-xs text-ink-secondary font-sans">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-ink-muted shrink-0" />
          <span>
            <strong className="text-ink-primary font-medium">Evaluation Rule:</strong>{' '}
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-editorial-border">Not mentioned ≠ Incorrect</span>.
            We separate what you accurately conveyed from important ideas left unspoken.
          </span>
        </div>
      </div>

      {/* Evaluation Breakdown: 3 Distinct Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Section 1: What You Understood */}
        <div className="border border-editorial-border bg-foundation-pure p-6 rounded-sm flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-editorial-borderSubtle">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <h3 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-primary">
                What You Understood
              </h3>
            </div>
            <p className="text-xs text-ink-muted mb-4 font-mono">Concepts you explained well</p>
            <ul className="space-y-3">
              {understood.length > 0 ? (
                understood.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-ink-secondary leading-relaxed flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-ink-muted italic">
                  No core concepts were accurately explained yet.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Section 2: What You're Missing */}
        <div className="border border-editorial-border bg-foundation-pure p-6 rounded-sm flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-editorial-borderSubtle">
              <span className="w-2 h-2 rounded-full border-2 border-amber-600" />
              <h3 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-primary">
                What You’re Missing
              </h3>
            </div>
            <p className="text-xs text-ink-muted mb-4 font-mono">Important points not yet covered</p>
            <ul className="space-y-3">
              {missing.length > 0 ? (
                missing.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-ink-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-amber-700 font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-ink-muted italic">No major points were missed!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Section 3: Where Reasoning Breaks */}
        <div className="border border-editorial-border bg-foundation-pure p-6 rounded-sm flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-editorial-borderSubtle">
              <span className="w-2 h-2 rounded-full bg-neutral-500" />
              <h3 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-primary">
                Where Reasoning Breaks
              </h3>
            </div>
            <p className="text-xs text-ink-muted mb-4 font-mono">Misunderstandings or broken connections</p>
            <ul className="space-y-3">
              {misconceptions.length > 0 ? (
                misconceptions.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-ink-secondary leading-relaxed flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-ink-muted italic">
                  No wrong assumptions detected.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements in Simple Words */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="border border-editorial-border bg-foundation-pure p-6 sm:p-8 rounded-sm mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 shadow-2xs">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-3">
              What You Did Well
            </span>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="text-xs sm:text-sm text-ink-secondary flex items-start gap-2">
                  <span className="text-ink-muted font-mono">0{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-3">
              Where You Can Improve
            </span>
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-xs sm:text-sm text-ink-secondary flex items-start gap-2">
                  <span className="text-ink-muted font-mono">0{i + 1}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Target Intervention Section: Detailed Summary & Suggestions */}
      <div className="border border-ink-primary bg-neutral-900 text-foundation p-8 sm:p-10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
            Actionable Next Steps
          </span>
          <h4 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white mb-2">
            Detailed Summary & Suggestions
          </h4>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            Review a detailed visual breakdown of what you explained, what was missed, and all concrete suggestions to improve your answer.
          </p>
        </div>

        <button
          onClick={onProceedToChallenge}
          className="shrink-0 inline-flex items-center gap-2.5 bg-white text-ink-primary text-xs sm:text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:bg-neutral-200 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <span>View All Suggestions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
