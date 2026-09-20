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

  // Portrait is decided from the real viewport shape plus the media
  // query. Both must say portrait, so a phone that reports one signal
  // late (or wrongly) can't strand a visitor behind the gate.
  function isPortraitPhone() {
    var narrow = Math.min(window.innerWidth, window.innerHeight) <= PHONE_WIDTH_MAX;
    if (!narrow) return false;
    var mq = window.matchMedia("(orientation: portrait)").matches;
    var shape = window.innerHeight > window.innerWidth;
    return mq && shape;
  }

  var syncRef = function () {};

  // The real fix for "turning my phone doesn't register": don't wait for
  // the phone. On tap, go fullscreen (required on Android Chrome) and ask
  // the browser to lock the screen to landscape. Resolves true on success.
  function goLandscape() {
    var el = document.documentElement;
    var fs = Promise.resolve();
    try {
      if (!document.fullscreenElement && el.requestFullscreen) {
        fs = el.requestFullscreen({ navigationUI: "hide" });
      }
    } catch (e) {}
    return Promise.resolve(fs).catch(function () {}).then(function () {
      if (!(screen.orientation && screen.orientation.lock)) {
        return Promise.reject(new Error("orientation lock unsupported"));
      }
      return screen.orientation.lock("landscape");
    }).then(function () {
      return true;
    });
  }

  // Let go of the lock when leaving, so the next page (papatour is
  // portrait) isn't held sideways.
  function releaseLock() {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
    try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen(); } catch (e) {}
  }
  window.addEventListener("pagehide", releaseLock);

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

    var note = document.createElement("div");
    note.id = "orientation-gate-note";
    note.style.cssText = [
      "margin-top:16px", "font-size:0.75rem", "letter-spacing:0.06em",
      "line-height:1.6", "max-width:300px", "min-height:1.2em",
      "color:#ffb4a0"
    ].join(";");

    // Primary action: actually put the phone in landscape and hold it.
    var lockBtn = document.createElement("button");
    lockBtn.type = "button";
    lockBtn.textContent = "Rotate for me";
    lockBtn.style.cssText = [
      "margin-top:28px", "background:rgba(0,229,255,0.16)",
      "border:1.5px solid #00e5ff", "color:#00e5ff",
      "font-family:'Courier New',monospace", "font-size:0.9rem",
      "letter-spacing:0.12em", "text-transform:uppercase",
      "padding:12px 22px", "border-radius:3px", "cursor:pointer",
      "box-shadow:0 0 12px rgba(0,229,255,0.5)"
    ].join(";");
    lockBtn.addEventListener("click", function () {
      note.textContent = "";
      goLandscape().then(function () {
        // The lock takes a beat to change the viewport; re-check after.
        setTimeout(syncRef, 250);
        setTimeout(function () {
          if (overlay && isPortraitPhone()) {
            note.textContent = "Your phone didn't rotate. Turn it sideways by hand, or tap Continue anyway.";
          }
        }, 1500);
      }).catch(function () {
        note.textContent = "This browser won't rotate for us. Turn your phone sideways by hand, or tap Continue anyway.";
      });
    });

    // Manual override -- some devices/browsers misreport orientation
    // (split-screen, certain in-app browsers, etc.), which would
    // otherwise strand a visitor who is already in landscape behind a
    // gate that never dismisses itself. This removes the overlay
    // unconditionally and doesn't reappear for the rest of the page's
    // life. Kept as the quiet second choice.
    var overrideBtn = document.createElement("button");
    overrideBtn.type = "button";
    overrideBtn.textContent = "Continue anyway";
    overrideBtn.style.cssText = [
      "margin-top:18px", "background:transparent",
      "border:1px solid rgba(0,229,255,0.45)", "color:rgba(0,229,255,0.7)",
      "font-family:'Courier New',monospace", "font-size:0.7rem",
      "letter-spacing:0.12em", "text-transform:uppercase",
      "padding:8px 14px", "border-radius:3px", "cursor:pointer"
    ].join(";");
    overrideBtn.addEventListener("click", function () {
      dismissedManually = true;
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
    });

    var style = document.createElement("style");
    style.textContent =
      "@keyframes orientationGateRotate {" +
      "0%,100%{transform:rotate(0deg);}" +
      "45%{transform:rotate(-90deg);}" +
      "55%{transform:rotate(-90deg);}" +
      "}";

    overlay.appendChild(icon);
    overlay.appendChild(msg);
    overlay.appendChild(lockBtn);
    overlay.appendChild(note);
    overlay.appendChild(overrideBtn);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    return overlay;
  }

  var dismissedManually = false;

  function init() {
    var overlay = null;

    function sync() {
      if (dismissedManually) return;
      var shouldShow = isPortraitPhone();
      if (shouldShow && !overlay) {
        overlay = buildOverlay();
      } else if (!shouldShow && overlay) {
        overlay.remove();
        overlay = null;
      }
    }

    syncRef = sync;
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    try {
      if (screen.orientation && screen.orientation.addEventListener) {
        screen.orientation.addEventListener("change", sync);
      }
    } catch (e) {}
    // Belt and suspenders: some phones fire none of the events above
    // when rotated, so also re-check on a slow timer.
    setInterval(sync, 700);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
