import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  Trash2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import type { SessionRecord } from '../types';

interface HistoryPageProps {
  history: SessionRecord[];
  onBack: () => void;
  onStartNew: () => void;
  onSelectTopic?: (topic: string) => void;
  onClearHistory: () => void;
  themeColor?: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onBack,
  onStartNew,
  onSelectTopic,
  onClearHistory,
  themeColor,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedSessionId((prev) => (prev === id ? null : id));
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase().trim();
    return history.filter((record) => {
      const matchTopic = record.topic.toLowerCase().includes(query);
      const matchExplanation = record.originalExplanation.toLowerCase().includes(query);
      const matchUnderstood = record.analysis?.understood?.some((item) =>
        item.toLowerCase().includes(query)
      );
      const matchMissing = record.analysis?.missing?.some((item) =>
        item.toLowerCase().includes(query)
      );
      return matchTopic || matchExplanation || matchUnderstood || matchMissing;
    });
  }, [history, searchQuery]);

  // Unique topics covered
  const uniqueTopics = useMemo(() => {
    const set = new Set<string>();
    history.forEach((h) => set.add(h.topic));
    return Array.from(set);
  }, [history]);

  return (
    <div className="min-h-[calc(100vh-140px)] max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16 animate-fade-rise">
      {/* Back Button and Action Controls */}
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-primary transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-mono text-ink-muted hover:text-red-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear all stored session records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Header with Sessions and Topics Covered Summary */}
      <div className="border-b border-editorial-borderSubtle pb-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-2">
            Archive & Knowledge Log
          </span>
          <h1
            className="font-serif text-4xl sm:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1] mb-2"
            style={{ color: themeColor || undefined }}
          >
            Explanation History
          </h1>
          <p className="font-sans text-base text-ink-secondary max-w-xl">
            A permanent archive of all topics covered, diagnostic gap evaluations, and reasoning progress.
          </p>
        </div>

        {/* Dual Stat Metrics */}
        <div className="shrink-0 flex items-center gap-3">
          <div className="p-4 bg-foundation-pure border border-editorial-border rounded-sm shadow-2xs min-w-[130px] text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block mb-1">
              Topics Covered
            </span>
            <span className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
              {uniqueTopics.length}
            </span>
          </div>
          <div className="p-4 bg-foundation-pure border border-editorial-border rounded-sm shadow-2xs min-w-[130px] text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block mb-1">
              Total Sessions
            </span>
            <span className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
              {history.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      {history.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past topics, explanations, or concepts..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-foundation-pure border border-editorial-border rounded-sm focus:outline-none focus:border-ink-primary transition-colors font-sans text-ink-primary placeholder:text-ink-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-ink-muted hover:text-ink-primary"
              >
                Clear
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="text-xs font-mono text-ink-muted self-center">
              Showing {filteredHistory.length} of {history.length}
            </div>
          )}
        </div>
      )}

      {/* Session Records List */}
      <div className="space-y-4 mb-14">
        {history.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-editorial-border rounded-sm bg-neutral-50/50">
            <Clock className="w-10 h-10 mx-auto mb-4 text-ink-muted stroke-1" />
            <h3 className="font-serif text-2xl text-ink-primary font-normal mb-2">
              No sessions recorded yet
            </h3>
            <p className="text-sm text-ink-secondary max-w-md mx-auto mb-8 leading-relaxed">
              When you explain any concept and undergo diagnostic gap analysis, your recorded topics, scores, and change noted will appear here.
            </p>
            <button
              onClick={onStartNew}
              style={{ backgroundColor: themeColor || undefined }}
              className="inline-flex items-center gap-2 bg-ink-primary text-foundation text-xs uppercase tracking-wider font-medium px-6 py-3.5 rounded-sm hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              <span>Start first explanation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-14 text-center border border-dashed border-editorial-border rounded-sm bg-neutral-50/50">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-ink-muted stroke-1" />
            <p className="font-serif text-xl text-ink-primary mb-1">No matching topics found</p>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto mb-4">
              No previous explanation matches &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono uppercase tracking-wider underline text-ink-primary hover:opacity-80"
            >
              Reset search filter
            </button>
          </div>
        ) : (
          filteredHistory.map((record) => {
            const isExpanded = expandedSessionId === record.id;
            const delta = record.improvement;

            return (
              <div
                key={record.id}
                className="border border-editorial-borderSubtle bg-foundation-pure rounded-sm hover:border-editorial-border transition-all overflow-hidden shadow-2xs"
              >
                {/* Row Header */}
                <div
                  onClick={() => toggleExpand(record.id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-ink-muted block">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {record.evaluation && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Evaluated
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-ink-primary group-hover:text-black transition-colors">
                      {record.topic}
                    </h3>
                  </div>

                  {/* Score Badges & Controls */}
                  <div className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm font-sans">
                    <div className="text-right">
                      <span className="text-ink-muted block text-[10px] font-mono uppercase tracking-wider">
                        Initial
                      </span>
                      <span className="text-ink-secondary font-medium">
                        {record.initialUnderstanding}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-ink-muted block text-[10px] font-mono uppercase tracking-wider">
                        Final
                      </span>
                      <span className="text-ink-primary font-semibold">
                        {record.finalUnderstanding}%
                      </span>
                    </div>

                    <div className="text-right min-w-[65px]">
                      <span className="text-ink-muted block text-[10px] font-mono uppercase tracking-wider whitespace-nowrap">
                        Change Noted
                      </span>
                      <span
                        className="font-mono font-medium text-sm flex items-center justify-end"
                        style={{ color: themeColor || undefined }}
                      >
                        {delta >= 0 ? `+${delta}` : delta}%
                      </span>
                    </div>

                    <div className="text-ink-muted group-hover:text-ink-primary transition-colors pl-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-editorial-borderSubtle bg-neutral-50/40 space-y-5 animate-fade-rise">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-1">
                        Original Explanation
                      </span>
                      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed bg-white p-4 border border-editorial-borderSubtle rounded-sm font-sans whitespace-pre-line">
                        &ldquo;{record.originalExplanation}&rdquo;
                      </p>
                    </div>

                    {record.analysis && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-editorial-borderSubtle rounded-sm">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-primary block mb-2 font-medium">
                            Concepts Understood
                          </span>
                          <ul className="space-y-1.5 text-xs text-ink-secondary">
                            {record.analysis.understood.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-ink-primary mt-0.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-white border border-editorial-borderSubtle rounded-sm">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-primary block mb-2 font-medium">
                            Identified Gaps
                          </span>
                          <ul className="space-y-1.5 text-xs text-ink-secondary">
                            {record.analysis.missing.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-1.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {record.analysis?.challenge?.question && (
                      <div className="p-4 bg-white border border-editorial-borderSubtle rounded-sm">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-1">
                          Targeted Challenge Question
                        </span>
                        <p className="text-xs sm:text-sm text-ink-primary font-serif italic mb-3">
                          &ldquo;{record.analysis.challenge.question}&rdquo;
                        </p>
                        {record.challengeAnswer && (
                          <div className="pt-3 border-t border-editorial-borderSubtle">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-1">
                              Your Resolution
                            </span>
                            <p className="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
                              {record.challengeAnswer}
                            </p>
                          </div>
                        )}
                        {record.evaluation && (
                          <div className="mt-3 pt-3 border-t border-editorial-borderSubtle">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-1">
                              Diagnostic Feedback
                            </span>
                            <p className="text-xs text-ink-secondary font-sans leading-relaxed">
                              {record.evaluation.feedback || record.evaluation.what_improved}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Bar for This Topic */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      {onSelectTopic && (
                        <button
                          type="button"
                          onClick={() => onSelectTopic(record.topic)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-3.5 py-2 border border-editorial-border rounded-sm hover:bg-white transition-colors cursor-pointer text-ink-primary"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Practice this topic again</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom CTA */}
      {history.length > 0 && (
        <div className="pt-8 border-t border-editorial-borderSubtle flex justify-end">
          <button
            onClick={onStartNew}
            style={{ backgroundColor: themeColor || undefined }}
            className="inline-flex items-center gap-2 bg-ink-primary text-foundation text-xs uppercase tracking-wider font-medium px-6 py-3.5 rounded-sm hover:opacity-90 transition-all shadow-sm cursor-pointer"
          >
            <span>Test another concept</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

