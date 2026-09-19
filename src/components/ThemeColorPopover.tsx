import React, { useRef, useEffect } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';

export interface ThemeColorPopoverProps {
  isOpen: boolean;
  currentColor: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  onDeselect: () => void;
}

// 6 Curated high-aesthetic color shades (rich, distinctive, and elegant)
const CIRCULAR_COLOR_SHADES = [
  { name: 'Deep Navy (Default: rgb 19, 44, 83)', hex: '#132c53' },
  { name: 'Olive Green', hex: '#556b2f' },
  { name: 'Forest Pine', hex: '#24553e' },
  { name: 'Warm Terracotta', hex: '#c85a32' },
  { name: 'Burgundy Wine', hex: '#782846' },
  { name: 'Slate Charcoal', hex: '#3a4655' },
];

export const ThemeColorPopover: React.FC<ThemeColorPopoverProps> = ({
  isOpen,
  currentColor,
  onClose,
  onSelectColor,
  onDeselect,
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChooseColor = (hex: string) => {
    onSelectColor(hex);
  };

  return (
    <div
      ref={popoverRef}
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 w-64 bg-white border border-editorial-border shadow-2xl rounded-xl p-4 z-50 animate-fade-rise select-none"
      role="dialog"
      aria-label="Color Palette"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
            style={{ backgroundColor: currentColor || '#132c53' }}
          />
          <span className="text-xs font-mono uppercase tracking-wider text-ink-primary font-medium">
            Theme Palette
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-ink-muted hover:text-ink-primary rounded-md transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 Curated Circular Color Options in a clean row */}
      <div className="mb-3">
        <div className="grid grid-cols-6 gap-2 justify-items-center py-1">
          {CIRCULAR_COLOR_SHADES.map((shade) => {
            const isSelected = currentColor.toLowerCase() === shade.hex.toLowerCase();
            return (
              <button
                key={shade.hex}
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleChooseColor(shade.hex);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChooseColor(shade.hex);
                }}
                title={shade.name}
                aria-label={shade.name}
                className={`w-7 h-7 rounded-full border border-black/15 flex items-center justify-center transition-all hover:scale-115 active:scale-95 cursor-pointer ${
                  isSelected ? 'ring-2 ring-offset-2 ring-neutral-900 shadow-md scale-110' : ''
                }`}
                style={{ backgroundColor: shade.hex }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Input & Deselect Button */}
      <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
        <label
          className="flex items-center gap-2 cursor-pointer text-xs text-ink-secondary hover:text-ink-primary select-none"
          title="Pick any custom color"
        >
          <input
            type="color"
            value={currentColor || '#132c53'}
            onChange={(e) => {
              handleChooseColor(e.target.value);
            }}
            className="w-5 h-5 rounded-full border border-neutral-300 p-0 cursor-pointer overflow-hidden bg-transparent"
          />
          <span className="text-[12px] font-medium">Custom Color</span>
        </label>

        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onDeselect();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDeselect();
          }}
          className="flex items-center gap-1 text-[11px] font-mono text-ink-muted hover:text-red-700 py-1 px-2 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Reset to default neutral theme"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Deselect</span>
        </button>
      </div>
    </div>
  );
};
