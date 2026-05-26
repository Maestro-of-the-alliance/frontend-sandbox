/**
 * randanime_preamble.js
 * N.C.E.ncyclopedia — THE PREAMBLE
 * Subtle mechanical archive effects for the microfiche reader skin.
 *
 * Effects:
 *   1. Focus drift        — document goes slightly soft then refocuses
 *   2. Projector flicker  — lamp warmth fluctuation, uneven breathing
 *   3. Caption cycling    — machine-pause text rotates through archival phrases
 *   4. Light passage      — whole viewer dims briefly, like someone walked past
 *   5. Status dim         — amber dot dims, machine processing
 *   6. Hair in gate       — already there on load. sits. drifts. eventually
 *                           the invisible projectionist gets annoyed and pulls it.
 *                           snap. gone. may come back later.
 *   7. Lamp warmth        — slow amber temperature shift, bulb aging
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
  function fireProjectorFlicker() {
    const doc = document.querySelector(".fiche-document");
    if (!doc) return;

    const type = Math.random();

    if (type < 0.45) {
      const flickers = Math.floor(Math.random() * 2) + 1;
      let delay = 0;
      for (let i = 0; i < flickers; i++) {
        const fd = delay + Math.random() * 60;
        const dur = 35 + Math.random() * 55;
        const dim = 0.8 + Math.random() * 0.12;
        setTimeout(() => {
          doc.style.transition = `filter ${dur}ms ease`;
          doc.style.filter = `sepia(0.16) contrast(1.02) brightness(${dim}) blur(0)`;
        }, fd);
        setTimeout(() => {
          doc.style.transition = `filter ${dur * 1.6}ms ease`;
          doc.style.filter =
            "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
        }, fd + dur);
        delay += dur * 2 + 60;
      }
    } else {
      const riseTime = 1800 + Math.random() * 1200;
      const holdTime = 400 + Math.random() * 600;
      const fallTime = 2200 + Math.random() * 1400;
      const peak = 1.06 + Math.random() * 0.05;
      doc.style.transition = `filter ${riseTime}ms ease-in`;
      doc.style.filter = `sepia(0.18) contrast(1.08) brightness(${peak}) blur(0)`;
      setTimeout(() => {
        doc.style.transition = `filter ${fallTime}ms ease-out`;
        doc.style.filter =
          "sepia(0.12) contrast(1.04) brightness(1.02) blur(0)";
      }, riseTime + holdTime);
    }
  }

  function scheduleProjectorFlicker() {
    const delay = 30000 + Math.random() * 40000;
    setTimeout(() => {
      fireProjectorFlicker();
      scheduleProjectorFlicker();
    }, delay);
  }

  // ── LAMP WARMTH SHIFT ────────────────────────────────────────
  function fireLampWarmth() {
    const housing = document.querySelector(".viewer-housing");
    if (!housing) return;
    const warmth = 0.015 + Math.random() * 0.02;
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
    setTimeout(
      () => {
        dot.style.transition = "opacity 3s ease";
        dot.style.opacity = "";
      },
      2200 + Math.random() * 1800,
    );
  }

  function scheduleStatusDim() {
    const delay = 30000 + Math.random() * 40000;
    setTimeout(() => {
      fireStatusDim();
      scheduleStatusDim();
    }, delay);
  }

  // ── HAIR IN THE GATE ─────────────────────────────────────────
  // Already there when you arrive. Has been there a while probably.
  // The invisible projectionist lets it go — maybe doesn't notice,
  // maybe doesn't care yet. It drifts. It stays.
  // Then at some point they just reach in and pull it.
  // Snap. Gone. May come back on the next reel.

  function generateHairPath(vw, vh) {
    const ax = 0.05 + Math.random() * 0.9;
    const ay = 0.05 + Math.random() * 0.9;

    const length = 0.06 + Math.random() * 0.22;
    const curl = (Math.random() - 0.5) * 0.16;
    const angle = Math.random() * Math.PI * 2;

    const x1 = ax * vw;
    const y1 = ay * vh;
    const x2 = x1 + Math.cos(angle) * length * vw;
    const y2 = y1 + Math.sin(angle) * length * vw;

    const mx = (x1 + x2) / 2 + Math.cos(angle + Math.PI / 2) * curl * vw;
    const my = (y1 + y2) / 2 + Math.sin(angle + Math.PI / 2) * curl * vw;

    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  }

  function spawnHair() {
    const mount =
      document.querySelector(".fiche-document") ||
      document.querySelector(".projection-window") ||
      document.body;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 30;
      overflow: visible;
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
    mount.appendChild(svg);

    const rect = mount.getBoundingClientRect();
    const vw = rect.width || window.innerWidth;
    const vh = rect.height || window.innerHeight;

    const thickness = 0.8 + Math.random() * 1.8;
    const opacity = 0.5 + Math.random() * 0.36;
    const color =
      Math.random() < 0.72
        ? `rgba(6,4,2,${opacity})`
        : `rgba(155,115,45,${opacity * 0.65})`;

    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", thickness.toString());
    path.setAttribute("d", generateHairPath(vw, vh));

    // No fade-in. It's just there.
    svg.style.opacity = "1";

    // Sit and drift — barely moving, it's caught
    // Patience of the projectionist: 20–90 seconds before they deal with it
    const holdDuration = 20000 + Math.random() * 70000;
    let driftCount = 0;
    const maxDrifts = Math.floor(holdDuration / 3000);

    const driftInterval = setInterval(
      () => {
        driftCount++;
        if (driftCount > maxDrifts) {
          clearInterval(driftInterval);
          return;
        }
        const ox = (Math.random() - 0.5) * 6;
        const oy = (Math.random() - 0.5) * 5;
        svg.style.transition = "transform 2.8s ease";
        svg.style.transform = `translate(${ox}px, ${oy}px)`;
      },
      2800 + Math.random() * 1200,
    );

    // THE PULL.
    // Projectionist finally reaches in. Snaps it out.
    // Direction is random — toward whatever edge is closest to the hair,
    // biased outward like a real pull would go.
    setTimeout(() => {
      clearInterval(driftInterval);

      const pullAngle = Math.random() * Math.PI * 2;
      const pullDist = 60 + Math.random() * 100;
      const pullX = Math.cos(pullAngle) * pullDist;
      const pullY = Math.sin(pullAngle) * pullDist;

      // Opacity dies in 80ms. Transform in 100ms. Gone.
      svg.style.transition = "opacity 80ms linear, transform 100ms ease-in";
      svg.style.opacity = "0";
      svg.style.transform = `translate(${pullX}px, ${pullY}px)`;

      setTimeout(() => {
        if (svg.parentNode) svg.parentNode.removeChild(svg);
      }, 200);

      // Schedule the next one — may come back, may not for a while
      scheduleNextHair();
    }, holdDuration);

    return svg;
  }

  function scheduleNextHair() {
    // Next hair: 2–8 minutes later. The gate is clear for a while.
    const delay = 120000 + Math.random() * 360000;
    setTimeout(spawnHair, delay);
  }

  function initHair() {
    // Spawn immediately on load — already there
    spawnHair();
  }

  // ── DEV / PREVIEW MODE ───────────────────────────────────────
  // Add ?preview=1 to URL to test with accelerated timing.
  function checkPreviewMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "1") {
      // Override spawnHair hold duration for preview — pull after 4s
      const mount =
        document.querySelector(".fiche-document") ||
        document.querySelector(".projection-window") ||
        document.body;

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:30;overflow:visible;`;
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
      mount.appendChild(svg);

      const rect = mount.getBoundingClientRect();
      const vw = rect.width || window.innerWidth;
      const vh = rect.height || window.innerHeight;

      path.setAttribute("stroke", "rgba(6,4,2,0.75)");
      path.setAttribute("stroke-width", "1.4");
      path.setAttribute("d", generateHairPath(vw, vh));
      svg.style.opacity = "1";

      // Pull after 4 seconds in preview
      setTimeout(() => {
        const pullAngle = Math.random() * Math.PI * 2;
        svg.style.transition = "opacity 80ms linear, transform 100ms ease-in";
        svg.style.opacity = "0";
        svg.style.transform = `translate(${Math.cos(pullAngle) * 80}px, ${Math.sin(pullAngle) * 80}px)`;
        setTimeout(() => {
          if (svg.parentNode) svg.parentNode.removeChild(svg);
        }, 200);
      }, 4000);

      // Fire a flicker too
      setTimeout(() => fireProjectorFlicker(), 6000);
    }
  }

  // ── INIT ─────────────────────────────────────────────────────
  function init() {
    checkPreviewMode();

    // Hair — already there on load (skipped in preview mode, preview has its own)
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "1") {
      initHair();
    }

    setTimeout(scheduleCaptionCycle, 20000 + Math.random() * 15000);
    setTimeout(scheduleFocusDrift, 30000 + Math.random() * 20000);
    setTimeout(scheduleProjectorFlicker, 20000 + Math.random() * 25000);
    setTimeout(scheduleLightPassage, 70000 + Math.random() * 30000);
    setTimeout(scheduleStatusDim, 35000 + Math.random() * 20000);
    setTimeout(scheduleLampWarmth, 50000 + Math.random() * 40000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
