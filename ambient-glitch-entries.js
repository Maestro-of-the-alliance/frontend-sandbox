/**
 * ambient-glitch-entries.js — N.C.E.ncyclopedia entry pages
 * The quiet cousin of /ambient-glitch.js (landing's full broadcast-
 * disruption engine). Same visual family -- scanline sweep, subtle
 * skew/shake -- but rare and restrained. Entries live in the same
 * TRANSMISSION world as landing without landing's full intensity.
 * Requested directly: "not a shit ton, just the occasional skew."
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  function menuIsOpen() {
    const hub = document.getElementById("hub-overlay");
    if (hub && hub.classList.contains("open")) return true;
    const toc = document.getElementById("tocOverlay");
    if (toc && toc.classList.contains("open")) return true;
    return false;
  }

  const style = document.createElement("style");
  style.textContent = `
    #eg-scanline {
      position: fixed; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(255,80,80,0.55) 20%, rgba(255,255,255,0.85) 50%, rgba(0,200,255,0.55) 80%, transparent 100%);
      z-index: 9990; pointer-events: none; opacity: 0;
      box-shadow: 0 0 8px rgba(255,255,255,0.5);
    }
    @keyframes egScanDrop {
      0%   { top: -2px; opacity: 1; }
      85%  { opacity: 0.55; }
      100% { top: 102vh; opacity: 0; }
    }
    @keyframes egSkew {
      0%   { transform: translate(0,0) skewX(0deg); }
      20%  { transform: translate(-2px, 1px) skewX(-0.6deg); }
      40%  { transform: translate(2px, -1px) skewX(0.5deg); }
      60%  { transform: translate(-1px, 1px) skewX(-0.3deg); }
      80%  { transform: translate(1px, -1px) skewX(0.3deg); }
      100% { transform: translate(0,0) skewX(0deg); }
    }
    body.eg-skewing { animation: egSkew 0.35s ease-in-out; }
  `;
  document.head.appendChild(style);

  const scanline = document.createElement("div");
  scanline.id = "eg-scanline";
  document.body.appendChild(scanline);

  function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  function fireScanline() {
    if (menuIsOpen() || document.hidden) return;
    const duration = 500 + Math.random() * 400;
    scanline.style.top = rand(5, 70) + "vh";
    scanline.style.opacity = "1";
    scanline.style.animation = `egScanDrop ${duration}ms linear forwards`;
    setTimeout(() => {
      scanline.style.animation = "none";
      scanline.style.opacity = "0";
    }, duration + 30);
  }

  function fireSkew() {
    if (menuIsOpen() || document.hidden) return;
    document.body.classList.add("eg-skewing");
    setTimeout(() => document.body.classList.remove("eg-skewing"), 400);
  }

  // Occasional only -- roughly one small moment per minute, never both
  // effects stacked, well under landing's density on purpose.
  function schedule(minMs, maxMs, handler) {
    (function fire() {
      setTimeout(
        () => {
          handler();
          fire();
        },
        rand(minMs, maxMs),
      );
    })();
  }

  schedule(45000, 95000, fireScanline);
  schedule(60000, 130000, fireSkew);
})();
