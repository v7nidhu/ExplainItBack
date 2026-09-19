import React, { useState } from 'react';
import { X, Palette, Check, RotateCcw } from 'lucide-react';

interface ThemeColorModalProps {
  isOpen: boolean;
  currentColor: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

const PRESET_NAV_COLORS = [
  { name: 'Default Grayish', hex: '#e9e8e3' },
  { name: 'Cool Slate Gray', hex: '#d9dce1' },
  { name: 'Warm Stone', hex: '#ded9d0' },
  { name: 'Sage Tint', hex: '#dce3dd' },
  { name: 'Sand Cream', hex: '#ede6d8' },
  { name: 'Muted Blue Gray', hex: '#dbe2e9' },
  { name: 'Deep Charcoal', hex: '#262628' },
  { name: 'Midnight Black', hex: '#0f0f11' },
  { name: 'Off-White Minimal', hex: '#faf9f6' },
];

export const ThemeColorModal: React.FC<ThemeColorModalProps> = ({
  isOpen,
  currentColor,
  onClose,
  onSelectColor,
}) => {
  const [customHex, setCustomHex] = useState(currentColor);

  if (!isOpen) return null;

  const handleApply = (color: string) => {
    onSelectColor(color);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fade-rise">
      <div className="bg-foundation-pure border border-editorial-border max-w-md w-full rounded-sm shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-editorial-borderSubtle">
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4 text-ink-primary" />
            <h3 className="font-serif text-2xl font-normal text-ink-primary">
              Navigation Bar Theme
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink-primary transition-colors"
            aria-label="Close Theme Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-ink-secondary leading-relaxed font-sans">
            Customize the top navigation bar color. By default it is styled in clean grayish, and can be customized to any hue.
          </p>

          {/* Curated Palette Options */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block mb-3">
              Curated Palettes
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESET_NAV_COLORS.map((preset) => {
                const isSelected = currentColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setCustomHex(preset.hex);
                      handleApply(preset.hex);
                    }}
                    className={`p-2.5 rounded-sm border text-left flex flex-col justify-between h-18 transition-all ${
                      isSelected
                        ? 'border-ink-primary ring-1 ring-ink-primary shadow-xs'
                        : 'border-editorial-border hover:border-neutral-400'
                    }`}
                  >
                    <div
                      className="w-full h-5 rounded-xs border border-black/10 flex items-center justify-end px-1"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3 h-3 ${
                            preset.hex === '#262628' || preset.hex === '#0f0f11'
                              ? 'text-white'
                              : 'text-black'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-sans text-ink-primary truncate mt-1">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Selector */}
          <div className="pt-4 border-t border-editorial-borderSubtle">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block mb-2">
              Custom Hex or Color Wheel
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customHex}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  handleApply(e.target.value);
                }}
                className="w-10 h-10 p-0 border border-editorial-border rounded-sm cursor-pointer bg-transparent"
                title="Choose custom color"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    handleApply(e.target.value);
                  }
                }}
                placeholder="#e9e8e3"
                className="font-mono text-xs px-3 py-2 border border-editorial-border rounded-sm bg-foundation focus:border-ink-primary outline-none flex-1 text-ink-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const defaultColor = '#e9e8e3';
                  setCustomHex(defaultColor);
                  handleApply(defaultColor);
                }}
                className="p-2 border border-editorial-border rounded-sm text-ink-muted hover:text-ink-primary"
                title="Reset to Default Grayish"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-editorial-borderSubtle bg-neutral-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-ink-primary text-foundation text-xs font-medium uppercase tracking-wider px-6 py-2.5 rounded-sm hover:bg-neutral-800 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
