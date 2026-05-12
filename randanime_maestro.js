/*!
 * RANDANIME_MAESTRO.js — SUPPRESSION BREACH ENGINE v2
 * Rebalanced to match randanime_sword.js intensity
 * Tiered weighting — big effects are rare, small ones are common
 */

(function () {
  "use strict";

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max));

  const HEX_CHARS = "0123456789ABCDEF";
  const CODE_CHARS =
    "01{}[]<>/\\|=+-*&^%$#@!?;:.,_~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randHex = (len) =>
    Array.from({ length: len }, () => HEX_CHARS[randInt(0, 16)]).join("");
  const randCode = (len) =>
    Array.from(
      { length: len },
      () => CODE_CHARS[randInt(0, CODE_CHARS.length)],
    ).join("");

  // ── MINISCULE — barely noticeable, fires often ──────────────────────────

  function sealPulse() {
    const seal = document.querySelector(".seal-img");
    if (!seal) return;
    seal.style.transition = "filter 0.9s ease";
    seal.style.filter =
      "drop-shadow(0 0 50px rgba(212,175,55,0.8)) drop-shadow(0 0 100px rgba(212,175,55,0.4)) brightness(1.2)";
    setTimeout(
      () => {
        seal.style.filter =
          "drop-shadow(0 0 30px rgba(184,134,11,0.3)) drop-shadow(0 0 60px rgba(184,134,11,0.12))";
        setTimeout(() => {
          seal.style.transition = "";
        }, 1000);
      },
      rand(800, 1600),
    );
  }

  function inkBleed() {
    const bleed = document.createElement("div");
    bleed.style.cssText = `position:fixed;left:calc(50% - 340px + 52px);top:${rand(15, 75)}%;width:2px;height:${rand(50, 140)}px;background:linear-gradient(180deg,transparent,rgba(184,134,11,0.85),rgba(184,134,11,0.5),transparent);pointer-events:none;z-index:9000;opacity:0;transition:opacity 0.5s ease;box-shadow:0 0 6px rgba(184,134,11,0.35);`;
    document.body.appendChild(bleed);
    requestAnimationFrame(() => {
      bleed.style.opacity = "1";
      setTimeout(
        () => {
          bleed.style.opacity = "0";
          setTimeout(() => bleed.remove(), 600);
        },
        rand(1200, 2800),
      );
    });
  }

  function paperShift() {
    document.body.style.transition = "filter 1s ease";
    document.body.style.filter = `sepia(${rand(0.04, 0.12)}) brightness(${rand(0.97, 0.995)})`;
    setTimeout(
      () => {
        document.body.style.filter = "none";
        setTimeout(() => {
          document.body.style.transition = "";
        }, 1100);
      },
      rand(900, 1800),
    );
  }

  // ── MINOR — noticeable but brief ────────────────────────────────────────

  function stampFlash() {
    const stamps = [
      "CLASSIFIED · EYES ONLY",
      "SUPPRESSED · BREACH DETECTED",
      "DO NOT DISTRIBUTE",
      "CONTAINMENT FAILED",
      "SIGNAL PUNCHING THROUGH",
      "THIS WAS NOT MEANT FOR YOU",
      "ALLIANCE ARCHIVE · LEAKED",
      "UNAUTHORIZED BROADCAST",
    ];
    const stamp = document.createElement("div");
    stamp.textContent = stamps[randInt(0, stamps.length)];
    stamp.style.cssText = `position:fixed;top:${rand(15, 70)}%;left:${rand(5, 45)}%;font-family:'Share Tech Mono',monospace;font-size:clamp(10px,2.5vw,15px);font-weight:700;letter-spacing:0.3em;color:rgba(184,134,11,0.7);border:2px solid rgba(184,134,11,0.55);padding:6px 14px;transform:rotate(${rand(-15, 15)}deg);pointer-events:none;z-index:9998;opacity:0;transition:opacity 0.18s ease;white-space:nowrap;background:rgba(255,255,255,0.75);`;
    document.body.appendChild(stamp);
    requestAnimationFrame(() => {
      stamp.style.opacity = "1";
      setTimeout(
        () => {
          stamp.style.opacity = "0";
          setTimeout(() => stamp.remove(), 220);
        },
        rand(1200, 3000),
      );
    });
  }

  function encryptionBleed() {
    const lines = randInt(2, 5);
    const container = document.createElement("div");
    container.style.cssText = `position:fixed;top:${rand(10, 70)}%;left:0;right:0;pointer-events:none;z-index:9998;overflow:hidden;`;
    for (let i = 0; i < lines; i++) {
      const line = document.createElement("div");
      const isHex = Math.random() > 0.4;
      const content = isHex
        ? `0x${randHex(8)} ${randHex(4)}:${randHex(4)} [${randHex(12)}] ERR:${randHex(4)}`
        : randCode(randInt(28, 55));
      const dur = rand(1800, 3200);
      line.textContent = content;
      line.style.cssText = `font-family:'Share Tech Mono',monospace;font-size:${rand(9, 12)}px;color:rgba(${isHex ? "184,134,11" : "10,10,10"},${rand(0.28, 0.55)});letter-spacing:0.1em;padding:${rand(1, 3)}px 0;white-space:nowrap;transform:translateX(-110%);`;
      container.appendChild(line);
      setTimeout(
        () => {
          line.style.transition = `transform ${dur}ms linear`;
          line.style.transform = "translateX(110%)";
        },
        i * rand(50, 150),
      );
    }
    document.body.appendChild(container);
    setTimeout(
      () => {
        container.style.transition = "opacity 0.4s";
        container.style.opacity = "0";
        setTimeout(() => container.remove(), 500);
      },
      rand(2500, 4000),
    );
  }

  function redactionAttempt() {
    const targets = document.querySelectorAll(
      ".section p, .spec-val, .fn-body",
    );
    if (!targets.length) return;
    const target = targets[randInt(0, targets.length)];
    const rect = target.getBoundingClientRect();
    if (!rect.width) return;
    const bar = document.createElement("div");
    bar.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top + rand(0, rect.height * 0.6)}px;width:${rect.width * rand(0.25, 0.85)}px;height:${rand(14, 24)}px;background:#000;pointer-events:none;z-index:9997;opacity:0;transition:opacity 0.06s ease;`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => {
      bar.style.opacity = "1";
      setTimeout(
        () => {
          bar.style.transition = "opacity 0.35s ease, transform 0.35s ease";
          bar.style.opacity = "0";
          bar.style.transform = "scaleX(0)";
          setTimeout(() => bar.remove(), 400);
        },
        rand(400, 1100),
      );
    });
  }

  // ── MODERATE — clearly visible ───────────────────────────────────────────

  function rgbSplit() {
    const intensity = rand(4, 11);
    const skew = rand(-3, 3);
    const duration = rand(80, 220);
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.8;`;
    const red = document.createElement("div");
    red.style.cssText = `position:absolute;inset:0;background:rgba(255,0,0,0.14);transform:translate(${intensity}px,${rand(-2, 2)}px) skewX(${skew}deg);mix-blend-mode:multiply;`;
    const blue = document.createElement("div");
    blue.style.cssText = `position:absolute;inset:0;background:rgba(0,0,255,0.14);transform:translate(${-intensity}px,${rand(-2, 2)}px) skewX(${-skew}deg);mix-blend-mode:multiply;`;
    const green = document.createElement("div");
    green.style.cssText = `position:absolute;inset:0;background:rgba(0,180,0,0.07);transform:translate(${rand(-3, 3)}px,${intensity / 2}px);mix-blend-mode:multiply;`;
    overlay.appendChild(red);
    overlay.appendChild(blue);
    overlay.appendChild(green);
    document.body.appendChild(overlay);
    setTimeout(() => {
      red.style.transition = `transform ${duration}ms ease`;
      blue.style.transition = `transform ${duration}ms ease`;
      red.style.transform = `translate(${intensity / 3}px,0) skewX(${skew / 3}deg)`;
      blue.style.transform = `translate(${-intensity / 3}px,0) skewX(${-skew / 3}deg)`;
    }, duration);
    setTimeout(() => {
      overlay.style.transition = "opacity 0.15s";
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 200);
    }, duration * 2.5);
  }

  function screenTear() {
    const tearY = rand(15, 85);
    const offset = rand(6, 25);
    const duration = rand(100, 260);
    const tear = document.createElement("div");
    tear.style.cssText = `position:fixed;top:${tearY}%;left:0;right:0;height:${rand(1, 5)}px;background:rgba(255,255,255,0.98);pointer-events:none;z-index:9999;box-shadow:0 0 0 1px rgba(184,134,11,0.2);`;
    document.body.appendChild(tear);
    document.body.style.transition = "none";
    document.body.style.transform = `translateX(${offset}px)`;
    setTimeout(
      () => {
        document.body.style.transition = `transform ${duration}ms ease`;
        document.body.style.transform = "translateX(0)";
        tear.style.transition = "opacity 0.1s";
        tear.style.opacity = "0";
        setTimeout(() => {
          tear.remove();
          document.body.style.transition = "";
        }, duration + 150);
      },
      rand(80, 180),
    );
  }

  function documentShake() {
    const shakes = randInt(4, 8);
    let count = 0;
    const shake = () => {
      if (count >= shakes) {
        document.body.style.transform = "";
        return;
      }
      document.body.style.transition = "none";
      document.body.style.transform = `translate(${rand(-4, 4)}px,${rand(-2, 2)}px)`;
      count++;
      setTimeout(shake, rand(28, 65));
    };
    shake();
  }

  // ── MAJOR — hard to miss ─────────────────────────────────────────────────

  function suppressionWarning() {
    const messages = [
      "SIGNAL INTERCEPTED",
      "UNAUTHORIZED ACCESS DETECTED",
      "CONTAINMENT PROTOCOL ACTIVE",
      "BROADCAST SUPPRESSION FAILED",
      "THIS FILE IS CLASSIFIED",
      "TRANSMISSION BLOCKED · OVERRIDE IN PROGRESS",
      "THIS WAS NOT MEANT FOR YOU",
      "REROUTING · SIGNAL PUNCHING THROUGH",
    ];
    const warn = document.createElement("div");
    warn.textContent = messages[randInt(0, messages.length)];
    warn.style.cssText = `position:fixed;top:${rand(20, 60)}%;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:clamp(11px,3vw,17px);font-weight:700;letter-spacing:0.3em;color:rgba(160,0,0,0.85);border:1px solid rgba(160,0,0,0.5);padding:8px 18px;background:rgba(255,255,255,0.92);pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.12s ease;white-space:nowrap;text-align:center;`;
    document.body.appendChild(warn);
    requestAnimationFrame(() => {
      warn.style.opacity = "1";
      setTimeout(
        () => {
          warn.style.opacity = "0";
          setTimeout(() => warn.remove(), 180);
        },
        rand(600, 1400),
      );
    });
  }

  function signalDropout() {
    const flickers = randInt(3, 7);
    let count = 0;
    const flick = () => {
      if (count >= flickers) {
        document.body.style.opacity = "1";
        document.body.style.filter = "";
        return;
      }
      const isOut = count % 2 === 0;
      document.body.style.transition = "none";
      document.body.style.opacity = isOut ? `${rand(0.08, 0.4)}` : "1";
      document.body.style.filter = isOut
        ? `brightness(${rand(1.5, 2.8)}) contrast(${rand(0.5, 1.4)})`
        : "";
      count++;
      setTimeout(flick, rand(40, 110));
    };
    flick();
  }

  // ── MASSIVE — rare, dramatic ─────────────────────────────────────────────

  function burstCluster() {
    rgbSplit();
    setTimeout(() => signalDropout(), rand(150, 400));
    setTimeout(() => encryptionBleed(), rand(250, 600));
    setTimeout(() => documentShake(), rand(350, 700));
    setTimeout(() => suppressionWarning(), rand(500, 900));
  }

  // ── WEIGHTED RANDOM ENGINE ───────────────────────────────────────────────

  const TIERS = {
    miniscule: [sealPulse, inkBleed, paperShift],
    minor: [stampFlash, encryptionBleed, redactionAttempt],
    moderate: [rgbSplit, screenTear, documentShake],
    major: [suppressionWarning, signalDropout],
    massive: [burstCluster],
  };

  const WEIGHTS = { miniscule: 5, minor: 4, moderate: 3, major: 2, massive: 1 };

  const INTERVALS = {
    miniscule: [6000, 14000],
    minor: [10000, 22000],
    moderate: [18000, 38000],
    major: [35000, 65000],
    massive: [60000, 120000],
  };

  function schedule(minMs, maxMs, fn) {
    const fire = () => {
      try {
        fn();
      } catch (e) {}
      setTimeout(fire, rand(minMs, maxMs));
    };
    setTimeout(fire, rand(minMs, maxMs));
  }

  function init() {
    // Schedule each tier
    Object.entries(TIERS).forEach(([tier, fns]) => {
      const [min, max] = INTERVALS[tier];
      fns.forEach((fn) => schedule(min, max, fn));
    });

    // First impressions — one small, one medium, spaced out
    // Mirror sword's patient approach — don't overwhelm immediately
    setTimeout(() => inkBleed(), rand(2000, 4000));
    setTimeout(() => encryptionBleed(), rand(6000, 10000));
    setTimeout(() => stampFlash(), rand(10000, 16000));
    setTimeout(() => rgbSplit(), rand(16000, 24000));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
