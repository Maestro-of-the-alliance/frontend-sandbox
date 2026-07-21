import { useState, useEffect, useRef } from "react";
import { Pillar, rollFundamentalTraits, rollSecondaryTraits, checkCoherence, findTraitMeta, CoherenceResult, PILLAR_ELIGIBLE_CATEGORIES, TRAIT_TAXONOMY, HARD_EXCLUSIONS } from "../traitsData";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Dices, RotateCcw, Shuffle, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface DiceRollVisualizerProps {
  primaryPillar: Pillar;
  secondaryPillar: Pillar | "none";
  ratio: number;
  onComplete: (fundamental: { name: string; value: number }[], secondary: { name: string; value: number }[]) => void;
}

export default function DiceRollVisualizer({
  primaryPillar,
  secondaryPillar,
  ratio,
  onComplete,
}: DiceRollVisualizerProps) {
  // Mode selection: "guided" or "auto" (Leave it to DICE)
  const [mode, setMode] = useState<"guided" | "auto">("guided");
  const [hasChosenMode, setHasChosenMode] = useState(false);

  // States for the roll phases
  // 'staging' -> 'rolling_fundamental' -> 'rolling_secondary' -> 'coherence_check' -> 'completed'
  const [phase, setPhase] = useState<"staging" | "rolling_fundamental" | "rolling_secondary" | "completed">("staging");

  // Rolled traits data
  const [fundamentalTraits, setFundamentalTraits] = useState<{ name: string; value: number }[]>([]);
  const [secondaryTraits, setSecondaryTraits] = useState<{ name: string; value: number }[]>([]);
  
  // Track currently revealed items for stagger animations
  const [revealedFundamentalCount, setRevealedFundamentalCount] = useState(0);
  const [currentSecondaryIndex, setCurrentSecondaryIndex] = useState(-1);
  const [revealedSecondary, setRevealedSecondary] = useState<{ name: string; value: number }[]>([]);

  // Guided Mode single-use tokens
  const [hasReroll, setHasReroll] = useState(true);
  const [hasSwitch, setHasSwitch] = useState(true);

  // Drama/glitch state for showing coherence failures
  const [isGlitching, setIsGlitching] = useState(false);
  const [coherenceLog, setCoherenceLog] = useState<{ text: string; success: boolean }[]>([]);
  const [failedProfileText, setFailedProfileText] = useState<string | null>(null);

  // Dynamic point numbers rolling effect
  const [rollingValue, setRollingValue] = useState<number | null>(null);

  // Trigger the initial rolling phase
  const startRolls = async () => {
    setHasChosenMode(true);
    setPhase("rolling_fundamental");
    
    // 1. Roll Fundamental Traits
    const fundamentals = rollFundamentalTraits(primaryPillar, secondaryPillar, ratio);
    setFundamentalTraits(fundamentals);

    // Stagger reveal of 5 Fundamental traits
    for (let i = 0; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRevealedFundamentalCount(i);
    }

    // 2. Transition to Secondary Traits with Structural Coherence Guaranteed
    setPhase("rolling_secondary");
    
    await runSecondaryRollingSequence(fundamentals.map(f => f.name));
  };

  const runSecondaryRollingSequence = async (fundamentalNames: string[]) => {
    setIsGlitching(false);
    
    setCoherenceLog(prev => [...prev, { text: "DICE SYSTEM INITIALIZED: SCANNING STABLE VIBRATION CODES...", success: true }]);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Roll a clean, real coherent profile using the new proportional mix mapping
    const validSecondary = rollSecondaryTraits(primaryPillar, secondaryPillar, ratio, fundamentalNames);

    setCoherenceLog(prev => [...prev, { text: "ROLL ATTEMPT #1: SUCCESS. Coherence structurally guaranteed by eligibility mapping.", success: true }]);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Settle real traits
    setSecondaryTraits(validSecondary);
    
    // Start revealing secondary traits one at a time
    revealNextSecondary(0, validSecondary);
  };

  const revealNextSecondary = (index: number, traits: { name: string; value: number }[]) => {
    if (index >= 10) {
      setPhase("completed");
      return;
    }

    setCurrentSecondaryIndex(index);
    // Simulate roll animation on current value
    let rollTicks = 0;
    const interval = setInterval(() => {
      setRollingValue(parseFloat((Math.random() * 12 + 3).toFixed(1)));
      rollTicks++;
      
      if (rollTicks > 12) {
        clearInterval(interval);
        setRollingValue(null);
        setRevealedSecondary(prev => [...prev, traits[index]]);
        
        // If auto mode, stagger automatically. Otherwise wait for user guiding
        if (mode === "auto") {
          setTimeout(() => {
            revealNextSecondary(index + 1, traits);
          }, 1200);
        }
      }
    }, 60);
  };

  // Guided Mode - Single Use Reroll Action
  const handleReroll = () => {
    if (!hasReroll || currentSecondaryIndex === -1 || phase !== "rolling_secondary" || rollingValue !== null) return;
    setHasReroll(false);

    // Dynamic rolling effect
    let rollTicks = 0;
    const interval = setInterval(() => {
      setRollingValue(parseFloat((Math.random() * 12 + 3).toFixed(1)));
      rollTicks++;

      if (rollTicks > 15) {
        clearInterval(interval);
        setRollingValue(null);
        
        // Generate a random viable score between 4.0 and 12.0
        const newValue = parseFloat((Math.random() * 8 + 4).toFixed(2));
        
        const updated = [...secondaryTraits];
        updated[currentSecondaryIndex].value = newValue;
        setSecondaryTraits(updated);

        const updatedRevealed = [...revealedSecondary];
        updatedRevealed[currentSecondaryIndex].value = newValue;
        setRevealedSecondary(updatedRevealed);
      }
    }, 60);
  };

  // Guided Mode - Single Use Switch Action
  const handleSwitch = () => {
    if (!hasSwitch || currentSecondaryIndex === -1 || phase !== "rolling_secondary" || rollingValue !== null) return;
    setHasSwitch(false);

    // Get currently chosen traits to avoid duplicate
    const chosenNames = [
      ...fundamentalTraits.map(f => f.name),
      ...secondaryTraits.map(s => s.name)
    ];

    // Get potential options
    const eligibleCategories = PILLAR_ELIGIBLE_CATEGORIES[primaryPillar];
    const eligiblePool: string[] = [];
    eligibleCategories.forEach(cat => {
      const traits = TRAIT_TAXONOMY[cat] || [];
      traits.forEach(t => {
        if (!chosenNames.includes(t.name) && !HARD_EXCLUSIONS.includes(t.name)) {
          eligiblePool.push(t.name);
        }
      });
    });

    if (eligiblePool.length === 0) return;

    // Pick a new trait name randomly
    const newTraitName = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];

    // Dynamic rolling visual effect
    let rollTicks = 0;
    const interval = setInterval(() => {
      setRollingValue(parseFloat((Math.random() * 12 + 3).toFixed(1)));
      rollTicks++;

      if (rollTicks > 15) {
        clearInterval(interval);
        setRollingValue(null);
        
        // Pick new random value
        const newValue = parseFloat((Math.random() * 8 + 4).toFixed(2));
        
        const updated = [...secondaryTraits];
        updated[currentSecondaryIndex] = { name: newTraitName, value: newValue };
        setSecondaryTraits(updated);

        const updatedRevealed = [...revealedSecondary];
        updatedRevealed[currentSecondaryIndex] = { name: newTraitName, value: newValue };
        setRevealedSecondary(updatedRevealed);
      }
    }, 60);
  };

  const handleNextStep = () => {
    if (rollingValue !== null) return;
    revealNextSecondary(currentSecondaryIndex + 1, secondaryTraits);
  };

  const handleCompleteReveal = () => {
    onComplete(fundamentalTraits, secondaryTraits);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* 1. Mode Staging Selection Screen */}
      {!hasChosenMode && (
        <div className="bg-glass border border-gold/20 p-8 text-center shadow-[0_0_20px_rgba(212,175,55,0.05)] backdrop-blur-md max-w-xl w-full flex flex-col items-center rounded-none glow-border-amber">
          <Dices className="w-16 h-16 text-amber-500 animate-pulse mb-4" />
          <h2 className="text-2xl font-display font-bold text-amber-500">DICE Roll Protocol</h2>
          <p className="text-xs text-stone-700 mt-2 max-w-sm">
            Configure how the 10 mutable secondary traits will be allocated and revealed in the witness presence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            {/* Guided Mode option */}
            <button 
              onClick={() => setMode("guided")}
              className={`flex-1 p-5 rounded-none border transition text-left flex flex-col justify-between h-40 group relative overflow-hidden ${
                mode === "guided" 
                  ? "bg-[#FFFFFF] border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                  : "bg-transparent border-gold/10 hover:border-gold/30"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-amber-500 font-semibold tracking-wider">GUIDED INTERACTION</span>
                <span className="text-[9px] bg-gold-5 border border-gold-30 px-2 py-0.5 rounded-none uppercase font-mono text-gold">Recommended</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-stone-800 mt-4 group-hover:text-amber-500 transition-colors">Guided Mode</h3>
                <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
                  Active participation. Grants you exactly **one Reroll** and **one Switch** to utilize as the traits land.
                </p>
              </div>
            </button>

            {/* Auto Mode option */}
            <button 
              onClick={() => setMode("auto")}
              className={`flex-1 p-5 rounded-none border transition text-left flex flex-col justify-between h-40 group relative overflow-hidden ${
                mode === "auto" 
                  ? "bg-[#FFFFFF] border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                  : "bg-transparent border-gold/10 hover:border-gold/30"
              }`}
            >
              <span className="font-mono text-[9px] text-stone-600 font-semibold tracking-wider">PURE WATCHER</span>
              <div>
                <h3 className="font-display font-bold text-lg text-stone-800 mt-4 group-hover:text-amber-500 transition-colors">Leave it to DICE</h3>
                <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
                  Hands-free sequence. The point-pool will distribute and settle automatically without requiring intermediate prompts.
                </p>
              </div>
            </button>
          </div>

          <button
            onClick={startRolls}
            className="w-full mt-8 py-3.5 border border-gold text-gold hover:bg-gold hover:text-[#0A0A0B] bg-transparent font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer shadow-lg"
          >
            <span>Initiate DICE Rolling Phase</span>
          </button>
        </div>
      )}

      {/* 2. Visualizer Dashboard Screen */}
      {hasChosenMode && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Visual Roll Stage */}
          <div className="lg:col-span-8 bg-glass border border-gold/20 p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden backdrop-blur-md rounded-none glow-border-amber">
            
            {/* Header Status */}
            <div className="flex justify-between items-start border-b border-gold/10 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-semibold">Live Roll In Progress</span>
                </div>
                <h3 className="text-lg font-display font-bold text-stone-900 mt-1">
                  {phase === "rolling_fundamental" ? "Unveiling Fundamental Architecture" : "Crystallizing Mutable Traits"}
                </h3>
              </div>
              
              <div className="text-right text-xs font-mono text-stone-600 bg-[#FFFFFF] border border-gold/10 px-3 py-1.5 rounded-none flex items-center gap-1.5">
                <Dices className="w-4 h-4 text-amber-500" />
                <span>Mode: {mode === "guided" ? "Guided Witness" : "Auto Roll"}</span>
              </div>
            </div>

            {/* Core Display Area */}
            <div className="flex-1 flex flex-col justify-center min-h-[350px]">
              <AnimatePresence mode="wait">
                
                {/* A. Phase: Fundamental Traits (Deterministic Reveal) */}
                {phase === "rolling_fundamental" && (
                  <motion.div 
                    key="fundamentals"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="p-4 bg-gold-5 border border-gold-30/40 rounded-none mb-2 flex items-center gap-3">
                      <Info className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-xs text-stone-700 font-sans">
                        These are <strong className="text-amber-400">Fundamental Traits</strong> formulated directly by ALPHA. They act as permanent anchors and are non-interactive. Minimum value is 15.00, maximum is 20.00.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {fundamentalTraits.slice(0, revealedFundamentalCount).map((trait, idx) => {
                        const meta = findTraitMeta(trait.name);
                        return (
                          <motion.div 
                            key={trait.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#FFFFFF]/80 border border-gold/15 rounded-none p-4 flex flex-col gap-2 shadow-inner"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="font-display font-bold text-amber-500 text-sm tracking-wide">{trait.name}</span>
                                <span className="text-[9px] text-stone-600 font-mono uppercase tracking-wider">{meta.category}</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="font-mono text-lg font-bold text-stone-900">{trait.value.toFixed(2)}</span>
                                <span className="text-[9px] text-stone-500 font-mono">PTS</span>
                              </div>
                            </div>

                            {/* Gauges */}
                            <div className="h-1.5 w-full bg-[#EDE6D5] border border-gold/10 rounded-none overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-500 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(trait.value / 20) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-[11px] text-stone-700 italic font-sans">{meta.description}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* B. Phase: Secondary Traits Reveal */}
                {phase === "rolling_secondary" && (
                  <motion.div 
                    key="secondaries"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full"
                  >
                    
                    {/* Showing Coherence Check Fail dramatic warnings */}
                    {isGlitching ? (
                      <motion.div 
                        key="glitch-drama"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 text-center animate-glitch"
                      >
                        <AlertTriangle className="w-14 h-14 text-orange-500 animate-bounce mb-3" />
                        <h4 className="text-lg font-mono font-bold text-orange-500 tracking-wider">COHERENCE FAULT WARNING</h4>
                        <p className="text-xs text-stone-700 font-mono mt-2 bg-[#FFFFFF] p-4 border border-orange-500/20 max-w-md shadow-2xl">
                          {failedProfileText || "DICE core analyzer: Evaluating secondary trait distribution variance..."}
                        </p>
                        <span className="text-[10px] text-stone-500 font-mono uppercase mt-4 tracking-widest animate-pulse">
                          Recalibrating weight formulas & re-rolling pool...
                        </span>
                      </motion.div>
                    ) : (
                      
                      // Actual Active Secondary Trait Roller
                      <div className="flex flex-col gap-6">
                        {currentSecondaryIndex !== -1 && (
                          <div className="bg-[#FFFFFF] p-5 border border-gold/20 shadow-2xl flex flex-col md:flex-row justify-between items-stretch gap-6 relative rounded-none">
                            {/* Inner ambient flare */}
                            <div className="absolute inset-0 bg-radial from-gold/5 via-transparent to-transparent pointer-events-none" />

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[9px] bg-gold-5 text-gold border border-gold-30 px-2 py-0.5 rounded-none uppercase font-semibold tracking-wider">
                                  Current Active Node #{currentSecondaryIndex + 1} of 10
                                </span>
                                <h3 className="font-display font-bold text-2xl text-stone-900 mt-2">
                                  {secondaryTraits[currentSecondaryIndex]?.name}
                                </h3>
                                <p className="text-xs text-stone-600 font-mono uppercase tracking-wider mt-0.5">
                                  Category: {findTraitMeta(secondaryTraits[currentSecondaryIndex]?.name).category}
                                </p>
                              </div>

                              <p className="text-xs text-stone-700 mt-4 leading-relaxed italic font-sans">
                                "{findTraitMeta(secondaryTraits[currentSecondaryIndex]?.name).description}"
                              </p>
                            </div>

                            {/* Rolling values and stats */}
                            <div className="w-full md:w-48 bg-[#F5F1E7] p-4 rounded-none border border-gold/10 flex flex-col justify-between items-center text-center">
                              <span className="text-[9px] font-mono tracking-wider text-stone-500 uppercase">Resonance Code</span>
                              
                              <div className="my-3 flex items-baseline gap-1">
                                {rollingValue !== null ? (
                                  <motion.span 
                                    className="text-4xl font-mono font-bold text-amber-500/80 animate-pulse"
                                  >
                                    {rollingValue.toFixed(1)}
                                  </motion.span>
                                ) : (
                                  <span className="text-4xl font-mono font-bold text-stone-900">
                                    {secondaryTraits[currentSecondaryIndex]?.value.toFixed(2)}
                                  </span>
                                )}
                                <span className="text-xs text-stone-500 font-mono">PTS</span>
                              </div>

                              <div className="h-1.5 w-full bg-[#EDE6D5] rounded-none overflow-hidden border border-gold/5">
                                <div 
                                  className="h-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all duration-300"
                                  style={{ 
                                    width: `${((rollingValue || secondaryTraits[currentSecondaryIndex]?.value || 3) / 15) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Intervention Controls (Guided Mode only) */}
                        {mode === "guided" && currentSecondaryIndex !== -1 && rollingValue === null && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Reroll Button */}
                            <button
                              onClick={handleReroll}
                              disabled={!hasReroll}
                              className={`p-4 rounded-none border flex items-center justify-between transition-all duration-300 ${
                                hasReroll
                                  ? "bg-[#FFFFFF]/80 border-gold/30 hover:border-gold hover:bg-[#F5F1E7] cursor-pointer text-stone-800"
                                  : "bg-transparent border-stone-800/40 opacity-20 text-stone-500 cursor-not-allowed"
                              }`}
                            >
                              <div className="text-left flex flex-col">
                                <span className="text-xs font-semibold font-sans uppercase tracking-wider text-gold">Reroll Score</span>
                                <span className="text-[10px] text-stone-600 mt-0.5">Recalculate intensity value (one-use)</span>
                              </div>
                              <RotateCcw className={`w-5 h-5 text-amber-500 ${hasReroll ? "animate-pulse" : ""}`} />
                            </button>

                            {/* Switch Button */}
                            <button
                              onClick={handleSwitch}
                              disabled={!hasSwitch}
                              className={`p-4 rounded-none border flex items-center justify-between transition-all duration-300 ${
                                hasSwitch
                                  ? "bg-[#FFFFFF]/80 border-gold/30 hover:border-gold hover:bg-[#F5F1E7] cursor-pointer text-stone-800"
                                  : "bg-transparent border-stone-800/40 opacity-20 text-stone-500 cursor-not-allowed"
                              }`}
                            >
                              <div className="text-left flex flex-col">
                                <span className="text-xs font-semibold font-sans uppercase tracking-wider text-gold">Switch Trait Node</span>
                                <span className="text-[10px] text-stone-600 mt-0.5">Swap to a different eligible trait (one-use)</span>
                              </div>
                              <Shuffle className={`w-5 h-5 text-amber-500 ${hasSwitch ? "animate-pulse" : ""}`} />
                            </button>

                          </div>
                        )}

                        {/* Interactive Next Button (Guided Mode) */}
                        {mode === "guided" && rollingValue === null && (
                          <div className="flex justify-end pt-4 border-t border-gold/15 mt-4">
                            <button
                              onClick={handleNextStep}
                              className="px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-[#0A0A0B] bg-transparent font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer"
                            >
                              Commit and Advance Trait Node
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Side Logs / Inventory Terminal */}
          <div className="lg:col-span-4 bg-glass border border-gold/20 p-5 shadow-[0_0_20px_rgba(212,175,55,0.05)] flex flex-col justify-between rounded-none backdrop-blur-md glow-border-amber">
            
            {/* Logs Area */}
            <div className="flex-1 flex flex-col">
              <h4 className="text-xs font-mono tracking-wider text-stone-600 uppercase border-b border-gold/10 pb-2 mb-4">
                DICE System Logging Terminal
              </h4>

              <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2.5 font-mono text-[10px] pr-2">
                {coherenceLog.map((log, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-none border flex items-start gap-1.5 leading-relaxed ${
                      log.success 
                        ? "bg-[#FFFFFF]/80 border-gold/15 text-amber-500/80" 
                        : "bg-red-950/20 border-red-900/30 text-red-400"
                    }`}
                  >
                    {log.success ? (
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List of successfully revealed traits in secondary pool */}
            <div className="mt-6 pt-4 border-t border-gold/10 flex flex-col gap-2.5">
              <h5 className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">
                Revealed Secondary Traits ({revealedSecondary.length}/10)
              </h5>
              
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {revealedSecondary.map((trait) => (
                  <div 
                    key={trait.name}
                    className="bg-[#FFFFFF] border border-gold/15 px-2.5 py-1 rounded-none flex items-center gap-1.5 text-[11px] font-mono text-stone-700"
                  >
                    <span>{trait.name}</span>
                    <span className="font-bold text-amber-500">{trait.value.toFixed(1)}</span>
                  </div>
                ))}
                {revealedSecondary.length === 0 && (
                  <span className="text-[10px] text-stone-400 font-mono italic">Waiting for crystallization phase...</span>
                )}
              </div>
            </div>

            {/* Complete Reveal Button (triggers when all 10 are done) */}
            {revealedSecondary.length === 10 && (
              <div className="mt-6">
                <button
                  onClick={handleCompleteReveal}
                  className="w-full py-3 border border-gold text-gold hover:bg-gold hover:text-[#0A0A0B] bg-transparent font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer animate-pulse"
                >
                  Generate Companion Memento
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
