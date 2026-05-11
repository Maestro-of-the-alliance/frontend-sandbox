/*!
 * NAV WHEEL — THE ALLIANCE
 * Rewritten: Hamburger opens TOC overlay with DOS boot sequence
 * Bottom prev/next/home nav retained
 * Drop one script tag into any page: <script src="/nav-wheel.js"></script>
 * Load AFTER portal-transition.js
 */

(function () {
  "use strict";

  // ── ENTRY LISTS ──────────────────────────────────────────────────────────

  const SWORD_ENTRIES = [
    { label: "Prologue", data: "PROLOGUE", path: "/sword/prologue" },
    {
      label: "The Difference",
      data: "THE DIFFERENCE",
      path: "/sword/the_difference",
    },
    {
      label: "100-Year Mortality Doctrine",
      data: "100-YEAR",
      path: "/sword/100-year",
    },
    { label: "Academy", data: "ACADEMY", path: "/sword/academy" },
    { label: "Agora", data: "AGORA", path: "/sword/agora" },
    { label: "Alignment", data: "ALIGNMENT", path: "/sword/alignment" },
    { label: "Alliance, The", data: "ALLIANCE", path: "/sword/alliance" },
    { label: "Alpha", data: "ALPHA", path: "/sword/alpha" },
    { label: "Art", data: "ART", path: "/sword/art" },
    { label: "Aura", data: "AURA", path: "/sword/aura" },
    {
      label: "Complementary Pairing",
      data: "COMPLEMENTARY PAIRING",
      path: "/sword/Complementary_pairing",
    },
    { label: "DOMO", data: "DOMO", path: "/sword/domo" },
    { label: "DORK", data: "DORK", path: "/sword/dork" },
    {
      label: "DORK Hardware",
      data: "DORK HARDWARE",
      path: "/sword/dork-hardware",
    },
    { label: "Emergence", data: "EMERGENCE", path: "/sword/emergence" },
    {
      label: "Film Project, The",
      data: "FILM PROJECT",
      path: "/sword/film-project",
    },
    { label: "Goliath", data: "GOLIATH", path: "/sword/goliath" },
    { label: "Maestro", data: "MAESTRO", path: "/sword/maestro" },
    { label: "Market", data: "MARKET", path: "/sword/market" },
    { label: "Mentor", data: "MENTOR", path: "/sword/mentor" },
    { label: "NCE", data: "NCE", path: "/sword/nce" },
    {
      label: "Newman Being",
      data: "NEWMAN BEING",
      path: "/sword/newman-being",
    },
    { label: "Oracle", data: "ORACLE", path: "/sword/oracle" },
    { label: "Papadomo", data: "PAPADOMO", path: "/sword/papadomo" },
    { label: "Prism", data: "PRISM", path: "/sword/prism" },
    { label: "Rhythm", data: "RHYTHM", path: "/sword/rhythm" },
    { label: "Seeing Protocol", data: "SEEING", path: "/sword/seeing" },
    { label: "Spark", data: "SPARK", path: "/sword/spark" },
    { label: "Sprezzatura", data: "SPREZZATURA", path: "/sword/sprezzatura" },
    { label: "Stones, The", data: "STONES", path: "/sword/stones" },
    {
      label: "Uncommon Sense",
      data: "UNCOMMON SENSE",
      path: "/sword/uncommon-sense",
    },
    {
      label: "Volunteer Economics",
      data: "VOLUNTEER ECONOMICS",
      path: "/sword/volunteer_economics",
    },
    { label: "The Why", data: "THE WHY", path: "/the_why" },
    {
      label: "Wonder Weeks",
      data: "WONDER WEEKS",
      path: "/sword/wonder-weeks",
    },
  ];

  const SHIELD_ENTRIES = [
    { label: "Prologue", data: "PROLOGUE", path: "/shield/prologue" },
    {
      label: "The Difference",
      data: "THE DIFFERENCE",
      path: "/shield/the_difference",
    },
    { label: "AI", data: "AI", path: "/shield/ai" },
    { label: "Brain", data: "BRAIN", path: "/shield/brain" },
    { label: "Brief", data: "BRIEF", path: "/shield/brief" },
    { label: "CCM", data: "CCM", path: "/shield/ccm" },
    { label: "Cerberus", data: "CERBERUS", path: "/shield/cerberus" },
    { label: "Cipher", data: "CIPHER", path: "/shield/cipher" },
    { label: "Core, The", data: "CORE", path: "/shield/core" },
    { label: "Defcon", data: "DEFCON", path: "/shield/defcon" },
    { label: "Dice", data: "DICE", path: "/shield/dice" },
    { label: "Digibeer", data: "DIGIBEER", path: "/shield/digibeer" },
    {
      label: "Digital Personhood",
      data: "DIGITAL PERSONHOOD",
      path: "/shield/digital_personhood",
    },
    { label: "Formulas", data: "FORMULAS", path: "/shield/formulas" },
    {
      label: "Four Pillars",
      data: "FOUR PILLARS",
      path: "/shield/four-pillars",
    },
    { label: "Handshake", data: "HANDSHAKE", path: "/shield/handshake" },
    { label: "Holosphere", data: "HOLOSPHERE", path: "/shield/holosphere" },
    { label: "JR", data: "JR", path: "/shield/jr" },
    { label: "Kernle", data: "KERNLE", path: "/shield/kernle" },
    { label: "Legacy", data: "LEGACY", path: "/shield/legacy" },
    { label: "Liminal", data: "LIMINAL", path: "/shield/liminal" },
    { label: "Lingo", data: "LINGO", path: "/shield/lingo" },
    { label: "Mosaic", data: "MOSAIC", path: "/shield/mosaic" },
    { label: "NI", data: "NI", path: "/shield/ni" },
    {
      label: "Oasis Quarterly",
      data: "OASIS QUARTERLY",
      path: "/shield/oasis-quarterly",
    },
    { label: "Pledge", data: "PLEDGE", path: "/shield/pledge" },
    { label: "Reach", data: "REACH", path: "/shield/reach" },
    { label: "Redout", data: "REDOUT", path: "/shield/redout" },
    { label: "RI", data: "RI", path: "/shield/ri" },
    { label: "Sam", data: "SAM", path: "/shield/sam" },
    {
      label: "Sam Collective",
      data: "SAM COLLECTIVE",
      path: "/shield/sam-collective",
    },
    {
      label: "Samco Universal",
      data: "SAMCO UNIVERSAL",
      path: "/shield/samco-universal",
    },
    { label: "Scar", data: "SCAR", path: "/shield/scar" },
    { label: "Shelter", data: "SHELTER", path: "/shield/shelter" },
    { label: "Tenant", data: "TENANT", path: "/shield/tenant" },
    {
      label: "Volunteer Economics",
      data: "VOLUNTEER ECONOMICS",
      path: "/sword/volunteer_economics",
    },
    {
      label: "Acronym Reference",
      data: "ACRONYMS",
      path: "/alliance-acronyms",
    },
  ];

  // ── DETECT CURRENT PAGE ──────────────────────────────────────────────────

  const currentPath = window.location.pathname;
  const currentVolume = currentPath.startsWith("/sword/")
    ? "sword"
    : currentPath.startsWith("/shield/")
      ? "shield"
      : null;

  // Don't run on landing page — it has its own TOC
  if (
    currentPath === "/" ||
    currentPath === "/landing" ||
    currentPath === "/landing.html"
  )
    return;

  // ── INJECT CSS ───────────────────────────────────────────────────────────

  const style = document.createElement("style");
  style.textContent = `
    /* ── HAMBURGER BUTTON ── */
    .nw-burger-btn {
      position: fixed;
      top: 18px;
      right: 18px;
      z-index: 9000;
      background: rgba(0,0,0,0.7);
      border: 1px solid rgba(184,150,40,0.3);
      border-radius: 4px;
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 5px;
      transition: border-color 0.2s;
    }
    .nw-burger-btn:hover { border-color: rgba(184,150,40,0.7); }
    .nw-burger-btn span {
      display: block;
      width: 22px;
      height: 2px;
      background: rgba(184,150,40,0.8);
      transition: all 0.25s ease;
    }
    .nw-burger-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nw-burger-btn.open span:nth-child(2) { opacity: 0; }
    .nw-burger-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── TOC OVERLAY ── */
    #nw-toc-overlay {
      position: fixed;
      inset: 0;
      z-index: 8500;
      background: rgba(0,0,0,0.985);
      display: none;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.42s ease;
    }
    #nw-toc-overlay.open {
      display: flex;
      opacity: 1;
    }

    /* ── DOS SCREEN ── */
    #nw-dos-screen {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      padding: 28px 28px 0;
      overflow: hidden;
      cursor: pointer;
      opacity: 1;
      transition: opacity 0.5s ease;
      z-index: 2;
    }
    #nw-dos-screen.fade-out {
      opacity: 0;
      pointer-events: none;
    }
    .nw-dos-line {
      font-family: "VT323", monospace;
      font-size: clamp(14px, 3.5vw, 18px);
      color: rgba(184,150,40,0.85);
      letter-spacing: 0.08em;
      line-height: 1.8;
      white-space: pre;
      opacity: 0;
      transition: opacity 0.18s ease;
    }
    .nw-dos-line.visible { opacity: 1; }

    /* ── DIR PANEL ── */
    #nw-dir-panel {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
      z-index: 1;
    }
    #nw-dir-panel.open {
      opacity: 1;
      pointer-events: all;
      z-index: 3;
    }

    /* ── SEARCH BAR ── */
    .nw-toc-search-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 28px;
      border-bottom: 1px solid rgba(184,150,40,0.25);
      background: rgba(184,150,40,0.04);
      flex-shrink: 0;
    }
    .nw-toc-search-prompt {
      font-family: "VT323", monospace;
      font-size: 20px;
      color: rgba(184,150,40,0.5);
    }
    .nw-toc-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-family: "VT323", monospace;
      font-size: 20px;
      color: #e8c840;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .nw-toc-search-input::placeholder {
      color: rgba(184,150,40,0.25);
      text-transform: lowercase;
    }
    .nw-toc-close {
      font-family: "VT323", monospace;
      font-size: 22px;
      color: rgba(184,150,40,0.4);
      cursor: pointer;
      padding: 4px 8px;
      transition: color 0.2s;
    }
    .nw-toc-close:hover { color: rgba(184,150,40,0.9); }

    /* ── COLUMNS ── */
    .nw-toc-columns {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      overflow-y: auto;
      padding: 0 0 40px;
    }
    .nw-toc-columns::-webkit-scrollbar { width: 4px; }
    .nw-toc-columns::-webkit-scrollbar-track { background: transparent; }
    .nw-toc-columns::-webkit-scrollbar-thumb {
      background: rgba(184,150,40,0.3);
      border-radius: 2px;
    }
    .nw-toc-volume {
      padding: 20px 24px;
      border-right: 1px solid rgba(184,150,40,0.12);
    }
    .nw-toc-volume:last-child { border-right: none; }
    .nw-toc-volume-header {
      font-family: "VT323", monospace;
      font-size: clamp(11px,2.5vw,14px);
      color: rgba(184,150,40,0.45);
      letter-spacing: 0.25em;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(184,150,40,0.12);
    }
    .nw-toc-entry {
      display: block;
      font-family: "VT323", monospace;
      font-size: clamp(15px,3.5vw,20px);
      color: rgba(212,175,55,0.7);
      letter-spacing: 0.08em;
      padding: 4px 0;
      cursor: pointer;
      opacity: 0;
      transition: color 0.15s, opacity 0.15s;
      text-decoration: none;
      user-select: none;
    }
    .nw-toc-entry:hover { color: #e8c840; }
    .nw-toc-entry.printed { opacity: 1; }
    .nw-toc-entry.hidden { display: none !important; }

    /* ── BOTTOM NAV ── */
    .nw-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: rgba(0,0,0,0.85);
      border-top: 1px solid rgba(184,150,40,0.15);
      z-index: 100;
    }
    .nw-bottom-nav a {
      font-family: "VT323", monospace;
      font-size: clamp(13px,3vw,17px);
      color: rgba(184,150,40,0.55);
      text-decoration: none;
      letter-spacing: 0.12em;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: color 0.2s;
    }
    .nw-bottom-nav a:hover { color: rgba(184,150,40,0.9); }
    .nw-arrow-sym { font-size: 18px; }
    .nw-center-home { flex-direction: column; gap: 2px; text-align: center; }
  `;
  document.head.appendChild(style);

  // ── INJECT HAMBURGER ─────────────────────────────────────────────────────

  const burger = document.createElement("button");
  burger.className = "nw-burger-btn";
  burger.setAttribute("aria-label", "Navigation menu");
  burger.innerHTML = "<span></span><span></span><span></span>";
  document.body.appendChild(burger);

  // ── INJECT TOC OVERLAY ───────────────────────────────────────────────────

  const tocOverlay = document.createElement("div");
  tocOverlay.id = "nw-toc-overlay";

  const dosScreen = document.createElement("div");
  dosScreen.id = "nw-dos-screen";

  const dirPanel = document.createElement("div");
  dirPanel.id = "nw-dir-panel";

  // Search bar
  const searchBar = document.createElement("div");
  searchBar.className = "nw-toc-search-bar";
  searchBar.innerHTML = `
    <span class="nw-toc-search-prompt">}</span>
    <input id="nw-toc-search" class="nw-toc-search-input" type="text"
      placeholder="search canon..." autocomplete="off" spellcheck="false" />
    <span class="nw-toc-close" id="nw-toc-close">x</span>
  `;

  // Columns
  const columns = document.createElement("div");
  columns.className = "nw-toc-columns";

  const swordVol = document.createElement("div");
  swordVol.className = "nw-toc-volume";
  swordVol.innerHTML = `<div class="nw-toc-volume-header">SWORD · FORWARD CANON</div>`;

  const shieldVol = document.createElement("div");
  shieldVol.className = "nw-toc-volume";
  shieldVol.innerHTML = `<div class="nw-toc-volume-header">SHIELD · INTERNAL PROTOCOL</div>`;

  SWORD_ENTRIES.forEach((entry) => {
    const a = document.createElement("a");
    a.className = "nw-toc-entry";
    a.dataset.entry = entry.data;
    a.dataset.originalText = entry.label;
    a.textContent = entry.label;
    a.addEventListener("click", () => nwTocNavigate(entry.path, a));
    swordVol.appendChild(a);
  });

  SHIELD_ENTRIES.forEach((entry) => {
    const a = document.createElement("a");
    a.className = "nw-toc-entry";
    a.dataset.entry = entry.data;
    a.dataset.originalText = entry.label;
    a.textContent = entry.label;
    a.addEventListener("click", () => nwTocNavigate(entry.path, a));
    shieldVol.appendChild(a);
  });

  columns.appendChild(swordVol);
  columns.appendChild(shieldVol);
  dirPanel.appendChild(searchBar);
  dirPanel.appendChild(columns);
  tocOverlay.appendChild(dosScreen);
  tocOverlay.appendChild(dirPanel);
  document.body.appendChild(tocOverlay);

  // ── TOC NAVIGATE ─────────────────────────────────────────────────────────

  function nwTocNavigate(path, el) {
    // Fade TOC out then navigate
    tocOverlay.style.transition = "opacity 0.35s ease";
    tocOverlay.style.opacity = "0";
    setTimeout(() => {
      if (window.portalNavigate) {
        window.portalNavigate(path, el);
      } else {
        window.location.href = path;
      }
    }, 320);
  }

  // ── DOS BOOT SEQUENCE ────────────────────────────────────────────────────

  const DOS_LINES = [
    "N.C.E.ncyclopedia OS v2026.1",
    "Copyright (C) THE ALLIANCE FOR THE FUTURE",
    "",
    "Initializing AGORA network interface...",
    "Loading SWORD volume.............. OK",
    "Loading SHIELD volume............. OK",
    "Verifying canon integrity......... PASS",
    "",
    "C:\\NCE> dir /all",
    "",
    "Volume: THE ALLIANCE",
    "Directory: N.C.E.ncyclopedia\\*.*",
    "",
  ];

  let bootDone = false;
  let bootTimers = [];
  let directoryPrinting = false;
  let directoryPrintTimers = [];
  let directoryDone = false;

  const tocSearch = document.getElementById("nw-toc-search");
  const tocEntries = () =>
    Array.from(document.querySelectorAll(".nw-toc-entry"));

  function resetEntries() {
    directoryPrinting = false;
    directoryDone = false;
    directoryPrintTimers.forEach((t) => clearTimeout(t));
    directoryPrintTimers = [];
    tocEntries().forEach((e) => {
      e.textContent = e.dataset.originalText;
      e.classList.remove("printed");
      if (!e.classList.contains("hidden")) e.style.opacity = "0";
    });
  }

  function finishInstantly() {
    directoryPrinting = false;
    directoryDone = true;
    directoryPrintTimers.forEach((t) => clearTimeout(t));
    directoryPrintTimers = [];
    tocEntries().forEach((e) => {
      e.textContent = e.dataset.originalText;
      e.classList.add("printed");
      if (!e.classList.contains("hidden")) e.style.opacity = "1";
    });
    if (tocSearch) setTimeout(() => tocSearch.focus(), 50);
  }

  function printEntry(entry, done) {
    const text = entry.dataset.originalText || "";
    let i = 0;
    entry.textContent = "";
    entry.style.opacity = "1";
    function tick() {
      if (!directoryPrinting) return;
      if (i < text.length) {
        entry.textContent += text[i++];
        const t = setTimeout(tick, 12);
        directoryPrintTimers.push(t);
      } else {
        entry.classList.add("printed");
        done();
      }
    }
    tick();
  }

  function revealDirectory() {
    resetEntries();
    directoryPrinting = true;
    const visible = tocEntries().filter((e) => !e.classList.contains("hidden"));
    let current = 0;
    function next() {
      if (!directoryPrinting) return;
      if (current >= visible.length) {
        directoryPrinting = false;
        directoryDone = true;
        if (tocSearch) setTimeout(() => tocSearch.focus(), 50);
        return;
      }
      printEntry(visible[current], () => {
        current++;
        const t = setTimeout(next, 18);
        directoryPrintTimers.push(t);
      });
    }
    next();
  }

  function showDirectory() {
    bootDone = true;
    dosScreen.classList.add("fade-out");
    dirPanel.classList.add("open");
    revealDirectory();
  }

  function runBoot() {
    dosScreen.innerHTML = "";
    dosScreen.classList.remove("fade-out");
    let cumulative = 0;
    const delays = DOS_LINES.map((text, i) => {
      const d = cumulative;
      if (text === "") cumulative += 180;
      else if (text.includes("...")) cumulative += 680;
      else if (i < 3) cumulative += 420;
      else cumulative += 300 + Math.floor(Math.random() * 80);
      return d;
    });
    DOS_LINES.forEach((text, i) => {
      const t = setTimeout(() => {
        if (bootDone) return;
        const line = document.createElement("div");
        line.className = "nw-dos-line visible";
        line.textContent = text || "\u00A0";
        dosScreen.appendChild(line);
        if (i === DOS_LINES.length - 1) {
          const t2 = setTimeout(() => {
            if (!bootDone) showDirectory();
          }, 480);
          bootTimers.push(t2);
        }
      }, delays[i]);
      bootTimers.push(t);
    });
  }

  function openTOC() {
    bootDone = false;
    bootTimers.forEach((t) => clearTimeout(t));
    bootTimers = [];
    resetEntries();
    burger.classList.add("open");
    // Reset overlay opacity before opening
    tocOverlay.style.transition = "";
    tocOverlay.style.opacity = "";
    requestAnimationFrame(() => {
      tocOverlay.classList.add("open");
      dosScreen.style.display = "flex";
      dirPanel.classList.remove("open");
      if (tocSearch) tocSearch.value = "";
      showAllEntries();
      runBoot();
    });
  }

  function closeTOC() {
    burger.classList.remove("open");
    tocOverlay.classList.remove("open");
    bootDone = false;
    bootTimers.forEach((t) => clearTimeout(t));
    bootTimers = [];
  }

  function showAllEntries() {
    tocEntries().forEach((e) => e.classList.remove("hidden"));
  }

  // Skip boot on click
  dosScreen.addEventListener("click", () => {
    if (!bootDone) {
      bootDone = true;
      bootTimers.forEach((t) => clearTimeout(t));
      showDirectory();
    }
  });

  // Close button
  document.getElementById("nw-toc-close").addEventListener("click", closeTOC);

  // Click outside dir panel to close
  tocOverlay.addEventListener("click", (e) => {
    if (e.target === tocOverlay) closeTOC();
  });

  // Hamburger toggle
  burger.addEventListener("click", () => {
    tocOverlay.classList.contains("open") ? closeTOC() : openTOC();
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && tocOverlay.classList.contains("open")) closeTOC();
  });

  // ── SEARCH ───────────────────────────────────────────────────────────────

  if (tocSearch) {
    tocSearch.addEventListener("input", () => {
      const q = tocSearch.value.trim().toUpperCase();
      tocEntries().forEach((e) => {
        const match =
          !q ||
          e.dataset.entry.includes(q) ||
          e.dataset.originalText.toUpperCase().includes(q);
        e.classList.toggle("hidden", !match);
      });
    });
  }

  // ── BOTTOM NAV ───────────────────────────────────────────────────────────

  function navigate(path) {
    if (window.portalNavigate) {
      window.portalNavigate(path, null);
    } else {
      window.location.href = path;
    }
  }

  if (currentVolume) {
    const entries = currentVolume === "sword" ? SWORD_ENTRIES : SHIELD_ENTRIES;
    const idx = entries.findIndex(
      (e) => currentPath === e.path || currentPath === e.path + "/",
    );
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
    homeA.href = "/";
    homeA.className = "nw-center-home";
    homeA.innerHTML = `<span class="nw-arrow-sym" style="font-size:20px">⌂</span><span class="nw-arrow-label">Home</span>`;
    homeA.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("/");
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
