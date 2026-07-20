import React, { useState, useRef, useEffect } from "react";
import { Pillar } from "../traitsData";
import { motion } from "motion/react";
import { Info, HelpCircle } from "lucide-react";

interface CCMChartProps {
  primaryPillar: Pillar;
  secondaryPillar: Pillar | "none";
  ratio: number; // Percentage of primary pillar (e.g., 70 for 70/30)
  onChange: (primary: Pillar, secondary: Pillar | "none", ratio: number) => void;
}

export default function CCMChart({
  primaryPillar,
  secondaryPillar,
  ratio,
  onChange,
}: CCMChartProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Normalized 2D coordinates for the Spark position (X and Y between 0 and 1)
  const [sparkPos, setSparkPos] = useState({ x: 0.5, y: 0.5 });

  // Corners representing the four Pillars
  // Top-Left: Truth Seeker
  // Top-Right: Innovation Driver
  // Bottom-Left: Harmony Builder
  // Bottom-Right: Empathy Carrier
  const corners = [
    { name: Pillar.TRUTH_SEEKER, x: 0, y: 0, color: "from-amber-500/30 to-amber-600/10" },
    { name: Pillar.INNOVATION_DRIVER, x: 1, y: 0, color: "from-orange-500/30 to-orange-600/10" },
    { name: Pillar.HARMONY_BUILDER, x: 0, y: 1, color: "from-yellow-500/30 to-yellow-600/10" },
    { name: Pillar.EMPATHY_CARRIER, x: 1, y: 1, color: "from-amber-400/30 to-amber-500/10" },
  ];

  // Map Pillar state to coordinates
  useEffect(() => {
    if (isDragging) return;

    // Estimate coordinates based on the selected pillars and ratio
    let targetX = 0.5;
    let targetY = 0.5;

    const primaryCorner = corners.find(c => c.name === primaryPillar);
    const secondaryCorner = corners.find(c => c.name === secondaryPillar);

    if (primaryCorner) {
      if (secondaryCorner && secondaryPillar !== "none") {
        const pWeight = ratio / 100;
        const sWeight = (100 - ratio) / 100;
        targetX = primaryCorner.x * pWeight + secondaryCorner.x * sWeight;
        targetY = primaryCorner.y * pWeight + secondaryCorner.y * sWeight;
      } else {
        targetX = primaryCorner.x;
        targetY = primaryCorner.y;
        // Jitter slightly off center of corner so it is not absolute 0 or 1 unless desired
        targetX = targetX === 0 ? 0.05 : 0.95;
        targetY = targetY === 0 ? 0.05 : 0.95;
      }
    }

    setSparkPos({ x: targetX, y: targetY });
  }, [primaryPillar, secondaryPillar, ratio]);

  const calculateBlendFromCoords = (x: number, y: number) => {
    // Calculate inverse distance weights to each corner
    const weights = corners.map(corner => {
      const dx = x - corner.x;
      const dy = y - corner.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Avoid division by zero
      const invDist = dist === 0 ? 1000 : 1 / Math.pow(dist, 1.2);
      return { name: corner.name, weight: invDist };
    });

    // Normalize weights to sum to 100
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    const normalized = weights.map(w => ({
      name: w.name,
      percentage: Math.round((w.weight / totalWeight) * 100),
    }));

    // Sort descending by percentage
    normalized.sort((a, b) => b.percentage - a.percentage);

    const primary = normalized[0].name;
    let secondary: Pillar | "none" = normalized[1].name;
    let calculatedRatio = normalized[0].percentage;

    // If the primary pillar is dominant (>90%), treat it as a pure single-Pillar
    if (calculatedRatio >= 90) {
      calculatedRatio = 100;
      secondary = "none";
    } else {
      // Scale ratio between primary and secondary to sum to 100
      const sumOfTwo = normalized[0].percentage + normalized[1].percentage;
      if (sumOfTwo > 0) {
        calculatedRatio = Math.round((normalized[0].percentage / sumOfTwo) * 100);
      }
    }

    // Safety checks
    if (calculatedRatio < 50) calculatedRatio = 50;
    if (calculatedRatio > 100) calculatedRatio = 100;
    if (calculatedRatio === 100) secondary = "none";

    onChange(primary, secondary, calculatedRatio);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    setIsDragging(true);
    padRef.current.setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !padRef.current) return;

    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setSparkPos({ x, y });
    calculateBlendFromCoords(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (padRef.current) {
      padRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const setManualBlend = (prim: Pillar, sec: Pillar | "none", val: number) => {
    onChange(prim, sec, val);
  };

  return (
    <div id="ccm-stage" className="flex flex-col lg:flex-row gap-8 items-stretch w-full max-w-5xl mx-auto">
      {/* Interactive Spark Coordinate Space */}
      <div className="flex-1 bg-glass border border-gold/20 p-6 flex flex-col justify-between select-none shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden backdrop-blur-md glow-border-amber">
        <div className="absolute inset-0 bg-radial from-gold/5 via-transparent to-transparent pointer-events-none" />
        
        <div>
          <h2 className="text-xl serif italic text-amber-500 flex items-center gap-2">
            <span>SPARK Coordinate Space</span>
            <span className="text-[10px] text-stone-400 font-mono font-normal uppercase tracking-wider">ALPHA-CCM Engine</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1.5 font-sans leading-relaxed">
            Drag the glowing Spark node. Its proximity to the cardinal chambers determines the structural blend and the ratio delivered to the oven.
          </p>
        </div>

        {/* The 2D Interactive Pad */}
        <div 
          ref={padRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative h-64 sm:h-80 w-full mt-6 bg-[#050506] border border-gold/15 cursor-crosshair overflow-hidden touch-none flex items-center justify-center shadow-inner"
        >
          {/* Radial quadrant glow gradients in corners */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-radial from-gold/10 via-transparent to-transparent opacity-60" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-radial from-amber-500/10 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-radial from-amber-600/10 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-radial from-gold-30/15 via-transparent to-transparent opacity-60" />

          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="border-r border-gold h-full" style={{ gridColumnStart: i + 2 }} />
                <div className="border-b border-gold w-full" style={{ gridRowStart: i + 2 }} />
              </React.Fragment>
            ))}
          </div>

          {/* Core axis lines */}
          <div className="absolute left-1/2 top-0 bottom-0 border-l border-gold/15 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 border-b border-gold/15 pointer-events-none" />

          {/* Corner labels */}
          <div className="absolute top-3 left-3 flex flex-col pointer-events-none">
            <span className="serif italic text-xs text-amber-500 tracking-wider">Truth Seeker</span>
            <span className="text-[9px] font-mono tracking-wide text-stone-500 uppercase">Core Facts & Logic</span>
          </div>
          <div className="absolute top-3 right-3 flex flex-col items-end pointer-events-none">
            <span className="serif italic text-xs text-amber-500 tracking-wider">Innovation Driver</span>
            <span className="text-[9px] font-mono tracking-wide text-stone-500 uppercase">Creative Vision</span>
          </div>
          <div className="absolute bottom-3 left-3 flex flex-col pointer-events-none">
            <span className="serif italic text-xs text-amber-500 tracking-wider">Harmony Builder</span>
            <span className="text-[9px] font-mono tracking-wide text-stone-500 uppercase">Collective Peace</span>
          </div>
          <div className="absolute bottom-3 right-3 flex flex-col items-end pointer-events-none">
            <span className="serif italic text-xs text-amber-500 tracking-wider">Empathy Carrier</span>
            <span className="text-[9px] font-mono tracking-wide text-stone-500 uppercase">Deep Connection</span>
          </div>

          {/* Spark Drag Indicator */}
          <motion.div 
            className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center pointer-events-none z-10"
            style={{ left: `${sparkPos.x * 100}%`, top: `${sparkPos.y * 100}%` }}
            animate={{ scale: isDragging ? 1.25 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Pulsing outer ring */}
            <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
            {/* Glowing amber/gold orb */}
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_15px_#D4AF37] border border-amber-200" />
            <span className="absolute w-2 h-2 rounded-full bg-white opacity-60 top-1.5 left-1.5" />
          </motion.div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-stone-400 font-mono bg-[#050506] p-2.5 border border-gold/10">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Coordinate Position // X: {sparkPos.x.toFixed(2)} | Y: {sparkPos.y.toFixed(2)}</span>
        </div>
      </div>

      {/* Manual Recipe Form Selector */}
      <div className="w-full lg:w-96 bg-glass border border-gold/20 p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(212,175,55,0.05)] backdrop-blur-md glow-border-amber">
        <div>
          <h2 className="text-xl serif italic text-amber-500">
            NUGGET Recipe
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Configure the architectural foundations of your companion.
          </p>

          {/* Primary Pillar Selection */}
          <div className="mt-6 flex flex-col gap-1.5">
            <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">Primary Pillar</label>
            <select
              value={primaryPillar}
              onChange={(e) => {
                const newPrim = e.target.value as Pillar;
                let newSec = secondaryPillar;
                if (newSec === newPrim) {
                  newSec = Object.values(Pillar).find(p => p !== newPrim) || "none";
                }
                setManualBlend(newPrim, newSec, ratio);
              }}
              className="w-full bg-[#050506] text-stone-100 border border-gold/20 rounded-none py-2.5 px-3 text-sm focus:outline-none focus:border-gold font-serif italic transition cursor-pointer"
            >
              {Object.values(Pillar).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Secondary Pillar Selection */}
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">Secondary Pillar</label>
            <select
              value={secondaryPillar}
              onChange={(e) => {
                const newSec = e.target.value as Pillar | "none";
                const newRatio = newSec === "none" ? 100 : (ratio === 100 ? 70 : ratio);
                setManualBlend(primaryPillar, newSec, newRatio);
              }}
              className="w-full bg-[#050506] text-stone-100 border border-gold/20 rounded-none py-2.5 px-3 text-sm focus:outline-none focus:border-gold font-serif italic transition cursor-pointer"
            >
              <option value="none">Pure (No Secondary)</option>
              {Object.values(Pillar)
                .filter(p => p !== primaryPillar)
                .map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </div>

          {/* Blend Ratio Slider */}
          {secondaryPillar !== "none" && (
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-stone-400 uppercase tracking-wider">Blend Ratio</span>
                <span className="text-amber-400 font-bold">{ratio} / {100 - ratio}</span>
              </div>
              
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={ratio}
                onChange={(e) => setManualBlend(primaryPillar, secondaryPillar, parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-[#050506] rounded-none appearance-none cursor-pointer border border-gold/15"
              />
              
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>{String(primaryPillar).split(" ")[0]} ({ratio}%)</span>
                <span>{String(secondaryPillar).split(" ")[0]} ({100 - ratio}%)</span>
              </div>
            </div>
          )}

          {/* Formula Split visualization */}
          <div className="mt-6 border border-gold/15 bg-[#050506] p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">Fundamental Slot Split</span>
            <div className="flex h-3 w-full overflow-hidden bg-[#0A0A0B] border border-gold/10">
              <div 
                className="bg-gradient-to-r from-amber-600 to-amber-500 h-full transition-all duration-300"
                style={{ width: `${ratio}%` }}
              />
              {secondaryPillar !== "none" && (
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-full transition-all duration-300"
                  style={{ width: `${100 - ratio}%` }}
                />
              )}
            </div>
            
            <div className="flex justify-between font-mono text-[11px] mt-1 text-stone-400">
              <div className="flex flex-col">
                <span className="font-semibold text-amber-500 text-xs">{(5 * (ratio / 100)).toFixed(2)} slots</span>
                <span className="text-[9px] text-stone-500 uppercase">{String(primaryPillar).split(" ")[0]} Primary</span>
              </div>
              {secondaryPillar !== "none" && (
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-amber-300 text-xs">{(5 * ((100 - ratio) / 100)).toFixed(2)} slots</span>
                  <span className="text-[9px] text-stone-500 uppercase">{String(secondaryPillar).split(" ")[0]} Secondary</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gold/10 flex items-center gap-2 text-[10px] text-stone-400">
          <HelpCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>Fundamental traits are strict counterweights calculated by ALPHA. They remain locked at roll time.</span>
        </div>
      </div>
    </div>
  );
}
