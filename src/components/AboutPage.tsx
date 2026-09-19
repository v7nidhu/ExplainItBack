import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Compass, ShieldCheck, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onStart: () => void;
  themeColor?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onStart, themeColor }) => {
  return (
    <div className="min-h-[calc(100vh-140px)] max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16 animate-fade-rise">
      {/* Top Breadcrumb / Back Button */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="border-b border-editorial-borderSubtle pb-8 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
          Manifesto & Purpose
        </span>
        <h1
          className="font-serif text-4xl sm:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1] mb-6"
          style={{ color: themeColor || undefined }}
        >
          ExplainItBack
        </h1>
        <p className="font-serif italic text-2xl sm:text-3xl text-ink-secondary leading-snug">
          “Don’t ask AI if you understand. Prove it.”
        </p>
      </div>

      {/* Narrative Section */}
      <div className="space-y-8 font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl">
        <p>
          Conversational AI makes it easy to believe you understand things you merely recognize. When an AI explains a concept clearly, your brain confuses familiarity with genuine mastery.
        </p>

        {/* The Inversion Principle - Made Simple */}
        <div className="p-6 sm:p-8 bg-foundation-pure border border-editorial-border rounded-sm my-8 shadow-2xs">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
            The Inversion Principle
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal mb-3">
            You Explain to the AI, Not the Other Way Around.
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary mb-3">
            Instead of passively listening to an AI tutor, <strong>you explain the concept in your own words</strong>.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            The AI acts as an honest thinking auditor: it checks your reasoning step-by-step, identifies what you missed, and poses targeted challenge questions to help you truly understand.
          </p>
        </div>

        {/* Core Architecture Principles styled like Surgical Challenge Questions with hoverable animation */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block">
              Core Architectural Principles
            </span>
            <span className="text-xs font-mono text-ink-muted">
              Hover to examine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="group cursor-pointer bg-foundation-pure border border-editorial-border hover:border-ink-primary p-6 rounded-sm shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 text-ink-primary font-medium group-hover:bg-ink-primary group-hover:text-foundation transition-colors">
                    Surgical Rule 01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-ink-primary group-hover:scale-110 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-serif text-xl text-ink-primary font-normal mb-2 group-hover:text-black">
                  Generative First-Principles
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans mb-4">
                  True comprehension is generative, not recognitive. You must explain the chain of cause and effect using your own words from scratch.
                </p>
              </div>
              <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Active recall</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer bg-foundation-pure border border-editorial-border hover:border-ink-primary p-6 rounded-sm shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 text-ink-primary font-medium group-hover:bg-ink-primary group-hover:text-foundation transition-colors">
                    Surgical Rule 02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-ink-primary group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-serif text-xl text-ink-primary font-normal mb-2 group-hover:text-black">
                  Diagnostic Honesty
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans mb-4">
                  Missing links are identified plainly without sugarcoating, patronizing praise, or gamified distractions.
                </p>
              </div>
              <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Zero fluff</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer bg-foundation-pure border border-editorial-border hover:border-ink-primary p-6 rounded-sm shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 text-ink-primary font-medium group-hover:bg-ink-primary group-hover:text-foundation transition-colors">
                    Surgical Rule 03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-ink-primary group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-serif text-xl text-ink-primary font-normal mb-2 group-hover:text-black">
                  Surgical Challenge Questions
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans mb-4">
                  Instead of broad multiple-choice quizzes, we ask targeted questions that stress-test the exact link where your explanation hesitated.
                </p>
              </div>
              <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Targeted challenge</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group cursor-pointer bg-foundation-pure border border-editorial-border hover:border-ink-primary p-6 rounded-sm shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 text-ink-primary font-medium group-hover:bg-ink-primary group-hover:text-foundation transition-colors">
                    Surgical Rule 04
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-ink-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-serif text-xl text-ink-primary font-normal mb-2 group-hover:text-black">
                  Measurable Delta Synthesis
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans mb-4">
                  You re-explain the concept using the newly discovered insights, solidifying real mental connections permanently.
                </p>
              </div>
              <div className="pt-3 border-t border-editorial-borderSubtle text-[11px] font-mono text-ink-muted flex items-center justify-between">
                <span>Verified growth</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-16 pt-8 border-t border-editorial-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="text-xs font-mono text-ink-muted">
          Ready to verify what you actually know?
        </span>
        <button
          onClick={onStart}
          style={{ backgroundColor: themeColor || undefined }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-ink-primary text-foundation text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-sm"
        >
          <span>Test my understanding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
