import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, Cpu } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [key, setKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    onKeyUpdated(trimmed);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fade-rise">
      <div className="bg-foundation-pure border border-editorial-border max-w-lg w-full flex flex-col rounded-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-editorial-borderSubtle">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-ink-primary" />
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink-primary">
              AI Provider Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink-primary transition-colors"
            aria-label="Close API Key Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="p-4 border border-editorial-borderSubtle bg-neutral-50/70 rounded-sm text-xs text-ink-secondary space-y-2">
            <div className="flex items-center gap-2 font-medium text-ink-primary">
              <Cpu className="w-3.5 h-3.5" />
              <span>Zero Configuration Required</span>
            </div>
            <p>
              ExplainItBack has a built-in semantic diagnostic engine that delivers realistic, high-fidelity reasoning evaluations out of the box.
            </p>
            <p>
              Optionally enter a Google Gemini API key below to route evaluations directly through live Gemini 2.5 Flash models.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-2">
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-foundation-pure border border-editorial-border focus:border-ink-primary px-3.5 py-2.5 font-mono text-xs text-ink-primary rounded-sm outline-none transition-colors"
            />
            <p className="text-[11px] text-ink-muted mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Stored locally on your machine or loaded via backend GEMINI_API_KEY environment variable.</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {key && (
              <button
                type="button"
                onClick={() => {
                  setKey('');
                  localStorage.removeItem('gemini_api_key');
                  onKeyUpdated('');
                }}
                className="text-xs text-ink-muted hover:text-red-700 transition-colors"
              >
                Clear Key
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-sans text-ink-secondary hover:text-ink-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-ink-primary text-foundation text-xs font-medium uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-neutral-800 transition-all"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? 'Saved' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
