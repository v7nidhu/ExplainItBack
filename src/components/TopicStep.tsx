import React, { useState } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';

interface TopicStepProps {
  initialTopic: string;
  onProceed: (topic: string) => void;
  themeColor?: string;
}

const BASIC_TOPICS = [
  'Why the daytime sky is blue',
  'How photosynthesis works',
  "Newton's Third Law (Action & Reaction)",
  'Why ice floats on liquid water',
  'How a bicycle stays balanced',
  'How the water cycle works',
];

export const TopicStep: React.FC<TopicStepProps> = ({ initialTopic, onProceed, themeColor }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic to explain.');
      return;
    }
    setError(null);
    onProceed(topic.trim());
  };

  return (
    <section className="min-h-[calc(100vh-160px)] flex flex-col justify-center max-w-3xl mx-auto px-6 py-12 animate-fade-rise">
      {/* Editorial Step Indicator */}
      <div className="flex items-center gap-2 mb-8 text-xs font-mono tracking-widest text-ink-muted uppercase">
        <span>Step 01</span>
        <span className="w-6 h-[1px] bg-editorial-border" />
        <span>Define Concept</span>
      </div>

      {/* Large Minimal Heading */}
      <h2
        className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-ink-primary tracking-tight leading-[1.1] mb-6 transition-colors duration-300"
        style={{ color: themeColor || undefined }}
      >
        What do you think you understand?
      </h2>

      <p className="font-sans text-base sm:text-lg text-ink-secondary mb-10 leading-relaxed max-w-2xl">
        Name a scientific principle, physical law, technical system, or everyday mechanism you believe you comprehend.
      </p>

      {/* 3D Elevated Floating Input Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="relative bg-white border border-editorial-border rounded-xl p-5 sm:p-7 transition-all duration-300 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_18px_48px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 focus-within:-translate-y-1 focus-within:ring-2 focus-within:ring-offset-2"
          style={{
            ['--tw-ring-color' as string]: themeColor || '#0a0a0a',
          }}
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Topic that you think you understand"
            className="w-full bg-transparent py-3 px-0 text-xl sm:text-2xl md:text-3xl font-serif placeholder:font-serif placeholder:text-neutral-400 text-ink-primary outline-none transition-colors border-b border-transparent focus:border-editorial-border"
            autoFocus
          />

          {error && (
            <p className="text-xs text-red-600 mt-2 font-sans">{error}</p>
          )}

          {/* Display character count only below it */}
          <div className="mt-3 pt-2 border-t border-neutral-100 flex justify-end text-xs text-ink-muted font-mono">
            <span>{topic.length}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
          <div className="text-xs text-ink-muted flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Choose any scientific, mathematical, or engineering concept</span>
          </div>

          <button
            type="submit"
            disabled={!topic.trim()}
            style={{ backgroundColor: themeColor || undefined }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-ink-primary text-foundation text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98] shadow-sm"
          >
            <span>Explain it</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Basic Concepts Section Only */}
      <div className="mt-14 pt-8 border-t border-editorial-borderSubtle">
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-primary font-medium">
            Basic Concepts:
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {BASIC_TOPICS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTopic(item);
                setError(null);
              }}
              className="text-left font-sans text-xs sm:text-sm text-ink-secondary hover:text-ink-primary border border-editorial-border hover:border-ink-primary px-3.5 py-2 rounded-full bg-white transition-all hover:scale-[1.02] shadow-2xs"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
