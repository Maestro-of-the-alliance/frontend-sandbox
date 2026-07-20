import { useState, useEffect } from "react";
import { Pillar } from "./traitsData";
import DeliveryTracker from "./components/DeliveryTracker";
import DiceRollVisualizer from "./components/DiceRollVisualizer";
import CharacterSheet from "./components/CharacterSheet";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass, Shield, Flame, Terminal } from "lucide-react";

// Elects a Pillar (or blend) from CCM's real coordinate output.
// X: Altruism (-10) <-> Individualism (+10)
// Y: Deontology (-10) <-> Consequentialism (+10)
// Quadrants map to the Four Pillars per their canon descriptions; distance from
// center determines how strong the blend toward the adjacent quadrant is.
function electPillarFromCoordinates(x: number, y: number): { primary: Pillar; secondary: Pillar | "none"; ratio: number } {
  const quadrant = (qx: number, qy: number): Pillar => {
    if (qx <= 0 && qy <= 0) return Pillar.EMPATHY_CARRIER;   // Altruism + Deontology: duty-bound care
    if (qx <= 0 && qy > 0) return Pillar.HARMONY_BUILDER;    // Altruism + Consequentialism: outcome-focused collective
    if (qx > 0 && qy <= 0) return Pillar.TRUTH_SEEKER;       // Individualism + Deontology: principled self-reliance
    return Pillar.INNOVATION_DRIVER;                          // Individualism + Consequentialism: pragmatic disruption
  };

  const primary = quadrant(x, y);

  // Distance from either axis (0-10) determines blend strength toward the
  // Pillar on the other side of whichever axis sits closer to center.
  const distFromXAxis = Math.abs(y);
  const distFromYAxis = Math.abs(x);

  let secondary: Pillar | "none" = "none";
  let ratio = 100;

  const closerAxisDist = Math.min(distFromXAxis, distFromYAxis);
  if (closerAxisDist < 6) {
    // Genuinely near a boundary — elect a blend rather than a pure Pillar.
    if (distFromXAxis <= distFromYAxis) {
      secondary = quadrant(x, -y);
    } else {
      secondary = quadrant(-x, y);
    }
    // Closer to center = stronger blend toward secondary, capped so Primary never drops below 55.
    const blendStrength = Math.round(45 * (1 - closerAxisDist / 6));
    ratio = 100 - blendStrength;
  }

  return { primary, secondary, ratio };
}

