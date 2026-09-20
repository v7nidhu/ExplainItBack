import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ArrowRight, AlertCircle } from 'lucide-react';

interface ExplainStepProps {
  topic: string;
  initialExplanation?: string;
  isAnalyzing: boolean;
  error?: string | null;
  onSubmit: (explanation: string) => void;
  onBack: () => void;
}

export const ExplainStep: React.FC<ExplainStepProps> = ({
  topic,
  initialExplanation = '',
  isAnalyzing,
  error,
  onSubmit,
  onBack,
}) => {
  const [text, setText] = useState(initialExplanation);

  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported] = useState(() => {
    return typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  });
  const recognitionRef = useRef<any>(null);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          setText((prev) => (prev ? prev + ' ' + transcript.trim() : transcript.trim()));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (words < 5 || isAnalyzing) return;
    onSubmit(text);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      {/* Editorial Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-editorial-borderSubtle">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors flex items-center gap-1"
          >
            ← Change Topic
          </button>
          <span className="text-ink-faint">/</span>
          <span className="text-xs font-mono tracking-widest uppercase text-ink-muted">
            Step 02 / Formulation
          </span>
        </div>

        {/* Current Target Topic display */}
        <div className="text-xs text-ink-secondary truncate max-w-md font-serif italic text-base">
          "{topic}"
        </div>
      </div>

      {/* Main Workspace Heading */}
      <div className="mb-6">
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ink-primary tracking-tight mb-2">
          Explain it in your own words.
        </h2>
        <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
          Imagine you're explaining this to someone who has never learned it. Avoid jargon without explaining it.
        </p>
      </div>

      {/* Error alert if API previously failed (preserving user's text) */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50/50 rounded text-xs text-red-800 flex items-start gap-2.5 animate-fade-rise">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Analysis request could not complete.</p>
            <p className="text-red-700 mt-0.5">{error}. Your explanation text is safely preserved below.</p>
          </div>
        </div>
      )}

      {/* Editorial Writing Workspace (Digital Whiteboard feel) */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative border border-editorial-border bg-foundation-pure rounded-sm p-6 sm:p-8 min-h-[360px] flex flex-col justify-between focus-within:border-ink-primary transition-colors">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Start from first principles. How does it begin? What happens next? What makes the result inevitable?"
            className="w-full h-64 sm:h-72 bg-transparent resize-none border-none outline-none font-sans text-base sm:text-lg text-ink-primary placeholder:text-ink-faint leading-relaxed"
            autoFocus
          />

          {/* Bottom Bar inside workspace */}
          <div className="flex items-center justify-between pt-4 border-t border-editorial-borderSubtle text-xs text-ink-muted font-mono">
            {/* Word Count & Voice Input Toggle */}
            <div className="flex items-center gap-4">
              <span>{words} {words === 1 ? 'word' : 'words'}</span>
              <span className="w-1 h-1 rounded-full bg-editorial-border" />
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded border transition-colors ${
                    isRecording
                      ? 'border-red-500 text-red-600 bg-red-50 animate-pulse'
                      : 'border-editorial-border hover:border-ink-primary text-ink-secondary'
                  }`}
                  title="Toggle Voice Dictation"
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Below Writing Surface */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-xs text-ink-muted flex items-center gap-2">
            <span>Minimum ~15 words recommended for an accurate evaluation</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {text.length > 0 && (
              <button
                type="button"
                onClick={() => setText('')}
                disabled={isAnalyzing}
                className="text-xs font-mono uppercase text-ink-muted hover:text-ink-primary px-3 py-3 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={words < 5 || isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-ink-primary text-foundation text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-foundation border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Explanation...</span>
                </>
              ) : (
                <>
                  <span>Evaluate my explanation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
