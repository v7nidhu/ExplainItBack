import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import type { AppStep } from '../types';
import { ThemeColorPopover } from './ThemeColorPopover';

interface NavigationProps {
  currentStep: AppStep;
  navColor?: string;
  onNavigate: (step: AppStep) => void;
  onSelectColor: (color: string) => void;
  onDeselectColor: () => void;
}

// Function to calculate if background is dark or light
function isColorDark(hexColor: string): boolean {
  try {
    let c = hexColor.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map((char) => char + char).join('');
    }
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    // HSP equation
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp < 128;
  } catch {
    return false;
  }
}

export const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  navColor = '#132c53',
  onNavigate,
  onSelectColor,
  onDeselectColor,
}) => {
  const [isThemePopoverOpen, setIsThemePopoverOpen] = useState(false);
  const isDark = isColorDark(navColor);

  const textPrimary = isDark ? 'text-white' : 'text-ink-primary';
  const textSecondary = isDark ? 'text-neutral-300' : 'text-ink-secondary';
  const borderColor = isDark ? 'border-white/20' : 'border-editorial-borderSubtle';
  const buttonBg = isDark
    ? 'bg-white text-black hover:bg-neutral-200'
    : 'bg-ink-primary text-foundation hover:bg-neutral-800';

  return (
    <header
      style={{ backgroundColor: navColor }}
      className={`w-full border-b ${borderColor} sticky top-0 z-40 transition-colors duration-300 shadow-2xs`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="group text-left focus:outline-none cursor-pointer bg-transparent"
          aria-label="ExplainItBack Home"
        >
          <span
            className={`font-serif text-2xl sm:text-3xl font-normal tracking-tight ${textPrimary} transition-colors`}
          >
            ExplainItBack
          </span>
        </button>

        {/* Navigation Links */}
        <nav className={`hidden md:flex items-center space-x-8 text-[14px] font-sans ${textSecondary}`}>
          <button
            onClick={() => onNavigate('hero')}
            className={`hover:opacity-80 transition-opacity cursor-pointer bg-transparent ${
              currentStep === 'hero' ? `${textPrimary} font-medium underline underline-offset-8` : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`hover:opacity-80 transition-opacity cursor-pointer bg-transparent ${
              currentStep === 'how-it-works' ? `${textPrimary} font-medium underline underline-offset-8` : ''
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`hover:opacity-80 transition-opacity cursor-pointer bg-transparent ${
              currentStep === 'about' ? `${textPrimary} font-medium underline underline-offset-8` : ''
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`hover:opacity-80 transition-opacity cursor-pointer bg-transparent ${
              currentStep === 'history' ? `${textPrimary} font-medium underline underline-offset-8` : ''
            }`}
          >
            History
          </button>
        </nav>

        {/* Right Side Controls with Unified Theme Palette Icon Popover */}
        <div className="flex items-center gap-3">
          {/* Theme Palette Popover Anchor (Single instance, icon only) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsThemePopoverOpen((prev) => !prev)}
              className={`p-2.5 rounded-full border ${borderColor} hover:opacity-80 transition-all flex items-center justify-center relative bg-white/20 cursor-pointer shadow-2xs`}
              title="Theme Palette"
              aria-label="Theme Palette"
              aria-expanded={isThemePopoverOpen}
            >
              <Palette className={`w-4 h-4 ${textPrimary}`} />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                style={{ backgroundColor: navColor }}
              />
            </button>

            {/* Single Floating Popover Window */}
            <ThemeColorPopover
              isOpen={isThemePopoverOpen}
              currentColor={navColor}
              onClose={() => setIsThemePopoverOpen(false)}
              onSelectColor={(color) => {
                onSelectColor(color);
              }}
              onDeselect={() => {
                onDeselectColor();
              }}
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('topic')}
            className={`${buttonBg} text-[13px] font-medium tracking-wide uppercase px-5 py-2.5 rounded-sm transition-all active:scale-[0.98] shadow-2xs cursor-pointer`}
          >
            Test my understanding
          </button>
        </div>
      </div>
    </header>
  );
};
