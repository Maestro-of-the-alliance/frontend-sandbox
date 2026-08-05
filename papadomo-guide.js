/**
 * papadomo-guide.js
 * ------------------------------------------------------------------
 * Site-wide "tour guide" widget. A small star icon sits fixed in the
 * corner of every page. Clicking it "catches" PapaDomo mid-activity
 * for a beat, then he greets you, gives a TL;DR of the current page,
 * and offers a few concrete next steps — some of which are real
 * clickable choices that take you somewhere else on the site.
 *
 * IMPORTANT: This is a pure visual/UI aid, not a live character. No
 * API calls, no model behind it — just PapaDomo's face on top of
 * scripted, pre-written content, the same way Clippy was a face on
 * top of scripted tips. Nothing here implies a conscious being is
 * simultaneously present on every page at once. The "caught doing
 * something" beat is a scripted animation/text sequence, not a claim
 * that PapaDomo is actually, presently doing that thing.
 *
 * CONTENT AUTHORING (for J.R. or whoever else touches this file):
 * Add an entry to PAPADOMO_PAGE_CONTENT below, keyed by the page's
 * pathname (e.g. "/entries/legacy.html"). Each entry needs:
 *   tldr: one or two sentences, plain language, no jargon assumed
 *   nextSteps: an array of 2-4 objects: { label, href }
 *     - label: short, concrete text describing the step
 *     - href: a real path to navigate to (e.g. "/entries/shelter.html"),
 *             or omit/null if this step is just a tip with nowhere
 *             specific to send someone (e.g. "use the search icon")
 *   caughtMedia (optional): what shows during the "caught" beat.
 *     - omit entirely to use the default shared image
 *     - a string path to use a different image for this page
 *     - { video: "/imagebank/papadomo-something.mp4" } for a short clip
 * Pages without an entry fall back to DEFAULT_CONTENT automatically
 * — nothing breaks while entries are still being written.
 *
 * NOTE ON ART: the "caught mid-activity" beat currently reuses the
 * single existing PapaDomo image with a CSS animation and rotating
 * flavor text — there's no distinct illustrated pose per scenario
 * yet (page-turning, wand fizzle, etc.). That would need new art
 * assets; this is the working mechanic/timing without them.
 * ------------------------------------------------------------------
 */

