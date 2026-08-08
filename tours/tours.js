"use strict";

const PROGRESS_KEY = "tours_progress";
const VISIT_KEY = "tour_pending_visit";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {}
}
function completedSet(progress, tourId) {
  return new Set(progress[tourId] || []);
}

let expandedId = null;
const progress = loadProgress();

function nextStopFor(tour) {
  if (!tour.stops) return null;
  const done = completedSet(progress, tour.id);
  return tour.stops.find((s) => !done.has(s.id)) || null;
}

function titleFor(tour) {
  if (!tour.stops) return tour.title;
  const done = completedSet(progress, tour.id);
  const next = nextStopFor(tour);
  // In progress: the title itself becomes the single, obvious tap
  // target -- no separate hint line pretending to be a link underneath
  // it. Untouched or fully completed tours keep the plain title.
  if (done.size > 0 && next) return `Continue: ${tour.title}`;
  return tour.title;
}

function render() {
  const list = document.getElementById("tours-list");
  list.innerHTML = "";

  TOURS.forEach((tour) => {
    const li = document.createElement("li");
    li.className = "tour-item" + (expandedId === tour.id ? " expanded" : "");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tour-title-row";
    btn.textContent = titleFor(tour);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleTitleClick(tour);
    });

    const detail = document.createElement("div");
    detail.className = "tour-detail";
    detail.innerHTML = renderDetail(tour);

    li.appendChild(btn);
    li.appendChild(detail);
    list.appendChild(li);
  });
}

function renderDetail(tour) {
  if (!tour.stops) {
    return `<p class="tour-placeholder">Coming soon -- this path isn't written yet.</p>`;
  }
  const done = completedSet(progress, tour.id);
  let stopsLine = tour.stops.map((s) => (done.has(s.id) ? `${s.label} \u2713` : s.label)).join("  \u00b7  ");
  if (tour.closingLabel) {
    stopsLine += `  \u00b7  ${tour.closingLabel}`;
  }
  return `<p class="tour-stops">${stopsLine}</p>`;
}

function handleTitleClick(tour) {
  if (expandedId !== tour.id) {
    // First tap on this title: expand it, collapsing whatever else was open.
    expandedId = tour.id;
    render();
    return;
  }
  // Second tap on the same, already-expanded title: start (or continue) it.
  if (!tour.stops) return; // no content yet -- nothing to start
  startOrContinue(tour);
}

function startOrContinue(tour) {
  const done = completedSet(progress, tour.id);
  let next = nextStopFor(tour);
  if (!next) {
    // Fully completed -- walking it again starts over from the top.
    const p = loadProgress();
    delete p[tour.id];
    saveProgress(p);
    Object.assign(progress, p);
    next = tour.stops[0];
  }

  const intro = TOUR_INTROS[tour.id];
  if (done.size === 0 && intro) {
    showDialogue(intro, () => goToStop(tour, next));
    return;
  }
  goToStop(tour, next);
}

function goToStop(tour, stop) {
  try {
    localStorage.setItem(VISIT_KEY, JSON.stringify({ tourId: tour.id, stopId: stop.id }));
  } catch (e) {}
  window.location.href = stop.path;
}

// Click anywhere outside an item collapses whatever's open.
document.addEventListener("click", (e) => {
  if (!e.target.closest(".tour-item")) {
    if (expandedId !== null) {
      expandedId = null;
      render();
    }
  }
});

// ---- Returning from a real stop visit ----

function getPendingVisit() {
  try {
    const raw = localStorage.getItem(VISIT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function clearPendingVisit() {
  try {
    localStorage.removeItem(VISIT_KEY);
  } catch (e) {}
}

function showDialogue(lines, onDone) {
  const overlay = document.createElement("div");
  overlay.className = "pdc-interjection-overlay";
  overlay.innerHTML = `
    <div class="pdc-card">
      <img class="pdc-portrait pdc-portrait-small" src="${lines[0].image}" alt="PapaDomo" />
      <div class="pdc-dialogue">
        <div class="pdc-nameplate">PAPADOMO</div>
        <div class="pdc-text"></div>
        <div class="pdc-continue">&#9660;</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let i = 0;
  let typing = false;
  let typeTimer = null;
  const portraitEl = overlay.querySelector(".pdc-portrait-small");
  const textEl = overlay.querySelector(".pdc-text");
  const continueEl = overlay.querySelector(".pdc-continue");

  function typeLine() {
    portraitEl.src = lines[i].image;
    const full = lines[i].text;
    let chars = 0;
    typing = true;
    continueEl.style.visibility = "hidden";
    textEl.textContent = "";
    clearInterval(typeTimer);
    typeTimer = setInterval(() => {
      chars++;
      textEl.textContent = full.slice(0, chars);
      if (chars >= full.length) {
        clearInterval(typeTimer);
        typing = false;
        continueEl.style.visibility = "visible";
      }
    }, 26);
  }

  function completeLine() {
    clearInterval(typeTimer);
    typing = false;
    textEl.textContent = lines[i].text;
    continueEl.style.visibility = "visible";
  }

  function advance() {
    if (typing) {
      completeLine();
      return;
    }
    i++;
    if (i >= lines.length) {
      clearInterval(typeTimer);
      overlay.remove();
      onDone();
      return;
    }
    typeLine();
  }

  typeLine();

  overlay.addEventListener("click", (e) => {
    e.stopPropagation();
    advance();
  });
}

function handleReturn() {
  const pending = getPendingVisit();
  if (!pending) {
    render();
    return;
  }
  clearPendingVisit();
  const tour = TOURS.find((t) => t.id === pending.tourId);
  if (!tour || !tour.stops) {
    render();
    return;
  }
  const p = loadProgress();
  const done = new Set(p[tour.id] || []);
  done.add(pending.stopId);
  p[tour.id] = Array.from(done);
  saveProgress(p);
  Object.assign(progress, p);

  expandedId = tour.id;
  render();

  const tourLines = PAPADOMO_LINES[tour.id];
  const lines = (tourLines && tourLines[pending.stopId]) || [
    { image: "/imagebank/papadomo.png", text: "Onward." },
  ];
  const isLastStop = tour.stops[tour.stops.length - 1].id === pending.stopId;
  const wrapup = TOUR_WRAPUPS[tour.id];

  showDialogue(lines, () => {
    if (isLastStop && wrapup) {
      showDialogue(wrapup, () => render());
    } else {
      render();
    }
  });
}

handleReturn();

// Belt-and-suspenders for bfcache: a browser can restore this page from
// cache (e.g. after pressing back) without re-running the script the
// normal way. pageshow fires in both cases, with event.persisted true
// only for the cached-restore path -- re-running the check there costs
// nothing on a normal load and closes off a category of "came back and
// nothing updated" bugs this environment can't fully reproduce headlessly.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    handleReturn();
  }
});
