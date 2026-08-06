"use strict";
// Shared across entry pages. Shows a small "Return to Trail" button
// whenever the visitor arrived here from a THE GRAND CANyON trail stop
// (grand-canyon.js sets gc_pending_visit in localStorage right before
// navigating here). Clicking it just sends them back to /grand-canyon/ --
// grand-canyon.js itself reads gc_pending_visit on load there and
// handles completing the stop, restoring the trail, and showing
// PapaDomo. This script only needs to know whether to show the button
// and where to send the visitor; it holds no trail state of its own.
(function () {
  const VISIT_KEY = "gc_pending_visit";

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

  const style = document.createElement("style");
  style.textContent = `
    .gc-return-button {
      position: fixed; top: 16px; left: 16px; z-index: 9000;
      padding: 9px 16px; border: 1px solid rgba(255,183,70,.8); border-radius: 5px;
      background: rgba(20,12,8,.9); color: #ffdca3; font: 13px/1 Arial, sans-serif;
      letter-spacing: .04em; cursor: pointer; backdrop-filter: blur(5px);
      box-shadow: 0 4px 18px rgba(0,0,0,.4);
      transition: background 160ms ease, border-color 160ms ease;
    }
    .gc-return-button:hover, .gc-return-button:focus-visible {
      background: rgba(72,31,14,.95); border-color: rgba(255,226,163,1); outline: none;
    }
    @media (max-width: 600px) {
      .gc-return-button { top: 10px; left: 10px; padding: 7px 12px; font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "gc-return-button";
  btn.textContent = "\u2190 Return to Trail";
  btn.addEventListener("click", () => {
    window.location.href = "/grand-canyon/";
  });
  document.body.appendChild(btn);
})();
