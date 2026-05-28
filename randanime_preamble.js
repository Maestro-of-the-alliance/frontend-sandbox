(function () {
  "use strict";

  const gate = document.getElementById("gate");
  const ficheImg = document.querySelector(".fiche-img");

  if (!gate || !ficheImg) return;

  // ─────────────────────────────────────────────
  // RANDOM LAMP FLICKER
  // ─────────────────────────────────────────────

  function fireLampFlicker() {
    gate.classList.add("flickering");

    setTimeout(() => {
      gate.classList.remove("flickering");
    }, 650);

    scheduleLampFlicker();
  }

  function scheduleLampFlicker() {
    const delay = 25000 + Math.random() * 50000;
    setTimeout(fireLampFlicker, delay);
  }

  // ─────────────────────────────────────────────
  // RANDOM HAIR IN GATE
  // ─────────────────────────────────────────────

  function createHair() {
    const existing = document.querySelector(".dynamic-hair");
    if (existing) existing.remove();

    const hair = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    hair.classList.add("dynamic-hair");

    hair.setAttribute(
      "style",
      `
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      pointer-events:none;
      z-index:18;
      overflow:visible;
      opacity:0;
      transition:opacity 0.15s ease;
    `,
    );

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    const startX = 20 + Math.random() * 60;
    const midX = startX + (Math.random() - 0.5) * 30;
    const endX = startX + (Math.random() - 0.5) * 50;

    const d = `
      M ${startX} 0
      Q ${midX} 400 ${endX} 900
    `;

    path.setAttribute("d", d);

    path.setAttribute(
      "stroke",
      Math.random() > 0.7 ? "rgba(180,140,70,0.55)" : "rgba(20,16,10,0.75)",
    );

    path.setAttribute("stroke-width", 1 + Math.random());
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");

    hair.appendChild(path);

    gate.appendChild(hair);

    requestAnimationFrame(() => {
      hair.style.opacity = "1";
    });

    const visibleTime = 15000 + Math.random() * 60000;

    setTimeout(() => {
      const angle = Math.random() * Math.PI * 2;

      hair.style.transition = "opacity 80ms linear, transform 100ms ease-in";

      hair.style.opacity = "0";

      hair.style.transform = `
        translate(
          ${Math.cos(angle) * 80}px,
          ${Math.sin(angle) * 80}px
        )
      `;

      setTimeout(() => {
        hair.remove();
      }, 180);

      scheduleHair();
    }, visibleTime);
  }

  function scheduleHair() {
    const delay = 120000 + Math.random() * 240000;
    setTimeout(createHair, delay);
  }

  // ─────────────────────────────────────────────
  // SUBTLE EXPOSURE BREATHING
  // ─────────────────────────────────────────────

  function exposureBreath() {
    ficheImg.style.transition = "filter 4s ease";

    ficheImg.style.filter = `
      brightness(${0.96 + Math.random() * 0.08})
      contrast(${0.98 + Math.random() * 0.06})
    `;

    setTimeout(() => {
      ficheImg.style.transition = "filter 6s ease";

      ficheImg.style.filter = `
        brightness(1)
        contrast(1)
      `;
    }, 4000);

    scheduleExposureBreath();
  }

  function scheduleExposureBreath() {
    const delay = 18000 + Math.random() * 25000;
    setTimeout(exposureBreath, delay);
  }

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────

  scheduleLampFlicker();
  scheduleHair();
  scheduleExposureBreath();
})();
