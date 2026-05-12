/*!
 * RANDANIME_MAESTRO.js — SUPPRESSION BREACH ENGINE
 * This file was not supposed to reach you.
 * Active containment failing. Signal punching through.
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

  // RGB SPLIT + SKEW
  function rgbSplit() {
    const intensity = rand(4, 12);
    const skew = rand(-3, 3);
    const duration = rand(80, 250);

    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:99999;opacity:0.8;`;

    const red = document.createElement("div");
    red.style.cssText = `position:absolute;inset:0;background:rgba(255,0,0,0.15);transform:translate(${intensity}px,${rand(-2, 2)}px) skewX(${skew}deg);mix-blend-mode:multiply;`;

    const blue = document.createElement("div");
    blue.style.cssText = `position:absolute;inset:0;background:rgba(0,0,255,0.15);transform:translate(${-intensity}px,${rand(-2, 2)}px) skewX(${-skew}deg);mix-blend-mode:multiply;`;

    const green = document.createElement("div");
    green.style.cssText = `position:absolute;inset:0;background:rgba(0,180,0,0.08);transform:translate(${rand(-3, 3)}px,${intensity / 2}px);mix-blend-mode:multiply;`;

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

  // ENCRYPTION BLEED
  function encryptionBleed() {
    const lines = randInt(3, 8);
    const container = document.createElement("div");
    container.style.cssText = `position:fixed;top:${rand(10, 70)}%;left:0;right:0;pointer-events:none;z-index:99998;overflow:hidden;`;

    for (let i = 0; i < lines; i++) {
      const line = document.createElement("div");
      const isHex = Math.random() > 0.4;
      const content = isHex
        ? `0x${randHex(8)} ${randHex(4)}:${randHex(4)} [${randHex(16)}] ERR:${randHex(4)}`
        : randCode(randInt(35, 65));
      const scrollDuration = rand(1500, 3000);

      line.textContent = content;
      line.style.cssText = `font-family:'Share Tech Mono',monospace;font-size:${rand(9, 13)}px;color:rgba(${isHex ? "184,134,11" : "10,10,10"},${rand(0.3, 0.6)});letter-spacing:0.1em;padding:${rand(1, 4)}px 0;white-space:nowrap;transform:translateX(-110%);opacity:1;`;
      container.appendChild(line);

      setTimeout(
        () => {
          line.style.transition = `transform ${scrollDuration}ms linear`;
          line.style.transform = "translateX(110%)";
        },
        i * rand(60, 180),
      );
    }

    document.body.appendChild(container);
    setTimeout(
      () => {
        container.style.transition = "opacity 0.4s";
        container.style.opacity = "0";
        setTimeout(() => container.remove(), 500);
      },
      rand(2500, 4500),
    );
  }

  // SIGNAL DROPOUT
  function signalDropout() {
    const flickers = randInt(4, 9);
    let count = 0;
    const shell = document.body;
    const flick = () => {
      if (count >= flickers) {
        shell.style.opacity = "1";
        shell.style.filter = "";
        return;
      }
      const isOut = count % 2 === 0;
      shell.style.transition = "none";
      shell.style.opacity = isOut ? `${rand(0.05, 0.4)}` : "1";
      shell.style.filter = isOut
        ? `brightness(${rand(1.5, 3)}) contrast(${rand(0.4, 1.5)})`
        : "";
      count++;
      setTimeout(flick, rand(35, 120));
    };
    flick();
  }

  // REDACTION ATTEMPT
  function redactionAttempt() {
    const targets = document.querySelectorAll(
      ".section p, .spec-val, .fn-body",
    );
    if (!targets.length) return;
    const target = targets[randInt(0, targets.length)];
    const rect = target.getBoundingClientRect();
    if (!rect.width) return;

    const bar = document.createElement("div");
    bar.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top + rand(0, rect.height * 0.6)}px;width:${rect.width * rand(0.3, 0.95)}px;height:${rand(14, 26)}px;background:#000;pointer-events:none;z-index:99997;opacity:0;transition:opacity 0.06s ease;`;
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
        rand(350, 1100),
      );
    });
  }

  // SCREEN TEAR
  function screenTear() {
    const tearY = rand(15, 85);
    const offset = rand(8, 30);
    const duration = rand(100, 280);

    const tear = document.createElement("div");
    tear.style.cssText = `position:fixed;top:${tearY}%;left:0;right:0;height:${rand(1, 6)}px;background:rgba(255,255,255,0.98);pointer-events:none;z-index:99999;box-shadow:0 0 0 1px rgba(184,134,11,0.25);`;
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
      rand(80, 200),
    );
  }

  // SUPPRESSION WARNING
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
    warn.style.cssText = `position:fixed;top:${rand(20, 60)}%;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:clamp(11px,3vw,17px);font-weight:700;letter-spacing:0.3em;color:rgba(160,0,0,0.8);border:1px solid rgba(160,0,0,0.5);padding:8px 18px;background:rgba(255,255,255,0.9);pointer-events:none;z-index:99999;opacity:0;transition:opacity 0.12s ease;white-space:nowrap;text-align:center;`;
    document.body.appendChild(warn);

    requestAnimationFrame(() => {
      warn.style.opacity = "1";
      setTimeout(
        () => {
          warn.style.opacity = "0";
          setTimeout(() => warn.remove(), 180);
        },
        rand(500, 1300),
      );
    });
  }

  // DOCUMENT SHAKE
  function documentShake() {
    const shakes = randInt(5, 10);
    let count = 0;
    const shake = () => {
      if (count >= shakes) {
        document.body.style.transform = "";
        return;
      }
      document.body.style.transition = "none";
      document.body.style.transform = `translate(${rand(-5, 5)}px,${rand(-3, 3)}px)`;
      count++;
      setTimeout(shake, rand(25, 70));
    };
    shake();
  }

  // STAMP FLASH
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
    stamp.style.cssText = `position:fixed;top:${rand(15, 70)}%;left:${rand(5, 45)}%;font-family:'Share Tech Mono',monospace;font-size:clamp(10px,2.5vw,15px);font-weight:700;letter-spacing:0.3em;color:rgba(184,134,11,0.7);border:2px solid rgba(184,134,11,0.55);padding:6px 14px;transform:rotate(${rand(-15, 15)}deg);pointer-events:none;z-index:99998;opacity:0;transition:opacity 0.18s ease;white-space:nowrap;background:rgba(255,255,255,0.75);`;
    document.body.appendChild(stamp);
    requestAnimationFrame(() => {
      stamp.style.opacity = "1";
      setTimeout(
        () => {
          stamp.style.opacity = "0";
          setTimeout(() => stamp.remove(), 220);
        },
        rand(1000, 2800),
      );
    });
  }

  // SEAL PULSE
  function sealPulse() {
    const seal = document.querySelector(".seal-img");
    if (!seal) return;
    seal.style.transition = "filter 0.7s ease";
    seal.style.filter =
      "drop-shadow(0 0 50px rgba(212,175,55,0.85)) drop-shadow(0 0 100px rgba(212,175,55,0.45)) brightness(1.25)";
    setTimeout(
      () => {
        seal.style.filter =
          "drop-shadow(0 0 30px rgba(184,134,11,0.3)) drop-shadow(0 0 60px rgba(184,134,11,0.12))";
        setTimeout(() => {
          seal.style.transition = "";
        }, 800);
      },
      rand(700, 1400),
    );
  }

  // BURST CLUSTER — multiple effects rapid fire
  function burstCluster() {
    rgbSplit();
    setTimeout(() => signalDropout(), rand(100, 300));
    setTimeout(() => encryptionBleed(), rand(200, 500));
    setTimeout(() => documentShake(), rand(300, 600));
  }

  // ── ENGINE ────────────────────────────────────────────────────────────────

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
    // Regular schedules
    schedule(5000, 12000, rgbSplit);
    schedule(8000, 18000, encryptionBleed);
    schedule(10000, 22000, redactionAttempt);
    schedule(12000, 28000, stampFlash);
    schedule(15000, 35000, sealPulse);
    schedule(18000, 40000, screenTear);
    schedule(20000, 45000, suppressionWarning);
    schedule(25000, 55000, documentShake);
    schedule(30000, 65000, signalDropout);
    schedule(45000, 90000, burstCluster);

    // First impressions — hit fast so the user knows something is wrong
    setTimeout(() => rgbSplit(), rand(1200, 2500));
    setTimeout(() => encryptionBleed(), rand(3000, 5500));
    setTimeout(() => stampFlash(), rand(5000, 8000));
    setTimeout(() => redactionAttempt(), rand(7000, 11000));
    setTimeout(() => suppressionWarning(), rand(10000, 16000));
    setTimeout(() => screenTear(), rand(14000, 20000));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
