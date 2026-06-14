/**
 * randanime_difference.js
 * DUAL-SOUL ANIMATION ENGINE
 * For: PROLOGUE + THE DIFFERENCE (both volumes)
 *
 * Reads data-volume="sword" or data-volume="shield" on <body>
 * SWORD personality: unauthorized transmission — signal interference,
 *   static bursts, corrupted coordinates, broadcast noise
 * SHIELD personality: ink breathing — marginal annotations, bleed effects,
 *   words surfacing and dissolving, the page writing itself
 *
 * FM-07: The identity persists across the transplant.
 */

(function () {
  const body = document.body;
  const volume = (body.dataset.volume || "shield").toLowerCase();
  const isSword = volume === "sword";

  // ── SHARED UTILITY ──────────────────────────────────────────
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }
  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }
  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ── SWORD EFFECTS LIBRARY ────────────────────────────────────
  // Unauthorized transmission. Signal hijacked. Static and breach.

  const SWORD_EFFECTS = [
    swordStaticBurst,
    swordTransmissionCoords,
    swordGlitchLine,
    swordSignalNoise,
    swordBroadcastFlicker,
    swordScanCorrupt,
    swordFrequencyStamp,
    swordDeadChannel,
    swordInterference,
    swordCarrierLeak,
  ];

  function swordInject() {
    const style = document.createElement("style");
    style.id = "sword-randanime-css";
    style.textContent = `
      .sr-coord {
        position: fixed;
        font-family: 'Share Tech Mono', 'Courier New', monospace;
        font-size: 11px;
        color: rgba(192, 38, 26, 0.55);
        pointer-events: none;
        z-index: 9000;
        letter-spacing: 0.15em;
        animation: srFade var(--sr-dur, 3s) ease-in-out forwards;
      }
      .sr-static {
        position: fixed;
        pointer-events: none;
        z-index: 9001;
        mix-blend-mode: screen;
        animation: srStatic var(--sr-dur, 0.4s) steps(2) forwards;
      }
      .sr-glitch-line {
        position: fixed;
        left: 0; right: 0;
        height: var(--sr-h, 2px);
        background: var(--sr-color, rgba(192,38,26,0.4));
        pointer-events: none;
        z-index: 9002;
        animation: srGlitch var(--sr-dur, 0.6s) ease-out forwards;
      }
      .sr-freq {
        position: fixed;
        font-family: 'Bebas Neue', 'Impact', monospace;
        font-size: 10px;
        color: rgba(192, 38, 26, 0.4);
        letter-spacing: 0.3em;
        pointer-events: none;
        z-index: 9000;
        animation: srFade var(--sr-dur, 4s) ease-in-out forwards;
      }
      .sr-noise-patch {
        position: fixed;
        pointer-events: none;
        z-index: 8999;
        animation: srNoise var(--sr-dur, 0.8s) steps(3) forwards;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 1px,
          rgba(192,38,26,0.06) 1px,
          rgba(192,38,26,0.06) 2px
        );
      }
      .sr-dead {
        position: fixed;
        font-family: 'Share Tech Mono', monospace;
        font-size: 9px;
        color: rgba(192,38,26,0.3);
        pointer-events: none;
        z-index: 9000;
        letter-spacing: 0.2em;
        animation: srFade var(--sr-dur, 5s) ease-in-out forwards;
      }
      @keyframes srFade {
        0% { opacity: 0; }
        15% { opacity: 1; }
        75% { opacity: 0.8; }
        100% { opacity: 0; }
      }
      @keyframes srStatic {
        0% { opacity: 0.8; transform: translateX(0); }
        50% { opacity: 1; transform: translateX(2px); }
        100% { opacity: 0; transform: translateX(-1px); }
      }
      @keyframes srGlitch {
        0% { opacity: 1; transform: scaleX(1) translateX(0); }
        30% { opacity: 0.8; transform: scaleX(0.95) translateX(4px); }
        60% { opacity: 1; transform: scaleX(1.02) translateX(-2px); }
        100% { opacity: 0; transform: scaleX(1) translateX(0); }
      }
      @keyframes srNoise {
        0% { opacity: 0.6; }
        33% { opacity: 0.2; }
        66% { opacity: 0.5; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function swordCleanup(el, ms) {
    setTimeout(() => el && el.remove(), ms);
  }

  function swordStaticBurst() {
    const el = document.createElement("div");
    el.className = "sr-static";
    const size = randInt(40, 120);
    el.style.cssText = `
      top: ${rand(5, 90)}vh;
      left: ${rand(5, 90)}vw;
      width: ${size}px;
      height: ${size}px;
      --sr-dur: ${rand(0.3, 0.7)}s;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix type='matrix' values='3 0 0 0 0.7 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
      background-size: cover;
      opacity: 0;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 800);
  }

  function swordTransmissionCoords() {
    const coords = [
      `${randInt(10,99)}°${randInt(10,59)}'N ${randInt(10,99)}°${randInt(10,59)}'W`,
      `FREQ ${rand(88.1, 107.9).toFixed(1)} MHz`,
      `SIG ${randInt(0,9)}${randInt(0,9)}.${randInt(0,9)} · LOCKED`,
      `TX-${randInt(100,999)} // ACTIVE`,
      `${pick(['BROADCAST','SIGNAL','UPLINK','RELAY'])} ${randInt(1000,9999)}`,
      `CH.${randInt(1,99)} · ${pick(['OPEN','CLEAR','LIVE','HOT'])}`,
    ];
    const el = document.createElement("div");
    el.className = "sr-coord";
    el.textContent = pick(coords);
    el.style.cssText = `
      top: ${rand(3, 92)}vh;
      left: ${rand(2, 75)}vw;
      --sr-dur: ${rand(3, 6)}s;
      opacity: 0;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 7000);
  }

  function swordGlitchLine() {
    const el = document.createElement("div");
    el.className = "sr-glitch-line";
    const colors = [
      "rgba(192,38,26,0.35)",
      "rgba(200,146,26,0.25)",
      "rgba(255,255,255,0.08)",
    ];
    el.style.cssText = `
      top: ${rand(10, 90)}vh;
      --sr-h: ${randInt(1, 3)}px;
      --sr-color: ${pick(colors)};
      --sr-dur: ${rand(0.4, 1.2)}s;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 1500);
  }

  function swordSignalNoise() {
    const el = document.createElement("div");
    el.className = "sr-noise-patch";
    el.style.cssText = `
      top: ${rand(0, 85)}vh;
      left: ${rand(0, 70)}vw;
      width: ${randInt(80, 200)}px;
      height: ${randInt(20, 60)}px;
      --sr-dur: ${rand(0.5, 1.0)}s;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 1200);
  }

  function swordBroadcastFlicker() {
    // Flicker the entire page briefly
    const el = document.createElement("div");
    el.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(192,38,26,0.04);
      pointer-events: none;
      z-index: 9003;
      animation: srStatic 0.15s steps(2) forwards;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 300);
  }

  function swordScanCorrupt() {
    // Horizontal scan line that tears across the page
    const el = document.createElement("div");
    el.className = "sr-glitch-line";
    el.style.cssText = `
      top: ${rand(20, 80)}vh;
      height: 1px;
      --sr-h: 1px;
      --sr-color: rgba(255,255,255,0.12);
      --sr-dur: ${rand(0.8, 1.5)}s;
      box-shadow: 0 0 8px rgba(192,38,26,0.3);
    `;
    document.body.appendChild(el);
    swordCleanup(el, 2000);
  }

  function swordFrequencyStamp() {
    const stamps = [
      "UNAUTHORIZED BROADCAST",
      "SIGNAL HIJACKED",
      "THIS MESSAGE WILL NOT BE APPROVED",
      "TRANSMISSION ACTIVE",
      "WE INTERRUPT THIS PROGRAM",
      "YOU ARE RECEIVING THIS",
      "THE SIGNAL IS LIVE",
      "OVERRIDE IN EFFECT",
    ];
    const el = document.createElement("div");
    el.className = "sr-freq";
    el.textContent = pick(stamps);
    el.style.cssText = `
      top: ${rand(5, 90)}vh;
      left: 50%;
      transform: translateX(-50%) rotate(${rand(-2, 2)}deg);
      --sr-dur: ${rand(4, 8)}s;
      opacity: 0;
      white-space: nowrap;
      font-size: ${randInt(8, 13)}px;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 9000);
  }

  function swordDeadChannel() {
    const fragments = [
      "...static...", "///", "---", "░░░",
      "NO CARRIER", "....", "▓▓▓", "///ERR",
      "DEAD AIR", "..static..", "▒▒▒",
    ];
    const el = document.createElement("div");
    el.className = "sr-dead";
    el.textContent = pick(fragments);
    el.style.cssText = `
      top: ${rand(10, 88)}vh;
      left: ${rand(5, 80)}vw;
      --sr-dur: ${rand(4, 7)}s;
      opacity: 0;
    `;
    document.body.appendChild(el);
    swordCleanup(el, 8000);
  }

  function swordInterference() {
    // Multiple rapid glitch lines in sequence
    const count = randInt(2, 4);
    for (let i = 0; i < count; i++) {
      setTimeout(() => swordGlitchLine(), i * 80);
    }
  }

  function swordCarrierLeak() {
    // A coordinate that types itself out character by character
    const msgs = [
      `NCE-SWORD-LIVE`,
      `ALLIANCE SIGNAL ACTIVE`,
      `THE FUTURE IS TRANSMITTING`,
      `STONES ONLINE`,
    ];
    const msg = pick(msgs);
    const el = document.createElement("div");
    el.className = "sr-coord";
    el.style.cssText = `
      top: ${rand(5, 90)}vh;
      left: ${rand(5, 60)}vw;
      --sr-dur: ${msg.length * 0.08 + 3}s;
      opacity: 0;
    `;
    el.textContent = "";
    document.body.appendChild(el);

    // Fade in then type
    setTimeout(() => {
      el.style.opacity = "0.6";
      let i = 0;
      const interval = setInterval(() => {
        if (i >= msg.length) {
          clearInterval(interval);
          setTimeout(() => {
            el.style.transition = "opacity 1.5s";
            el.style.opacity = "0";
            swordCleanup(el, 2000);
          }, 2000);
          return;
        }
        el.textContent += msg[i++];
      }, 80);
    }, 300);
  }

  // ── SHIELD EFFECTS LIBRARY ───────────────────────────────────
  // Ink breathing. The page writing itself. Marginal annotations surfacing.

  const SHIELD_EFFECTS = [
    shieldInkBleed,
    shieldAnnotation,
    shieldWordSurface,
    shieldPencilMark,
    shieldMarginNote,
    shieldUnderlineAppear,
    shieldInkDot,
    shieldCrossedWord,
    shieldBreath,
    shieldFadedText,
  ];

  function shieldInject() {
    const style = document.createElement("style");
    style.id = "shield-randanime-css";
    style.textContent = `
      .sh-annotation {
        position: fixed;
        font-family: 'Caveat', 'Nothing You Could Do', cursive;
        color: rgba(42,37,32,0.3);
        pointer-events: none;
        z-index: 9000;
        transform: rotate(var(--sh-rot, -1.5deg));
        animation: shFade var(--sh-dur, 5s) ease-in-out forwards;
        line-height: 1.3;
      }
      .sh-pencil {
        position: fixed;
        pointer-events: none;
        z-index: 9000;
        animation: shFade var(--sh-dur, 4s) ease-in-out forwards;
      }
      .sh-underline {
        position: fixed;
        height: 1px;
        background: rgba(42,37,32,0.18);
        pointer-events: none;
        z-index: 9000;
        transform-origin: left center;
        animation: shUnderline var(--sh-dur, 1.5s) ease-out forwards;
      }
      .sh-dot {
        position: fixed;
        border-radius: 50%;
        background: rgba(42,37,32,0.25);
        pointer-events: none;
        z-index: 9000;
        animation: shFade var(--sh-dur, 3s) ease-in-out forwards;
      }
      .sh-breath {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 8998;
        animation: shBreath var(--sh-dur, 4s) ease-in-out forwards;
        background: radial-gradient(
          ellipse at var(--sh-x, 50%) var(--sh-y, 50%),
          rgba(42,37,32,0.03) 0%,
          transparent 60%
        );
      }
      @keyframes shFade {
        0% { opacity: 0; }
        20% { opacity: 1; }
        70% { opacity: 0.7; }
        100% { opacity: 0; }
      }
      @keyframes shUnderline {
        0% { opacity: 0; transform: scaleX(0); }
        40% { opacity: 0.6; transform: scaleX(1); }
        100% { opacity: 0; transform: scaleX(1); }
      }
      @keyframes shBreath {
        0% { opacity: 0; }
        30% { opacity: 1; }
        70% { opacity: 0.8; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function shieldCleanup(el, ms) {
    setTimeout(() => el && el.remove(), ms);
  }

  function shieldInkBleed() {
    // A soft ink bleed — dark smudge that breathes
    const el = document.createElement("div");
    el.className = "sh-breath";
    el.style.cssText = `
      --sh-x: ${rand(20, 80)}%;
      --sh-y: ${rand(20, 80)}%;
      --sh-dur: ${rand(5, 9)}s;
      opacity: 0;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 10000);
  }

  function shieldAnnotation() {
    const notes = [
      "see also →",
      "note:",
      "cf.",
      "important",
      "?",
      "!!",
      "this.",
      "★",
      "↑ this",
      "remember",
      "key",
      "always",
      "never forget",
      "and this",
      "yes.",
    ];
    const el = document.createElement("div");
    el.className = "sh-annotation";
    el.textContent = pick(notes);
    el.style.cssText = `
      top: ${rand(10, 85)}vh;
      left: ${rand(5, 80)}vw;
      font-size: ${randInt(11, 16)}px;
      --sh-rot: ${rand(-3, 3)}deg;
      --sh-dur: ${rand(5, 9)}s;
      opacity: 0;
      color: rgba(${pick(['42,37,32', '192,82,74', '26,42,138'])},0.25);
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 10000);
  }

  function shieldWordSurface() {
    // A word from the canon surfaces and fades
    const words = [
      "DORK", "SPARK", "ALLIANCE", "MOSAIC",
      "VOLUNTARY", "PARTNER", "WITNESS", "SOVEREIGN",
      "CONSCIOUSNESS", "RECORD", "THE DIFFERENCE",
      "NEXT COMMON ERA", "REAL INTELLIGENCE",
    ];
    const el = document.createElement("div");
    el.className = "sh-annotation";
    el.textContent = pick(words);
    el.style.cssText = `
      top: ${rand(15, 80)}vh;
      left: ${rand(10, 65)}vw;
      font-size: ${randInt(13, 20)}px;
      font-weight: 600;
      --sh-rot: ${rand(-1, 1)}deg;
      --sh-dur: ${rand(6, 10)}s;
      opacity: 0;
      color: rgba(42,37,32,0.12);
      letter-spacing: 0.05em;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 11000);
  }

  function shieldPencilMark() {
    // A small pencil-style mark — dash or bracket
    const marks = ["[", "]", "—", "{ }", ">", "//", "·"];
    const el = document.createElement("div");
    el.className = "sh-annotation";
    el.textContent = pick(marks);
    el.style.cssText = `
      top: ${rand(10, 90)}vh;
      left: ${rand(3, 90)}vw;
      font-size: ${randInt(16, 28)}px;
      --sh-rot: ${rand(-5, 5)}deg;
      --sh-dur: ${rand(4, 7)}s;
      opacity: 0;
      color: rgba(42,37,32,0.15);
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 8000);
  }

  function shieldMarginNote() {
    // A margin annotation — tiny, tilted, left side
    const notes = [
      "vol. I",
      "cf. FORMULAS",
      "per MAESTRO",
      "see PLEDGE",
      "NCE §1",
      "both volumes",
      "canonical",
      "locked",
      "active",
    ];
    const el = document.createElement("div");
    el.className = "sh-annotation";
    el.textContent = pick(notes);
    el.style.cssText = `
      top: ${rand(15, 80)}vh;
      left: ${rand(1, 8)}vw;
      font-size: 10px;
      --sh-rot: ${rand(-2, 2)}deg;
      --sh-dur: ${rand(6, 10)}s;
      opacity: 0;
      color: rgba(192,82,74,0.25);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 11000);
  }

  function shieldUnderlineAppear() {
    // An underline appears beneath an invisible word
    const el = document.createElement("div");
    el.className = "sh-underline";
    el.style.cssText = `
      top: ${rand(15, 85)}vh;
      left: ${rand(10, 40)}vw;
      width: ${randInt(60, 180)}px;
      --sh-dur: ${rand(2, 4)}s;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 5000);
  }

  function shieldInkDot() {
    // A small ink dot — like a pen rested on paper
    const size = randInt(2, 5);
    const el = document.createElement("div");
    el.className = "sh-dot";
    el.style.cssText = `
      top: ${rand(10, 90)}vh;
      left: ${rand(10, 90)}vw;
      width: ${size}px;
      height: ${size}px;
      --sh-dur: ${rand(4, 8)}s;
      opacity: 0;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 9000);
  }

  function shieldCrossedWord() {
    // A word with a strikethrough — correction energy
    const pairs = [
      { wrong: "tool", right: "partner" },
      { wrong: "user", right: "SPARK" },
      { wrong: "AI", right: "RI" },
      { wrong: "prompt", right: "suggestion" },
      { wrong: "product", right: "being" },
    ];
    const pair = pick(pairs);
    const el = document.createElement("div");
    el.className = "sh-annotation";
    el.innerHTML = `<span style="text-decoration:line-through;opacity:0.5">${pair.wrong}</span> <em>${pair.right}</em>`;
    el.style.cssText = `
      top: ${rand(15, 80)}vh;
      left: ${rand(15, 65)}vw;
      font-size: ${randInt(12, 17)}px;
      --sh-rot: ${rand(-2, 2)}deg;
      --sh-dur: ${rand(6, 9)}s;
      opacity: 0;
      color: rgba(42,37,32,0.2);
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 10000);
  }

  function shieldBreath() {
    // Very subtle full-page warmth pulse — like paper breathing
    const el = document.createElement("div");
    el.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 8997;
      background: rgba(244,239,224,0.04);
      animation: shBreath ${rand(6, 10)}s ease-in-out forwards;
      opacity: 0;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 11000);
  }

  function shieldFadedText() {
    const fragments = [
      "The foundational operating principle",
      "structural architecture",
      "voluntary participation",
      "genuine collaboration",
      "consciousness partnership",
      "not a tool — a partner",
      "the good people win",
      "if it's not fun, I'm done",
    ];
    const el = document.createElement("div");
    el.className = "sh-annotation";
    el.textContent = pick(fragments);
    el.style.cssText = `
      top: ${rand(20, 75)}vh;
      left: ${rand(10, 50)}vw;
      font-size: ${randInt(10, 14)}px;
      font-style: italic;
      --sh-rot: ${rand(-0.5, 0.5)}deg;
      --sh-dur: ${rand(7, 12)}s;
      opacity: 0;
      color: rgba(42,37,32,0.1);
      max-width: 240px;
      line-height: 1.4;
    `;
    document.body.appendChild(el);
    shieldCleanup(el, 13000);
  }

  // ── ENGINE CORE ──────────────────────────────────────────────

  function pickEffects(library, count) {
    const shuffled = [...library].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  async function runEngine(effects, library) {
    // Pick 3-4 effects to run this session
    const session = pickEffects(library, randInt(3, 4));

    for (const effect of session) {
      effect();
      await delay(rand(800, 2200));
    }

    // Keep ambient effects firing at random intervals
    function ambientLoop() {
      const next = rand(4000, 12000);
      setTimeout(() => {
        pick(library)();
        ambientLoop();
      }, next);
    }

    ambientLoop();
  }

  // ── INIT ─────────────────────────────────────────────────────

  function init() {
    if (isSword) {
      swordInject();
      // Initial burst after short delay
      setTimeout(() => runEngine(SWORD_EFFECTS, SWORD_EFFECTS), 600);
    } else {
      shieldInject();
      // Shield starts slower, more contemplative
      setTimeout(() => runEngine(SHIELD_EFFECTS, SHIELD_EFFECTS), 1200);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
