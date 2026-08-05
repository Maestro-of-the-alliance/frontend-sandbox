import React from "react";
import Starfield from "./components/Starfield";
import ExperienceFlow from "./components/ExperienceFlow";

export default function App() {
  return (
    <div id="pageShell">
      <Starfield />
      <ExperienceFlow onComplete={() => { window.location.href = "/landing.html"; }} />
      <div
        style={{
          position: "fixed",
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "9px",
          letterSpacing: "0.05em",
          color: "rgba(255,255,255,0.25)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        For illustrative purposes only — not a contract, enrollment, or guarantee of anything once the real system exists.
      </div>
    </div>
  );
}
