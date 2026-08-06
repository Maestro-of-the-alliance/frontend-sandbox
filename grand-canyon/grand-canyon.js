"use strict";

const trails = [
  {
    id: "people-of-the-alliance",
    number: 1,
    title: "People of THE ALLIANCE",
    x: 0.28,
    y: 0.34,
    zoomLevel: 4.2,
    // Stage 2 fields -- only trail 1 carries these. Trails 2/3 stay
    // Stage-1-only (plain zoom, no panel) until the real 15 routes are built.
    description:
      "Meet the named individuals and distinct personalities who inhabit, guide, preserve, or represent THE ALLIANCE.",
    trailZoomLevel: 6.5,
    stops: [
      { id: "maestro", label: "MAESTRO", x: 0.255, y: 0.315 },
      { id: "sam", label: "SAM", x: 0.3, y: 0.345 },
      { id: "aura", label: "AURA", x: 0.29, y: 0.375 },
    ],
  },
  { id: "making-of-a-domo", number: 2, title: "The Making of a DOMO", x: 0.64, y: 0.42, zoomLevel: 4.5 },
  { id: "sanctuary-has-teeth", number: 3, title: "Sanctuary Has Teeth", x: 0.51, y: 0.72, zoomLevel: 4.8 },
];

const STORAGE_KEY = "gc_stage2_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { view: "overview", trailId: null, completedStops: {} };
    const parsed = JSON.parse(raw);
    return {
      view: parsed.view || "overview",
      trailId: parsed.trailId || null,
      completedStops: parsed.completedStops || {},
    };
  } catch (e) {
    return { view: "overview", trailId: null, completedStops: {} };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // localStorage unavailable (private browsing, quota, etc.) -- the
    // experience still works within the session, it just won't survive
    // a refresh. Not worth surfacing to the visitor.
  }
}

const state = loadState();

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
  restoreState();
}

function addTrailMarkers() {
  trails.forEach((trail) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "trail-marker";
    marker.textContent = String(trail.number);
    marker.title = trail.title;
    marker.setAttribute("aria-label", `Open trail ${trail.number}: ${trail.title}`);
    // OpenSeadragon's own MouseTracker captures the pointer on pointerdown
    // for its pan gesture, even when the pointerdown originated on an
    // overlay element sitting on top of the canvas -- once captured, the
    // matching pointerup/click never reaches the overlay at all, only
    // OSD's own container. Stopping propagation at pointerdown keeps OSD's
    // tracker from ever seeing the gesture as its own, so the marker's
    // click fires normally. mousedown/touchstart are defensive fallbacks
    // for browser differences; click also stops propagation so the
    // completed gesture can't trigger anything beneath it either.
    // (Per Sam, confirming and completing the fix.)
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
  });
}

function zoomToPoint(x, y, zoomLevel) {
  const destination = new OpenSeadragon.Point(x, y);
  viewer.viewport.panTo(destination, false);
  viewer.viewport.zoomTo(zoomLevel, destination, false);
}

// ---- Stage 2: trail panel + trail view ----

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

function beginTrail(trail) {
  hidePanel();
  const cx = trail.stops.reduce((sum, s) => sum + s.x, 0) / trail.stops.length;
  const cy = trail.stops.reduce((sum, s) => sum + s.y, 0) / trail.stops.length;
  zoomToPoint(cx, cy, trail.trailZoomLevel);
  state.view = "trail";
  saveState();
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
  viewer.viewport.goHome(false);
  state.view = "overview";
  state.trailId = null;
  saveState();
}

function completedSet(trailId) {
  return new Set(state.completedStops[trailId] || []);
}

function renderStops(trail) {
  const completed = completedSet(trail.id);
  trail.stops.forEach((stop) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "trail-stop" + (completed.has(stop.id) ? " completed" : "");
    el.dataset.stopId = stop.id;
    el.innerHTML = `<span class="trail-stop-mark">${completed.has(stop.id) ? "&#10003;" : ""}</span><span class="trail-stop-label">${stop.label}</span>`;
    el.setAttribute("aria-label", `${stop.label}${completed.has(stop.id) ? " (visited)" : ""}`);

    el.addEventListener("pointerdown", (event) => event.stopPropagation());
    el.addEventListener("mousedown", (event) => event.stopPropagation());
    el.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
    el.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleStop(trail, stop, el);
    });

    viewer.addOverlay({ element: el, location: new OpenSeadragon.Point(stop.x, stop.y), placement: OpenSeadragon.Placement.CENTER, checkResize: false });
  });
}

function toggleStop(trail, stop, el) {
  const set = completedSet(trail.id);
  if (set.has(stop.id)) {
    set.delete(stop.id);
    el.classList.remove("completed");
    el.querySelector(".trail-stop-mark").innerHTML = "";
  } else {
    set.add(stop.id);
    el.classList.add("completed");
    el.querySelector(".trail-stop-mark").innerHTML = "&#10003;";
  }
  state.completedStops[trail.id] = Array.from(set);
  saveState();
}

// Trail-connector line, redrawn on every viewport change. trail.stops'
// x/y are OpenSeadragon *viewport* coordinates -- the same coordinate
// space already used directly by panTo/addOverlay throughout this file
// -- so the conversion here uses viewportToViewerElementCoordinates,
// matching that convention exactly rather than treating them as raw
// image-pixel coordinates.
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
    const cx = trail.stops.reduce((sum, s) => sum + s.x, 0) / trail.stops.length;
    const cy = trail.stops.reduce((sum, s) => sum + s.y, 0) / trail.stops.length;
    zoomToPoint(cx, cy, trail.trailZoomLevel);
    showTrailView(trail);
  }
}

document.getElementById("overview-button").addEventListener("click", returnToOverview);
