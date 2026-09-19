import React from 'react';
import { X, Clock, Trash2, ArrowRight } from 'lucide-react';
import type { SessionRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  history: SessionRecord[];
  onClose: () => void;
  onSelectSession: (session: SessionRecord) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onSelectSession,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fade-rise">
      <div className="bg-foundation-pure border border-editorial-border max-w-3xl w-full max-h-[85vh] flex flex-col rounded-sm shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-editorial-borderSubtle">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">
              Archive & History
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink-primary">
              Previous Explanations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink-primary transition-colors"
            aria-label="Close History"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List (Clean Editorial Rows) */}
        <div className="p-6 sm:p-8 overflow-y-auto divide-y divide-editorial-borderSubtle flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-ink-muted">
              <Clock className="w-8 h-8 mx-auto mb-3 stroke-1" />
              <p className="font-serif text-lg text-ink-primary">No previous sessions yet</p>
              <p className="text-xs text-ink-secondary mt-1 max-w-sm mx-auto">
                Test your understanding on any concept and your completed learning loops will be recorded here.
              </p>
            </div>
          ) : (
            history.map((record) => {
              const delta = record.improvement;
              return (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelectSession(record);
                    onClose();
                  }}
                  className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/80 -mx-4 px-4 rounded-sm transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="text-xs font-mono text-ink-muted">
                      {new Date(record.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <h4 className="font-serif text-lg sm:text-xl text-ink-primary group-hover:text-black transition-colors">
                      {record.topic}
                    </h4>
                  </div>

                  {/* Clean editorial score indicators */}
                  <div className="flex items-center gap-6 text-xs sm:text-sm font-sans">
                    <div className="text-right">
                      <span className="text-ink-muted block text-[11px] font-mono uppercase">Initial</span>
                      <span className="text-ink-secondary font-medium">{record.initialUnderstanding}%</span>
                    </div>

                    <div className="text-right">
                      <span className="text-ink-muted block text-[11px] font-mono uppercase">Final</span>
                      <span className="text-ink-primary font-semibold">{record.finalUnderstanding}%</span>
                    </div>

                    <div className="text-right min-w-[50px]">
                      <span className="text-ink-muted block text-[11px] font-mono uppercase">Delta</span>
                      <span className="font-mono font-medium text-ink-primary flex items-center justify-end">
                        {delta >= 0 ? `+${delta}` : delta}%
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-editorial-borderSubtle bg-neutral-50/50 flex justify-between items-center text-xs">
            <span className="text-ink-muted font-mono">{history.length} recorded {history.length === 1 ? 'session' : 'sessions'}</span>
            <button
              onClick={onClearHistory}
              className="text-ink-muted hover:text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
