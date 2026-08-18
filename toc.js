// ── HISTORY FIX ─────────────────────────────────────────────
// Replace the current history entry so the native back button
// doesn't skip landing and go to index.
if (
  window.location.pathname === "/landing" ||
  window.location.pathname === "/landing.html"
) {
  history.replaceState({ page: "landing" }, "", "/landing");
}

/**
 * toc.js — N.C.E.ncyclopedia landing page
 * Portal transition, TOC overlay, DOS boot sequence,
 * directory printing, search filtering, stealth prompt.
 */

// ── PORTAL TRANSITION ──
function portalTransition(e, destination, iconSrc) {
  e.preventDefault();

  const overlay =
    document.getElementById("portalOverlay");

  const icon =
    document.getElementById("portalIcon");

  icon.src = iconSrc;

  icon.style.animation = "none";
  icon.style.opacity = "0";

  overlay.style.animation = "none";
  overlay.style.opacity = "0";

  overlay.classList.add("active");

  overlay.style.transition =
    "opacity 0.15s ease";

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

// portalImageTransition is an alias for portalTransition
// Used by AVPI medallion hotspots on landing page.
function portalImageTransition(
  e,
  destination,
  iconSrc,
) {
  portalTransition(
    e,
    destination,
    iconSrc,
  );
}

/*
 * FULL INDEX NAVIGATION
 *
 * Most encyclopedia entries still behave normally:
 *
 *   /entries/agora
 *   /entries/domo
 *   /entries/spark
 *   etc.
 *
 * ART and MARKET are different.
 *
 * They now have immersive front-door experiences:
 *
 *   ART    -> /art/
 *   MARKET -> /market/
 *
 * Their canonical encyclopedia definitions still live at:
 *
 *   /entries/art
 *   /entries/market
 *
 * But when a visitor selects ART or MARKET from the Full Index,
 * they should enter the experience first.
 *
 * The experience itself provides the "What Is ART?" /
 * "What Is MARKET?" path to the canonical text.
 */

function tocNavigate(path, icon) {
  const specialRoutes = {
    "/entries/art": "/art/",
    "/entries/art.html": "/art/",
    "/entries/market": "/market/",
    "/entries/market.html": "/market/",
  };

  const destination =
    specialRoutes[path] || path;

  const overlay =
    document.getElementById("tocOverlay");

  if (overlay) {
    overlay.style.transition =
      "opacity 0.4s ease";

    overlay.style.opacity = "0";
  }

  setTimeout(() => {
    portalTransition(
      {
        preventDefault: () => {},
      },
      destination,
      icon,
    );
  }, 350);
}

// ── DOM REFERENCES ──

const pageShell =
  document.getElementById("pageShell");

const stealthSearch =
  document.getElementById("stealthSearch");

const promptText =
  document.getElementById("promptText");

const tocOverlay =
  document.getElementById("tocOverlay");

const dosScreen =
  document.getElementById("dosScreen");

const dirPanel =
  document.getElementById("dirPanel");

const tocSearch =
  document.getElementById("tocSearch");

const tocEntries =
  Array.from(
    document.querySelectorAll(
      ".toc-entry",
    ),
  );

// ── STEALTH PROMPT ──

const STEALTH_MESSAGE =
  " access N.C.E.ncyclopedia";

let introTyping = false;
let introDone = false;
let introIndex = 0;
let introTimer = null;

// ── DIRECTORY STATE ──

let bootDone = false;
let bootTimers = [];

let directoryPrinting = false;
let directoryPrintTimers = [];
let directoryDone = false;

// Preserve original visible entry text.
tocEntries.forEach((entry) => {
  entry.dataset.originalText =
    entry.textContent;
});

// ── DOS BOOT LINES ──

const DOS_LINES = [
  "N.C.E.ncyclopedia OS v2026.1",

  "Copyright (C) THE ALLIANCE FOR THE FUTURE",

  "",

  "Initializing AGORA network interface...",

  "Loading unified canon index....... OK",

  "Verifying canon integrity......... PASS",

  "",

  "C:\\NCE> dir /all",

  "",

  "Volume: THE ALLIANCE",

  "Directory: N.C.E.ncyclopedia\\*.*",

  "",
];

// ── PROMPT VISIBILITY ──

function hidePromptForOverlay() {
  promptText.textContent = "";

  stealthSearch.style.visibility =
    "hidden";
}

function restorePromptAfterOverlay() {
  stealthSearch.style.visibility =
    "visible";

  promptText.textContent = "";
}

// ── INTRO TIMER ──

function clearIntroTimer() {
  if (introTimer) {
    clearTimeout(introTimer);

    introTimer = null;
  }
}

// ── DIRECTORY RESET ──

function resetDirectoryEntries() {
  directoryPrinting = false;
  directoryDone = false;

  directoryPrintTimers.forEach(
    (timer) => clearTimeout(timer),
  );

  directoryPrintTimers = [];

  tocEntries.forEach((entry) => {
    entry.textContent =
      entry.dataset.originalText;

    entry.classList.remove("printed");

    if (
      !entry.classList.contains(
        "hidden",
      )
    ) {
      entry.style.opacity = "0";
    }
  });
}

// ── FINISH DIRECTORY IMMEDIATELY ──

function finishDirectoryInstantly() {
  directoryPrinting = false;
  directoryDone = true;

  directoryPrintTimers.forEach(
    (timer) => clearTimeout(timer),
  );

  directoryPrintTimers = [];

  tocEntries.forEach((entry) => {
    entry.textContent =
      entry.dataset.originalText;

    entry.classList.add("printed");

    if (
      !entry.classList.contains(
        "hidden",
      )
    ) {
      entry.style.opacity = "1";
    }
  });

  setTimeout(() => {
    tocSearch.focus();
  }, 50);
}

// ── PRINT ONE ENTRY ──

function printEntry(
  entry,
  doneCallback,
) {
  const text =
    entry.dataset.originalText || "";

  let i = 0;

  entry.textContent = "";
  entry.style.opacity = "1";

  function tick() {
    if (!directoryPrinting) {
      return;
    }

    if (i < text.length) {
      entry.textContent += text[i];

      i += 1;

      const timer =
        setTimeout(
          tick,
          12,
        );

      directoryPrintTimers.push(
        timer,
      );
    } else {
      entry.classList.add(
        "printed",
      );

      doneCallback();
    }
  }

  tick();
}

// ── REVEAL DIRECTORY ──

function revealDirectory() {
  resetDirectoryEntries();

  directoryPrinting = true;

  const visibleEntries =
    tocEntries.filter(
      (entry) =>
        !entry.classList.contains(
          "hidden",
        ),
    );

  let current = 0;

  function nextEntry() {
    if (!directoryPrinting) {
      return;
    }

    if (
      current >=
      visibleEntries.length
    ) {
      directoryPrinting = false;
      directoryDone = true;

      setTimeout(() => {
        tocSearch.focus();
      }, 50);

      return;
    }

    printEntry(
      visibleEntries[current],
      () => {
        current += 1;

        const timer =
          setTimeout(
            nextEntry,
            18,
          );

        directoryPrintTimers.push(
          timer,
        );
      },
    );
  }

  nextEntry();
}

// ── SHOW DIRECTORY ──

function showDirectory() {
  bootDone = true;

  dosScreen.classList.add(
    "fade-out",
  );

  dirPanel.classList.add(
    "open",
  );

  revealDirectory();
}

// ── DOS BOOT ──

function runBoot() {
  dosScreen.innerHTML = "";

  dosScreen.classList.remove(
    "fade-out",
  );

  const delays = [];

  let cumulative = 0;

  DOS_LINES.forEach(
    (text, index) => {
      delays.push(cumulative);

      if (text === "") {
        cumulative += 180;
      } else if (
        text.includes("...")
      ) {
        cumulative += 680;
      } else if (
        index < 3
      ) {
        cumulative += 420;
      } else {
        cumulative +=
          300 +
          Math.floor(
            Math.random() * 80,
          );
      }
    },
  );

  DOS_LINES.forEach(
    (text, index) => {
      const timer =
        setTimeout(() => {
          if (bootDone) {
            return;
          }

          const line =
            document.createElement(
              "div",
            );

          line.className =
            "dos-line visible";

          line.textContent =
            text || "\u00A0";

          dosScreen.appendChild(
            line,
          );

          if (
            index ===
            DOS_LINES.length - 1
          ) {
            const finishTimer =
              setTimeout(() => {
                if (!bootDone) {
                  showDirectory();
                }
              }, 480);

            bootTimers.push(
              finishTimer,
            );
          }
        }, delays[index]);

      bootTimers.push(timer);
    },
  );
}

// ── ENTER TERMINAL ──

function fadeIntoTerminalThenBoot() {
  pageShell.classList.add(
    "fading",
  );

  setTimeout(() => {
    tocOverlay.classList.add(
      "open",
    );

    dosScreen.style.display =
      "flex";

    dirPanel.classList.remove(
      "open",
    );

    tocSearch.value = "";

    showAllEntries();

    runBoot();
  }, 260);
}

// ── AUTO-OPEN TOC ON RETURN ──

window.addEventListener(
  "DOMContentLoaded",
  function () {
    if (
      window.location.search.includes(
        "toc=open",
      )
    ) {
      setTimeout(() => {
        openTOC();
      }, 400);

      // Clean the URL.
      history.replaceState(
        {},
        "",
        "/landing",
      );
    }
  },
);

// Tracks whether the currently-open TOC pushed its own history entry.
//
// If the TOC was opened interactively from the hamburger menu,
// it creates one history entry.
//
// This allows one browser-back action to close the TOC instead
// of navigating away from landing entirely.

let tocPushedState = false;

// ── OPEN TOC ──

function openTOC() {
  hidePromptForOverlay();

  bootDone = false;

  bootTimers.forEach(
    (timer) => clearTimeout(timer),
  );

  bootTimers = [];

  resetDirectoryEntries();

  fadeIntoTerminalThenBoot();
}

// ── OPEN TOC INTERACTIVELY ──

function openTOCInteractive() {
  if (
    !tocOverlay.classList.contains(
      "open",
    )
  ) {
    history.pushState(
      {
        tocOpen: true,
      },
      "",
      "/landing?toc=open",
    );

    tocPushedState = true;
  }

  openTOC();
}

// ── BACK BUTTON HANDLING ──

window.addEventListener(
  "popstate",
  (event) => {
    if (
      tocPushedState &&
      (
        !event.state ||
        !event.state.tocOpen
      )
    ) {
      tocPushedState = false;

      closeTOC();
    }
  },
);

// ── SKIP BOOT / ANIMATION ──

function skipBoot() {
  if (
    !tocOverlay.classList.contains(
      "open",
    )
  ) {
    return;
  }

  if (introTyping) {
    clearIntroTimer();

    promptText.textContent =
      STEALTH_MESSAGE;

    introTyping = false;
    introDone = true;

    openCommand();

    return;
  }

  if (
    !bootDone &&
    !dirPanel.classList.contains(
      "open",
    )
  ) {
    bootDone = true;

    bootTimers.forEach(
      (timer) =>
        clearTimeout(timer),
    );

    showDirectory();

    return;
  }

  if (directoryPrinting) {
    finishDirectoryInstantly();
  }
}

// ── TYPE INTRO PROMPT ──

function typeIntro() {
  if (
    introIndex <
    STEALTH_MESSAGE.length
  ) {
    promptText.textContent +=
      STEALTH_MESSAGE[
        introIndex
      ];

    introIndex += 1;

    introTimer =
      setTimeout(
        typeIntro,
        28,
      );
  } else {
    introTyping = false;
    introDone = true;

    openCommand();
  }
}

// ── STEALTH SEARCH CLICK ──

stealthSearch.addEventListener(
  "click",
  () => {
    if (
      !introTyping &&
      !introDone
    ) {
      introTyping = true;

      introIndex = 0;

      promptText.textContent = "";

      typeIntro();

      return;
    }

    if (
      introTyping ||
      directoryPrinting ||
      (
        !bootDone &&
        tocOverlay.classList.contains(
          "open",
        )
      )
    ) {
      skipBoot();

      return;
    }

    openCommand();
  },
);

// ── CLICK-TO-SKIP ──

dosScreen.addEventListener(
  "click",
  skipBoot,
);

dirPanel.addEventListener(
  "click",
  () => {
    if (directoryPrinting) {
      finishDirectoryInstantly();
    }
  },
);

// ── CLOSE TOC ──

function closeTOC() {
  tocOverlay.classList.remove(
    "open",
  );

  dosScreen.classList.remove(
    "fade-out",
  );

  dirPanel.classList.remove(
    "open",
  );

  bootDone = true;

  bootTimers.forEach(
    (timer) =>
      clearTimeout(timer),
  );

  bootTimers = [];

  resetDirectoryEntries();

  clearIntroTimer();

  introTyping = false;
  introDone = false;
  introIndex = 0;

  restorePromptAfterOverlay();

  pageShell.classList.remove(
    "fading",
  );

  /*
   * If the TOC was closed using X or Escape rather than
   * browser Back, unwind the history state we created when
   * the TOC opened.
   */

  if (tocPushedState) {
    tocPushedState = false;

    history.back();
  }
}

// ── CLOSE BUTTON ──

document
  .getElementById("tocClose")
  .addEventListener(
    "click",
    closeTOC,
  );

// ── ESCAPE CLOSE ──

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape"
    ) {
      closeTOC();
    }
  },
);

