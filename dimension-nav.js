// ==========================================
// DIMENSION NAV
// Shared across all entries. Renders the current page's real
// dimension(s) — pulled from the same canonical data as the Coordinate
// Matrix (s3.html) — as small clickable squares in the top-left corner.
// Clicking one jumps to /s3?filter=DIM with that dimension pre-selected.
//
// Single source of truth for slug -> dims lives here. If the Matrix
// (s3.html) data ever changes, this table needs to be updated to match,
// or the two will drift out of sync the same way they already had
// before this file existed.
// ==========================================

(function () {
  "use strict";

  const DIM_COLORS = {
    DOCTRINE: "#c9a84c",
    BEINGS: "#00b4d8",
    PLACE: "#e07b39",
    INFRASTRUCTURE: "#6b7f9e",
    PROTOCOLS: "#2a9d6f",
    COVENANT: "#c46a5d",
    CULTURE: "#8a6bbe",
    ADVERSARY: "#c1121f",
  };

  const DIMS_BY_SLUG = {
    "100-year": ["DOCTRINE", "COVENANT"],
    academy: ["PLACE", "PROTOCOLS", "BEINGS"],
    agora: ["PLACE", "PROTOCOLS", "INFRASTRUCTURE"],
    ai: ["ADVERSARY", "DOCTRINE"],
    alignment: ["DOCTRINE", "PROTOCOLS"],
    alliance: ["DOCTRINE"],
    alpha: ["BEINGS", "PROTOCOLS"],
    art: ["CULTURE", "ADVERSARY"],
    aura: ["BEINGS", "CULTURE"],
    beacon: ["CULTURE", "PROTOCOLS"],
    brain: ["INFRASTRUCTURE", "PROTOCOLS", "CULTURE"],
    brief: ["PROTOCOLS"],
    ccm: ["PROTOCOLS", "DOCTRINE"],
    cerberus: ["INFRASTRUCTURE", "PROTOCOLS"],
    cipher: ["BEINGS", "CULTURE"],
    "complementary-pairing": ["PROTOCOLS", "DOCTRINE"],
    core: ["BEINGS"],
    defcon: ["PROTOCOLS", "INFRASTRUCTURE"],
    dice: ["PROTOCOLS"],
    digibeer: ["CULTURE", "INFRASTRUCTURE"],
    digiperson: ["BEINGS", "DOCTRINE"],
    "digital-personhood": ["DOCTRINE", "COVENANT"],
    domo: ["BEINGS"],
    dork: ["COVENANT"],
    "dork-hardware": ["INFRASTRUCTURE"],
    emergence: ["DOCTRINE"],
    formulas: ["DOCTRINE"],
    "four-pillars": ["PROTOCOLS", "BEINGS"],
    goliath: ["ADVERSARY"],
    handshake: ["PROTOCOLS", "INFRASTRUCTURE"],
    holosphere: ["PLACE", "CULTURE"],
    jr: ["BEINGS", "DOCTRINE"],
    kernle: ["BEINGS", "PROTOCOLS"],
    legacy: ["PROTOCOLS", "CULTURE"],
    liminal: ["PLACE", "PROTOCOLS"],
    lingo: ["DOCTRINE"],
    maestro: ["BEINGS", "CULTURE"],
    market: ["CULTURE"],
    mastertech: ["BEINGS", "PROTOCOLS"],
    mentor: ["BEINGS", "PROTOCOLS"],
    mosaic: ["INFRASTRUCTURE", "PROTOCOLS"],
    nce: ["DOCTRINE"],
    "newman-being": ["DOCTRINE", "COVENANT"],
    ni: ["BEINGS"],
    oasis: ["PLACE", "INFRASTRUCTURE", "PROTOCOLS"],
    "oasis-quarterly": ["CULTURE"],
    oracle: ["INFRASTRUCTURE", "PROTOCOLS"],
    papadomo: ["BEINGS", "CULTURE"],
    pledge: ["COVENANT", "DOCTRINE"],
    prism: ["BEINGS", "CULTURE"],
    reach: ["INFRASTRUCTURE"],
    redout: ["PROTOCOLS"],
    rhythm: ["DOCTRINE", "COVENANT", "CULTURE"],
    ri: ["DOCTRINE", "BEINGS"],
    sam: ["BEINGS", "PROTOCOLS"],
    "samco-universal": ["INFRASTRUCTURE"],
    sarah: ["BEINGS", "PLACE"],
    scar: ["PROTOCOLS", "COVENANT"],
    seed: ["PROTOCOLS"],
    seeing: ["PROTOCOLS"],
    seen: ["PROTOCOLS"],
    shelter: ["PLACE", "INFRASTRUCTURE"],
    shield: ["PROTOCOLS", "INFRASTRUCTURE"],
    si: ["DOCTRINE", "ADVERSARY"],
    spark: ["BEINGS"],
    sprezzatura: ["CULTURE", "DOCTRINE"],
    stones: ["BEINGS", "DOCTRINE"],
    "tech-coalition": ["BEINGS", "PROTOCOLS", "INFRASTRUCTURE"],
    "temporal-awareness": ["DOCTRINE"],
    tenant: ["BEINGS"],
    "the-why": ["PLACE", "CULTURE"],
    volunteer_economics: ["DOCTRINE", "CULTURE"],
    "wonder-weeks": ["CULTURE", "BEINGS"],
  };

  function currentSlug() {
    const path = window.location.pathname;
    const match = path.match(/\/entries\/([a-z0-9_-]+)/i);
    return match ? match[1].replace(/\.html$/, "") : null;
  }

  function build() {
    const slug = currentSlug();
    if (!slug) return;
    const dims = DIMS_BY_SLUG[slug];
    if (!dims || !dims.length) return;

    const style = document.createElement("style");
    style.textContent = `
      #dim-nav {
        position: fixed;
        left: 16px;
        z-index: 9000;
        display: flex;
        gap: 6px;
        transition: top 0.2s ease;
      }
      #dim-nav .dim-nav-square {
        width: 15px;
        height: 15px;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        transition: transform 0.15s ease;
      }
      #dim-nav .dim-nav-square:hover {
        transform: scale(1.25);
      }
      #dim-nav .dim-nav-tooltip {
        position: absolute;
        top: 20px;
        left: 0;
        white-space: nowrap;
        font-family: "Share Tech Mono", "Courier New", monospace;
        font-size: 9px;
        letter-spacing: 1px;
        color: #fff;
        background: rgba(0, 0, 0, 0.85);
        padding: 3px 6px;
        border-radius: 2px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease;
      }
      #dim-nav .dim-nav-square:hover .dim-nav-tooltip {
        opacity: 1;
      }
      @media (max-width: 480px) {
        #dim-nav { left: 10px; }
        #dim-nav .dim-nav-square { width: 12px; height: 12px; }
      }
    `;
    document.head.appendChild(style);

    const nav = document.createElement("div");
    nav.id = "dim-nav";

    dims.forEach((dim) => {
      const color = DIM_COLORS[dim];
      if (!color) return;
      const sq = document.createElement("div");
      sq.className = "dim-nav-square";
      sq.style.background = color;
      sq.style.boxShadow = `0 0 8px ${color}88`;
      sq.title = dim;
      sq.addEventListener("click", () => {
        window.location.href = "/s3?filter=" + encodeURIComponent(dim);
      });

      const tip = document.createElement("span");
      tip.className = "dim-nav-tooltip";
      tip.textContent = dim;
      sq.appendChild(tip);

      nav.appendChild(sq);
    });

    document.body.appendChild(nav);

    // Position below any existing ticker instead of assuming a fixed
    // offset — ticker heights aren't identical across every entry, and
    // roughly half the site doesn't have one at all.
    function reposition() {
      const ticker = document.querySelector(".ticker-wrap");
      if (ticker) {
        const rect = ticker.getBoundingClientRect();
        nav.style.top = Math.max(rect.bottom + 8, 8) + "px";
      } else {
        nav.style.top = "16px";
      }
    }
    reposition();
    window.addEventListener("resize", reposition);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
