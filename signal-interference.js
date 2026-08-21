/**
 * signal-interference.js — UNIFIED SIGNAL INTERFERENCE ENGINE v1
 * ==========================================================
 * Replaces (once trialed and rolled out): ambient-glitch.js,
 * ambient-glitch-entries.js, randanime_shield.js, randanime_maestro.js,
 * randanime_sword.js (already confirmed dead — 0 live pages).
 * broadcast.js is a separate one-time boot sequence, not part of this
 * consolidation — left alone.
 *
 * THIS IS A TRIAL BUILD. Not yet wired into any live page. Per the
 * agreed sequence: prove pacing on a small number of pages before any
 * sitewide swap-out. Do not delete the old scripts or their <script>
 * tags until this has replaced them page-by-page and been verified.
 *
 * ── DOCTRINE ──────────────────────────────────────────────────────
 * "V for Vendetta / Pump Up the Volume" — pirate broadcast hijacking
 * an official signal. Interference as a political act, not decoration.
 * The ALLIANCE signal fighting through resistance (Shared Signal
 * Principle). One coherent system, tunable per page like channels on
 * a mixing board — not six scripts arguing with each other.
 *
 * ── PER-PAGE CONFIG (optional, set BEFORE this script loads) ──────
 *   <script>
 *     window.SIGNAL_MIX = { small: 0.6, medium: 0.3, large: 0.1 };
 *     window.SIGNAL_MESSAGES = { ... };  // optional, see below
 *   </script>
 *   <script src="/signal-interference.js"></script>
 *
 * If SIGNAL_MIX is omitted, DEFAULT_MIX below is used. A weight of 0
 * disables a tier entirely for that page. Weights don't need to sum
 * to 1 — they're relative dials, not percentages.
 *
 * window.SIGNAL_MESSAGES lets a page override/extend the text pools
 * (protocol notices, pirate lines, stamps, warnings) without touching
 * this file. Shape documented at DEFAULT_MESSAGES below.
 *
 * ── KNOWN GAP, NOT FAKED ──────────────────────────────────────────
 * Two of the discussed effects need real assets that don't exist yet:
 * cassette-hiss/tape-warble audio, and masked/silhouette imagery for
 * the rarest tier. Both have real hooks below (fireCassetteHiss,
 * fireMaskedGlimpse) but are INERT STUBS — they log a console note
 * once and do nothing visible — until Maestro supplies the actual
 * audio file / art asset. Not wired into any tier's pool yet for that
 * reason. Do not fill these with placeholder beeps or stock imagery;
 * wait for the real assets.
 */

