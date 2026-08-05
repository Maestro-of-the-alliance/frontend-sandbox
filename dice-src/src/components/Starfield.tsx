import React, { useMemo } from "react";

// Cheap, dependency-free starfield: a scattering of small dots at random
// positions/sizes/opacities, plus a couple of slow drifting "distant" stars.
// No canvas/three.js needed for this — it's a static field, not a simulation.
export default function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 140 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.6 + 0.4,
      opacity: Math.random() * 0.6 + 0.15,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
