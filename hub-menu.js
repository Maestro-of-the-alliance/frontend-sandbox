// @ts-nocheck
/*!
 * HUB MENU — THE ALLIANCE
 * The one thing behind the three lines on every page: a real front door
 * to the site's four ways in (Search, Tours, Dimensions, THE SYSTEM),
 * plus the full A-Z index and MARKET, instead of just the flat index.
 *
 * Self-contained. Themes itself off the CHAMELEON ENGINE variables
 * (--nw-accent etc. from nav-wheel.js) so it matches whatever page it's
 * opened from. Intercepts whatever burger button already exists on the
 * page (landing's #landingBurger or an entry page's nav-wheel burger)
 * and inserts this as the first screen; "FULL INDEX" hands off to
 * whatever the page's native full-list mechanism already is.
 *
 * Drop in AFTER nav-wheel.js (and after toc.js on landing):
 *   <script src="/hub-menu.js"></script>
 */

(function () {
  "use strict";

  if (window.location.pathname.startsWith("/preamble")) return;

  const CODE_CHARS =
    "01{}[]<>/\\|=+-*&^%$#@!?;:.,_~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randCode = (len) =>
    Array.from(
      { length: len },
      () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
    ).join("");

  const onEntryPage = window.location.pathname.includes("/entries/");

  // ── NODES ────────────────────────────────────────────────────────────────
  // Each node's "action" is resolved lazily (at click time) so it can
  // reach for whatever native function the host page defines, without
  // hub-menu.js needing to know which page it's on ahead of time.

  const NODES = [
    {
      code: "01",
      label: "SEARCH",
      desc: "Query the archive directly.",
      action: () => {
        const fab = document.getElementById("nw-search-fab");
        if (fab) {
          fab.click();
          return;
        }
        const tocSearch = document.getElementById("tocSearch");
        if (tocSearch && typeof window.openTOCInteractive === "function") {
          window.openTOCInteractive();
          setTimeout(() => tocSearch.focus(), 500);
          return;
        }
        window.location.href = "/landing?toc=open";
      },
    },
    {
      code: "02",
      label: "TAKE A TOUR",
      desc: "Twelve guided paths through the canon.",
      action: () => {
        window.location.href = "/tours/";
      },
    },
    {
      code: "03",
      label: "BROWSE BY DIMENSION",
      desc: "DOCTRINE, BEINGS, PLACE, and five more.",
      action: () => {
        // The dimension/volume wheel picker (nav-wheel.js) -- matches
        // this node's own label. Previously this pointed at /s3.html
        // (the flat index) while FULL INDEX pointed here instead --
        // the two nodes had their destinations crossed. Swapped so
        // each node does what its label says.
        if (typeof window.hubOpenNativeNav === "function") {
          window.hubOpenNativeNav();
        } else {
          window.location.href = "/s3.html";
        }
      },
    },
    {
      code: "04",
      label: "ENTER THE SYSTEM",
      desc: "Navigate the NCE as a live solar map.",
      action: () => {
        window.location.href = "/the-system/";
      },
    },
    {
      code: "05",
      label: "FULL INDEX",
      desc: "All 73 entries, A to Z.",
      action: () => {
        // Always the real, stable flat index -- landing gets its own
        // nicer in-page overlay (openTOCInteractive, with correct
        // back-button handling); everywhere else goes straight to
        // /s3.html, a real page navigation with natural browser-back
        // behavior. This used to fall back to hubOpenNativeNav (the
        // dimension wheel picker) on entry pages -- a completely
        // different UI with no history handling of its own, which
        // trapped users with no way out except browser-back skipping
        // past the entry entirely to /landing. Never hand off to the
        // wheel picker from here again.
        if (typeof window.openTOCInteractive === "function") {
          window.openTOCInteractive();
        } else {
          window.location.href = "/s3.html";
        }
      },
    },
    {
      code: "06",
      label: "MARKET",
      desc: "Movement Artifacts, Relics, Keepsakes, Emblems, Tokens.",
      action: () => {
        window.location.href = "/entries/market";
      },
    },
  ];

  // ── STYLE ────────────────────────────────────────────────────────────────

  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

    #hub-overlay {
      position: fixed; inset: 0; z-index: 999999;
      background: color-mix(in srgb, var(--nw-bg, #050508) 88%, transparent);
      backdrop-filter: blur(6px) saturate(0.9);
      -webkit-backdrop-filter: blur(6px) saturate(0.9);
      display: none; opacity: 0;
      transition: opacity 0.25s ease;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    #hub-overlay.open { display: block; }
    #hub-overlay.visible { opacity: 1; }

    #hub-overlay::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
      background: repeating-linear-gradient(
        to bottom, transparent 0, transparent 2px,
        color-mix(in srgb, var(--nw-accent, #b89628) 3%, transparent) 3px,
        color-mix(in srgb, var(--nw-accent, #b89628) 3%, transparent) 4px
      );
      opacity: 0.5;
    }

    #hub-panel {
      position: relative; z-index: 2;
      max-width: 640px; margin: 0 auto;
      padding: max(72px, env(safe-area-inset-top) + 56px) 24px 64px;
      font-family: 'Share Tech Mono', monospace;
    }

    #hub-close {
      position: fixed; top: max(18px, env(safe-area-inset-top)); right: 20px; z-index: 3;
      width: 40px; height: 40px; border-radius: 50%;
      background: transparent; border: 1px solid var(--nw-accent-dim, rgba(184,150,40,0.5));
      color: var(--nw-accent, #b89628); font-family: 'Share Tech Mono', monospace;
      font-size: 20px; line-height: 1; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: box-shadow 0.2s, transform 0.15s;
    }
    #hub-close:hover { box-shadow: 0 0 16px var(--nw-accent-dim, rgba(184,150,40,0.5)); transform: rotate(90deg); }

    .hub-eyebrow {
      font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
      color: var(--nw-accent-dim, rgba(184,150,40,0.6)); margin-bottom: 6px;
      opacity: 0; animation: hub-fade-in 0.4s ease 0.1s forwards;
    }
    .hub-title {
      font-size: clamp(22px, 6vw, 32px); letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--nw-text, #fff); margin: 0 0 4px; display: flex; align-items: baseline; gap: 2px;
      opacity: 0; animation: hub-fade-in 0.4s ease 0.18s forwards;
    }
    .hub-cursor {
      display: inline-block; width: 0.5em; height: 0.85em;
      background: var(--nw-accent, #b89628);
      animation: hub-blink 1s steps(1) infinite;
      margin-left: 2px; transform: translateY(0.08em);
    }
    .hub-sub {
      font-size: 11px; letter-spacing: 0.15em; color: var(--nw-text-dim, rgba(255,255,255,0.4));
      margin-bottom: 36px; opacity: 0; animation: hub-fade-in 0.4s ease 0.26s forwards;
    }

    .hub-node {
      position: relative; display: flex; align-items: center; gap: 18px;
      width: 100%; box-sizing: border-box; text-align: left;
      padding: 18px 16px; margin-bottom: 2px; cursor: pointer;
      border-top: 1px solid var(--nw-accent-faint, rgba(184,150,40,0.15));
      border-left: none; border-right: none; border-bottom: none;
      background: transparent; transition: background 0.2s;
      opacity: 0; transform: translateX(-8px);
      animation: hub-node-in 0.35s ease forwards;
      overflow: hidden;
      font-family: 'Share Tech Mono', monospace;
    }
    .hub-node:last-of-type { border-bottom: 1px solid var(--nw-accent-faint, rgba(184,150,40,0.15)); }
    .hub-node:hover, .hub-node:focus-visible { background: color-mix(in srgb, var(--nw-accent, #b89628) 8%, transparent); outline: none; }

    .hub-node::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
      background: var(--nw-accent, #b89628); transform: scaleY(0); transform-origin: top;
      transition: transform 0.25s ease;
    }
    .hub-node:hover::before, .hub-node:focus-visible::before { transform: scaleY(1); }

    .hub-node-code {
      font-size: 11px; color: var(--nw-accent-dim, rgba(184,150,40,0.6));
      letter-spacing: 0.1em; flex-shrink: 0; width: 26px;
    }
    .hub-node-body { flex: 1; min-width: 0; }
    .hub-node-label {
      font-size: 15px; letter-spacing: 0.12em; color: var(--nw-text, #fff);
      text-transform: uppercase; margin-bottom: 3px;
    }
    .hub-node-desc {
      font-size: 11.5px; letter-spacing: 0.02em; color: var(--nw-accent-dim, rgba(184,150,40,0.7));
      max-height: 0; opacity: 0; overflow: hidden;
      transition: max-height 0.25s ease, opacity 0.2s ease;
    }
    .hub-node:hover .hub-node-desc, .hub-node:focus-visible .hub-node-desc { max-height: 20px; opacity: 1; }

    .hub-node-arrow {
      font-size: 16px; color: var(--nw-accent-dim, rgba(184,150,40,0.5));
      transform: translateX(-4px); opacity: 0; transition: transform 0.2s, opacity 0.2s;
      flex-shrink: 0;
    }
    .hub-node:hover .hub-node-arrow, .hub-node:focus-visible .hub-node-arrow { transform: translateX(0); opacity: 1; }

    @keyframes hub-fade-in { to { opacity: 1; } }
    @keyframes hub-blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes hub-node-in { to { opacity: 1; transform: translateX(0); } }

    @media (prefers-reduced-motion: reduce) {
      .hub-eyebrow, .hub-title, .hub-sub, .hub-node { animation: none !important; opacity: 1 !important; transform: none !important; }
      .hub-cursor { animation: none !important; }
    }
  `;
  document.head.appendChild(style);

  // ── MARKUP ───────────────────────────────────────────────────────────────

  const overlay = document.createElement("div");
  overlay.id = "hub-overlay";
  overlay.innerHTML = `
    <button id="hub-close" aria-label="Close menu">&times;</button>
    <div id="hub-panel">
      <div class="hub-eyebrow">// ACCESS NODE //</div>
      <h2 class="hub-title">SELECT NODE<span class="hub-cursor"></span></h2>
      <div class="hub-sub">N.C.E.ncyclopedia · SIX WAYS IN</div>
      <div id="hub-nodes"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const nodesContainer = overlay.querySelector("#hub-nodes");
  NODES.forEach((node, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "hub-node";
    el.style.animationDelay = `${0.32 + i * 0.06}s`;
    el.innerHTML = `
      <span class="hub-node-code">${node.code}</span>
      <span class="hub-node-body">
        <span class="hub-node-label" data-real="${node.label}">${node.label}</span>
        <span class="hub-node-desc">${node.desc}</span>
      </span>
      <span class="hub-node-arrow">&rarr;</span>
    `;
    const labelEl = el.querySelector(".hub-node-label");

    // Decode-scramble reveal on hover/focus, matching the site's existing
    // encryption-bleed / redaction glitch vocabulary (randanime_maestro.js)
    // rather than a generic hover fade.
    let scrambleTimer = null;
    function scrambleIn() {
      const real = labelEl.dataset.real;
      let frame = 0;
      const totalFrames = 8;
      clearInterval(scrambleTimer);
      scrambleTimer = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          labelEl.textContent = real;
          clearInterval(scrambleTimer);
          return;
        }
        const revealCount = Math.floor((frame / totalFrames) * real.length);
        labelEl.textContent =
          real.slice(0, revealCount) +
          randCode(Math.max(0, real.length - revealCount));
      }, 28);
    }
    function settleLabel() {
      clearInterval(scrambleTimer);
      labelEl.textContent = labelEl.dataset.real;
    }
    el.addEventListener("mouseenter", scrambleIn);
    el.addEventListener("focus", scrambleIn);
    el.addEventListener("mouseleave", settleLabel);
    el.addEventListener("blur", settleLabel);

    el.addEventListener("click", () => {
      closeHub();
      setTimeout(() => node.action(), 180);
    });
    nodesContainer.appendChild(el);
  });

  // ── OPEN / CLOSE ─────────────────────────────────────────────────────────

  let hubPushedState = false;

  function openHub() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => overlay.classList.add("visible"));
    if (!hubPushedState) {
      history.pushState({ hubOpen: true }, "", window.location.pathname + "?hub=open");
      hubPushedState = true;
    }
  }

  function closeHub() {
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
    setTimeout(() => overlay.classList.remove("open"), 250);
    if (hubPushedState) {
      hubPushedState = false;
      history.back();
    }
  }

  overlay.querySelector("#hub-close").addEventListener("click", closeHub);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeHub();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeHub();
  });
  window.addEventListener("popstate", (e) => {
    if (hubPushedState && (!e.state || !e.state.hubOpen)) {
      hubPushedState = false;
      overlay.classList.remove("visible", "open");
      document.body.style.overflow = "";
    }
  });

  window.HubMenu = { open: openHub, close: closeHub };

  // ── ATTACH TO WHATEVER BURGER ALREADY EXISTS ────────────────────────────
  // Runs after nav-wheel.js / toc.js, so the page's own burger button is
  // already in the DOM with whatever id/class it uses. Intercept its
  // click at the capture phase so the hub opens instead of (in front of)
  // whatever the page would otherwise have done directly.

  // Note: landing's own hamburger (#landingBurger) calls HubMenu.open()
  // directly via inline onclick in landing.html -- it's deliberately
  // excluded here to avoid double-attaching and double-opening.
  function findBurger() {
    return (
      document.getElementById("nw-burger-fallback") ||
      document.querySelector(".nw-burger-btn:not(#landingBurger)") ||
      document.querySelector(".nav-wheel-trigger")
    );
  }

  function attachToBurger() {
    const burger = findBurger();
    if (!burger || burger.dataset.hubAttached) return;
    burger.dataset.hubAttached = "1";
    burger.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        openHub();
      },
      true,
    );
  }

  // The fallback burger nav-wheel.js creates is added dynamically, so
  // retry briefly rather than assuming it exists at parse time.
  attachToBurger();
  let attempts = 0;
  const retry = setInterval(() => {
    attempts++;
    attachToBurger();
    if (findBurger()?.dataset.hubAttached || attempts > 20) clearInterval(retry);
  }, 100);
})();
