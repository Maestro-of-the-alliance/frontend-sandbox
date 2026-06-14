/**
 * broadcast.js — N.C.E.ncyclopedia landing page
 * Intro broadcast interruption sequence.
 * Runs once on page load: color bars → error screen → glitch → reveal.
 */

// ═══════════════════════════════════════════════
// BROADCAST INTERRUPTION ENGINE
// ═══════════════════════════════════════════════
const isMobile = window.innerWidth < 768;
const broadcast = document.getElementById("broadcast");
const colorBars = document.getElementById("colorBars");
const errorScreen = document.getElementById("errorScreen");
const glitchLayer = document.getElementById("glitchLayer");
const signalText = document.getElementById("signalText");
const scanlines = document.getElementById("scanlines");

const errorVariants = [
  {
    msg: "Signal Interrupted",
    sub: "This channel is temporarily unavailable",
    code: "ERR · 0x4A4C · CARRIER LOST",
  },
  {
    msg: "Broadcast Suspended",
    sub: "Please stand by",
    code: "ERR · 0x7F3B · NO SIGNAL DETECTED",
  },
  {
    msg: "Connection Refused",
    sub: "Access to this channel has been restricted",
    code: "ERR · 0x2D19 · UNAUTHORIZED FREQUENCY",
  },
  {
    msg: "Channel Unavailable",
    sub: "Scheduled maintenance in progress",
    code: "ERR · 0xA8C2 · SYSTEM OFFLINE",
  },
];
const v = errorVariants[Math.floor(Math.random() * errorVariants.length)];
document.getElementById("errMsg").textContent = v.msg;
document.getElementById("errSub").textContent = v.sub;
document.getElementById("errCode").textContent = v.code;

const totalDur = isMobile
  ? Math.random() * 1000 + 3500
  : Math.random() * 1500 + 4500;
const glitchN = isMobile ? 2 : Math.floor(Math.random() * 2) + 2;
const glitchStart = isMobile ? 1200 : 1800;
const glitchWindow = totalDur - glitchStart - 1000;

function runBroadcast() {
  // Phase 1: color bars flash
  colorBars.style.opacity = "1";
  setTimeout(() => {
    colorBars.style.opacity = "0";
  }, 180);

  // Phase 2: error screen fades in
  setTimeout(() => {
    errorScreen.style.opacity = "1";
  }, 300);

  // Phase 3: glitch attempts — signal fighting through
  for (let a = 0; a < glitchN; a++) {
    const aD = glitchStart + (glitchWindow / glitchN) * a + Math.random() * 200;
    const aL = isMobile ? 120 : Math.random() * 150 + 120;
    setTimeout(() => {
      errorScreen.style.transform = `translateX(${(Math.random() - 0.5) * 12}px) skewX(${(Math.random() - 0.5) * 2}deg)`;
      errorScreen.style.filter = `brightness(${Math.random() * 0.5 + 0.8}) hue-rotate(${Math.random() * 30}deg)`;
      glitchLayer.style.opacity = "1";
      document.querySelectorAll(".tear").forEach((t) => {
        t.style.top = `${Math.random() * 100}%`;
        t.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        t.style.height = `${Math.random() * 3 + 1}px`;
        t.style.background =
          Math.random() > 0.5
            ? "rgba(212,175,55,0.7)"
            : "rgba(255,255,255,0.4)";
      });
      if (a === glitchN - 1)
        signalText.style.color = `rgba(212,175,55,${Math.random() * 0.6 + 0.3})`;
    }, aD);
    setTimeout(() => {
      errorScreen.style.transform = "";
      errorScreen.style.filter = "";
      glitchLayer.style.opacity = "0";
      document
        .querySelectorAll(".tear")
        .forEach((t) => (t.style.opacity = "0"));
      if (a < glitchN - 1) signalText.style.color = "rgba(212,175,55,0)";
    }, aD + aL);
  }

  // Phase 4: final breakthrough
  const bkD = totalDur - 800;
  setTimeout(() => {
    errorScreen.style.transform = `translateX(${(Math.random() - 0.5) * 20}px)`;
    errorScreen.style.filter = "brightness(2) saturate(0)";
    glitchLayer.style.opacity = "1";
    scanlines.style.opacity = "1";
    signalText.style.color = "rgba(212,175,55,0.9)";
    document.querySelectorAll(".tear").forEach((t) => {
      t.style.top = `${Math.random() * 100}%`;
      t.style.opacity = "1";
      t.style.height = `${Math.random() * 4 + 2}px`;
      t.style.background = "rgba(212,175,55,0.9)";
    });
  }, bkD);

  setTimeout(() => {
    errorScreen.style.opacity = "0";
    glitchLayer.style.opacity = "0";
    scanlines.style.opacity = "0";
    broadcast.style.background = "#000";
  }, bkD + 300);

  // Phase 5: landing page assembles
  setTimeout(() => {
    broadcast.classList.add("done");
    if (!isMobile) {
      const sh = document.getElementById("pageShell");
      sh.style.filter = "brightness(1.25) saturate(0.4)";
      sh.style.transform = `translateX(${(Math.random() - 0.5) * 5}px)`;
      setTimeout(() => {
        sh.style.transition = "filter 0.4s ease, transform 0.3s ease";
        sh.style.filter = "";
        sh.style.transform = "";
      }, 140);
    }
    setTimeout(glitchTypePrompt, 700);
  }, totalDur);
}

runBroadcast();

// Show skip button after 1.5s — barely visible, always there
setTimeout(() => {
  const skipBtn = document.getElementById("skipIntro");
  if (skipBtn) skipBtn.style.display = "block";
}, 1500);

window.skipIntroNow = function skipIntroNow() {
  broadcast.classList.add("done");
  document.getElementById("skipIntro").style.display = "none";
  setTimeout(glitchTypePrompt, 100);
};

// ═══════════════════════════════════════════════
// GLITCH TYPER
// ═══════════════════════════════════════════════
const NOISE = "!#$%&*@?/\\|[]{}~^<>";
const TARGET = " access N.C.E.ncyclopedia";

function glitchTypePrompt() {
  const stealthEl = document.getElementById("stealthSearch");
  stealthEl.style.visibility = "visible";
}