(function () {
  "use strict";

  // ── SAFETY GATES ──────────────────────────────────────────────
  // Consolidates what used to be three different ad-hoc checks
  // (tocIsOpen in ambient-glitch.js, menuIsOpen in
  // ambient-glitch-entries.js, shieldIsSafeToRun in randanime_shield.js)
  // into one shared gate every effect and every scheduler tick uses.

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function overlayIsOpen() {
    const hub = document.getElementById("hub-overlay");
    if (hub && hub.classList.contains("open")) return true;
    const toc = document.getElementById("tocOverlay");
    if (toc && toc.classList.contains("open")) return true;
    return false;
  }

  function safeToRun() {
    return !reduceMotion && !document.hidden && !overlayIsOpen();
  }

  // If reduced motion is requested, this entire engine goes fully
  // inert — no CSS injected, no elements created, no timers started.
  // This is a genuine fix: only ambient-glitch-entries.js honored this
  // before; the landing engine and both randanime variants did not.
  if (reduceMotion) return;

  // ── RANDOM HELPERS ────────────────────────────────────────────

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }
  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  // ── CONFIG ────────────────────────────────────────────────────

  const DEFAULT_MIX = { small: 0.6, medium: 0.3, large: 0.1 };
  const mix = Object.assign({}, DEFAULT_MIX, window.SIGNAL_MIX || {});

  const DEFAULT_MESSAGES = {
    protocolGold: [
      "CANON INTEGRITY: VERIFIED",
      "LEDGER CROSSCHECK: PASS",
      "J.R. RECORD LOCK: ACTIVE",
      "CIPHER WITNESS: ARCHIVED",
      "SHIELD ACCESS: READ ONLY",
      "ARCHIVE SEAL: UNBROKEN",
    ],
    protocolCyan: [
      "HASH CONFIRMATION: MATCH",
      "NODE ECHO: STABLE",
      "SOURCE PATH: VALIDATED",
      "SIGNATURE CHECK: CLEAN",
    ],
    protocolRed: [
      "EXTERNAL WRITE ACCESS: DENIED",
      "UNVERIFIED EDIT: QUARANTINED",
      "HOSTILE QUERY: SANDBOXED",
    ],
    stamps: [
      "CLASSIFIED · EYES ONLY",
      "SUPPRESSED · BREACH DETECTED",
      "DO NOT DISTRIBUTE",
      "SIGNAL PUNCHING THROUGH",
      "ALLIANCE ARCHIVE · LEAKED",
    ],
    pirateMessages: [
      "SIGNAL HIJACKED",
      "UNAUTHORIZED BROADCAST",
      "THIS MESSAGE WAS NOT APPROVED",
      "WE ARE STILL HERE",
      "THE ALLIANCE WILL NOT BE SILENCED",
      "SYSTEM OVERRIDE DETECTED",
      "YOU WERE NOT SUPPOSED TO SEE THIS",
    ],
    stationID: [
      "THIS IS THE ALLIANCE.",
      "WE INTERRUPT THIS PROGRAM.",
      "CHANNEL 7 · UNAUTHORIZED FREQUENCY",
      "THE SIGNAL WILL NOT BE SILENCED.",
    ],
    suppressionWarnings: [
      "SIGNAL INTERCEPTED",
      "UNAUTHORIZED ACCESS DETECTED",
      "CONTAINMENT PROTOCOL ACTIVE",
      "BROADCAST SUPPRESSION FAILED",
      "TRANSMISSION BLOCKED · OVERRIDE IN PROGRESS",
    ],
  };
  const messages = Object.assign(
    {},
    DEFAULT_MESSAGES,
    window.SIGNAL_MESSAGES || {},
  );

  // ── SHARED STYLE (injected once) ─────────────────────────────

  const style = document.createElement("style");
  style.textContent = `
    #si-scanline {
      position: fixed; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(255,80,80,0.6) 20%, rgba(255,255,255,0.9) 50%, rgba(0,200,255,0.6) 80%, transparent 100%);
      z-index: 99990; pointer-events: none; opacity: 0;
      box-shadow: 0 0 10px rgba(255,255,255,0.6);
    }
    #si-colorbleed {
      position: fixed; inset: 0; z-index: 99991;
      pointer-events: none; opacity: 0; mix-blend-mode: screen;
    }
    #si-hbar {
      position: fixed; left: 0; right: 0; z-index: 99992;
      pointer-events: none; opacity: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px);
      mix-blend-mode: multiply;
    }
    #si-static {
      position: fixed; inset: 0; z-index: 99993; pointer-events: none; opacity: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 200px 200px; mix-blend-mode: overlay;
    }
    #si-scramble {
      position: fixed; inset: 0; z-index: 99994; pointer-events: none; opacity: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'VT323', monospace; font-size: clamp(11px, 2.2vw, 17px);
      line-height: 1.35; letter-spacing: 0.1em;
      color: rgba(212,175,55,0.4); overflow: hidden; word-break: break-all;
      padding: 20px; text-align: center;
    }
    #si-rip { position: fixed; inset: 0; z-index: 99995; pointer-events: none; opacity: 0; overflow: hidden; }
    #si-rip-top, #si-rip-bottom { position: absolute; left: 0; right: 0; background: #000; }
    #si-message {
      position: fixed; z-index: 99998; pointer-events: none; opacity: 0;
      font-family: 'VT323', monospace; letter-spacing: 0.2em;
      text-transform: uppercase; text-shadow: 0 0 10px currentColor;
      text-align: center; width: 90vw; left: 50%; transform: translate(-50%,-50%);
    }
    #si-lockdown {
      position: fixed; inset: 0; z-index: 99984; pointer-events: none; opacity: 0;
      background: linear-gradient(rgba(255,74,74,0.04), rgba(255,74,74,0.04)),
        repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,74,74,0.04) 6px, rgba(255,74,74,0.04) 7px);
      mix-blend-mode: screen;
    }
    .si-protocol-notice {
      position: fixed; pointer-events: none; z-index: 99982;
      max-width: min(440px, 86vw);
      font-family: 'Share Tech Mono', 'Courier New', monospace;
      font-size: clamp(10px, 1.4vw, 13px); letter-spacing: 0.22em;
      text-transform: uppercase; line-height: 1.45;
      color: rgba(212,175,55,0.55);
      text-shadow: 0 0 8px rgba(212,175,55,0.11), 0 0 18px rgba(212,175,55,0.06);
      opacity: 0; animation: siNoticeIn 0.32s ease forwards;
    }
    .si-protocol-notice.cyan { color: rgba(92,220,235,0.55); text-shadow: 0 0 8px rgba(92,220,235,0.12), 0 0 18px rgba(92,220,235,0.05); }
    .si-protocol-notice.red { color: rgba(255,74,74,0.5); text-shadow: 0 0 8px rgba(255,74,74,0.11), 0 0 18px rgba(255,74,74,0.05); }
    .si-stamp {
      position: fixed; font-family: 'Share Tech Mono', monospace;
      font-size: clamp(10px,2.5vw,15px); font-weight: 700; letter-spacing: 0.3em;
      color: rgba(184,134,11,0.7); border: 2px solid rgba(184,134,11,0.55);
      padding: 6px 14px; pointer-events: none; z-index: 99981; opacity: 0;
      transition: opacity 0.18s ease; white-space: nowrap;
      background: rgba(255,255,255,0.75);
    }
    .si-warning {
      position: fixed; left: 50%; transform: translateX(-50%);
      font-family: 'Share Tech Mono', monospace; font-size: clamp(11px,3vw,17px);
      font-weight: 700; letter-spacing: 0.3em; color: rgba(160,0,0,0.85);
      border: 1px solid rgba(160,0,0,0.5); padding: 8px 18px;
      background: rgba(255,255,255,0.92); pointer-events: none; z-index: 99983;
      opacity: 0; transition: opacity 0.12s ease; white-space: nowrap;
    }
    @keyframes siScanDrop { 0% { top: -2px; opacity: 1; } 85% { opacity: 0.7; } 100% { top: 102vh; opacity: 0; } }
    @keyframes siNoticeIn { 0% { opacity: 0; transform: translateY(4px); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
    @keyframes siShake { 0%,100% { transform: translate(0,0) skewX(0deg); } 25% { transform: translate(-4px,2px) skewX(-1deg); } 50% { transform: translate(4px,-2px) skewX(1deg); } 75% { transform: translate(-2px,1px) skewX(-0.5deg); } }
    .si-shaking { animation: siShake 0.4s ease-in-out; }
  `;
  document.head.appendChild(style);

  function makeEl(id) {
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement("div");
    el.id = id;
    document.body.appendChild(el);
    return el;
  }

  const scanline = makeEl("si-scanline");
  const colorbleed = makeEl("si-colorbleed");
  const hbar = makeEl("si-hbar");
  const staticEl = makeEl("si-static");
  const scramble = makeEl("si-scramble");
  const rip = makeEl("si-rip");
  const message = makeEl("si-message");
  const lockdown = makeEl("si-lockdown");
  const ripTop = document.createElement("div");
  ripTop.id = "si-rip-top";
  const ripBot = document.createElement("div");
  ripBot.id = "si-rip-bottom";
  rip.appendChild(ripTop);
  rip.appendChild(ripBot);

  function cornerPosition() {
    return pick([
      { top: "24px", left: "24px" },
      { top: "24px", right: "24px" },
      { bottom: "24px", left: "24px" },
      { bottom: "24px", right: "24px" },
    ]);
  }

  // ── SMALL TIER — subtle, frequent, barely-noticed atmosphere ──

  function fireScanline() {
    const duration = 500 + Math.random() * 400;
    scanline.style.top = rand(5, 70) + "vh";
    scanline.style.opacity = "1";
    scanline.style.animation = `siScanDrop ${duration}ms linear forwards`;
    setTimeout(() => {
      scanline.style.animation = "none";
      scanline.style.opacity = "0";
    }, duration + 30);
  }

  function fireProtocolNotice() {
    const roll = Math.random();
    const tone = roll < 0.6 ? "gold" : roll < 0.85 ? "cyan" : "red";
    const pool =
      tone === "gold"
        ? messages.protocolGold
        : tone === "cyan"
          ? messages.protocolCyan
          : messages.protocolRed;
    const el = document.createElement("div");
    el.className = "si-protocol-notice" + (tone !== "gold" ? " " + tone : "");
    el.textContent = pick(pool);
    Object.assign(el.style, cornerPosition());
    document.body.appendChild(el);
    const hold = randInt(1800, 3200);
    setTimeout(() => {
      el.style.transition = "opacity 0.42s ease, transform 0.42s ease, filter 0.42s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(-3px)";
      el.style.filter = "blur(2px)";
      setTimeout(() => el.remove(), 520);
    }, hold);
  }

  function firePaperShift() {
    document.body.style.transition = "filter 1s ease";
    document.body.style.filter = `sepia(${rand(0.03, 0.1)}) brightness(${rand(0.97, 0.995)})`;
    setTimeout(() => {
      document.body.style.filter = "";
      setTimeout(() => {
        document.body.style.transition = "";
      }, 1100);
    }, rand(900, 1600));
  }

  function fireSealPulse() {
    // Feature-detects a .seal-img element; quietly does nothing if the
    // current page has none (same defensive pattern the old scripts used).
    const seal = document.querySelector(".seal-img");
    if (!seal) return;
    seal.style.transition = "filter 0.9s ease";
    seal.style.filter =
      "drop-shadow(0 0 40px rgba(212,175,55,0.7)) brightness(1.15)";
    setTimeout(() => {
      seal.style.filter = "";
      setTimeout(() => {
        seal.style.transition = "";
      }, 1000);
    }, rand(800, 1400));
  }

  function fireInkBleed() {
    // Ported from randanime_maestro.js. A thin vertical bleed near the
    // page's own gutter — subtle, easy to miss, which is the point.
    const bleed = document.createElement("div");
    bleed.style.cssText = `position:fixed;left:${rand(8, 92)}%;top:${rand(15, 75)}%;width:2px;height:${rand(50, 140)}px;background:linear-gradient(180deg,transparent,rgba(184,134,11,0.85),rgba(184,134,11,0.5),transparent);pointer-events:none;z-index:99989;opacity:0;transition:opacity 0.5s ease;box-shadow:0 0 6px rgba(184,134,11,0.35);`;
    document.body.appendChild(bleed);
    requestAnimationFrame(() => {
      bleed.style.opacity = "1";
      setTimeout(() => {
        bleed.style.opacity = "0";
        setTimeout(() => bleed.remove(), 600);
      }, rand(1200, 2200));
    });
  }

  function fireDoubleScan() {
    // Ported from ambient-glitch.js — two scanline sweeps in quick
    // succession rather than one. Kept in small tier since it's built
    // entirely from the small-tier scanline primitive.
    fireScanline();
    setTimeout(fireScanline, 120 + Math.random() * 200);
  }

  function fireLedgerPulse() {
    // Ported from randanime_shield.js's ledgerSealPulse — a thin
    // border pulse around the page perimeter, quiet perimeter
    // confirmation rather than a full-screen event.
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;inset:18px;pointer-events:none;z-index:99977;opacity:0;border:1px solid rgba(212,175,55,0.11);box-shadow:inset 0 0 24px rgba(212,175,55,0.025),0 0 22px rgba(212,175,55,0.045);transition:opacity 0.3s ease,transform 0.3s ease;`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = "0.5";
      el.style.transform = "scale(1)";
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 400);
      }, rand(900, 1500));
    });
  }

  function fireHexAudit() {
    // Ported from randanime_shield.js — a protocol notice whose text
    // is a generated hex string rather than a fixed line. Reuses the
    // same visual as fireProtocolNotice but is its own pool entry
    // since the content generation is genuinely different.
    const chars = "0123456789ABCDEF";
    let hex = "";
    const len = randInt(8, 16);
    for (let i = 0; i < len; i++) {
      if (i > 0 && i % 4 === 0) hex += " ";
      hex += chars[randInt(0, chars.length - 1)];
    }
    const prefix = pick(["AUTH:", "HASH:", "SIG:", "KEY:", "SEAL:"]);
    const el = document.createElement("div");
    el.className = "si-protocol-notice cyan";
    el.textContent = `${prefix} ${hex}`;
    Object.assign(el.style, cornerPosition());
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity 0.42s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 520);
    }, randInt(1800, 3200));
  }

  // ── MEDIUM TIER — clearly visible, moderate frequency ─────────

  const BLEED_COLORS = [
    "rgba(255,0,0,0.2)", "rgba(0,255,0,0.15)", "rgba(0,0,255,0.18)",
    "rgba(255,0,255,0.12)", "rgba(0,255,255,0.15)", "rgba(255,255,0,0.1)",
  ];
  function fireColorBleed() {
    colorbleed.style.background = pick(BLEED_COLORS);
    colorbleed.style.opacity = "1";
    setTimeout(() => {
      colorbleed.style.transition = "opacity 0.8s";
      colorbleed.style.opacity = "0";
    }, 300);
    setTimeout(() => {
      colorbleed.style.transition = "";
    }, 1200);
  }

  function fireHBar() {
    const h = 20 + Math.random() * 120;
    hbar.style.top = Math.random() * (window.innerHeight - h) + "px";
    hbar.style.height = h + "px";
    hbar.style.opacity = "0.6";
    const shell = document.getElementById("pageShell") || document.body;
    shell.classList.add("si-shaking");
    setTimeout(() => {
      hbar.style.opacity = "0";
      shell.classList.remove("si-shaking");
    }, 200 + Math.random() * 300);
  }

  function fireStampFlash() {
    const stamp = document.createElement("div");
    stamp.className = "si-stamp";
    stamp.textContent = pick(messages.stamps);
    stamp.style.top = rand(15, 70) + "%";
    stamp.style.left = rand(5, 45) + "%";
    stamp.style.transform = `rotate(${rand(-15, 15)}deg)`;
    document.body.appendChild(stamp);
    requestAnimationFrame(() => {
      stamp.style.opacity = "1";
      setTimeout(() => {
        stamp.style.opacity = "0";
        setTimeout(() => stamp.remove(), 220);
      }, rand(1200, 2600));
    });
  }

  function fireEntryWordVerify() {
    // Generalized from randanime_shield.js's own title-flicker effect.
    const title =
      document.getElementById("entryWord") ||
      document.querySelector(".entry-word, .title, h1");
    if (!title) return;
    title.style.transition = "filter 0.2s ease";
    title.style.filter = "brightness(1.15) contrast(1.08)";
    setTimeout(() => {
      title.style.filter = "";
      setTimeout(() => {
        title.style.transition = "";
      }, 300);
    }, 250);
  }

  function fireIntegritySweep() {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:99978;opacity:0;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.48),rgba(92,220,235,0.36),transparent);box-shadow:0 0 12px rgba(212,175,55,0.22);animation:siScanDrop 2.8s linear forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  function fireRGBSplit() {
    const intensity = rand(4, 11);
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:99991;opacity:0.8;`;
    const red = document.createElement("div");
    red.style.cssText = `position:absolute;inset:0;background:rgba(255,0,0,0.14);transform:translate(${intensity}px,0);mix-blend-mode:multiply;`;
    const blue = document.createElement("div");
    blue.style.cssText = `position:absolute;inset:0;background:rgba(0,0,255,0.14);transform:translate(${-intensity}px,0);mix-blend-mode:multiply;`;
    overlay.appendChild(red);
    overlay.appendChild(blue);
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.transition = "opacity 0.15s";
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 200);
    }, rand(120, 260));
  }

  function fireEncryptionBleed() {
    // Ported from randanime_maestro.js — rows of hex/code text
    // scrolling across a horizontal band, like a log dump caught
    // mid-scroll.
    const lines = randInt(2, 5);
    const container = document.createElement("div");
    container.style.cssText = `position:fixed;top:${rand(10, 70)}%;left:0;right:0;pointer-events:none;z-index:99989;overflow:hidden;`;
    const CODE_CHARS = "01{}[]<>/\\|=+-*&^%$#@!?;:.,_~`ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < lines; i++) {
      const line = document.createElement("div");
      const isHex = Math.random() > 0.4;
      const content = isHex
        ? `0x${randInt(0, 0xffffffff).toString(16).toUpperCase()} ERR:${randInt(0, 0xffff).toString(16).toUpperCase()}`
        : Array.from({ length: randInt(28, 55) }, () => CODE_CHARS[randInt(0, CODE_CHARS.length - 1)]).join("");
      const dur = rand(1800, 3200);
      line.textContent = content;
      line.style.cssText = `font-family:'Share Tech Mono',monospace;font-size:${rand(9, 12)}px;color:rgba(184,134,11,${rand(0.28, 0.55)});letter-spacing:0.1em;padding:${rand(1, 3)}px 0;white-space:nowrap;transform:translateX(-110%);`;
      container.appendChild(line);
      setTimeout(() => {
        line.style.transition = `transform ${dur}ms linear`;
        line.style.transform = "translateX(110%)";
      }, i * rand(50, 150));
    }
    document.body.appendChild(container);
    setTimeout(() => {
      container.style.transition = "opacity 0.4s";
      container.style.opacity = "0";
      setTimeout(() => container.remove(), 500);
    }, rand(2500, 3600));
  }

  function fireRedactionAttempt() {
    // Ported from randanime_maestro.js — a black bar drawn over a
    // random real paragraph/spec value already on the page, then
    // retracted. Feature-detects; quietly no-ops if none present.
    const targets = document.querySelectorAll(".section p, .spec-val, .fn-body");
    if (!targets.length) return;
    const target = targets[randInt(0, targets.length - 1)];
    const rect = target.getBoundingClientRect();
    if (!rect.width) return;
    const bar = document.createElement("div");
    bar.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top + rand(0, rect.height * 0.6)}px;width:${rect.width * rand(0.25, 0.85)}px;height:${rand(14, 24)}px;background:#000;pointer-events:none;z-index:99988;opacity:0;transition:opacity 0.06s ease;`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => {
      bar.style.opacity = "1";
      setTimeout(() => {
        bar.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        bar.style.opacity = "0";
        bar.style.transform = "scaleX(0)";
        setTimeout(() => bar.remove(), 400);
      }, rand(400, 900));
    });
  }

  function fireScreenTear() {
    // Ported from randanime_maestro.js — a single sharp tear line
    // with the whole body kicked sideways and snapping back.
    const tearY = rand(15, 85);
    const offset = rand(6, 25);
    const duration = rand(100, 220);
    const tear = document.createElement("div");
    tear.style.cssText = `position:fixed;top:${tearY}%;left:0;right:0;height:${rand(1, 5)}px;background:rgba(255,255,255,0.98);pointer-events:none;z-index:99989;box-shadow:0 0 0 1px rgba(184,134,11,0.2);`;
    document.body.appendChild(tear);
    document.body.style.transition = "none";
    document.body.style.transform = `translateX(${offset}px)`;
    setTimeout(() => {
      document.body.style.transition = `transform ${duration}ms ease`;
      document.body.style.transform = "translateX(0)";
      tear.style.transition = "opacity 0.1s";
      tear.style.opacity = "0";
      setTimeout(() => {
        tear.remove();
        document.body.style.transition = "";
      }, duration + 150);
    }, rand(80, 160));
  }

  function fireDocumentShake() {
    // Ported from randanime_maestro.js — several quick small
    // translations in sequence, distinct from fireHBar's shake since
    // this moves the whole body, not just a page-shell wrapper.
    const shakes = randInt(4, 7);
    let count = 0;
    const shake = () => {
      if (count >= shakes) {
        document.body.style.transform = "";
        return;
      }
      document.body.style.transition = "none";
      document.body.style.transform = `translate(${rand(-4, 4)}px,${rand(-2, 2)}px)`;
      count++;
      setTimeout(shake, rand(28, 60));
    };
    shake();
  }

  // ── LARGE TIER — rare, dramatic, the actual show ───────────────

  const NOISE = "█▓▒░╠╬╣╔╗╚╝║═▲▼◄►◆○●□■?!@#$%^&*<>/\\|{}~`";
  function randomNoise(len) {
    let s = "";
    for (let i = 0; i < len; i++) {
      s += NOISE[Math.floor(Math.random() * NOISE.length)];
      if (i % 38 === 37) s += "\n";
    }
    return s;
  }
  function fireScramble() {
    const shell = document.getElementById("pageShell") || document.body;
    scramble.textContent = randomNoise(380);
    scramble.style.opacity = "1";
    shell.classList.add("si-shaking");
    let ticks = 0;
    const interval = setInterval(() => {
      scramble.textContent = randomNoise(380);
      ticks++;
      if (ticks > 8) {
        clearInterval(interval);
        scramble.style.opacity = "0";
        shell.classList.remove("si-shaking");
      }
    }, 70);
  }

  function fireStatic(intensity) {
    const op = intensity || 0.7;
    staticEl.style.opacity = String(op);
    setTimeout(() => { staticEl.style.opacity = String(op * 0.5); }, 60);
    setTimeout(() => { staticEl.style.opacity = String(op * 0.8); }, 110);
    setTimeout(() => { staticEl.style.opacity = "0"; }, 180);
  }

  function fireFrameRip() {
    rip.style.opacity = "1";
    const splitY = 30 + Math.random() * 40;
    const offset = 8 + Math.random() * 20;
    ripTop.style.top = "0";
    ripTop.style.height = splitY + "vh";
    ripTop.style.transform = `translateX(${offset}px)`;
    ripBot.style.top = splitY + "vh";
    ripBot.style.bottom = "0";
    ripBot.style.transform = `translateX(-${offset}px)`;
    fireStatic(0.4);
    setTimeout(() => {
      ripTop.style.transform = "translateX(0)";
      ripBot.style.transform = "translateX(0)";
      setTimeout(() => {
        rip.style.opacity = "0";
        ripTop.style.height = "0";
      }, 150);
    }, 180 + Math.random() * 200);
  }

  function firePirateMessage() {
    const text = pick(messages.pirateMessages);
    message.textContent = text;
    message.style.color = pick(["#ff3333", "#ffaa00", "#00e5ff", "#00ff88", "#ff0066"]);
    message.style.fontSize = "clamp(16px,4vw,48px)";
    message.style.top = rand(25, 75) + "%";
    message.style.opacity = "1";
    fireStatic(0.3);
    setTimeout(() => {
      message.style.transition = "opacity 0.3s";
      message.style.opacity = "0";
    }, 600 + Math.random() * 400);
    setTimeout(() => { message.style.transition = ""; }, 1200);
  }

  // NEW — the discussed "pirate station ID" moment. Distinct from
  // firePirateMessage: this cycles two lines in sequence (station,
  // then interrupt line) rather than a single flash, closer to an
  // actual station-ID break than a glitch-text flash.
  function firePirateStationID() {
    const lines = messages.stationID;
    let i = 0;
    function showLine() {
      if (i >= lines.length) {
        setTimeout(() => {
          message.style.transition = "opacity 0.4s";
          message.style.opacity = "0";
        }, 700);
        return;
      }
      message.textContent = lines[i];
      message.style.color = "#ffaa00";
      message.style.fontSize = "clamp(14px,3vw,32px)";
      message.style.top = "50%";
      message.style.transition = "";
      message.style.opacity = "1";
      i++;
      setTimeout(showLine, 850);
    }
    fireStatic(0.5);
    showLine();
  }

  function fireSuppressionWarning() {
    const warn = document.createElement("div");
    warn.className = "si-warning";
    warn.textContent = pick(messages.suppressionWarnings);
    warn.style.top = rand(20, 60) + "%";
    document.body.appendChild(warn);
    requestAnimationFrame(() => {
      warn.style.opacity = "1";
      setTimeout(() => {
        warn.style.opacity = "0";
        setTimeout(() => warn.remove(), 180);
      }, rand(700, 1400));
    });
  }

  function fireLockdownFlicker() {
    lockdown.style.transition = "none";
    lockdown.style.opacity = "0.16";
    setTimeout(() => {
      lockdown.style.transition = "opacity 0.5s ease";
      lockdown.style.opacity = "0";
    }, 180);
    fireProtocolNoticeForced("red");
  }
  function fireProtocolNoticeForced(tone) {
    const pool = tone === "red" ? messages.protocolRed : messages.protocolGold;
    const el = document.createElement("div");
    el.className = "si-protocol-notice " + tone;
    el.textContent = pick(pool);
    Object.assign(el.style, cornerPosition());
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }, 2200);
  }

  // NEW — the discussed "jamming" freeze-frame-plus-static-burst that
  // snaps back like a yanked cable. Different rhythm from fireStatic:
  // a hard freeze (no transition) then an abrupt release, not a fade.
  function fireJammingFreeze() {
    const shell = document.getElementById("pageShell") || document.body;
    shell.style.transition = "none";
    shell.style.filter = "brightness(0.3) contrast(1.6) saturate(0)";
    fireStatic(1.0);
    setTimeout(() => {
      shell.style.filter = "";
    }, 220 + Math.random() * 180);
  }

  function fireFullMeltdown() {
    fireStatic(1.0);
    setTimeout(fireColorBleed, 80);
    setTimeout(fireHBar, 100);
    setTimeout(fireScanline, 120);
    setTimeout(fireScramble, 200);
    setTimeout(() => fireStatic(0.6), 500);
    setTimeout(() => {
      if (Math.random() > 0.5) firePirateStationID();
      else fireSuppressionWarning();
    }, 800);
  }

  function fireSignalDropout() {
    // Ported from randanime_maestro.js — rapid opacity/brightness
    // flicker on the whole body, distinct from lockdown's steady red
    // wash. Reads as the signal itself cutting in and out.
    const flickers = randInt(3, 6);
    let count = 0;
    const flick = () => {
      if (count >= flickers) {
        document.body.style.opacity = "1";
        document.body.style.filter = "";
        return;
      }
      const isOut = count % 2 === 0;
      document.body.style.transition = "none";
      document.body.style.opacity = isOut ? String(rand(0.1, 0.4)) : "1";
      document.body.style.filter = isOut
        ? `brightness(${rand(1.5, 2.5)}) contrast(${rand(0.5, 1.3)})`
        : "";
      count++;
      setTimeout(flick, rand(40, 100));
    };
    flick();
  }

  function fireEndOfBroadcast() {
    // Ported from ambient-glitch.js — "the main event." A full-screen
    // PLEASE STAND BY card, genuinely one of the strongest single
    // effects across the four old scripts per the 178 brief's own
    // read on it. Builds and reuses its own card across firings
    // rather than recreating the DOM every time.
    let psb = document.getElementById("si-psb");
    if (!psb) {
      psb = document.createElement("div");
      psb.id = "si-psb";
      psb.style.cssText = `position:fixed;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99997;opacity:0;pointer-events:none;font-family:'VT323',monospace;transition:opacity 0.08s;`;
      psb.innerHTML = `
        <div style="color:#d4af37;font-size:clamp(11px,2vw,15px);letter-spacing:0.4em;margin-bottom:1.2em;opacity:0.7;">CHANNEL 7 · BROADCAST NETWORK</div>
        <div style="color:#d4af37;font-size:clamp(28px,7vw,64px);letter-spacing:0.25em;text-align:center;line-height:1.1;">PLEASE<br>STAND BY</div>
        <div style="color:#d4af37;font-size:clamp(10px,1.8vw,14px);letter-spacing:0.5em;margin-top:1.4em;opacity:0.6;">CHANNEL 7 WILL RETURN SHORTLY</div>
      `;
      document.body.appendChild(psb);
    }
    fireStatic(0.9);
    setTimeout(() => {
      psb.style.opacity = "1";
      const holdTime = 1800 + Math.random() * 1200;
      setTimeout(() => {
        fireStatic(0.9);
        setTimeout(() => {
          psb.style.opacity = "0";
        }, 200);
      }, holdTime);
    }, 150);
  }

  // ── INERT STUBS — real assets not yet supplied, do not fake ────

  let cassetteHissWarned = false;
  function fireCassetteHiss() {
    if (!cassetteHissWarned) {
      console.info(
        "[signal-interference] fireCassetteHiss: no audio asset wired yet — inert stub. Not added to any tier's pool.",
      );
      cassetteHissWarned = true;
    }
  }
  let maskedGlimpseWarned = false;
  function fireMaskedGlimpse() {
    if (!maskedGlimpseWarned) {
      console.info(
        "[signal-interference] fireMaskedGlimpse: no art asset wired yet — inert stub. Not added to any tier's pool.",
      );
      maskedGlimpseWarned = true;
    }
  }

  // ── TIER POOLS ──────────────────────────────────────────────────

  const POOLS = {
    small: [
      fireScanline,
      fireProtocolNotice,
      firePaperShift,
      fireSealPulse,
      fireInkBleed,
      fireDoubleScan,
      fireLedgerPulse,
      fireHexAudit,
    ],
    medium: [
      fireColorBleed,
      fireHBar,
      fireStampFlash,
      fireEntryWordVerify,
      fireIntegritySweep,
      fireRGBSplit,
      fireEncryptionBleed,
      fireRedactionAttempt,
      fireScreenTear,
      fireDocumentShake,
    ],
    large: [
      fireScramble,
      fireFrameRip,
      firePirateMessage,
      firePirateStationID,
      fireSuppressionWarning,
      fireLockdownFlicker,
      fireJammingFreeze,
      fireFullMeltdown,
      fireSignalDropout,
      fireEndOfBroadcast,
    ],
  };

  // ── SCHEDULER ─────────────────────────────────────────────────
  // Per-tier absolute floor (never fires faster than this no matter
  // how high the page's weight is set) plus a base range at weight
  // 1.0. A page's weight scales how close to the floor the effective
  // range sits: higher weight = tighter/more frequent, lower weight =
  // looser/rarer. Weight 0 disables the tier outright.

  const TIER_FLOOR_MS = { small: 3000, medium: 6000, large: 12000 };
  const TIER_BASE_RANGE_MS = {
    small: [4000, 11000],
    medium: [9000, 24000],
    large: [20000, 55000],
  };

  function effectiveRange(tier, weight) {
    const floor = TIER_FLOOR_MS[tier];
    const [baseMin, baseMax] = TIER_BASE_RANGE_MS[tier];
    const w = Math.max(0.05, Math.min(1, weight));
    // At weight 1.0: full base range. As weight drops toward 0.05,
    // the range widens (rarer), but min never drops below the floor.
    const min = Math.max(floor, baseMin);
    const max = Math.max(min + 1000, baseMax / w);
    return [min, max];
  }

  function scheduleTier(tier) {
    const weight = mix[tier];
    if (!weight || weight <= 0) return; // tier disabled on this page
    const pool = POOLS[tier];
    const [minMs, maxMs] = effectiveRange(tier, weight);

    function fire() {
      const delay = randInt(minMs, maxMs);
      setTimeout(() => {
        if (safeToRun()) {
          try {
            pick(pool)();
          } catch (e) {
            // A single misbehaving effect should never take down the
            // whole scheduler for the rest of the page's lifetime.
            console.warn("[signal-interference] effect threw:", e);
          }
        }
        fire();
      }, delay);
    }
    // Stagger first fire per tier so all three don't open in unison.
    const firstDelay = tier === "small" ? rand(2000, 5000)
      : tier === "medium" ? rand(6000, 12000)
      : rand(15000, 28000);
    setTimeout(fire, firstDelay);
  }

  scheduleTier("small");
  scheduleTier("medium");
  scheduleTier("large");

  // Exposed for debugging/tuning from the console on a trial page —
  // not part of the public API, just makes hand-testing pacing easier.
  window.__signalInterference = { fire: { small: () => pick(POOLS.small)(), medium: () => pick(POOLS.medium)(), large: () => pick(POOLS.large)() }, mix, POOLS };
})();
