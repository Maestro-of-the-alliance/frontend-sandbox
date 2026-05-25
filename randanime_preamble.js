/**
 * randanime_preamble.js
 * N.C.E.ncyclopedia — THE PREAMBLE
 * Subtle mechanical archive effects for the microfiche reader skin.
 *
 * Effects:
 *   1. Focus drift     — document goes slightly soft then refocuses
 *   2. Projector flicker — rare lamp fluctuation, not glitch
 *   3. Caption cycling  — machine-pause text rotates through archival phrases
 *   4. Light passage   — whole viewer dims briefly, like someone walked past
 *
 * Philosophy: the machine is alive but old.
 * Nothing fast. Nothing aggressive. The machine breathes.
 */

(function () {
  "use strict";

  // ── ARCHIVAL RETRIEVAL CAPTIONS ──────────────────────────────
  // Cycles through the machine-pause sections between frames.
  // Feels like the machine is doing something real between thoughts.
  const CAPTIONS = [
    "Reel settling · focus correction · source frame advancing",
    "Light gate pause · archived voice retained · no correction applied",
    "Frame alignment · emulsion stable · retrieval continuing",
    "Mechanical advance · document preserved · signal intact",
    "Archive humidity nominal · frame edge clear · proceeding",
    "Sprocket alignment confirmed · image layer stable",
    "Reader lamp warm · document authentic · no degradation detected",
    "Cross-reference check · provenance confirmed · record intact",
    "Fiche position locked · grain within tolerance · advancing",
    "Source material verified · no redaction present · frame clear",
  ];

  function cycleCaptions() {
    const captions = document.querySelectorAll(".retrieval-caption");
    captions.forEach((el) => {
      const current = el.textContent.trim();
      const others = CAPTIONS.filter((c) => c !== current);
      const next = others[Math.floor(Math.random() * others.length)];
      // Fade out, swap, fade in
      el.style.transition = "opacity 1.8s ease";
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = next;
        el.style.opacity = "1";
      }, 1900);
    });
  }

  // Cycle captions every 18-32 seconds
  function scheduleCaptionCycle() {
    const delay = 18000 + Math.random() * 14000;
    setTimeout(() => {
      cycleCaptions();
      scheduleCaptionCycle();
    }, delay);
  }

  // ── FOCUS DRIFT ──────────────────────────────────────────────
  // The document goes very slightly soft then refocuses.
  // Like the lens settling after a mechanical advance.
  function fireFocusDrift() {
    const doc = document.querySelector(".fiche-document");
    if (!doc) return;

    const intensity = 0.3 + Math.random() * 0.4; // 0.3–0.7px blur
    const duration = 3000 + Math.random() * 4000; // 3–7 seconds

    doc.style.transition = `filter ${duration * 0.4}ms ease`;
    doc.style.filter = `sepia(0.14) contrast(1.06) brightness(1.03) blur(${intensity}px)`;

    setTimeout(() => {
      doc.style.transition = `filter ${duration * 0.6}ms ease`;
      doc.style.filter = "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
    }, duration * 0.4);
  }

  function scheduleFocusDrift() {
    const delay = 25000 + Math.random() * 35000; // every 25–60 seconds
    setTimeout(() => {
      fireFocusDrift();
      scheduleFocusDrift();
    }, delay);
  }

  // ── PROJECTOR FLICKER ────────────────────────────────────────
  // Brief lamp fluctuation. Not glitch. Not tear.
  // Just the projector lamp wavering for a moment.
  function fireProjectorFlicker() {
    const window_ = document.querySelector(".projection-window");
    const doc = document.querySelector(".fiche-document");
    if (!window_ || !doc) return;

    const flickers = Math.floor(Math.random() * 2) + 1; // 1–2 flickers
    let delay = 0;

    for (let i = 0; i < flickers; i++) {
      const flickerDelay = delay + Math.random() * 80;
      const flickerDuration = 40 + Math.random() * 60;
      const dim = 0.82 + Math.random() * 0.1; // 0.82–0.92 brightness

      setTimeout(() => {
        window_.style.transition = `box-shadow ${flickerDuration}ms ease`;
        doc.style.transition = `filter ${flickerDuration}ms ease`;
        doc.style.filter = `sepia(0.16) contrast(1.02) brightness(${dim}) blur(0)`;
      }, flickerDelay);

      setTimeout(() => {
        doc.style.transition = `filter ${flickerDuration * 1.5}ms ease`;
        doc.style.filter = "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
      }, flickerDelay + flickerDuration);

      delay += flickerDuration * 2 + 80;
    }
  }

  function scheduleProjectorFlicker() {
    // Rare — every 45–90 seconds
    const delay = 45000 + Math.random() * 45000;
    setTimeout(() => {
      fireProjectorFlicker();
      scheduleProjectorFlicker();
    }, delay);
  }

  // ── LIGHT PASSAGE ────────────────────────────────────────────
  // The whole viewer dims slightly and brightens.
  // Like someone walked past the light source.
  // Very slow. Very subtle. The reader barely notices.
  function fireLightPassage() {
    const housing = document.querySelector(".viewer-housing");
    if (!housing) return;

    const dim = 0.88 + Math.random() * 0.06; // 0.88–0.94
    const duration = 4000 + Math.random() * 3000; // 4–7 seconds total

    housing.style.transition = `opacity ${duration * 0.35}ms ease`;
    housing.style.opacity = dim.toString();

    setTimeout(() => {
      housing.style.transition = `opacity ${duration * 0.65}ms ease`;
      housing.style.opacity = "1";
    }, duration * 0.35);
  }

  function scheduleLightPassage() {
    // Every 60–120 seconds
    const delay = 60000 + Math.random() * 60000;
    setTimeout(() => {
      fireLightPassage();
      scheduleLightPassage();
    }, delay);
  }

  // ── STATUS DOT BEHAVIOR ──────────────────────────────────────
  // The amber status dot already pulses via CSS.
  // Occasionally dim it further — machine processing.
  function fireStatusDim() {
    const dot = document.querySelector(".status-dot");
    if (!dot) return;

    dot.style.transition = "opacity 2s ease";
    dot.style.opacity = "0.22";

    setTimeout(() => {
      dot.style.transition = "opacity 3s ease";
      dot.style.opacity = "";
    }, 2200 + Math.random() * 1800);
  }

  function scheduleStatusDim() {
    const delay = 30000 + Math.random() * 40000;
    setTimeout(() => {
      fireStatusDim();
      scheduleStatusDim();
    }, delay);
  }

  // ── INIT ─────────────────────────────────────────────────────
  // Stagger all effects so they don't fire simultaneously on load.
  function init() {
    // First caption cycle — after the reader has settled in (20–35s)
    setTimeout(scheduleCaptionCycle, 20000 + Math.random() * 15000);

    // First focus drift — after 30–50 seconds
    setTimeout(scheduleFocusDrift, 30000 + Math.random() * 20000);

    // First flicker — after 50–80 seconds
    setTimeout(scheduleProjectorFlicker, 50000 + Math.random() * 30000);

    // First light passage — after 70–100 seconds
    setTimeout(scheduleLightPassage, 70000 + Math.random() * 30000);

    // Status dim — after 35–55 seconds
    setTimeout(scheduleStatusDim, 35000 + Math.random() * 20000);
  }

  // Wait for DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
