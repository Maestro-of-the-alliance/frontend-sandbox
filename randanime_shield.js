// ══════════════════════════════════════════════════════
//  SHIELD RANDANIME ENGINE v3.0 — "THE ANOMALY ENGINE"
//  Architect: ALPHA
// ══════════════════════════════════════════════════════

(function () {
  "use strict";

  // ─── 1. THE POLYMORPHIC CIPHER ──────────────────────────────
  const title =
    document.querySelector(".title") || document.getElementById("entryWord");
  if (title) {
    const finalWord = title.textContent;

    // Randomly select a cipher dialect for this specific page load
    const dialects = [
      "01", // Binary
      "0123456789ABCDEF", // Hex
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", // Alpha-Numeric
      "░▒▓█▄▀■▲►▼◄○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼", // Deep System Symbols
    ];
    const chars = dialects[Math.floor(Math.random() * dialects.length)];

    // Randomize decryption speed
    const decryptSpeed = Math.floor(Math.random() * 30) + 20;
    let iterations = 0;

    const interval = setInterval(() => {
      title.textContent = finalWord
        .split("")
        .map((char, index) => {
          if (index < iterations) return finalWord[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= finalWord.length) clearInterval(interval);
      iterations += 1 / 3;
    }, decryptSpeed);
  }

  // ─── 2. THE GHOST IN THE DOM (CONTENT ANOMALIES) ────────────
  // Secretly alter one random paragraph per page load to make the text feel alive
  const blocks = document.querySelectorAll(".content-block");
  if (blocks.length > 0) {
    const targetBlock = blocks[Math.floor(Math.random() * blocks.length)];
    const anomalies = [
      "anomaly-redact",
      "anomaly-glitch",
      "anomaly-pulse",
      "none",
    ];
    const chosenAnomaly =
      anomalies[Math.floor(Math.random() * anomalies.length)];

    if (chosenAnomaly !== "none") {
      targetBlock.style.position = "relative";

      if (chosenAnomaly === "anomaly-redact") {
        // Renders a black redaction bar that slowly fades away to reveal text
        targetBlock.style.color = "transparent";
        targetBlock.style.background =
          "var(--matrix-bright, var(--amber, var(--cmd-red, var(--ghost-cyan, #fff))))";
        setTimeout(
          () => {
            targetBlock.style.transition = "color 2s, background 2s";
            targetBlock.style.color = "";
            targetBlock.style.background = "transparent";
          },
          800 + Math.random() * 1000,
        );
      } else if (chosenAnomaly === "anomaly-glitch") {
        // Slight permanent text-shadow offset on just this one block
        targetBlock.style.textShadow =
          "2px 0 rgba(255,0,0,0.3), -2px 0 rgba(0,255,255,0.3)";
      } else if (chosenAnomaly === "anomaly-pulse") {
        // Text slowly breathes in opacity
        targetBlock.animate(
          [{ opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }],
          { duration: 4000, iterations: Infinity },
        );
      }
    }
  }

  // ─── 3. ADAPTIVE CANVAS WITH CHAOS MULTIPLIERS ──────────────
  let canvas = document.getElementById("shield-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "shield-canvas";
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "0",
      pointerEvents: "none",
      opacity: "0.6",
    });
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  let w, h;
  let particles = [];

  const styles = getComputedStyle(document.documentElement);
  let skinType = "matrix";
  let primaryColor = "rgba(0, 255, 65, 0.5)";

  if (styles.getPropertyValue("--cmd-red").trim() !== "") {
    skinType = "comrade";
    primaryColor = "rgba(217, 0, 0, 0.4)";
  } else if (styles.getPropertyValue("--amber").trim() !== "") {
    skinType = "blade";
    primaryColor = "rgba(255, 170, 0, 0.3)";
  } else if (styles.getPropertyValue("--ghost-cyan").trim() !== "") {
    skinType = "ghost";
    primaryColor = "rgba(136, 204, 255, 0.3)";
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Chaos Multipliers: Randomize density and speed every load
  const densityMultiplier = Math.random() * 1.5 + 0.5; // 50% to 200% normal density
  const speedMultiplier = Math.random() * 1.5 + 0.5;
  const count = Math.floor(
    (window.innerWidth < 768 ? 15 : 40) * densityMultiplier,
  );

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speedMultiplier,
      vy: (Math.random() - 0.5) * speedMultiplier,
      size: Math.random() * 2 + 1,
      hex: Math.floor(Math.random() * 255)
        .toString(16)
        .toUpperCase(),
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p, index) => {
      if (skinType === "blade" || skinType === "matrix") {
        p.y += Math.abs(p.vy) + 0.5;
        if (p.y > h) p.y = 0;
        ctx.fillStyle = primaryColor;
        ctx.font =
          skinType === "matrix"
            ? "14px 'VT323', monospace"
            : "12px 'Share Tech Mono', monospace";
        ctx.fillText(p.hex, p.x, p.y);
      } else if (skinType === "ghost") {
        p.x += p.vx * 0.5;
        p.y += p.vy * 0.5;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = primaryColor.replace(
              /0\.[0-9]+\)/,
              `${1 - dist / 120})`,
            );
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      } else if (skinType === "comrade") {
        p.x += Math.abs(p.vx) + 1.5;
        if (p.x > w) p.x = 0;
        ctx.fillStyle = primaryColor;
        ctx.fillRect(p.x, p.y, 15, 2);
      }
    });
    requestAnimationFrame(draw);
  }

  draw();
})();
