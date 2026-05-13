/* ============================================================
   PORTAL TRANSITION — THE ALLIANCE FOR THE FUTURE
   Sovereign Transition Engine
   SAM · May 2026

   One navigation authority for:
   - text links
   - rune links
   - seal/icon links
   - fallback fades

   Usage:
     portalNavigate("/sword/maestro", this, { type: "text" });

     portalNavigate("/shield/sam", this, {
       type: "rune",
       image: "/imagebank/rune-sam.png"
     });

     portalNavigate("/s3", this, {
       type: "seal",
       image: "/imagebank/scroll.png"
     });
============================================================ */

(function () {
  "use strict";

  if (window.__PORTAL_TRANSITION_ACTIVE__) return;
  window.__PORTAL_TRANSITION_ACTIVE__ = true;

  const DEFAULTS = {
    duration: 920,
    fadeDuration: 620,
    zoomScale: 1.85,
    blur: 14,
    brightness: 2.4,
  };

  function normalizeUrl(url) {
    if (!url) return null;
    return String(url).trim();
  }

  function isUsableElement(el) {
    if (!el || !el.getBoundingClientRect) return false;

    const rect = el.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return false;
    if (rect.bottom < 0) return false;
    if (rect.top > window.innerHeight) return false;
    if (rect.right < 0) return false;
    if (rect.left > window.innerWidth) return false;

    return true;
  }

  function makeBlackFlash() {
    const flash = document.createElement("div");

    flash.className = "portal-black-flash";
    flash.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:999998",
      "background:#000",
      "opacity:0",
      "pointer-events:none",
      "transition:opacity 420ms ease",
    ].join(";");

    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = "1";
    });

    return flash;
  }

  function navigateAfter(url, delay) {
    setTimeout(() => {
      window.location.href = url;
    }, delay);
  }

  function pageFadeNavigate(url) {
    makeBlackFlash();
    navigateAfter(url, DEFAULTS.fadeDuration);
  }

  function createCloneFromElement(el) {
    const rect = el.getBoundingClientRect();
    const clone = el.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.zIndex = "999999";
    clone.style.pointerEvents = "none";
    clone.style.margin = "0";
    clone.style.transformOrigin = "center center";
    clone.style.transition =
      "transform 900ms cubic-bezier(.16,1,.3,1), " +
      "opacity 900ms ease, " +
      "filter 900ms ease";

    clone.style.willChange = "transform, opacity, filter";

    return { clone, rect };
  }

  function createCloneFromImage(el, imageSrc, className) {
    const rect = el.getBoundingClientRect();
    const clone = document.createElement("img");

    clone.src = imageSrc;
    clone.alt = "";
    clone.className = className || "portal-image-clone";

    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.objectFit = "contain";
    clone.style.zIndex = "999999";
    clone.style.pointerEvents = "none";
    clone.style.margin = "0";
    clone.style.transformOrigin = "center center";
    clone.style.opacity = "0";
    clone.style.filter = "drop-shadow(0 0 24px rgba(212,175,55,0.45))";
    clone.style.transition =
      "transform 940ms cubic-bezier(.16,1,.3,1), " +
      "opacity 940ms ease, " +
      "filter 940ms ease";

    clone.style.willChange = "transform, opacity, filter";

    return { clone, rect };
  }

  function zoomCloneToScreen(clone, rect, options) {
    const scale =
      Math.max(
        window.innerWidth / Math.max(rect.width, 1),
        window.innerHeight / Math.max(rect.height, 1),
      ) * (options.zoomScale || DEFAULTS.zoomScale);

    const moveX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const moveY = window.innerHeight / 2 - (rect.top + rect.height / 2);

    clone.getBoundingClientRect();

    clone.style.transform =
      "translate(" + moveX + "px," + moveY + "px) scale(" + scale + ")";

    clone.style.opacity = options.finalOpacity ?? "0";
    clone.style.filter =
      "blur(" +
      (options.blur ?? DEFAULTS.blur) +
      "px) brightness(" +
      (options.brightness ?? DEFAULTS.brightness) +
      ")";
  }

  function textZoom(url, el, options) {
    if (!isUsableElement(el)) {
      pageFadeNavigate(url);
      return;
    }

    const { clone, rect } = createCloneFromElement(el);

    clone.classList.add("portal-text-clone");
    clone.style.textShadow =
      "0 0 18px rgba(212,175,55,0.45), 0 0 42px rgba(212,175,55,0.18)";

    document.body.appendChild(clone);

    setTimeout(() => {
      makeBlackFlash();
    }, 500);

    requestAnimationFrame(() => {
      zoomCloneToScreen(clone, rect, {
        zoomScale: 1.85,
        blur: 14,
        brightness: 2.4,
        finalOpacity: "0",
      });
    });

    navigateAfter(url, options.duration || DEFAULTS.duration);
  }

  function runeZoom(url, el, options) {
    if (!isUsableElement(el)) {
      pageFadeNavigate(url);
      return;
    }

    if (!options.image) {
      textZoom(url, el, options);
      return;
    }

    const { clone, rect } = createCloneFromImage(
      el,
      options.image,
      "portal-rune-clone",
    );

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.opacity = "1";
      clone.style.filter =
        "drop-shadow(0 0 30px rgba(212,175,55,0.75)) brightness(1.4)";
    });

    setTimeout(() => {
      makeBlackFlash();
    }, 520);

    setTimeout(() => {
      zoomCloneToScreen(clone, rect, {
        zoomScale: 2.15,
        blur: 12,
        brightness: 2.8,
        finalOpacity: "0",
      });
    }, 80);

    navigateAfter(url, options.duration || 980);
  }

  function sealZoom(url, el, options) {
    if (!isUsableElement(el) && !options.image) {
      pageFadeNavigate(url);
      return;
    }

    let cloneData;

    if (options.image && isUsableElement(el)) {
      cloneData = createCloneFromImage(el, options.image, "portal-seal-clone");
    } else if (options.image) {
      const fake = document.createElement("div");
      fake.style.position = "fixed";
      fake.style.left = "50%";
      fake.style.top = "50%";
      fake.style.width = "120px";
      fake.style.height = "120px";
      fake.style.transform = "translate(-50%, -50%)";
      document.body.appendChild(fake);

      cloneData = createCloneFromImage(
        fake,
        options.image,
        "portal-seal-clone",
      );
      fake.remove();
    } else {
      cloneData = createCloneFromElement(el);
    }

    const { clone, rect } = cloneData;

    clone.style.opacity = "0";
    clone.style.filter =
      "drop-shadow(0 0 34px rgba(212,175,55,0.6)) brightness(1.35)";

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.opacity = "1";
    });

    setTimeout(() => {
      makeBlackFlash();
    }, 430);

    setTimeout(() => {
      zoomCloneToScreen(clone, rect, {
        zoomScale: 2.45,
        blur: 10,
        brightness: 3,
        finalOpacity: "0",
      });
    }, 70);

    navigateAfter(url, options.duration || 880);
  }

  window.portalNavigate = function (url, sourceElement, options) {
    const destination = normalizeUrl(url);
    if (!destination) return;

    const opts = options || {};
    const type = opts.type || "text";

    if (type === "rune") {
      runeZoom(destination, sourceElement, opts);
      return;
    }

    if (type === "seal" || type === "icon") {
      sealZoom(destination, sourceElement, opts);
      return;
    }

    if (type === "fade") {
      pageFadeNavigate(destination);
      return;
    }

    textZoom(destination, sourceElement, opts);
  };

  window.portalTransition = function (event, destination, imageSrc) {
    if (event && event.preventDefault) event.preventDefault();

    window.portalNavigate(destination, event ? event.currentTarget : null, {
      type: imageSrc ? "seal" : "fade",
      image: imageSrc || null,
    });
  };

  window.crtNavigate = function (destination, sourceElement) {
    window.portalNavigate(destination, sourceElement, { type: "text" });
  };
})();
