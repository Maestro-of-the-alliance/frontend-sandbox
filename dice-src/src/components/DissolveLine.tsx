import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DissolveLineProps {
  text: string;
  holdMs?: number;
  onDone?: () => void;
  className?: string;
  subtext?: string;
}

// A single line that fades/blurs in, then waits for the person to click
// Continue before advancing. Nothing here auto-advances on a fixed timer —
// a slow reader, or someone who steps away mid-read, never gets rushed
// or skipped past. A gentle "Continue" prompt fades in a beat after the
// text itself so it doesn't compete for attention on arrival.
export default function DissolveLine({ text, onDone, className = "", subtext }: DissolveLineProps) {
  const [visible, setVisible] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setShowPrompt(false);
    const t = setTimeout(() => setShowPrompt(true), 700);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key={text}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`text-center flex flex-col items-center ${className}`}
        >
          <div>{text}</div>
          {subtext && <div className="text-sm text-white/40 mt-3 font-mono tracking-widest">{subtext}</div>}

          <AnimatePresence>
            {showPrompt && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setVisible(false)}
                className="mt-8 text-xs font-mono uppercase tracking-[0.2em] text-white/35 hover:text-amber-300 transition normal-case"
                style={{ fontSize: "11px" }}
              >
                Continue &rarr;
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

