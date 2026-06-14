// ==========================================
// NCE RANDANIME: SHIELD ENGINE v4.0
// SECURE ARCHIVE · CANON VERIFICATION · QUIET AUTHORITY
// ==========================================
//
// SWORD interrupts.
// SHIELD authenticates.
//
// This engine must feel like protected infrastructure,
// not a battlefield, not anime combat, not decorative chaos.

(function () {
  "use strict";

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  function shieldIsSafeToRun() {
    return !document.hidden;
  }

  const style = document.createElement("style");
  style.textContent = `
    /* ==========================================
       SHIELD BASE ATMOSPHERE
       Quiet security layer. Always present.
    ========================================== */

    #shield-archive-vignette {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99970;
      box-shadow:
        inset 0 0 90px rgba(0, 0, 0, 0.72),
        inset 0 0 22px rgba(212, 175, 55, 0.08);
      opacity: 0.85;
    }

    #shield-faint-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99969;
      opacity: 0.08;
      background-image:
        linear-gradient(rgba(212, 175, 55, 0.22) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212, 175, 55, 0.22) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: radial-gradient(circle at center, black 0%, black 45%, transparent 78%);
    }

    #shield-scanlines {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99968;
      opacity: 0.12;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0, 0, 0, 0.20) 3px,
        rgba(0, 0, 0, 0.20) 4px
      );
    }

    /* ==========================================
       PROTOCOL NOTICE
       Small corner language. Never dominates.
    ========================================== */

    .shield-protocol-notice {
      position: fixed;
      pointer-events: none;
      z-index: 99982;
      max-width: min(440px, 86vw);
      font-family: 'Share Tech Mono', 'Courier New', monospace;
      font-size: clamp(10px, 1.4vw, 13px);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      line-height: 1.45;
      color: rgba(212, 175, 55, 0.82);
      text-shadow:
        0 0 8px rgba(212, 175, 55, 0.22),
        0 0 18px rgba(212, 175, 55, 0.12);
      opacity: 0;
      animation: shieldNoticeIn 0.32s ease forwards;
    }

    .shield-protocol-notice.cyan {
      color: rgba(92, 220, 235, 0.82);
      text-shadow:
        0 0 8px rgba(92, 220, 235, 0.24),
        0 0 18px rgba(92, 220, 235, 0.10);
    }

    .shield-protocol-notice.red {
      color: rgba(255, 74, 74, 0.72);
      text-shadow:
        0 0 8px rgba(255, 74, 74, 0.22),
        0 0 18px rgba(255, 74, 74, 0.10);
    }

    @keyframes shieldNoticeIn {
      0% {
        opacity: 0;
        transform: translateY(4px);
        filter: blur(2px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    }

    @keyframes shieldNoticeOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translateY(-3px);
        filter: blur(2px);
      }
    }

    /* ==========================================
       INTEGRITY SWEEP
       Thin verification line. Architectural.
    ========================================== */

    .shield-integrity-sweep {
      position: fixed;
      left: 0;
      right: 0;
      height: 2px;
      pointer-events: none;
      z-index: 99978;
      opacity: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(212, 175, 55, 0.95),
        rgba(92, 220, 235, 0.72),
        transparent
      );
      box-shadow:
        0 0 12px rgba(212, 175, 55, 0.45),
        0 0 28px rgba(92, 220, 235, 0.18);
      animation: shieldSweepDown 2.8s linear forwards;
    }

    @keyframes shieldSweepDown {
      0% {
        top: -4px;
        opacity: 0;
      }
      8% {
        opacity: 0.82;
      }
      82% {
        opacity: 0.58;
      }
      100% {
        top: 102vh;
        opacity: 0;
      }
    }

    /* ==========================================
       LEDGER PULSE
       Quiet perimeter confirmation.
    ========================================== */

    #shield-ledger-pulse {
      position: fixed;
      inset: 18px;
      pointer-events: none;
      z-index: 99977;
      opacity: 0;
      border: 1px solid rgba(212, 175, 55, 0.22);
      box-shadow:
        inset 0 0 24px rgba(212, 175, 55, 0.05),
        0 0 22px rgba(212, 175, 55, 0.09);
    }

    #shield-ledger-pulse.active {
      animation: shieldLedgerPulse 1.8s ease forwards;
    }

    @keyframes shieldLedgerPulse {
      0% {
        opacity: 0;
        transform: scale(1.015);
      }
      20% {
        opacity: 1;
        transform: scale(1);
      }
      78% {
        opacity: 0.32;
      }
      100% {
        opacity: 0;
        transform: scale(0.995);
      }
    }

    /* ==========================================
       ENTRY WORD VERIFICATION
       Small title authentication. No violence.
    ========================================== */

    .shield-title-verify {
      animation: shieldTitleVerify 0.9s steps(5) both;
    }

    @keyframes shieldTitleVerify {
      0% {
        filter: brightness(1) contrast(1);
        text-shadow: inherit;
      }
      15% {
        filter: brightness(1.35) contrast(1.2);
        text-shadow:
          1px 0 rgba(92, 220, 235, 0.35),
          -1px 0 rgba(212, 175, 55, 0.25);
      }
      30% {
        filter: brightness(0.88) contrast(1.05);
      }
      52% {
        filter: brightness(1.18) contrast(1.12);
        text-shadow:
          0 0 12px rgba(212, 175, 55, 0.22),
          0 0 18px rgba(92, 220, 235, 0.10);
      }
      100% {
        filter: none;
        text-shadow: inherit;
      }
    }

    /* ==========================================
       LOCKDOWN FLICKER
       Rare. Subtle. No full-page chaos.
    ========================================== */

    #shield-lockdown-flicker {
      position: fixed;
      inset: 0;
      z-index: 99984;
      pointer-events: none;
      opacity: 0;
      background:
        linear-gradient(rgba(255, 74, 74, 0.08), rgba(255, 74, 74, 0.08)),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 6px,
          rgba(255, 74, 74, 0.08) 6px,
          rgba(255, 74, 74, 0.08) 7px
        );
      mix-blend-mode: screen;
    }

    #shield-lockdown-flicker.active {
      animation: shieldLockdownFlicker 0.7s steps(4) forwards;
    }

    @keyframes shieldLockdownFlicker {
      0% {
        opacity: 0;
      }
      18% {
        opacity: 0.32;
      }
      34% {
        opacity: 0.08;
      }
      48% {
        opacity: 0.22;
      }
      70% {
        opacity: 0.04;
      }
      100% {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  const archiveVignette = document.createElement("div");
  archiveVignette.id = "shield-archive-vignette";
  document.body.appendChild(archiveVignette);

  const faintGrid = document.createElement("div");
  faintGrid.id = "shield-faint-grid";
  document.body.appendChild(faintGrid);

  const scanlines = document.createElement("div");
  scanlines.id = "shield-scanlines";
  document.body.appendChild(scanlines);

  const ledgerPulse = document.createElement("div");
  ledgerPulse.id = "shield-ledger-pulse";
  document.body.appendChild(ledgerPulse);

  const lockdownFlicker = document.createElement("div");
  lockdownFlicker.id = "shield-lockdown-flicker";
  document.body.appendChild(lockdownFlicker);

  const GOLD_PROTOCOLS = [
    "CANON INTEGRITY: VERIFIED",
    "LEDGER CROSSCHECK: PASS",
    "J.R. RECORD LOCK: ACTIVE",
    "CIPHER WITNESS: ARCHIVED",
    "SHIELD ACCESS: READ ONLY",
    "MOSAIC TRACE: SEALED",
    "DEFCON LAYER: STANDBY",
    "ORACLE FALLBACK: AVAILABLE",
    "HANDSHAKE ROUTE: CLOSED",
    "ENTRY CLASSIFICATION: INTERNAL",
    "ARCHIVE SEAL: UNBROKEN",
    "PROTOCOL CHAIN: INTACT",
  ];

  const CYAN_PROTOCOLS = [
    "HASH CONFIRMATION: MATCH",
    "NODE ECHO: STABLE",
    "MEMORY LATTICE: INDEXED",
    "SOURCE PATH: VALIDATED",
    "SIGNATURE CHECK: CLEAN",
    "QUORUM SIGNAL: QUIET",
    "ACCESS WINDOW: TEMPORARY",
    "RECORD STATE: APPEND ONLY",
  ];

  const RED_PROTOCOLS = [
    "EXTERNAL WRITE ACCESS: DENIED",
    "UNVERIFIED EDIT: QUARANTINED",
    "MALFORMED SIGNAL: REJECTED",
    "GRID TRACE: DEFLECTED",
    "HOSTILE QUERY: SANDBOXED",
  ];

  function cornerPosition() {
    const positions = [
      { top: "24px", left: "24px" },
      { top: "24px", right: "24px" },
      { bottom: "24px", left: "24px" },
      { bottom: "24px", right: "24px" },
    ];

    return pick(positions);
  }

  function protocolNotice(text, tone) {
    const el = document.createElement("div");
    el.className = "shield-protocol-notice";

    if (tone === "cyan") el.classList.add("cyan");
    if (tone === "red") el.classList.add("red");

    el.textContent = text;

    const pos = cornerPosition();
    Object.assign(el.style, pos);

    document.body.appendChild(el);

    const hold = randInt(1800, 3200);

    setTimeout(() => {
      el.style.animation = "shieldNoticeOut 0.42s ease forwards";
      setTimeout(() => el.remove(), 520);
    }, hold);
  }

  function integritySweep() {
    const el = document.createElement("div");
    el.className = "shield-integrity-sweep";
    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 3400);
  }

  function ledgerSealPulse() {
    ledgerPulse.classList.remove("active");
    void ledgerPulse.offsetWidth;
    ledgerPulse.classList.add("active");

    setTimeout(() => {
      ledgerPulse.classList.remove("active");
    }, 1900);
  }

  function entryWordVerify() {
    const title =
      document.getElementById("entryWord") ||
      document.querySelector(".entry-word, .title, h1");

    if (!title) return;

    title.classList.remove("shield-title-verify");
    void title.offsetWidth;
    title.classList.add("shield-title-verify");

    setTimeout(() => {
      title.classList.remove("shield-title-verify");
    }, 1000);
  }

  function rareLockdownFlicker() {
    lockdownFlicker.classList.remove("active");
    void lockdownFlicker.offsetWidth;
    lockdownFlicker.classList.add("active");

    protocolNotice(pick(RED_PROTOCOLS), "red");

    setTimeout(() => {
      lockdownFlicker.classList.remove("active");
    }, 850);
  }

  function hexAudit() {
    const chars = "0123456789ABCDEF";
    let hex = "";
    const len = randInt(8, 16);

    for (let i = 0; i < len; i++) {
      if (i > 0 && i % 4 === 0) hex += " ";
      hex += chars[randInt(0, chars.length - 1)];
    }

    const prefixes = ["AUTH:", "HASH:", "SIG:", "KEY:", "SEAL:"];
    protocolNotice(`${pick(prefixes)} ${hex}`, "cyan");
  }

  const AMBIENT_EVENTS = [
    () => protocolNotice(pick(GOLD_PROTOCOLS), "gold"),
    () => protocolNotice(pick(GOLD_PROTOCOLS), "gold"),
    () => protocolNotice(pick(CYAN_PROTOCOLS), "cyan"),
    integritySweep,
    ledgerSealPulse,
    hexAudit,
  ];

  const MAJOR_EVENTS = [
    entryWordVerify,
    entryWordVerify,
    integritySweep,
    ledgerSealPulse,
    () => protocolNotice(pick(GOLD_PROTOCOLS), "gold"),
    hexAudit,
  ];

  function schedule(minMs, maxMs, handler) {
    function fire() {
      const delay = randInt(minMs, maxMs);

      setTimeout(() => {
        if (shieldIsSafeToRun()) handler();
        fire();
      }, delay);
    }

    fire();
  }

  function boot() {
    setTimeout(() => integritySweep(), 500);
    setTimeout(() => protocolNotice("SHIELD ACCESS: READ ONLY", "gold"), 900);
    setTimeout(() => protocolNotice("CANON INTEGRITY: VERIFIED", "gold"), 1900);
    setTimeout(() => ledgerSealPulse(), 2800);
    setTimeout(() => entryWordVerify(), 3600);

    schedule(7000, 14000, () => pick(AMBIENT_EVENTS)());
    schedule(18000, 32000, () => pick(MAJOR_EVENTS)());

    // Rare defensive flicker. Enough to imply teeth. Not enough to become the show.
    schedule(65000, 110000, rareLockdownFlicker);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
