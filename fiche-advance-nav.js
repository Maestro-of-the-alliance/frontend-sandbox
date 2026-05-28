(function () {
  "use strict";

  const AUDIO_SRC = "/audio/fiche-advance.wav";
  const MAX_WAIT = 4000;

  const audio = new Audio(AUDIO_SRC);
  audio.preload = "auto";
  audio.volume = 0.82;

  function navigateWithSound(dest, triggerEl) {
    if (navigateWithSound._firing) return;
    navigateWithSound._firing = true;

    if (triggerEl) {
      triggerEl.style.transition = "opacity 0.15s ease";
      triggerEl.style.opacity = "0.4";
      triggerEl.style.pointerEvents = "none";
    }

    const fallback = setTimeout(() => {
      window.location.href = dest;
    }, MAX_WAIT);

    audio.currentTime = 0;

    audio.addEventListener(
      "ended",
      function onEnded() {
        clearTimeout(fallback);
        audio.removeEventListener("ended", onEnded);
        window.location.href = dest;
      },
      { once: true },
    );

    audio.play().catch(() => {
      clearTimeout(fallback);
      window.location.href = dest;
    });
  }

  function init() {
    const triggers = document.querySelectorAll(
      ".preamble-next, .open-file-btn",
    );

    triggers.forEach((el) => {
      const dest = el.getAttribute("data-dest") || el.getAttribute("href");

      if (!dest || dest === "#") return;

      el.removeAttribute("onclick");

      if (el.tagName === "A") {
        el.setAttribute("href", "#");
      }

      el.addEventListener("click", (e) => {
        e.preventDefault();
        navigateWithSound(dest, el);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