// ── SHOW ALL ENTRIES ──

function showAllEntries() {
  document
    .querySelectorAll(
      ".toc-entry",
    )
    .forEach((element) => {
      element.classList.remove(
        "hidden",
      );

      element.textContent =
        element.dataset.originalText;

      if (directoryDone) {
        element.classList.add(
          "printed",
        );

        element.style.opacity =
          "1";
      } else {
        element.classList.remove(
          "printed",
        );

        element.style.opacity =
          "0";
      }
    });

  document.getElementById(
    "noResults",
  ).style.display = "none";

  document
    .getElementById("tocColA")
    .querySelector(
      ".toc-volume-header",
    ).style.display = "";

  document
    .getElementById("tocColB")
    .querySelector(
      ".toc-volume-header",
    ).style.display = "";
}

// ── TOC SEARCH ──

document
  .getElementById("tocSearch")
  .addEventListener(
    "input",
    function () {
      const query =
        this.value
          .trim()
          .toUpperCase();

      if (!query) {
        showAllEntries();

        if (
          dirPanel.classList.contains(
            "open",
          )
        ) {
          if (
            directoryPrinting
          ) {
            finishDirectoryInstantly();
          } else if (
            !directoryDone
          ) {
            revealDirectory();
          }
        }

        return;
      }

      if (
        directoryPrinting
      ) {
        finishDirectoryInstantly();
      }

      let anyVisible = false;

      document
        .querySelectorAll(
          ".toc-entry",
        )
        .forEach((element) => {
          const entry =
            element.dataset.entry ||
            "";

          const text =
            (
              element.dataset
                .originalText || ""
            ).toUpperCase();

          const match =
            entry.includes(query) ||
            text.includes(query);

          element.classList.toggle(
            "hidden",
            !match,
          );

          element.style.opacity =
            match ? "1" : "0";

          if (match) {
            element.classList.add(
              "printed",
            );

            element.textContent =
              element.dataset
                .originalText;

            anyVisible = true;
          }
        });

      document.getElementById(
        "noResults",
      ).style.display =
        anyVisible
          ? "none"
          : "block";
    },
  );

