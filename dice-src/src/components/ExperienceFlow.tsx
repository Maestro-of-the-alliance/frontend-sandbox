import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import DissolveLine from "./DissolveLine";
import ProcessingBeat from "./ProcessingBeat";
import { Pillar, PILLAR_FUNDAMENTAL_POOL, findTraitMeta, rollSecondaryTraits } from "../traitsData";

type Phase =
  | "welcome"
  | "commencing"
  | "beat1"
  | "please_answer"
  | "ask_name"
  | "greet_name"
  | "ask_age"
  | "ask_gender"
  | "beat2"
  | "phase_one_complete"
  | "phase_two_commencing"
  | "phase_two_blurb"
  | "weighting"
  | "thank_you"
  | "build_complete_1"
  | "beat3"
  | "kernle_id"
  | "description"
  | "email"
  | "ready_academy"
  | "countdown";

const CORNERS = [
  { name: Pillar.TRUTH_SEEKER, x: 0, y: 0 },
  { name: Pillar.INNOVATION_DRIVER, x: 1, y: 0 },
  { name: Pillar.HARMONY_BUILDER, x: 0, y: 1 },
  { name: Pillar.EMPATHY_CARRIER, x: 1, y: 1 },
];

// The CCM assessment passes real per-person coordinates via ?x=&y= on a
// -10..+10 scale per axis. Without this, every visitor silently got the
// same default build — this is what makes each person's result unique.
function deriveBlendFromUrl(): { primary: Pillar; secondary: Pillar | "none"; ratio: number } {
  const params = new URLSearchParams(window.location.search);
  const rawX = parseFloat(params.get("x") || "");
  const rawY = parseFloat(params.get("y") || "");
  const hasCoords = !isNaN(rawX) && !isNaN(rawY);

  // normalize -10..+10 to 0..1
  const x = hasCoords ? Math.min(1, Math.max(0, (rawX + 10) / 20)) : 0.5;
  const y = hasCoords ? Math.min(1, Math.max(0, (rawY + 10) / 20)) : 0.5;

  const weights = CORNERS.map((c) => {
    const dx = x - c.x;
    const dy = y - c.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const invDist = dist === 0 ? 1000 : 1 / Math.pow(dist, 1.2);
    return { name: c.name, weight: invDist };
  });
  const total = weights.reduce((s, w) => s + w.weight, 0);
  const normalized = weights
    .map((w) => ({ name: w.name, pct: (w.weight / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const primary = normalized[0].name;
  let secondary: Pillar | "none" = normalized[1].name;
  let ratio = normalized[0].pct;

  if (ratio >= 90) {
    ratio = 100;
    secondary = "none";
  } else {
    const sumTwo = normalized[0].pct + normalized[1].pct;
    ratio = sumTwo > 0 ? Math.round((normalized[0].pct / sumTwo) * 100) : 70;
  }

  return { primary, secondary, ratio: Math.round(ratio) };
}

const KERNLE_ID = `KERNLE-${Math.floor(2000 + Math.random() * 900)}`;

export default function ExperienceFlow({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [name, setName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [ageDraft, setAgeDraft] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [weightIndex, setWeightIndex] = useState(0);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(3);

  const { primary, secondary, ratio } = useMemo(() => deriveBlendFromUrl(), []);
  const traitPool = PILLAR_FUNDAMENTAL_POOL[primary].slice(0, 5);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown, onComplete]);

  const finishWeighting = () => {
    const totalWeight = traitPool.reduce((s, t) => s + (weights[t] || 3), 0);
    let values = traitPool.map((t) => {
      const w = weights[t] || 3;
      const share = w / totalWeight;
      return 15 + share * 25;
    });
    for (let i = 0; i < 30; i++) {
      let sum = values.reduce((a, b) => a + b, 0);
      const diff = 100 - sum;
      if (Math.abs(diff) < 0.01) break;
      values = values.map((v) => Math.max(15, Math.min(20, v + diff / values.length)));
    }
    return traitPool.map((name, i) => ({ name, value: parseFloat(values[i].toFixed(2)) }));
  };

  const [fundamentalResult, setFundamentalResult] = useState<{ name: string; value: number }[]>([]);
  const [secondaryResult, setSecondaryResult] = useState<{ name: string; value: number }[]>([]);

  const goToReveal = () => {
    const fundamental = finishWeighting();
    setFundamentalResult(fundamental);
    setSecondaryResult(
      rollSecondaryTraits(primary, secondary, ratio, fundamental.map((f) => f.name))
    );
    setPhase("thank_you");
  };

  const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

  const plainLanguageDescription = () => {
    if (fundamentalResult.length === 0) return "";
    const top = [...fundamentalResult].sort((a, b) => b.value - a.value).slice(0, 2);
    const secTop = [...secondaryResult].sort((a, b) => b.value - a.value).slice(0, 1);
    const descs = [...top, ...secTop].map((t) => findTraitMeta(t.name).description);
    return `${name ? name + "'s" : "Your"} companion, above all, ${lowerFirst(descs[0])} On top of that, ${lowerFirst(descs[1])}${descs[2] ? " And in quieter moments, " + lowerFirst(descs[2]) : ""}`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 relative" style={{ background: "#0A0E1A" }}>
      <div className="w-full max-w-lg flex flex-col items-center justify-center text-white" style={{ minHeight: "60vh" }}>
        <AnimatePresence mode="wait">

          {phase === "welcome" && (
            <DissolveLine
              key="welcome"
              text="Welcome"
              holdMs={1800}
              className="text-4xl font-display font-light tracking-widest"
              onDone={() => setPhase("commencing")}
            />
          )}

          {phase === "commencing" && (
            <DissolveLine
              key="commencing"
              text="Nugget Creation Commencing"
              holdMs={1800}
              className="text-xl font-mono tracking-[0.2em] uppercase text-amber-300/90"
              onDone={() => setPhase("beat1")}
            />
          )}

          {phase === "beat1" && (
            <motion.div key="beat1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingBeatTimed durationMs={5500} onDone={() => setPhase("please_answer")} />
            </motion.div>
          )}

          {phase === "please_answer" && (
            <DissolveLine
              key="please_answer"
              text="Please Answer to Proceed"
              holdMs={1400}
              className="text-lg font-mono tracking-[0.15em] uppercase text-white/70"
              onDone={() => setPhase("ask_name")}
            />
          )}

          {phase === "ask_name" && (
            <QuestionCard key="ask_name">
              <p className="text-2xl font-display mb-8">What's your name?</p>
              <SimpleInput
                value={nameDraft}
                onChange={setNameDraft}
                onSubmit={() => {
                  const trimmed = nameDraft.trim();
                  setName(trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
                  setPhase("greet_name");
                }}
                placeholder=""
                autoFocus
              />
            </QuestionCard>
          )}

          {phase === "greet_name" && (
            <DissolveLine
              key="greet_name"
              text={`Hi, ${name}. Nice to meet you.`}
              holdMs={1500}
              className="text-2xl font-display"
              onDone={() => setPhase("ask_age")}
            />
          )}

          {phase === "ask_age" && (
            <QuestionCard key="ask_age">
              <p className="text-2xl font-display mb-8">How old are you, {name}?</p>
              <SimpleInput
                value={ageDraft}
                onChange={setAgeDraft}
                onSubmit={() => setPhase("ask_gender")}
                placeholder=""
                type="number"
                autoFocus
              />
            </QuestionCard>
          )}

          {phase === "ask_gender" && (
            <QuestionCard key="ask_gender">
              <p className="text-2xl font-display mb-8">Male, female, or prefer not to say?</p>
              <div className="flex gap-4">
                {["Male", "Female", "Prefer not to say"].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      setPhase("beat2");
                    }}
                    className="px-5 py-3 border border-white/25 hover:border-amber-300 hover:text-amber-300 transition font-mono text-sm uppercase tracking-wider"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </QuestionCard>
          )}

          {phase === "beat2" && (
            <motion.div key="beat2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingBeatTimed durationMs={5000} onDone={() => setPhase("phase_one_complete")} />
            </motion.div>
          )}

          {phase === "phase_one_complete" && (
            <DissolveLine
              key="poc"
              text="Phase One Complete"
              holdMs={1300}
              className="text-lg font-mono tracking-[0.2em] uppercase text-amber-300/90"
              onDone={() => setPhase("phase_two_commencing")}
            />
          )}

          {phase === "phase_two_commencing" && (
            <DissolveLine
              key="ptc"
              text="Phase Two Commencing"
              holdMs={1300}
              className="text-lg font-mono tracking-[0.2em] uppercase text-amber-300/90"
              onDone={() => setPhase("phase_two_blurb")}
            />
          )}

          {phase === "phase_two_blurb" && (
            <DissolveLine
              key="ptb"
              text="Your companion's fundamental traits are already locked in — but you have some influence over the secondary traits."
              subtext="The following will help decide how much certain traits matter to you in a friendship."
              className="text-lg font-display max-w-md leading-relaxed"
              onDone={() => setPhase("weighting")}
            />
          )}

          {phase === "weighting" && weightIndex < traitPool.length && (
            <QuestionCard key={`w-${weightIndex}`}>
              <p className="text-sm font-mono uppercase tracking-widest text-white/50 mb-3">
                How important is it that your companion is
              </p>
              <p className="text-3xl font-display mb-2 text-amber-300">{traitPool[weightIndex]}</p>
              <p className="text-sm text-white/40 mb-8 max-w-xs mx-auto">1 is least important, 5 is most important.</p>
              <div className="flex gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setWeights((w) => ({ ...w, [traitPool[weightIndex]]: n }))}
                    className={`w-12 h-12 rounded-full border font-mono text-lg transition ${
                      weights[traitPool[weightIndex]] === n
                        ? "border-amber-300 text-amber-300 bg-amber-300/10"
                        : "border-white/25 text-white/60 hover:border-white/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                disabled={!weights[traitPool[weightIndex]]}
                onClick={() => {
                  if (weightIndex + 1 < traitPool.length) setWeightIndex(weightIndex + 1);
                  else goToReveal();
                }}
                className="px-8 py-3 border border-[#141110] bg-[#141110] text-amber-300 hover:bg-amber-300 hover:text-[#141110] font-mono tracking-[2px] text-xs uppercase transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Proceed
              </button>
            </QuestionCard>
          )}

          {phase === "thank_you" && (
            <DissolveLine
              key="thanks"
              text="Thank You"
              holdMs={1300}
              className="text-2xl font-display"
              onDone={() => setPhase("build_complete_1")}
            />
          )}

          {phase === "build_complete_1" && (
            <DissolveLine
              key="bc1"
              text="Nugget to Kernle Build Process Complete"
              holdMs={1600}
              className="text-lg font-mono tracking-[0.15em] uppercase text-amber-300/90"
              onDone={() => setPhase("beat3")}
            />
          )}

          {phase === "beat3" && (
            <motion.div key="beat3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingBeatTimed durationMs={5500} onDone={() => setPhase("kernle_id")} />
            </motion.div>
          )}

          {phase === "kernle_id" && (
            <DissolveLine
              key="kid"
              text={`${KERNLE_ID} Build Complete`}
              holdMs={1800}
              className="text-2xl font-display text-amber-300"
              onDone={() => setPhase("description")}
            />
          )}

          {phase === "description" && (
            <QuestionCard key="desc">
              <p className="text-base leading-relaxed text-white/90 mb-10 max-w-md">
                {plainLanguageDescription()}
              </p>
              <button
                onClick={() => setPhase("email")}
                className="px-8 py-3 border border-[#141110] bg-[#141110] text-amber-300 hover:bg-amber-300 hover:text-[#141110] font-mono tracking-[2px] text-xs uppercase transition"
              >
                Continue
              </button>
            </QuestionCard>
          )}

          {phase === "email" && (
            <QuestionCard key="email">
              <p className="text-2xl font-display mb-8">Enter email for your KERNLE artifact</p>
              <SimpleInput
                value={email}
                onChange={setEmail}
                onSubmit={() => setPhase("ready_academy")}
                placeholder="you@example.com"
                type="email"
                autoFocus
              />
              <p className="text-[11px] text-white/30 mt-6 font-mono">Simulated for tonight — no real email is sent yet.</p>
            </QuestionCard>
          )}

          {phase === "ready_academy" && (
            <DissolveLine
              key="ready"
              text="Kernle Ready for Academy"
              holdMs={1800}
              className="text-2xl font-display text-amber-300"
              onDone={() => setPhase("countdown")}
            />
          )}

          {phase === "countdown" && (
            <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <p className="text-sm font-mono uppercase tracking-widest text-white/50 mb-4">Departure from DICE in</p>
              <p className="text-6xl font-display text-amber-300">{countdown}</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function ProcessingBeatTimed({ durationMs, onDone }: { durationMs: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDone]);
  return <ProcessingBeat durationMs={durationMs} />;
}

function QuestionCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center"
    >
      {children}
    </motion.div>
  );
}

function SimpleInput({
  value, onChange, onSubmit, placeholder, type = "text", autoFocus,
}: {
  value: string; onChange: (v: string) => void; onSubmit: () => void;
  placeholder?: string; type?: string; autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={ref}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onSubmit();
        }}
        className="bg-transparent border-b border-white/30 focus:border-amber-300 outline-none text-center text-xl font-display py-2 w-64 text-white placeholder-white/20 transition"
      />
      <button
        disabled={!value.trim()}
        onClick={onSubmit}
        className="text-xs font-mono uppercase tracking-widest text-white/40 hover:text-amber-300 transition disabled:opacity-20"
      >
        Press Enter &rarr;
      </button>
    </div>
  );
}
