/**
 * fiche-advance-nav.js
 * N.C.E.ncyclopedia — THE PREAMBLE
 *
 * Wires the preamble nav buttons to play the fiche card advance sound
 * before navigating. The machine does its thing. Then the next frame loads.
 *
 * Usage: drop this script tag at the bottom of prologue.html,
 * the_difference.html, and charter.html — after the existing scripts.
 *
 *   <script src="/fiche-advance-nav.js"></script>
 *
 * The buttons need data-dest attributes pointing to their destinations:
 *
 *   <button class="preamble-next" data-dest="/preamble/the_difference.html">
 *   <button class="preamble-next" data-dest="/preamble/charter.html">
 *   <button class="preamble-next" data-dest="/landing">
 *
 * The skip-all buttons navigate immediately — no sound, no ceremony.
 * You're skipping. The machine doesn't care.
 */

(function () {
  "use strict";

  const AUDIO_SRC = "/audio/fiche-advance.wav";
  const MAX_WAIT  = 4000; // failsafe — navigate after 4s even if audio stalls

  // Preload so there's no delay on first click
  const audio = new Audio(AUDIO_SRC);
  audio.preload = "auto";
  audio.volume  = 0.82;

  function navigateWithSound(dest) {
    // Don't double-fire
    if (navigateWithSound._firing) return;
    navigateWithSound._firing = true;

    // Visual feedback — dim the button slightly, machine is working
    const btn = document.querySelector(".preamble-next");
    if (btn) {
      btn.style.transition = "opacity 0.15s ease";
      btn.style.opacity    = "0.4";
      btn.style.pointerEvents = "none";
    }

    // Failsafe timeout — if audio fails for any reason, navigate anyway
    const fallback = setTimeout(() => {
      window.location.href = dest;
    }, MAX_WAIT);

    // Reset and play
    audio.currentTime = 0;

    audio.addEventListener("ended", function onEnded() {
      clearTimeout(fallback);
      audio.removeEventListener("ended", onEnded);
      window.location.href = dest;
    }, { once: true });

    audio.play().catch(() => {
      // Autoplay blocked or file missing — just navigate
      clearTimeout(fallback);
      window.location.href = dest;
    });
  }

  // Wire up on DOM ready
  // Handles both .preamble-next buttons and .open-file-btn anchors
  function init() {
    const triggers = document.querySelectorAll(".preamble-next, .open-file-btn");
    triggers.forEach((el) => {
      const dest = el.getAttribute("data-dest") || el.getAttribute("href");
      if (!dest || dest === "#") return;

      // Kill existing navigation
      el.removeAttribute("onclick");
      if (el.tagName === "A") {
        el.setAttribute("href", "#");
      }

      el.addEventListener("click", (e) => {
        e.preventDefault();
        navigateWithSound(dest);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
