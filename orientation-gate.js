/* orientation-gate.js
   Shared portrait-lock overlay for widescreen-only immersive scenes
   (HOLOSPHERE, town panoramas, parallax tunnel sequences, etc).

   Opt-in only: include this script on any page that requires landscape,
   and it self-installs. Entry pages / canon-search / reading content
   should NOT include this file -- portrait is fine there.

   Usage: just drop this one line near the top of <body>, before your
   other scripts:
     <script src="/orientation-gate.js"></script>

   No configuration needed. Detects portrait via matchMedia, gated to
   phone-width viewports so narrow desktop windows don't false-trigger.
   Auto-dismisses on rotation, re-triggers if rotated back.
*/
(function () {
  "use strict";

  var PHONE_WIDTH_MAX = 900; // px -- narrow desktop windows won't trigger this

  function isPortraitPhone() {
    var portrait = window.matchMedia("(orientation: portrait)").matches;
    var narrow = window.innerWidth <= PHONE_WIDTH_MAX;
    return portrait && narrow;
  }

  function buildOverlay() {
    var overlay = document.createElement("div");
    overlay.id = "orientation-gate-overlay";
    overlay.setAttribute("role", "alert");
    overlay.style.cssText = [
      "position:fixed", "inset:0", "z-index:99999",
      "display:flex", "flex-direction:column",
      "align-items:center", "justify-content:center",
      "background:rgba(6,10,14,0.97)",
      "color:#00e5ff", "text-align:center",
      "font-family:'Courier New',monospace",
      "padding:32px", "box-sizing:border-box",
      "backdrop-filter:blur(3px)"
    ].join(";");

    var icon = document.createElement("div");
    icon.id = "orientation-gate-icon";
    icon.textContent = "\u{1F4F1}"; // 📱
    icon.style.cssText = [
      "font-size:3.2rem", "margin-bottom:18px",
      "animation:orientationGateRotate 1.8s ease-in-out infinite"
    ].join(";");

    var msg = document.createElement("div");
    msg.style.cssText = [
      "font-size:1rem", "letter-spacing:0.08em",
      "text-transform:uppercase", "line-height:1.7",
      "max-width:320px", "text-shadow:0 0 10px rgba(0,229,255,0.5)"
    ].join(";");
    msg.textContent = "This experience needs a bigger stage — turn your phone sideways.";

    var style = document.createElement("style");
    style.textContent =
      "@keyframes orientationGateRotate {" +
      "0%,100%{transform:rotate(0deg);}" +
      "45%{transform:rotate(-90deg);}" +
      "55%{transform:rotate(-90deg);}" +
      "}";

    overlay.appendChild(icon);
    overlay.appendChild(msg);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    return overlay;
  }

  function init() {
    var overlay = null;

    function sync() {
      var shouldShow = isPortraitPhone();
      if (shouldShow && !overlay) {
        overlay = buildOverlay();
      } else if (!shouldShow && overlay) {
        overlay.remove();
        overlay = null;
      }
    }

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
