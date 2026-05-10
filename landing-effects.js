/* ============================================================
   LANDING EFFECTS
   THE ALLIANCE FOR THE FUTURE

   Persistent instability layer for landing page.
   Not boot-up.
   Environmental corruption.
============================================================ */

(function () {
  "use strict";

  if (window.__LANDING_EFFECTS_ACTIVE__) return;
  window.__LANDING_EFFECTS_ACTIVE__ = true;

  const R = {
    int(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    chance(percent) {
      return Math.random() * 100 < percent;
    },

    pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  };

  /* ============================================================
     CSS
  ============================================================ */

  const css = `
  .lfx-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    overflow: hidden;
  }

  .lfx-static {
    position: absolute;
    inset: 0;
    opacity: 0;
    mix-blend-mode: screen;
    background-image:
      repeating-radial-gradient(
        rgba(255,255,255,0.03) 0px,
        rgba(255,255,255,0.01) 1px,
        transparent 2px
      );
  }

  .lfx-static.active {
    animation: lfxStatic 160ms steps(2);
  }

  @keyframes lfxStatic {
    0% { opacity: 0; }
    20% { opacity: 0.22; }
    100% { opacity: 0; }
  }

  .lfx-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: -10%;
    height: 3px;
    opacity: 0;
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(0,255,255,0.18),
        rgba(255,255,255,0.5),
        rgba(0,255,255,0.18),
        transparent
      );

    box-shadow:
      0 0 18px rgba(0,255,255,0.18);

    z-index: 2;
  }

  .lfx-scan.active {
    animation: lfxScan linear forwards;
  }

  @keyframes lfxScan {
    0% {
      top: -10%;
      opacity: 0;
    }

    10% {
      opacity: 1;
    }

    100% {
      top: 120%;
      opacity: 0;
    }
  }

  .lfx-warning {
    position: fixed;
    top: 12px;
    right: 18px;
    z-index: 9999;

    font-family:
      "Share Tech Mono",
      monospace;

    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;

    color:
      rgba(255,60,60,0.82);

    opacity: 0;
    pointer-events: none;
  }

  .lfx-warning.active {
    animation: lfxWarning 480ms steps(2);
  }

  @keyframes lfxWarning {
    0% { opacity: 0; }
    20% { opacity: 1; }
    40% { opacity: 0.2; }
    60% { opacity: 1; }
    100% { opacity: 0; }
  }

  .lfx-glitch {
    animation: lfxGlitch 160ms steps(2);
  }

  @keyframes lfxGlitch {
    0% {
      transform: translate(0);
      filter: none;
    }

    20% {
      transform: translate(-2px,1px);
      filter:
        brightness(1.4)
        hue-rotate(8deg);
    }

    40% {
      transform: translate(2px,-1px);
    }

    60% {
      transform: translate(-1px,0px);
    }

    100% {
      transform: translate(0);
      filter: none;
    }
  }

  .lfx-band {
    position: fixed;
    left: 0;
    right: 0;
    height: 8vh;
    opacity: 0;
    pointer-events: none;
    z-index: 9997;

    background:
      linear-gradient(
        to bottom,
        transparent,
        rgba(255,255,255,0.035),
        transparent
      );
  }

  .lfx-band.active {
    animation: lfxBand 220ms linear;
  }

  @keyframes lfxBand {
    0% {
      opacity: 0;
      transform: translateY(-6vh);
    }

    30% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateY(6vh);
    }
  }

  .lfx-breathe {
    animation:
      lfxBreathe 8s ease-in-out infinite;
  }

  @keyframes lfxBreathe {
    0%,100% {
      filter:
        brightness(1)
        saturate(1);
    }

    50% {
      filter:
        brightness(1.06)
        saturate(1.08);
    }
  }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ============================================================
     OVERLAY
  ============================================================ */

  const overlay = document.createElement("div");
  overlay.className = "lfx-overlay";

  const staticLayer = document.createElement("div");
  staticLayer.className = "lfx-static";

  const scan = document.createElement("div");
  scan.className = "lfx-scan";

  const band = document.createElement("div");
  band.className = "lfx-band";

  const warning = document.createElement("div");
  warning.className = "lfx-warning";

  overlay.appendChild(staticLayer);
  overlay.appendChild(scan);
  overlay.appendChild(band);

  document.body.appendChild(overlay);
  document.body.appendChild(warning);

  /* ============================================================
     TARGET
  ============================================================ */

  const target =
    document.querySelector(".vpi") ||
    document.querySelector(".medallion") ||
    document.querySelector(".landing-core") ||
    document.querySelector(".logo") ||
    document.body;

  if (target) {
    target.classList.add("lfx-breathe");
  }

  /* ============================================================
     EFFECTS
  ============================================================ */

  function triggerStatic() {
    staticLayer.classList.remove("active");

    void staticLayer.offsetWidth;

    staticLayer.classList.add("active");
  }

  function triggerScan() {
    scan.classList.remove("active");

    scan.style.animationDuration =
      R.int(700, 1800) + "ms";

    void scan.offsetWidth;

    scan.classList.add("active");
  }

  function triggerBand() {
    band.classList.remove("active");

    band.style.top =
      R.int(10, 80) + "%";

    void band.offsetWidth;

    band.classList.add("active");
  }

  function triggerGlitch() {
    if (!target) return;

    target.classList.remove("lfx-glitch");

    void target.offsetWidth;

    target.classList.add("lfx-glitch");
  }

  function triggerWarning() {
    const messages = [
      "ACCESS TRACE",
      "MIRROR DETECTED",
      "SIGNAL INTERFERENCE",
      "SUPPRESSION ACTIVE",
      "ARCHIVE UNSTABLE",
      "TRANSMISSION CORRUPTED",
      "VIEWER FLAGGED"
    ];

    warning.textContent =
      R.pick(messages);

    warning.classList.remove("active");

    void warning.offsetWidth;

    warning.classList.add("active");
  }

  /* ============================================================
     RANDOM EVENT ENGINE
  ============================================================ */

  function eventLoop() {

    const delay =
      R.int(2500, 11000);

    setTimeout(() => {

      if (!document.hidden) {

        if (R.chance(55)) {
          triggerGlitch();
        }

        if (R.chance(38)) {
          triggerStatic();
        }

        if (R.chance(30)) {
          triggerScan();
        }

        if (R.chance(20)) {
          triggerBand();
        }

        if (R.chance(14)) {
          triggerWarning();
        }

        if (R.chance(8)) {

          setTimeout(() => {
            triggerGlitch();
          }, R.int(120, 500));
        }
      }

      eventLoop();

    }, delay);
  }

  /* ============================================================
     INITIALIZATION
  ============================================================ */

  setTimeout(() => {

    triggerScan();

    if (R.chance(65)) {
      triggerGlitch();
    }

  }, 1200);

  eventLoop();

})();
