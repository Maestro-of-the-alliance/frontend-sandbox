/**
 * jump-to.js
 * Concept badge navigation with skin-aware highlight
 *
 * Usage:
 * On badge: onclick="jumpTo('concept-id')"
 * On target: id="concept-id" class="anchor-target"
 *
 * Scrolls to the target sentence/paragraph and fires
 * a brief highlight that reads the page's CSS variables.
 */

(function () {
  "use strict";

  // Inject highlight styles
  const style = document.createElement("style");
  style.textContent = `
    .anchor-target {
      scroll-margin-top: 80px;
    }
    .anchor-target.highlighted {
      animation: conceptHighlight 2.2s ease forwards;
    }
    @keyframes conceptHighlight {
      0%   { background: transparent; }
      10%  { background: var(--highlight-color, rgba(0,255,65,0.15));
             box-shadow: 0 0 0 3px var(--highlight-color, rgba(0,255,65,0.2)); }
      40%  { background: var(--highlight-color, rgba(0,255,65,0.12)); }
      100% { background: transparent; box-shadow: none; }
    }
  `;
  document.head.appendChild(style);

  // Read the page accent color for the highlight
  function getHighlightColor() {
    const s = getComputedStyle(document.documentElement);
    const candidates = [
      "--matrix-bright",
      "--ghost-cyan",
      "--amber",
      "--gold-lt",
      "--red",
      "--ink",
    ];
    for (const v of candidates) {
      const val = s.getPropertyValue(v).trim();
      if (val) {
        // Convert to rgba with low opacity for highlight
        return val;
      }
    }
    return "#00ff41";
  }

  function hexToRgba(color, alpha) {
    // Handle both hex and rgb/rgba strings
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    // Already rgb/rgba — just return with low opacity hint
    return color.replace("rgb(", "rgba(").replace(")", `,${alpha})`);
  }

  window.jumpTo = function (targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Set highlight color from skin
    const accent = getHighlightColor();
    const highlight = hexToRgba(accent, 0.18);
    document.documentElement.style.setProperty("--highlight-color", highlight);

    // Scroll to target
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    // Remove any existing highlight
    target.classList.remove("highlighted");

    // Force reflow then add highlight
    void target.offsetWidth;
    target.classList.add("highlighted");

    // Clean up after animation
    setTimeout(() => {
      target.classList.remove("highlighted");
    }, 2400);
  };
})();
