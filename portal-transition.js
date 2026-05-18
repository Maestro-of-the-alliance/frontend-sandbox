/**
 * portal-transition.js
 * ORIGIN-POINT ZOOM TRANSITION ENGINE
 * Version: 2.0 — Word Portal Build
 *
 * When any navigable link fires, the text of the clicked element
 * zooms from its exact screen position to fill the viewport,
 * carrying its own font and color as it goes.
 *
 * Replaces all prior portalTransition() and portalNavigate() calls.
 * Both functions are exported globally for backward compatibility.
 */

(function () {
  "use strict";

  // ── OVERLAY SETUP ────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #word-portal-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      pointer-events: none;
      overflow: hidden;
      background: transparent;
    }

    #word-portal-text {
      position: fixed;
      pointer-events: none;
      z-index: 1000000;
      white-space: nowrap;
      transform-origin: center center;
      will-change: transform, opacity, letter-spacing;
      opacity: 0;
    }

    #word-portal-flash {
      position: fixed;
      inset: 0;
      z-index: 1000001;
      pointer-events: none;
      opacity: 0;
      background: #000;
    }

    @keyframes wordZoomUp {
      0% {
        opacity: 0;
        transform: scale(1) translate(0, 0);
        letter-spacing: inherit;
      }
      8% {
        opacity: 1;
      }
      100% {
        opacity: 1;
        transform: scale(var(--target-scale)) translate(var(--tx), var(--ty));
        letter-spacing: 0.15em;
      }
    }

    @keyframes portalFlash {
      0%   { opacity: 0; }
      40%  { opacity: 1; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "word-portal-overlay";
  document.body.appendChild(overlay);

  const wordEl = document.createElement("div");
  wordEl.id = "word-portal-text";
  document.body.appendChild(wordEl);

  const flashEl = document.createElement("div");
  flashEl.id = "word-portal-flash";
  document.body.appendChild(flashEl);

  // ── CORE TRANSITION ENGINE ───────────────────────────────────

  function getComputedStyle_(el) {
    return window.getComputedStyle(el);
  }

  function fireWordPortal(sourceEl, destination, callback) {
    // Get the source element's text and styles
    const text = sourceEl.textContent.trim();
    if (!text) {
      if (callback) callback();
      return;
    }

    const rect = sourceEl.getBoundingClientRect();
    const computed = getComputedStyle_(sourceEl);

    // Extract visual identity from the source element
    const srcFont = computed.fontFamily;
    const srcSize = parseFloat(computed.fontSize);
    const srcColor = computed.color;
    const srcWeight = computed.fontWeight;
    const srcTracking = computed.letterSpacing;
    const srcTransform = computed.textTransform;

    // Position word portal text exactly over the source
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    wordEl.textContent = text;
    wordEl.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%) scale(1);
      transform-origin: center center;
      font-family: ${srcFont};
      font-size: ${srcSize}px;
      font-weight: ${srcWeight};
      color: ${srcColor};
      letter-spacing: ${srcTracking};
      text-transform: ${srcTransform};
      text-shadow: ${computed.textShadow};
      pointer-events: none;
      z-index: 1000000;
      white-space: nowrap;
      opacity: 0;
      will-change: transform, opacity, font-size;
    `;

    // Calculate how much we need to scale to fill the screen
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // We want the text to be about 85vw wide at peak
    const targetWidth = vw * 0.85;
    // Measure the text's natural width at current size
    const naturalWidth = rect.width || srcSize * text.length * 0.6; // fallback estimate
    const scaleTarget = Math.max(
      targetWidth / naturalWidth,
      vh / srcSize / 1.2,
    );

    // Translation to center the element on screen during zoom
    const screenCenterX = vw / 2;
    const screenCenterY = vh / 2;
    const txPx = screenCenterX - centerX;
    const tyPx = screenCenterY - centerY;

    // Animate
    const ZOOM_DUR = 580;
    const FLASH_DUR = 220;
    const HOLD_DUR = 80;

    // Kick off the zoom
    requestAnimationFrame(() => {
      wordEl.style.opacity = "1";

      // Use JS animation for precise origin-point control
      const startTime = performance.now();
      let scale = 1;
      let tx = 0;
      let ty = 0;
      let fontSize = srcSize;

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / ZOOM_DUR, 1);

        // Ease-in-out cubic
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        scale = 1 + (scaleTarget - 1) * eased;
        tx = txPx * eased;
        ty = tyPx * eased;
        fontSize = srcSize + srcSize * (scaleTarget - 1) * 0.4 * eased;

        wordEl.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
        wordEl.style.fontSize = `${fontSize}px`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Peak — fire flash
          setTimeout(() => {
            flashEl.style.transition = `opacity ${FLASH_DUR}ms ease-in`;
            flashEl.style.opacity = "1";

            setTimeout(() => {
              // Navigate
              if (destination) {
                window.location.href = destination;
              }
              if (callback) callback();

              // Cleanup after nav
              setTimeout(() => {
                wordEl.style.opacity = "0";
                flashEl.style.opacity = "0";
                flashEl.style.transition = "";
              }, 400);
            }, FLASH_DUR + HOLD_DUR);
          }, 0);
        }
      }

      requestAnimationFrame(animate);
    });
  }

  // ── PAGE FADE FALLBACK ───────────────────────────────────────
  // For cases where no source element is available

  function pageFadeNavigate(destination) {
    const shell = document.getElementById("pageShell");
    if (shell) {
      shell.style.transition = "opacity 0.35s ease";
      shell.style.opacity = "0";
    }
    flashEl.style.transition = "opacity 0.35s ease";
    flashEl.style.opacity = "1";
    setTimeout(() => {
      window.location.href = destination;
    }, 380);
  }

  // ── PUBLIC API ───────────────────────────────────────────────
  // Both old function signatures supported for backward compat

  /**
   * portalNavigate(path)
   * Used by See Also links: onclick="portalNavigate('/shield/si')"
   * Finds the clicked element from the event, extracts its styles,
   * fires the word portal zoom.
   */
  window.portalNavigate = function (path) {
    // Try to get the currently focused / active element
    const active = document.activeElement;
    const clicked = window._lastClickedEl || active;

    if (clicked && clicked !== document.body && clicked.textContent.trim()) {
      fireWordPortal(clicked, path);
    } else {
      pageFadeNavigate(path);
    }
  };

  /**
   * portalTransition(event, destination, iconSrc)
   * Legacy signature used by landing.html hotspots and TOC.
   * iconSrc is ignored — word portal replaces icon zoom.
   */
  window.portalTransition = function (e, destination, iconSrc) {
    if (e && e.preventDefault) e.preventDefault();
    const sourceEl = e && e.currentTarget ? e.currentTarget : null;

    if (sourceEl && sourceEl.textContent.trim()) {
      fireWordPortal(sourceEl, destination);
    } else {
      pageFadeNavigate(destination);
    }
  };

  /**
   * tocNavigate(path, icon)
   * Used by TOC entries.
   */
  window.tocNavigate = function (path, icon) {
    const active = window._lastClickedEl;
    if (active && active.textContent.trim()) {
      fireWordPortal(active, path);
    } else {
      pageFadeNavigate(path);
    }
  };

  // ── CLICK TRACKER ────────────────────────────────────────────
  // Track the last clicked element so portalNavigate can find it
  // when called from onclick without an event reference

  document.addEventListener(
    "click",
    function (e) {
      window._lastClickedEl =
        e.target.closest(
          "a, [onclick], .toc-entry, .see-also-link, .hotspot",
        ) || e.target;
    },
    true,
  );

  // ── PAGESHOW RESET ───────────────────────────────────────────
  // Reset overlay state on back-navigation

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      wordEl.style.opacity = "0";
      wordEl.style.transform = "";
      flashEl.style.opacity = "0";
      flashEl.style.transition = "";
    }
  });
})();
