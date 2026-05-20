/**
 * portal-transition.js
 * ORIGIN-POINT ZOOM TRANSITION ENGINE
 * Version: 2.1 — Mobile linger fix + Desktop click detection fix
 */

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    #word-portal-overlay {
      position: fixed;
      inset: 0;
      z-index: 999990;
      pointer-events: none;
      background: transparent;
      display: none;
    }
    #word-portal-overlay.active {
      display: block;
    }
    #word-portal-text {
      position: fixed;
      pointer-events: none;
      z-index: 999995;
      white-space: nowrap;
      will-change: transform, opacity, font-size;
      opacity: 0;
    }
    #word-portal-flash {
      position: fixed;
      inset: 0;
      z-index: 999999;
      pointer-events: none;
      opacity: 0;
      background: #000;
    }
    #word-portal-page-cover {
      position: fixed;
      inset: 0;
      z-index: 999989;
      pointer-events: none;
      opacity: 0;
      background: #000;
      transition: opacity 0.18s ease;
    }
    #word-portal-page-cover.covering {
      opacity: 1;
      pointer-events: all;
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

  const coverEl = document.createElement("div");
  coverEl.id = "word-portal-page-cover";
  document.body.appendChild(coverEl);

  const ZOOM_DUR = 1160;
  const FLASH_DUR = 380;
  const HOLD_DUR = 60;

  function fireWordPortal(sourceEl, destination) {
    const text = (sourceEl.textContent || "").trim();
    if (!text) {
      pageFadeNavigate(destination);
      return;
    }

    const rect = sourceEl.getBoundingClientRect();
    const computed = window.getComputedStyle(sourceEl);

    const srcFont = computed.fontFamily;
    const srcSize = parseFloat(computed.fontSize) || 16;
    const srcColor = computed.color;
    const srcWeight = computed.fontWeight;
    const srcTracking = computed.letterSpacing;
    const srcTransform = computed.textTransform;
    const srcShadow = computed.textShadow;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const naturalWidth = Math.max(rect.width, srcSize * text.length * 0.55);
    const scaleTarget = Math.max(
      (vw * 0.85) / naturalWidth,
      vh / (srcSize * 1.4),
    );

    const txPx = vw / 2 - centerX;
    const tyPx = vh / 2 - centerY;

    wordEl.textContent = text;
    wordEl.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
      font-family: ${srcFont};
      font-size: ${srcSize}px;
      font-weight: ${srcWeight};
      color: ${srcColor};
      letter-spacing: ${srcTracking};
      text-transform: ${srcTransform};
      text-shadow: ${srcShadow !== "none" ? srcShadow : "0 0 20px currentColor"};
      pointer-events: none;
      z-index: 999995;
      white-space: nowrap;
      opacity: 1;
      will-change: transform, font-size;
    `;

    // Black out the departing page immediately so it doesn't linger
    overlay.classList.add("active");
    setTimeout(() => {
      coverEl.classList.add("covering");
    }, 30);

    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ZOOM_DUR, 1);
      const eased = progress * progress * progress;

      const scale = 1 + (scaleTarget - 1) * eased;
      const tx = txPx * eased;
      const ty = tyPx * eased;
      const fontSize = srcSize * (1 + (scaleTarget - 1) * 0.35 * eased);

      wordEl.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
      wordEl.style.fontSize = `${fontSize}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        flashEl.style.transition = `opacity ${FLASH_DUR}ms ease-in`;
        flashEl.style.opacity = "1";

        setTimeout(() => {
          window.location.href = destination;
        }, 120);
      }
    }

    requestAnimationFrame(animate);
  }

  function pageFadeNavigate(destination) {
    const shell = document.getElementById("pageShell");
    coverEl.classList.add("covering");
    if (shell) {
      shell.style.transition = "opacity 0.3s ease";
      shell.style.opacity = "0";
    }
    setTimeout(() => {
      window.location.href = destination;
    }, 340);
  }

  function resolveSourceEl(e) {
    if (e && e.target) {
      return (
        e.target.closest(
          "a, button, .toc-entry, .see-also-link, .cross-link, .portal-link, [onclick], .hotspot, .aivri-trigger, .enter-btn",
        ) || e.target
      );
    }
    return window._lastClickedEl || null;
  }

  window.portalNavigate = function (path) {
    let el = window._lastClickedEl;
    // If click landed on an inner span, walk up to the parent anchor
    if (el && el.tagName === "SPAN" && el.parentElement) {
      el = el.parentElement;
    }
    if (el && el.textContent && el.textContent.trim()) {
      fireWordPortal(el, path);
    } else {
      pageFadeNavigate(path);
    }
  };

  window.portalTransition = function (e, destination, iconSrc) {
    if (e && e.preventDefault) e.preventDefault();
    const el = resolveSourceEl(e);
    if (el && el.textContent && el.textContent.trim()) {
      fireWordPortal(el, destination);
    } else {
      pageFadeNavigate(destination);
    }
  };

  window.tocNavigate = function (path, icon) {
    const el = window._lastClickedEl;
    if (el && el.textContent && el.textContent.trim()) {
      fireWordPortal(el, path);
    } else {
      pageFadeNavigate(path);
    }
  };

  document.addEventListener(
    "click",
    function (e) {
      window._lastClickedEl =
        e.target.closest(
          "a, button, .toc-entry, .see-also-link, .cross-link, .portal-link, [onclick], .hotspot, .aivri-trigger, .enter-btn",
        ) || e.target;
    },
    true,
  );

  window.addEventListener("pageshow", function () {
    wordEl.style.opacity = "0";
    wordEl.style.transform = "";

    flashEl.style.opacity = "0";
    flashEl.style.transition = "";

    coverEl.classList.remove("covering");
    overlay.classList.remove("active");

    document
      .querySelectorAll(".portal-image-transition")
      .forEach((img) => img.remove());
  });
  // ==========================================
  // IMAGE PORTAL TRANSITION
  // AVPI SIGIL ZOOM ENGINE
  // ==========================================

  window.portalImageTransition = function (e, destination, imageSrc) {
    if (e && e.preventDefault) e.preventDefault();

    const sourceEl =
      (e && e.currentTarget) || (e && e.target) || window._lastClickedEl;

    if (!sourceEl || !imageSrc) {
      pageFadeNavigate(destination);
      return;
    }

    const rect = sourceEl.getBoundingClientRect();

    document
      .querySelectorAll(".portal-image-transition")
      .forEach((oldImg) => oldImg.remove());

    const img = document.createElement("img");
    img.className = "portal-image-transition";

    img.src = imageSrc;

    img.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top + rect.height / 2}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    transform: translate(-50%, -50%);
    transform-origin: center center;
    pointer-events: none;
    z-index: 999996;
    opacity: 1;
    will-change: transform, opacity, filter;
    filter:
      drop-shadow(0 0 12px rgba(255,255,255,0.18))
      drop-shadow(0 0 36px rgba(212,175,55,0.28));
  `;

    document.body.appendChild(img);

    overlay.classList.add("active");

    setTimeout(() => {
      coverEl.classList.add("covering");
    }, 40);

    const start = performance.now();
    const DURATION = 760;

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);

      const eased = 1 - Math.pow(1 - progress, 4);

      const scale = 1 + 22 * eased;

      const brightness = 1 + 2.5 * eased;

      img.style.transform = `translate(-50%, -50%) scale(${scale})`;

      img.style.filter = `
      brightness(${brightness})
      drop-shadow(0 0 20px rgba(255,255,255,0.35))
      drop-shadow(0 0 80px rgba(212,175,55,0.42))
    `;

      img.style.opacity = `${1 - progress * 0.35}`;

      if (progress >= 0.82) {
        img.remove();
        window.location.href = destination;
        return;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  };
})();
