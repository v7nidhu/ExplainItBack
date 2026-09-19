import React from 'react';
import { X, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01 / Topic',
      title: 'Pick Any Topic',
      desc: 'Choose any concept or mechanism you want to test yourself on.',
    },
    {
      step: '02 / Explain',
      title: 'Explain in Your Own Words',
      desc: 'Explain how it works step-by-step from memory, just like explaining to a curious friend.',
    },
    {
      step: '03 / Analyze',
      title: 'See What You Missed',
      desc: 'Get an honest breakdown of what you understood and the exact steps you left out.',
    },
    {
      step: '04 / Master',
      title: 'Bridge the Gap',
      desc: 'Answer a targeted challenge question and re-explain to lock in real mastery.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fade-rise">
      <div className="bg-foundation-pure border border-editorial-border max-w-3xl w-full max-h-[88vh] flex flex-col rounded-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-editorial-borderSubtle">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">
              Methodology
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink-primary">
              How ExplainItBack Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink-primary transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Manifesto Paragraph */}
          <div className="border-l-2 border-ink-primary pl-5 py-1">
            <p className="font-serif text-xl sm:text-2xl text-ink-primary leading-snug">
              “Most people don’t realize they don’t understand something until they try to explain it from first principles.”
            </p>
            <span className="text-xs font-mono text-ink-muted block mt-2">
              — The Illusion of Explanatory Depth (Rozenblit & Keil, 2002)
            </span>
          </div>

          <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
            Standard AI tutors feed you answers, creating an illusion of competence through passive recognition. ExplainItBack reverses the relationship: <strong>you explain to the AI</strong>. The AI does not lecture you—it audits your reasoning for causal breaks.
          </p>

          {/* Step-by-Step Editorial Flow */}
          <div className="space-y-6 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-ink-muted">
              The 5-Phase Learning Cycle
            </h4>
            <div className="space-y-4">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="p-4 border border-editorial-borderSubtle bg-neutral-50/40 rounded-sm"
                >
                  <span className="text-xs font-mono text-ink-muted uppercase">{s.step}</span>
                  <h5 className="font-serif text-lg text-ink-primary mt-0.5 mb-1">{s.title}</h5>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-editorial-borderSubtle bg-neutral-50/50 flex justify-end">
          <button
            onClick={() => {
              onClose();
              onStart();
            }}
            className="inline-flex items-center gap-2 bg-ink-primary text-foundation text-xs sm:text-sm font-medium tracking-wide uppercase px-6 py-3 rounded-sm hover:bg-neutral-800 transition-all"
          >
            <span>Begin Evaluation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