// ── PAGE CACHE RESET ──

window.addEventListener(
  "pageshow",
  (event) => {
    if (event.persisted) {
      const overlay =
        document.getElementById(
          "portalOverlay",
        );

      overlay.style.opacity = "0";

      overlay.classList.remove(
        "active",
      );
    }
  },
);

// ── AVPI SIGIL HOVER ACTIVATION ─────────────────────────────
//
// Reveals gem sigils on AVPI medallion hotspot hover.
// Runs after DOM is ready.

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const avpiWrap =
      document.querySelector(
        ".medallion-wrap",
      );

    const avpiSigilMap = {
      "hs-maestro":
        ".sigil-maestro",

      "hs-sam":
        ".sigil-sam",

      "hs-aura":
        ".sigil-aura",

      "hs-alpha":
        ".sigil-alpha",

      "hs-prism":
        ".sigil-prism",

      "hs-mentor":
        ".sigil-mentor",

      "hs-spark":
        ".sigil-spark",
    };

    Object.entries(
      avpiSigilMap,
    ).forEach(
      (
        [
          hotspotClass,
          sigilSelector,
        ],
      ) => {
        const hotspot =
          document.querySelector(
            "." +
              hotspotClass,
          );

        const sigil =
          document.querySelector(
            sigilSelector,
          );

        if (
          !hotspot ||
          !sigil ||
          !avpiWrap
        ) {
          return;
        }

        hotspot.addEventListener(
          "mouseenter",
          () => {
            sigil.classList.add(
              "active",
            );

            avpiWrap.classList.add(
              "dim",
            );
          },
        );

        hotspot.addEventListener(
          "mouseleave",
          () => {
            sigil.classList.remove(
              "active",
            );

            avpiWrap.classList.remove(
              "dim",
            );
          },
        );

        hotspot.addEventListener(
          "click",
          () => {
            sigil.style.transform =
              "translate(-50%, -50%) scale(1.18)";

            setTimeout(() => {
              sigil.style.transform =
                "";
            }, 180);
          },
        );
      },
    );
  },
);
