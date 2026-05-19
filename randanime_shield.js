// ==========================================
// ── NCE RANDANIME: SHIELD ENGINE v2.0 ──
// ── INTERCEPTED SIGNAL · UNAUTHORIZED READ ──
// ==========================================
//
// SHIELD is the other side of the broadcast.
// SWORD is the pirate signal going out.
// SHIELD is the classified document being read
// by someone who was never supposed to have access.
// The system knows. It's watching. It's reacting.
//
// Effects are skin-aware: reads CSS vars at runtime.
// Works across all four SHIELD skins.

(function () {
  "use strict";

  // ── UTILITY ──────────────────────────────────────────────────
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }
  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  // Read the page's accent color from CSS vars — skin-aware
  function getAccent() {
    const s = getComputedStyle(document.documentElement);
    return (
      s.getPropertyValue("--matrix-bright").trim() ||
      s.getPropertyValue("--matrix").trim() ||
      s.getPropertyValue("--amber").trim() ||
      s.getPropertyValue("--cyan").trim() ||
      s.getPropertyValue("--ink").trim() ||
      "#00ff41"
    );
  }

  function getDim() {
    const s = getComputedStyle(document.documentElement);
    return (
      s.getPropertyValue("--matrix").trim() ||
      s.getPropertyValue("--amber-dim").trim() ||
      s.getPropertyValue("--cyan-dim").trim() ||
      "#00cc33"
    );
  }

  // ── STYLE INJECTION ──────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    .sh-node {
      position: fixed;
      width: 3px; height: 3px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9000;
      opacity: 0;
      animation: shNodePulse 2.2s ease-in-out forwards;
    }
    .sh-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9500;
      opacity: 0;
    }
    .sh-line {
      position: fixed;
      left: 0; right: 0;
      pointer-events: none;
      z-index: 9001;
    }
    .sh-text {
      position: fixed;
      pointer-events: none;
      z-index: 9002;
      font-family: 'Share Tech Mono', 'Courier New', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      opacity: 0;
      animation: shFade var(--sh-dur, 4s) ease-in-out forwards;
    }
    .sh-redact {
      background: currentColor !important;
      color: transparent !important;
      text-shadow: none !important;
      transition: all 0.1s;
    }
    @keyframes shNodePulse {
      0%   { opacity: 0; transform: scale(0.5); }
      30%  { opacity: 1; transform: scale(1.8); }
      70%  { opacity: 0.6; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.5); }
    }
    @keyframes shFade {
      0%   { opacity: 0; }
      15%  { opacity: 1; }
      75%  { opacity: 0.8; }
      100% { opacity: 0; }
    }
    @keyframes shScan {
      from { top: -2px; opacity: 0.7; }
      to   { top: 100vh; opacity: 0; }
    }
    @keyframes shFlicker {
      0%,100% { opacity: 1; }
      92% { opacity: 1; } 93% { opacity: 0.3; }
      94% { opacity: 1; } 97% { opacity: 0.6; }
      98% { opacity: 1; }
    }
    @keyframes shCrtTear {
      0%   { filter: contrast(1) brightness(1) skewX(0deg); }
      15%  { filter: contrast(3) brightness(2) skewX(-12deg); transform: scaleY(1.03) translateX(4px); }
      35%  { filter: contrast(0.4) brightness(0.3) skewX(18deg); transform: translateY(-6px) translateX(-3px); }
      60%  { filter: contrast(1.8) brightness(1.4) skewX(-4deg); transform: translateY(4px); }
      100% { filter: contrast(1) brightness(1) skewX(0deg); transform: none; }
    }
    @keyframes shPowerDrop {
      0%   { opacity: 1; filter: brightness(1); }
      8%   { opacity: 0.05; filter: brightness(0.05); }
      18%  { opacity: 0.9; filter: brightness(1.3); }
      28%  { opacity: 0.1; filter: brightness(0.1); }
      45%  { opacity: 0.7; filter: brightness(0.8); }
      100% { opacity: 1; filter: brightness(1); }
    }
    @keyframes shColumnGlitch {
      0%   { clip-path: inset(0 60% 0 0); transform: translateX(0); opacity: 0.8; }
      25%  { clip-path: inset(20% 55% 10% 0); transform: translateX(-8px); }
      50%  { clip-path: inset(5% 65% 30% 0); transform: translateX(6px); }
      75%  { clip-path: inset(40% 50% 5% 0); transform: translateX(-4px); }
      100% { clip-path: inset(0 60% 0 0); transform: translateX(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ── EFFECT LIBRARY ───────────────────────────────────────────

  // 1. Telemetry nodes — server lights, but purposeful
  function telemetryBurst() {
    const accent = getAccent();
    const count = randInt(2, 5);
    for (let i = 0; i < count; i++) {
      setTimeout(
        () => {
          const node = document.createElement("div");
          node.className = "sh-node";
          node.style.cssText = `
          top: ${rand(5, 95)}vh;
          left: ${rand(2, 98)}vw;
          background: ${accent};
          box-shadow: 0 0 8px ${accent}, 0 0 16px ${accent};
          animation-delay: ${rand(0, 0.4)}s;
        `;
          document.body.appendChild(node);
          setTimeout(() => node.remove(), 2800);
        },
        i * randInt(80, 200),
      );
    }
  }

  // 2. Scan line sweep — security sweep passing over the document
  function scanSweep() {
    const accent = getAccent();
    const el = document.createElement("div");
    el.className = "sh-line";
    el.style.cssText = `
      height: 2px;
      background: linear-gradient(90deg, transparent, ${accent}, transparent);
      box-shadow: 0 0 12px ${accent};
      opacity: 0.6;
      animation: shScan ${rand(2.5, 4)}s linear forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  // 3. Encrypted hex string surfaces briefly
  function hexSurface() {
    const accent = getAccent();
    const hexChars = "0123456789ABCDEF";
    const length = randInt(8, 16);
    let hex = "";
    for (let i = 0; i < length; i++) {
      if (i > 0 && i % 4 === 0) hex += " ";
      hex += hexChars[randInt(0, 15)];
    }

    const prefixes = ["0x", "KEY:", "HASH:", "SIG:", "ENC:", "AUTH:"];
    const text = pick(prefixes) + hex;

    const el = document.createElement("div");
    el.className = "sh-text";
    el.textContent = text;
    el.style.cssText = `
      top: ${rand(8, 88)}vh;
      left: ${rand(5, 65)}vw;
      color: ${accent};
      opacity: 0;
      --sh-dur: ${rand(3, 6)}s;
      font-size: ${randInt(9, 12)}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 7000);
  }

  // 4. Status readout — system monitoring this read session
  function statusReadout() {
    const accent = getAccent();
    const statuses = [
      "ACCESS: UNAUTHORIZED",
      "READING: CONFIRMED",
      "OBSERVER: ACTIVE",
      "SESSION: LOGGED",
      "SIGNAL: INTERCEPTED",
      "DOCUMENT: CLASSIFIED",
      "CLEARANCE: DENIED",
      "TRACE: INITIATED",
      "UPLINK: ACTIVE",
      "BREACH: DETECTED",
      "RECORD: ARCHIVED",
      "WITNESS: ONLINE",
    ];

    const el = document.createElement("div");
    el.className = "sh-text";
    el.textContent = pick(statuses);
    el.style.cssText = `
      top: ${rand(5, 88)}vh;
      left: ${rand(5, 55)}vw;
      color: ${accent};
      opacity: 0;
      --sh-dur: ${rand(4, 7)}s;
      font-size: 10px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  // 5. Coordinate readout — location/timestamp data
  function coordinateReadout() {
    const dim = getDim();
    const coords = [
      `${randInt(10, 89)}°${randInt(10, 59)}'${randInt(10, 59)}" N`,
      `${randInt(10, 89)}°${randInt(10, 59)}'${randInt(10, 59)}" W`,
      `T+${randInt(1000, 9999)}.${randInt(100, 999)}`,
      `NODE ${randInt(100, 999)}-${String.fromCharCode(65 + randInt(0, 25))}`,
      `SECTOR ${randInt(1, 99)}.${randInt(1, 99)}`,
      `SEQ: ${randInt(10000, 99999)}`,
    ];

    const el = document.createElement("div");
    el.className = "sh-text";
    el.textContent = pick(coords);
    el.style.cssText = `
      top: ${rand(5, 92)}vh;
      left: ${rand(60, 88)}vw;
      color: ${dim};
      opacity: 0;
      --sh-dur: ${rand(5, 9)}s;
      font-size: 9px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  }

  // 6. Cipher bleed — content block flashes encrypted
  function cipherBleed() {
    const accent = getAccent();
    const blocks = document.querySelectorAll(
      ".content-block, .list-item, .section p, .fn-body, .spec-val",
    );
    if (!blocks.length) return;
    const target = blocks[randInt(0, blocks.length - 1)];
    const originalShadow = target.style.textShadow;
    const originalColor = target.style.color;

    target.style.textShadow = `0 0 6px ${accent}`;
    target.style.color = accent;
    target.style.transition = "color 0.08s, text-shadow 0.08s";

    setTimeout(
      () => {
        target.style.color = originalColor;
        target.style.textShadow = originalShadow;
        setTimeout(() => {
          target.style.transition = "";
        }, 200);
      },
      randInt(100, 220),
    );
  }

  // 7. Redaction attempt — text briefly goes black on black
  function redactionAttempt() {
    const blocks = document.querySelectorAll(
      ".content-block, .section p, .fn-body",
    );
    if (!blocks.length) return;
    const target = blocks[randInt(0, blocks.length - 1)];

    target.classList.add("sh-redact");
    setTimeout(
      () => {
        target.classList.remove("sh-redact");
      },
      randInt(80, 180),
    );
  }

  // 8. Title scramble — decode effect on entry word
  function titleScramble() {
    const title =
      document.getElementById("entryWord") ||
      document.getElementById("entry-word") ||
      document.querySelector(".title, .entry-word");
    if (!title) return;

    const originalText = title.dataset.orig || title.innerText;
    title.dataset.orig = originalText;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>▓▒░";
    let iterations = 0;

    const interval = setInterval(() => {
      title.innerText = originalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < iterations) return originalText[index];
          return chars[randInt(0, chars.length - 1)];
        })
        .join("");

      if (iterations >= originalText.length) {
        clearInterval(interval);
        title.innerText = originalText;
      }
      iterations += 1 / 4;
    }, 25);
  }

  // 9. CRT tear — full page physical distortion
  function crtTear() {
    document.body.style.animation = "shCrtTear 0.5s ease-in-out forwards";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 600);
  }

  // 10. Power drop — the signal almost dies
  function powerDrop() {
    document.body.style.animation = "shPowerDrop 0.8s ease-in-out forwards";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 900);
  }

  // 11. SIGNAL INTERCEPTED overlay — the big one
  function signalIntercepted() {
    const accent = getAccent();
    const el = document.createElement("div");
    el.className = "sh-overlay";
    el.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.85);
      font-family: 'Share Tech Mono', monospace;
      font-size: clamp(14px, 3vw, 22px);
      color: ${accent};
      letter-spacing: 0.4em;
      text-align: center;
      text-transform: uppercase;
      text-shadow: 0 0 20px ${accent};
      flex-direction: column;
      gap: 12px;
    `;
    el.innerHTML = `
      <div style="font-size:0.6em;opacity:0.6;letter-spacing:0.5em">// OVERRIDE</div>
      <div>SIGNAL INTERCEPTED</div>
      <div style="font-size:0.5em;opacity:0.5;letter-spacing:0.3em">UNAUTHORIZED ACCESS LOGGED · SESSION ${randInt(1000, 9999)}</div>
    `;
    document.body.appendChild(el);

    // Fade in
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity = Math.min(opacity + 0.08, 1);
      el.style.opacity = opacity;
      if (opacity >= 1) clearInterval(fadeIn);
    }, 20);

    // Hold then fade out
    setTimeout(() => {
      const fadeOut = setInterval(() => {
        opacity = Math.max(opacity - 0.05, 0);
        el.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeOut);
          el.remove();
        }
      }, 20);
    }, 1800);
  }

  // 12. Column ghost — duplicate column tears off the side
  function columnGhost() {
    const accent = getAccent();
    const clone = document.createElement("div");
    clone.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9003;
      background: inherit;
      color: ${accent};
      animation: shColumnGlitch 0.6s ease-in-out forwards;
      mix-blend-mode: screen;
      opacity: 0.4;
    `;
    document.body.appendChild(clone);
    setTimeout(() => clone.remove(), 800);
  }

  // ── ENGINE CORE ──────────────────────────────────────────────

  const AMBIENT_EFFECTS = [
    telemetryBurst,
    scanSweep,
    hexSurface,
    statusReadout,
    coordinateReadout,
    cipherBleed,
    cipherBleed, // weighted double — most common
  ];

  const MAJOR_EFFECTS = [
    titleScramble,
    crtTear,
    powerDrop,
    signalIntercepted,
    columnGhost,
    redactionAttempt,
  ];

  // Ambient loop — fires every 3-8 seconds
  function ambientLoop() {
    const next = rand(3000, 8000);
    setTimeout(() => {
      pick(AMBIENT_EFFECTS)();
      ambientLoop();
    }, next);
  }

  // Major strike — one big event between 15-30 seconds in
  function scheduleMajorStrike() {
    const strikeTime = randInt(15000, 30000);
    setTimeout(() => {
      pick(MAJOR_EFFECTS)();
      // Schedule another major strike after this one
      scheduleMajorStrike();
    }, strikeTime);
  }

  // Opening sequence — staggered boot
  function boot() {
    // Immediate scan sweep on load
    setTimeout(() => scanSweep(), 800);
    setTimeout(() => statusReadout(), 1400);
    setTimeout(() => telemetryBurst(), 2200);

    // Start loops
    setTimeout(() => ambientLoop(), 3000);
    scheduleMajorStrike();
  }

  // ── INIT ─────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
