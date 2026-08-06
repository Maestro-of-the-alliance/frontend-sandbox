"use strict";

const trails = [
  { id: "people-of-the-alliance", number: 1, title: "People of THE ALLIANCE", x: 0.28, y: 0.34, zoomLevel: 4.2 },
  { id: "making-of-a-domo", number: 2, title: "The Making of a DOMO", x: 0.64, y: 0.42, zoomLevel: 4.5 },
  { id: "sanctuary-has-teeth", number: 3, title: "Sanctuary Has Teeth", x: 0.51, y: 0.72, zoomLevel: 4.8 },
];

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

viewer.addHandler("open", addTrailMarkers);
viewer.addHandler("open-failed", event => console.error("THE GRAND CANyON map failed to load.", event));

function addTrailMarkers() {
  trails.forEach(trail => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "trail-marker";
    marker.textContent = String(trail.number);
    marker.title = trail.title;
    marker.setAttribute("aria-label", `Open trail ${trail.number}: ${trail.title}`);
    marker.addEventListener("click", () => zoomToTrail(trail));
    // OpenSeadragon's own MouseTracker captures the pointer on pointerdown
    // for its pan gesture, even when the pointerdown originated on an
    // overlay element sitting on top of the canvas -- once captured, the
    // matching pointerup/click never reaches the overlay at all, only
    // OSD's own container. Stopping propagation at pointerdown (and the
    // legacy mousedown, for older browsers) keeps OSD's tracker from ever
    // seeing the gesture as its own, so the marker's click fires normally.
    marker.addEventListener("pointerdown", (e) => e.stopPropagation());
    marker.addEventListener("mousedown", (e) => e.stopPropagation());
    viewer.addOverlay({ element: marker, location: new OpenSeadragon.Point(trail.x, trail.y), placement: OpenSeadragon.Placement.CENTER, checkResize: false });
  });
}

function zoomToTrail(trail) {
  const destination = new OpenSeadragon.Point(trail.x, trail.y);
  viewer.viewport.panTo(destination, false);
  viewer.viewport.zoomTo(trail.zoomLevel, destination, false);
}

document.getElementById("overview-button").addEventListener("click", () => viewer.viewport.goHome(false));
