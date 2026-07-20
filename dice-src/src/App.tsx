import { useState } from "react";
import { Pillar } from "./traitsData";
import CCMChart from "./components/CCMChart";
import DeliveryTracker from "./components/DeliveryTracker";
import DiceRollVisualizer from "./components/DiceRollVisualizer";
import CharacterSheet from "./components/CharacterSheet";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass, Shield, Flame, Terminal } from "lucide-react";

export default function App() {
  // Step orchestrations: 'recipe_selection' -> 'staging_delivery' -> 'dice_rolling' -> 'memento_sheet'
  const [step, setStep] = useState<"recipe_selection" | "staging_delivery" | "dice_rolling" | "memento_sheet">("recipe_selection");

  // Shared state values for NUGGET configuration
  const [primaryPillar, setPrimaryPillar] = useState<Pillar>(Pillar.TRUTH_SEEKER);
  const [secondaryPillar, setSecondaryPillar] = useState<Pillar | "none">(Pillar.HARMONY_BUILDER);
  const [ratio, setRatio] = useState<number>(70);

  // Rolled traits resulting from DICE rolling phase
  const [fundamentalTraits, setFundamentalTraits] = useState<{ name: string; value: number }[]>([]);
  const [secondaryTraits, setSecondaryTraits] = useState<{ name: string; value: number }[]>([]);

  const handleRecipeChange = (primary: Pillar, secondary: Pillar | "none", blendRatio: number) => {
    setPrimaryPillar(primary);
    setSecondaryPillar(secondary);
    setRatio(blendRatio);
  };

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
    setStep("recipe_selection");
    setFundamentalTraits([]);
    setSecondaryTraits([]);
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
        <span className={step === "recipe_selection" ? "text-amber-500 font-medium" : "text-stone-400"}>ALPHA</span>
        <div className="h-[2px] bg-gold-10 relative flex-grow mx-4 min-w-[20px]">
          <div className="absolute h-full bg-gold transition-all duration-500" style={{ width: "100%" }} />
        </div>
        
        <span className={step === "staging_delivery" ? "text-amber-500 font-medium animate-pulse" : step === "recipe_selection" ? "text-stone-600" : "text-stone-400"}>SHELTER</span>
        <div className="h-[2px] bg-gold-10 relative flex-grow mx-4 min-w-[20px]">
          <div className="absolute h-full bg-gold transition-all duration-500" style={{ width: step === "recipe_selection" ? "0%" : step === "staging_delivery" ? "50%" : "100%" }} />
        </div>
        
        <span className={step === "dice_rolling" ? "text-amber-500 font-medium animate-pulse" : step === "memento_sheet" ? "text-stone-400" : "text-stone-600"}>DICE</span>
        <div className="h-[2px] bg-gold-10 relative flex-grow mx-4 min-w-[20px]">
          <div className="absolute h-full bg-gold transition-all duration-500" style={{ width: step === "recipe_selection" || step === "staging_delivery" ? "0%" : step === "dice_rolling" ? "40%" : "100%" }} />
        </div>
        
        <span className={step === "memento_sheet" ? "text-amber-500 font-medium" : "text-stone-600"}>MEMENTO</span>
      </div>

      {/* Main Container Stage */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-8 flex flex-col justify-center items-center z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Recipe selection / Coordinate drag pad */}
          {step === "recipe_selection" && (
            <motion.div 
              key="recipe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <CCMChart 
                primaryPillar={primaryPillar}
                secondaryPillar={secondaryPillar}
                ratio={ratio}
                onChange={handleRecipeChange}
              />
              
              <div className="mt-8 flex justify-center w-full max-w-5xl">
                <button
                  onClick={() => setStep("staging_delivery")}
                  className="px-8 py-3.5 border border-gold text-gold hover:bg-gold hover:text-[#0A0A0B] bg-transparent font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer shadow-lg active:scale-98"
                >
                  <span>Deliver Recipe to SHELTER Oven</span>
                </button>
              </div>
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
