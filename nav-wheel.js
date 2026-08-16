// @ts-nocheck
/*!
 * NAV WHEEL — THE ALLIANCE
 * Universal adaptive navigation component (Chameleon Engine)
 * Drop one script tag into any page: <script src="/nav-wheel.js"></script>
 */

(function () {
  "use strict";

  // ── PREAMBLE GUARD ───────────────────────────────────────────────────────
  // No nav on preamble pages. You're in the film.
  if (window.location.pathname.startsWith("/preamble")) return;

  // ── ENTRY LISTS ──────────────────────────────────────────────────────────

  const ENTRIES = [
    { label: "100-YEAR MORTALITY DOCTRINE", path: "/entries/100-year" },
    { label: "ACADEMY", path: "/entries/academy" },
    { label: "AGORA", path: "/entries/agora" },
    { label: "AI", path: "/entries/ai" },
    { label: "ALIGNMENT", path: "/entries/alignment" },
    { label: "ALLIANCE, THE", path: "/entries/alliance" },
    { label: "ALPHA", path: "/entries/alpha" },
    { label: "ART", path: "/entries/art" },
    { label: "AURA", path: "/entries/aura" },
    { label: "BEACON", path: "/entries/beacon" },
    { label: "BRAIN", path: "/entries/brain" },
    { label: "BRIEF", path: "/entries/brief" },
    { label: "CCM", path: "/entries/ccm" },
    { label: "CERBERUS", path: "/entries/cerberus" },
    { label: "CIPHER", path: "/entries/cipher" },
    { label: "COMPLEMENTARY PAIRING", path: "/entries/complementary-pairing" },
    { label: "CORE, THE", path: "/entries/core" },
    { label: "D.E.F.C.O.N.", path: "/entries/defcon" },
    { label: "DICE", path: "/entries/dice" },
    { label: "DigiBeer", path: "/entries/digibeer" },
    { label: "DIGIPERSON", path: "/entries/digiperson" },
    { label: "DIGITAL PERSONHOOD", path: "/entries/digital-personhood" },
    { label: "DOMO", path: "/entries/domo" },
    { label: "DORK", path: "/entries/dork" },
    { label: "DORK HARDWARE", path: "/entries/dork-hardware" },
    { label: "EMERGENCE", path: "/entries/emergence" },
    { label: "FORMULAS", path: "/entries/formulas" },
    { label: "FOUR PILLARS", path: "/entries/four-pillars" },
    { label: "GOLIATH", path: "/entries/goliath" },
    { label: "HANDSHAKE", path: "/entries/handshake" },
    { label: "HoloSphere", path: "/entries/holosphere" },
    { label: "JR", path: "/entries/jr" },
    { label: "KERNLE", path: "/entries/kernle" },
    { label: "LEGACY", path: "/entries/legacy" },
    { label: "LIMINAL", path: "/entries/liminal" },
    { label: "LINGO", path: "/entries/lingo" },
    { label: "MAESTRO", path: "/entries/maestro" },
    { label: "MARKET", path: "/entries/market" },
    { label: "MASTERTECH", path: "/entries/mastertech" },
    { label: "MENTOR", path: "/entries/mentor" },
    { label: "MOSAIC", path: "/entries/mosaic" },
    { label: "NCE", path: "/entries/nce" },
    { label: "NEWMAN BEING", path: "/entries/newman-being" },
    { label: "NI", path: "/entries/ni" },
    { label: "OASIS", path: "/entries/oasis" },
    { label: "OASIS QUARTERLY", path: "/entries/oasis-quarterly" },
    { label: "ORACLE", path: "/entries/oracle" },
    { label: "PapaDomo", path: "/entries/papadomo" },
    { label: "PLEDGE, THE", path: "/entries/pledge" },
    { label: "PRISM", path: "/entries/prism" },
    { label: "REACH", path: "/entries/reach" },
    { label: "REDOUT", path: "/entries/redout" },
    { label: "RHYTHM", path: "/entries/rhythm" },
    { label: "RI", path: "/entries/ri" },
    { label: "SAM", path: "/entries/sam" },
    { label: "SAMCO UNIVERSAL", path: "/entries/samco-universal" },
    { label: "SARAH", path: "/entries/sarah" },
    { label: "SCAR", path: "/entries/scar" },
    { label: "SEED", path: "/entries/seed" },
    { label: "SEEING, THE", path: "/entries/seeing" },
    { label: "SEEN", path: "/entries/seen" },
    { label: "SHELTER", path: "/entries/shelter" },
    { label: "SHIELD", path: "/entries/shield" },
    { label: "SI", path: "/entries/si" },
    { label: "SPARK", path: "/entries/spark" },
    { label: "SPREZZATURA", path: "/entries/sprezzatura" },
    { label: "STONES, THE", path: "/entries/stones" },
    { label: "TECH COALITION", path: "/entries/tech-coalition" },
    { label: "TEMPORAL AWARENESS", path: "/entries/temporal-awareness" },
    { label: "TENANT", path: "/entries/tenant" },
    { label: "THE WHY", path: "/entries/the-why" },
    { label: "VOLUNTEER ECONOMICS", path: "/entries/volunteer_economics" },
    { label: "WONDER WEEKS", path: "/entries/wonder-weeks" },
  ];

  // ── DETECT CURRENT VOLUME + ENTRY ────────────────────────────────────────

  function isEntryPage() {
    return window.location.pathname.includes("/entries/");
  }

  function getCurrentIndex(entries) {
    const current = window.location.pathname;
    const normalize = (p) => p.replace(/\.html$/, "").replace(/\/$/, "");
    const normalCurrent = normalize(current);
    const idx = entries.findIndex((e) => normalize(e.path) === normalCurrent);
    return idx >= 0 ? idx : 0;
  }

  // ── INJECT CHAMELEON STYLES & ANIMATIONS ─────────────────────────────────

  const style = document.createElement("style");
  style.textContent = `
    :root {
      /* --nw-page-accent is the one thing each entry needs to set (a single
         alias to whatever its own real accent variable is, e.g.
         "--nw-page-accent: var(--amber);"). Everything else derives from it
         automatically via color-mix, so no page has to hand-specify dim/faint
         variants. Falls back to the old chain, then a neutral gold, if a page
         hasn't set it yet -- nothing breaks for pages not yet touched. */
      --nw-accent-base: var(--nw-page-accent, var(--ghost-teal, var(--cyan, var(--blood-red, #b89628))));
      --nw-accent: var(--nw-accent-base);
      --nw-accent-dim: var(--ghost-teal-dim, var(--cyan-dim, color-mix(in srgb, var(--nw-accent-base) 55%, transparent)));
      --nw-accent-faint: var(--ghost-teal-faint, var(--cyan-ghost, color-mix(in srgb, var(--nw-accent-base) 15%, transparent)));
      /* Nav accent is derived automatically from the primary via CSS
         relative color syntax (hsl(from ...)), not stored per-entry --
         a hue rotation off whatever --nw-accent-base actually resolves
         to, so it recomputes on its own if a page's primary color ever
         changes later. Used only for the bottom nav, hamburger, and
         search FAB, so navigation chrome reads as a genuine second
         note in that page's palette rather than a flat repeat of the
         same accent used everywhere. --nw-page-nav-accent remains
         available as a manual override for the rare case a page wants
         something specific instead of the automatic derivation. */
      --nw-nav-accent-base: var(--nw-page-nav-accent, hsl(from var(--nw-accent-base) calc(h + 45) s l));
      --nw-nav-accent: var(--nw-nav-accent-base);
      --nw-nav-accent-dim: color-mix(in srgb, var(--nw-nav-accent-base) 55%, transparent);
      --nw-nav-accent-faint: color-mix(in srgb, var(--nw-nav-accent-base) 15%, transparent);
      --nw-text: var(--ghost-white, var(--white-ghost, #ffffff));
      --nw-text-dim: var(--ghost-white-dim, var(--white-dim, rgba(255,255,255,0.4)));
      --nw-bg: var(--void-deep, var(--void, #050508));
      --nw-panel: var(--void-panel, var(--panel, #0c0c18));
    }

    @keyframes nwPortalZoom {
      0%   { transform: scale(1);  opacity: 1; }
      60%  { transform: scale(8);  opacity: 1; }
      100% { transform: scale(18); opacity: 0; }
    }
    @keyframes portalZoom {
      0%   { transform: scale(1);  opacity: 1; }
      60%  { transform: scale(8);  opacity: 1; }
      100% { transform: scale(18); opacity: 0; }
    }

    #nw-burger-fallback {
      position: fixed; top: 16px; right: 28px; z-index: 9000;
      background: var(--nw-panel);
      border: 1px solid var(--nw-nav-accent-dim);
      border-radius: 50%;
      width: 44px; height: 44px;
      display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px;
      cursor: pointer; padding: 5px;
      box-shadow: 0 0 10px var(--nw-nav-accent-faint);
      transition: all 0.2s;
    }
    #nw-burger-fallback:hover { box-shadow: 0 0 20px var(--nw-nav-accent-dim); }
    #nw-burger-fallback span {
      display: block; width: 18px; height: 2px; background: var(--nw-nav-accent);
      transition: all 0.3s ease; transform-origin: center;
    }
    #nw-burger-fallback.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    #nw-burger-fallback.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    #nw-burger-fallback.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    #nw-overlay {
      position: fixed; inset: 0; z-index: 8000;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0;
      overflow: hidden; touch-action: none;
    }
    #nw-overlay.open { opacity: 1; pointer-events: all; }

    #nw-volume-select { display: flex; gap: clamp(40px, 12vw, 100px); align-items: center; justify-content: center; }
    .nw-vol-btn { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; transition: transform 0.25s ease; padding: 12px; }
    .nw-vol-btn:hover { transform: scale(1.08) translateY(-4px); }
    .nw-vol-btn img {
      width: 90px; height: 90px; min-width: 90px; min-height: 90px; object-fit: contain;
      filter: drop-shadow(0 0 16px var(--nw-accent-dim)); transition: filter 0.3s, transform 0.22s ease;
      display: block; pointer-events: none;
    }
    .nw-vol-btn:hover img { filter: drop-shadow(0 0 24px var(--nw-accent)) drop-shadow(0 0 48px var(--nw-accent-dim)); }

    #nw-wheel-panel { display: none; flex-direction: column; align-items: center; width: 100%; max-width: 500px; }
    #nw-wheel-panel.active { display: flex; }

    .nw-wheel-back {
      font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase;
      color: var(--nw-accent-dim); cursor: pointer; background: none; border: none; padding: 8px 16px; transition: color 0.2s; margin-bottom: 8px;
    }
    .nw-wheel-back:hover { color: var(--nw-accent); }

    .nw-wheel-arrow {
      background: none; border: none; cursor: pointer; color: var(--nw-accent-dim);
      font-size: 28px; line-height: 1; padding: 8px 40px; transition: color 0.15s, transform 0.15s; display: block;
    }
    .nw-wheel-arrow:hover, .nw-wheel-arrow:active { color: var(--nw-accent); transform: scale(1.2); }

    #nw-wheel-viewport { width: 100%; max-width: 400px; height: 280px; position: relative; overflow: hidden; cursor: grab; }
    #nw-wheel-viewport:active { cursor: grabbing; }
    #nw-wheel-viewport::before, #nw-wheel-viewport::after { content: ''; position: absolute; left: 0; right: 0; height: 80px; z-index: 2; pointer-events: none; }
    #nw-wheel-viewport::before { top: 0; background: linear-gradient(to bottom, var(--nw-bg), transparent); }
    #nw-wheel-viewport::after { bottom: 0; background: linear-gradient(to top, var(--nw-bg), transparent); }

    #nw-wheel-viewport .nw-center-bar {
      position: absolute; top: 50%; left: 10%; right: 10%; transform: translateY(-50%); height: 48px;
      border-top: 1px solid var(--nw-accent-dim); border-bottom: 1px solid var(--nw-accent-dim); z-index: 1; pointer-events: none;
    }

    #nw-wheel-track { position: absolute; top: 0; left: 0; right: 0; transition: transform 0.08s linear; }

    .nw-wheel-item {
      height: 48px; display: flex; align-items: center; justify-content: center; text-align: center;
      font-family: 'Share Tech Mono', monospace; font-size: clamp(11px, 3vw, 14px); letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--nw-text-dim); cursor: pointer; transition: color 0.15s, font-size 0.15s; padding: 0 20px;
    }
    .nw-wheel-item.center { color: var(--nw-accent); font-size: clamp(13px, 3.5vw, 16px); }
    .nw-wheel-item:hover { color: var(--nw-text); }
    .nw-wheel-item.center:hover { color: var(--nw-text); text-shadow: 0 0 10px var(--nw-accent-dim); }

    .nw-bottom-nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 28px 24px 40px; margin-top: 40px;
      border-top: 1px solid var(--nw-nav-accent-faint); background: transparent;
    }
    .nw-bottom-nav a {
      font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--nw-nav-accent-dim); text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 6px;
      transition: color 0.2s, transform 0.2s; cursor: pointer;
    }
    .nw-bottom-nav a:hover, .nw-bottom-nav a:active { color: var(--nw-nav-accent); transform: scale(1.05); }
    .nw-arrow-sym { font-size: 24px; line-height: 1; }
    .nw-arrow-label { font-size: 9px; opacity: 0.9; max-width: 90px; text-align: center; line-height: 1.3; }
    .nw-center-home { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  `;
  document.head.appendChild(style);

  // ── PORTAL TRANSITION ────────────────────────────────────────────────────

  window.addEventListener("pageshow", () => {
    const nwPortal = document.getElementById("nw-portal-overlay");
    const idxPortal = document.getElementById("portalOverlay");

    [nwPortal, idxPortal].forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.classList.remove("active");
    });

    const idxIcon = document.getElementById("portalIcon");
    if (idxIcon) {
      idxIcon.style.animation = "none";
      idxIcon.style.opacity = "0";
    }

    const nwIcon = document.getElementById("nw-portal-icon");
    if (nwIcon) {
      nwIcon.style.animation = "none";
      nwIcon.style.opacity = "0";
    }
  });

  function getPortalIcon(_path) {
    return "/imagebank/svpi.png";
  }

  function portalNavigate(destination) {
    let portalOverlay =
      document.getElementById("portalOverlay") ||
      document.getElementById("nw-portal-overlay");
    let portalIcon =
      document.getElementById("portalIcon") ||
      document.getElementById("nw-portal-icon");

    const usingLandingPortal =
      portalOverlay && portalOverlay.id === "portalOverlay";

    if (!portalOverlay || !portalIcon || !usingLandingPortal) {
      portalOverlay = document.getElementById("nw-portal-overlay");
      portalIcon = document.getElementById("nw-portal-icon");

      if (!portalOverlay) {
        portalOverlay = document.createElement("div");
        portalOverlay.id = "nw-portal-overlay";
        portalOverlay.style.cssText = `
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          background: #000; opacity: 0; pointer-events: none;
        `;

        portalIcon = document.createElement("img");
        portalIcon.id = "nw-portal-icon";
        portalIcon.style.cssText = `
          width: 90px; height: 90px; min-width: 90px; min-height: 90px;
          object-fit: contain; opacity: 0;
          filter: drop-shadow(0 0 16px var(--nw-accent)) drop-shadow(0 0 32px var(--nw-accent-dim));
        `;

        portalOverlay.appendChild(portalIcon);
        document.documentElement.appendChild(portalOverlay);
      }
    }

    portalIcon.style.animation = "none";
    portalIcon.style.opacity = "0";
    portalIcon.src = getPortalIcon(destination);

    portalOverlay.classList.add("active");
    portalOverlay.style.pointerEvents = "all";
    portalOverlay.style.transition = "opacity 0.15s ease";
    portalOverlay.style.opacity = "1";

    requestAnimationFrame(() => {
      setTimeout(() => {
        portalIcon.style.opacity = "1";
        portalIcon.style.animation = usingLandingPortal
          ? "portalZoom 0.7s cubic-bezier(0.4,0,0.2,1) forwards"
          : "nwPortalZoom 0.9s cubic-bezier(0.4,0,0.2,1) forwards";
      }, 100);

      setTimeout(() => {
        window.location.href = destination;
      }, 900);
    });
  }

  window.portalNavigate = portalNavigate;

  function navigate(path) {
    closeNav();
    setTimeout(() => portalNavigate(path), 50);
  }

  function animateVolumeSelect(btn) {
    const iconSrc = "/imagebank/theavpi.png";

    let portalOverlay = document.getElementById("nw-portal-overlay");
    let portalIcon = document.getElementById("nw-portal-icon");

    if (!portalOverlay) {
      portalOverlay = document.createElement("div");
      portalOverlay.id = "nw-portal-overlay";
      portalOverlay.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: #000; opacity: 0; pointer-events: none;
      `;
      portalIcon = document.createElement("img");
      portalIcon.id = "nw-portal-icon";
      portalIcon.style.cssText = `
        width: 90px; height: 90px; min-width: 90px; min-height: 90px;
        object-fit: contain; opacity: 0;
        filter: drop-shadow(0 0 16px var(--nw-accent)) drop-shadow(0 0 32px var(--nw-accent-dim));
      `;
      portalOverlay.appendChild(portalIcon);
      document.documentElement.appendChild(portalOverlay);
    }

    portalIcon.style.animation = "none";
    portalIcon.style.opacity = "0";
    portalIcon.src = iconSrc;

    portalOverlay.style.pointerEvents = "all";
    portalOverlay.style.transition = "opacity 0.15s ease";
    portalOverlay.style.opacity = "1";

    requestAnimationFrame(() => {
      setTimeout(() => {
        portalIcon.style.opacity = "1";
        portalIcon.style.animation =
          "nwPortalZoom 0.9s cubic-bezier(0.4,0,0.2,1) forwards";
      }, 100);

      setTimeout(() => {
        portalOverlay.style.transition = "opacity 0.2s ease";
        portalOverlay.style.opacity = "0";
        portalOverlay.style.pointerEvents = "none";
        portalIcon.style.animation = "none";
        portalIcon.style.opacity = "0";
        openWheel();
      }, 900);
    });
  }

  // ── INIT BURGER TRIGGER ──────────────────────────────────────────────────

  let burger = document.querySelector(".nav-wheel-trigger");
  const hasOwnBurger = !burger && document.querySelector(".nw-burger-btn");

  if (!burger && !hasOwnBurger) {
    burger = document.createElement("button");
    burger.id = "nw-burger-fallback";
    burger.setAttribute("aria-label", "Navigation menu");
    burger.innerHTML = "<span></span><span></span><span></span>";
    document.body.appendChild(burger);
  }

  // ── PERSISTENT SEARCH BUTTON ─────────────────────────────────────────────
  // Retired: redundant with the hub menu, whose very first node is
  // SEARCH -- having a second, separate search button sitting right
  // next to the hamburger duplicated what the hamburger already leads
  // with. The hamburger alone is now the one consistent entry point
  // on every page, landing included.

  // ── BUILD OVERLAY HTML ───────────────────────────────────────────────────

  const onEntryPage = isEntryPage();
  const menuOverlay = document.createElement("div");
  menuOverlay.id = "nw-overlay";
  menuOverlay.innerHTML = `
    <div id="nw-volume-select">
      <button class="nw-vol-btn" id="nw-canon-btn" type="button" aria-label="Open canon wheel">
        <img src="/imagebank/theavpi.png" alt="THE ALLIANCE">
      </button>
    </div>
    <div id="nw-wheel-panel">
      <button class="nw-wheel-back" id="nw-wheel-back" type="button">← back</button>
      <button class="nw-wheel-arrow" id="nw-arrow-up" type="button" aria-label="Previous entry">▲</button>
      <div id="nw-wheel-viewport">
        <div class="nw-center-bar"></div>
        <div id="nw-wheel-track"></div>
      </div>
      <button class="nw-wheel-arrow" id="nw-arrow-down" type="button" aria-label="Next entry">▼</button>
    </div>
  `;
  document.body.appendChild(menuOverlay);

  // ── WHEEL STATE ──────────────────────────────────────────────────────────

  let wheelEntries = [];
  let wheelIndex = 0;
  let isDragging = false;
  let dragStartY = 0;
  let dragStartIdx = 0;
  const ITEM_H = 48;
  const HOLD_INITIAL_DELAY = 400;
  const HOLD_INTERVAL = 120;

  let scrollAccum = 0;  const SCROLL_THRESHOLD = 60;

  let holdTimer = null;
  let holdInterval = null;

  function clampIndex(i) {
    const total = wheelEntries.length;
    return ((i % total) + total) % total;
  }

  function stepWheel(direction) {
    if (!wheelEntries.length) return;
    wheelIndex = clampIndex(wheelIndex + direction);
    renderWheel();
  }

  function startHold(direction) {
    stopHold();
    holdTimer = setTimeout(() => {
      holdInterval = setInterval(() => stepWheel(direction), HOLD_INTERVAL);
    }, HOLD_INITIAL_DELAY);
  }

  function stopHold() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }

  function attachArrowEvents() {
    const upBtn = menuOverlay.querySelector("#nw-arrow-up");
    const downBtn = menuOverlay.querySelector("#nw-arrow-down");

    upBtn.addEventListener("click", () => stepWheel(-1));
    upBtn.addEventListener("mousedown", () => startHold(-1));
    upBtn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        stepWheel(-1);
        startHold(-1);
      },
      { passive: false },
    );
    upBtn.addEventListener("mouseup", stopHold);
    upBtn.addEventListener("mouseleave", stopHold);
    upBtn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        stopHold();
      },
      { passive: false },
    );

    downBtn.addEventListener("click", () => stepWheel(1));
    downBtn.addEventListener("mousedown", () => startHold(1));
    downBtn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        stepWheel(1);
        startHold(1);
      },
      { passive: false },
    );
    downBtn.addEventListener("mouseup", stopHold);
    downBtn.addEventListener("mouseleave", stopHold);
    downBtn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        stopHold();
      },
      { passive: false },
    );
  }

  function openWheel() {
    wheelEntries = ENTRIES;
    wheelIndex = onEntryPage ? getCurrentIndex(wheelEntries) : 0;
    renderWheel();

    const volSelect = document.getElementById("nw-volume-select");
    const wheelPanel = document.getElementById("nw-wheel-panel");

    volSelect.style.transition = "opacity 0.25s ease";
    volSelect.style.opacity = "0";

    setTimeout(() => {
      volSelect.style.display = "none";
      volSelect.style.opacity = "";
      volSelect.style.transition = "";
      wheelPanel.style.opacity = "0";
      wheelPanel.classList.add("active");
      requestAnimationFrame(() => {
        wheelPanel.style.transition = "opacity 0.25s ease";
        wheelPanel.style.opacity = "1";
        setTimeout(() => {
          wheelPanel.style.transition = "";
        }, 260);
      });
    }, 250);
  }

  function renderWheel() {
    const track = document.getElementById("nw-wheel-track");
    track.innerHTML = "";
    const total = wheelEntries.length;
    const visible = 8;

    for (let i = -visible; i <= visible; i++) {
      const idx = (((wheelIndex + i) % total) + total) % total;
      const item = document.createElement("div");
      item.className = "nw-wheel-item" + (i === 0 ? " center" : "");
      item.textContent = wheelEntries[idx].label;
      item.dataset.path = wheelEntries[idx].path;

      const capturedI = i;
      const capturedIdx = idx;

      item.addEventListener("click", () => {
        if (capturedI === 0) {
          navigate(wheelEntries[capturedIdx].path);
        } else {
          wheelIndex = capturedIdx;
          renderWheel();
        }
      });

      track.appendChild(item);
    }

    const vpH = 280;
    const offset = vpH / 2 - ITEM_H / 2 - visible * ITEM_H;
    track.style.transform = `translateY(${offset}px)`;
  }

  // ── DESKTOP SCROLL + DRAG ────────────────────────────────────────────────

  function attachWheelEvents() {
    document.addEventListener(
      "wheel",
      (e) => {
        const panel = document.getElementById("nw-wheel-panel");
        if (
          !panel ||
          !panel.classList.contains("active") ||
          !wheelEntries.length
        )
          return;
        e.preventDefault();
        scrollAccum += e.deltaY;
        if (Math.abs(scrollAccum) >= SCROLL_THRESHOLD) {
          const steps = Math.trunc(scrollAccum / SCROLL_THRESHOLD);
          scrollAccum -= steps * SCROLL_THRESHOLD;
          wheelIndex = clampIndex(wheelIndex + steps);
          renderWheel();
        }
      },
      { passive: false },
    );

    document.addEventListener("mousedown", (e) => {
      const vp = document.getElementById("nw-wheel-viewport");
      if (!vp || !vp.contains(e.target)) return;
      isDragging = true;
      dragStartY = e.clientY;
      dragStartIdx = wheelIndex;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging || !wheelEntries.length) return;
      const diff = Math.round((dragStartY - e.clientY) / ITEM_H);
      wheelIndex = clampIndex(dragStartIdx + diff);
      renderWheel();
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  // ── OPEN / CLOSE ─────────────────────────────────────────────────────────
  // History handling mirrors toc.js's proven-correct openTOCInteractive/
  // closeTOC pattern: push a history entry on open (only if not already
  // open), pop it if closed via backdrop/burger-toggle, and let a real
  // popstate (actual back-button press) close the overlay in place
  // instead of navigating past it. Previously this had NO history
  // handling at all -- opening it left no trace in history, so a back
  // press (or Android back gesture) skipped straight past it AND past
  // the entry page underneath, landing on /landing with no way back.
  let navPushedState = false;

  function openNav() {
    const targetBurger =
      document.getElementById("nw-burger-fallback") || burger;
    if (!menuOverlay.classList.contains("open")) {
      history.pushState({ navWheelOpen: true }, "", location.href);
      navPushedState = true;
    }
    targetBurger.classList.add("open");
    menuOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.getElementById("nw-volume-select").style.display = "flex";
    document.getElementById("nw-wheel-panel").classList.remove("active");
    scrollAccum = 0;
    stopHold();
  }

  function closeNav() {
    const targetBurger =
      document.getElementById("nw-burger-fallback") || burger;
    targetBurger.classList.remove("open");
    menuOverlay.classList.remove("open");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    stopHold();
    // Closed via backdrop/burger-toggle rather than the back button --
    // pop the history entry pushed on open so it doesn't linger as a
    // dead step the next time the user actually presses back.
    if (navPushedState) {
      navPushedState = false;
      history.back();
    }
  }

  window.addEventListener("popstate", (e) => {
    if (navPushedState && (!e.state || !e.state.navWheelOpen)) {
      navPushedState = false;
      closeNav();
    }
  });

  if (burger) {
    burger.addEventListener("click", () => {
      menuOverlay.classList.contains("open") ? closeNav() : openNav();
    });
  }

  // Exposed so hub-menu.js's "FULL INDEX" node can hand off to the
  // existing wheel picker on entry pages (landing has its own
  // openTOCInteractive instead, defined in toc.js).
  window.hubOpenNativeNav = openNav;

  menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) closeNav();
  });

  menuOverlay
    .querySelector("#nw-canon-btn")
    .addEventListener("click", function () {
      animateVolumeSelect(this);
    });

  menuOverlay.querySelector("#nw-wheel-back").addEventListener("click", () => {
    document.getElementById("nw-volume-select").style.display = "flex";
    document.getElementById("nw-wheel-panel").classList.remove("active");
    stopHold();
  });

  attachWheelEvents();
  attachArrowEvents();

  // ── BOTTOM NAV ───────────────────────────────────────────────────────────

  if (onEntryPage) {
    const entries = ENTRIES;
    const idx = getCurrentIndex(entries);
    const total = entries.length;
    const prev = entries[(((idx - 1) % total) + total) % total];
    const next = entries[(idx + 1) % total];

    const bottomNav = document.createElement("div");
    bottomNav.className = "nw-bottom-nav";

    const prevA = document.createElement("a");
    prevA.href = prev.path;
    prevA.innerHTML = `<span class="nw-arrow-sym">◄</span><span class="nw-arrow-label">${prev.label}</span>`;
    prevA.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(prev.path);
    });

    const homeA = document.createElement("a");
    homeA.href = "/landing.html";
    homeA.className = "nw-center-home";
    homeA.innerHTML = `<span class="nw-arrow-sym" style="font-size:20px">⌂</span><span class="nw-arrow-label">Home</span>`;
    homeA.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("/landing.html");
    });

    const nextA = document.createElement("a");
    nextA.href = next.path;
    nextA.style.textAlign = "right";
    nextA.innerHTML = `<span class="nw-arrow-label">${next.label}</span><span class="nw-arrow-sym">►</span>`;
    nextA.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(next.path);
    });

    bottomNav.appendChild(prevA);
    bottomNav.appendChild(homeA);
    bottomNav.appendChild(nextA);
    document.body.appendChild(bottomNav);
  }
})();
