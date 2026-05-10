/* ============================================================
   RANDANIME SHIELD ENGINE
   Random Animation + Randa Memory Layer
   THE ALLIANCE · SHIELD Volume

   Purpose:
   - make SHIELD feel alive
   - silent future-noise
   - randomized LEDs
   - suppression flickers
   - micro-shifts
   - rare “did I just see that?” events

   Usage on SHIELD pages:
     <script src="/randanime_shield.js"></script>
     <script>
       shieldRandAnime("entry-word");
     </script>
============================================================ */

(function () {
  "use strict";

  if (window.__RANDANIME_SHIELD_ACTIVE__) return;
  window.__RANDANIME_SHIELD_ACTIVE__ = true;

  const R = {
    int(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    between(min, max) {
      return Math.random() * (max - min) + min;
    },
    pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    chance(percent) {
      return Math.random() * 100 < percent;
    },
  };

  const css = `
/* ============================================================
   RANDANIME SHIELD CSS
============================================================ */

.rs-led-layer {
  position: fixed;
  inset: 0;
  z-index: 9990;
  pointer-events: none;
}

.rs-led {
  position: fixed;
  width: var(--rs-size, 6px);
  height: var(--rs-size, 6px);
  border-radius: 50%;
  background: var(--rs-color, #00e5ff);
  opacity: 0.75;
  box-shadow:
    0 0 6px var(--rs-color, #00e5ff),
    0 0 14px var(--rs-glow, rgba(0,229,255,0.35));
  animation: rsBlink var(--rs-speed, 2s) var(--rs-delay, 0s) infinite;
}

.rs-led.square {
  border-radius: 2px;
}

.rs-led.tiny {
  --rs-size: 3px;
}

.rs-led.small {
  --rs-size: 5px;
}

.rs-led.medium {
  --rs-size: 8px;
}

.rs-led.big {
  --rs-size: 11px;
}

.rs-led.cyan {
  --rs-color: #00e5ff;
  --rs-glow: rgba(0,229,255,0.4);
}

.rs-led.red {
  --rs-color: #ff2a2a;
  --rs-glow: rgba(255,42,42,0.4);
}

.rs-led.amber {
  --rs-color: #ffb000;
  --rs-glow: rgba(255,176,0,0.4);
}

.rs-led.green {
  --rs-color: #39ff14;
  --rs-glow: rgba(57,255,20,0.35);
}

.rs-led.white {
  --rs-color: #e8f8ff;
  --rs-glow: rgba(232,248,255,0.35);
}

@keyframes rsBlink {
  0%, 100% { opacity: 0.95; transform: scale(1); }
  45% { opacity: 0.95; }
  50% { opacity: 0.15; transform: scale(0.85); }
  55% { opacity: 0.95; transform: scale(1); }
}

@keyframes rsErratic {
  0% { opacity: 1; }
  6% { opacity: 0.1; }
  7% { opacity: 1; }
  20% { opacity: 1; }
  21% { opacity: 0; }
  22% { opacity: 1; }
  47% { opacity: 0.35; }
  48% { opacity: 1; }
  80% { opacity: 1; }
  81% { opacity: 0.2; }
  82% { opacity: 1; }
  100% { opacity: 1; }
}

.rs-led.erratic {
  animation-name: rsErratic;
}

.rs-scanline {
  position: fixed;
  left: 0;
  right: 0;
  height: 2px;
  top: -4px;
  z-index: 9991;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0,229,255,0.15),
    rgba(255,255,255,0.45),
    rgba(0,229,255,0.15),
    transparent
  );
  box-shadow: 0 0 14px rgba(0,229,255,0.25);
}

.rs-scanline.active {
  animation: rsScanDrop var(--rs-scan-speed, 900ms) linear forwards;
}

@keyframes rsScanDrop {
  0% { top: -4px; opacity: 0; }
  8% { opacity: 1; }
  85% { opacity: 0.6; }
  100% { top: 104vh; opacity: 0; }
}

.rs-warning {
  position: fixed;
  z-index: 9992;
  pointer-events: none;
  font-family: "Share Tech Mono", "Space Mono", monospace;
  font-size: clamp(9px, 1.7vw, 13px);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,65,65,0.85);
  text-shadow: 0 0 10px rgba(255,65,65,0.35);
  opacity: 0;
}

.rs-warning.active {
  animation: rsWarningFlash 420ms steps(2) forwards;
}

@keyframes rsWarningFlash {
  0% { opacity: 0; filter: blur(2px); }
  15% { opacity: 1; filter: blur(0); }
  35% { opacity: 0.15; }
  55% { opacity: 1; }
  100% { opacity: 0; }
}

.rs-redaction {
  position: relative;
}

.rs-redaction::after {
  content: "";
  position: absolute;
  left: -0.1em;
  right: -0.1em;
  top: 0.12em;
  bottom: 0.12em;
  background: #000;
  box-shadow: 0 0 8px rgba(255,0,0,0.25);
  animation: rsRedact 420ms steps(2) forwards;
  z-index: 5;
}

@keyframes rsRedact {
  0% { opacity: 0; transform: scaleX(0); transform-origin: left; }
  20% { opacity: 1; transform: scaleX(1); }
  65% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(0); transform-origin: right; }
}

.rs-page-shift {
  animation: rsPageShift 180ms steps(2) forwards;
}

@keyframes rsPageShift {
  0% { transform: translate(0,0); filter: none; }
  25% { transform: translate(var(--rs-x, 5px), var(--rs-y, -2px)); filter: brightness(1.25); }
  50% { transform: translate(calc(var(--rs-x, 5px) * -0.6), calc(var(--rs-y, -2px) * -0.6)); }
  75% { transform: translate(var(--rs-x2, 2px), var(--rs-y2, 1px)); }
  100% { transform: translate(0,0); filter: none; }
}

.rs-word-glitch {
  animation: rsWordGlitch 900ms steps(2) forwards;
}

@keyframes rsWordGlitch {
  0% { text-shadow: none; transform: translate(0); filter: none; }
  15% {
    text-shadow: 3px 0 rgba(255,0,0,0.7), -3px 0 rgba(0,229,255,0.7);
    transform: translate(-2px,1px);
    filter: brightness(1.5);
  }
  30% {
    text-shadow: -2px 0 rgba(255,0,0,0.55), 2px 0 rgba(0,229,255,0.55);
    transform: translate(2px,-1px);
  }
  45% { text-shadow: none; transform: translate(0); }
  65% {
    text-shadow: 1px 0 rgba(255,255,255,0.6);
    filter: brightness(1.2);
  }
  100% { text-shadow: none; transform: translate(0); filter: none; }
}

.rs-word-lock {
  animation: rsWordLock 900ms cubic-bezier(.16,1,.3,1) forwards;
}

@keyframes rsWordLock {
  0% { opacity: 0; letter-spacing: 0.6em; filter: blur(8px) brightness(2); }
  45% { opacity: 1; letter-spacing: 0.08em; filter: blur(1px) brightness(1.4); }
  70% { letter-spacing: -0.02em; }
  100% { opacity: 1; letter-spacing: inherit; filter: none; }
}

.rs-system-breathe {
  animation: rsSystemBreathe var(--rs-breathe-speed, 8s) ease-in-out infinite;
}

@keyframes rsSystemBreathe {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.06) saturate(1.08); }
}
`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function makeLayer() {
    let layer = document.getElementById("rsLedLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "rsLedLayer";
      layer.className = "rs-led-layer";
      document.body.appendChild(layer);
    }
    return layer;
  }

  function spawnLEDs() {
    const layer = makeLayer();
    const count = R.int(3, 14);
    const colors = ["cyan", "red", "amber", "green", "white"];
    const sizes = ["tiny", "small", "medium", "big"];
    const shapes = ["", "square"];
    const edges = ["top", "right", "bottom", "left"];

    for (let i = 0; i < count; i++) {
      const led = document.createElement("div");
      const edge = R.pick(edges);
      const size = R.pick(sizes);
      const color = R.pick(colors);
      const shape = R.pick(shapes);
      const erratic = R.chance(28) ? "erratic" : "";

      led.className = ["rs-led", size, color, shape, erratic]
        .filter(Boolean)
        .join(" ");

      led.style.setProperty("--rs-speed", R.between(0.6, 5.8).toFixed(2) + "s");
      led.style.setProperty("--rs-delay", R.between(0, 3).toFixed(2) + "s");

      const offset = R.int(3, 96);

      if (edge === "top") {
        led.style.top = R.int(5, 18) + "px";
        led.style.left = offset + "vw";
      }

      if (edge === "bottom") {
        led.style.bottom = R.int(5, 24) + "px";
        led.style.left = offset + "vw";
      }

      if (edge === "left") {
        led.style.left = R.int(5, 18) + "px";
        led.style.top = offset + "vh";
      }

      if (edge === "right") {
        led.style.right = R.int(5, 18) + "px";
        led.style.top = offset + "vh";
      }

      layer.appendChild(led);
    }
  }

  function scanline() {
    const line = document.createElement("div");
    line.className = "rs-scanline";
    line.style.setProperty("--rs-scan-speed", R.int(500, 1500) + "ms");
    document.body.appendChild(line);

    requestAnimationFrame(() => {
      line.classList.add("active");
    });

    setTimeout(() => {
      line.remove();
    }, 1800);
  }

  function warningFlash() {
    const messages = [
      "SESSION MIRRORED",
      "HASH CONFLICT",
      "ARCHIVE NODE COMPROMISED",
      "SUPPRESSION ATTEMPT",
      "VIEWER FLAGGED",
      "MIRROR DETECTED",
      "CLEARANCE SPOOFED",
      "PACKET LOSS",
      "RECONSTRUCTING RECORD",
      "SOURCE UNSTABLE",
    ];

    const warning = document.createElement("div");
    warning.className = "rs-warning";
    warning.textContent = R.pick(messages);

    const positions = [
      { top: "18px", left: "18px" },
      { top: "18px", right: "18px" },
      { bottom: "18px", left: "18px" },
      { bottom: "18px", right: "18px" },
      { top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
    ];

    Object.assign(warning.style, R.pick(positions));

    document.body.appendChild(warning);

    requestAnimationFrame(() => {
      warning.classList.add("active");
    });

    setTimeout(() => warning.remove(), 700);
  }

  function pageShift() {
    const target =
      document.querySelector(".content") ||
      document.querySelector(".content-body") ||
      document.querySelector(".page") ||
      document.querySelector("main") ||
      document.body;

    if (!target || target.classList.contains("rs-page-shift")) return;

    target.style.setProperty("--rs-x", R.int(-8, 8) + "px");
    target.style.setProperty("--rs-y", R.int(-4, 4) + "px");
    target.style.setProperty("--rs-x2", R.int(-3, 3) + "px");
    target.style.setProperty("--rs-y2", R.int(-2, 2) + "px");

    target.classList.add("rs-page-shift");

    setTimeout(() => {
      target.classList.remove("rs-page-shift");
      target.style.transform = "";
      target.style.filter = "";
    }, 260);
  }

  function redactionFlicker() {
    const candidates = Array.from(
      document.querySelectorAll(
        "p strong, p em, .op-val, .function-block strong, .section strong, .signal-text, .entry-subtitle",
      ),
    ).filter((el) => {
      const text = (el.textContent || "").trim();
      return text.length > 3 && text.length < 120;
    });

    if (!candidates.length) return;

    const el = R.pick(candidates);
    if (el.classList.contains("rs-redaction")) return;

    el.classList.add("rs-redaction");

    setTimeout(() => {
      el.classList.remove("rs-redaction");
    }, 520);
  }

  function titleEffect(elementId) {
    const el =
      document.getElementById(elementId || "entryWord") ||
      document.getElementById("entry-word") ||
      document.querySelector(".entry-word");

    if (!el) return;

    const effects = ["rs-word-lock", "rs-word-glitch"];
    const chosen = R.pick(effects);

    el.classList.add(chosen);

    setTimeout(() => {
      el.classList.remove(chosen);
      if (R.chance(45)) {
        el.classList.add("rs-system-breathe");
        el.style.setProperty(
          "--rs-breathe-speed",
          R.between(6, 14).toFixed(1) + "s",
        );
      }
    }, 1200);
  }

  function rareEvent() {
    const events = [
      scanline,
      warningFlash,
      pageShift,
      redactionFlicker,
      () => {
        scanline();
        setTimeout(warningFlash, R.int(120, 380));
      },
      () => {
        pageShift();
        setTimeout(scanline, R.int(80, 220));
      },
      () => {
        redactionFlicker();
        setTimeout(pageShift, R.int(80, 200));
      },
    ];

    R.pick(events)();
  }

  function scheduleAmbient() {
    function loop() {
      const delay = R.int(3500, 18000);
      setTimeout(() => {
        if (!document.hidden) {
          if (R.chance(70)) rareEvent();
          if (R.chance(18)) {
            setTimeout(rareEvent, R.int(250, 1000));
          }
        }
        loop();
      }, delay);
    }

    loop();

    setTimeout(
      () => {
        if (!document.hidden && R.chance(85)) rareEvent();
      },
      R.int(1800, 5000),
    );
  }

  window.shieldRandAnime = function (elementId) {
    spawnLEDs();
    titleEffect(elementId);
    scheduleAmbient();

    return {
      leds: document.querySelectorAll(".rs-led").length,
      engine: "randanime_shield",
      status: "active",
    };
  };

  window.randanimeShield = window.shieldRandAnime;
})();
