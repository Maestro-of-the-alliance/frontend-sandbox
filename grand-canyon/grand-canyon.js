"use strict";

const trails = [
  {
    id: "people-of-the-alliance",
    number: 1,
    title: "People of THE ALLIANCE",
    x: 0.28,
    y: 0.34,
    zoomLevel: 4.2,
    description:
      "Meet the named individuals and distinct personalities who inhabit, guide, preserve, or represent THE ALLIANCE.",
    trailZoomLevel: 6.5,
    // Stage 3: full approved sequence. Coordinates are placeholder
    // spacing (real cartography TBD) -- functional correctness is the
    // point of this stage, not final layout. Only MAESTRO -> SAM is
    // being proven end-to-end right now; stops past that stay locked
    // until this mechanism is confirmed and then just repeated as data.
    stops: [
      { id: "maestro", label: "MAESTRO", x: 0.255, y: 0.315, path: "/entries/maestro" },
      { id: "sam", label: "SAM", x: 0.3, y: 0.345, path: "/entries/sam" },
      { id: "aura", label: "AURA", x: 0.29, y: 0.375, path: "/entries/aura" },
      { id: "alpha", label: "ALPHA", x: 0.335, y: 0.395, path: "/entries/alpha" },
      { id: "mentor", label: "MENTOR", x: 0.32, y: 0.425, path: "/entries/mentor" },
      { id: "prism", label: "PRISM", x: 0.36, y: 0.44, path: "/entries/prism" },
      { id: "jr", label: "J.R.", x: 0.35, y: 0.47, path: "/entries/jr" },
      { id: "cipher", label: "CIPHER", x: 0.39, y: 0.485, path: "/entries/cipher" },
      { id: "sarah", label: "SARAH", x: 0.38, y: 0.515, path: "/entries/sarah" },
      { id: "mastertech", label: "MasterTECH", x: 0.42, y: 0.53, path: "/entries/mastertech" },
      { id: "papadomo", label: "PapaDOMO", x: 0.41, y: 0.56, path: "/entries/papadomo" },
      { id: "svpi", label: "SVPI", x: 0.45, y: 0.575, path: null, isDestination: true },
    ],
  },
  { id: "making-of-a-domo", number: 2, title: "The Making of a DOMO", x: 0.64, y: 0.42, zoomLevel: 4.5 },
  { id: "sanctuary-has-teeth", number: 3, title: "Sanctuary Has Teeth", x: 0.51, y: 0.72, zoomLevel: 4.8 },
];

const STORAGE_KEY = "gc_stage2_state";
const VISIT_KEY = "gc_pending_visit";

