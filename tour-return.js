"use strict";
// Map-free counterpart to trail-return.js, for the new /tours/ system.
// Shows a "Continue Tour" button when a tour visit is pending, and
// suppresses the entry's own navigation while it's active -- same
// selector list and same DOMContentLoaded handling as trail-return.js
// (dimension-nav.js defers its own element creation to that event
// rather than building synchronously, so suppression has to catch it
// either way, whichever fires first).
(function () {
  const VISIT_KEY = "tour_pending_visit";

  function getPendingVisit() {
    try {
      const raw = localStorage.getItem(VISIT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  const pending = getPendingVisit();
  if (!pending) return;

  const NAV_SELECTORS = [
    "#nw-search-fab",
    "#nw-volume-select",
    ".nw-bottom-nav",
    "#dim-nav",
    "#nw-burger-fallback",
    ".nav-wheel-trigger",
    ".nw-burger-btn",
    ".see-also-section",
  ];
  function setNavSuppressed(suppressed) {
    NAV_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.display = suppressed ? "none" : "";
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setNavSuppressed(true));
  } else {
    setNavSuppressed(true);
  }
  setNavSuppressed(true);

  const style = document.createElement("style");
  style.textContent = `
    .tr-continue-button {
      position: fixed; top: 16px; left: 16px; z-index: 9000;
      padding: 9px 16px; border: 1px solid rgba(255,183,70,.8); border-radius: 5px;
      background: rgba(20,12,8,.9); color: #ffdca3; font: 13px/1 Arial, sans-serif;
      letter-spacing: .04em; cursor: pointer; backdrop-filter: blur(5px);
      box-shadow: 0 4px 18px rgba(0,0,0,.4);
    }
    .tr-continue-button:hover, .tr-continue-button:focus-visible {
      background: rgba(72,31,14,.95); border-color: rgba(255,226,163,1); outline: none;
    }
    @media (max-width: 600px) {
      .tr-continue-button { top: 10px; left: 10px; padding: 7px 12px; font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tr-continue-button";
  btn.textContent = "\u2190 Continue Tour";
  btn.addEventListener("click", () => {
    window.location.href = "/tours/";
  });
  document.body.appendChild(btn);
})();
