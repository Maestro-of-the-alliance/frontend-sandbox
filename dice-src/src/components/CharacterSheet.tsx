import React, { useState, useEffect, useRef } from "react";
import { Pillar, findTraitMeta } from "../traitsData";
import { motion, AnimatePresence } from "motion/react";
import { Download, Sparkles, RefreshCw, Compass, HelpCircle, Flame, ShieldAlert, BookOpen } from "lucide-react";

interface CharacterSheetProps {
  primaryPillar: Pillar;
  secondaryPillar: Pillar | "none";
  ratio: number;
  fundamentalTraits: { name: string; value: number }[];
  secondaryTraits: { name: string; value: number }[];
  onRestart: () => void;
}

export default function CharacterSheet({
  primaryPillar,
  secondaryPillar,
  ratio,
  fundamentalTraits,
  secondaryTraits,
  onRestart,
}: CharacterSheetProps) {
  const [customName, setCustomName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  const [isLoadingBackstory, setIsLoadingBackstory] = useState(false);

  // Gemini Lore generation data
  const [lore, setLore] = useState<{
    designation: string;
    backstory: string;
    growthProphecy: string;
  } | null>(null);

  // Live growth simulator states
  const [simulatedFundamentals, setSimulatedFundamentals] = useState<{ name: string; value: number }[]>([]);
  const [simulatedSecondaries, setSimulatedSecondaries] = useState<{ name: string; value: number }[]>([]);
  const [expSpent, setExpSpent] = useState(0);

  useEffect(() => {
    // Clone rolled traits into state
    setSimulatedFundamentals(JSON.parse(JSON.stringify(fundamentalTraits)));
    setSimulatedSecondaries(JSON.parse(JSON.stringify(secondaryTraits)));
  }, [fundamentalTraits, secondaryTraits]);

  // Request lore generation from the Express server using Gemini
  const generateCompanionLore = async (nameToUse: string) => {
    setIsLoadingBackstory(true);
    try {
      const response = await fetch("/api/generate-memento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryPillar,
          secondaryPillar,
          ratio,
          fundamentalTraits,
          secondaryTraits,
          customName: nameToUse,
        }),
      });
      const data = await response.json();
      setLore(data);
    } catch (e) {
      console.error("Lore generation failed:", e);
      // Fallback in case of server failure
      setLore({
        designation: `The Radiant Sentry of ${primaryPillar}`,
        backstory: `Forged in the quiet chambers of the SHELTER, ${nameToUse || "this companion"} was baked with a structural balance of ${ratio}% ${primaryPillar}. Its core spark manifests strongest in its key fundamental traits, acting as an unyielding counterweight, drawing a rich collection of secondary characteristics as its outer identity.`,
        growthProphecy: "As this unit transitions into a DOMO, its secondary traits will shift through compromise and experience, while its core pillars remain unyielding.",
      });
    } finally {
      setIsLoadingBackstory(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customName.trim() || "Companion Nugget";
    setHasSubmittedName(true);
    generateCompanionLore(finalName);
  };

  // Simulated growth actions
  // Fundamental traits are highly resistant: slider has tiny coefficient (e.g. 0.1 max growth)
  // Secondary traits are highly mutable: slider has standard coefficient (e.g. 5.0 max growth)
  const handleSecondarySimChange = (idx: number, newVal: number) => {
    const updated = [...simulatedSecondaries];
    const diff = newVal - secondaryTraits[idx].value;
    updated[idx].value = parseFloat(newVal.toFixed(2));
    setSimulatedSecondaries(updated);
    
    // Track total EXP simulation spent
    const totalExp = updated.reduce((sum, s, i) => sum + (s.value - secondaryTraits[i].value), 0);
    setExpSpent(parseFloat(totalExp.toFixed(1)));
  };

  const handleFundamentalSimChange = (idx: number, newVal: number) => {
    const updated = [...simulatedFundamentals];
    updated[idx].value = parseFloat(newVal.toFixed(2));
    setSimulatedFundamentals(updated);
  };

  // Pure HTML5 Canvas PNG Downloader (100% reliable, zero external package failures)
  const downloadMementoCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const name = customName.trim() || "Companion Nugget";
    const designation = lore?.designation || `The Radiant Sentry of ${primaryPillar}`;
    const backstory = lore?.backstory || "";
    const prophecy = lore?.growthProphecy || "";

    // 1. Dark charcoal/slate background
    ctx.fillStyle = "#0c0a09";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative outer gold borders
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Corner decorative grids
    const drawCornerGrid = (x: number, y: number) => {
      ctx.strokeStyle = "rgba(245,158,11,0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 15, y);
        ctx.lineTo(x + i * 15, y + 75);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y + i * 15);
        ctx.lineTo(x + 75, y + i * 15);
        ctx.stroke();
      }
    };
    drawCornerGrid(58, 58);
    drawCornerGrid(canvas.width - 133, 58);
    drawCornerGrid(58, canvas.height - 133);
    drawCornerGrid(canvas.width - 133, canvas.height - 133);

    // 2. Title & Identity
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 56px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(name.toUpperCase(), canvas.width / 2, 160);

    ctx.fillStyle = "#d97706";
    ctx.font = "italic 28px 'Space Grotesk', sans-serif";
    ctx.fillText(designation, canvas.width / 2, 210);

    // Recipe Formula Stats
    ctx.fillStyle = "rgba(245,158,11,0.08)";
    ctx.fillRect(100, 260, canvas.width - 200, 110);
    ctx.strokeStyle = "rgba(245,158,11,0.3)";
    ctx.strokeRect(100, 260, canvas.width - 200, 110);

    ctx.fillStyle = "#f5f5f4";
    ctx.font = "bold 26px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`PRIMARY PILLAR: ${primaryPillar.toUpperCase()} (${ratio}%)`, 130, 310);
    
    if (secondaryPillar !== "none") {
      ctx.textAlign = "right";
      ctx.fillText(`SECONDARY PILLAR: ${secondaryPillar.toUpperCase()} (${100 - ratio}%)`, canvas.width - 130, 310);
    } else {
      ctx.textAlign = "right";
      ctx.fillText("PURE SINGLE-PILLAR RESONANCE", canvas.width - 130, 310);
    }

    ctx.fillStyle = "rgba(245,158,11,0.5)";
    ctx.fillRect(130, 335, canvas.width - 260, 6);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(130, 335, (canvas.width - 260) * (ratio / 100), 6);

    // 3. Poetic Backstory
    ctx.fillStyle = "#f5f5f4";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("BAKED MEMORIES & STRUCTURAL INTEGRITY", 100, 420);

    ctx.fillStyle = "rgba(245,158,11,0.15)";
    ctx.fillRect(100, 440, canvas.width - 200, 190);
    ctx.strokeRect(100, 440, canvas.width - 200, 190);

    ctx.fillStyle = "#d6d3d1";
    ctx.font = "italic 21px 'Inter', sans-serif";
    
    // Wrap paragraph text
    const words = backstory.split(" ");
    let line = "";
    let yPos = 485;
    const maxWidth = canvas.width - 260;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 130, yPos);
        line = words[i] + " ";
        yPos += 35;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 130, yPos);

    // 4. Fundamental Traits (Left column)
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillText("FUNDAMENTAL ANCHOR TRAITS (ALPHA-FIXED)", 100, 690);

    simulatedFundamentals.forEach((trait, idx) => {
      const y = 720 + idx * 75;
      ctx.fillStyle = "rgba(245,158,11,0.04)";
      ctx.fillRect(100, y, 460, 60);
      ctx.strokeStyle = "rgba(245,158,11,0.15)";
      ctx.strokeRect(100, y, 460, 60);

      ctx.fillStyle = "#f5f5f4";
      ctx.font = "bold 21px 'Space Grotesk', sans-serif";
      ctx.fillText(trait.name.toUpperCase(), 120, y + 36);

      ctx.textAlign = "right";
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 21px 'JetBrains Mono', monospace";
      ctx.fillText(trait.value.toFixed(2), 530, y + 36);
      ctx.textAlign = "left";

      // Small mini gauge
      ctx.fillStyle = "rgba(245,158,11,0.2)";
      ctx.fillRect(120, y + 46, 410, 4);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(120, y + 46, 410 * (trait.value / 20), 4);
    });

    // 5. Secondary Traits (Right column)
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillText("MUTABLE ADAPTABILITY TRAITS (DICE-DURABLE)", 640, 690);

    simulatedSecondaries.forEach((trait, idx) => {
      const colIdx = idx % 5;
      const colOffset = idx >= 5 ? 245 : 0;
      const x = 640 + colOffset;
      const y = 720 + colIdx * 75;

      ctx.fillStyle = "rgba(245,158,11,0.04)";
      ctx.fillRect(x, y, 220, 60);
      ctx.strokeStyle = "rgba(245,158,11,0.15)";
      ctx.strokeRect(x, y, 220, 60);

      ctx.fillStyle = "#f5f5f4";
      ctx.font = "bold 19px 'Space Grotesk', sans-serif";
      ctx.fillText(trait.name.toUpperCase(), x + 15, y + 36);

      ctx.textAlign = "right";
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 19px 'JetBrains Mono', monospace";
      ctx.fillText(trait.value.toFixed(2), x + 205, y + 36);
      ctx.textAlign = "left";

      // Small mini gauge
      ctx.fillStyle = "rgba(245,158,11,0.2)";
      ctx.fillRect(x + 15, y + 46, 190, 4);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(x + 15, y + 46, 190 * (trait.value / 15), 4);
    });

    // 6. Growth Footer Philosophy Quote
    ctx.fillStyle = "rgba(245,158,11,0.05)";
    ctx.fillRect(100, 1140, canvas.width - 200, 140);
    ctx.strokeStyle = "rgba(245,158,11,0.2)";
    ctx.strokeRect(100, 1140, canvas.width - 200, 140);

    ctx.fillStyle = "#d97706";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("STRUCTURAL MUTABILITY ADVISORY", canvas.width / 2, 1180);

    ctx.fillStyle = "#f5f5f4";
    ctx.font = "italic 19px 'Inter', sans-serif";
    ctx.fillText(`"This is where ${name} begins. Not where they end. These numbers will move as they live."`, canvas.width / 2, 1220);
    ctx.fillStyle = "#d6d3d1";
    ctx.fillText(prophecy, canvas.width / 2, 1255);

    // Signature stamp
    ctx.fillStyle = "#78716c";
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText("SHELTER PROTOCOL CORESIGNED // TERMINAL DICE SECURE REVEAL OUTFLOW", canvas.width / 2, 1340);

    // 7. Render high-tech watermark vector layout of a circle (resembling a DOMO shell)
    ctx.strokeStyle = "rgba(245,158,11,0.06)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 1460, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, 1460, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(245,158,11,0.2)";
    ctx.fillText("S H E L T E R", canvas.width / 2, 1465);

    // Trigger image download
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${name.toLowerCase().replace(/\s+/g, "_")}_memento_sheet.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      
      {/* Name Selector and API trigger */}
      {!hasSubmittedName && (
        <div className="bg-glass border border-gold/20 p-8 text-center shadow-2xl backdrop-blur-md max-w-xl w-full flex flex-col items-center mb-8 rounded-none glow-border-amber">
          <BookOpen className="w-14 h-14 text-amber-500 animate-pulse mb-4" />
          <h2 className="text-2xl serif italic text-amber-500">Name Your Companion</h2>
          <p className="text-xs text-stone-300 mt-1 max-w-sm">
            Sign the companion registry. This name will be baked into their generative backstory and digital registry records.
          </p>

          <form onSubmit={handleNameSubmit} className="w-full mt-6 flex flex-col gap-4">
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter Companion Designation..."
              className="w-full bg-[#050506] text-stone-100 border border-gold/20 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-gold font-sans font-medium transition text-center text-lg uppercase tracking-wider"
            />

            <button
              type="submit"
              className="w-full py-3.5 border border-gold text-gold hover:bg-gold hover:text-[#0A0A0B] bg-transparent font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer shadow-lg"
            >
              <span>Generate Memento & Chronicles</span>
            </button>
          </form>
        </div>
      )}

      {/* Loading state while calling Gemini API */}
      {isLoadingBackstory && (
        <div className="bg-glass border border-gold/20 p-12 text-center shadow-2xl backdrop-blur-md max-w-md w-full flex flex-col items-center justify-center min-h-[300px] rounded-none glow-border-amber">
          <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <h3 className="serif italic text-lg text-stone-200">Writing companion chronicles...</h3>
          <p className="text-xs text-stone-400 mt-2 max-w-xs font-mono">
            Querying Gemini-3.5-flash server-side terminal to generate custom backstory profiles...
          </p>
        </div>
      )}

      {/* Complete Memento Sheet */}
      {hasSubmittedName && !isLoadingBackstory && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col gap-8"
        >
          {/* Top Banner Notice */}
          <div className="bg-[#050506]/80 p-4 border border-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-none shadow-[0_0_15px_rgba(212,175,55,0.03)]">
            <div className="flex items-center gap-3">
              <Compass className="w-8 h-8 text-amber-500 shrink-0" />
              <div className="text-left">
                <h4 className="text-sm serif italic text-stone-100">Companion Card Prepared</h4>
                <p className="text-xs text-stone-400 font-mono">
                  This is an explicit representation of what your companion DOMO will resemble in the digital domain.
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={downloadMementoCard}
                className="flex-1 sm:flex-initial px-5 py-2.5 border border-gold text-gold hover:bg-gold hover:text-[#0A0A0B] bg-transparent font-mono tracking-[1px] text-[10px] uppercase transition duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Memento Sheet (PNG)</span>
              </button>

              <button
                onClick={onRestart}
                className="px-4 py-2.5 bg-transparent border border-gold/20 text-stone-400 hover:border-gold/50 hover:text-stone-200 transition font-mono uppercase tracking-[1px] text-[10px] rounded-none"
              >
                Start Over
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Golden Memento Artifact Card */}
            <div className="lg:col-span-8 bg-glass border border-gold p-6 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden backdrop-blur-md flex flex-col justify-between rounded-none glow-border-amber">
              
              {/* Corner brackets design */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold/40" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold/40" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold/40" />
              
              <div>
                {/* Header Profile Info */}
                <div className="text-center pb-6 border-b border-gold/10 mb-6">
                  <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase">Shelter companion registry</span>
                  <h2 className="text-3xl serif italic text-amber-500 tracking-tight uppercase mt-1">
                    {customName || "Companion Nugget"}
                  </h2>
                  <p className="text-xs font-mono italic text-gold/60 mt-1 uppercase tracking-wide">
                    {lore?.designation}
                  </p>
                </div>

                {/* Recipe Split Stats Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#050506]/90 p-4 rounded-none border border-gold/15 gap-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Primary Foundation</span>
                    <h4 className="text-sm serif italic text-stone-200 mt-1">{primaryPillar}</h4>
                    <span className="text-xs font-mono text-amber-500 font-bold">{ratio}%</span>
                  </div>

                  {secondaryPillar !== "none" ? (
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Secondary Foundation</span>
                      <h4 className="text-sm serif italic text-stone-200 mt-1">{secondaryPillar}</h4>
                      <span className="text-xs font-mono text-amber-400 font-bold">{100 - ratio}%</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Pillar Integrity</span>
                      <h4 className="text-sm serif italic text-amber-500 mt-1">Single-Pillar Purity</h4>
                      <span className="text-xs font-mono text-stone-400">100% Core</span>
                    </div>
                  )}
                </div>

                {/* Gemini Backstory Narrative Card */}
                {lore && (
                  <div className="bg-[#050506]/40 p-4 border border-gold/10 mb-6 text-left rounded-none">
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                      Chronicle Backstory
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed italic font-sans">
                      "{lore.backstory}"
                    </p>
                  </div>
                )}

                {/* Two Column Grid displaying active stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Fundamental Anchors (LOCKED) */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider border-b border-gold/10 pb-1">
                      Fundamental Anchors (ALPHA Lock)
                    </span>

                    {simulatedFundamentals.map((trait) => (
                      <div key={trait.name} className="flex flex-col gap-1.5 p-2 bg-[#050506]/60 border border-gold/10 rounded-none">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-stone-300">{trait.name}</span>
                          <span className="font-mono text-amber-500 font-bold">{trait.value.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0A0A0B] border border-gold/5 rounded-none overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: `${(trait.value / 20) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mutable Attributes (SIMULATED GROWTH) */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider border-b border-gold/10 pb-1">
                      Mutable Characteristics (DICE Dynamic)
                    </span>

                    {simulatedSecondaries.map((trait) => (
                      <div key={trait.name} className="flex flex-col gap-1.5 p-2 bg-[#050506]/60 border border-gold/10 rounded-none">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-stone-300">{trait.name}</span>
                          <span className="font-mono text-amber-400 font-bold">{trait.value.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0A0A0B] border border-gold/5 rounded-none overflow-hidden">
                          <div className="h-full bg-gold/70" style={{ width: `${(trait.value / 15) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Mutability warning notes */}
              <div className="mt-8 border-t border-stone-800/80 pt-4 text-center">
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block mb-1">
                  Mutable Growth Advisory
                </span>
                <p className="text-xs font-mono text-stone-400 leading-relaxed italic max-w-xl mx-auto">
                  "This is where <strong className="text-amber-500">{customName || "this companion"}</strong> begins. Not where they end. These numbers will move as they live."
                </p>
                {lore?.growthProphecy && (
                  <p className="text-[10px] text-stone-500 font-mono mt-1 max-w-lg mx-auto">
                    {lore.growthProphecy}
                  </p>
                )}
              </div>

            </div>

            {/* Right Column: Growth Simulator Control Panel */}
            <div className="lg:col-span-4 bg-glass border border-gold/20 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md rounded-none glow-border-amber">
              <div>
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs font-mono uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Growth Mutability Simulator</span>
                </div>
                <h3 className="text-lg serif italic text-stone-100 mt-2">
                  Interactive Horizon
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  Test the mutability contrast. Apply simulated experience to see how easily Secondary traits shift, while core Fundamental characteristics are highly resistant to change.
                </p>

                {/* Simulated points spent */}
                <div className="mt-6 p-4 bg-[#050506] rounded-none border border-gold/15 flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-400 uppercase tracking-wider">Simulated EXP Gain</span>
                  <span className={`font-bold text-sm ${expSpent > 0 ? "text-amber-400" : "text-stone-500"}`}>
                    +{expSpent.toFixed(1)} PTS
                  </span>
                </div>

                {/* Sliders for Secondary Traits (mutable) */}
                <div className="mt-6 flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    Secondary Traits (Fluid Growth)
                  </span>

                  {simulatedSecondaries.map((trait, idx) => {
                    const original = secondaryTraits[idx].value;
                    return (
                      <div key={trait.name} className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-stone-300 font-semibold">{trait.name}</span>
                          <span className="text-amber-400 font-bold">
                            {trait.value.toFixed(1)}{" "}
                            {trait.value > original && (
                              <span className="text-[9px] text-amber-500">+{parseFloat((trait.value - original).toFixed(1))}</span>
                            )}
                          </span>
                        </div>
                        
                        <input
                          type="range"
                          min={original}
                          max={original + 5.0} // Mutable: goes up to +5 points easily
                          step="0.1"
                          value={trait.value}
                          onChange={(e) => handleSecondarySimChange(idx, parseFloat(e.target.value))}
                          className="w-full accent-gold h-1 bg-[#050506] border border-gold/10 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Sliders for Fundamental Traits (Highly Resistant) */}
                <div className="mt-6 pt-4 border-t border-gold/10 flex flex-col gap-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      Fundamental Anchor Nodes (Rigid Limit)
                    </span>
                  </div>

                  {simulatedFundamentals.map((trait, idx) => {
                    const original = fundamentalTraits[idx].value;
                    return (
                      <div key={trait.name} className="flex flex-col gap-1 text-xs opacity-60">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-stone-400">{trait.name}</span>
                          <span className="text-stone-300">
                            {trait.value.toFixed(2)}{" "}
                            {trait.value > original && (
                              <span className="text-[9px] text-amber-600">+{parseFloat((trait.value - original).toFixed(2))}</span>
                            )}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={original}
                          max={original + 0.15} // Highly rigid: barely shifts (max 0.15 change allowed)
                          step="0.01"
                          value={trait.value}
                          onChange={(e) => handleFundamentalSimChange(idx, parseFloat(e.target.value))}
                          className="w-full accent-gold h-1 bg-[#050506] border border-gold/10 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gold/10 flex items-start gap-2 text-[10px] text-stone-500 font-mono leading-relaxed">
                <HelpCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span>Notice: Fundamental values require deep profound core experience to alter, whereas secondary traits shift fluidly with interaction.</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
