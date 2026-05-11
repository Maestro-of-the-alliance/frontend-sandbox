/*!
 * RANDANIME_MAESTRO.js
 * Ambient animation engine for the MAESTRO entry page
 * White · Gold · Deep Blue
 * "A living document. Not a broadcast. Not a terminal."
 *
 * Effects library (picks 3-4 at random per load):
 *   1. inkBleed       — gold ink seeps into margin rule
 *   2. compassGhost   — faint compass rose appears and dissolves
 *   3. stampFlash     — document classification stamp flickers in
 *   4. paperShift     — subtle page texture breathes
 *   5. goldDust       — fine particles drift across the seal
 *   6. marginNote     — handwritten-style annotation appears briefly
 *   7. sealPulse      — Meridian Device glows warm then fades
 *   8. lineGhost      — a single ruled line appears between sections
 *   9. redaction      — a word briefly appears blacked out then clears
 *  10. documentBreath — page opacity micro-shifts like held breath
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
        width: 1px;
        height: ${rand(40, 120)}px;
        background: linear-gradient(180deg, transparent, rgba(212,175,55,0.6), rgba(212,175,55,0.3), transparent);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 0.8s ease;
      `;
      document.body.appendChild(bleed);
      requestAnimationFrame(() => {
        bleed.style.opacity = "1";
        setTimeout(
          () => {
            bleed.style.opacity = "0";
            setTimeout(() => bleed.remove(), 900);
          },
          rand(1200, 2800),
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
        background: radial-gradient(circle, rgba(184,134,11,0.04) 0%, transparent 70%);
        border-radius: 50%;
        border: 1px solid rgba(184,134,11,0.06);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 2s ease;
      `;
      const cardinals = ["N", "E", "S", "W"];
      const positions = [
        "top:4px;left:50%;transform:translateX(-50%)",
        "right:4px;top:50%;transform:translateY(-50%)",
        "bottom:4px;left:50%;transform:translateX(-50%)",
        "left:4px;top:50%;transform:translateY(-50%)",
      ];
      cardinals.forEach((c, i) => {
        const span = document.createElement("span");
        span.textContent = c;
        span.style.cssText = `position:absolute;${positions[i]};font-family:'Cinzel',serif;font-size:10px;color:rgba(184,134,11,0.15);letter-spacing:0.2em;`;
        ghost.appendChild(span);
      });
      ["horizontal", "vertical"].forEach((dir) => {
        const line = document.createElement("div");
        line.style.cssText = `position:absolute;${dir === "horizontal" ? "top:50%;left:0;right:0;height:1px;transform:translateY(-50%)" : "left:50%;top:0;bottom:0;width:1px;transform:translateX(-50%)"};background:rgba(184,134,11,0.05);pointer-events:none;`;
        ghost.appendChild(line);
      });
      document.body.appendChild(ghost);
      requestAnimationFrame(() => {
        ghost.style.opacity = "1";
        setTimeout(
          () => {
            ghost.style.opacity = "0";
            setTimeout(() => ghost.remove(), 2100);
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
      ];
      const stamp = document.createElement("div");
      stamp.textContent = stamps[randInt(0, stamps.length)];
      stamp.style.cssText = `
        position: fixed;
        top: ${rand(20, 70)}%;
        left: ${rand(10, 55)}%;
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(10px, 2vw, 14px);
        font-weight: 700;
        letter-spacing: 0.35em;
        color: rgba(184,134,11,0.18);
        border: 2px solid rgba(184,134,11,0.12);
        padding: 6px 14px;
        transform: rotate(${rand(-12, 12)}deg);
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transition: opacity 0.4s ease;
        white-space: nowrap;
      `;
      document.body.appendChild(stamp);
      requestAnimationFrame(() => {
        stamp.style.opacity = "1";
        setTimeout(
          () => {
            stamp.style.opacity = "0";
            setTimeout(() => stamp.remove(), 500);
          },
          rand(1500, 3500),
        );
      });
    },

    paperShift: function () {
      const shell = document.body;
      shell.style.transition = "filter 1.2s ease";
      shell.style.filter = `brightness(${rand(0.96, 0.99)})`;
      setTimeout(
        () => {
          shell.style.filter = "brightness(1)";
          setTimeout(() => {
            shell.style.filter = "";
            shell.style.transition = "";
          }, 1300);
        },
        rand(800, 1800),
      );
    },

    goldDust: function () {
      const seal = document.querySelector(".seal-section");
      if (!seal) return;
      seal.style.position = "relative";
      const count = randInt(4, 9);
      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        const size = rand(1.5, 3.5);
        particle.style.cssText = `
          position: absolute;
          left: ${rand(20, 80)}%;
          top: ${rand(10, 90)}%;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(212,175,55,${rand(0.3, 0.7)});
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          box-shadow: 0 0 ${size * 2}px rgba(212,175,55,0.4);
        `;
        seal.appendChild(particle);
        const delay = rand(0, 800);
        const duration = rand(2000, 4000);
        setTimeout(() => {
          particle.style.transition = `opacity 0.5s ease, transform ${duration}ms ease`;
          particle.style.opacity = "1";
          particle.style.transform = `translate(${rand(-15, 15)}px, -${rand(20, 60)}px)`;
          setTimeout(() => {
            particle.style.opacity = "0";
            setTimeout(() => particle.remove(), 600);
          }, duration - 600);
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
      ];
      const note = document.createElement("div");
      note.textContent = notes[randInt(0, notes.length)];
      note.style.cssText = `
        position: fixed;
        left: 4px;
        top: ${rand(25, 70)}%;
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: 10px;
        color: rgba(184,134,11,0.35);
        letter-spacing: 0.05em;
        pointer-events: none;
        z-index: 9000;
        opacity: 0;
        transform: rotate(-2deg);
        transition: opacity 0.6s ease;
        max-width: 60px;
        line-height: 1.4;
        word-break: break-word;
      `;
      document.body.appendChild(note);
      requestAnimationFrame(() => {
        note.style.opacity = "1";
        setTimeout(
          () => {
            note.style.opacity = "0";
            setTimeout(() => note.remove(), 700);
          },
          rand(2000, 4000),
        );
      });
    },

    sealPulse: function () {
      const seal = document.querySelector(".seal-img");
      if (!seal) return;
      seal.style.transition = "filter 1.5s ease";
      seal.style.filter =
        "drop-shadow(0 0 50px rgba(212,175,55,0.55)) drop-shadow(0 0 100px rgba(212,175,55,0.25))";
      setTimeout(
        () => {
          seal.style.filter =
            "drop-shadow(0 0 30px rgba(184,134,11,0.3)) drop-shadow(0 0 60px rgba(184,134,11,0.12))";
          setTimeout(() => {
            seal.style.transition = "";
          }, 1600);
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
        background: linear-gradient(90deg, transparent, rgba(184,134,11,0.4), transparent);
        pointer-events: none;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.8s ease;
      `;
      target.style.position = "relative";
      target.appendChild(line);
      requestAnimationFrame(() => {
        line.style.opacity = "1";
        setTimeout(
          () => {
            line.style.opacity = "0";
            setTimeout(() => line.remove(), 900);
          },
          rand(1200, 2500),
        );
      });
    },

    redaction: function () {
      const words = document.querySelectorAll("span.rm-word");
      if (!words.length) return;
      const word = words[randInt(0, words.length)];
      const orig = word.getAttribute("data-orig-style") || "";
      word.style.cssText +=
        "background:rgba(10,10,10,0.85);color:transparent;border-radius:2px;transition:all 0.3s ease;";
      setTimeout(
        () => {
          word.style.cssText = orig;
        },
        rand(800, 1800),
      );
    },

    documentBreath: function () {
      const shell = document.body;
      let phase = 0;
      const breathe = () => {
        phase++;
        if (phase > 4) {
          shell.style.opacity = "1";
          shell.style.transition = "";
          return;
        }
        shell.style.transition = "opacity 2s ease";
        shell.style.opacity = phase % 2 === 0 ? "1" : `${rand(0.97, 0.995)}`;
        setTimeout(breathe, 2100);
      };
      breathe();
    },
  };

  function wrapWords() {
    document.querySelectorAll(".section p").forEach((p) => {
      if (p.dataset.rmWrapped) return;
      p.dataset.rmWrapped = "1";
      [...p.childNodes].forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          const words = node.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w) => {
            if (w.trim()) {
              const span = document.createElement("span");
              span.className = "rm-word";
              span.setAttribute("data-orig-style", "");
              span.textContent = w;
              frag.appendChild(span);
            } else {
              frag.appendChild(document.createTextNode(w));
            }
          });
          node.parentNode.replaceChild(frag, node);
        }
      });
    });
  }

  const ALL_EFFECTS = Object.keys(EFFECTS);

  function pickEffects() {
    const count = randInt(3, 5);
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
    wrapWords();
    const active = pickEffects();

    // Always-on
    schedule(12000, 28000, EFFECTS.inkBleed);
    schedule(8000, 18000, EFFECTS.paperShift);
    schedule(20000, 45000, EFFECTS.sealPulse);

    // Rotating selected effects
    const timings = {
      compassGhost: [35000, 70000],
      stampFlash: [25000, 55000],
      goldDust: [15000, 35000],
      marginNote: [20000, 45000],
      lineGhost: [10000, 25000],
      redaction: [18000, 40000],
      documentBreath: [60000, 120000],
    };
    active.forEach((name) => {
      if (EFFECTS[name] && timings[name]) {
        schedule(timings[name][0], timings[name][1], EFFECTS[name]);
      }
    });

    // First impressions
    setTimeout(() => EFFECTS.inkBleed(), rand(2000, 4000));
    setTimeout(() => EFFECTS.sealPulse(), rand(5000, 9000));
    setTimeout(
      () => {
        if (active.includes("goldDust")) EFFECTS.goldDust();
        else if (active.includes("stampFlash")) EFFECTS.stampFlash();
      },
      rand(8000, 14000),
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
