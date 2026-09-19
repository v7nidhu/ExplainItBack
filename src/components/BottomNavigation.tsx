import React from 'react';
import { Home, BookOpen, History, Info, Palette, Sparkles } from 'lucide-react';
import type { AppStep } from '../types';

interface BottomNavigationProps {
  currentStep: AppStep;
  onNavigate: (step: AppStep) => void;
  onOpenModal: (modal: 'history' | 'how-it-works' | 'about' | 'apikey' | 'theme') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentStep,
  onNavigate,
  onOpenModal,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-foundation-pure/95 backdrop-blur-md border-t border-editorial-border py-2 px-4 shadow-sm"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-center sm:gap-8">
        {/* Home */}
        <button
          onClick={() => onNavigate('hero')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-sm transition-colors ${
            currentStep === 'hero'
              ? 'text-ink-primary font-medium'
              : 'text-ink-muted hover:text-ink-primary'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px] font-sans tracking-wide">Home</span>
        </button>

        {/* How It Works */}
        <button
          onClick={() => onOpenModal('how-it-works')}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-sm text-ink-muted hover:text-ink-primary transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[11px] font-sans tracking-wide">How It Works</span>
        </button>

        {/* History */}
        <button
          onClick={() => onOpenModal('history')}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-sm text-ink-muted hover:text-ink-primary transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="text-[11px] font-sans tracking-wide">History</span>
        </button>

        {/* About */}
        <button
          onClick={() => onOpenModal('about')}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-sm text-ink-muted hover:text-ink-primary transition-colors"
        >
          <Info className="w-4 h-4" />
          <span className="text-[11px] font-sans tracking-wide">About</span>
        </button>

        {/* Theme Color Customizer */}
        <button
          onClick={() => onOpenModal('theme')}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-sm text-ink-muted hover:text-ink-primary transition-colors"
          title="Customize Top Navigation Bar Color"
        >
          <Palette className="w-4 h-4" />
          <span className="text-[11px] font-sans tracking-wide">Theme</span>
        </button>

        {/* Test Understanding Primary Action */}
        <button
          onClick={() => onNavigate('topic')}
          className="flex items-center gap-1.5 bg-ink-primary text-foundation py-1.5 px-3.5 rounded-sm text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-all active:scale-[0.98] ml-1 sm:ml-4"
        >
          <Sparkles className="w-3 h-3 text-foundation" />
          <span className="hidden sm:inline">Test My Understanding</span>
          <span className="sm:hidden">Test</span>
        </button>
      </div>
    </nav>
  );
};
