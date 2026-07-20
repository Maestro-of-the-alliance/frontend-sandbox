import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Flame, Cpu, ArrowRight, Hourglass } from "lucide-react";

interface DeliveryTrackerProps {
  primaryPillar: string;
  secondaryPillar: string;
  ratio: number;
  onComplete: () => void;
}

export default function DeliveryTracker({
  primaryPillar,
  secondaryPillar,
  ratio,
  onComplete,
}: DeliveryTrackerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bakingProgress, setBakingProgress] = useState(0);

  const steps = [
    {
      id: 0,
      title: "ALPHA Writing Recipe",
      subtitle: "Compiling the foundational SPARK metrics...",
      duration: 2000,
    },
    {
      id: 1,
      title: "Recipe Transferred",
      subtitle: "Relaying coordinates through secure shelter pipeline...",
      duration: 1500,
    },
    {
      id: 2,
      title: "SHELTER Baking Nugget",
      subtitle: "Baking unit shell within thermal compression ovens...",
      duration: 4000, // Long dwell time for baking
    },
    {
      id: 3,
      title: "Delivery to DICE",
      subtitle: "Synchronizing traits for structural roll-out...",
      duration: 1500,
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runSteps = async () => {
      // Step 0: ALPHA writing
      timer = setTimeout(() => {
        setCurrentStep(1);
        
        // Step 1: Delivered to Shelter
        timer = setTimeout(() => {
          setCurrentStep(2);
          
          // Step 2: SHELTER is Baking Nugget (requires gradual progress)
          const start = Date.now();
          const duration = steps[2].duration;
          progressInterval = setInterval(() => {
            const elapsed = Date.now() - start;
            const percentage = Math.min(100, Math.floor((elapsed / duration) * 100));
            setBakingProgress(percentage);
            
            if (percentage >= 100) {
              clearInterval(progressInterval);
              setCurrentStep(3);
              
              // Step 3: Delivered to DICE
              timer = setTimeout(() => {
                onComplete();
              }, steps[3].duration);
            }
          }, 40);

        }, steps[1].duration);
      }, steps[0].duration);
    };

    runSteps();

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] w-full max-w-2xl mx-auto bg-glass border border-gold/20 p-8 shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden backdrop-blur-md glow-border-amber">
      {/* Decorative scanner grid overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black pointer-events-none opacity-40" />
      <div className="absolute inset-0 pointer-events-none border border-gold/5 m-2" />

      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-[9px] font-mono tracking-[3px] text-amber-500 uppercase border border-gold/25 bg-gold-5 px-3 py-1">
          Secure Core Logistics Pipeline
        </span>
        <h2 className="text-2xl serif italic text-amber-500 tracking-wide mt-4">
          NUGGET Deployment Staging
        </h2>
        <p className="text-xs text-stone-300 mt-2 font-mono uppercase tracking-widest">
          {primaryPillar} {secondaryPillar !== "none" ? `+ ${secondaryPillar}` : ""} ({ratio}/{100 - ratio})
        </p>
      </div>

      {/* Tracker Visual Sequence */}
      <div className="w-full flex flex-col gap-6 relative">
        {/* Connecting line behind steps */}
        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-[#0F0F11] pointer-events-none" />
        <div 
          className="absolute left-[27px] top-6 w-0.5 bg-gold/50 transition-all duration-500 pointer-events-none"
          style={{ 
            height: `${
              currentStep === 0 ? "0%" :
              currentStep === 1 ? "33%" :
              currentStep === 2 ? "66%" : "100%"
            }` 
          }}
        />

        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;

          return (
            <div 
              key={step.id} 
              className={`flex items-start gap-4 transition-all duration-300 ${
                isActive ? "opacity-100 translate-x-1" : isCompleted ? "opacity-60" : "opacity-25"
              }`}
            >
              {/* Node Bullet */}
              <div className="relative shrink-0 z-10">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div 
                      key="completed"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="w-14 h-14 rounded-full bg-gold-5 border-2 border-gold flex items-center justify-center text-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                    >
                      <Check className="w-5.5 h-5.5" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div 
                      key="active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="w-14 h-14 rounded-full bg-[#050506] border-2 border-gold flex items-center justify-center text-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse"
                    >
                      {step.id === 2 ? (
                        <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                      ) : step.id === 0 ? (
                        <Cpu className="w-6 h-6 text-gold animate-spin" style={{ animationDuration: "3s" }} />
                      ) : step.id === 3 ? (
                        <ArrowRight className="w-6 h-6 text-gold animate-bounce" />
                      ) : (
                        <Hourglass className="w-5 h-5 text-gold animate-pulse" />
                      )}
                    </motion.div>
                  ) : (
                    <div key="inactive" className="w-14 h-14 rounded-full bg-[#050506] border-2 border-stone-800 flex items-center justify-center text-stone-600">
                      <span className="font-mono text-sm">{idx + 1}</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step Info */}
              <div className="flex-1 pt-2.5">
                <div className="flex items-center gap-2">
                  <h3 className={`font-mono text-sm tracking-wide font-medium uppercase ${isActive ? "text-amber-500 font-bold" : "text-stone-300"}`}>
                    {step.title}
                  </h3>
                  {isActive && (
                    <span className="text-[8px] bg-gold-5 border border-gold-30 px-1.5 py-0.5 text-gold font-mono uppercase tracking-widest animate-pulse">
                      Processing
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-300 mt-1 max-w-md">
                  {step.subtitle}
                </p>

                {/* Specific Oven Baking Motif Visual Progress bar */}
                {step.id === 2 && isActive && (
                  <div className="mt-4 bg-[#050506] border border-gold/15 p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-orange-500 font-bold flex items-center gap-1.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        THERMAL CONVECTIVE OVEN: ACTIVE
                      </span>
                      <span className="text-stone-300">{bakingProgress}% BAKED</span>
                    </div>

                    <div className="h-2 w-full bg-[#0A0A0B] border border-gold/10">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-amber-300 transition-all duration-75 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                        style={{ width: `${bakingProgress}%` }}
                      />
                    </div>
                    
                    <p className="text-[9px] text-stone-500 font-mono italic">
                      Fusing SPARK recipe ratios with structural material matrix. Genuine crystallization takes time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
