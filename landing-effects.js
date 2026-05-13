/* ============================================================
   LANDING EFFECTS — THE ALLIANCE FOR THE FUTURE
   Persistent instability layer for landing page.

   Purpose:
   - after boot sequence ends, the landing page still feels unstable
   - no giant pixel monster
   - no TOC interference
   - subtle “did I just see that?” environmental corruption
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

    pick(array) {
      return array[Math.floor(Math.random() * array.length)];
    },
  };

  function tocIsOpen() {
    const toc = document.getElementById("tocOverlay");
    return toc && toc.classList.contains("open");
  }

  const css = `
    .lfx-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 7999;
      overflow: hidden;
    }

    .lfx-static {
      position: absolute;
      inset: 0;
      opacity: 0;
      mix-blend-mode: screen;
      background-image:
        repeating-radial-gradient(
          rgba(255,255,255,0.035) 0px,
          rgba(255,255,255,0.012) 1px,
          transparent 2px
        );
    }

    .lfx-static.active {
      animation: lfxStatic 160ms steps(2);
    }

    @keyframes lfxStatic {
      0% { opacity: 0; }
      20% { opacity: 0.2; }
      100% { opacity: 0; }
    }

    .lfx-scan {
      position: absolute;
      left: 0;
      right: 0;
      top: -10%;
      height: 3px;
      opacity: 0;
      z-index: 2;
      background:
        linear-gradient(
          90deg,
          transparent,
          rgba(0,255,255,0.18),
          rgba(255,255,255,0.48),
          rgba(0,255,255,0.18),
          transparent
        );
      box-shadow: 0 0 18px rgba(0,255,255,0.18);
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
      z-index: 8000;
      pointer-events: none;
      opacity: 0;

      font-family: "Share Tech Mono", "VT323", monospace;
      font-size: 10px;
      letter-spacing: 0.24em;
      text-transform: uppercase;

      color: rgba(255,60,60,0.82);
      text-shadow: 0 0 10px rgba(255,60,60,0.28);
    }

    .lfx-warning.active {
      animation: lfxWarning 480ms steps(2);
    }

    @keyframes lfxWarning {
      0% { opacity: 0; }
      20% { opacity: 1; }
      40% { opacity: 0.18; }
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
        transform: translate(-2px, 1px);
        filter: brightness(1.35) hue-rotate(8deg);
      }

      40% {
        transform: translate(2px, -1px);
      }

      60% {
        transform: translate(-1px, 0);
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
      z-index: 7998;

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
      animation: lfxBreathe 8s ease-in-out infinite;
    }

    @keyframes lfxBreathe {
      0%, 100% {
        filter: brightness(1) saturate(1);
      }

      50% {
        filter: brightness(1.055) saturate(1.07);
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

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

  const target =
    document.querySelector(".medallion-wrap") ||
    document.querySelector(".medallion-img") ||
    document.querySelector(".hero") ||
    document.querySelector(".page-shell");

  if (target) {
    target.classList.add("lfx-breathe");
  }

  function restartAnimation(element, activeClass) {
    element.classList.remove(activeClass);
    void element.offsetWidth;
    element.classList.add(activeClass);
  }

  function triggerStatic() {
    restartAnimation(staticLayer, "active");
  }

  function triggerScan() {
    scan.style.animationDuration = R.int(700, 1800) + "ms";
    restartAnimation(scan, "active");
  }

  function triggerBand() {
    band.style.top = R.int(10, 80) + "%";
    restartAnimation(band, "active");
  }

  function triggerGlitch() {
    if (!target) return;
    restartAnimation(target, "lfx-glitch");
  }

  function triggerWarning() {
    warning.textContent = R.pick([
      "ACCESS TRACE",
      "MIRROR DETECTED",
      "SIGNAL INTERFERENCE",
      "SUPPRESSION ACTIVE",
      "ARCHIVE UNSTABLE",
      "TRANSMISSION CORRUPTED",
      "VIEWER FLAGGED",
    ]);

    restartAnimation(warning, "active");
  }

  function eventLoop() {
    const delay = R.int(3500, 14000);

    setTimeout(() => {
      if (!document.hidden && !tocIsOpen()) {
        if (R.chance(46)) triggerGlitch();
        if (R.chance(34)) triggerStatic();
        if (R.chance(26)) triggerScan();
        if (R.chance(16)) triggerBand();
        if (R.chance(10)) triggerWarning();

        if (R.chance(7)) {
          setTimeout(triggerGlitch, R.int(120, 500));
        }
      }

      eventLoop();
    }, delay);
  }

  setTimeout(() => {
    if (!tocIsOpen()) {
      triggerScan();

      if (R.chance(60)) {
        triggerGlitch();
      }
    }
  }, 1200);

  eventLoop();
})();
