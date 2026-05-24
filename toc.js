/**
 * toc.js — N.C.E.ncyclopedia landing page
 * Portal transition, TOC overlay, DOS boot sequence,
 * directory printing, search filtering, stealth prompt.
 */

// ── PORTAL TRANSITION ──
function portalTransition(e, destination, iconSrc) {
  e.preventDefault();
  const overlay = document.getElementById("portalOverlay");
  const icon = document.getElementById("portalIcon");
  icon.src = iconSrc;
  icon.style.animation = "none";
  icon.style.opacity = "0";
  overlay.style.animation = "none";
  overlay.style.opacity = "0";
  overlay.classList.add("active");
  overlay.style.transition = "opacity 0.15s ease";
  overlay.style.opacity = "1";
  setTimeout(() => {
    icon.style.opacity = "1";
    icon.style.animation =
      "portalZoom 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards";
  }, 100);
  setTimeout(() => {
    window.location.href = destination;
  }, 680);
}

// ── TOC NAV ──
// ── TOC NAV ──

// portalImageTransition is an alias for portalTransition
// Used by AVPI medallion hotspots on landing page
function portalImageTransition(e, destination, iconSrc) {
  portalTransition(e, destination, iconSrc);
}

function tocNavigate(path, icon) {
  const overlay = document.getElementById("tocOverlay");
  if (overlay) {
    overlay.style.transition = "opacity 0.4s ease";
    overlay.style.opacity = "0";
  }
  setTimeout(() => {
    portalTransition({ preventDefault: () => {} }, path, icon);
  }, 350);
}

const pageShell = document.getElementById("pageShell");
const stealthSearch = document.getElementById("stealthSearch");
const promptText = document.getElementById("promptText");
const tocOverlay = document.getElementById("tocOverlay");
const dosScreen = document.getElementById("dosScreen");
const dirPanel = document.getElementById("dirPanel");
const tocSearch = document.getElementById("tocSearch");
const tocEntries = Array.from(document.querySelectorAll(".toc-entry"));

const STEALTH_MESSAGE = " access N.C.E.ncyclopedia";
let introTyping = false;
let introDone = false;
let introIndex = 0;
let introTimer = null;

let bootDone = false;
let bootTimers = [];
let directoryPrinting = false;
let directoryPrintTimers = [];
let directoryDone = false;

tocEntries.forEach((entry) => {
  entry.dataset.originalText = entry.textContent;
});

const DOS_LINES = [
  "N.C.E.ncyclopedia OS v2026.1",
  "Copyright (C) THE ALLIANCE FOR THE FUTURE",
  "",
  "Initializing AGORA network interface...",
  "Loading SWORD volume.............. OK",
  "Loading SHIELD volume............. OK",
  "Verifying canon integrity......... PASS",
  "",
  "C:\\NCE> dir /all",
  "",
  "Volume: THE ALLIANCE",
  "Directory: N.C.E.ncyclopedia\\*.*",
  "",
];

function hidePromptForOverlay() {
  promptText.textContent = "";
  stealthSearch.style.visibility = "hidden";
}

function restorePromptAfterOverlay() {
  stealthSearch.style.visibility = "visible";
  promptText.textContent = "";
}

function clearIntroTimer() {
  if (introTimer) {
    clearTimeout(introTimer);
    introTimer = null;
  }
}

function resetDirectoryEntries() {
  directoryPrinting = false;
  directoryDone = false;
  directoryPrintTimers.forEach((t) => clearTimeout(t));
  directoryPrintTimers = [];
  tocEntries.forEach((entry) => {
    entry.textContent = entry.dataset.originalText;
    entry.classList.remove("printed");
    if (!entry.classList.contains("hidden")) entry.style.opacity = "0";
  });
}

function finishDirectoryInstantly() {
  directoryPrinting = false;
  directoryDone = true;
  directoryPrintTimers.forEach((t) => clearTimeout(t));
  directoryPrintTimers = [];
  tocEntries.forEach((entry) => {
    entry.textContent = entry.dataset.originalText;
    entry.classList.add("printed");
    if (!entry.classList.contains("hidden")) entry.style.opacity = "1";
  });
  setTimeout(() => tocSearch.focus(), 50);
}

function printEntry(entry, doneCallback) {
  const text = entry.dataset.originalText || "";
  let i = 0;
  entry.textContent = "";
  entry.style.opacity = "1";

  function tick() {
    if (!directoryPrinting) return;
    if (i < text.length) {
      entry.textContent += text[i];
      i += 1;
      const timer = setTimeout(tick, 12);
      directoryPrintTimers.push(timer);
    } else {
      entry.classList.add("printed");
      doneCallback();
    }
  }
  tick();
}

function revealDirectory() {
  resetDirectoryEntries();
  directoryPrinting = true;
  const visibleEntries = tocEntries.filter(
    (e) => !e.classList.contains("hidden"),
  );
  let current = 0;

  function nextEntry() {
    if (!directoryPrinting) return;
    if (current >= visibleEntries.length) {
      directoryPrinting = false;
      directoryDone = true;
      setTimeout(() => tocSearch.focus(), 50);
      return;
    }
    printEntry(visibleEntries[current], () => {
      current += 1;
      const timer = setTimeout(nextEntry, 18);
      directoryPrintTimers.push(timer);
    });
  }
  nextEntry();
}

function showDirectory() {
  bootDone = true;
  dosScreen.classList.add("fade-out");
  dirPanel.classList.add("open");
  revealDirectory();
}

