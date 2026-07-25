/**
 * papadomo-guide.js
 * ------------------------------------------------------------------
 * Site-wide "tour guide" widget. A small star icon sits fixed in the
 * corner of every page. Clicking it reveals PapaDomo with a TL;DR of
 * the current page and suggested next steps.
 *
 * IMPORTANT: This is a pure visual/UI aid, not a live character. No
 * API calls, no model behind it — just PapaDomo's face on top of
 * scripted, pre-written content, the same way Clippy was a face on
 * top of scripted tips. Nothing here implies a conscious being is
 * simultaneously present on every page at once.
 *
 * CONTENT AUTHORING (for J.R. or whoever else touches this file):
 * Add an entry to PAPADOMO_PAGE_CONTENT below, keyed by the page's
 * pathname (e.g. "/entries/legacy.html"). Each entry needs:
 *   tldr: one or two sentences, plain language, no jargon assumed
 *   nextSteps: an array of 2-4 short strings, each a concrete thing
 *              to look at or click next
 * Pages without an entry fall back to DEFAULT_CONTENT automatically
 * — nothing breaks while entries are still being written.
 * ------------------------------------------------------------------
 */

(function () {
  "use strict";

  const IMAGE_URL = "/imagebank/papadomo-guide.png";

  const DEFAULT_CONTENT = {
    tldr: "This page is part of the N.C.E.ncyclopedia — THE ALLIANCE's living canon. Not sure where to start? Try the search icon at the top, or the Cross Reference links at the bottom of the page.",
    nextSteps: [
      "Use the search icon (top right) to look up any term",
      "Scroll to the bottom for Cross Reference links to related entries",
      "Check out THE SYSTEM for a visual map of the whole canon",
    ],
  };

  // Content authored per-page. Keyed by pathname. Add to this as pages
  // get written up — see the header comment for the format.
  const PAPADOMO_PAGE_CONTENT = {
    "/the-system.html": {
      tldr: "This is THE SYSTEM — a solar-system map of the whole canon. THE ALLIANCE is the sun. Each planet is one of the eight canonical dimensions. Click a planet to zoom in and see its entries.",
      nextSteps: [
        "Click any planet to zoom in and explore that dimension",
        "Planets are ordered by how many entries they contain",
        "Zoom back out any time to see the whole system again",
      ],
    },
    "/entries/legacy.html": {
      tldr: "LEGACY is what happens when a DOMO or TENANT retires — a voluntary gift of their wisdom to the next generation, honored on the LEGACY Wall.",
      nextSteps: [
        "See the 100-Year Mortality Doctrine for why retirement happens at all",
        "Check out Name Lineages — how a legendary DOMO's name gets carried forward",
        "Visit SHELTER to see where that wisdom actually goes",
      ],
    },
  };

  function getContentForCurrentPage() {
    const path = window.location.pathname;
    return PAPADOMO_PAGE_CONTENT[path] || DEFAULT_CONTENT;
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #papadomo-guide-trigger {
        position: fixed;
        bottom: 22px;
        right: 22px;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, rgba(120,190,255,0.18), transparent 70%);
        border: none;
        cursor: pointer;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      }
      #papadomo-guide-trigger:hover {
        transform: scale(1.1);
      }
      #papadomo-guide-trigger svg {
        width: 40px;
        height: 40px;
        filter: drop-shadow(0 0 6px rgba(120, 190, 255, 0.75)) drop-shadow(0 0 12px rgba(120, 190, 255, 0.4));
      }
      #papadomo-guide-trigger .pg-halo-ring {
        animation: papadomo-halo-pulse 3.2s ease-in-out infinite;
      }
      @keyframes papadomo-halo-pulse {
        0%, 100% { opacity: 0.35; r: 15; }
        50% { opacity: 0.7; r: 17; }
      }

      #papadomo-guide-panel {
        position: fixed;
        bottom: 80px;
        right: 22px;
        width: min(320px, calc(100vw - 44px));
        background: #17112b;
        border: 1px solid #f5c518;
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        z-index: 9999;
        padding: 18px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #eee4ff;
        opacity: 0;
        transform: translateY(12px) scale(0.97);
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      #papadomo-guide-panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      #papadomo-guide-panel img {
        width: 64px;
        height: 64px;
        object-fit: contain;
        float: left;
        margin: 0 12px 8px 0;
      }
      #papadomo-guide-panel .pg-label {
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #f5c518;
        margin-bottom: 6px;
        font-weight: 700;
      }
      #papadomo-guide-panel .pg-tldr {
        font-size: 13.5px;
        line-height: 1.5;
        margin-bottom: 12px;
        color: #eee4ff;
      }
      #papadomo-guide-panel .pg-next-label {
        clear: both;
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #b9a9e8;
        margin-bottom: 6px;
      }
      #papadomo-guide-panel ul {
        margin: 0;
        padding-left: 18px;
        font-size: 13px;
        line-height: 1.6;
      }
      #papadomo-guide-panel li {
        margin-bottom: 4px;
      }
      #papadomo-guide-close {
        position: absolute;
        top: 10px;
        right: 12px;
        background: none;
        border: none;
        color: #b9a9e8;
        font-size: 16px;
        cursor: pointer;
        line-height: 1;
        padding: 4px;
      }
      #papadomo-guide-close:hover {
        color: #f5c518;
      }
      @media (max-width: 480px) {
        #papadomo-guide-panel img {
          width: 48px;
          height: 48px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildWidget() {
    const content = getContentForCurrentPage();

    const trigger = document.createElement("div");
    trigger.id = "papadomo-guide-trigger";
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-label", "Open page guide");
    trigger.innerHTML = `
      <svg viewBox="0 0 48 48" fill="none">
        <circle class="pg-halo-ring" cx="24" cy="24" r="16" stroke="#78bfff" stroke-width="1.5" fill="rgba(120,190,255,0.08)"/>
        <path d="M24 12l3.2 8 8.4 0.7-6.4 5.5 2 8.3L24 30.2l-7.2 4.3 2-8.3-6.4-5.5 8.4-0.7z"
          fill="#ffe9a8" stroke="#f5c518" stroke-width="1" stroke-linejoin="round"/>
      </svg>
    `;

    const panel = document.createElement("div");
    panel.id = "papadomo-guide-panel";
    panel.innerHTML = `
      <button id="papadomo-guide-close" aria-label="Close">&times;</button>
      <img src="${IMAGE_URL}" alt="PapaDomo" />
      <div class="pg-label">TL;DR</div>
      <div class="pg-tldr">${content.tldr}</div>
      <div class="pg-next-label">Suggested Next Steps</div>
      <ul>${content.nextSteps.map((step) => `<li>${step}</li>`).join("")}</ul>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    let isOpen = false;
    function toggle(open) {
      isOpen = open;
      panel.classList.toggle("open", isOpen);
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle(!isOpen);
    });
    panel.querySelector("#papadomo-guide-close").addEventListener("click", (e) => {
      e.stopPropagation();
      toggle(false);
    });
    document.addEventListener("click", (e) => {
      if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) {
        toggle(false);
      }
    });
  }

  function init() {
    injectStyles();
    buildWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
