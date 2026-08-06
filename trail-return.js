"use strict";
// Shared across entry pages. Shows two small buttons whenever the visitor
// arrived here from a THE GRAND CANyON trail stop (grand-canyon.js sets
// gc_pending_visit in localStorage right before navigating here):
//   - Return to Trail: sends them back to /grand-canyon/, where
//     grand-canyon.js reads gc_pending_visit on load, completes the stop,
//     restores the trail view, and hands off to PapaDomo.
//   - Exit Trail: clears gc_pending_visit and removes both buttons,
//     leaving the visitor exactly where they are with the entry's own
//     normal navigation (nav-wheel, search, etc.) fully live -- the stop
//     is NOT marked complete, since they chose to wander instead of
//     continuing the guided tour.
// This script only needs to know whether to show the buttons and where
// to send the visitor; it holds no trail state of its own.
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

  function clearPendingVisit() {
    try {
      localStorage.removeItem(VISIT_KEY);
    } catch (e) {}
  }

  const pending = getPendingVisit();
  if (!pending) return;

  const style = document.createElement("style");
  style.textContent = `
    .gc-trail-buttons {
      position: fixed; top: 16px; left: 16px; z-index: 9000;
      display: flex; flex-direction: column; gap: 8px;
    }
    .gc-trail-buttons button {
      padding: 9px 16px; border-radius: 5px;
      font: 13px/1 Arial, sans-serif; letter-spacing: .04em; cursor: pointer;
      backdrop-filter: blur(5px); box-shadow: 0 4px 18px rgba(0,0,0,.4);
      transition: background 160ms ease, border-color 160ms ease;
    }
    .gc-return-button {
      border: 1px solid rgba(255,183,70,.8); background: rgba(20,12,8,.9); color: #ffdca3;
    }
    .gc-return-button:hover, .gc-return-button:focus-visible {
      background: rgba(72,31,14,.95); border-color: rgba(255,226,163,1); outline: none;
    }
    .gc-exit-button {
      border: 1px solid rgba(255,226,163,.35); background: rgba(20,12,8,.7); color: #d8b98a;
    }
    .gc-exit-button:hover, .gc-exit-button:focus-visible {
      border-color: rgba(255,226,163,.7); color: #fff4ce; outline: none;
    }
    @media (max-width: 600px) {
      .gc-trail-buttons { top: 10px; left: 10px; gap: 6px; }
      .gc-trail-buttons button { padding: 7px 12px; font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.className = "gc-trail-buttons";

  const returnBtn = document.createElement("button");
  returnBtn.type = "button";
  returnBtn.className = "gc-return-button";
  returnBtn.textContent = "\u2190 Return to Trail";
  returnBtn.addEventListener("click", () => {
    window.location.href = "/grand-canyon/";
  });

  const exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.className = "gc-exit-button";
  exitBtn.textContent = "Exit Trail";
  exitBtn.addEventListener("click", () => {
    clearPendingVisit();
    wrap.remove();
  });

  wrap.appendChild(returnBtn);
  wrap.appendChild(exitBtn);
  document.body.appendChild(wrap);
})();
