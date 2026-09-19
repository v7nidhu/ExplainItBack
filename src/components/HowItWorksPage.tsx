import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksPageProps {
  onBack: () => void;
  onStart: () => void;
  themeColor?: string;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBack, onStart, themeColor }) => {
  const steps = [
    {
      num: '01',
      title: 'Pick Any Topic',
      desc: 'Choose any mechanism, scientific principle, or concept you want to test yourself on.',
      tip: 'Examples: How a microwave heats food, DNS lookup, photosynthesis, or compound interest.',
    },
    {
      num: '02',
      title: 'Explain in Your Own Words',
      desc: 'Explain how it works step-by-step from memory, just like you are explaining it to a curious beginner.',
      tip: 'No notes or autocomplete. True understanding comes from generating the explanation yourself.',
    },
    {
      num: '03',
      title: 'See What You Missed',
      desc: 'The auditor reviews your explanation, lists what you got right, and clearly pinpoints omitted steps.',
      tip: 'Clear, honest feedback without unnecessary jargon or distracting gimmicks.',
    },
    {
      num: '04',
      title: 'Bridge the Gap & Master It',
      desc: 'Answer a targeted challenge question addressing your exact gap, then re-explain to see your measured improvement.',
      tip: 'Track your change noted and archive your results for future reference.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16 animate-fade-rise">
      {/* Back Button */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-editorial-borderSubtle pb-8 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
          Simple 4-Step Process
        </span>
        <h1
          className="font-serif text-4xl sm:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1] mb-4"
          style={{ color: themeColor || undefined }}
        >
          How It Works
        </h1>
        <p className="font-serif italic text-xl sm:text-2xl text-ink-secondary leading-snug">
          “If you can’t explain it simply, you don’t understand it well enough.”
        </p>
      </div>

      {/* The 4 Simple Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {steps.map((item) => (
          <div
            key={item.num}
            className="group cursor-pointer p-6 bg-foundation-pure border border-editorial-border rounded-sm hover:border-ink-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-mono text-sm px-2.5 py-1 rounded bg-neutral-100 text-ink-primary font-medium group-hover:bg-ink-primary group-hover:text-foundation transition-colors"
                >
                  Step {item.num}
                </span>
                <CheckCircle2
                  className="w-4 h-4 text-ink-muted group-hover:text-ink-primary transition-colors"
                  style={{ color: themeColor || undefined }}
                />
              </div>

              <h3 className="font-serif text-2xl text-ink-primary font-normal mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-ink-secondary leading-relaxed mb-4 font-sans">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-editorial-borderSubtle text-xs text-ink-muted italic font-sans">
              {item.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="pt-8 border-t border-editorial-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-serif text-xl text-ink-primary">Ready to test yourself?</h4>
          <p className="text-xs text-ink-secondary font-sans mt-1">
            Pick any topic and discover your actual depth of understanding.
          </p>
        </div>
        <button
          onClick={onStart}
          style={{ backgroundColor: themeColor || undefined }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-ink-primary text-foundation text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-sm"
        >
          <span>Start Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