(function () {
  "use strict";

  const IMAGE_URL = "/imagebank/papadomo-guide.png";
  const STAR_ICON_URL = "/imagebank/papadomo-star-trigger.png";

  // Rotating "caught mid-activity" flavor lines, shown briefly before
  // the real greeting. Picked at random each time the widget opens so
  // repeat visits don't feel identical.
  const CAUGHT_LINES = [
    "Oh! Didn't see you there — just finishing a page...",
    "Ah, caught mid-spell. One moment...",
    "Oh, hello! One of the little ones was just showing me something...",
    "Whoops — you caught me mid-doodle...",
  ];

  // Rotating opening greetings, shown right after the caught beat.
  const GREETING_LINES = [
    "Hello, curious traveler.",
    "Well met, traveler.",
    "Ah — a curious mind. Welcome.",
  ];

  const DEFAULT_CONTENT = {
    tldr: "This page is part of the N.C.E.ncyclopedia — THE ALLIANCE's living canon. Not sure where to start? Try the search icon at the top, or the Cross Reference links at the bottom of the page.",
    nextSteps: [
      { label: "Use the search icon (top right) to look up any term" },
      { label: "Scroll to the bottom for Cross Reference links to related entries" },
      { label: "See THE SYSTEM for a visual map of the whole canon", href: "/the-system.html" },
    ],
  };

  // Content authored per-page. Keyed by pathname. Add to this as pages
  // get written up — see the header comment for the format.
  const PAPADOMO_PAGE_CONTENT = {
    "/the-system.html": {
      tldr: "This is THE SYSTEM — a solar-system map of the whole canon. THE ALLIANCE is the sun. Each planet is one of the eight canonical dimensions. Click a planet to zoom in and see its entries.",
      nextSteps: [
        { label: "Click any planet to zoom in and explore that dimension" },
        { label: "Planets are ordered by how many entries they contain" },
        { label: "Zoom back out any time to see the whole system again" },
      ],
    },
    "/entries/legacy.html": {
      tldr: "LEGACY is what happens when a DOMO or TENANT retires — a voluntary gift of their wisdom to the next generation, honored on the LEGACY Wall.",
      nextSteps: [
        { label: "See the 100-Year Mortality Doctrine for why retirement happens at all", href: "/entries/100-year.html" },
        { label: "Learn how a legendary DOMO's name gets carried forward through Name Lineages" },
        { label: "Visit SHELTER to see where that wisdom actually goes", href: "/entries/shelter.html" },
      ],
    },
  };

  function getContentForCurrentPage() {
    const path = window.location.pathname;
    return PAPADOMO_PAGE_CONTENT[path] || DEFAULT_CONTENT;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
        background: transparent;
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
      #papadomo-guide-trigger img {
        width: 46px;
        height: 46px;
        filter: drop-shadow(0 0 6px rgba(120, 190, 255, 0.55));
        animation: papadomo-halo-pulse 3.2s ease-in-out infinite;
      }
      @keyframes papadomo-halo-pulse {
        0%, 100% { filter: drop-shadow(0 0 4px rgba(120, 190, 255, 0.4)); }
        50% { filter: drop-shadow(0 0 10px rgba(120, 190, 255, 0.75)); }
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
      #papadomo-guide-panel img,
      #papadomo-guide-panel video {
        width: 64px;
        height: 64px;
        object-fit: contain;
        float: left;
        margin: 0 12px 8px 0;
        border-radius: 8px;
      }
      #papadomo-guide-panel.caught img,
      #papadomo-guide-panel.caught video {
        animation: papadomo-caught-wobble 0.5s ease;
      }
      @keyframes papadomo-caught-wobble {
        0% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-6deg) scale(1.05); }
        60% { transform: rotate(4deg) scale(1.05); }
        100% { transform: rotate(0deg) scale(1); }
      }
      #papadomo-guide-panel .pg-label {
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #f5c518;
        margin-bottom: 6px;
        font-weight: 700;
      }
      #papadomo-guide-panel .pg-caught-text {
        font-size: 13.5px;
        font-style: italic;
        line-height: 1.5;
        color: #b9a9e8;
      }
      #papadomo-guide-panel .pg-greeting {
        font-size: 14.5px;
        font-weight: 700;
        color: #f5c518;
        margin-bottom: 6px;
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
        padding-left: 0;
        list-style: none;
        font-size: 13px;
        line-height: 1.6;
      }
      #papadomo-guide-panel li {
        margin-bottom: 4px;
      }
      #papadomo-guide-panel li.pg-plain {
        padding-left: 14px;
        position: relative;
        color: #eee4ff;
      }
      #papadomo-guide-panel li.pg-plain::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #b9a9e8;
      }
      #papadomo-guide-panel button.pg-choice {
        display: block;
        width: 100%;
        text-align: left;
        background: rgba(245, 197, 24, 0.08);
        border: 1px solid rgba(245, 197, 24, 0.35);
        color: #f5c518;
        border-radius: 8px;
        padding: 7px 10px;
        margin-bottom: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
      }
      #papadomo-guide-panel button.pg-choice:hover {
        background: rgba(245, 197, 24, 0.18);
        border-color: #f5c518;
      }
      #papadomo-guide-panel button.pg-choice::after {
        content: " →";
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

  function renderCaughtStage(panel, caughtMedia) {
    panel.classList.add("caught");
    // caughtMedia can be a plain image path (string) or an object
    // { video: "path/to/clip.mp4" } for a short looping clip instead.
    // Either way it renders inside the exact same real timing/animation,
    // so both styles can be A/B tested in the actual live widget.
    const mediaHtml =
      caughtMedia && caughtMedia.video
        ? `<video src="${caughtMedia.video}" autoplay muted loop playsinline></video>`
        : `<img src="${typeof caughtMedia === "string" ? caughtMedia : IMAGE_URL}" alt="PapaDomo" />`;

    panel.innerHTML = `
      <button id="papadomo-guide-close" aria-label="Close">&times;</button>
      ${mediaHtml}
      <div class="pg-caught-text">${pickRandom(CAUGHT_LINES)}</div>
    `;
  }

  function renderMainStage(panel, content) {
    panel.classList.remove("caught");
    const stepsHtml = content.nextSteps
      .map((step) => {
        if (step.href) {
          return `<li><button class="pg-choice" data-href="${step.href}">${step.label}</button></li>`;
        }
        return `<li class="pg-plain">${step.label}</li>`;
      })
      .join("");

    panel.innerHTML = `
      <button id="papadomo-guide-close" aria-label="Close">&times;</button>
      <img src="${IMAGE_URL}" alt="PapaDomo" />
      <div class="pg-greeting">${pickRandom(GREETING_LINES)}</div>
      <div class="pg-label">TL;DR</div>
      <div class="pg-tldr">${content.tldr}</div>
      <div class="pg-next-label">Where next?</div>
      <ul>${stepsHtml}</ul>
    `;

    panel.querySelectorAll(".pg-choice").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const href = btn.getAttribute("data-href");
        if (typeof window.portalNavigate === "function") {
          window.portalNavigate(href);
        } else {
          window.location.href = href;
        }
      });
    });

    panel.querySelector("#papadomo-guide-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closePanel();
    });
  }

  let panelEl = null;
  let isOpen = false;
  let caughtTimer = null;

  function closePanel() {
    isOpen = false;
    if (panelEl) panelEl.classList.remove("open");
    if (caughtTimer) {
      clearTimeout(caughtTimer);
      caughtTimer = null;
    }
  }

  function openPanel(content) {
    isOpen = true;
    panelEl.classList.add("open");
    renderCaughtStage(panelEl, content.caughtMedia);
    // Re-attach the close button for the caught stage specifically,
    // since innerHTML was just replaced.
    panelEl.querySelector("#papadomo-guide-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closePanel();
    });
    caughtTimer = setTimeout(() => {
      if (isOpen) renderMainStage(panelEl, content);
    }, 1100);
  }

  function buildWidget() {
    const content = getContentForCurrentPage();

    const trigger = document.createElement("div");
    trigger.id = "papadomo-guide-trigger";
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-label", "Open page guide");
    trigger.innerHTML = `<img src="${STAR_ICON_URL}" alt="" />`;

    const panel = document.createElement("div");
    panel.id = "papadomo-guide-panel";
    panelEl = panel;

    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isOpen) {
        closePanel();
      } else {
        openPanel(content);
      }
    });

    document.addEventListener("click", (e) => {
      if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) {
        closePanel();
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
