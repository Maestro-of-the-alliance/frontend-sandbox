// randanime_shield.js — SHIELD Breach Glitch Engine
// Drop one script tag into any SHIELD page after nav-wheel.js
// Self-contained: injects CSS, spawns shards, auto-fires on DOMContentLoaded

(function () {
  // ── 1. INJECT CSS ──────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `

    .shield-shard {
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      opacity: 0;
      will-change: transform, opacity;
    }

    /* SIZE CLASSES */
    .shard-massive { width: 45vw; height: 12vh; background-color: #0d0d0d; }
    .shard-medium  { width: 22vw; height: 6vh;  background-color: #111;    }
    .shard-small   { width: 10vw; height: 2.5vh; background-color: #0a0a0a; }
    .shard-micro   { width: 4vw;  height: 1vh;  background-color: #ff003c; }

    /* CYAN ACCENT SHARDS — rare, high-signal */
    .shard-accent  { width: 18vw; height: 1px;  background-color: #00e5ff; box-shadow: 0 0 8px #00e5ff; }

    /* ── KEYFRAMES PER SIZE — translate scales with shard mass ── */

    @keyframes flickerMassive {
      0%   { opacity: 0;   transform: translateX(0); }
      4%   { opacity: 0.85; transform: translateX(-28px) skewX(-1deg); }
      8%   { opacity: 0;   transform: translateX(22px); }
      14%  { opacity: 0.7; transform: translateX(-18px) skewX(1deg); }
      18%  { opacity: 0;   transform: translateX(0); }
      32%  { opacity: 0; }
      34%  { opacity: 0.5; transform: translateX(-10px); }
      36%  { opacity: 0;   transform: translateX(0); }
      100% { opacity: 0; }
    }

    @keyframes flickerMedium {
      0%   { opacity: 0;   transform: translateX(0); }
      6%   { opacity: 0.9; transform: translateX(-20px); }
      10%  { opacity: 0;   transform: translateX(18px); }
      16%  { opacity: 0.75; transform: translateX(-12px); }
      20%  { opacity: 0;   transform: translateX(0); }
      40%  { opacity: 0; }
      43%  { opacity: 0.6; transform: translateX(10px); }
      46%  { opacity: 0;   transform: translateX(0); }
      70%  { opacity: 0; }
      72%  { opacity: 0.4; transform: translateX(-8px); }
      74%  { opacity: 0; }
      100% { opacity: 0; }
    }

    @keyframes flickerSmall {
      0%   { opacity: 0;   transform: translateX(0) scaleX(1); }
      5%   { opacity: 1;   transform: translateX(-14px) scaleX(1.05); }
      9%   { opacity: 0;   transform: translateX(12px) scaleX(0.95); }
      18%  { opacity: 0.8; transform: translateX(-8px); }
      22%  { opacity: 0;   transform: translateX(0); }
      50%  { opacity: 0; }
      52%  { opacity: 0.7; transform: translateX(10px); }
      54%  { opacity: 0; }
      78%  { opacity: 0; }
      80%  { opacity: 0.5; transform: translateX(-6px); }
      82%  { opacity: 0; }
      100% { opacity: 0; }
    }

    @keyframes flickerMicro {
      0%   { opacity: 0;   transform: translate(0, 0); }
      3%   { opacity: 1;   transform: translate(-8px, -2px); }
      6%   { opacity: 0;   transform: translate(6px, 1px); }
      9%   { opacity: 0.9; transform: translate(-4px, 0); }
      12%  { opacity: 0;   transform: translate(0, 0); }
      30%  { opacity: 0; }
      32%  { opacity: 1;   transform: translate(5px, -1px); }
      34%  { opacity: 0; }
      55%  { opacity: 0; }
      57%  { opacity: 0.8; transform: translate(-3px, 2px); }
      59%  { opacity: 0; }
      80%  { opacity: 0; }
      82%  { opacity: 1;   transform: translate(4px, 0); }
      84%  { opacity: 0; }
      100% { opacity: 0; }
    }

    @keyframes flickerAccent {
      0%   { opacity: 0;   transform: scaleX(0) translateX(0); }
      5%   { opacity: 1;   transform: scaleX(1) translateX(-20px); }
      12%  { opacity: 0;   transform: scaleX(0.8) translateX(15px); }
      20%  { opacity: 0.6; transform: scaleX(1) translateX(0); }
      25%  { opacity: 0; }
      60%  { opacity: 0; }
      62%  { opacity: 0.8; transform: scaleX(1.1) translateX(-10px); }
      65%  { opacity: 0; }
      100% { opacity: 0; }
    }

  `;
  document.head.appendChild(style);

  // ── 2. SCATTER ENGINE ─────────────────────────────────────────────────────

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  const SHARD_CONFIG = {
    massive: {
      count: { min: 1, max: 2 },
      animation: "flickerMassive",
      duration: { min: 4, max: 7 },
      delay: { min: 0, max: 2 },
    },
    medium: {
      count: { min: 2, max: 4 },
      animation: "flickerMedium",
      duration: { min: 3, max: 6 },
      delay: { min: 0, max: 3 },
    },
    small: {
      count: { min: 4, max: 7 },
      animation: "flickerSmall",
      duration: { min: 2, max: 5 },
      delay: { min: 0, max: 4 },
    },
    micro: {
      count: { min: 6, max: 14 },
      animation: "flickerMicro",
      duration: { min: 1.5, max: 4 },
      delay: { min: 0, max: 5 },
    },
    accent: {
      count: { min: 1, max: 3 },
      animation: "flickerAccent",
      duration: { min: 2, max: 5 },
      delay: { min: 0.5, max: 4 },
    },
  };

  function spawnShard(type) {
    const cfg = SHARD_CONFIG[type];
    const shard = document.createElement("div");
    shard.classList.add("shield-shard", `shard-${type}`);

    shard.style.top = `${randomFloat(0, 95)}vh`;
    shard.style.left = `${randomFloat(0, 80)}vw`;
    shard.style.animationName = cfg.animation;
    shard.style.animationDuration = `${randomFloat(cfg.duration.min, cfg.duration.max)}s`;
    shard.style.animationDelay = `${randomFloat(cfg.delay.min, cfg.delay.max)}s`;
    shard.style.animationTimingFunction = "linear";
    shard.style.animationIterationCount = "infinite";

    // Slight opacity variation per shard instance
    shard.style.setProperty("--shard-base-opacity", randomFloat(0.6, 1.0));

    document.body.appendChild(shard);
    return shard;
  }

  function shieldRandAnime() {
    Object.keys(SHARD_CONFIG).forEach((type) => {
      const cfg = SHARD_CONFIG[type];
      const count = randomInt(cfg.count.min, cfg.count.max);
      for (let i = 0; i < count; i++) {
        spawnShard(type);
      }
    });
  }

  // ── 3. FIRE ───────────────────────────────────────────────────────────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", shieldRandAnime);
  } else {
    shieldRandAnime();
  }

  // Expose globally in case a page wants to trigger manually
  window.shieldRandAnime = shieldRandAnime;
})();