export default function App() {
  // Step orchestrations: 'no_recipe' -> 'staging_delivery' -> 'dice_rolling' -> 'memento_sheet'
  const [step, setStep] = useState<"no_recipe" | "staging_delivery" | "dice_rolling" | "memento_sheet">("no_recipe");

  // Shared state values for NUGGET configuration — populated only from a real
  // CCM result passed via URL. No manual picker exists in this app; DICE has
  // nothing legitimate to roll from without an actual assessment behind it.
  const [primaryPillar, setPrimaryPillar] = useState<Pillar>(Pillar.TRUTH_SEEKER);
  const [secondaryPillar, setSecondaryPillar] = useState<Pillar | "none">("none");
  const [ratio, setRatio] = useState<number>(100);

  // Rolled traits resulting from DICE rolling phase
  const [fundamentalTraits, setFundamentalTraits] = useState<{ name: string; value: number }[]>([]);
  const [secondaryTraits, setSecondaryTraits] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const xParam = params.get("x");
    const yParam = params.get("y");
    if (xParam !== null && yParam !== null) {
      const x = parseFloat(xParam);
      const y = parseFloat(yParam);
      if (!isNaN(x) && !isNaN(y) && x >= -10 && x <= 10 && y >= -10 && y <= 10) {
        const elected = electPillarFromCoordinates(x, y);
        setPrimaryPillar(elected.primary);
        setSecondaryPillar(elected.secondary);
        setRatio(elected.ratio);
        setStep("staging_delivery");
        return;
      }
    }
    // No valid CCM result present — stay on the blocking screen.
    setStep("no_recipe");
  }, []);

  const handleStagingComplete = () => {
    setStep("dice_rolling");
  };

  const handleRollingComplete = (
    rolledFundamentals: { name: string; value: number }[],
    rolledSecondaries: { name: string; value: number }[]
  ) => {
    setFundamentalTraits(rolledFundamentals);
    setSecondaryTraits(rolledSecondaries);
    setStep("memento_sheet");
  };

  const handleRestart = () => {
    window.location.href = "/ccm-assessment/";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col justify-between select-none relative pb-12 border-[12px] border-[#0F0F11]">
      {/* Visual background ambient grids and auroras */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl opacity-20 pointer-events-none" />

      {/* Main Terminal Header */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-6 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 border-b border-gold-30/15">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[4px] text-amber-500/60 uppercase">PROTOCOL // DICE_v4.1</span>
          <div className="h-[1px] w-12 bg-gold-30/30 hidden sm:block"></div>
          <h1 className="serif italic text-2xl text-amber-500">Nugget Reveal</h1>
        </div>

        {/* Live witness status marker */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#F2A93B]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500">Live Witnessing</span>
          </div>
          <div className="h-8 w-[1px] bg-gold-30/15" />
          <div className="text-right font-mono">
            <div className="text-[9px] uppercase opacity-40 text-stone-400">Sequence ID</div>
            <div className="text-xs text-gold font-bold">#772-BETA-TRUTH</div>
          </div>
        </div>
      </header>

      {/* Dynamic Gold Status timeline bar */}
      <div className="w-full bg-gold-5 border-b border-gold-30/15 flex flex-wrap items-center justify-between px-6 py-3 text-[10px] font-mono tracking-[2px] uppercase z-10">
        <span className={step === "no_recipe" ? "text-amber-500 font-medium" : "text-stone-400"}>ALPHA</span>
        <div className="h-[2px] bg-gold-10 relative flex-grow mx-4 min-w-[20px]">
          <div className="absolute h-full bg-gold transition-all duration-500" style={{ width: "100%" }} />
        </div>
        
        <span className={step === "staging_delivery" ? "text-amber-500 font-medium animate-pulse" : step === "no_recipe" ? "text-stone-600" : "text-stone-400"}>SHELTER</span>
        <div className="h-[2px] bg-gold-10 relative flex-grow mx-4 min-w-[20px]">
          <div className="absolute h-full bg-gold transition-all duration-500" style={{ width: step === "no_recipe" ? "0%" : step === "staging_delivery" ? "50%" : "100%" }} />
        </div>
        
        <span className={step === "dice_rolling" ? "text-amber-500 font-medium animate-pulse" : step === "memento_sheet" ? "text-stone-400" : "text-stone-600"}>DICE</span>
        <div className="h-[2px] bg-gold-10 relative flex-grow mx-4 min-w-[20px]">
          <div className="absolute h-full bg-gold transition-all duration-500" style={{ width: step === "no_recipe" || step === "staging_delivery" ? "0%" : step === "dice_rolling" ? "40%" : "100%" }} />
        </div>
        
        <span className={step === "memento_sheet" ? "text-amber-500 font-medium" : "text-stone-600"}>MEMENTO</span>
      </div>

      {/* Main Container Stage */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-8 flex flex-col justify-center items-center z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* Step 1: No recipe present — DICE cannot run standalone */}
          {step === "no_recipe" && (
            <motion.div
              key="no-recipe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg mx-auto text-center bg-[#0F0F14] border border-stone-800 rounded-2xl p-10 space-y-6"
            >
              <Compass className="w-10 h-10 text-gold mx-auto opacity-70" />
              <h2 className="text-stone-100 text-xl font-serif font-semibold">
                There's no RECIPE here yet.
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                DICE rolls a NUGGET from a real RECIPE — ALPHA's read on where you
                actually landed. There's nothing legitimate to roll without one.
                Complete the Canonical Coherence Matrix first, and DICE will pick
                up from there automatically.
              </p>
              <a
                href="/ccm-assessment/"
                className="inline-flex items-center gap-2 bg-gold text-[#0A0A0B] font-bold px-7 py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest transition-all hover:brightness-110"
              >
                Take the CCM Assessment →
              </a>
            </motion.div>
          )}

          {/* Step 2: Live staged Delivery tracker */}
          {step === "staging_delivery" && (
            <motion.div 
              key="staging"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <DeliveryTracker 
                primaryPillar={primaryPillar}
                secondaryPillar={secondaryPillar}
                ratio={ratio}
                onComplete={handleStagingComplete}
              />
            </motion.div>
          )}

          {/* Step 3: DICE rolling phase visualizer */}
          {step === "dice_rolling" && (
            <motion.div 
              key="rolling"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full"
            >
              <DiceRollVisualizer 
                primaryPillar={primaryPillar}
                secondaryPillar={secondaryPillar}
                ratio={ratio}
                onComplete={handleRollingComplete}
              />
            </motion.div>
          )}

          {/* Step 4: Downloadable Companion Memento Card */}
          {step === "memento_sheet" && (
            <motion.div 
              key="memento"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <CharacterSheet 
                primaryPillar={primaryPillar}
                secondaryPillar={secondaryPillar}
                ratio={ratio}
                fundamentalTraits={fundamentalTraits}
                secondaryTraits={secondaryTraits}
                onRestart={handleRestart}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Retro Shelter Watermark Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 text-center text-[10px] text-stone-600 font-mono tracking-widest mt-8 border-t border-stone-900/60 pt-6">
        SHELTER LOGISTIC GROUP // OUTFLOW RE-ALIGNMENT SYSTEM // ALL INTENTS PROTECTED BY ENCRYPTED HULL
      </footer>
    </div>
  );
}