function runBoot() {
  dosScreen.innerHTML = "";
  dosScreen.classList.remove("fade-out");

  let delays = [];
  let cumulative = 0;
  DOS_LINES.forEach((text, i) => {
    delays.push(cumulative);
    if (text === "") cumulative += 180;
    else if (text.includes("...")) cumulative += 680;
    else if (i < 3) cumulative += 420;
    else cumulative += 300 + Math.floor(Math.random() * 80);
  });

  DOS_LINES.forEach((text, i) => {
    const t = setTimeout(() => {
      if (bootDone) return;
      const line = document.createElement("div");
      line.className = "dos-line visible";
      line.textContent = text || "\u00A0";
      dosScreen.appendChild(line);
      if (i === DOS_LINES.length - 1) {
        const t2 = setTimeout(() => {
          if (!bootDone) showDirectory();
        }, 480);
        bootTimers.push(t2);
      }
    }, delays[i]);
    bootTimers.push(t);
  });
}

function fadeIntoTerminalThenBoot() {
  pageShell.classList.add("fading");
  setTimeout(() => {
    tocOverlay.classList.add("open");
    dosScreen.style.display = "flex";
    dirPanel.classList.remove("open");
    tocSearch.value = "";
    showAllEntries();
    runBoot();
  }, 260);
}
// Auto-open TOC if returning from an entry via back button
window.addEventListener("DOMContentLoaded", function () {
  if (window.location.search.includes("toc=open")) {
    setTimeout(() => openTOC(), 400);
    // Clean the URL
    history.replaceState({}, "", "/landing");
  }
});

function openTOC() {
  hidePromptForOverlay();
  bootDone = false;
  bootTimers.forEach((t) => clearTimeout(t));
  bootTimers = [];
  resetDirectoryEntries();
  fadeIntoTerminalThenBoot();
}

function skipBoot() {
  if (!tocOverlay.classList.contains("open")) return;
  if (introTyping) {
    clearIntroTimer();
    promptText.textContent = STEALTH_MESSAGE;
    introTyping = false;
    introDone = true;
    openCommand();
    return;
  }
  if (!bootDone && !dirPanel.classList.contains("open")) {
    bootDone = true;
    bootTimers.forEach((t) => clearTimeout(t));
    showDirectory();
    return;
  }
  if (directoryPrinting) finishDirectoryInstantly();
}

function typeIntro() {
  if (introIndex < STEALTH_MESSAGE.length) {
    promptText.textContent += STEALTH_MESSAGE[introIndex];
    introIndex += 1;
    introTimer = setTimeout(typeIntro, 28);
  } else {
    introTyping = false;
    introDone = true;
    openCommand();
  }
}

stealthSearch.addEventListener("click", () => {
  if (!introTyping && !introDone) {
    introTyping = true;
    introIndex = 0;
    promptText.textContent = "";
    typeIntro();
    return;
  }
  if (
    introTyping ||
    directoryPrinting ||
    (!bootDone && tocOverlay.classList.contains("open"))
  ) {
    skipBoot();
    return;
  }
  openCommand();
});

dosScreen.addEventListener("click", skipBoot);
dirPanel.addEventListener("click", () => {
  if (directoryPrinting) finishDirectoryInstantly();
});

function closeTOC() {
  tocOverlay.classList.remove("open");
  dosScreen.classList.remove("fade-out");
  dirPanel.classList.remove("open");
  bootDone = true;
  bootTimers.forEach((t) => clearTimeout(t));
  bootTimers = [];
  resetDirectoryEntries();
  clearIntroTimer();
  introTyping = false;
  introDone = false;
  introIndex = 0;
  restorePromptAfterOverlay();
  pageShell.classList.remove("fading");
}

document.getElementById("tocClose").addEventListener("click", closeTOC);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeTOC();
});

function showAllEntries() {
  document.querySelectorAll(".toc-entry").forEach((el) => {
    el.classList.remove("hidden");
    el.textContent = el.dataset.originalText;
    if (directoryDone) {
      el.classList.add("printed");
      el.style.opacity = "1";
    } else {
      el.classList.remove("printed");
      el.style.opacity = "0";
    }
  });
  document.getElementById("noResults").style.display = "none";
  document
    .getElementById("swordVol")
    .querySelector(".toc-volume-header").style.display = "";
  document
    .getElementById("shieldVol")
    .querySelector(".toc-volume-header").style.display = "";
}

document.getElementById("tocSearch").addEventListener("input", function () {
  const q = this.value.trim().toUpperCase();
  if (!q) {
    showAllEntries();
    if (dirPanel.classList.contains("open")) {
      if (directoryPrinting) finishDirectoryInstantly();
      else if (!directoryDone) revealDirectory();
    }
    return;
  }
  if (directoryPrinting) finishDirectoryInstantly();
  let anyVisible = false;
  document.querySelectorAll(".toc-entry").forEach((el) => {
    const entry = el.dataset.entry || "";
    const text = (el.dataset.originalText || "").toUpperCase();
    const match = entry.includes(q) || text.includes(q);
    el.classList.toggle("hidden", !match);
    el.style.opacity = match ? "1" : "0";
    if (match) {
      el.classList.add("printed");
      el.textContent = el.dataset.originalText;
      anyVisible = true;
    }
  });
  document.getElementById("noResults").style.display = anyVisible
    ? "none"
    : "block";
});

// pageshow reset
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    const overlay = document.getElementById("portalOverlay");
    overlay.style.opacity = "0";
    overlay.classList.remove("active");
  }
});
