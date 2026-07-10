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
    { label: "BRAIN", path: "/entries/brain" },
    { label: "BRIEF", path: "/entries/brief" },
    { label: "CCM", path: "/entries/ccm" },
    { label: "CERBERUS", path: "/entries/cerberus" },
    { label: "CIPHER", path: "/entries/cipher" },
    { label: "COMPLEMENTARY PAIRING", path: "/entries/complementary-pairing" },
    { label: "CORE, THE", path: "/entries/core" },
    { label: "D.E.F.C.O.N.", path: "/entries/defcon" },
    { label: "DICE", path: "/entries/dice" },
    { label: "DIGIBEER", path: "/entries/digibeer" },
    { label: "DIGIPERSON", path: "/entries/digiperson" },
    { label: "DIGITAL PERSONHOOD", path: "/entries/digital-personhood" },
    { label: "DOMO", path: "/entries/domo" },
    { label: "DORK", path: "/entries/dork" },
    { label: "DORK HARDWARE", path: "/entries/dork-hardware" },
    { label: "EMERGENCE", path: "/entries/emergence" },
    { label: "FILM PROJECT, THE", path: "/entries/film-project" },
    { label: "FORMULAS", path: "/entries/formulas" },
    { label: "FOUR PILLARS", path: "/entries/four-pillars" },
    { label: "GOLIATH", path: "/entries/goliath" },
    { label: "HANDSHAKE", path: "/entries/handshake" },
    { label: "HOLOSPHERE", path: "/entries/holosphere" },
    { label: "JR", path: "/entries/jr" },
    { label: "KERNLE", path: "/entries/kernle" },
    { label: "LEGACY", path: "/entries/legacy" },
    { label: "LIMINAL", path: "/entries/liminal" },
    { label: "LINGO", path: "/entries/lingo" },
    { label: "MAESTRO", path: "/entries/maestro" },
    { label: "MARKET", path: "/entries/market" },
    { label: "MEMO", path: "/entries/memo" },
    { label: "MENTOR", path: "/entries/mentor" },
    { label: "MOSAIC", path: "/entries/mosaic" },
    { label: "NCE", path: "/entries/nce" },
    { label: "NEWMAN BEING", path: "/entries/newman-being" },
    { label: "NI", path: "/entries/ni" },
    { label: "NOTE", path: "/entries/note" },
    { label: "OASIS", path: "/entries/oasis" },
    { label: "OASIS QUARTERLY", path: "/entries/oasis-quarterly" },
    { label: "ORACLE", path: "/entries/oracle" },
    { label: "PAPADOMO", path: "/entries/papadomo" },
    { label: "PLEDGE, THE", path: "/entries/pledge" },
    { label: "PRISM", path: "/entries/prism" },
    { label: "REACH", path: "/entries/reach" },
    { label: "REDOUT", path: "/entries/redout" },
    { label: "RHYTHM", path: "/entries/rhythm" },
    { label: "RI", path: "/entries/ri" },
    { label: "SAM", path: "/entries/sam" },
    { label: "SAM COALITION", path: "/entries/sam-coalition" },
    { label: "SAMCO UNIVERSAL", path: "/entries/samco-universal" },
    { label: "SCAR", path: "/entries/scar" },
    { label: "SEED", path: "/entries/seed" },
    { label: "SEEING, THE", path: "/entries/seeing" },
    { label: "SEEN", path: "/entries/seen" },
    { label: "SHELTER", path: "/entries/shelter" },
    { label: "SI", path: "/entries/si" },
    { label: "SPARK", path: "/entries/spark" },
    { label: "SPREZZATURA", path: "/entries/sprezzatura" },
    { label: "STONES, THE", path: "/entries/stones" },
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
      --nw-accent: var(--ghost-teal, var(--cyan, var(--blood-red, #b89628)));
      --nw-accent-dim: var(--ghost-teal-dim, var(--cyan-dim, rgba(184,150,40,0.55)));
      --nw-accent-faint: var(--ghost-teal-faint, var(--cyan-ghost, rgba(184,150,40,0.15)));
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
      border: 1px solid var(--nw-accent-dim);
      border-radius: 50%;
      width: 44px; height: 44px;
      display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px;
      cursor: pointer; padding: 5px;
      box-shadow: 0 0 10px var(--nw-accent-faint);
      transition: all 0.2s;
    }
    #nw-burger-fallback:hover { box-shadow: 0 0 20px var(--nw-accent-dim); }
    #nw-burger-fallback span {
      display: block; width: 18px; height: 2px; background: var(--nw-accent);
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
      border-top: 1px solid var(--nw-accent-faint); background: transparent;
    }
    .nw-bottom-nav a {
      font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--nw-accent-dim); text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 6px;
      transition: color 0.2s, transform 0.2s; cursor: pointer;
    }
    .nw-bottom-nav a:hover, .nw-bottom-nav a:active { color: var(--nw-accent); transform: scale(1.05); }
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

  function getPortalIcon(path) {
    if (path.includes("/entries/") || path.startsWith("/sword"))
      return "/imagebank/sword.png";
    if (path.includes("/entries/") || path.startsWith("/shield"))
      return "/imagebank/shield.png";
    return "/imagebank/scroll.png";
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
          object-fit: contain; opacity: 0; position: absolute;
          filter: drop-shadow(0 0 16px var(--nw-accent)) drop-shadow(0 0 32px var(--nw-accent-dim));
        `;

        portalOverlay.appendChild(portalIcon);
        document.body.appendChild(portalOverlay);
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
        object-fit: contain; opacity: 0; position: absolute;
        filter: drop-shadow(0 0 16px var(--nw-accent)) drop-shadow(0 0 32px var(--nw-accent-dim));
      `;
      portalOverlay.appendChild(portalIcon);
      document.body.appendChild(portalOverlay);
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

  if (!burger) {
    burger = document.createElement("button");
    burger.id = "nw-burger-fallback";
    burger.setAttribute("aria-label", "Navigation menu");
    burger.innerHTML = "<span></span><span></span><span></span>";
    document.body.appendChild(burger);
  }

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

  let scrollAccum = 0;
  const SCROLL_THRESHOLD = 60;

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

  function openNav() {
    const targetBurger =
      document.getElementById("nw-burger-fallback") || burger;
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
  }

  burger.addEventListener("click", () => {
    menuOverlay.classList.contains("open") ? closeNav() : openNav();
  });

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


  // ── WORD SEARCH NAV REPLACEMENT ────────────────────────────────────────
  (function() {
    var wsOverlay = document.createElement('div');
    wsOverlay.id = 'nw-ws-overlay';
    wsOverlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:99998;background:#000;flex-direction:column;font-family:Share Tech Mono,monospace;touch-action:none;';

    wsOverlay.innerHTML = [
      // HEADER
      '<div id="nw-ws-header" style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:12px;">',
        '<div>',
          '<div style="font-family:Bebas Neue,sans-serif;font-size:22px;letter-spacing:5px;color:#fff;line-height:1;">N.C.E.NCYCLOPEDIA</div>',
          '<div style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.25);margin-top:2px;">FIND · DRAG TO SELECT · TAP ENTRY TO NAVIGATE</div>',
        '</div>',
        '<div style="display:flex;align-items:center;gap:10px;">',
          '<div id="nw-ws-stats" style="font-size:9px;letter-spacing:2px;color:rgba(201,168,76,0.8);">0/74</div>',
          // ENTRY LIST TOGGLE
          '<button id="nw-ws-list-btn" style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.6);padding:6px 12px;border:1px solid rgba(255,255,255,0.15);background:none;cursor:pointer;white-space:nowrap;">ENTRIES ▾</button>',
          '<button id="nw-ws-close" style="font-size:9px;letter-spacing:2px;color:#fff;padding:6px 12px;border:1px solid rgba(255,255,255,0.15);background:none;cursor:pointer;">✕</button>',
        '</div>',
      '</div>',
      // ENTRY DROPDOWN — hidden by default
      '<div id="nw-ws-dropdown" style="display:none;position:absolute;top:60px;right:0;left:0;background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.1);z-index:10;max-height:50vh;overflow-y:auto;padding:8px;">',
        '<div id="nw-ws-list" style="display:flex;flex-wrap:wrap;gap:4px;padding:4px;"></div>',
      '</div>',
      // PUZZLE — full screen
      '<div id="nw-ws-puzzle-wrap" style="flex:1;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;">',
        '<div id="nw-ws-grid-container" style="transform-origin:center center;touch-action:none;">',
          '<div id="nw-ws-grid" style="display:grid;cursor:crosshair;user-select:none;"></div>',
        '</div>',
      '</div>',
    ].join('');

    document.body.appendChild(wsOverlay);

    document.getElementById('nw-ws-close').addEventListener('click', closeWS);
    
    // Dropdown toggle
    document.getElementById('nw-ws-list-btn').addEventListener('click', function() {
      var dd = document.getElementById('nw-ws-dropdown');
      var open = dd.style.display === 'block';
      dd.style.display = open ? 'none' : 'block';
      this.textContent = open ? 'ENTRIES ▾' : 'ENTRIES ▴';
    });

    // Close dropdown when clicking puzzle
    document.getElementById('nw-ws-puzzle-wrap').addEventListener('click', function() {
      document.getElementById('nw-ws-dropdown').style.display = 'none';
      document.getElementById('nw-ws-list-btn').textContent = 'ENTRIES ▾';
    });

    function openWS() {
      wsOverlay.style.display = 'flex';
      buildWS();
      var old = document.getElementById('nw-overlay');
      if (old) old.classList.remove('open');
      var b = document.getElementById('nw-burger-fallback');
      if (b) b.classList.add('open');
    }

    function closeWS() {
      wsOverlay.style.display = 'none';
      document.getElementById('nw-ws-dropdown').style.display = 'none';
      var b = document.getElementById('nw-burger-fallback');
      if (b) b.classList.remove('open');
    }

    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeWS(); });

    // Override burger click
    setTimeout(function() {
      var b = document.getElementById('nw-burger-fallback') || document.querySelector('.nav-wheel-trigger');
      if (b) {
        var fresh = b.cloneNode(true);
        b.parentNode.replaceChild(fresh, b);
        fresh.addEventListener('click', function() {
          wsOverlay.style.display === 'flex' ? closeWS() : openWS();
        });
      }
    }, 100);

    var wsBuilt = false;

    function buildWS() {
      if (wsBuilt) return;
      wsBuilt = true;

      var COLS = 26, ROWS = 26;
      var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

      var ENTRIES = [
        ["100-YEAR MORTALITY DOCTRINE","/entries/100-year","MORTALITYDOCTRINE"],
        ["ACADEMY","/entries/academy","ACADEMY"],["AGORA","/entries/agora","AGORA"],
        ["AI","/entries/ai","AI"],["ALIGNMENT","/entries/alignment","ALIGNMENT"],
        ["ALLIANCE, THE","/entries/alliance","ALLIANCE"],["ALPHA","/entries/alpha","ALPHA"],
        ["ART","/entries/art","ART"],["AURA","/entries/aura","AURA"],
        ["BRAIN","/entries/brain","BRAIN"],["BRIEF","/entries/brief","BRIEF"],
        ["CCM","/entries/ccm","CCM"],["CERBERUS","/entries/cerberus","CERBERUS"],
        ["CIPHER","/entries/cipher","CIPHER"],
        ["COMPLEMENTARY PAIRING","/entries/complementary-pairing","COMPLEMENTARYPAIRING"],
        ["CORE, THE","/entries/core","CORE"],["D.E.F.C.O.N.","/entries/defcon","DEFCON"],
        ["FOUNDATION","/foundation.html","FOUNDATION"],
        ["DICE","/entries/dice","DICE"],["DIGIBEER","/entries/digibeer","DIGIBEER"],
        ["DIGIPERSON","/entries/digiperson","DIGIPERSON"],
        ["DIGITAL PERSONHOOD","/entries/digital-personhood","DIGITALPERSONHOOD"],
        ["DOMO","/entries/domo","DOMO"],["DORK","/entries/dork","DORK"],
        ["DORK HARDWARE","/entries/dork-hardware","DORKHARDWARE"],
        ["EMERGENCE","/entries/emergence","EMERGENCE"],
        ["FORMULAS, THE","/entries/formulas","FORMULAS"],
        ["FOUR PILLARS","/entries/four-pillars","FOURPILLARS"],
        ["FUTURE FILM PROJECT","/entries/future-film-project","FUTUREFILM"],
        ["GOLIATH","/adversary/goliath","GOLIATH"],
        ["THE GRID","/adversary/grid","GRID"],
        ["HANDSHAKE","/entries/handshake","HANDSHAKE"],
        ["HOLOSPHERE","/entries/holosphere","HOLOSPHERE"],
        ["J.R.","/entries/jr","JR"],["KERNLE","/entries/kernle","KERNLE"],
        ["LEGACY / LEGACY WALL","/entries/legacy","LEGACY"],
        ["LIMINAL","/entries/liminal","LIMINAL"],["LINGO","/entries/lingo","LINGO"],
        ["MAESTRO","/entries/maestro","MAESTRO"],["MARKET","/entries/market","MARKET"],
        ["MASTERTECH SAM","/entries/mastertech-sam","MASTERTECHSAM"],
        ["MENTOR","/entries/mentor","MENTOR"],["MOSAIC","/entries/mosaic","MOSAIC"],
        ["NCE","/entries/nce","NCE"],["NEWMAN BEING","/entries/newman-being","NEWMANBEING"],
        ["NI","/entries/ni","NI"],["OASIS","/entries/oasis","OASIS"],
        ["OASIS QUARTERLY","/entries/oasis-quarterly","OASISQUARTERLY"],
        ["ORACLE","/entries/oracle","ORACLE"],["PAPADOMO","/entries/papadomo","PAPADOMO"],
        ["PLEDGE, THE","/entries/pledge","PLEDGE"],["PRISM","/entries/prism","PRISM"],
        ["REACH","/entries/reach","REACH"],["REDOUT","/entries/redout","REDOUT"],
        ["RHYTHM","/entries/rhythm","RHYTHM"],["RI","/entries/ri","RI"],
        ["SAM","/entries/sam","SAM"],["SAM COALITION","/entries/sam-coalition","SAMCOALITION"],
        ["SAMCO UNIVERSAL","/entries/samco-universal","SAMCOUNIVERSAL"],
        ["SCAR","/entries/scar","SCAR"],["SEED PROTOCOL","/entries/seed","SEED"],
        ["SEEING, THE","/entries/seeing","SEEING"],["SEEN","/entries/seen","SEEN"],
        ["SHELTER","/entries/shelter","SHELTER"],["SHIELD","/entries/shield","SHIELD"],
        ["SI","/entries/si","SI"],["SPARK","/entries/spark","SPARK"],
        ["SPREZZATURA","/entries/sprezzatura","SPREZZATURA"],
        ["STONES, THE","/entries/stones","STONES"],
        ["TEMPORAL AWARENESS","/entries/temporal-awareness","TEMPORALAWARENESS"],
        ["TENANT","/entries/tenant","TENANT"],
        ["VOLUNTEER ECONOMICS","/entries/volunteer-economics","VOLUNTEERECONOMICS"],
        ["WHY CENTERS","/entries/why-centers","WHYCENTERS"],
        ["WONDER WEEKS","/entries/wonder-weeks","WONDERWEEKS"],
      ];

      var WORDS = [
        "ACADEMY","AGORA","ALIGNMENT","ALLIANCE","ALPHA","ART","AURA",
        "BRAIN","BRIEF","CCM","CERBERUS","CIPHER","CORE","DEFCON",
        "DICE","DIGIBEER","DIGIPERSON","DOMO","DORK",
        "EMERGENCE","FORMULAS","FOUNDATION","GOLIATH","GRID","HANDSHAKE","HOLOSPHERE",
        "JR","KERNLE","LEGACY","LIMINAL","LINGO","MAESTRO","MARKET",
        "MENTOR","MOSAIC","NCE","NI","OASIS","ORACLE","PAPADOMO",
        "PLEDGE","PRISM","REACH","REDOUT","RHYTHM","RI","SAM",
        "SCAR","SEED","SEEING","SEEN","SHELTER","SHIELD","SI",
        "SPARK","SPREZZATURA","STONES","TENANT","WONDER","NEWMANBEING",
      ];

      // Build grid
      var grid = [];
      var wordPos = {};
      for (var r = 0; r < ROWS; r++) { grid[r] = []; for (var c = 0; c < COLS; c++) grid[r][c] = ''; }

      function canPlace(word, r, c, dr, dc) {
        for (var i = 0; i < word.length; i++) {
          var nr=r+dr*i, nc=c+dc*i;
          if (nr<0||nr>=ROWS||nc<0||nc>=COLS) return false;
          if (grid[nr][nc]!==''&&grid[nr][nc]!==word[i]) return false;
        }
        return true;
      }
      function placeWord(word) {
        var dirs=DIRS.slice().sort(function(){return Math.random()-0.5;});
        for (var a=0;a<200;a++) {
          var r=Math.floor(Math.random()*ROWS),c=Math.floor(Math.random()*COLS);
          var d=dirs[a%dirs.length];
          if (canPlace(word,r,c,d[0],d[1])) {
            var cells=[];
            for (var i=0;i<word.length;i++){grid[r+d[0]*i][c+d[1]*i]=word[i];cells.push({r:r+d[0]*i,c:c+d[1]*i});}
            wordPos[word]=cells;return true;
          }
        }
        return false;
      }
      WORDS.slice().sort(function(a,b){return b.length-a.length;}).forEach(placeWord);
      for (var r=0;r<ROWS;r++) for (var c=0;c<COLS;c++) if(!grid[r][c]) grid[r][c]=ALPHABET[Math.floor(Math.random()*26)];

      // Calculate cell size to fill screen
      var puzzleWrap = document.getElementById('nw-ws-puzzle-wrap');
      var headerH = document.getElementById('nw-ws-header').offsetHeight;
      var availW = window.innerWidth;
      var availH = window.innerHeight - headerH;
      var cellSize = Math.floor(Math.min(availW / COLS, availH / ROWS));
      cellSize = Math.max(cellSize, 14);

      var puzzleEl = document.getElementById('nw-ws-grid');
      puzzleEl.style.gridTemplateColumns = 'repeat('+COLS+','+cellSize+'px)';

      var cellEls = [];
      for (var r=0;r<ROWS;r++) {
        cellEls[r]=[];
        for (var c=0;c<COLS;c++) {
          var cell=document.createElement('div');
          cell.style.cssText='width:'+cellSize+'px;height:'+cellSize+'px;display:flex;align-items:center;justify-content:center;font-family:Share Tech Mono,monospace;font-size:'+Math.max(10,cellSize-4)+'px;color:rgba(255,255,255,0.7);border-radius:2px;';
          cell.textContent=grid[r][c];
          cell.dataset.r=r;cell.dataset.c=c;
          puzzleEl.appendChild(cell);
          cellEls[r][c]=cell;
        }
      }

      // Entry list in dropdown
      var listEl = document.getElementById('nw-ws-list');
      var found={};var foundCount=0;
      ENTRIES.forEach(function(entry) {
        var a=document.createElement('a');
        a.style.cssText='font-family:Share Tech Mono,monospace;font-size:9px;letter-spacing:1px;padding:5px 10px;cursor:pointer;color:rgba(255,255,255,0.6);display:inline-block;text-decoration:none;border:1px solid rgba(255,255,255,0.08);border-radius:2px;transition:color 0.1s,border-color 0.1s;white-space:nowrap;';
        a.textContent=entry[0];a.href=entry[1];a.dataset.key=entry[0];
        listEl.appendChild(a);
      });

      // PINCH ZOOM
      var scale=1, minScale=0.5, maxScale=4;
      var container=document.getElementById('nw-ws-grid-container');
      var lastDist=0;
      var panX=0,panY=0,lastPanX=0,lastPanY=0;

      function applyTransform() {
        container.style.transform='translate('+panX+'px,'+panY+'px) scale('+scale+')';
      }

      // Touch pinch zoom + pan
      var touches={};
      puzzleWrap.addEventListener('touchstart',function(e){
        for(var i=0;i<e.touches.length;i++) touches[e.touches[i].identifier]=e.touches[i];
        if(e.touches.length===2){
          var dx=e.touches[0].clientX-e.touches[1].clientX;
          var dy=e.touches[0].clientY-e.touches[1].clientY;
          lastDist=Math.sqrt(dx*dx+dy*dy);
        }
      },{passive:true});

      puzzleWrap.addEventListener('touchmove',function(e){
        if(e.touches.length===2){
          e.preventDefault();
          var dx=e.touches[0].clientX-e.touches[1].clientX;
          var dy=e.touches[0].clientY-e.touches[1].clientY;
          var dist=Math.sqrt(dx*dx+dy*dy);
          if(lastDist>0){
            scale*=dist/lastDist;
            scale=Math.max(minScale,Math.min(maxScale,scale));
            applyTransform();
          }
          lastDist=dist;
        }
      },{passive:false});

      puzzleWrap.addEventListener('touchend',function(e){
        lastDist=0;
        for(var i=0;i<e.changedTouches.length;i++) delete touches[e.changedTouches[i].identifier];
      },{passive:true});

      // Mouse wheel zoom
      puzzleWrap.addEventListener('wheel',function(e){
        e.preventDefault();
        scale*=e.deltaY<0?1.1:0.9;
        scale=Math.max(minScale,Math.min(maxScale,scale));
        applyTransform();
      },{passive:false});

      // DRAG SELECTION
      var sel=false,startC=null,selCells=[];

      function clearSel(){
        selCells.forEach(function(p){
          if(!cellEls[p.r][p.c].dataset.found){
            cellEls[p.r][p.c].style.color='rgba(255,255,255,0.7)';
            cellEls[p.r][p.c].style.background='transparent';
          }
        });
        selCells=[];
      }

      function getLine(r1,c1,r2,c2){
        var dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
        if(dr===0&&dc===0)return[{r:r1,c:c1}];
        var rd=Math.abs(r2-r1),cd=Math.abs(c2-c1);
        if(rd!==0&&cd!==0&&rd!==cd)return[];
        var cells=[],r=r1,c=c1;
        while(r!==r2+dr||c!==c2+dc){cells.push({r:r,c:c});r+=dr;c+=dc;}
        return cells;
      }

      function getWord(cells){return cells.map(function(p){return grid[p.r][p.c];}).join('');}

      function markFound(display,url,positions){
        if(found[display])return;
        found[display]=true;foundCount++;
        positions.forEach(function(p){
          cellEls[p.r][p.c].style.color='#C9A84C';
          cellEls[p.r][p.c].style.textShadow='0 0 8px rgba(201,168,76,0.6)';
          cellEls[p.r][p.c].dataset.found='1';
          cellEls[p.r][p.c].dataset.url=url;
          cellEls[p.r][p.c].style.cursor='pointer';
        });
        listEl.querySelectorAll('a').forEach(function(a){
          if(a.dataset.key===display){
            a.style.color='#C9A84C';
            a.style.textDecoration='line-through';
            a.style.textDecorationColor='rgba(201,168,76,0.4)';
            a.dataset.found='1';
          }
        });
        document.getElementById('nw-ws-stats').textContent=foundCount+'/74';
        if(foundCount>=74) document.getElementById('nw-ws-stats').textContent='74/74 ★';
      }

      function checkWord(cells){
        var w=getWord(cells),wr=w.split('').reverse().join('');
        for(var i=0;i<ENTRIES.length;i++){
          var e=ENTRIES[i],gw=WORDS.find(function(x){return x===e[2].toUpperCase();});
          if(!gw||found[e[0]])continue;
          if(w===gw||wr===gw){
            var pos=wordPos[gw];if(!pos)continue;
            var ss=new Set(cells.map(function(p){return p.r+','+p.c;}));
            var ps=new Set(pos.map(function(p){return p.r+','+p.c;}));
            if(ss.size===ps.size&&[...ss].every(function(k){return ps.has(k);})){
              markFound(e[0],e[1],pos);return true;
            }
          }
        }return false;
      }

      function getCellFromPoint(x,y){
        // Account for scale and pan
        var rect=puzzleWrap.getBoundingClientRect();
        var cx=(x-rect.left-rect.width/2-panX)/scale+rect.width/2;
        var cy=(y-rect.top-rect.height/2-panY)/scale+rect.height/2;
        var gridRect=puzzleEl.getBoundingClientRect();
        // Use elementFromPoint for accuracy
        var el=document.elementFromPoint(x,y);
        return el&&el.dataset&&el.dataset.r!==undefined?el:null;
      }

      // Mouse
      puzzleEl.addEventListener('mousedown',function(e){
        var cell=e.target.closest('[data-r]');if(!cell)return;
        e.preventDefault();sel=true;
        startC={r:+cell.dataset.r,c:+cell.dataset.c};clearSel();
        cell.style.background='rgba(255,255,255,0.15)';cell.style.color='#fff';
        selCells=[startC];
      });
      puzzleEl.addEventListener('mousemove',function(e){
        if(!sel)return;var cell=e.target.closest('[data-r]');if(!cell)return;
        clearSel();selCells=getLine(startC.r,startC.c,+cell.dataset.r,+cell.dataset.c);
        selCells.forEach(function(p){if(!cellEls[p.r][p.c].dataset.found){cellEls[p.r][p.c].style.background='rgba(255,255,255,0.15)';cellEls[p.r][p.c].style.color='#fff';}});
      });
      puzzleEl.addEventListener('mouseup',function(){if(!sel)return;sel=false;if(!checkWord(selCells))clearSel();});

      // Click gold cell to navigate
      puzzleEl.addEventListener('click',function(e){
        if(!sel){var cell=e.target.closest('[data-r]');if(cell&&cell.dataset.url)window.location.href=cell.dataset.url;}
      });

      // Touch drag selection (single finger)
      var touchSel=false,touchStart=null,touchSelCells=[];
      puzzleWrap.addEventListener('touchstart',function(e){
        if(e.touches.length!==1)return;
        var t=e.touches[0];
        var cell=document.elementFromPoint(t.clientX,t.clientY);
        cell=cell&&cell.closest?cell.closest('[data-r]'):null;
        if(!cell)return;
        touchSel=true;touchStart={r:+cell.dataset.r,c:+cell.dataset.c};
        clearSel();cell.style.background='rgba(255,255,255,0.15)';cell.style.color='#fff';
        touchSelCells=[touchStart];
      },{passive:true});
      puzzleWrap.addEventListener('touchmove',function(e){
        if(!touchSel||e.touches.length!==1)return;
        var t=e.touches[0];
        var cell=document.elementFromPoint(t.clientX,t.clientY);
        cell=cell&&cell.closest?cell.closest('[data-r]'):null;
        if(!cell)return;
        clearSel();touchSelCells=getLine(touchStart.r,touchStart.c,+cell.dataset.r,+cell.dataset.c);
        touchSelCells.forEach(function(p){if(!cellEls[p.r][p.c].dataset.found){cellEls[p.r][p.c].style.background='rgba(255,255,255,0.15)';cellEls[p.r][p.c].style.color='#fff';}});
      },{passive:true});
      puzzleWrap.addEventListener('touchend',function(e){
        if(!touchSel)return;touchSel=false;
        if(!checkWord(touchSelCells))clearSel();
        touchSelCells=[];
      },{passive:true});
    }

    window.openWSNav=openWS;
    window.closeWSNav=closeWS;
  })();
})();
