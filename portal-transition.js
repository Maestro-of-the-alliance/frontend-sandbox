/* ============================================================
   PORTAL TRANSITION — THE ALLIANCE FOR THE FUTURE
   Clean Cinematic Version
   SAM · May 2026 · Updated for TOC compatibility
============================================================ */

(function () {
  window.portalNavigate = function (url, el) {
    if (!url) return;

    // If no element passed OR element is off-screen — full page dissolve
    if (!el) {
      pageFadeNavigate(url);
      return;
    }

    var rect = el.getBoundingClientRect();

    // Element off-screen or zero size — full page dissolve
    if (
      (rect.width === 0 && rect.height === 0) ||
      rect.bottom < 0 ||
      rect.top > window.innerHeight
    ) {
      pageFadeNavigate(url);
      return;
    }

    // Element is visible — do the name zoom
    var clone = el.cloneNode(true);

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

    document.body.appendChild(clone);
    clone.getBoundingClientRect();

    var scale =
      Math.max(
        window.innerWidth / Math.max(rect.width, 1),
        window.innerHeight / Math.max(rect.height, 1),
      ) * 1.8;

    var moveX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    var moveY = window.innerHeight / 2 - (rect.top + rect.height / 2);

    clone.style.transform =
      "translate(" + moveX + "px," + moveY + "px) scale(" + scale + ")";
    clone.style.opacity = "0";
    clone.style.filter = "blur(14px) brightness(2.4)";

    setTimeout(function () {
      window.location.href = url;
    }, 920);
  };

  // Full page fade — used when no visible element to zoom from
  function pageFadeNavigate(url) {
    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;background:#000;z-index:999999;" +
      "opacity:0;transition:opacity 600ms ease;pointer-events:none;";
    document.body.appendChild(overlay);
    overlay.getBoundingClientRect();
    overlay.style.opacity = "1";
    setTimeout(function () {
      window.location.href = url;
    }, 620);
  }

  // NAV WHEEL COMPATIBILITY
  window.crtNavigate = function (destination, sourceElement) {
    portalNavigate(destination, sourceElement);
  };

  // AUTO-INTERCEPT INTERNAL LINKS
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target.closest("a[href]");
      if (!el) return;
      var href = el.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("#")
      )
        return;
      if (el.getAttribute("onclick")) return;
      e.preventDefault();
      portalNavigate(href, el);
    },
    true,
  );
})();
