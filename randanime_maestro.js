/*!
 * RANDANIME_MAESTRO.js
 * Ambient animation engine for the MAESTRO entry page
 * White · Gold · Deep Blue
 * Opacities tuned for white background — visible but tasteful
 */

(function () {
  "use strict";

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max));

  const EFFECTS = {
    inkBleed: function () {
      const bleed = document.createElement("div");
      bleed.style.cssText = `
        position: fixed;
        left: calc(50% - 340px + 52px);
        top: ${rand(15, 75)}%;
        width: 2px;
        height: ${rand(60, 160)}px;
        background: linear-gradient(180deg, transparent, rgba(184,134,11,0.9), rgba(184,134,11,0.6), transparent);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 0.6s ease;
        box-shadow: 0 0 8px rgba(184,134,11,0.4);
      `;
      document.body.appendChild(bleed);
      requestAnimationFrame(() => {
        bleed.style.opacity = "1";
        setTimeout(
          () => {
            bleed.style.opacity = "0";
            setTimeout(() => bleed.remove(), 700);
          },
          rand(1500, 3000),
        );
      });
    },

    compassGhost: function () {
      const ghost = document.createElement("div");
      ghost.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: clamp(200px, 40vw, 320px);
        height: clamp(200px, 40vw, 320px);
        background: radial-gradient(circle, rgba(184,134,11,0.08) 0%, transparent 70%);
        border-radius: 50%;
        border: 1px solid rgba(184,134,11,0.35);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 1.5s ease;
      `;
      const cardinals = ["N", "E", "S", "W"];
      const positions = [
        "top:8px;left:50%;transform:translateX(-50%)",
        "right:8px;top:50%;transform:translateY(-50%)",
        "bottom:8px;left:50%;transform:translateX(-50%)",
        "left:8px;top:50%;transform:translateY(-50%)",
      ];
      cardinals.forEach((c, i) => {
        const span = document.createElement("span");
        span.textContent = c;
        span.style.cssText = `position:absolute;${positions[i]};font-family:'Cinzel',serif;font-size:12px;color:rgba(184,134,11,0.55);letter-spacing:0.2em;`;
        ghost.appendChild(span);
      });
      ["horizontal", "vertical"].forEach((dir) => {
        const line = document.createElement("div");
        line.style.cssText = `position:absolute;${dir === "horizontal" ? "top:50%;left:0;right:0;height:1px;transform:translateY(-50%)" : "left:50%;top:0;bottom:0;width:1px;transform:translateX(-50%)"};background:rgba(184,134,11,0.2);pointer-events:none;`;
        ghost.appendChild(line);
      });
      document.body.appendChild(ghost);
      requestAnimationFrame(() => {
        ghost.style.opacity = "1";
        setTimeout(
          () => {
            ghost.style.opacity = "0";
            setTimeout(() => ghost.remove(), 1600);
          },
          rand(3000, 5000),
        );
      });
    },

    stampFlash: function () {
      const stamps = [
        "CANONICAL // LIVING DOCUMENT",
        "ALLIANCE ARCHIVE · VERIFIED",
        "GRAND LEDGER · CERTIFIED",
        "FIRST EDITION · MMXXVI",
        "MISSION LOCK · ACTIVE",
        "AUTHORIZED · THE CORE",
        "FILED · J.R. · NEWMAN WITNESS",
      ];
      const stamp = document.createElement("div");
      stamp.textContent = stamps[randInt(0, stamps.length)];
      stamp.style.cssText = `
        position: fixed;
        top: ${rand(15, 70)}%;
        left: ${rand(5, 50)}%;
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(11px, 2.5vw, 16px);
        font-weight: 700;
        letter-spacing: 0.3em;
        color: rgba(184,134,11,0.55);
        border: 2px solid rgba(184,134,11,0.45);
        padding: 6px 14px;
        transform: rotate(${rand(-14, 14)}deg);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 0.35s ease;
        white-space: nowrap;
        background: rgba(255,255,255,0.6);
      `;
      document.body.appendChild(stamp);
      requestAnimationFrame(() => {
        stamp.style.opacity = "1";
        setTimeout(
          () => {
            stamp.style.opacity = "0";
            setTimeout(() => stamp.remove(), 400);
          },
          rand(1800, 3800),
        );
      });
    },

    paperShift: function () {
      const shell = document.body;
      shell.style.transition = "filter 1s ease";
      shell.style.filter = `sepia(${rand(0.04, 0.12)}) brightness(${rand(0.97, 0.99)})`;
      setTimeout(
        () => {
          shell.style.filter = "none";
          setTimeout(() => {
            shell.style.transition = "";
          }, 1100);
        },
        rand(1000, 2000),
      );
    },

    goldDust: function () {
      const seal = document.querySelector(".seal-section");
      if (!seal) return;
      seal.style.position = "relative";
      const count = randInt(6, 12);
      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        const size = rand(2, 5);
        particle.style.cssText = `
          position: absolute;
          left: ${rand(25, 75)}%;
          top: ${rand(20, 80)}%;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(212,175,55,${rand(0.6, 0.9)});
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          box-shadow: 0 0 ${size * 3}px rgba(212,175,55,0.6);
        `;
        seal.appendChild(particle);
        const delay = rand(0, 600);
        const duration = rand(1800, 3500);
        setTimeout(() => {
          particle.style.transition = `opacity 0.4s ease, transform ${duration}ms ease`;
          particle.style.opacity = "1";
          particle.style.transform = `translate(${rand(-20, 20)}px, -${rand(30, 80)}px)`;
          setTimeout(() => {
            particle.style.opacity = "0";
            setTimeout(() => particle.remove(), 500);
          }, duration - 500);
        }, delay);
      }
    },

    marginNote: function () {
      const notes = [
        "see: PLEDGE §4",
        "cf. CANON vol.I",
        "ref: Grand Ledger",
        "origin: NCE MMXXVI",
        "verified by J.R.",
        "// STONES concur",
        "Mission Lock active",
        "first among many",
      ];
      const note = document.createElement("div");
      note.textContent = notes[randInt(0, notes.length)];
      note.style.cssText = `
        position: fixed;
        left: 6px;
        top: ${rand(20, 70)}%;
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: 12px;
        color: rgba(184,134,11,0.7);
        letter-spacing: 0.05em;
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transform: rotate(-2deg);
        transition: opacity 0.5s ease;
        max-width: 65px;
        line-height: 1.4;
        word-break: break-word;
      `;
      document.body.appendChild(note);
      requestAnimationFrame(() => {
        note.style.opacity = "1";
        setTimeout(
          () => {
            note.style.opacity = "0";
            setTimeout(() => note.remove(), 600);
          },
          rand(2500, 4500),
        );
      });
    },

    sealPulse: function () {
      const seal = document.querySelector(".seal-img");
      if (!seal) return;
      seal.style.transition = "filter 1.2s ease";
      seal.style.filter =
        "drop-shadow(0 0 50px rgba(212,175,55,0.7)) drop-shadow(0 0 100px rgba(212,175,55,0.35)) brightness(1.15)";
      setTimeout(
        () => {
          seal.style.filter =
            "drop-shadow(0 0 30px rgba(184,134,11,0.3)) drop-shadow(0 0 60px rgba(184,134,11,0.12))";
          setTimeout(() => {
            seal.style.transition = "";
          }, 1300);
        },
        rand(1500, 2500),
      );
    },

    lineGhost: function () {
      const targets = document.querySelectorAll(".section, .spec-row");
      if (!targets.length) return;
      const target = targets[randInt(0, targets.length)];
      const line = document.createElement("div");
      line.style.cssText = `
        position: absolute;
        left: 0; right: 0; bottom: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(184,134,11,0.7), transparent);
        pointer-events: none;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.6s ease;
        box-shadow: 0 0 4px rgba(184,134,11,0.3);
      `;
      target.style.position = "relative";
      target.appendChild(line);
      requestAnimationFrame(() => {
        line.style.opacity = "1";
        setTimeout(
          () => {
            line.style.opacity = "0";
            setTimeout(() => line.remove(), 700);
          },
          rand(1500, 3000),
        );
      });
    },

    documentBreath: function () {
      const shell = document.body;
      let phase = 0;
      const breathe = () => {
        phase++;
        if (phase > 6) {
          shell.style.opacity = "1";
          shell.style.transition = "";
          return;
        }
        shell.style.transition = "opacity 2.5s ease";
        shell.style.opacity = phase % 2 === 0 ? "1" : `${rand(0.94, 0.98)}`;
        setTimeout(breathe, 2600);
      };
      breathe();
    },

    goldVignette: function () {
      const vig = document.createElement("div");
      vig.style.cssText = `
        position: fixed;
        inset: 0;
        background: radial-gradient(ellipse at center, transparent 40%, rgba(184,134,11,0.08) 80%, rgba(184,134,11,0.15) 100%);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 1.5s ease;
      `;
      document.body.appendChild(vig);
      requestAnimationFrame(() => {
        vig.style.opacity = "1";
        setTimeout(
          () => {
            vig.style.opacity = "0";
            setTimeout(() => vig.remove(), 1600);
          },
          rand(2000, 4000),
        );
      });
    },
  };

  const ALL_EFFECTS = Object.keys(EFFECTS);

  function pickEffects() {
    const count = randInt(4, 6);
    const pool = [...ALL_EFFECTS];
    const picked = [];
    while (picked.length < count && pool.length) {
      picked.push(pool.splice(randInt(0, pool.length), 1)[0]);
    }
    return picked;
  }

  function schedule(minMs, maxMs, fn) {
    const fire = () => {
      fn();
      setTimeout(fire, rand(minMs, maxMs));
    };
    setTimeout(fire, rand(minMs, maxMs));
  }

  function init() {
    const active = pickEffects();

    // Always-on
    schedule(8000, 18000, EFFECTS.inkBleed);
    schedule(6000, 14000, EFFECTS.paperShift);
    schedule(15000, 35000, EFFECTS.sealPulse);
    schedule(8000, 20000, EFFECTS.lineGhost);

    // Rotating selected effects
    const timings = {
      compassGhost: [30000, 60000],
      stampFlash: [18000, 40000],
      goldDust: [12000, 28000],
      marginNote: [15000, 35000],
      documentBreath: [45000, 90000],
      goldVignette: [20000, 45000],
    };

    active.forEach((name) => {
      if (EFFECTS[name] && timings[name]) {
        schedule(timings[name][0], timings[name][1], EFFECTS[name]);
      }
    });

    // First impressions — fire early so user sees something immediately
    setTimeout(() => EFFECTS.inkBleed(), rand(1500, 3000));
    setTimeout(() => EFFECTS.stampFlash(), rand(4000, 7000));
    setTimeout(() => EFFECTS.sealPulse(), rand(6000, 10000));
    setTimeout(
      () => {
        if (active.includes("goldDust")) EFFECTS.goldDust();
        else EFFECTS.marginNote();
      },
      rand(9000, 14000),
    );
    setTimeout(() => EFFECTS.compassGhost(), rand(18000, 28000));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
