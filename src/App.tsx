import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { TopicStep } from './components/TopicStep';
import { ExplainStep } from './components/ExplainStep';
import { AnalysisStep } from './components/AnalysisStep';
import { ChallengeStep } from './components/ChallengeStep';
import { ReEvaluationStep } from './components/ReEvaluationStep';
import { HowItWorksPage } from './components/HowItWorksPage';
import { HistoryPage } from './components/HistoryPage';
import { AboutPage } from './components/AboutPage';
import { aiService } from './services/aiService';
import type {
  AppStep,
  ExplanationAnalysis,
  ChallengeEvaluation,
  SessionRecord,
} from './types';

const DEFAULT_THEME_COLOR = '#132c53'; // rgb(19, 44, 83)

export function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('hero');
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [analysis, setAnalysis] = useState<ExplanationAnalysis | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<ChallengeEvaluation | null>(null);

  // Loading & Error States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Theme color state (persisted, default rgb 19 44 83)
  const [navColor, setNavColor] = useState<string>(() => {
    const saved = localStorage.getItem('explainitback_nav_color');
    if (!saved || saved === '#e9e8e3') {
      return DEFAULT_THEME_COLOR;
    }
    return saved;
  });

  // History state
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Apply theme color CSS variables so text and UI synchronize
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', navColor);
  }, [navColor]);

  // Load history on mount
  useEffect(() => {
    aiService.getHistory().then(setHistory);
  }, []);

  const handleSelectColor = (color: string) => {
    setNavColor(color);
    localStorage.setItem('explainitback_nav_color', color);
  };

  const handleDeselectColor = () => {
    setNavColor(DEFAULT_THEME_COLOR);
    localStorage.removeItem('explainitback_nav_color');
  };

  // Step 1: User submits topic
  const handleTopicProceed = (chosenTopic: string) => {
    setTopic(chosenTopic);
    setExplanation('');
    setAnalysis(null);
    setChallengeAnswer('');
    setEvaluation(null);
    setCurrentSessionId(`session_${Date.now()}`);
    setCurrentStep('explain');
  };

  // Select a past topic from History to practice again
  const handleSelectTopicFromHistory = (topicName: string) => {
    setTopic(topicName);
    setExplanation('');
    setAnalysis(null);
    setChallengeAnswer('');
    setEvaluation(null);
    setCurrentSessionId(`session_${Date.now()}`);
    setCurrentStep('explain');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: User submits explanation -> AI Call 1
  const handleExplainSubmit = async (userExplanation: string) => {
    setExplanation(userExplanation);
    setIsAnalyzing(true);
    setApiError(null);

    const sessionId = currentSessionId || `session_${Date.now()}`;
    if (!currentSessionId) setCurrentSessionId(sessionId);

    try {
      const result = await aiService.analyzeExplanation(topic, userExplanation);
      setAnalysis(result);
      setCurrentStep('analysis');

      // Immediately save initial evaluation session to history
      const sessionRecord: SessionRecord = {
        id: sessionId,
        topic,
        date: new Date().toISOString(),
        initialUnderstanding: result.scores.overall,
        finalUnderstanding: result.scores.overall,
        improvement: 0,
        originalExplanation: userExplanation,
        analysis: result,
      };

      await aiService.saveSession(sessionRecord);
      const updatedHistory = await aiService.getHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setApiError(err?.message || 'Failed to analyze explanation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 3 -> Step 4: Proceed to targeted challenge
  const handleProceedToChallenge = () => {
    setCurrentStep('challenge');
  };

  // Step 4: User submits challenge answer -> AI Call 2
  const handleChallengeSubmit = async (answer: string) => {
    if (!analysis) return;
    setChallengeAnswer(answer);
    setIsEvaluating(true);
    setApiError(null);

    const sessionId = currentSessionId || `session_${Date.now()}`;

    try {
      const result = await aiService.evaluateChallenge({
        topic,
        originalExplanation: explanation,
        targetGap: analysis.challenge.target_gap,
        challengeQuestion: analysis.challenge.question,
        answer,
      });

      setEvaluation(result);
      setCurrentStep('reevaluation');

      // Save updated completed session to history
      const sessionRecord: SessionRecord = {
        id: sessionId,
        topic,
        date: new Date().toISOString(),
        initialUnderstanding: analysis.scores.overall,
        finalUnderstanding: result.score,
        improvement: result.score - analysis.scores.overall,
        originalExplanation: explanation,
        analysis,
        challengeAnswer: answer,
        evaluation: result,
      };

      await aiService.saveSession(sessionRecord);
      const updatedHistory = await aiService.getHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Challenge evaluation error:', err);
      setApiError(err?.message || 'Failed to evaluate challenge response.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Step 5: User chooses to re-explain original concept (completes loop)
  const handleReExplain = () => {
    setCurrentStep('explain');
  };

  // Session completion navigates to History Page
  const handleFinishSession = () => {
    setCurrentStep('history');
  };

  const handleClearHistory = async () => {
    await aiService.clearHistory();
    setHistory([]);
  };

  const activeThemeHex = navColor;

  return (
    <div className="min-h-screen bg-white text-ink-primary flex flex-col selection:bg-black selection:text-white font-sans">
      {/* Top Editorial Navigation */}
      <Navigation
        currentStep={currentStep}
        navColor={navColor}
        onNavigate={(step) => {
          setApiError(null);
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectColor={handleSelectColor}
        onDeselectColor={handleDeselectColor}
      />

      {/* Main Workflow & Pages Body */}
      <main className="flex-1 bg-white">
        {currentStep === 'hero' && (
          <Hero
            onStart={() => setCurrentStep('topic')}
            onSeeHowItWorks={() => setCurrentStep('how-it-works')}
            themeColor={activeThemeHex}
          />
        )}

        {currentStep === 'how-it-works' && (
          <HowItWorksPage
            onBack={() => setCurrentStep('hero')}
            onStart={() => setCurrentStep('topic')}
            themeColor={activeThemeHex}
          />
        )}

        {currentStep === 'history' && (
          <HistoryPage
            history={history}
            onBack={() => setCurrentStep('hero')}
            onStartNew={() => setCurrentStep('topic')}
            onSelectTopic={handleSelectTopicFromHistory}
            onClearHistory={handleClearHistory}
            themeColor={activeThemeHex}
          />
        )}

        {currentStep === 'about' && (
          <AboutPage
            onBack={() => setCurrentStep('hero')}
            onStart={() => setCurrentStep('topic')}
            themeColor={activeThemeHex}
          />
        )}

        {currentStep === 'topic' && (
          <TopicStep
            initialTopic={topic}
            onProceed={handleTopicProceed}
            themeColor={activeThemeHex}
          />
        )}

        {currentStep === 'explain' && (
          <ExplainStep
            topic={topic}
            initialExplanation={explanation}
            isAnalyzing={isAnalyzing}
            error={apiError}
            onSubmit={handleExplainSubmit}
            onBack={() => setCurrentStep('topic')}
          />
        )}

        {currentStep === 'analysis' && analysis && (
          <AnalysisStep
            topic={topic}
            originalExplanation={explanation}
            analysis={analysis}
            onProceedToChallenge={handleProceedToChallenge}
            onReviseExplanation={() => setCurrentStep('explain')}
          />
        )}

        {currentStep === 'challenge' && analysis && (
          <ChallengeStep
            topic={topic}
            originalExplanation={explanation}
            analysis={analysis}
            isEvaluating={isEvaluating}
            onSubmitAnswer={handleChallengeSubmit}
            onReExplain={handleReExplain}
            onBackToAnalysis={() => setCurrentStep('analysis')}
            onFinishSession={handleFinishSession}
          />
        )}

        {currentStep === 'reevaluation' && analysis && evaluation && (
          <ReEvaluationStep
            topic={topic}
            originalExplanation={explanation}
            challengeQuestion={analysis.challenge.question}
            challengeAnswer={challengeAnswer}
            analysis={analysis}
            evaluation={evaluation}
            onReExplain={handleReExplain}
            onFinishSession={handleFinishSession}
            onRetryChallenge={() => setCurrentStep('challenge')}
          />
        )}
      </main>

      {/* Subtle Editorial Footer (Centered Tagline & Clean About Link) */}
      <footer className="border-t border-editorial-borderSubtle py-8 px-6 sm:px-8 mt-auto bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-3 text-xs text-ink-muted text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span
              className="font-serif text-sm text-ink-primary font-medium"
              style={{ color: activeThemeHex }}
            >
              ExplainItBack
            </span>
            <span>—</span>
            <span>Don’t ask AI if you understand. Prove it.</span>
          </div>

          <div className="flex items-center justify-center text-xs font-sans pt-1">
            <button
              onClick={() => {
                setCurrentStep('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-ink-primary transition-colors underline underline-offset-4 cursor-pointer"
              style={{ color: activeThemeHex }}
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
