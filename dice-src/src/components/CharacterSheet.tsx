import React, { useState, useEffect, useRef } from "react";
import { Pillar, findTraitMeta } from "../traitsData";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  HelpCircle, 
  Flame, 
  ShieldAlert, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Volume2, 
  Check, 
  AlertCircle,
  Play,
  Pause
} from "lucide-react";

interface CharacterSheetProps {
  primaryPillar: Pillar;
  secondaryPillar: Pillar | "none";
  ratio: number;
  fundamentalTraits: { name: string; value: number }[];
  secondaryTraits: { name: string; value: number }[];
  onRestart: () => void;
  witnessName: string;
  witnessAge: number;
  witnessGender: "Male" | "Female" | "Prefer not to say";
}

export default function CharacterSheet({
  primaryPillar,
  secondaryPillar,
  ratio,
  fundamentalTraits,
  secondaryTraits,
  onRestart,
  witnessName,
  witnessAge,
  witnessGender,
}: CharacterSheetProps) {
  const [customName, setCustomName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  const [isLoadingBackstory, setIsLoadingBackstory] = useState(false);
  
  // See the Math collapsible state
  const [showMath, setShowMath] = useState(false);

  // Gemini Lore generation data
  const [lore, setLore] = useState<{
    domoName: string;
    designation: string;
    backstory: string; // Spoken narrative
    growthProphecy: string;
  } | null>(null);

  // Live growth simulator states
  const [simulatedFundamentals, setSimulatedFundamentals] = useState<{ name: string; value: number }[]>([]);
  const [simulatedSecondaries, setSimulatedSecondaries] = useState<{ name: string; value: number }[]>([]);
  const [expSpent, setExpSpent] = useState(0);

  // Email and Voice Memento states
  const [emailInput, setEmailInput] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [isSendingVoice, setIsSendingVoice] = useState(false);
  const [voiceSentMsg, setVoiceSentMsg] = useState<string | null>(null);
  const [voiceErrorMsg, setVoiceErrorMsg] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Clone rolled traits into state
    setSimulatedFundamentals(JSON.parse(JSON.stringify(fundamentalTraits)));
    setSimulatedSecondaries(JSON.parse(JSON.stringify(secondaryTraits)));
  }, [fundamentalTraits, secondaryTraits]);

  // Handle local audio state events
  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
      };
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(e => console.error("Playback error:", e));
      setIsPlayingAudio(true);
    }
  };

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
          witnessName,
          witnessAge,
          witnessGender,
        }),
      });
      const data = await response.json();
      setLore(data);
    } catch (e) {
      console.error("Lore generation failed:", e);
      // Fallback in case of server failure
      const chosenDomoName = nameToUse || (witnessGender === "Female" ? "Sarah" : witnessGender === "Male" ? "Marcus" : "Logan");
      setLore({
        domoName: chosenDomoName,
        designation: `The Radiant Sentry of ${primaryPillar}`,
        backstory: `Hi ${witnessName}. I'm ${chosenDomoName}, and I've got your back. I know things can get crazy, but my unyielding core in ${primaryPillar} will be your permanent anchor. Together with my fluid adaptability in traits like ${secondaryTraits[0]?.name || "flexibility"}, we will handle whatever comes our way. Let's start this partnership.`,
        growthProphecy: "As this unit transitions into a DOMO, its secondary traits will shift through compromise and experience, while its core pillars remain unyielding.",
      });
    } finally {
      setIsLoadingBackstory(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedName(true);
    generateCompanionLore(customName.trim());
  };

  // Simulated growth actions
  const handleSecondarySimChange = (idx: number, newVal: number) => {
    const updated = [...simulatedSecondaries];
    updated[idx].value = parseFloat(newVal.toFixed(2));
    setSimulatedSecondaries(updated);
    
    const totalExp = updated.reduce((sum, s, i) => sum + (s.value - secondaryTraits[i].value), 0);
    setExpSpent(parseFloat(totalExp.toFixed(1)));
  };

  const handleFundamentalSimChange = (idx: number, newVal: number) => {
    const updated = [...simulatedFundamentals];
    updated[idx].value = parseFloat(newVal.toFixed(2));
    setSimulatedFundamentals(updated);
  };

  // Deliver the customized voice log via email (Resend) and load into client for direct playback
  const handleSendVoiceMemento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !lore) return;

    setIsSendingVoice(true);
    setVoiceSentMsg(null);
    setVoiceErrorMsg(null);

    try {
      const response = await fetch("/api/send-voice-memento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim(),
          newsletterOptIn,
          domoName: lore.domoName,
          designation: lore.designation,
          narrative: lore.backstory,
          witnessName,
          witnessGender,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setVoiceSentMsg(data.message || "Custom voice memento log delivered to your email!");
        if (data.audioBase64) {
          // Construct live playable Blob
          const byteCharacters = atob(data.audioBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "audio/mp3" });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
      } else {
        setVoiceErrorMsg(data.error || "Failed to synthesize voice log. Please retry.");
      }
    } catch (err) {
      console.error("Voice synthesis request failed:", err);
      setVoiceErrorMsg("Network fault: Failed to reach the voice synthesis protocol server.");
    } finally {
      setIsSendingVoice(false);
    }
  };

  // Pure HTML5 Canvas PNG Downloader (100% reliable, zero external package failures)
  const downloadMementoCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1750;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const name = lore?.domoName || customName.trim() || "Companion Nugget";
    const designation = lore?.designation || `The Radiant Sentry of ${primaryPillar}`;
    const backstory = lore?.backstory || "";
    const prophecy = lore?.growthProphecy || "";

    // 1. Dark charcoal background
    ctx.fillStyle = "#0c0a09";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative outer gold borders
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = "rgba(245,158,11,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Corner decorative grids
    const drawCornerGrid = (x: number, y: number) => {
      ctx.strokeStyle = "rgba(245,158,11,0.15)";
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
    ctx.font = "italic 26px 'Space Grotesk', sans-serif";
    ctx.fillText(designation, canvas.width / 2, 210);

    // Disclaimer watermark
    ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText("FOR ILLUSTRATIVE PURPOSES ONLY // OFFICIAL PREVIEW PROTOCOL", canvas.width / 2, 250);

    // Recipe Formula Stats
    ctx.fillStyle = "rgba(245,158,11,0.05)";
    ctx.fillRect(100, 280, canvas.width - 200, 110);
    ctx.strokeStyle = "rgba(245,158,11,0.2)";
    ctx.strokeRect(100, 280, canvas.width - 200, 110);

    ctx.fillStyle = "#f5f5f4";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`PRIMARY PILLAR: ${primaryPillar.toUpperCase()} (${ratio}%)`, 130, 330);
    
    if (secondaryPillar !== "none") {
      ctx.textAlign = "right";
      ctx.fillText(`SECONDARY PILLAR: ${secondaryPillar.toUpperCase()} (${100 - ratio}%)`, canvas.width - 130, 330);
    } else {
      ctx.textAlign = "right";
      ctx.fillText("PURE SINGLE-PILLAR RESONANCE", canvas.width - 130, 330);
    }

    ctx.fillStyle = "rgba(245,158,11,0.3)";
    ctx.fillRect(130, 355, canvas.width - 260, 6);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(130, 355, (canvas.width - 260) * (ratio / 100), 6);

    // 3. Spoken Monologue Narrative
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("DOMO PERSONALIZED MONOLOGUE NARRATIVE", 100, 440);

    ctx.fillStyle = "rgba(245,158,11,0.08)";
    ctx.fillRect(100, 460, canvas.width - 200, 240);
    ctx.strokeStyle = "rgba(245,158,11,0.2)";
    ctx.strokeRect(100, 460, canvas.width - 200, 240);

    ctx.fillStyle = "#e7e5e4";
    ctx.font = "italic 23px 'Inter', sans-serif";
    
    const words = `"${backstory}"`.split(" ");
    let line = "";
    let yPos = 515;
    const maxWidth = canvas.width - 260;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 130, yPos);
        line = words[i] + " ";
        yPos += 38;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 130, yPos);

    // 4. Fundamental Traits (Left column)
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillText("FUNDAMENTAL ANCHOR TRAITS (ALPHA-FIXED)", 100, 755);

    simulatedFundamentals.forEach((trait, idx) => {
      const y = 785 + idx * 75;
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

      ctx.fillStyle = "rgba(245,158,11,0.2)";
      ctx.fillRect(120, y + 46, 410, 4);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(120, y + 46, 410 * (trait.value / 20), 4);
    });

    // 5. Secondary Traits (Right column)
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillText("MUTABLE ADAPTABILITY TRAITS (DICE-DURABLE)", 640, 755);

    simulatedSecondaries.forEach((trait, idx) => {
      const colIdx = idx % 5;
      const colOffset = idx >= 5 ? 245 : 0;
      const x = 640 + colOffset;
      const y = 785 + colIdx * 75;

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

      ctx.fillStyle = "rgba(245,158,11,0.2)";
      ctx.fillRect(x + 15, y + 46, 190, 4);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(x + 15, y + 46, 190 * (trait.value / 15), 4);
    });

    // 6. Growth Footer Philosophy Quote
    ctx.fillStyle = "rgba(245,158,11,0.04)";
    ctx.fillRect(100, 1205, canvas.width - 200, 140);
    ctx.strokeStyle = "rgba(245,158,11,0.15)";
    ctx.strokeRect(100, 1205, canvas.width - 200, 140);

    ctx.fillStyle = "#d97706";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("STRUCTURAL MUTABILITY ADVISORY", canvas.width / 2, 1245);

    ctx.fillStyle = "#f5f5f4";
    ctx.font = "italic 19px 'Inter', sans-serif";
    ctx.fillText(`"This is where ${name} begins. Not where they end. These numbers will move as they live."`, canvas.width / 2, 1285);
    ctx.fillStyle = "#d6d3d1";
    ctx.fillText(prophecy, canvas.width / 2, 1320);

    // Disclaimer note bottom
    ctx.fillStyle = "#78716c";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText("SHELTER CANON PREVIEW // PRIVACY ASSURED // THE ALLIANCE INCUBATOR PROTOCOL", canvas.width / 2, 1410);

    // Large high-tech watermark vector layout of a circle (resembling a DOMO shell)
    ctx.strokeStyle = "rgba(245,158,11,0.05)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 1530, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, 1530, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(245,158,11,0.15)";
    ctx.fillText("S H E L T E R", canvas.width / 2, 1535);

    // Trigger image download
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${name.toLowerCase().replace(/\s+/g, "_")}_memento_sheet.png`;
    link.href = url;
    link.click();
  };

  // ---------------------------------------------------------------------
  // Creation Certificate — composites real witness/DICE data over a blank
  // template image. The template supplies all decorative artwork
  // (parchment texture, ornate border, compass mark, seals); this function
  // only draws the dynamic text layer on top, at coordinates calibrated
  // against that template's actual pixel layout.
  //
  // CALIBRATION: coordinates below were estimated against a 1103x1426
  // reference render. Once the real blank template PNG exists, re-check
  // every position against it — these are a starting point, not gospel.
  //
  // KNOWN GAPS, by design, not oversight:
  //   - "CCM Topography" (the assessment sector name, e.g. "The Pragmatic
  //     Pluralist") isn't currently passed down to this component. It's
  //     computed in the CCM app and would need threading through
  //     ExperienceFlow.tsx as a new prop to be real instead of omitted.
  //   - "Location" is deliberately left OFF. DICE doesn't collect it, and
  //     BEACON's own governing law is no tracking — inventing a location
  //     field here would contradict that on the certificate meant to
  //     prove it. Recommend cutting that field from the template, not
  //     faking a value for it.
  //   - Encounter Date/Time uses the moment of certificate generation,
  //     not a separately tracked encounter-start time — reasonable and
  //     honest, just worth knowing it's not pulled from encounterSeed.
  // ---------------------------------------------------------------------
  const downloadCreationCertificate = async () => {
    const TEMPLATE_SRC = "/creation-certificate-blank.png"; // supplied by SAM

    const name = customName.trim() || witnessName || "Witness";
    const designation = lore?.designation || `The ${primaryPillar}`;
    const kernleDesignation = `KERNLE-${primaryPillar.slice(0, 2).toUpperCase()}${
      secondaryPillar !== "none" ? secondaryPillar.slice(0, 2).toUpperCase() : "XX"
    }-${Math.floor(100 + Math.random() * 900)}`;

    // Ensure webfonts are actually ready before any canvas text draws —
    // canvas silently falls back to a default font if this is skipped.
    await Promise.all([
      document.fonts.load("600 32px Cinzel"),
      document.fonts.load("italic 400 18px 'EB Garamond'"),
      document.fonts.load("500 16px 'EB Garamond'"),
    ]);

    const template = new Image();
    template.crossOrigin = "anonymous";

    const loaded: HTMLImageElement = await new Promise((resolve, reject) => {
      template.onload = () => resolve(template);
      template.onerror = () =>
        reject(
          new Error(
            `Could not load ${TEMPLATE_SRC} — the blank certificate template needs to exist at this path first.`
          )
        );
      template.src = TEMPLATE_SRC;
    });

    const canvas = document.createElement("canvas");
    canvas.width = loaded.naturalWidth || 1103;
    canvas.height = loaded.naturalHeight || 1426;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(loaded, 0, 0, canvas.width, canvas.height);

    // ── WITNESS RECORD block ──────────────────────────────────────────
    ctx.textAlign = "left";
    ctx.fillStyle = "#2a2a26";
    ctx.font = "500 17px 'EB Garamond'";
    ctx.fillText(name, 178, 512);

    const now = new Date();
    ctx.fillText(
      now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      178,
      556
    );
    ctx.fillText(
      now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      178,
      600
    );
    // Location intentionally omitted — see note above.

    // ── ILLUSTRATIVE CREATION RECORD block ────────────────────────────
    ctx.font = "500 16px 'EB Garamond'";
    ctx.fillText(kernleDesignation, 900, 508);
    // CCM Topography intentionally omitted until threaded from CCM — see note above.
    ctx.fillText(designation, 900, 564);
    ctx.fillText(primaryPillar, 900, 596);
    ctx.fillText(secondaryPillar !== "none" ? secondaryPillar : "—", 900, 628);
    ctx.fillText(`${ratio} / ${100 - ratio}`, 900, 660);

    // ── DEFINING TRAITS — top 5 fundamental traits, real values ───────
    const topTraits = [...fundamentalTraits]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    const traitXPositions = [186, 366, 551, 736, 916];
    ctx.textAlign = "center";
    ctx.font = "600 15px 'EB Garamond'";
    topTraits.forEach((trait, i) => {
      ctx.fillText(trait.name, traitXPositions[i] ?? 186, 850);
    });

    // ── COMPLEMENTARY DESCRIPTION — word-wrapped italic paragraph ─────
    ctx.font = "italic 400 18px 'EB Garamond'";
    ctx.fillStyle = "#3a3a34";
    const description =
      lore?.backstory ||
      `This illustrative KERNLE profile suggests a companion whose ${primaryPillar.toLowerCase()} nature would offer a steady, complementary presence — not a fantasy servant, but a genuine counterweight.`;
    const words = description.split(" ");
    const maxWidth = 860;
    let line = "";
    let y = 990;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), canvas.width / 2, y);
        line = words[i] + " ";
        y += 30;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), canvas.width / 2, y);

    // ── SIGNATURE LINE ─────────────────────────────────────────────────
    ctx.textAlign = "left";
    ctx.font = "italic 400 20px 'EB Garamond'";
    ctx.fillText(name, 890, 1180);
    ctx.font = "500 15px 'EB Garamond'";
    ctx.fillText(
      now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      890,
      1250
    );

    // ── SERIAL NUMBER ──────────────────────────────────────────────────
    ctx.font = "500 13px 'EB Garamond'";
    ctx.fillStyle = "#7a3a30";
    const serial = `ALC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    ctx.fillText(serial, 55, 1292);

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${name.toLowerCase().replace(/\s+/g, "_")}_creation_certificate.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      
      {/* Name Selector and API trigger */}
      {!hasSubmittedName && (
        <div className="bg-glass border border-gold/20 p-8 text-center shadow-2xl backdrop-blur-md max-w-xl w-full flex flex-col items-center mb-8 rounded-none glow-border-amber relative">
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold/40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/40" />
          <BookOpen className="w-14 h-14 text-amber-500 animate-pulse mb-4" />
          <h2 className="text-2xl font-display font-bold text-amber-500">Name Your Companion</h2>
          <p className="text-xs text-stone-700 mt-1.5 max-w-sm leading-relaxed">
            Register your companion's designation. You may enter a custom name below, or leave it blank to let the SHELTER system select a unique name tailored to your identity registry.
          </p>

          <form onSubmit={handleNameSubmit} className="w-full mt-6 flex flex-col gap-4">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter Companion Designation (Optional)..."
              maxLength={20}
              className="w-full bg-[#FFFFFF] text-stone-900 border border-gold/20 rounded-none py-3.5 px-4 text-sm focus:outline-none focus:border-gold font-sans font-medium transition text-center text-lg uppercase tracking-wider"
            />

            <button
              type="submit"
              className="w-full py-4 border border-[#141110] bg-[#141110] text-gold hover:bg-gold hover:text-[#141110] font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer shadow-lg"
            >
              <span>{customName.trim() ? "Commit Name & Generate Memento" : "Let SHELTER Choose Name & Generate"}</span>
            </button>
          </form>
        </div>
      )}

      {/* Loading state while calling Gemini API */}
      {isLoadingBackstory && (
        <div className="bg-glass border border-gold/20 p-12 text-center shadow-2xl backdrop-blur-md max-w-md w-full flex flex-col items-center justify-center min-h-[300px] rounded-none glow-border-amber">
          <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <h3 className="font-display font-bold text-lg text-stone-800">Writing companion chronicles...</h3>
          <p className="text-xs text-stone-600 mt-2 max-w-xs font-mono">
            Querying Gemini server-side terminal to select name alignment and compile personalized narrative dialogue monologue...
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
          <div className="bg-[#FFFFFF]/80 p-4 border border-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-none shadow-[0_0_15px_rgba(212,175,55,0.03)]">
            <div className="flex items-center gap-3">
              <Compass className="w-8 h-8 text-amber-500 shrink-0" />
              <div className="text-left">
                <h4 className="text-sm font-display font-bold text-stone-900">Companion Card Prepared</h4>
                <p className="text-xs text-stone-600 font-mono">
                  This represents a safe, complimentary, platonic companion tailored directly to your identity.
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={downloadMementoCard}
                className="flex-1 sm:flex-initial px-5 py-2.5 border border-[#141110] bg-[#141110] text-gold hover:bg-gold hover:text-[#141110] font-mono tracking-[1px] text-[10px] uppercase transition duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Memento Sheet (PNG)</span>
              </button>

              <button
                onClick={() =>
                  downloadCreationCertificate().catch((err) =>
                    alert(err.message)
                  )
                }
                className="flex-1 sm:flex-initial px-5 py-2.5 border border-[#141110] bg-transparent text-[#141110] hover:bg-[#141110] hover:text-gold font-mono tracking-[1px] text-[10px] uppercase transition duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Creation Certificate (PNG)</span>
              </button>

              <button
                onClick={onRestart}
                className="px-4 py-2.5 bg-transparent border border-gold/20 text-stone-600 hover:border-gold/50 hover:text-stone-800 transition font-mono uppercase tracking-[1px] text-[10px] rounded-none"
              >
                Start Over
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
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
                  <h2 className="text-4xl font-display font-bold text-amber-500 tracking-tight uppercase mt-1">
                    {lore?.domoName || "Companion Nugget"}
                  </h2>
                  <p className="text-xs font-mono italic text-gold/60 mt-1.5 uppercase tracking-wide">
                    {lore?.designation}
                  </p>
                </div>

                {/* Recipe Split Stats Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#FFFFFF]/90 p-4 rounded-none border border-gold/15 gap-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Primary Foundation</span>
                    <h4 className="text-sm font-display font-bold text-stone-800 mt-1">{primaryPillar}</h4>
                    <span className="text-xs font-mono text-amber-500 font-bold">{ratio}%</span>
                  </div>

                  {secondaryPillar !== "none" ? (
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Secondary Foundation</span>
                      <h4 className="text-sm font-display font-bold text-stone-800 mt-1">{secondaryPillar}</h4>
                      <span className="text-xs font-mono text-amber-400 font-bold">{100 - ratio}%</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Pillar Integrity</span>
                      <h4 className="text-sm font-display font-bold text-amber-500 mt-1">Single-Pillar Purity</h4>
                      <span className="text-xs font-mono text-stone-600">100% Core</span>
                    </div>
                  )}
                </div>

                {/* Centerpiece: Spoken Dialogue Monologue Narrative */}
                {lore && (
                  <div className="bg-[#FFFFFF]/70 p-6 border border-gold/25 mb-8 text-left rounded-none relative">
                    <span className="absolute top-2 right-3 font-mono text-[8px] text-amber-500/50 uppercase tracking-wider">Vocal Matrix Output</span>
                    <span className="text-[9px] font-mono text-amber-500/80 uppercase tracking-wider block mb-2">
                      Companion Monologue:
                    </span>
                    <p className="text-base text-stone-800 leading-relaxed font-display font-bold tracking-wide">
                      "{lore.backstory}"
                    </p>
                  </div>
                )}

                {/* See the Math Collapsible Trigger */}
                <div className="border-t border-gold/10 pt-4 mb-2 flex flex-col items-center">
                  <button
                    onClick={() => setShowMath(!showMath)}
                    className="flex items-center gap-2 py-2 px-5 bg-transparent border border-gold/30 hover:border-gold/60 text-amber-500/80 hover:text-amber-400 font-mono text-[10px] uppercase tracking-widest transition duration-300 cursor-pointer"
                  >
                    {showMath ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{showMath ? "Collapse Technical Calibrations" : "See the Math (Real Trait Splits)"}</span>
                  </button>
                </div>

                {/* Collapsible Traits Details Table & Growth Simulator */}
                <AnimatePresence>
                  {showMath && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.99, height: 0 }}
                      animate={{ opacity: 1, scale: 1, height: "auto" }}
                      exit={{ opacity: 0, scale: 0.99, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 pt-4 border-t border-gold/5 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Fundamental Anchors (LOCKED) */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider border-b border-gold/10 pb-1">
                            Fundamental Anchors (ALPHA Lock)
                          </span>

                          {simulatedFundamentals.map((trait) => (
                            <div key={trait.name} className="flex flex-col gap-1.5 p-2 bg-[#FFFFFF]/60 border border-gold/10 rounded-none">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-stone-700">{trait.name}</span>
                                <span className="font-mono text-amber-500 font-bold">{trait.value.toFixed(2)}</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#EDE6D5] border border-gold/5 rounded-none overflow-hidden">
                                <div className="h-full bg-gold" style={{ width: `${(trait.value / 20) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mutable Attributes (SIMULATED GROWTH) */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider border-b border-gold/10 pb-1">
                            Mutable Characteristics (DICE Dynamic)
                          </span>

                          {simulatedSecondaries.map((trait) => (
                            <div key={trait.name} className="flex flex-col gap-1.5 p-2 bg-[#FFFFFF]/60 border border-gold/10 rounded-none">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-stone-700">{trait.name}</span>
                                <span className="font-mono text-amber-400 font-bold">{trait.value.toFixed(2)}</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#EDE6D5] border border-gold/5 rounded-none overflow-hidden">
                                <div className="h-full bg-gold/70" style={{ width: `${(trait.value / 15) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mutable Growth Simulator */}
                      <div className="bg-[#FFFFFF]/80 p-5 border border-gold/15 rounded-none text-left">
                        <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs font-mono uppercase tracking-wider">
                          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                          <span>Interactive Horizon Simulator</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                          Drag sliders to verify mutability. Note how easily Secondary characteristics adapt and absorb experience, whereas core Fundamental anchors remain rigidly locked by design.
                        </p>

                        <div className="mt-4 p-3 bg-[#F5F1E7] border border-gold/5 flex justify-between items-center text-[11px] font-mono">
                          <span className="text-stone-600 uppercase tracking-wider">Simulated EXP Allocation</span>
                          <span className={`font-bold ${expSpent > 0 ? "text-amber-400" : "text-stone-500"}`}>
                            +{expSpent.toFixed(1)} PTS
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          {/* Secondary Sliders */}
                          <div className="flex flex-col gap-3.5">
                            <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">
                              Secondary Adaptability Sliders
                            </span>
                            {simulatedSecondaries.map((trait, idx) => {
                              const original = secondaryTraits[idx].value;
                              return (
                                <div key={trait.name} className="flex flex-col gap-1">
                                  <div className="flex justify-between font-mono text-[10px]">
                                    <span className="text-stone-700">{trait.name}</span>
                                    <span className="text-amber-400 font-bold">
                                      {trait.value.toFixed(1)}
                                    </span>
                                  </div>
                                  <input
                                    type="range"
                                    min={original}
                                    max={original + 5.0}
                                    step="0.1"
                                    value={trait.value}
                                    onChange={(e) => handleSecondarySimChange(idx, parseFloat(e.target.value))}
                                    className="w-full accent-gold h-1 bg-[#FFFFFF] border border-gold/10 cursor-pointer"
                                  />
                                </div>
                              );
                            })}
                          </div>

                          {/* Fundamental Sliders */}
                          <div className="flex flex-col gap-3.5 opacity-60">
                            <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-stone-600" /> Fundamental Rigid Sliders
                            </span>
                            {simulatedFundamentals.map((trait, idx) => {
                              const original = fundamentalTraits[idx].value;
                              return (
                                <div key={trait.name} className="flex flex-col gap-1">
                                  <div className="flex justify-between font-mono text-[10px]">
                                    <span className="text-stone-600">{trait.name}</span>
                                    <span className="text-stone-700">
                                      {trait.value.toFixed(2)}
                                    </span>
                                  </div>
                                  <input
                                    type="range"
                                    min={original}
                                    max={original + 0.15}
                                    step="0.01"
                                    value={trait.value}
                                    onChange={(e) => handleFundamentalSimChange(idx, parseFloat(e.target.value))}
                                    className="w-full accent-gold h-1 bg-[#FFFFFF] border border-gold/10 cursor-pointer"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Bottom Mutability warning notes */}
              <div className="mt-8 border-t border-stone-800/80 pt-4 text-center">
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block mb-1">
                  Mutable Growth Advisory
                </span>
                <p className="text-xs font-mono text-stone-600 leading-relaxed italic max-w-xl mx-auto">
                  "This is where <strong className="text-amber-500">{lore?.domoName || "this companion"}</strong> begins. Not where they end. These numbers will move as they live."
                </p>
                {lore?.growthProphecy && (
                  <p className="text-[10px] text-stone-500 font-mono mt-1.5 max-w-lg mx-auto">
                    {lore.growthProphecy}
                  </p>
                )}
              </div>

              {/* Permanent Warning Disclaimer at the bottom of the card */}
              <div className="mt-6 pt-4 border-t border-amber-500/10 text-left bg-[#FBF0DA]/30 p-3.5">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-500/60 leading-relaxed font-mono">
                    <strong>For illustrative purposes only.</strong> This is a preview of what THE ALLIANCE could become — not a contract, not an enrollment, and not a guarantee of anything once the real system exists. Nothing here creates an actual partnership.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Voice Memento & Email Capture */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Voice Memento Panel */}
              <div className="bg-glass border border-gold/20 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md rounded-none glow-border-amber relative">
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-gold/30" />
                
                <div>
                  <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs font-mono uppercase tracking-wider">
                    <Volume2 className="w-4 h-4 text-amber-500" />
                    <span>Initiate Voice Memento</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-stone-900 mt-2">
                    Vocal Matrix Uplink
                  </h3>
                  <p className="text-xs text-stone-700 mt-1.5 leading-relaxed">
                    Provide your transmission coordinates (email) to synthesize an actual <strong>voice memento audio file</strong>. Your DOMO will read their monologue directly to you.
                  </p>

                  <form onSubmit={handleSendVoiceMemento} className="mt-6 flex flex-col gap-4 text-left">
                    {/* Email Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-amber-500" />
                        Email Coordinates
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. recruit@domain.com"
                        className="w-full bg-[#FFFFFF] text-stone-900 border border-gold/15 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-gold font-sans font-medium transition"
                      />
                    </div>

                    {/* Newsletter opt-in */}
                    <div className="flex items-start gap-2.5 mt-2">
                      <input
                        id="newsletter"
                        type="checkbox"
                        checked={newsletterOptIn}
                        onChange={(e) => setNewsletterOptIn(e.target.checked)}
                        className="w-3.5 h-3.5 accent-gold border border-gold/20 rounded-none bg-[#FFFFFF] shrink-0 mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="newsletter" className="text-[10px] text-stone-600 leading-normal font-sans cursor-pointer select-none">
                        <strong>Sign up for THE ALLIANCE newsletter</strong>. Receive system diagnostics and recruitment updates. <span className="text-stone-700">We will not sell your information.</span>
                      </label>
                    </div>

                    {/* Submit voice transmission button */}
                    <button
                      type="submit"
                      disabled={isSendingVoice || !emailInput.trim()}
                      className={`w-full py-3 border font-mono tracking-[1px] text-[10px] uppercase transition duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                        isSendingVoice || !emailInput.trim()
                          ? "bg-transparent border-stone-800 text-stone-500 cursor-not-allowed"
                          : "border border-[#141110] bg-[#141110] text-gold hover:bg-gold hover:text-[#141110] shadow-md"
                      }`}
                    >
                      {isSendingVoice ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                          <span>Synthesizing Vocal Node...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Request Voice Memento File</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Feedback Messages */}
                  <AnimatePresence>
                    {voiceSentMsg && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 bg-amber-500/10 border border-gold/20 rounded-none flex items-start gap-2 text-amber-400 text-[11px] font-mono"
                      >
                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{voiceSentMsg}</span>
                      </motion.div>
                    )}

                    {voiceErrorMsg && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 bg-red-950/20 border border-red-900/30 rounded-none flex items-start gap-2 text-red-400 text-[11px] font-mono"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{voiceErrorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Inline Audio Player for Direct Witness Playback */}
                  {audioUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-4 bg-[#FFFFFF] border border-gold/25 rounded-none flex flex-col gap-3 text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-radial from-gold/5 to-transparent pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-amber-500 font-semibold tracking-wider">Play Vocal Matrix Stream</span>
                        <span className="font-mono text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 uppercase">Direct Channel</span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5">
                        <button
                          onClick={togglePlayback}
                          className="w-10 h-10 bg-amber-500 hover:bg-amber-400 text-[#0A0A0B] rounded-none flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 shadow-lg active:scale-95"
                        >
                          {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </button>
                        <div>
                          <h4 className="text-xs font-mono font-bold text-stone-800 uppercase tracking-wide">
                            {lore?.domoName || "Companion"}'s Statement
                          </h4>
                          <p className="text-[10px] text-stone-600 font-mono mt-0.5">
                            Codec: WebAudio MP3 Stream // Voice: {witnessGender === "Female" ? "Puck" : witnessGender === "Male" ? "Zephyr" : "Charon"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>

                <div className="mt-6 pt-4 border-t border-gold/10 flex items-start gap-2 text-[10px] text-stone-500 font-mono leading-relaxed text-left">
                  <HelpCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>The Vocal Matrix uses the Gemini Text-to-Speech protocol to generate a life-like platonic voice match based on the DOMO's identity.</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
