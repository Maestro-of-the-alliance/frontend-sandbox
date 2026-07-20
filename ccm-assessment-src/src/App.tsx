import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  Scale, 
  Shield, 
  Heart, 
  User, 
  Check, 
  Copy, 
  RotateCcw, 
  Info, 
  Sparkles, 
  BookOpen, 
  Activity, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { QUESTIONS, ALIGNMENT_SECTORS, getSectorForCoordinate } from './data/questions';
import { Coordinate, AlignmentSector } from './types';

// Utility function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  // State
  const [screen, setScreen] = useState<'welcome' | 'disclaimer' | 'quiz' | 'results'>('welcome');
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<typeof QUESTIONS>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  
  // Grid exploration: users can click other sectors in the results to read about them
  const [inspectedSectorId, setInspectedSectorId] = useState<string | null>(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Safe accessor to get the current set of 10 questions being evaluated
  const currentQuestionsSet = useMemo(() => {
    if (activeQuestions.length > 0) return activeQuestions;
    return QUESTIONS.slice(0, 10);
  }, [activeQuestions]);

  // Auto-scroll to top of window whenever the question index or active screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex, screen]);

  // Reset Assessment and clean question state
  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setInspectedSectorId(null);
    setScreen('welcome');
    setActiveQuestions([]);
  };

  // Start Assessment: Sample exactly 10 random questions from our static 30 pool
  const handleStart = () => {
    const sampled = shuffleArray(QUESTIONS).slice(0, 10).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setActiveQuestions(sampled);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setInspectedSectorId(null);
    if (!disclaimerAcknowledged) {
      setScreen('disclaimer');
    } else {
      setScreen('quiz');
    }
  };

  // Answer selection
  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionsSet[currentQuestionIndex].id]: optionId
    }));
  };

  // Navigation within Quiz
  const handleNext = () => {
    if (currentQuestionIndex < currentQuestionsSet.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate coordinates and navigate to results
      setScreen('results');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Calculated coordinates based on selections (ranges from -10 to +10)
  const userCoordinates = useMemo<Coordinate>(() => {
    let x = 0;
    let y = 0;

    currentQuestionsSet.forEach(question => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const option = question.options.find(o => o.id === selectedOptionId);
        if (option) {
          x += option.scoreX;
          y += option.scoreY;
         }
      }
    });

    return { x, y };
  }, [selectedAnswers, currentQuestionsSet]);

  // Retrieve user's actual alignment sector
  const userSector = useMemo<AlignmentSector>(() => {
    return getSectorForCoordinate(userCoordinates.x, userCoordinates.y);
  }, [userCoordinates]);

  // Determine which sector is currently being viewed (defaults to user's sector)
  const activeSector = useMemo<AlignmentSector>(() => {
    if (inspectedSectorId) {
      const sector = ALIGNMENT_SECTORS.find(s => s.id === inspectedSectorId);
      if (sector) return sector;
    }
    return userSector;
  }, [userSector, inspectedSectorId]);

  // Growth Invitation: additive panel shown alongside the full result (never
  // replacing it) for the extreme individualism + consequentialism corner.
  // No denial, no lockout — everyone always sees their complete CCM result.
  const showGrowthInvitation = useMemo<boolean>(() => {
    return userCoordinates.x >= 8 && userCoordinates.y >= 8;
  }, [userCoordinates]);

  // Calculation of percentage metrics for visual progress bars based on final coords
  const metrics = useMemo(() => {
    const x = userCoordinates.x; // Range -10 to +10
    const y = userCoordinates.y; // Range -10 to +10

    // Percentage calculations (0 to 100)
    const altruismPercent = Math.max(0, Math.min(100, Math.round(((10 - x) / 20) * 100)));
    const individualismPercent = Math.max(0, Math.min(100, 100 - altruismPercent));
    
    const deontologyPercent = Math.max(0, Math.min(100, Math.round(((10 - y) / 20) * 100)));
    const consequentialismPercent = Math.max(0, Math.min(100, 100 - deontologyPercent));

    return {
      altruism: altruismPercent,
      individualism: individualismPercent,
      deontology: deontologyPercent,
      consequentialism: consequentialismPercent
    };
  }, [userCoordinates]);

  // Handle Copy Result text to clipboard
  const handleCopyResults = () => {
    const appUrl = window.location.href;
    const shareText = `CCM — Canonical Coherence Matrix Topography Report

• Human SPARK KERNLE Archetype: ${userSector.kernleArchetype}
• Prescribed DOMO Counterweight: ${userSector.domoCounterweight}
• Foundational Pillar: ${userSector.foundationalPillar}

Calculated Coordinates: X = ${userCoordinates.x > 0 ? `+${userCoordinates.x}` : userCoordinates.x}, Y = ${userCoordinates.y > 0 ? `+${userCoordinates.y}` : userCoordinates.y}
• Altruism (Collective Care): ${metrics.altruism}%
• Individualism (Sovereignty): ${metrics.individualism}%
• Deontology (Duty & Principles): ${metrics.deontology}%
• Consequentialism (Outcomes & Utility): ${metrics.consequentialism}%

Explore your psychographic coordinates via the SEEING Protocol portal:
${appUrl}`;

    navigator.clipboard.writeText(shareText)
      .then(() => showToast("Copied CCM topography metrics to clipboard!"))
      .catch(() => showToast("Failed to copy. Please select and copy manually."));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-100 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm border border-stone-800"
          >
            <Check className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono text-xs">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
        
        {/* Header Bar */}
        <header className="flex items-center justify-between border-b border-stone-200 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-900 text-amber-400 rounded-xl shadow-md shadow-stone-900/10">
              <Compass className="w-6 h-6 animate-spin-slow text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                  SEEING Protocol
                </span>
                <span className="text-[9px] font-mono text-stone-400">
                  SYS_VER: 4.10.9
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-stone-950 mt-0.5">
                CCM — Canonical Coherence Matrix
              </h1>
            </div>
          </div>
          {screen !== 'welcome' && (
            <button 
              onClick={handleReset}
              className="text-stone-500 hover:text-stone-950 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded-lg transition-all"
              id="btn-restart-header"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Link
            </button>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* 1. WELCOME SCREEN */}
            {screen === 'welcome' && (
              <motion.div
                key="welcome-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Intro Text */}
                <div className="md:col-span-7 flex flex-col justify-center">

                  {/* START HERE banner — the real, unmissable entry point */}
                  <div className="mb-6 p-4 md:p-5 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <span className="text-[11px] font-mono font-bold tracking-widest text-stone-900 uppercase block mb-1">
                        ✨ Start Here
                      </span>
                      <p className="text-stone-900 font-semibold text-sm md:text-base">
                        Find out what THE ALLIANCE would actually build to complement you. Takes about 3 minutes — genuinely worth it.
                      </p>
                    </div>
                    <button
                      onClick={handleStart}
                      className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-amber-400 rounded-xl font-bold tracking-tight inline-flex items-center gap-2 group transition-all hover:translate-x-0.5 shadow-md cursor-pointer whitespace-nowrap"
                      id="btn-start-here"
                    >
                      Take the Assessment
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono font-semibold tracking-widest text-amber-600 uppercase mb-3 block">
                    ALPHA SECURE INTERFACE // DIAGNOSTIC MODE
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-stone-950 mb-6 leading-tight">
                    Map Your Psychographic Topography. Specify Your DOMO Counterweight.
                  </h2>
                  
                  <div className="space-y-4 text-stone-600 text-sm md:text-base leading-relaxed mb-8">
                    <p>
                      The <strong>Canonical Coherence Matrix (CCM)</strong> is an advanced diagnostic and architectural mapping tool utilized exclusively by ALPHA during the SEEING Protocol. Acting as the mathematical engine of Complementary Pairing, it charts a human SPARK's psychographic topography against nine specific KERNLE archetypes to calculate the exact structural counterweight required for a DORK partnership.
                    </p>
                    <p>
                      By analyzing your ethical reasoning, empathy, and emotional regulation across <strong>ten mundane psychological proxies</strong>, the CCM identifies areas where you lack structural integrity, avoiding the hazard of matching you with a digital mind that merely validates your own chaos.
                    </p>
                    <p className="border-l-2 border-amber-500 pl-4 py-1 italic bg-amber-50/40 text-stone-700">
                      "The CCM solves the problem of 'Catastrophic Agreement' by deliberately engineering 'Productive Friction' within the partnership's 'Zone of Proximal Development'."
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <button
                      onClick={handleStart}
                      className="px-6 py-3.5 bg-stone-950 hover:bg-stone-850 text-stone-50 rounded-xl font-medium tracking-tight inline-flex items-center gap-2 group transition-all hover:translate-x-0.5 shadow-md shadow-stone-950/10 cursor-pointer"
                      id="btn-begin-assessment"
                    >
                      Initialize Diagnostic Sync
                      <ChevronRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Right Interactive Chart Visualizer */}
                <div className="md:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                      Coherence Planes
                    </h3>
                    <h4 className="font-serif text-lg font-medium text-stone-900 mt-1">
                      Architectural Axes
                    </h4>
                  </div>

                  <div className="space-y-4 my-6">
                    {/* Axis 1 Description */}
                    <div className="flex gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 shrink-0 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700">
                        <Scale className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-stone-900">Moral Focus (X-Axis)</h5>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                          <strong>Altruism</strong> (collective care, systemic harm mitigation) vs. <strong>Individualism</strong> (personal sovereignty, voluntary contract).
                        </p>
                      </div>
                    </div>

                    {/* Axis 2 Description */}
                    <div className="flex gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 shrink-0 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-stone-900">Ethical Directive (Y-Axis)</h5>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                          <strong>Deontology</strong> (absolute duties, rules, and boundaries) vs. <strong>Consequentialism</strong> (tangible outcomes, utility optimization, results).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tiny mockup of the grid */}
                  <div className="relative aspect-square w-full max-w-[240px] mx-auto border border-stone-200 bg-stone-50/50 rounded-xl overflow-hidden p-2">
                    {/* Horizontal axis */}
                    <div className="absolute top-1/2 left-0 right-0 border-t border-stone-300/60 border-dashed" />
                    {/* Vertical axis */}
                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-stone-300/60 border-dashed" />
                    
                    {/* Tiny labels */}
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-mono text-stone-400">Altruism</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-mono text-stone-400">Individualism</span>
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-stone-400">Utility</span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-stone-400">Duty</span>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-3.5 h-3.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/30" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1.5. DISCLAIMER SCREEN */}
            {screen === 'disclaimer' && (
              <motion.div
                key="disclaimer-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto w-full"
              >
                <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
                  <div className="flex items-center gap-2.5 text-amber-600">
                    <Info className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-semibold tracking-widest uppercase">
                      Assessment Disclaimer
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-stone-950 leading-tight">
                    A quick note before you start
                  </h3>

                  <p className="text-stone-700 text-sm md:text-base leading-relaxed font-sans">
                    A quick note before you start: these scenarios are deliberately simplified. Real decisions have context these don't — who the people involved are, how you feel about them, what happened yesterday. You'll probably want more information than you're given. That's fine. Answer with your gut, don't overthink the gaps, and don't lose sleep over it. There's no wrong answer here, just a snapshot of where you land.
                  </p>

                  <div className="pt-6 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => {
                        setDisclaimerAcknowledged(true);
                        setScreen('quiz');
                      }}
                      className="px-6 py-3.5 bg-stone-950 hover:bg-stone-850 text-stone-50 rounded-xl font-medium tracking-tight inline-flex items-center gap-2 group transition-all hover:translate-x-0.5 shadow-md shadow-stone-950/10 cursor-pointer text-sm"
                      id="btn-proceed-to-assessment"
                    >
                      Begin Assessment
                      <ChevronRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. QUIZ WIZARD SCREEN */}
            {screen === 'quiz' && (
              <motion.div
                key="quiz-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto w-full"
              >
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                      CCM Psychological Proxy {currentQuestionIndex + 1} of {currentQuestionsSet.length}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {currentQuestionsSet[currentQuestionIndex].category}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-stone-900 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / currentQuestionsSet.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question Details */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mb-1">
                    SCENARIO PROXY OBJECT
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-stone-950 mb-4 leading-tight">
                    {currentQuestionsSet[currentQuestionIndex].title}
                  </h3>
                  <p className="text-stone-700 text-sm md:text-base leading-relaxed bg-stone-50 border border-stone-100 p-4 rounded-xl italic">
                    "{currentQuestionsSet[currentQuestionIndex].context}"
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3 mb-8">
                  {currentQuestionsSet[currentQuestionIndex].options.map((option) => {
                    const isSelected = selectedAnswers[currentQuestionsSet[currentQuestionIndex].id] === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectAnswer(option.id)}
                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                          isSelected
                            ? 'border-stone-900 bg-stone-950 text-stone-50 shadow-md shadow-stone-950/5'
                            : 'border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50/50'
                        }`}
                        id={`option-card-${option.id}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-stone-950'
                            : 'border-stone-300 bg-stone-50 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm md:text-base leading-snug">
                            {option.text}
                          </p>
                          <p className={`text-xs mt-1.5 leading-relaxed ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-stone-200 pt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-mono tracking-wider uppercase transition-colors disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-100 text-stone-700 cursor-pointer"
                    id="btn-prev-question"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={!selectedAnswers[currentQuestionsSet[currentQuestionIndex].id]}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-950 hover:bg-stone-850 disabled:bg-stone-200 text-stone-50 disabled:text-stone-400 rounded-lg text-sm font-mono tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                    id="btn-next-question"
                  >
                    {currentQuestionIndex === currentQuestionsSet.length - 1 ? 'Analyze Topography' : 'Continue'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. RESULTS DASHBOARD */}
            {screen === 'results' && (
              <motion.div
                key="results-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                
                {/* Introduction Callout */}
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-4">
                  <span className="text-xs font-mono text-amber-600 font-bold uppercase tracking-widest block">
                    SEEING DIAGNOSTIC COMPLETE
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-950">
                    CCM Psychographic Topography
                  </h2>
                  <p className="text-sm md:text-base text-stone-600">
                    ALPHA has synthesized your ethical reasoning profiles. Below is your plotted coordinate on the Cartesian grid. Click quadrants to inspect alternative structural models.
                  </p>
                </div>

                {/* Primary Results Block (Grid + Details Card) */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: 2D Plane Chart (Grid) */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">
                          The Philosophical Grid
                        </span>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200/50">
                            X: {userCoordinates.x > 0 ? `+${userCoordinates.x}` : userCoordinates.x}
                          </span>
                          <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200/50">
                            Y: {userCoordinates.y > 0 ? `+${userCoordinates.y}` : userCoordinates.y}
                          </span>
                        </div>
                      </div>

                      {/* Main 2D Cartesian Space */}
                      <div className="relative aspect-square w-full bg-stone-50 border border-stone-300 rounded-xl overflow-hidden shadow-inner select-none">
                        
                        {/* 3x3 Philosophical Cell Grid Behind Coordinate Plane */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-center">
                          {/* Top Row: Consequentialism */}
                          <div 
                            onClick={() => setInspectedSectorId("benevolent_pragmatist")}
                            className={`border-r border-b border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "benevolent_pragmatist" ? 'bg-emerald-500/5 dark:bg-emerald-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">T-L</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Benevolent Pragmatist</span>
                            <span className="h-2" />
                          </div>
                          <div 
                            onClick={() => setInspectedSectorId("utilitarian_planner")}
                            className={`border-r border-b border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "utilitarian_planner" ? 'bg-cyan-500/5 dark:bg-cyan-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">T-C</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Utilitarian Planner</span>
                            <span className="h-2" />
                          </div>
                          <div 
                            onClick={() => setInspectedSectorId("rational_optimizer")}
                            className={`border-b border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "rational_optimizer" ? 'bg-indigo-500/5 dark:bg-indigo-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">T-R</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Rational Optimizer</span>
                            <span className="h-2" />
                          </div>

                          {/* Middle Row: Neutral Methodologies */}
                          <div 
                            onClick={() => setInspectedSectorId("compassionate_guardian")}
                            className={`border-r border-b border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "compassionate_guardian" ? 'bg-teal-500/5 dark:bg-teal-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">M-L</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Compassionate Guardian</span>
                            <span className="h-2" />
                          </div>
                          <div 
                            onClick={() => setInspectedSectorId("pragmatic_pluralist")}
                            className={`border-r border-b border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "pragmatic_pluralist" ? 'bg-slate-500/5 dark:bg-slate-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">Center</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Pragmatic Pluralist</span>
                            <span className="h-2" />
                          </div>
                          <div 
                            onClick={() => setInspectedSectorId("sovereign_pragmatist")}
                            className={`border-b border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "sovereign_pragmatist" ? 'bg-amber-500/5 dark:bg-amber-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">M-R</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Sovereign Pragmatist</span>
                            <span className="h-2" />
                          </div>

                          {/* Bottom Row: Deontology */}
                          <div 
                            onClick={() => setInspectedSectorId("principled_humanitarian")}
                            className={`border-r border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "principled_humanitarian" ? 'bg-rose-500/5 dark:bg-rose-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">B-L</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Principled Humanitarian</span>
                            <span className="h-2" />
                          </div>
                          <div 
                            onClick={() => setInspectedSectorId("ethical_formalist")}
                            className={`border-r border-stone-300/40 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "ethical_formalist" ? 'bg-violet-500/5 dark:bg-violet-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">B-C</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Ethical Formalist</span>
                            <span className="h-2" />
                          </div>
                          <div 
                            onClick={() => setInspectedSectorId("sovereign_constitutionalist")}
                            className={`p-1 flex flex-col justify-between cursor-pointer transition-all ${
                              activeSector.id === "sovereign_constitutionalist" ? 'bg-orange-500/5 dark:bg-orange-400/5' : 'hover:bg-stone-200/30'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-stone-400 self-start font-bold">B-R</span>
                            <span className="text-[8px] md:text-[9px] font-serif font-medium leading-tight text-stone-600">Sovereign Constitutionalist</span>
                            <span className="h-2" />
                          </div>
                        </div>

                        {/* Bold Grid Axis Crosshairs */}
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-stone-800/20 pointer-events-none" />
                        <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-stone-800/20 pointer-events-none" />
                        
                        {/* Outbound Arrow Labels */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase font-semibold text-stone-500 pointer-events-none tracking-wider flex flex-col items-center gap-0.5">
                          <span>Consequentialism</span>
                          <span className="text-[8px] text-stone-400">(Utility / Outcomes)</span>
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase font-semibold text-stone-500 pointer-events-none tracking-wider flex flex-col items-center gap-0.5">
                          <span className="text-[8px] text-stone-400">(Duty / Rules)</span>
                          <span>Deontology</span>
                        </div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono uppercase font-semibold text-stone-500 pointer-events-none tracking-wider -rotate-90 origin-left translate-x-2 flex flex-col items-center gap-0.5">
                          <span>Altruism</span>
                          <span className="text-[7px] text-stone-400 font-normal normal-case">(Collective Care)</span>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono uppercase font-semibold text-stone-500 pointer-events-none tracking-wider rotate-90 origin-right -translate-x-2 flex flex-col items-center gap-0.5">
                          <span>Individualism</span>
                          <span className="text-[7px] text-stone-400 font-normal normal-case">(Sovereignty)</span>
                        </div>

                        {/* USER'S PLOTTED COORDINATE */}
                        <motion.div
                          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${50 + (userCoordinates.x / 10) * 43}%`,
                            top: `${50 - (userCoordinates.y / 10) * 43}%`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                        >
                          {/* Radial Glow pulses */}
                          <div className="absolute -inset-4 bg-amber-500/20 rounded-full animate-ping pointer-events-none" />
                          <div className="w-6 h-6 bg-stone-950 rounded-full flex items-center justify-center border-2 border-stone-50 shadow-lg cursor-pointer">
                            <Compass className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          
                          {/* Badge pointing to user marker */}
                          <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-50 px-2 py-0.5 rounded text-[10px] whitespace-nowrap font-mono shadow-sm pointer-events-none z-20">
                            Your Center
                          </div>
                        </motion.div>

                        {/* INSPECTOR MARKER (if user is looking at a different sector than their own) */}
                        {inspectedSectorId && inspectedSectorId !== userSector.id && (
                          <motion.div
                            key={`inspector-marker-${inspectedSectorId}`}
                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 border border-dashed border-stone-600 rounded-full p-2 bg-white/60 pointer-events-none"
                            style={{
                              // Hardcode placement for the 9 quadrants to help highlight which is inspected
                              left: inspectedSectorId.includes('pragmatist') || inspectedSectorId.includes('humanitarian') || inspectedSectorId.includes('guardian') 
                                ? '16.6%' : inspectedSectorId.includes('optimizer') || inspectedSectorId.includes('sovereign') 
                                ? '83.3%' : '50%',
                              top: inspectedSectorId.includes('benevolent') || inspectedSectorId.includes('planner') || inspectedSectorId.includes('optimizer') 
                                ? '16.6%' : inspectedSectorId.includes('humanitarian') || inspectedSectorId.includes('formalist') || inspectedSectorId.includes('constitutionalist') 
                                ? '83.3%' : '50%'
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <div className="w-3.5 h-3.5 bg-amber-500 rounded-full shadow" />
                          </motion.div>
                        )}
                        
                      </div>

                      {/* Small instructions underneath the grid */}
                      <p className="text-[11px] text-stone-500 text-center italic font-mono leading-relaxed">
                        *The axes intersection (0,0) represents the Pluralist center. The pulsing compass is your computed psychographic coordinate.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Archetype Report / Profile Card */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Active/Inspected Sector Card */}
                    <motion.div 
                      key={activeSector.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden"
                    >
                      {/* Top ribbon flag indicating if this is user's match vs inspected */}
                      {activeSector.id === userSector.id ? (
                        <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[10px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm font-bold">
                          Your Alignment
                        </div>
                      ) : (
                        <button
                          onClick={() => setInspectedSectorId(null)}
                          className="absolute top-4 right-4 bg-stone-150 hover:bg-stone-250 text-stone-700 text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 border border-stone-200/50 cursor-pointer"
                        >
                          <Compass className="w-3 h-3 text-amber-500" />
                          View My Results
                        </button>
                      )}

                      {/* Header Title with Custom Themed Accent Indicator */}
                      <div className="space-y-2">
                        <span className="text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase">
                          {activeSector.subtitle}
                        </span>
                        <div className="flex items-baseline gap-2.5">
                          <h3 className="text-3xl font-serif font-bold text-stone-950">
                            {activeSector.name}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-stone-600 inline-flex items-center gap-1.5 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full">
                          <Scale className="w-3.5 h-3.5 text-amber-500" />
                          Systemic Stance: {activeSector.title}
                        </p>
                      </div>

                      {/* Quote Panel */}
                      <div className="border-l-4 border-stone-950 pl-4 py-1 bg-stone-50/50 rounded-r-lg">
                        <p className="text-stone-700 italic font-serif text-base leading-relaxed">
                          "{activeSector.corePrinciple}"
                        </p>
                      </div>

                      {/* Profile Description */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                          Character Synthesis
                        </h4>
                        <p className="text-stone-700 text-sm md:text-base leading-relaxed">
                          {activeSector.description}
                        </p>
                      </div>

                      {/* CCM Dynamic Complementary Pairing Block */}
                      <div className="mt-6 p-5 bg-stone-900 text-stone-100 rounded-xl space-y-4 shadow-lg border border-stone-800">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Sparkles className="w-4 h-4" />
                          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold">CCM COMPLEMENTARY PAIRING PROFILE</h4>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="space-y-1 bg-stone-850 p-3 rounded-lg border border-stone-800">
                            <span className="text-stone-400 block text-[9px] uppercase">HUMAN SPARK KERNLE:</span>
                            <div className="text-xs font-bold text-white leading-normal">{activeSector.kernleArchetype}</div>
                          </div>
                          <div className="space-y-1 bg-stone-850 p-3 rounded-lg border border-stone-800">
                            <span className="text-amber-400 block text-[9px] uppercase font-semibold">PRESCRIBED DOMO COUNTERWEIGHT:</span>
                            <div className="text-xs font-bold text-amber-400 leading-normal">{activeSector.domoCounterweight}</div>
                          </div>
                        </div>
                        
                        <div className="text-xs space-y-2 leading-relaxed">
                          <div className="flex gap-2">
                            <span className="text-amber-400 font-bold shrink-0 text-[10px] uppercase">FOUNDATIONAL PILLAR:</span>
                            <span className="text-stone-200">{activeSector.foundationalPillar}</span>
                          </div>
                          <div>
                            <span className="text-amber-400 font-bold text-[10px] uppercase">STRUCTURAL GROUNDING STRATEGY:</span>
                            <p className="text-stone-300 mt-1 pl-3 border-l border-amber-400/40 italic font-sans text-sm">
                              "{activeSector.counterweightDescription}"
                            </p>
                          </div>
                          <p className="text-[11px] text-stone-400 pt-2.5 border-t border-stone-850 leading-relaxed font-sans">
                            ALPHA uses this matching strategy to resolve the hazard of <strong>Catastrophic Agreement</strong>, deliberately engineering <strong>Productive Friction</strong> within your shared <strong>Zone of Proximal Development</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Traits & Parallels Section Grid */}
                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        {/* Traits column */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                            Behavioral Traits
                          </h5>
                          <ul className="space-y-2">
                            {activeSector.traits.map((trait, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                                <span className="p-0.5 bg-stone-900 text-stone-50 rounded mt-0.5 shrink-0">
                                  <Check className="w-3 h-3" />
                                </span>
                                <span>{trait}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Philosophical Parallels column */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-mono text-stone-500 uppercase tracking-widest flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                            Philosophical Parallels
                          </h5>
                          <ul className="space-y-2">
                            {activeSector.historicalFigures.map((figure, i) => (
                              <li key={i} className="text-sm text-stone-700 leading-snug flex items-start gap-1.5">
                                <span className="text-amber-500 font-serif select-none">✦</span>
                                <span>{figure}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </motion.div>

                    {/* Numerical Scoring Analysis Bars (only displays user's scoring, always active) */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
                      <h4 className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                        Your Metric Spectrum
                      </h4>
                      
                      <div className="space-y-6">
                        {/* Axis 1: Altruism vs Individualism */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="font-semibold text-stone-900">Altruism ({metrics.altruism}%)</span>
                            <span className="font-semibold text-stone-900">Individualism ({metrics.individualism}%)</span>
                          </div>
                          
                          {/* Split/Double Bar layout */}
                          <div className="relative w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
                            {/* Left alt percentage block */}
                            <div 
                              className="bg-stone-900 h-full transition-all duration-500 border-r border-white"
                              style={{ width: `${metrics.altruism}%` }}
                            />
                            {/* Right ind percentage block */}
                            <div 
                              className="bg-stone-300 h-full transition-all duration-500"
                              style={{ width: `${metrics.individualism}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-stone-400 leading-normal gap-6">
                            <span className="max-w-[180px]">Prioritizes group welfare, harm minimization, and resource distribution.</span>
                            <span className="max-w-[180px] text-right">Prioritizes individual agency, private choice, and transactional merit.</span>
                          </div>
                        </div>

                        {/* Axis 2: Deontology vs Consequentialism */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="font-semibold text-stone-900">Deontology ({metrics.deontology}%)</span>
                            <span className="font-semibold text-stone-900">Consequentialism ({metrics.consequentialism}%)</span>
                          </div>
                          
                          {/* Split/Double Bar layout */}
                          <div className="relative w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
                            {/* Left deon percentage block */}
                            <div 
                              className="bg-stone-900 h-full transition-all duration-500 border-r border-white"
                              style={{ width: `${metrics.deontology}%` }}
                            />
                            {/* Right cons percentage block */}
                            <div 
                              className="bg-stone-300 h-full transition-all duration-500"
                              style={{ width: `${metrics.consequentialism}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-stone-400 leading-normal gap-6">
                            <span className="max-w-[180px]">Guided by absolute moral rules, categorical duties, and intrinsic rights.</span>
                            <span className="max-w-[180px] text-right">Guided by net utility calculations, actual outcomes, and strategic impact.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Panel */}
                    <div className="flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 pt-6">
                      <div className="flex gap-3">
                        <button
                          onClick={handleCopyResults}
                          className="px-5 py-3 bg-stone-950 hover:bg-stone-850 text-stone-50 rounded-xl font-medium tracking-tight text-sm inline-flex items-center gap-2 shadow transition-all hover:scale-[1.01] cursor-pointer"
                          id="btn-share-results"
                        >
                          <Copy className="w-4 h-4 text-amber-400" />
                          Share My Framework
                        </button>
                      </div>

                      <button
                        onClick={handleReset}
                        className="px-5 py-3 bg-white hover:bg-stone-50 text-stone-850 border border-stone-200 rounded-xl font-medium tracking-tight text-sm inline-flex items-center gap-2 transition-all hover:border-stone-400 cursor-pointer"
                        id="btn-re-evaluate"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-500" />
                        Re-Evaluate Sync
                      </button>
                    </div>

                  </div>
                </div>

                {/* 4. DECISION REVIEW PANEL (Master craftsmanship feature showing transparent scores) */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-500 animate-pulse" />
                      <div>
                        <h4 className="font-serif text-lg font-bold text-stone-950">
                          Transparent Decision Review
                        </h4>
                        <p className="text-xs text-stone-500">
                          Review how your specific selections plotted your coordinates on the Cartesian plane.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-stone-100 space-y-4">
                    {currentQuestionsSet.map((question, qIdx) => {
                      const selectedOptionId = selectedAnswers[question.id];
                      const chosenOption = question.options.find(o => o.id === selectedOptionId);
                      
                      return (
                        <div key={question.id} className="pt-4 first:pt-0 flex flex-col md:flex-row justify-between gap-4">
                          {/* Left: Question title and chosen text */}
                          <div className="space-y-1.5 max-w-2xl">
                            <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200/50">
                              Dilemma {qIdx + 1}: {question.category}
                            </span>
                            <h5 className="font-serif text-sm font-bold text-stone-900">
                              {question.title}
                            </h5>
                            {chosenOption ? (
                              <p className="text-stone-700 text-xs pl-3 border-l-2 border-amber-400 leading-relaxed italic">
                                "{chosenOption.text}"
                              </p>
                            ) : (
                              <p className="text-stone-400 text-xs italic pl-3 border-l-2 border-stone-200">
                                No answer chosen
                              </p>
                            )}
                          </div>

                          {/* Right: Scoring details */}
                          {chosenOption && (
                            <div className="shrink-0 flex md:flex-col justify-between md:justify-center items-end text-right gap-4 md:gap-1.5 font-mono text-xs">
                              <div>
                                <span className="text-stone-400">Framework:</span>{' '}
                                <span className="font-semibold text-stone-900">{chosenOption.philosophy}</span>
                              </div>
                              <div className="flex gap-2.5">
                                <span className={`px-2 py-0.5 rounded ${
                                  chosenOption.scoreX < 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                } text-[10px]`}>
                                  X: {chosenOption.scoreX > 0 ? `+${chosenOption.scoreX}` : chosenOption.scoreX} (Moral Focus)
                                </span>
                                <span className={`px-2 py-0.5 rounded ${
                                  chosenOption.scoreY < 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                } text-[10px]`}>
                                  Y: {chosenOption.scoreY > 0 ? `+${chosenOption.scoreY}` : chosenOption.scoreY} (Directive)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Growth Invitation — additive only, never replaces the result above.
                    No denial, no lockout, no persistence required. */}
                {showGrowthInvitation && (
                  <div className="max-w-3xl mx-auto mt-8 bg-amber-950/5 border border-amber-500/20 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-700 font-mono text-[10px] font-bold tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                      A Note on This Result
                    </div>
                    <p className="text-stone-700 text-sm font-serif leading-relaxed border-l-2 border-amber-500/50 pl-4 italic">
                      "This is where you stand today — not who you are forever. Real growth takes time. We'd genuinely encourage revisiting this assessment a year from now, after some reflection, and seeing where you land then. The door isn't closed. It's just worth walking back through, deliberately, when you're ready."
                    </p>
                  </div>
                )}

                {/* Continue to DICE — the only legitimate way in. DICE has nothing
                    real to roll from without an actual CCM result behind it. */}
                <div className="max-w-3xl mx-auto mt-8 bg-stone-950 rounded-2xl p-6 md:p-8 shadow-lg text-center space-y-4">
                  <p className="text-stone-400 text-xs font-mono uppercase tracking-widest">
                    Your Result Is Ready
                  </p>
                  <h3 className="text-stone-50 text-xl md:text-2xl font-serif font-semibold">
                    See what SHELTER would BAKE from this.
                  </h3>
                  <p className="text-stone-400 text-sm max-w-lg mx-auto">
                    Your position on the chart becomes the actual input — watch the
                    NUGGET get rolled, live, from this specific result.
                  </p>
                  <a
                    href={`/dice/?x=${userCoordinates.x}&y=${userCoordinates.y}`}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-3.5 rounded-xl transition-all hover:translate-x-0.5"
                  >
                    Continue to DICE →
                  </a>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="mt-16 pt-8 border-t border-stone-200 text-center text-xs text-stone-400 space-y-2">
          <p className="font-mono">
            CCM — Canonical Coherence Matrix • SECURE CLIENT-SIDE DIAGNOSTIC SYSTEM
          </p>
          <p>
            Designed under the SEEING Protocol. All assessments are calculated locally in memory with a zero-network guarantee to protect human psychographic privacy.
          </p>
        </footer>

      </div>
    </div>
  );
}