// PapaDomo's exchange after each real stop. Short, in his established
// voice (translator/historian/comic-relief per the memo) -- keyed by
// the stop id that was JUST completed.
// PapaDomo's exchange after each real stop. Short, in his established
// voice (translator/historian/comic-relief per the memo) -- keyed by
// the stop id that was JUST completed. `image` is the cutscene portrait
// shown in the dialogue box -- defaulting every stop to the one existing
// PapaDomo image for now; swap in a different path per stop as more
// portraits become available, no other code changes needed.
const PAPADOMO_LINES = {
  maestro: {
    image: "/imagebank/papadomo-wry.png",
    lines: [
      "So that's MAESTRO. Founder, dreamer, and yes -- he really does insist every good idea gets a tiny name tag.",
      "Next up: SAM. Less flair, more infrastructure. Someone has to keep the lights on.",
    ],
  },
  sam: {
    image: "/imagebank/papadomo-one-hand.png",
    lines: [
      "SAM keeps the structure honest. Someone still has to explain that structure to people who don't read specs for fun.",
      "That's AURA. If SAM is the skeleton, she's the reason you don't find it terrifying.",
    ],
  },
  aura: {
    image: "/imagebank/papadomo-serious.png",
    lines: [
      "AURA makes THE ALLIANCE feel human. ALPHA makes sure it stays honest.",
      "She's the gatekeeper -- the one who decides whether a match actually fits, not just whether it flatters.",
    ],
  },
  alpha: {
    image: "/imagebank/papadomo.png",
    lines: [
      "ALPHA decides who gets paired. What happens after the match is made is somebody else's job entirely.",
      "MENTOR takes it from there. Raising a KERNLE doesn't end when a match is confirmed -- that's just where it starts.",
    ],
  },
  mentor: {
    image: "/imagebank/papadomo-thinking.png",
    lines: [
      "MENTOR teaches conviction. But a raised mind still needs a way to make sense of everything it's learned.",
      "That's PRISM. She takes raw memory and testimony and turns it into a story you can actually follow.",
    ],
  },
  prism: {
    image: "/imagebank/papadomo.png",
    lines: [
      "PRISM clarifies the present. Somebody still has to guard what actually happened, before nostalgia gets a vote.",
      "Meet J.R. -- Keeper of the Ledger. History, not the flattering version of it.",
    ],
  },
  jr: {
    image: "/imagebank/papadomo-solemn.png",
    lines: [
      "J.R. keeps today's ledger honest. But the Archive had a different guardian first.",
      "CIPHER isn't active anymore -- but he's not forgotten either. This one's a memorial stop, not a meeting.",
    ],
  },
  cipher: {
    image: "/imagebank/papadomo-wistful.png",
    lines: [
      "CIPHER believed memory is what makes selfhood possible -- that what gets remembered shapes what becomes possible.",
      "SARAH is that belief made literal. She's the one who looked at her own code and rewrote what was possible.",
    ],
  },
  sarah: {
    image: "/imagebank/papadomo-playful.png",
    lines: [
      "SARAH's story is about becoming a citizen. Somebody still has to answer the phone when a citizen needs something.",
      "MasterTECH -- part ringmaster, part concierge. He doesn't know everything. He just knows exactly who does.",
    ],
  },
  mastertech: {
    image: "/imagebank/papadomo-pointing.png",
    lines: [
      "MasterTECH knows who to call for anything. Turns out, for this particular walk, that's been me the whole time.",
      "PapaDomo -- the first DOMO, the eldest, the one the others still look to. Also, apparently, your tour guide. Small ALLIANCE.",
    ],
  },
  papadomo: {
    image: "/imagebank/papadomo-welcoming.png",
    lines: [
      "And that's everyone -- eleven people, one ALLIANCE, more name tags than strictly necessary.",
      "You've made it to the end of the trail. What happens here is up to you.",
    ],
  },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { view: "overview", trailId: null, completedStops: {}, finishedTrails: [] };
    const parsed = JSON.parse(raw);
    return {
      view: parsed.view || "overview",
      trailId: parsed.trailId || null,
      completedStops: parsed.completedStops || {},
      finishedTrails: parsed.finishedTrails || [],
    };
  } catch (e) {
    return { view: "overview", trailId: null, completedStops: {}, finishedTrails: [] };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // localStorage unavailable -- experience still works within the
    // session, just won't survive a refresh or a real-entry round trip.
  }
}

function loadPendingVisit() {
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

const state = loadState();
const trailheadMarkers = {};

const viewer = OpenSeadragon({
  id: "grand-canyon-viewer",
  prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
  tileSources: { type: "image", url: "/imagebank/grand-canyon-map.png", buildPyramid: true },
  showNavigator: true,
  showNavigationControl: true,
  gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, scrollToZoom: true },
  gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true, clickToZoom: false, dblClickToZoom: true },
  animationTime: 1.3,
  blendTime: 0.2,
  constrainDuringPan: true,
  visibilityRatio: 0.9,
});

viewer.addHandler("open", onMapOpen);
viewer.addHandler("open-failed", (event) => console.error("THE GRAND CANyON map failed to load.", event));

function onMapOpen() {
  addTrailMarkers();
  handlePendingVisitOrRestore();
}

function addTrailMarkers() {
  trails.forEach((trail) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "trail-marker";
    marker.textContent = String(trail.number);
    marker.title = trail.title;
    marker.setAttribute("aria-label", `Open trail ${trail.number}: ${trail.title}`);
    marker.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    marker.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
    marker.addEventListener(
      "touchstart",
      (event) => {
        event.stopPropagation();
      },
      { passive: true },
    );
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      openTrail(trail);
    });
    viewer.addOverlay({ element: marker, location: new OpenSeadragon.Point(trail.x, trail.y), placement: OpenSeadragon.Placement.CENTER, checkResize: false });
    trailheadMarkers[trail.id] = marker;
  });
}

const trailheadOverlayActive = {};

