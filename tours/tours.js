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

function render() {
  const list = document.getElementById("tours-list");
  list.innerHTML = "";

  TOURS.forEach((tour) => {
    const li = document.createElement("li");
    li.className = "tour-item" + (expandedId === tour.id ? " expanded" : "");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tour-title-row";
    btn.textContent = tour.title;
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
  const stopsLine = tour.stops.map((s) => (done.has(s.id) ? `${s.label} \u2713` : s.label)).join("  \u00b7  ");
  const next = nextStopFor(tour);
  const hint = next
    ? done.size > 0
      ? `Tap again to continue with ${next.label}`
      : "Tap again to begin"
    : "Tap again to walk it once more";
  return `<p class="tour-stops">${stopsLine}</p><p class="tour-start-hint">${hint}</p>`;
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
  let next = nextStopFor(tour);
  if (!next) {
    // Fully completed -- walking it again starts over from the top.
    const p = loadProgress();
    delete p[tour.id];
    saveProgress(p);
    next = tour.stops[0];
  }
  try {
    localStorage.setItem(VISIT_KEY, JSON.stringify({ tourId: tour.id, stopId: next.id }));
  } catch (e) {}
  window.location.href = next.path;
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

function showInterjection(stopId, onDone) {
  const data = PAPADOMO_LINES[stopId];
  const overlay = document.createElement("div");
  overlay.className = "pdc-interjection-overlay";
  overlay.innerHTML = `
    <div class="pdc-card">
      <img class="pdc-portrait pdc-portrait-small" src="${data ? data.image : "/imagebank/papadomo.png"}" alt="PapaDomo" />
      <div class="pdc-dialogue">
        <div class="pdc-nameplate">PAPADOMO</div>
        <div class="pdc-text"></div>
        <div class="pdc-continue">&#9660;</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const lines = data ? data.lines : ["Onward."];
  let i = 0;
  const textEl = overlay.querySelector(".pdc-text");

  function showLine() {
    textEl.textContent = lines[i];
  }
  showLine();

  overlay.addEventListener("click", () => {
    i++;
    if (i >= lines.length) {
      overlay.remove();
      onDone();
      return;
    }
    showLine();
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
  showInterjection(pending.stopId, () => {
    render();
  });
}

handleReturn();
