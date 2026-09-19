import React from 'react';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fade-rise">
      <div className="bg-foundation-pure border border-editorial-border max-w-2xl w-full max-h-[85vh] flex flex-col rounded-sm shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-editorial-borderSubtle">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">
              About
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink-primary">
              ExplainItBack
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink-primary transition-colors"
            aria-label="Close About"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-ink-secondary leading-relaxed font-sans flex-1">
          <p className="font-serif text-xl sm:text-2xl text-ink-primary font-normal leading-snug">
            “Don’t ask AI if you understand. Prove it.”
          </p>

          <p>
            ExplainItBack was built on a simple observation: conversational AI makes it dangerously easy to believe you understand things you merely recognize. When AI answers your questions smoothly, your brain registers familiarity as mastery.
          </p>

          <p>
            Real understanding is generative. It requires constructing causal chains from first principles without looking at notes. ExplainItBack serves as an austere thinking partner—analyzing your reasoning structure, detecting unspoken assumptions, and issuing targeted challenges where your mental model fractures.
          </p>

          <div className="pt-4 border-t border-editorial-borderSubtle">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
              Design Principles
            </span>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <strong className="text-ink-primary block font-medium">Calm & Minimal</strong>
                <span>No gamification, no decorative distractions.</span>
              </div>
              <div>
                <strong className="text-ink-primary block font-medium">Diagnostic Precision</strong>
                <span>Not mentioned ≠ Incorrect. Causal depth audited.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-editorial-borderSubtle bg-neutral-50/50 flex justify-between items-center text-xs text-ink-muted font-mono">
          <span>ExplainItBack Hackathon Edition</span>
          <span>Aethera Design System</span>
        </div>
      </div>
    </div>
  );
};
