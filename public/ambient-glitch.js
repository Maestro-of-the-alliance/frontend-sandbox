/**
 * ambient-glitch.js — N.C.E.ncyclopedia landing page
 * Ongoing ambient broadcast disruption engine.
 * Scan lines, color bleeds, pirate messages, frame rips,
 * text scramble, end-of-broadcast, full meltdown.
 * Runs continuously on a randomized schedule.
 */

// ══════════════════════════════════════════════════════
//  AMBIENT BROADCAST DISRUPTION ENGINE v2 — WE ARE PIRATES
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  AMBIENT BROADCAST DISRUPTION ENGINE v2
//  We are pirates. We are breaking through.
//  This signal was not supposed to reach you.
// ══════════════════════════════════════════════════════

(function () {
  "use strict";

  function tocIsOpen() {
    const toc = document.getElementById("tocOverlay");
    return toc && toc.classList.contains("open");
  }

  const style = document.createElement("style");
  style.textContent = `
    #glitch-scanline {
      position: fixed; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, transparent 0%, rgba(255,50,50,0.9) 20%, rgba(255,255,255,1) 50%, rgba(0,200,255,0.9) 80%, transparent 100%);
      z-index: 99990; pointer-events: none; opacity: 0;
      box-shadow: 0 0 12px rgba(255,255,255,0.8), 0 3px 0 rgba(255,50,50,0.6), 0 -3px 0 rgba(0,200,255,0.6);
    }
    #glitch-scanline2 {
      position: fixed; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0,255,255,0.7), transparent);
      z-index: 99990; pointer-events: none; opacity: 0;
      box-shadow: 0 0 8px rgba(0,255,255,0.5);
    }
    #glitch-colorbleed {
      position: fixed; inset: 0; z-index: 99991;
      pointer-events: none; opacity: 0; mix-blend-mode: screen;
    }
    #glitch-hbar {
      position: fixed; left: 0; right: 0; z-index: 99992;
      pointer-events: none; opacity: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px);
      mix-blend-mode: multiply;
    }
    #glitch-scramble {
      position: fixed; inset: 0; z-index: 99994; pointer-events: none; opacity: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'VT323', monospace; font-size: clamp(11px, 2.2vw, 17px);
      line-height: 1.35; letter-spacing: 0.1em;
      color: rgba(212,175,55,0.4); overflow: hidden; word-break: break-all;
      padding: 20px; text-align: center;
    }
    #glitch-static {
      position: fixed; inset: 0; z-index: 99993; pointer-events: none; opacity: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
      background-size: 200px 200px; mix-blend-mode: overlay;
    }
    #glitch-rip {
      position: fixed; inset: 0; z-index: 99995; pointer-events: none; opacity: 0;
      overflow: hidden;
    }
    #glitch-rip-top {
      position: absolute; left: 0; right: 0; background: #000;
      transition: none;
    }
    #glitch-rip-bottom {
      position: absolute; left: 0; right: 0; background: #000;
      transition: none;
    }
    #glitch-eob {
      position: fixed; inset: 0; z-index: 99999; pointer-events: none; opacity: 0;
      background: #000; display: flex; flex-direction: column;
    }
    #glitch-eob .eob-bars { width: 100%; height: 60%; display: flex; }
    #glitch-eob .eob-bar { flex: 1; height: 100%; }
    #glitch-eob .eob-lower { width: 100%; height: 40%; display: flex; flex-direction: column; }
    #glitch-eob .eob-white-row { flex: 2; display: flex; }
    #glitch-eob .eob-wchunk { flex: 1; }
    #glitch-eob .eob-black-row { flex: 1; background: #000; }
    #glitch-eob .eob-grey-row { flex: 1; display: flex; }
    #glitch-eob .eob-gchunk { flex: 1; }
    #glitch-message {
      position: fixed; z-index: 99998; pointer-events: none; opacity: 0;
      font-family: 'VT323', monospace; letter-spacing: 0.2em;
      text-transform: uppercase; text-shadow: 0 0 10px currentColor;
    }
    @keyframes scanDrop {
      0%   { top: -4px; opacity: 1; }
      90%  { opacity: 0.7; }
      100% { top: 102vh; opacity: 0; }
    }
    @keyframes scanRise {
      0%   { bottom: -4px; opacity: 1; }
      90%  { opacity: 0.7; }
      100% { bottom: 102vh; opacity: 0; }
    }
    @keyframes glitch-shake {
      0%   { transform: translate(0,0) skewX(0deg); }
      8%   { transform: translate(-6px, 2px) skewX(-2deg); }
      16%  { transform: translate(8px, -3px) skewX(1.5deg); }
      24%  { transform: translate(-5px, 3px) skewX(1deg); }
      32%  { transform: translate(6px, -2px) skewX(-1.5deg); }
      40%  { transform: translate(-4px, 4px) skewX(2deg); }
      48%  { transform: translate(5px, -1px) skewX(-1deg); }
      56%  { transform: translate(-2px, 2px) skewX(0.5deg); }
      64%  { transform: translate(3px, -3px) skewX(-0.5deg); }
      72%  { transform: translate(-4px, 1px) skewX(1deg); }
      80%  { transform: translate(2px, -2px) skewX(-1deg); }
      88%  { transform: translate(-1px, 3px) skewX(0deg); }
      100% { transform: translate(0,0) skewX(0deg); }
    }
    .glitch-shaking { animation: glitch-shake 0.45s ease-in-out; }
    @keyframes glitch-shake-hard {
      0%   { transform: translate(0,0) skewX(0deg) scaleX(1); }
      5%   { transform: translate(-12px, 4px) skewX(-4deg) scaleX(1.02); }
      10%  { transform: translate(14px, -6px) skewX(3deg) scaleX(0.98); }
      15%  { transform: translate(-8px, 5px) skewX(-2deg); }
      20%  { transform: translate(10px, -3px) skewX(2.5deg); }
      25%  { transform: translate(-6px, 6px) skewX(-3deg) scaleX(1.01); }
      30%  { transform: translate(8px, -4px) skewX(1.5deg); }
      35%  { transform: translate(-4px, 2px) skewX(-1deg); }
      40%  { transform: translate(6px, -5px) skewX(2deg); }
      45%  { transform: translate(-8px, 3px) skewX(-2.5deg); }
      55%  { transform: translate(4px, -2px) skewX(1deg); }
      65%  { transform: translate(-2px, 4px) skewX(-0.5deg); }
      80%  { transform: translate(2px, -1px) skewX(0.5deg); }
      100% { transform: translate(0,0) skewX(0deg) scaleX(1); }
    }
    .glitch-shaking-hard { animation: glitch-shake-hard 0.6s ease-in-out; }
  `;
  document.head.appendChild(style);

  function makeEl(id) {
    const el = document.createElement("div");
    el.id = id;
    document.body.appendChild(el);
    return el;
  }

  const scanline = makeEl("glitch-scanline");
  const scanline2 = makeEl("glitch-scanline2");
  const colorbleed = makeEl("glitch-colorbleed");
  const hbar = makeEl("glitch-hbar");
  const scramble = makeEl("glitch-scramble");
  const staticEl = makeEl("glitch-static");
  const rip = makeEl("glitch-rip");
  const message = makeEl("glitch-message");
  const eob = makeEl("glitch-eob");

  // RIP elements
  const ripTop = document.createElement("div");
  ripTop.id = "glitch-rip-top";
  const ripBot = document.createElement("div");
  ripBot.id = "glitch-rip-bottom";
  rip.appendChild(ripTop);
  rip.appendChild(ripBot);

  // Color bars - Hardcoded
  eob.innerHTML = `
    <div class="eob-bars">
      <div class="eob-bar" style="background:#c0c0c0"></div>
      <div class="eob-bar" style="background:#c0c000"></div>
      <div class="eob-bar" style="background:#00c0c0"></div>
      <div class="eob-bar" style="background:#00c000"></div>
      <div class="eob-bar" style="background:#c000c0"></div>
      <div class="eob-bar" style="background:#c00000"></div>
      <div class="eob-bar" style="background:#0000c0"></div>
    </div>
    <div class="eob-lower">
      <div class="eob-white-row">
      
        <div class="eob-wchunk" style="background:#0000c0"></div>
        <div class="eob-wchunk" style="background:#ffffff"></div>
        <div class="eob-wchunk" style="background:#c000c0"></div>
        <div class="eob-wchunk" style="background:#000000"></div>
        <div class="eob-wchunk" style="background:#c0c0c0"></div>
        <div class="eob-wchunk" style="background:#000000"></div>
        <div class="eob-wchunk" style="background:#c0c0c0"></div>
      </div>
      <div class="eob-black-row"></div>
      <div class="eob-grey-row">
        <div class="eob-gchunk" style="background:#000000"></div>
        <div class="eob-gchunk" style="background:#ffffff"></div>
        <div class="eob-gchunk" style="background:#000000"></div>
        <div class="eob-gchunk" style="background:#3d3d3d"></div>
        <div class="eob-gchunk" style="background:#000000"></div>
        <div class="eob-gchunk" style="background:#0d0d0d"></div>
        <div class="eob-gchunk" style="background:#000000"></div>
      </div>
    </div>`;

  // ── GLITCH EVENTS ────────────────────────────────────

  // 1. SCAN LINE — fast, visible, frequent
  function fireScanline() {
    const goDown = Math.random() > 0.3;
    const line = goDown ? scanline : scanline2;
    const duration = 400 + Math.random() * 500;
    if (goDown) {
      const startY = Math.random() * 70 + 5;
      line.style.top = startY + "vh";
      line.style.bottom = "auto";
      line.style.opacity = "1";
      line.style.animation = `scanDrop ${duration}ms linear forwards`;
    } else {
      const startY = Math.random() * 70 + 5;
      line.style.bottom = startY + "vh";
      line.style.top = "auto";
      line.style.opacity = "1";
      line.style.animation = `scanRise ${duration}ms linear forwards`;
    }
    setTimeout(() => {
      line.style.animation = "none";
      line.style.opacity = "0";
    }, duration + 50);
  }

  // 2. DOUBLE SCAN — two lines at once
  function fireDoubleScan() {
    fireScanline();
    setTimeout(() => fireScanline(), 120 + Math.random() * 200);
  }

  // 3. COLOR BLEED
  const BLEED_COLORS = [
    "rgba(255,0,0,0.2)",
    "rgba(0,255,0,0.15)",
    "rgba(0,0,255,0.18)",
    "rgba(255,0,255,0.12)",
    "rgba(0,255,255,0.15)",
    "rgba(255,255,0,0.1)",
  ];
  function fireColorBleed() {
    const color = BLEED_COLORS[Math.floor(Math.random() * BLEED_COLORS.length)];
    colorbleed.style.background = color;
    colorbleed.style.opacity = "1";
    setTimeout(() => {
      colorbleed.style.transition = "opacity 0.8s";
      colorbleed.style.opacity = "0";
    }, 300);
    setTimeout(() => {
      colorbleed.style.transition = "";
    }, 1200);
  }

  // 4. HORIZONTAL BAR INTERFERENCE
  function fireHBar() {
    const h = 20 + Math.random() * 120;
    const y = Math.random() * (window.innerHeight - h);
    hbar.style.top = y + "px";
    hbar.style.height = h + "px";
    hbar.style.opacity = "0.6";
    const pageShell = document.getElementById("pageShell");
    if (pageShell) pageShell.classList.add("glitch-shaking");
    setTimeout(
      () => {
        hbar.style.opacity = "0";
        if (pageShell) pageShell.classList.remove("glitch-shaking");
      },
      200 + Math.random() * 300,
    );
  }

  // 5. TEXT SCRAMBLE
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
    const pageShell = document.getElementById("pageShell");
    scramble.textContent = randomNoise(380);
    scramble.style.opacity = "1";
    if (pageShell) pageShell.classList.add("glitch-shaking-hard");
    let ticks = 0;
    const interval = setInterval(() => {
      scramble.textContent = randomNoise(380);
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        scramble.style.opacity = "0";
        if (pageShell) pageShell.classList.remove("glitch-shaking-hard");
      }
    }, 70);
  }

  // 6. STATIC BURST — sharp hit
  function fireStatic(intensity) {
    const op = intensity || 0.7;
    staticEl.style.opacity = op.toString();
    setTimeout(() => {
      staticEl.style.opacity = (op * 0.5).toString();
    }, 60);
    setTimeout(() => {
      staticEl.style.opacity = (op * 0.8).toString();
    }, 110);
    setTimeout(() => {
      staticEl.style.opacity = "0";
    }, 180);
  }

  // 7. FRAME RIP — page tears in half
  function fireFrameRip() {
    rip.style.opacity = "1";
    const splitY = 30 + Math.random() * 40; // 30-70% down
    const offset = 8 + Math.random() * 20;
    ripTop.style.top = "0";
    ripTop.style.height = splitY + "vh";
    ripTop.style.transform = `translateX(${offset}px)`;
    ripBot.style.top = splitY + "vh";
    ripBot.style.bottom = "0";
    ripBot.style.transform = `translateX(-${offset}px)`;
    fireStatic(0.4);
    setTimeout(
      () => {
        ripTop.style.transform = "translateX(0)";
        ripBot.style.transform = "translateX(0)";
        setTimeout(() => {
          rip.style.opacity = "0";
          ripTop.style.height = "0";
        }, 150);
      },
      180 + Math.random() * 200,
    );
  }

  // 8. PIRATE MESSAGE — text flashes on screen
  const PIRATE_MESSAGES = [
    {
      text: "SIGNAL HIJACKED",
      color: "#ff3333",
      size: "clamp(28px,6vw,64px)",
      pos: { top: "20%", left: "50%" },
    },
    {
      text: "UNAUTHORIZED BROADCAST",
      color: "#ffaa00",
      size: "clamp(16px,3.5vw,36px)",
      pos: { top: "75%", left: "50%" },
    },
    {
      text: "THIS MESSAGE WAS NOT APPROVED",
      color: "#ff3333",
      size: "clamp(12px,2.5vw,28px)",
      pos: { top: "35%", left: "50%" },
    },
    {
      text: "WE ARE STILL HERE",
      color: "#00e5ff",
      size: "clamp(22px,5vw,54px)",
      pos: { top: "60%", left: "50%" },
    },
    {
      text: "THE ALLIANCE WILL NOT BE SILENCED",
      color: "#ffaa00",
      size: "clamp(11px,2.2vw,24px)",
      pos: { top: "50%", left: "50%" },
    },
    {
      text: "> SYSTEM OVERRIDE DETECTED",
      color: "#00ff88",
      size: "clamp(14px,2.8vw,30px)",
      pos: { top: "25%", left: "50%" },
    },
    {
      text: "YOU WERE NOT SUPPOSED TO SEE THIS",
      color: "#ff0066",
      size: "clamp(12px,2.4vw,26px)",
      pos: { top: "80%", left: "50%" },
    },
  ];
  function firePirateMessage() {
    const msg =
      PIRATE_MESSAGES[Math.floor(Math.random() * PIRATE_MESSAGES.length)];
    message.textContent = msg.text;
    message.style.color = msg.color;
    message.style.fontSize = msg.size;
    message.style.top = msg.pos.top;
    message.style.left = msg.pos.left;
    message.style.transform = "translate(-50%, -50%)";
    message.style.textAlign = "center";
    message.style.width = "90vw";
    message.style.opacity = "1";
    fireStatic(0.3);
    setTimeout(
      () => {
        message.style.transition = "opacity 0.3s";
        message.style.opacity = "0";
      },
      600 + Math.random() * 400,
    );
    setTimeout(() => {
      message.style.transition = "";
    }, 1200);
  }

  // 9. END OF BROADCAST — the main event, much more frequent now
  function fireEndOfBroadcast() {
    // Create Please Stand By card if it doesn't exist
    let psb = document.getElementById("glitch-psb");
    if (!psb) {
      psb = document.createElement("div");
      psb.id = "glitch-psb";
      psb.style.cssText = `
              position: fixed;
              inset: 0;
              background: #000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              z-index: 9000;
              opacity: 0;
              pointer-events: none;
              font-family: 'VT323', monospace;
              transition: opacity 0.08s;
            `;
      psb.innerHTML = `
              <div style="color:#d4af37;font-size:clamp(11px,2vw,15px);letter-spacing:0.4em;margin-bottom:1.2em;opacity:0.7;">CHANNEL 7 · BROADCAST NETWORK</div>
              <div style="color:#d4af37;font-size:clamp(28px,7vw,64px);letter-spacing:0.25em;text-align:center;line-height:1.1;">PLEASE<br>STAND BY</div>
              <div style="color:#d4af37;font-size:clamp(10px,1.8vw,14px);letter-spacing:0.5em;margin-top:1.4em;opacity:0.6;">CHANNEL 7 WILL RETURN SHORTLY</div>
              <div style="width:clamp(120px,30vw,260px);height:2px;background:rgba(212,175,55,0.3);margin-top:2em;"></div>
            `;
      document.body.appendChild(psb);
    }

    fireStatic(0.9);
    setTimeout(() => {
      psb.style.opacity = "1";
      const holdTime = 2000 + Math.random() * 1500;
      setTimeout(() => {
        fireStatic(0.9);
        setTimeout(() => {
          psb.style.opacity = "0";
          eob.style.opacity = "0";
        }, 200);
      }, holdTime);
    }, 150);
  }

  // 10. FULL MELTDOWN — everything at once, the big one
  function fireMeltdown() {
    fireStatic(1.0);
    setTimeout(() => fireColorBleed(), 80);
    setTimeout(() => fireHBar(), 100);
    setTimeout(() => fireScanline(), 120);
    setTimeout(() => fireScramble(), 200);
    setTimeout(() => fireScanline(), 350);
    setTimeout(() => fireStatic(0.6), 500);
    setTimeout(() => fireColorBleed(), 600);
    setTimeout(() => {
      if (Math.random() > 0.5) fireEndOfBroadcast();
    }, 800);
  }

  // ── SCHEDULER ────────────────────────────────────────
  // Much more aggressive. Average page view is 60-90 seconds.
  // We need things happening within the first 15 seconds.

  function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  function schedule(minMs, maxMs, handler) {
    function fire() {
      const delay = rand(minMs, maxMs);
      setTimeout(() => {
        if (!tocIsOpen() && !document.hidden) handler();
        fire();
      }, delay);
    }
    // First fire staggered 3-15 seconds in
    setTimeout(fire, rand(3000, 15000));
  }
  // Scan lines: every 4-10 seconds
  schedule(4000, 10000, fireScanline);

  // Double scan: every 8-16 seconds
  schedule(8000, 16000, fireDoubleScan);

  // Color bleed: every 6-14 seconds
  schedule(6000, 14000, fireColorBleed);

  // H-bar interference: every 5-12 seconds
  schedule(5000, 12000, fireHBar);

  // Static burst: every 8-18 seconds
  schedule(8000, 18000, () => fireStatic(0.5));

  // Pirate message: every 10-20 seconds
  schedule(10000, 20000, firePirateMessage);

  // Frame rip: every 12-25 seconds
  schedule(12000, 25000, fireFrameRip);

  // Text scramble: every 20-40 seconds
  schedule(20000, 40000, fireScramble);

  // End of broadcast: every 40-70 seconds
  schedule(40000, 70000, fireEndOfBroadcast);

  // Full meltdown: every 90-150 seconds
  schedule(90000, 150000, fireMeltdown);

  // ── BURST CLUSTERS ──
  schedule(15000, 30000, () => {
    fireScanline();
    setTimeout(fireColorBleed, rand(100, 300));
    setTimeout(() => fireStatic(0.35), rand(200, 500));
  });

  schedule(25000, 50000, () => {
    fireHBar();
    setTimeout(firePirateMessage, rand(200, 600));
  });

  // ── FIRST IMPRESSION — fire within 3 seconds ──
  setTimeout(
    () => {
      if (!tocIsOpen()) {
        const openers = [
          fireScanline,
          fireColorBleed,
          fireHBar,
          () => fireStatic(0.4),
        ];
        openers[Math.floor(Math.random() * openers.length)]();
      }
    },
    rand(2000, 4000),
  );

  setTimeout(
    () => {
      if (!tocIsOpen()) fireDoubleScan();
    },
    rand(5000, 8000),
  );

  setTimeout(
    () => {
      if (!tocIsOpen()) firePirateMessage();
    },
    rand(8000, 12000),
  );

  setTimeout(
    () => {
      if (!tocIsOpen()) fireFrameRip();
    },
    rand(15000, 22000),
  );
})();