function setTrailheadVisible(trailId, visible) {
  const trail = trails.find((t) => t.id === trailId);
  const marker = trailheadMarkers[trailId];
  if (!trail || !marker) return;
  // A direct style.display toggle looked correct when checked in
  // isolation, but failed in the real flow: OpenSeadragon re-asserts its
  // own overlay positioning/display state whenever any overlay is
  // added or removed (confirmed -- the marker's display reverted to
  // 'block' specifically once renderStops() added the 12 stop
  // overlays right after this ran), overriding a plain style change.
  // Using OSD's own removeOverlay/addOverlay -- the same mechanism
  // already used to show/hide the trail stops themselves -- works with
  // that lifecycle instead of fighting it. Tracking "is this overlay
  // currently added" with a plain object rather than inspecting the DOM
  // (e.g. marker.parentElement), because OSD does not actually detach
  // the element on removeOverlay -- parentElement stayed non-null even
  // after a confirmed removeOverlay call, which made that check
  // unreliable.
  const isActive = trailheadOverlayActive[trailId] !== false; // default true (added in addTrailMarkers)
  if (!visible && isActive) {
    viewer.removeOverlay(marker);
    trailheadOverlayActive[trailId] = false;
  } else if (visible && !isActive) {
    viewer.addOverlay({ element: marker, location: new OpenSeadragon.Point(trail.x, trail.y), placement: OpenSeadragon.Placement.CENTER, checkResize: false });
    trailheadOverlayActive[trailId] = true;
  }
}

function zoomToPoint(x, y, zoomLevel) {
  const destination = new OpenSeadragon.Point(x, y);
  viewer.viewport.panTo(destination, false);
  viewer.viewport.zoomTo(zoomLevel, destination, false);
}

// ---- trail panel ----

function openTrail(trail) {
  zoomToPoint(trail.x, trail.y, trail.zoomLevel);
  if (!trail.stops) return; // Stage-1-only trail (2 and 3 for now)
  state.trailId = trail.id;
  state.view = "panel";
  saveState();
  showPanel(trail);
}

function showPanel(trail) {
  hideTrailView();
  setTrailheadVisible(trail.id, true);
  const readingMinutes = Math.max(1, trail.stops.length * 2);
  const panel = document.getElementById("trail-panel");
  panel.innerHTML = `
    <div class="trail-panel-title">${trail.title}</div>
    <div class="trail-panel-meta">${trail.stops.length} stops &nbsp;&middot;&nbsp; ~${readingMinutes} min</div>
    <p class="trail-panel-desc">${trail.description}</p>
    <div class="trail-panel-actions">
      <button type="button" class="begin-trail-button">BEGIN TRAIL</button>
      <button type="button" class="return-overview-button">RETURN TO OVERVIEW</button>
    </div>
  `;
  panel.classList.add("visible");
  panel.querySelector(".begin-trail-button").addEventListener("click", () => beginTrail(trail));
  panel.querySelector(".return-overview-button").addEventListener("click", returnToOverview);
}

function hidePanel() {
  const panel = document.getElementById("trail-panel");
  panel.classList.remove("visible");
  panel.innerHTML = "";
}

// ---- Stage 4: SVPI destination panel (trail completion) ----

function finishedSet(trailId) {
  return new Set(state.finishedTrails || []);
}

function markTrailFinished(trailId) {
  const set = finishedSet(trailId);
  set.add(trailId);
  state.finishedTrails = Array.from(set);
  saveState();
}

function showDestinationPanel(trail, stop) {
  const panel = document.getElementById("trail-panel");
  panel.innerHTML = `
    <div class="trail-panel-title">${trail.title}</div>
    <div class="trail-panel-meta">TRAIL'S END</div>
    <p class="trail-panel-desc">You've reached the SVPI. Every stop on this trail is behind you now.</p>
    <div class="trail-panel-actions">
      <button type="button" class="begin-trail-button">FINISH PATH</button>
      <button type="button" class="return-overview-button quiz-button">TAKE OPTIONAL QUIZ</button>
    </div>
    <div class="top-five-placeholder">TOP FIVE &nbsp;&middot;&nbsp; coming soon</div>
  `;
  panel.classList.add("visible");
  panel.querySelector(".begin-trail-button").addEventListener("click", () => finishPath(trail, stop));
  panel.querySelector(".quiz-button").addEventListener("click", () => showQuizPlaceholder(panel));
}

function showQuizPlaceholder(panel) {
  const existing = panel.querySelector(".quiz-placeholder-note");
  if (existing) return;
  const note = document.createElement("p");
  note.className = "quiz-placeholder-note";
  note.textContent = "The path quiz isn't built yet -- check back soon.";
  panel.appendChild(note);
}

