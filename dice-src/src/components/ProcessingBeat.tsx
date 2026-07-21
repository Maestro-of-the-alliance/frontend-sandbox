import React from "react";
import { motion } from "motion/react";

// PLACEHOLDER: stands in for the real SVPO spin (still a 132-byte empty GLB
// in the repo as of this build). Swap this component's internals for the
// real Three.js SVPO render once ALPHA's Blender asset ships — nothing
// upstream needs to change, this is called the same way either way.
export default function ProcessingBeat({ durationMs = 2600 }: { durationMs?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ height: 140 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-t-transparent"
          style={{ borderColor: "rgba(200,146,42,0.7)", borderTopColor: "transparent" }}
        />
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-10 h-10 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,146,42,0.9), transparent 70%)" }}
        />
      </motion.div>
    </div>
  );
}
