/* ============================================================
   PORTAL TRANSITION — THE ALLIANCE FOR THE FUTURE
   Clean Cinematic Version
   SAM · May 2026
============================================================ */

(function () {
  // ─────────────────────────────────────────────
  // PORTAL NAVIGATION
  // Clicked word becomes the doorway.
  // ─────────────────────────────────────────────

  window.portalNavigate = function (url, el) {
    if (!url) return;

    // Fallback navigation
    if (!el) {
      window.location.href = url;
      return;
    }

    // Get clicked element position
    var rect = el.getBoundingClientRect();

    // Clone clicked element
    var clone = el.cloneNode(true);

    // Apply cinematic overlay styling
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

    // Force browser reflow
    clone.getBoundingClientRect();

    // Calculate screen-filling scale
    var scale =
      Math.max(
        window.innerWidth / Math.max(rect.width, 1),
        window.innerHeight / Math.max(rect.height, 1),
      ) * 1.8;

    // Move element to center
    var moveX = window.innerWidth / 2 - (rect.left + rect.width / 2);

    var moveY = window.innerHeight / 2 - (rect.top + rect.height / 2);

    // Animate
    clone.style.transform =
      "translate(" + moveX + "px," + moveY + "px) " + "scale(" + scale + ")";

    clone.style.opacity = "0";

    clone.style.filter = "blur(14px) brightness(2.4)";

    // Navigate after animation
    setTimeout(function () {
      window.location.href = url;
    }, 920);
  };

  // ─────────────────────────────────────────────
  // NAV WHEEL COMPATIBILITY
  // ─────────────────────────────────────────────

  window.crtNavigate = function (destination, sourceElement) {
    portalNavigate(destination, sourceElement);
  };

  // ─────────────────────────────────────────────
  // AUTO-INTERCEPT INTERNAL LINKS
  // ─────────────────────────────────────────────

  document.addEventListener(
    "click",
    function (e) {
      var el = e.target.closest("a[href]");

      if (!el) return;

      var href = el.getAttribute("href");

      if (!href) return;

      // Ignore external links
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("#")
      ) {
        return;
      }

      // Ignore links with explicit onclick
      if (el.getAttribute("onclick")) return;

      e.preventDefault();

      portalNavigate(href, el);
    },
    true,
  );
})();