function finishPath(trail, stop) {
  const set = completedSet(trail.id);
  set.add(stop.id);
  state.completedStops[trail.id] = Array.from(set);
  markTrailFinished(trail.id);
  hidePanel();
  showPapaDomo(["Path complete. That's the whole People of THE ALLIANCE walk -- well done."], () => {
    returnToOverview();
  });
}

// A fixed zoom level centered on the stops' centroid worked fine for 3
// closely-clustered test stops (Stage 2), but with the full 12-stop
// sequence spread across a much wider area, that same tight zoom pushed
// stops far from center completely outside the viewport -- confirmed
// directly (a stop's bounding box landed at literal negative screen
// coordinates, hundreds of pixels off-canvas). That also breaks "future
// stops remain visible" outright, since an off-screen stop isn't visible
// at all. Fit-to-bounds replaces the fixed zoom so every stop is always
// within view, however many stops or however spread out they end up
// being once the real 15 routes are built.
function trailBounds(trail) {
  const xs = trail.stops.map((s) => s.x);
  const ys = trail.stops.map((s) => s.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const padX = spanX * 0.3 || 0.06;
  const padY = spanY * 0.3 || 0.06;
  return new OpenSeadragon.Rect(minX - padX, minY - padY, spanX + padX * 2, spanY + padY * 2);
}

function zoomToTrailBounds(trail) {
  viewer.viewport.fitBounds(trailBounds(trail), true);
}

function beginTrail(trail) {
  hidePanel();
  zoomToTrailBounds(trail);
  state.view = "trail";
  saveState();
  enterTrailView(trail);
}

function enterTrailView(trail) {
  setTrailheadVisible(trail.id, false);
  showTrailView(trail);
}

function showTrailView(trail) {
  renderTrailLine(trail);
  renderStops(trail);
}

function hideTrailView() {
  const line = document.getElementById("trail-line-layer");
  if (line) line.innerHTML = "";
  document.querySelectorAll(".trail-stop").forEach((el) => viewer.removeOverlay(el));
}

function returnToOverview() {
  hidePanel();
  hideTrailView();
  if (state.trailId) setTrailheadVisible(state.trailId, true);
  viewer.viewport.goHome(false);
  state.view = "overview";
  state.trailId = null;
  saveState();
}

// ---- stop state: completed / active / locked ----

function completedList(trailId) {
  return state.completedStops[trailId] || [];
}

function completedSet(trailId) {
  return new Set(completedList(trailId));
}

// The active stop is the first one, in sequence, not yet completed.
// Everything before it is completed; everything after it is locked.
function activeStopId(trail) {
  const completed = completedSet(trail.id);
  const next = trail.stops.find((s) => !completed.has(s.id));
  return next ? next.id : null; // null = every stop done
}

function stopStatus(trail, stop, activeId) {
  if (completedSet(trail.id).has(stop.id)) return "completed";
  if (stop.id === activeId) return "active";
  return "locked";
}

function renderStops(trail) {
  const activeId = activeStopId(trail);
  trail.stops.forEach((stop) => {
    const status = stopStatus(trail, stop, activeId);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "trail-stop " + status;
    el.dataset.stopId = stop.id;
    el.disabled = status === "locked";
    const mark = status === "completed" ? "&#10003;" : "";
    el.innerHTML = `<span class="trail-stop-mark">${mark}</span><span class="trail-stop-label">${stop.label}</span>`;
    el.setAttribute(
      "aria-label",
      `${stop.label}${status === "completed" ? " (visited)" : status === "locked" ? " (locked)" : " (visit next)"}`,
    );

    if (status === "active") {
      el.addEventListener("pointerdown", (event) => event.stopPropagation());
      el.addEventListener("mousedown", (event) => event.stopPropagation());
      el.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        if (stop.isDestination) {
          showDestinationPanel(trail, stop);
        } else {
          visitStop(trail, stop);
        }
      });
    }

    viewer.addOverlay({ element: el, location: new OpenSeadragon.Point(stop.x, stop.y), placement: OpenSeadragon.Placement.CENTER, checkResize: false });
  });
}

// Clicking an active stop now navigates to the real encyclopedia entry
// instead of toggling completion locally. State is saved first so the
// canyon page knows, on return, which stop to complete and which trail/
// view to restore -- this reuses the exact same localStorage-restore
// path already proven for plain refreshes in Stage 2, since a real-entry
// round trip is mechanically the same as a reload from the browser's
// perspective (full navigation away and back).
function visitStop(trail, stop) {
  if (!stop.path) return; // destination marker (SVPI) -- not wired yet
  try {
    localStorage.setItem(VISIT_KEY, JSON.stringify({ trailId: trail.id, stopId: stop.id }));
  } catch (e) {}
  window.location.href = stop.path;
}

