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
    .tr-buttons {
      position: fixed; top: 16px; left: 16px; z-index: 9000;
      display: flex; flex-direction: column; gap: 8px;
    }
    .tr-buttons button {
      padding: 9px 16px; border-radius: 5px;
      font: 13px/1 Arial, sans-serif; letter-spacing: .04em; cursor: pointer;
      backdrop-filter: blur(5px); box-shadow: 0 4px 18px rgba(0,0,0,.4);
    }
    .tr-continue-button {
      border: 1px solid rgba(255,183,70,.8); background: rgba(20,12,8,.9); color: #ffdca3;
    }
    .tr-continue-button:hover, .tr-continue-button:focus-visible {
      background: rgba(72,31,14,.95); border-color: rgba(255,226,163,1); outline: none;
    }
    .tr-exit-button {
      border: 1px solid rgba(255,226,163,.35); background: rgba(20,12,8,.7); color: #d8b98a;
    }
    .tr-exit-button:hover, .tr-exit-button:focus-visible {
      border-color: rgba(255,226,163,.7); color: #fff4ce; outline: none;
    }
    @media (max-width: 600px) {
      .tr-buttons { top: 10px; left: 10px; gap: 6px; }
      .tr-buttons button { padding: 7px 12px; font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.className = "tr-buttons";

  const continueBtn = document.createElement("button");
  continueBtn.type = "button";
  continueBtn.className = "tr-continue-button";
  continueBtn.textContent = "\u2190 Continue Tour";
  continueBtn.addEventListener("click", () => {
    window.location.href = "/tours/";
  });

  // Without this, the only way to leave without finishing the stop was
  // the browser's own back button -- which leaves the pending-visit
  // flag dangling until *whenever* the visitor next lands on /tours/,
  // even much later for an unrelated reason, at which point it would
  // silently mark this stop complete and surface a PapaDomo line out
  // of nowhere. Exit Tour clears that flag explicitly, so leaving
  // without finishing is a real, clean choice, not an accident waiting
  // to resurface.
  const exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.className = "tr-exit-button";
  exitBtn.textContent = "Exit Tour";
  exitBtn.addEventListener("click", () => {
    try {
      localStorage.removeItem(VISIT_KEY);
    } catch (e) {}
    setNavSuppressed(false);
    wrap.remove();
  });

  wrap.appendChild(continueBtn);
  wrap.appendChild(exitBtn);
  document.body.appendChild(wrap);
})();
