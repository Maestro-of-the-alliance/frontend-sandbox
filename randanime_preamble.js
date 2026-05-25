/**
 * randanime_preamble.js
 * N.C.E.ncyclopedia — THE PREAMBLE
 * Subtle mechanical archive effects for the microfiche reader skin.
 *
 * Effects:
 *   1. Focus drift      — document goes slightly soft then refocuses
 *   2. Projector flicker — lamp warmth fluctuation, uneven breathing
 *   3. Caption cycling  — machine-pause text rotates through archival phrases
 *   4. Light passage    — whole viewer dims briefly, like someone walked past
 *   5. Status dim       — amber dot dims, machine processing
 *   6. Hair in gate     — filament caught between film and aperture, drifts, clears
 *   7. Lamp warmth      — slow amber temperature shift, bulb aging
 *
 * Philosophy: the machine is alive but old.
 * Nothing fast. Nothing aggressive. The machine breathes.
 */

(function () {
  "use strict";

  // ── ARCHIVAL RETRIEVAL CAPTIONS ──────────────────────────────
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
      el.style.transition = "opacity 1.8s ease";
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = next;
        el.style.opacity = "1";
      }, 1900);
    });
  }

  function scheduleCaptionCycle() {
    const delay = 18000 + Math.random() * 14000;
    setTimeout(() => {
      cycleCaptions();
      scheduleCaptionCycle();
    }, delay);
  }

  // ── FOCUS DRIFT ──────────────────────────────────────────────
  function fireFocusDrift() {
    const doc = document.querySelector(".fiche-document");
    if (!doc) return;
    const intensity = 0.3 + Math.random() * 0.4;
    const duration = 3000 + Math.random() * 4000;
    doc.style.transition = `filter ${duration * 0.4}ms ease`;
    doc.style.filter = `sepia(0.14) contrast(1.06) brightness(1.03) blur(${intensity}px)`;
    setTimeout(() => {
      doc.style.transition = `filter ${duration * 0.6}ms ease`;
      doc.style.filter = "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
    }, duration * 0.4);
  }

  function scheduleFocusDrift() {
    const delay = 25000 + Math.random() * 35000;
    setTimeout(() => {
      fireFocusDrift();
      scheduleFocusDrift();
    }, delay);
  }

  // ── PROJECTOR FLICKER ────────────────────────────────────────
  // Uneven lamp breathing — warmth fluctuation, not glitch.
  // The bulb isn't failing; it's just old.
  function fireProjectorFlicker() {
    const win = document.querySelector(".projection-window");
    const doc = document.querySelector(".fiche-document");
    if (!win || !doc) return;

    // 1–3 flickers in a cluster, sometimes with a slow swell between
    const type = Math.random();

    if (type < 0.45) {
      // Quick double-blink — lamp contact
      const flickers = Math.floor(Math.random() * 2) + 1;
      let delay = 0;
      for (let i = 0; i < flickers; i++) {
        const fd = delay + Math.random() * 60;
        const dur = 35 + Math.random() * 55;
        const dim = 0.80 + Math.random() * 0.12;
        setTimeout(() => {
          doc.style.transition = `filter ${dur}ms ease`;
          doc.style.filter = `sepia(0.16) contrast(1.02) brightness(${dim}) blur(0)`;
        }, fd);
        setTimeout(() => {
          doc.style.transition = `filter ${dur * 1.6}ms ease`;
          doc.style.filter = "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
        }, fd + dur);
        delay += dur * 2 + 60;
      }
    } else {
      // Slow warmth swell — bulb getting brighter then settling
      const riseTime = 1800 + Math.random() * 1200;
      const holdTime = 400 + Math.random() * 600;
      const fallTime = 2200 + Math.random() * 1400;
      const peak = 1.06 + Math.random() * 0.05;

      doc.style.transition = `filter ${riseTime}ms ease-in`;
      doc.style.filter = `sepia(0.18) contrast(1.08) brightness(${peak}) blur(0)`;

      setTimeout(() => {
        doc.style.transition = `filter ${fallTime}ms ease-out`;
        doc.style.filter = "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
      }, riseTime + holdTime);
    }
  }

  function scheduleProjectorFlicker() {
    // Every 30–70 seconds — more frequent than before, feels alive
    const delay = 30000 + Math.random() * 40000;
    setTimeout(() => {
      fireProjectorFlicker();
      scheduleProjectorFlicker();
    }, delay);
  }

  // ── LAMP WARMTH SHIFT ────────────────────────────────────────
  // Very slow amber temperature drift on the whole housing.
  // Like the bulb running hotter as it ages during the session.
  function fireLampWarmth() {
    const housing = document.querySelector(".viewer-housing");
    if (!housing) return;

    const warmth = 0.015 + Math.random() * 0.02; // subtle amber tint
    const duration = 8000 + Math.random() * 6000;

    housing.style.transition = `box-shadow ${duration}ms ease`;
    housing.style.boxShadow = `
      0 26px 80px rgba(0,0,0,0.78),
      inset 0 1px 0 rgba(255,255,255,0.06),
      inset 0 -1px 0 rgba(0,0,0,0.8),
      inset 0 0 120px rgba(255,200,80,${warmth})
    `;

    setTimeout(() => {
      housing.style.transition = `box-shadow ${duration * 1.4}ms ease`;
      housing.style.boxShadow = `
        0 26px 80px rgba(0,0,0,0.78),
        inset 0 1px 0 rgba(255,255,255,0.06),
        inset 0 -1px 0 rgba(0,0,0,0.8)
      `;
    }, duration);
  }

  function scheduleLampWarmth() {
    const delay = 40000 + Math.random() * 50000;
    setTimeout(() => {
      fireLampWarmth();
      scheduleLampWarmth();
    }, delay);
  }

  // ── LIGHT PASSAGE ────────────────────────────────────────────
  function fireLightPassage() {
    const housing = document.querySelector(".viewer-housing");
    if (!housing) return;
    const dim = 0.88 + Math.random() * 0.06;
    const duration = 4000 + Math.random() * 3000;
    housing.style.transition = `opacity ${duration * 0.35}ms ease`;
    housing.style.opacity = dim.toString();
    setTimeout(() => {
      housing.style.transition = `opacity ${duration * 0.65}ms ease`;
      housing.style.opacity = "1";
    }, duration * 0.35);
  }

  function scheduleLightPassage() {
    const delay = 60000 + Math.random() * 60000;
    setTimeout(() => {
      fireLightPassage();
      scheduleLightPassage();
    }, delay);
  }

  // ── STATUS DOT DIM ───────────────────────────────────────────
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

  // ── HAIR IN THE GATE ─────────────────────────────────────────
  // A filament — hair or dust — caught between the film and the
  // aperture plate. It sits there. It drifts almost imperceptibly.
  // Then it clears. You know the one.
  //
  // Implemented as an absolutely-positioned SVG overlay on the
  // projection-window. The hair is a dark, slightly translucent
  // curved path. It enters from a random position, breathes,
  // then fades out.

  let hairEl = null;

  function buildHairElement() {
    if (hairEl) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 25;
      opacity: 0;
      transition: opacity 1.2s ease;
      border-radius: inherit;
      overflow: visible;
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);

    hairEl = { svg, path };
  }

  function generateHairPath(vw, vh) {
    // Random anchor point — usually near center-ish, slightly off
    const ax = 0.2 + Math.random() * 0.6; // 20–80% across
    const ay = 0.15 + Math.random() * 0.7; // 15–85% down

    // Hair length in viewport-relative units
    const length = 0.08 + Math.random() * 0.18; // 8–26% of width

    // Curvature — how much it bends
    const curl = (Math.random() - 0.5) * 0.12;

    // Rotation angle
    const angle = Math.random() * Math.PI * 2;

    // Start and end points
    const x1 = ax * vw;
    const y1 = ay * vh;
    const x2 = x1 + Math.cos(angle) * length * vw;
    const y2 = y1 + Math.sin(angle) * length * vw;

    // Control point for curve
    const mx = (x1 + x2) / 2 + Math.cos(angle + Math.PI / 2) * curl * vw;
    const my = (y1 + y2) / 2 + Math.sin(angle + Math.PI / 2) * curl * vw;

    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  }

  function fireHairInGate() {
    const win = document.querySelector(".projection-window");
    if (!win) return;

    buildHairElement();
    const { svg, path } = hairEl;

    // Remove and re-attach to get fresh dimensions
    if (svg.parentNode) svg.parentNode.removeChild(svg);
    win.appendChild(svg);

    const rect = win.getBoundingClientRect();
    const vw = rect.width;
    const vh = rect.height;

    // Hair appearance
    const thickness = 0.8 + Math.random() * 1.4; // px
    const opacity = 0.55 + Math.random() * 0.30;  // how dark
    const color = Math.random() < 0.7
      ? `rgba(8,6,3,${opacity})`         // dark hair
      : `rgba(180,140,60,${opacity * 0.6})`; // dust/lint, slightly amber

    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", thickness.toString());

    // Set initial path
    const initialPath = generateHairPath(vw, vh);
    path.setAttribute("d", initialPath);

    // Fade in
    svg.style.opacity = "0";
    svg.style.transition = "opacity 1.2s ease";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        svg.style.opacity = "1";
      });
    });

    // The hair breathes — drifts very slightly while present
    // (it's caught, not free — movement is minimal)
    const holdDuration = 4000 + Math.random() * 8000; // 4–12 seconds
    let driftInterval = null;

    let driftCount = 0;
    const maxDrifts = Math.floor(holdDuration / 2200);

    driftInterval = setInterval(() => {
      driftCount++;
      if (driftCount > maxDrifts) {
        clearInterval(driftInterval);
        return;
      }

      // Tiny shift — hair moves a few pixels at most
      const offsetX = (Math.random() - 0.5) * 4;
      const offsetY = (Math.random() - 0.5) * 3;

      svg.style.transition = `opacity 1.2s ease, transform 1.8s ease`;
      svg.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }, 2000 + Math.random() * 800);

    // Fade out after hold
    setTimeout(() => {
      clearInterval(driftInterval);
      svg.style.transition = "opacity 1.8s ease, transform 1.8s ease";
      svg.style.opacity = "0";
      svg.style.transform = "translate(0,0)";

      setTimeout(() => {
        if (svg.parentNode) svg.parentNode.removeChild(svg);
      }, 2000);
    }, holdDuration);
  }

  function scheduleHairInGate() {
    // Every 90–240 seconds — rare but memorable
    const delay = 90000 + Math.random() * 150000;
    setTimeout(() => {
      fireHairInGate();
      scheduleHairInGate();
    }, delay);
  }

  // ── DEV / PREVIEW MODE ───────────────────────────────────────
  // Add ?preview=1 to URL to fire hair immediately for testing.
  // Remove before shipping.
  function checkPreviewMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "1") {
      setTimeout(() => fireHairInGate(), 2000);
      setTimeout(() => fireProjectorFlicker(), 4000);
    }
  }

  // ── INIT ─────────────────────────────────────────────────────
  function init() {
    checkPreviewMode();

    // Captions — first cycle after reader settles
    setTimeout(scheduleCaptionCycle, 20000 + Math.random() * 15000);

    // Focus drift — after 30–50s
    setTimeout(scheduleFocusDrift, 30000 + Math.random() * 20000);

    // Projector flicker — first at 20–45s (more frequent now)
    setTimeout(scheduleProjectorFlicker, 20000 + Math.random() * 25000);

    // Light passage — after 70–100s
    setTimeout(scheduleLightPassage, 70000 + Math.random() * 30000);

    // Status dim — after 35–55s
    setTimeout(scheduleStatusDim, 35000 + Math.random() * 20000);

    // Hair in gate — first at 90–180s, then every 90–240s
    setTimeout(scheduleHairInGate, 90000 + Math.random() * 90000);

    // Lamp warmth — first at 50–90s
    setTimeout(scheduleLampWarmth, 50000 + Math.random() * 40000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