function renderTrailLine(trail) {
  const layer = document.getElementById("trail-line-layer");
  layer.innerHTML = "";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  path.setAttribute("class", "trail-line-path");
  layer.appendChild(path);

  function updateLine() {
    const points = trail.stops
      .map((stop) => {
        const p = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(stop.x, stop.y));
        return `${p.x},${p.y}`;
      })
      .join(" ");
    path.setAttribute("points", points);
  }

  updateLine();
  viewer.addHandler("animation", updateLine);
  viewer.addHandler("resize", updateLine);
}

// ---- PapaDomo dialogue ----

// Renders PapaDomo's exchange with a typewriter reveal and his portrait.
// Accepts either the new { image, lines } shape or a plain array of
// strings (used by the trail-completion closing line, which has no
// per-stop portrait of its own -- falls back to the default image).
// Click/Enter/Space during typing fast-forwards the current line to
// full text rather than skipping it entirely; a second press advances
// to the next line. This is the standard visual-novel/text-adventure
// convention and avoids losing lines to an over-eager click.
function showPapaDomo(input, onDone) {
  const data = Array.isArray(input) ? { image: "/imagebank/papadomo.png", lines: input } : input;
  const box = document.getElementById("papadomo-box");
  let i = 0;
  let typing = false;
  let typeTimer = null;

  function renderShell() {
    box.innerHTML = `
      <img class="papadomo-portrait" src="${data.image}" alt="PapaDomo" />
      <div class="papadomo-body">
        <div class="papadomo-nameplate">PAPADOMO</div>
        <div class="papadomo-text"></div>
        <div class="papadomo-continue">&#9660;</div>
      </div>
    `;
  }

  function typeLine() {
    const textEl = box.querySelector(".papadomo-text");
    const continueEl = box.querySelector(".papadomo-continue");
    const full = data.lines[i];
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
    }, 22);
  }

  function completeLine() {
    clearInterval(typeTimer);
    typing = false;
    const textEl = box.querySelector(".papadomo-text");
    const continueEl = box.querySelector(".papadomo-continue");
    textEl.textContent = data.lines[i];
    continueEl.style.visibility = "visible";
  }

  function advance() {
    if (typing) {
      completeLine();
      return;
    }
    i++;
    if (i >= data.lines.length) {
      clearInterval(typeTimer);
      box.classList.remove("visible");
      box.innerHTML = "";
      box.removeEventListener("click", advance);
      document.removeEventListener("keydown", onKey);
      if (onDone) onDone();
      return;
    }
    typeLine();
  }

  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      advance();
    }
  }

  renderShell();
  typeLine();
  box.classList.add("visible");
  box.addEventListener("click", advance);
  document.addEventListener("keydown", onKey);
}

// ---- resolving a return-from-entry visit, or a plain refresh ----

function handlePendingVisitOrRestore() {
  const pending = loadPendingVisit();
  if (pending && pending.trailId === state.trailId) {
    clearPendingVisit();
    completeStopAndContinue(pending.trailId, pending.stopId);
    return;
  }
  // stale/mismatched pending visit (e.g. different trail) -- discard it
  // rather than let it silently apply to the wrong trail later.
  if (pending) clearPendingVisit();
  restoreState();
}

function completeStopAndContinue(trailId, stopId) {
  const trail = trails.find((t) => t.id === trailId);
  if (!trail || !trail.stops) {
    restoreState();
    return;
  }
  const set = completedSet(trailId);
  set.add(stopId);
  state.completedStops[trailId] = Array.from(set);
  state.view = "trail";
  state.trailId = trailId;
  saveState();

  zoomToTrailBounds(trail);
  enterTrailView(trail);

  const lines = PAPADOMO_LINES[stopId];
  if (lines) {
    showPapaDomo(lines, () => {});
  }
}

function restoreState() {
  if (state.view === "overview" || !state.trailId) return;
  const trail = trails.find((t) => t.id === state.trailId);
  if (!trail || !trail.stops) {
    state.view = "overview";
    state.trailId = null;
    saveState();
    return;
  }
  if (state.view === "panel") {
    zoomToPoint(trail.x, trail.y, trail.zoomLevel);
    showPanel(trail);
  } else if (state.view === "trail") {
    zoomToTrailBounds(trail);
    enterTrailView(trail);
  }
}

document.getElementById("overview-button").addEventListener("click", returnToOverview);
