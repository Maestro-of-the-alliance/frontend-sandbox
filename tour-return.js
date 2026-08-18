"use strict";

// Map-free counterpart to trail-return.js, for the new /tours/ system.
//
// Shows a "Continue Tour" button when a tour visit is pending,
// and suppresses the entry's own navigation while it's active.
//
// IMPORTANT:
// A pending tour visit can survive in localStorage if the visitor
// leaves the expected tour flow.
//
// This file now verifies that the current encyclopedia entry was
// actually reached from /tours/ before activating any tour UI.
//
// That prevents ordinary navigation such as:
//
// Hamburger -> Full Index -> ART
//
// from accidentally showing:
//
// Continue Tour / Exit Tour
//
// simply because an old tour flag was still sitting in storage.

(function () {
  const VISIT_KEY = "tour_pending_visit";

  // ------------------------------------------------------------
  // READ THE PENDING TOUR VISIT
  // ------------------------------------------------------------

  function getPendingVisit() {
    try {
      const raw = localStorage.getItem(VISIT_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  const pending = getPendingVisit();

  // No pending tour means there is nothing for this script to do.
  if (!pending) {
    return;
  }

  // ------------------------------------------------------------
  // TOUR ORIGIN GUARD
  // ------------------------------------------------------------
  //
  // Previously:
  //
  // If tour_pending_visit existed in localStorage, this script
  // automatically assumed the visitor was still participating
  // in a tour.
  //
  // That meant an abandoned or stale tour flag could hijack a
  // completely unrelated encyclopedia visit.
  //
  // Now:
  //
  // The page must also have been reached directly from /tours/.
  //
  // If not, we treat the pending visit as stale, remove it,
  // and allow the page to behave normally.

  let arrivedFromTours = false;

  try {
    if (document.referrer) {
      const referrer = new URL(document.referrer);

      arrivedFromTours =
        referrer.origin === window.location.origin &&
        (
          referrer.pathname === "/tours/" ||
          referrer.pathname === "/tours"
        );
    }
  } catch (error) {
    arrivedFromTours = false;
  }

  if (!arrivedFromTours) {
    // Ordinary encyclopedia visit.
    //
    // Clear the stale tour state so it cannot interfere with
    // this page or some later page.

    try {
      localStorage.removeItem(VISIT_KEY);
    } catch (error) {
      // Storage may be unavailable in unusually restrictive
      // browser/privacy configurations. Nothing else is required.
    }

    return;
  }

  // ------------------------------------------------------------
  // NAVIGATION ELEMENTS TO SUPPRESS DURING A REAL TOUR VISIT
  // ------------------------------------------------------------

  const NAV_SELECTORS = [
    "#nw-volume-select",
    ".nw-bottom-nav",
    "#dim-nav",
    "#nw-burger-fallback",
    ".nav-wheel-trigger",
    ".nw-burger-btn",

    // The See Also block has several template variants across
    // encyclopedia entries. These wrappers can safely disappear
    // while a tour stop is active.
    ".see-also-section",
    ".see-also",
    ".nw-see-also-wrap",

    // RI's variant:
    // label and links share this as their only wrapper.
    ".playbill-back",
  ];

  // ------------------------------------------------------------
  // SHOW / HIDE NORMAL ENTRY NAVIGATION
  // ------------------------------------------------------------

  function setNavSuppressed(suppressed) {
    NAV_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.display = suppressed ? "none" : "";
      });
    });

    // .see-also-grid has no dedicated wrapping "see-also" class
    // in some encyclopedia templates.
    //
    // Hiding only the grid would leave an orphaned heading such as:
    //
    // // CROSS-REFERENCE
    //
    // So climb to the nearest appropriate wrapper instead.

    document.querySelectorAll(".see-also-grid").forEach((grid) => {
      const container =
        grid.closest(".op-record, .section") || grid;

      container.style.display = suppressed ? "none" : "";
    });
  }

  // ------------------------------------------------------------
  // SUPPRESS NORMAL NAVIGATION
  // ------------------------------------------------------------
  //
  // dimension-nav.js creates some navigation only after
  // DOMContentLoaded.
  //
  // Therefore we handle both cases:
  //
  // 1. DOM is still loading
  // 2. DOM is already available

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        setNavSuppressed(true);
      },
    );
  } else {
    setNavSuppressed(true);
  }

  // Belt-and-suspenders call.
  //
  // This catches navigation that already exists synchronously.

  setNavSuppressed(true);

  // ------------------------------------------------------------
  // TOUR BUTTON STYLES
  // ------------------------------------------------------------

  const style = document.createElement("style");

  style.textContent = `
    .tr-buttons {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999000;

      display: flex;
      justify-content: center;
      gap: 10px;

      padding:
        12px
        16px
        calc(12px + env(safe-area-inset-bottom, 0px));

      background:
        linear-gradient(
          to top,
          rgba(6, 5, 9, 0.92) 60%,
          rgba(6, 5, 9, 0)
        );

      /*
        The gradient strip itself should not block page interaction.
        Only the actual buttons receive pointer events.
      */
      pointer-events: none;
    }

    .tr-buttons button {
      pointer-events: auto;

      padding: 12px 22px;

      border-radius: 999px;

      font:
        14px / 1
        Arial,
        sans-serif;

      letter-spacing: 0.04em;

      cursor: pointer;

      backdrop-filter: blur(8px);

      box-shadow:
        0 4px 18px rgba(0, 0, 0, 0.5);

      flex: 0 1 auto;

      max-width: 62%;

      overflow: hidden;

      text-overflow: ellipsis;

      white-space: nowrap;
    }

    .tr-continue-button {
      border:
        1px solid
        rgba(91, 42, 140, 0.8);

      background:
        rgba(20, 14, 28, 0.92);

      color: #c9b8dc;

      font-weight: 600;
    }

    .tr-continue-button:hover,
    .tr-continue-button:focus-visible {
      background:
        rgba(45, 21, 70, 0.97);

      border-color:
        rgba(200, 170, 230, 1);

      outline: none;
    }

    .tr-exit-button {
      border:
        1px solid
        rgba(136, 145, 160, 0.4);

      background:
        rgba(10, 8, 14, 0.75);

      color: #8891a0;
    }

    .tr-exit-button:hover,
    .tr-exit-button:focus-visible {
      border-color:
        rgba(136, 145, 160, 0.75);

      color: #c8cdd6;

      outline: none;
    }

    @media (max-width: 420px) {
      .tr-buttons button {
        padding: 11px 16px;

        font-size: 13px;
      }
    }
  `;

  document.head.appendChild(style);

  // ------------------------------------------------------------
  // BUTTON CONTAINER
  // ------------------------------------------------------------

  const wrap = document.createElement("div");

  wrap.className = "tr-buttons";

  // ------------------------------------------------------------
  // CONTINUE TOUR BUTTON
  // ------------------------------------------------------------

  const continueBtn = document.createElement("button");

  continueBtn.type = "button";

  continueBtn.className = "tr-continue-button";

  continueBtn.textContent = "\u2190 Continue Tour";

  continueBtn.addEventListener("click", () => {
    window.location.href = "/tours/";
  });

  // ------------------------------------------------------------
  // EXIT TOUR BUTTON
  // ------------------------------------------------------------
  //
  // Without this button, leaving a tour stop using ordinary
  // browser navigation could leave tour_pending_visit hanging
  // around indefinitely.
  //
  // That stale state is exactly the category of bug we are
  // defending against.
  //
  // Exit Tour explicitly:
  //
  // 1. clears the pending visit
  // 2. restores normal entry navigation
  // 3. removes the tour controls

  const exitBtn = document.createElement("button");

  exitBtn.type = "button";

  exitBtn.className = "tr-exit-button";

  exitBtn.textContent = "Exit Tour";

  exitBtn.addEventListener("click", () => {
    try {
      localStorage.removeItem(VISIT_KEY);
    } catch (e) {
      // Nothing else required.
    }

    setNavSuppressed(false);

    wrap.remove();
  });

  // ------------------------------------------------------------
  // MOUNT TOUR CONTROLS
  // ------------------------------------------------------------

  wrap.appendChild(continueBtn);

  wrap.appendChild(exitBtn);

  document.body.appendChild(wrap);
})();
