import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PLANETARY_DIMENSIONS, SUN_DATA } from "../data/encyclopedia";
import { SimulationConfig } from "../types";

interface SolarSystemCanvasProps {
  selectedPlanetId: string | null;
  onPlanetSelect: (planetId: string | null) => void;
  onEntrySelect: (entrySlug: string) => void;
  simulationConfig: SimulationConfig;
  hoveredPlanetId: string | null;
  onPlanetHover: (planetId: string | null) => void;
  activeEntrySlug: string | null;
}

// Procedural Canvas Texture Generator
function generatePlanetTexture(id: string, colors: string[], spotColor?: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  if (id === "earth") {
    // Earth: Ocean, landmasses, and glowing tech grid
    ctx.fillStyle = "#0c1e36"; // Cobalt deep ocean
    ctx.fillRect(0, 0, 1024, 512);

    // Draw stylized continental landmasses
    ctx.fillStyle = "#059669"; // Emerald green
    const drawLand = (cx: number, cy: number, r: number, noise: number) => {
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
        const rad = r + Math.sin(angle * 7) * noise + Math.cos(angle * 3) * (noise * 0.5);
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Draw several landmass blobs
    drawLand(250, 200, 120, 30);
    drawLand(450, 300, 90, 20);
    drawLand(750, 180, 110, 25);
    drawLand(850, 350, 70, 15);
    drawLand(150, 400, 50, 10);

    // Draw some island specs
    ctx.fillStyle = "#34d399";
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 8 + 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add glowing white grid lines representing infrastructure
    ctx.strokeStyle = "rgba(167, 243, 208, 0.25)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
    for (let j = 0; j < 512; j += 64) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1024, j);
      ctx.stroke();
    }

    // High tech fiber glowing paths
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.arc(250, 200, 140, 0, Math.PI * 2);
    ctx.arc(750, 180, 130, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (id === "mercury") {
    // Mercury: dark gray cratered with deep adversarial red lava lines
    ctx.fillStyle = "#1e1b1b";
    ctx.fillRect(0, 0, 1024, 512);

    // Add deep lava cracks
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#f87171";
    ctx.shadowBlur = 10;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      let x = Math.random() * 1024;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      for (let j = 0; j < 6; j++) {
        x += (Math.random() - 0.5) * 100;
        y += (Math.random() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0; // reset

    // Add craters
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const r = Math.random() * 25 + 5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else {
    // Gas giants or other planetary bands
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    colors.forEach((col, index) => {
      grad.addColorStop(index / (colors.length - 1), col);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Add fine banding detail and atmospheric noise
    for (let i = 0; i < 30; i++) {
      const h = Math.random() * 35 + 5;
      const y = Math.random() * 512;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.08})`;
      ctx.fillRect(0, y, 1024, h);
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.12})`;
      ctx.fillRect(0, y + h, 1024, h * 0.5);
    }

    // Jupiter-like red spot
    if (spotColor) {
      ctx.fillStyle = spotColor;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(700, 320, 60, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Swirling atmosphere rings around the spot
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(700, 320, 80, 48, 0.1, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Generate Saturn / Uranus Rings Texture
function generateRingTexture(baseColor: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 16;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.1, baseColor);
  grad.addColorStop(0.3, "rgba(0,0,0,0.1)");
  grad.addColorStop(0.4, baseColor);
  grad.addColorStop(0.5, "rgba(255,255,255,0.7)");
  grad.addColorStop(0.65, "rgba(0,0,0,0.2)");
  grad.addColorStop(0.8, baseColor);
  grad.addColorStop(0.95, "rgba(255,255,255,0.2)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 16);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function SolarSystemCanvas({
  selectedPlanetId,
  onPlanetSelect,
  onEntrySelect,
  simulationConfig,
  hoveredPlanetId,
  onPlanetHover,
  activeEntrySlug,
}: SolarSystemCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep ref to allow THREE rendering loop to read latest state AND latest callbacks
  // without ever needing to re-create the scene. The scene only gets built once, on
  // mount — everything interactive flows through this ref instead.
  const propsRef = useRef({
    selectedPlanetId,
    simulationConfig,
    activeEntrySlug,
    onPlanetSelect,
    onEntrySelect,
    onPlanetHover,
  });

  useEffect(() => {
    propsRef.current = {
      selectedPlanetId,
      simulationConfig,
      activeEntrySlug,
      onPlanetSelect,
      onEntrySelect,
      onPlanetHover,
    };
  }, [selectedPlanetId, simulationConfig, activeEntrySlug, onPlanetSelect, onEntrySelect, onPlanetHover]);

  // Label positions are written directly to these DOM refs from inside the
  // animate() loop below — NOT through React state. Pushing per-frame pixel
  // positions through setState meant every label update waited on a React
  // render/commit cycle, landing at least one frame behind the actual WebGL
  // draw. That's what caused labels to visibly lag the planets, worse at
  // higher warp speeds. Direct ref writes happen in the same frame as render().
  const planetLabelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const satLabelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // WebGL context loss happens on real devices under memory pressure — mobile
  // browsers reclaim the GPU context mid-session, especially after the tab
  // backgrounds or during a long visit. Without handling this, the canvas goes
  // silently blank and never recovers, even on retry. Rather than attempt to
  // rebuild the entire live scene in place (real risk of new bugs), show a
  // clear recovery screen and let a full reload cleanly reinitialize everything.
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Live-updating size — read/written by both the resize observer and the
    // animate loop's label-projection math below. Previously "width"/"height"
    // were captured once here and never touched again; that was invisible
    // while the scene rebuilt on every hover (the jitter bug), which kept
    // re-capturing correct values by accident. Now that the scene builds once,
    // a bad initial capture (e.g. before the container has settled its layout
    // size in an iframe) would permanently mis-place every HUD label off-screen.
    const size = {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    };

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#030308", 0.003);

    const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
    camera.position.set(0, 45, 95);

    // RENDERER
    // Creating a WebGLRenderer can throw outright (not just fail silently)
    // if the browser can't hand back a GPU context yet -- plausible right
    // after a reload that was itself triggered by a context-loss event, if
    // the OS/browser hasn't actually finished freeing the previous context.
    // Previously this had no guard: a throw here unwound the whole effect
    // with no UI feedback at all, leaving just the page's own static CSS
    // background (the dot-grid pattern in index.css) visible with nothing
    // on top of it and no way to tell what happened. Catching it and
    // reusing the existing contextLost recovery screen turns that silent
    // dead-end into the same actionable "Reconnect" state instead.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      console.error("WebGLRenderer creation failed:", err);
      setContextLost(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size.width, size.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // WebGL context loss handling — must call preventDefault() on the lost
    // event for the browser to ever consider restoring it at all. We don't
    // attempt to rebuild the live scene in place; a full reload is the safe,
    // reliable recovery path and avoids introducing new state-sync bugs.
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      // Restoration is possible, but this component's Three.js state (scene,
      // geometries, materials) is not designed to be rebuilt without a full
      // remount. A reload is the correct recovery here, not silent resume.
      window.location.reload();
    };
    canvasRef.current.addEventListener("webglcontextlost", handleContextLost, false);
    canvasRef.current.addEventListener("webglcontextrestored", handleContextRestored, false);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight("#0f1225", 1.8);
    scene.add(ambientLight);

    // Radiant Sun Point Light (the center, AVPI)
    const sunLight = new THREE.PointLight(SUN_DATA.color, 12, 350, 0.4);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Extra fill light from above for beautiful spatial definitions
    const fillLight = new THREE.DirectionalLight("#a5b4fc", 0.6);
    fillLight.position.set(10, 50, 20);
    scene.add(fillLight);

    // STARFIELD BACKGROUND (Particle System)
    const starCount = 3000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute in a huge shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 250 + Math.random() * 150; // far away

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      // Color variation: mostly bright white, some amber/gold
      const isGolden = Math.random() > 0.8;
      starColors[i * 3] = isGolden ? 0.96 : 0.9; // R
      starColors[i * 3 + 1] = isGolden ? 0.77 : 0.9; // G
      starColors[i * 3 + 2] = isGolden ? 0.2 : 1.0; // B
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // SUN (THE ALLIANCE)
    const sunGeom = new THREE.SphereGeometry(SUN_DATA.radius, 48, 48);
    const sunCanvas = document.createElement("canvas");
    sunCanvas.width = 1024;
    sunCanvas.height = 512;
    const sunCtx = sunCanvas.getContext("2d")!;

    // Background gradient (hot fiery amber to golden core) — the sun is now just
    // a mostly-translucent glowing shell. No emblem is stamped onto its surface;
    // instead a separate medallion mesh sits inside it (see below), visible
    // through the shell and counter-rotating against it.
    const sunGrad = sunCtx.createLinearGradient(0, 0, 1024, 0);
    sunGrad.addColorStop(0, SUN_DATA.secondaryColor);
    sunGrad.addColorStop(0.25, SUN_DATA.color);
    sunGrad.addColorStop(0.5, SUN_DATA.secondaryColor);
    sunGrad.addColorStop(0.75, SUN_DATA.color);
    sunGrad.addColorStop(1, SUN_DATA.secondaryColor);
    sunCtx.fillStyle = sunGrad;
    sunCtx.fillRect(0, 0, 1024, 512);

    // Draw radiant solar flare background noise
    for (let i = 0; i < 60; i++) {
      sunCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.12 + 0.05})`;
      sunCtx.beginPath();
      sunCtx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 50 + 20, 0, Math.PI * 2);
      sunCtx.fill();
    }

    const sunTexture = new THREE.CanvasTexture(sunCanvas);

    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false, // critical: without this, the sun's near-side surface
      // writes to the depth buffer despite being translucent, which silently
      // hides anything behind it — including the medallion at its center.
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunMesh.name = "sun";
    scene.add(sunMesh);

    // MEDALLION — the real AVPI emblem, now built as an actual two-sided object
    // with real thickness (a "rim" connecting front and back) instead of a single
    // flat plane. A single DoubleSide plane shows a mirrored backside by design —
    // that's physically correct for a transparent card, but wrong for a medallion,
    // which has two independently-correct faces like a real coin. Sized to the
    // sun's full diameter so the medallion effectively IS the glowing surface,
    // rather than a smaller disc floating inside a larger separate shell.
    const medallionAspect = 733 / 646;
    const medallionHeight = SUN_DATA.radius * 2; // was radius*1.3 — now spans full diameter
    const medallionWidth = medallionHeight * medallionAspect;
    const medallionDepth = SUN_DATA.radius * 0.18; // real thickness between the two faces

    const medallionGroup = new THREE.Group();
    scene.add(medallionGroup);

    // Front face — reads correctly from the +Z side
    const frontGeom = new THREE.PlaneGeometry(medallionWidth, medallionHeight);
    const frontMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const frontMesh = new THREE.Mesh(frontGeom, frontMat);
    frontMesh.position.z = medallionDepth / 2;
    medallionGroup.add(frontMesh);

    // Back face — same texture, but its UV is horizontally flipped so that once
    // rotated 180° to face -Z, the image reads correctly (not mirrored) to a
    // viewer looking at it from the back side.
    const backGeom = new THREE.PlaneGeometry(medallionWidth, medallionHeight);
    const uvAttr = backGeom.getAttribute("uv");
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setX(i, 1 - uvAttr.getX(i));
    }
    uvAttr.needsUpdate = true;
    const backMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const backMesh = new THREE.Mesh(backGeom, backMat);
    backMesh.position.z = -medallionDepth / 2;
    backMesh.rotation.y = Math.PI;
    medallionGroup.add(backMesh);

    // Rim — a thin cylinder edge connecting front and back, giving the medallion
    // actual visible thickness instead of two paper-flat planes floating apart.
    const rimGeom = new THREE.CylinderGeometry(medallionHeight / 2, medallionHeight / 2, medallionDepth, 48, 1, true);
    const rimMat = new THREE.MeshBasicMaterial({
      color: "#8a6a2a",
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.rotation.x = Math.PI / 2; // cylinder's axis defaults to Y; rotate so it runs along Z
    medallionGroup.add(rimMesh);

    const medallionLoader = new THREE.TextureLoader();
    medallionLoader.load(`${import.meta.env.BASE_URL}avpi.png`, (tex) => {
      frontMat.map = tex;
      backMat.map = tex;
      frontMat.opacity = 1;
      backMat.opacity = 1;
      rimMat.opacity = 0.9;
      frontMat.needsUpdate = true;
      backMat.needsUpdate = true;
      rimMat.needsUpdate = true;
    });

    // Outer glow halo for the sun
    const glowGeom = new THREE.SphereGeometry(SUN_DATA.radius * 1.15, 30, 30);
    const glowMat = new THREE.MeshBasicMaterial({
      color: SUN_DATA.color,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const sunGlowMesh = new THREE.Mesh(glowGeom, glowMat);
    scene.add(sunGlowMesh);

    // PLANETS & ORBITS CONTAINERS
    const planetGroupMap = new Map<string, THREE.Group>();
    const planetMeshMap = new Map<string, THREE.Mesh>();
    const orbitLineMap = new Map<string, THREE.LineLoop>();

    // We will keep a map of original angles to orbit continuously
    const planetAngles = new Map<string, number>();

    PLANETARY_DIMENSIONS.forEach((p) => {
      // 1. Orbit lines (golden glowing hoops)
      const orbitGeom = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segmentCount = 120;
      for (let i = 0; i <= segmentCount; i++) {
        const theta = (i / segmentCount) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * p.orbitDistance, 0, Math.sin(theta) * p.orbitDistance));
      }
      orbitGeom.setFromPoints(points);

      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(p.color),
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const orbitLine = new THREE.LineLoop(orbitGeom, orbitMat);
      scene.add(orbitLine);
      orbitLineMap.set(p.id, orbitLine);

      // 2. Planet Group (contains planet, rings, moons, etc.)
      const planetGroup = new THREE.Group();
      scene.add(planetGroup);
      planetGroupMap.set(p.id, planetGroup);

      // Initialize unique orbital starting angle
      planetAngles.set(p.id, Math.random() * Math.PI * 2);

      // 3. The Planet Sphere
      const planetGeom = new THREE.SphereGeometry(p.radius, 32, 32);
      const planetTex = generatePlanetTexture(p.id, p.visualFeatures.stripeColors || [], p.visualFeatures.spotColor);
      const planetMat = new THREE.MeshStandardMaterial({
        map: planetTex,
        roughness: p.id === "earth" ? 0.4 : 0.85,
        metalness: p.id === "mercury" ? 0.7 : p.id === "earth" ? 0.1 : 0.2,
        bumpScale: 0.05,
      });

      const planetMesh = new THREE.Mesh(planetGeom, planetMat);
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;
      planetMesh.name = `planet-${p.id}`;
      planetGroup.add(planetMesh);
      planetMeshMap.set(p.id, planetMesh);

      // 4. Special visual features: RINGS (Saturn, Uranus)
      if (p.visualFeatures.hasRings) {
        const inner = p.visualFeatures.ringRadiusInner || p.radius * 1.5;
        const outer = p.visualFeatures.ringRadiusOuter || p.radius * 2.5;

        // Custom ring geometry (double-sided ring)
        const ringGeom = new THREE.RingGeometry(inner, outer, 64);
        
        // Map texture coordinates (Uranus has vertical, Saturn horizontal)
        const uvs = ringGeom.attributes.uv;
        const pos = ringGeom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const dist = Math.sqrt(vx * vx + vy * vy);
          const u = (dist - inner) / (outer - inner);
          uvs.setXY(i, u, 0.5);
        }

        const ringTex = generateRingTexture(p.color);
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending,
        });

        const ringMesh = new THREE.Mesh(ringGeom, ringMat);

        if (p.id === "uranus") {
          // Uranus tilt: roll the ring almost vertical!
          ringMesh.rotation.x = Math.PI / 2.2;
          ringMesh.rotation.y = Math.PI / 8;
        } else {
          // Saturn ring tilt: elegant slightly tilted flat disk
          ringMesh.rotation.x = Math.PI / 2.3;
          ringMesh.rotation.y = Math.PI / 15;
        }

        planetGroup.add(ringMesh);
      }
    });

    // GHOST LIGHT — rare, unnamed, unexplained. Roughly 1 in 15 loads, a small
    // glowing point appears among the real planets. It has no label, no entry,
    // no orbit line. If you click it, it fades away. If you don't, it's simply
    // gone next time you load the page — never guaranteed to return, never
    // explained. Not a bug, not a feature anyone announces.
    let ghostMesh: THREE.Mesh | null = null;
    let ghostMat: THREE.MeshStandardMaterial | null = null;
    let ghostBaseAngle = 0;
    let ghostRadius = 0;
    let ghostDismissed = false;
    if (Math.random() < 1 / 15 && PLANETARY_DIMENSIONS.length > 0) {
      const outerDist = Math.max(...PLANETARY_DIMENSIONS.map((p) => p.orbitDistance));
      ghostRadius = outerDist * (0.55 + Math.random() * 0.5);
      ghostBaseAngle = Math.random() * Math.PI * 2;
      const ghostGeom = new THREE.SphereGeometry(0.55, 12, 12);
      ghostMat = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 1.1,
        transparent: true,
        opacity: 0.75,
      });
      ghostMesh = new THREE.Mesh(ghostGeom, ghostMat);
      ghostMesh.name = "ghost-light";
      ghostMesh.position.set(
        Math.cos(ghostBaseAngle) * ghostRadius,
        (Math.random() - 0.5) * 8,
        Math.sin(ghostBaseAngle) * ghostRadius
      );
      scene.add(ghostMesh);
    }

    // SATELLITE STRUCTURES / MOONS (ENCYCLOPEDIA ENTRIES)
    // We instantiate moons dynamically around each planet, and control their visibility/scale based on selected status
    interface SatelliteNode {
      mesh: THREE.Mesh;
      slug: string;
      baseAngle: number;
      orbitRad: number;
      orbitSpeed: number;
      planetId: string;
    }
    const satellitesList: SatelliteNode[] = [];

    PLANETARY_DIMENSIONS.forEach((p) => {
      p.entries.forEach((entry, idx) => {
        // Different shapes for high-tech satellite nodes: Octahedron, Tetrahedron, Icosahedron, Torus
        let satGeom: THREE.BufferGeometry;
        const size = p.radius * 0.16;
        switch (idx % 4) {
          case 0:
            satGeom = new THREE.OctahedronGeometry(size);
            break;
          case 1:
            satGeom = new THREE.TetrahedronGeometry(size);
            break;
          case 2:
            satGeom = new THREE.IcosahedronGeometry(size);
            break;
          default:
            satGeom = new THREE.TorusGeometry(size * 0.8, size * 0.25, 6, 12);
        }

        const satMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.color),
          emissive: new THREE.Color(p.color),
          emissiveIntensity: 0.8,
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0, // start invisible
        });

        const satMesh = new THREE.Mesh(satGeom, satMat);
        satMesh.name = `entry-${entry.slug}`;
        satMesh.castShadow = true;
        scene.add(satMesh); // add directly to scene for easier positioning

        satellitesList.push({
          mesh: satMesh,
          slug: entry.slug,
          baseAngle: (idx / p.entries.length) * Math.PI * 2,
          orbitRad: p.radius * 2.1 + idx * (p.radius * 0.35),
          orbitSpeed: 0.4 + (3 - idx) * 0.1,
          planetId: p.id,
        });
      });
    });

    // RAYCASTING FOR HOVER & CLICKS
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // Orbital plane (y=0) used only for zoom-to-cursor's raycast -- finds
    // where the cursor is "pointing at" in world space so the wheel zoom
    // can converge toward it instead of always toward dead-center.
    const orbitalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const cursorWorldPoint = new THREE.Vector3();

    const getMouseIntersect = (e: MouseEvent | TouchEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Build target meshes list
      const targets: THREE.Object3D[] = [sunMesh];
      planetMeshMap.forEach((mesh) => targets.push(mesh));
      satellitesList.forEach((sat) => {
        if (sat.mesh.scale.x > 0.01) {
          targets.push(sat.mesh);
        }
      });
      if (ghostMesh && !ghostDismissed) {
        targets.push(ghostMesh);
      }

      return raycaster.intersectObjects(targets);
    };

    // Hover effect
    let currentHoveredMesh: THREE.Object3D | null = null;

    const applyHover = (e: MouseEvent | TouchEvent) => {
      const intersects = getMouseIntersect(e);
      if (intersects && intersects.length > 0) {
        const hit = intersects[0].object;
        if (currentHoveredMesh !== hit) {
          currentHoveredMesh = hit;
          document.body.style.cursor = "pointer";

          // Parse hovered target
          if (hit.name.startsWith("planet-")) {
            const pid = hit.name.replace("planet-", "");
            propsRef.current.onPlanetHover(pid);
            hoveredPlanetId = pid; // desktop preview -- touch has no hover, relies on the first tap instead
            hoveredSatelliteSlug = null;
          } else if (hit.name.startsWith("entry-")) {
            hoveredSatelliteSlug = hit.name.replace("entry-", "");
            hoveredPlanetId = null;
          }
          // sun hover just gets the pointer cursor, set above — no hover state to track
        }
      } else {
        if (currentHoveredMesh) {
          currentHoveredMesh = null;
          document.body.style.cursor = "default";
          propsRef.current.onPlanetHover(null);
          hoveredPlanetId = null;
          hoveredSatelliteSlug = null;
        }
      }
    };

    // Click selection (only fires if the pointer didn't drag — see isDragging/dragMoved below)
    const handleSelect = (e: MouseEvent | TouchEvent) => {
      const intersects = getMouseIntersect(e);
      if (intersects && intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.name === "sun") {
          // Fork moved here from papadomo.html's post-orientation moment
          // (Session: onboarding advice pass) -- the doorway sequence now
          // continues automatically to Foundation/THE SYSTEM for every
          // first-time visitor, so nobody skips the thesis argument by
          // picking blind between two options they have no context for
          // yet. By the time someone reaches the sun here, they've seen
          // Foundation's argument and this solar map -- an actual basis
          // to choose "walk it with PapaDomo" vs "go home," rather than
          // a coin flip at the doorway.
          (window as any).PapaDomoChoice.open({
            onEnterTour: () => {
              window.location.href = "https://allianceftf.org/tours/";
            },
            onExitHome: () => {
              window.location.href = "https://allianceftf.org/landing.html";
            },
          });
        } else if (hit.name.startsWith("planet-")) {
          const pid = hit.name.replace("planet-", "");
          if (tappedPlanetId !== pid) {
            // First tap: reveal the label only, don't transit yet. Replaces
            // whatever was previously tapped-but-not-confirmed, rather than
            // adding to a growing pile of revealed labels.
            tappedPlanetId = pid;
            tappedSatelliteSlug = null;
          } else {
            propsRef.current.onPlanetSelect(pid);
          }
        } else if (hit.name.startsWith("entry-")) {
          const slug = hit.name.replace("entry-", "");
          if (tappedSatelliteSlug !== slug) {
            // First tap: reveal the label only, don't navigate yet.
            tappedSatelliteSlug = slug;
            tappedPlanetId = null;
          } else {
            propsRef.current.onEntrySelect(slug);
          }
        } else if (hit.name === "ghost-light") {
          // Never explained, never announced — it's just gone.
          ghostDismissed = true;
        }
      }
    };

    // Planet/satellite labels are hidden until interacted with, then need a
    // second tap to actually commit to selecting/navigating -- per request,
    // rather than showing every label at once (previous default) or
    // navigating away on the very first tap with no preview.
    //
    // These track only the SINGLE currently-relevant id for each kind, not
    // a history of everything ever touched -- an earlier version used
    // Sets that only ever grew (.add(), never .delete() or .clear()), so
    // every satellite the cursor happened to cross while panning around a
    // crowded planet (Jupiter/Saturn/Uranus all have 15-20) stayed
    // permanently revealed with no collision avoidance between them,
    // which is exactly what piled up into unreadable overlapping text
    // the longer someone explored. A hovered id here always replaces
    // whatever was previously hovered, and clears on hover-out; a tapped
    // id (the no-hover mobile equivalent) replaces the previous tapped id
    // the moment a different target is tapped. At most one extra label
    // beyond the actively selected planet's own is ever showing.
    let hoveredPlanetId: string | null = null;
    let hoveredSatelliteSlug: string | null = null;
    let tappedPlanetId: string | null = null;
    let tappedSatelliteSlug: string | null = null;

    // DRAG-TO-ORBIT + WHEEL-TO-ZOOM
    // The UI copy has always claimed "Drag background to orbit" — this wires that
    // up for real, and distinguishes a drag from a click so dragging never
    // accidentally selects whatever planet happens to be under the cursor.
    let isDragging = false;
    let dragMoved = false;
    let dragLastX = 0;
    let dragLastY = 0;
    let userAzimuth = Math.PI * 0.7; // matches the old idle start angle below
    let userPolar = 0; // vertical tilt, clamped
    let zoomFactor = 1; // 1 = default distance; wheel/pinch adjusts this
    const MIN_ZOOM = 0.4;
    const MAX_ZOOM = 4.2; // was 2.4 — gave more room to pull back per direction
    // Overview-mode-only: where the orbit center has drifted to via
    // zoom-to-cursor (see handleWheel). Origin (0,0,0) is "centered on the
    // sun," same as before this existed. Deliberately NOT used when a
    // planet is selected -- diving into a specific planet should always
    // stay precisely centered on that planet, not drift with wherever the
    // cursor last was.
    const panOffset = new THREE.Vector3(0, 0, 0);
    let pinchLastDist: number | null = null;

    const getTouchDist = (e: TouchEvent) => {
      if (e.touches.length < 2) return null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    const getPointer = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        const t = e.touches[0] || e.changedTouches?.[0];
        return t ? { x: t.clientX, y: t.clientY } : null;
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length === 2) {
        pinchLastDist = getTouchDist(e);
        isDragging = false; // two fingers = pinch, not orbit-drag
        return;
      }
      const p = getPointer(e);
      if (!p) return;
      isDragging = true;
      dragMoved = false;
      dragLastX = p.x;
      dragLastY = p.y;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length === 2) {
        // Pinch-to-zoom — was never actually implemented before; only the mouse
        // wheel touched zoomFactor, so touch users had no way to zoom at all.
        const dist = getTouchDist(e);
        if (dist && pinchLastDist) {
          const scaleDelta = pinchLastDist / dist; // fingers spreading = zoom in = smaller factor
          zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomFactor * scaleDelta));
        }
        pinchLastDist = dist;
        return;
      }
      if (isDragging) {
        const p = getPointer(e);
        if (!p) return;
        const dx = p.x - dragLastX;
        const dy = p.y - dragLastY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
        userAzimuth -= dx * 0.005;
        userPolar = Math.max(-0.55, Math.min(0.55, userPolar + dy * 0.003));
        dragLastX = p.x;
        dragLastY = p.y;
      } else if (!("touches" in e)) {
        // Hover highlighting only makes sense for mouse, not while touch-dragging
        applyHover(e);
      }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length < 2) {
        pinchLastDist = null;
      }
      if (isDragging && !dragMoved) {
        handleSelect(e);
      }
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const oldZoom = zoomFactor;
      zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomFactor + e.deltaY * 0.0012));

      // Zoom-to-cursor: only in overview mode (no planet selected -- see
      // panOffset's own comment for why selected-planet mode stays fixed).
      // WheelEvent inherits clientX/clientY from MouseEvent, so no separate
      // mouse-position tracking is needed here.
      const zoomingIn = zoomFactor < oldZoom;
      if (!propsRef.current.selectedPlanetId) {
        if (zoomingIn) {
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          if (raycaster.ray.intersectPlane(orbitalPlane, cursorWorldPoint)) {
            // Nudge the orbit center toward the cursor's world point,
            // proportional to how much this tick actually zoomed in. A
            // fixed lerp factor (rather than distance-based) keeps the feel
            // consistent across the whole zoom range: each tick converges
            // a bit further toward wherever the cursor is pointing, so
            // scrolling in on a planet near the edge of the screen walks
            // the view toward it instead of always zooming dead-center.
            const converge = Math.min(1, ((oldZoom - zoomFactor) / oldZoom) * 4);
            panOffset.lerp(
              new THREE.Vector3(cursorWorldPoint.x, 0, cursorWorldPoint.z),
              converge,
            );
          }
        } else {
          // Zooming back out gently re-centers on the sun, matching the
          // familiar "zoom out to see everything again" expectation
          // instead of leaving the view permanently off-center after a
          // single zoom-in gesture.
          const converge = Math.min(1, ((zoomFactor - oldZoom) / oldZoom) * 2);
          panOffset.lerp(new THREE.Vector3(0, 0, 0), converge);
        }
      }
    };

    // Attach listeners
    renderer.domElement.addEventListener("mousedown", handlePointerDown);
    renderer.domElement.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    renderer.domElement.addEventListener("touchstart", handlePointerDown, { passive: true });
    renderer.domElement.addEventListener("touchmove", handlePointerMove, { passive: true });
    renderer.domElement.addEventListener("touchend", handlePointerUp);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    // DYNAMIC ANIMATION LOOP
    const clock = new THREE.Clock();
    let satTime = 0; // pause-aware accumulator for satellite orbit motion, see animate()
    const cameraTargetLook = new THREE.Vector3(0, 0, 0);
    const cameraCurrentLook = new THREE.Vector3(0, 0, 0);

    const vecProj = new THREE.Vector3();

    const animate = () => {
      const requestID = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Read state safely from refs to bypass React closures
      const state = propsRef.current;
      const speed = state.simulationConfig.isPaused ? 0 : state.simulationConfig.speedFactor;

      // Satellite (entry node) orbit motion previously used the raw wall-clock
      // `elapsed` value, which never stops — so PAUSE stopped the planets but
      // the little entry moons kept spinning regardless. satTime instead only
      // advances when not paused, and scales with warp speed like everything else.
      satTime += delta * speed;

      // 1. UPDATE PLANET POSITIONS (KEPLERIAN ORBITS)
      PLANETARY_DIMENSIONS.forEach((p) => {
        const group = planetGroupMap.get(p.id)!;
        const mesh = planetMeshMap.get(p.id)!;
        const orbitLine = orbitLineMap.get(p.id)!;

        // Base angle increments inversely to Keplerian period
        let angle = planetAngles.get(p.id)!;
        if (!state.selectedPlanetId || state.selectedPlanetId !== p.id) {
          // Orbit slow calculation
          angle += (delta * 0.08 * speed) / p.orbitPeriod;
          planetAngles.set(p.id, angle);
        }

        const x = Math.cos(angle) * p.orbitDistance;
        const z = Math.sin(angle) * p.orbitDistance;

        group.position.set(x, 0, z);

        // Self rotation of planet mesh
        mesh.rotation.y += delta * 0.25;

        // Fading behavior of orbits if a specific planet is selected
        // (ORBIT GRIDS toggle short-circuits everything to 0 when off — this
        // was previously never read anywhere, so the button did nothing)
        let targetOpacity = state.simulationConfig.showOrbits
          ? (state.selectedPlanetId ? 0.03 : 0.25)
          : 0;
        if (state.simulationConfig.showOrbits && state.selectedPlanetId === p.id) {
          targetOpacity = 0.5; // highlight selected orbit path
        }
        (orbitLine.material as THREE.LineBasicMaterial).opacity +=
          (targetOpacity - (orbitLine.material as THREE.LineBasicMaterial).opacity) * 0.1;

        // Scale down unselected planets when a zoom is active to clear clutter
        let targetScale = 1;
        if (state.selectedPlanetId) {
          if (state.selectedPlanetId !== p.id) {
            targetScale = 0.15; // minimize others
          }
        }
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      });

      // 2. UPDATE SATELLITE (ENTRY) MOONS
      satellitesList.forEach((sat) => {
        const parentGroup = planetGroupMap.get(sat.planetId)!;
        const isParentSelected = state.selectedPlanetId === sat.planetId;

        const mat = sat.mesh.material as THREE.MeshStandardMaterial;

        if (isParentSelected) {
          // Rotate around parent planet
          const orbitAngle = sat.baseAngle + satTime * sat.orbitSpeed;
          const sx = parentGroup.position.x + Math.cos(orbitAngle) * sat.orbitRad;
          const sz = parentGroup.position.z + Math.sin(orbitAngle) * sat.orbitRad;
          
          sat.mesh.position.set(sx, parentGroup.position.y, sz);

          // Rotate the crystal mesh itself beautifully
          sat.mesh.rotation.x += delta * 0.8;
          sat.mesh.rotation.y += delta * 1.1;

          // Transition to visible & normal scale
          mat.opacity += (0.95 - mat.opacity) * 0.1;
          
          let targetScale = 1.0;
          if (state.activeEntrySlug === sat.slug) {
            // highlight active reading entry by pulsing it
            targetScale = 1.4 + Math.sin(satTime * 5) * 0.15;
            mat.emissiveIntensity = 1.5;
          } else {
            mat.emissiveIntensity = 0.8;
          }
          sat.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        } else {
          // Parent not selected: fade out & shrink
          mat.opacity += (0 - mat.opacity) * 0.15;
          sat.mesh.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.15);
        }
      });

      // 3. SOLAR ACTIVITY GLOW
      sunMesh.rotation.y += delta * speed * 0.05;
      medallionGroup.rotation.y -= delta * speed * 0.05; // counter-rotation, same rate as the sun
      sunGlowMesh.scale.setScalar(1 + Math.sin(satTime * 1.5) * 0.03);

      // GHOST LIGHT — quiet drift and slow pulse while present; fades out
      // and detaches from the scene once dismissed (clicked).
      if (ghostMesh && ghostMat) {
        if (ghostDismissed) {
          ghostMat.opacity += (0 - ghostMat.opacity) * 0.08;
          if (ghostMat.opacity < 0.01 && ghostMesh.parent) {
            scene.remove(ghostMesh);
          }
        } else {
          const driftAngle = ghostBaseAngle + satTime * 0.03;
          ghostMesh.position.x = Math.cos(driftAngle) * ghostRadius;
          ghostMesh.position.z = Math.sin(driftAngle) * ghostRadius;
          ghostMat.opacity = 0.55 + Math.sin(satTime * 0.8) * 0.2;
        }
      }

      // 4. CAMERA INTERPOLATION (THE ZOOM MAGIC!)
      if (state.selectedPlanetId) {
        // Camera zooms in close and orbits the selected planet in its moving frame!
        const targetPlanet = PLANETARY_DIMENSIONS.find((p) => p.id === state.selectedPlanetId)!;
        const pGroup = planetGroupMap.get(targetPlanet.id)!;

        // Position camera in orbit around the moving planet — user drag steers
        // azimuth/tilt, wheel steers distance, auto-drift still runs underneath
        const zoomDist = targetPlanet.radius * 3.8 * zoomFactor;
        const slowOrbitAngle = satTime * 0.15 + userAzimuth; // slow dramatic drift + user steer
        const tilt = targetPlanet.radius * 0.6 + userPolar * zoomDist;
        const targetCamX = pGroup.position.x + Math.cos(slowOrbitAngle) * zoomDist;
        const targetCamY = pGroup.position.y + tilt;
        const targetCamZ = pGroup.position.z + Math.sin(slowOrbitAngle) * zoomDist;

        camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.08);
        cameraTargetLook.copy(pGroup.position);
      } else {
        // MAIN VIEW: camera orbits around the central Sun (AVPI) by default,
        // or around panOffset once zoom-to-cursor has shifted it (see
        // handleWheel) — auto-drift continues at all times, drag adds/
        // subtracts from it, wheel zooms and (when zooming in) walks
        // panOffset toward wherever the cursor is pointing.
        userAzimuth += delta * 0.02 * (speed + (state.simulationConfig.isPaused ? 0 : 0.5)); // constant cinematic float, stops on pause

        const r = 75 * zoomFactor; // float distance, now user-adjustable
        const y = (30 + Math.sin(satTime * 0.05) * 8) * zoomFactor + userPolar * r; // subtle wave tilt + user steer
        const targetCamX = panOffset.x + Math.cos(userAzimuth) * r;
        const targetCamZ = panOffset.z + Math.sin(userAzimuth) * r;

        camera.position.lerp(new THREE.Vector3(targetCamX, y, targetCamZ), 0.05);
        cameraTargetLook.copy(panOffset);
      }

      cameraCurrentLook.lerp(cameraTargetLook, 0.08);
      camera.lookAt(cameraCurrentLook);

      // 5. PROJECT 3D COORDINATES TO 2D SCREEN LABELS
      // Written directly to DOM refs (see planetLabelRefs/satLabelRefs above) —
      // no React state involved, so there's no render-commit lag between this
      // and the renderer.render() call a few lines down.
      PLANETARY_DIMENSIONS.forEach((p) => {
        const group = planetGroupMap.get(p.id)!;
        const el = planetLabelRefs.current.get(p.id);
        if (!el) return;

        vecProj.copy(group.position);
        vecProj.project(camera);

        const isVisible =
          vecProj.z <= 1 &&
          Math.abs(vecProj.x) < 0.95 &&
          Math.abs(vecProj.y) < 0.95;

        const sx = (vecProj.x * .5 + .5) * size.width;
        const sy = (-(vecProj.y * .5) + .5) * size.height;

        // Labels are hidden until the visitor has actually interacted with
        // that specific planet (hover preview on desktop, first tap on
        // touch) -- previously every planet's label showed at once by
        // default, which is what this replaces. Still shown while that
        // planet is the actively selected/zoomed one even if hover/tap
        // state has since moved elsewhere, so a selected planet never
        // loses its own label out from under the visitor. hoveredPlanetId
        // and tappedPlanetId each track only the single most-recent id
        // (see their declaration above), so at most one extra label is
        // ever showing beyond the selected planet's own.
        const showLabel =
          state.selectedPlanetId === p.id ||
          hoveredPlanetId === p.id ||
          tappedPlanetId === p.id;
        const visible = isVisible && showLabel && state.simulationConfig.showLabels;

        el.style.display = visible ? "" : "none";
        if (visible) {
          el.style.transform = `translate3d(${sx}px, ${sy - p.radius * 6 - 20}px, 0) translate(-50%, -100%)`;
        }
      });

      // Project moons
      satellitesList.forEach((sat) => {
        const el = satLabelRefs.current.get(sat.slug);
        if (!el) return;

        if (state.selectedPlanetId === sat.planetId) {
          vecProj.copy(sat.mesh.position);
          vecProj.project(camera);

          const isVisible =
            vecProj.z <= 1 &&
            Math.abs(vecProj.x) < 0.95 &&
            Math.abs(vecProj.y) < 0.95;

          const sx = (vecProj.x * .5 + .5) * size.width;
          const sy = (-(vecProj.y * .5) + .5) * size.height;
          const visible =
            isVisible &&
            (hoveredSatelliteSlug === sat.slug || tappedSatelliteSlug === sat.slug) &&
            state.simulationConfig.showLabels;

          el.style.display = visible ? "" : "none";
          if (visible) {
            el.style.transform = `translate3d(${sx}px, ${sy - 18}px, 0) translate(-50%, -100%)`;
          }
        } else {
          el.style.display = "none";
        }
      });

      renderer.render(scene, camera);
    };

    // Kickstart rendering loop
    const animationRequestID = requestAnimationFrame(animate);

    // RESIZE OBSERVER (Adheres perfectly to sizing rules)
    // Also keeps `size` current — this fires once immediately on observe() with
    // whatever the container's real size actually is, which corrects for the
    // case where the initial synchronous capture above ran before layout settled.
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        const w = rect.width;
        const h = rect.height;
        if (w <= 0 || h <= 0) continue; // ignore transient zero-size layout passes

        size.width = w;
        size.height = h;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationRequestID);
      resizeObserver.disconnect();
      canvasRef.current?.removeEventListener("webglcontextlost", handleContextLost);
      canvasRef.current?.removeEventListener("webglcontextrestored", handleContextRestored);
      renderer.domElement.removeEventListener("mousedown", handlePointerDown);
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      renderer.domElement.removeEventListener("touchstart", handlePointerDown);
      renderer.domElement.removeEventListener("touchmove", handlePointerMove);
      renderer.domElement.removeEventListener("touchend", handlePointerUp);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      sunGeom.dispose();
      sunMat.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      sunTexture.dispose();
      frontGeom.dispose();
      frontMat.dispose();
      frontMat.map?.dispose();
      backGeom.dispose();
      backMat.dispose();
      rimGeom.dispose();
      rimMat.dispose();
      if (ghostMesh) {
        ghostMesh.geometry.dispose();
        (ghostMesh.material as THREE.Material).dispose();
      }
    };
    // Intentionally empty — the whole point of propsRef above is that this scene
    // gets built exactly ONCE. selectedPlanetId, onPlanetSelect, onEntrySelect, and
    // onPlanetHover used to live here, which meant a hover firing setHoveredPlanetId
    // in the parent produced new inline-function identities every render, which blew
    // away and rebuilt the entire THREE scene — re-rolling every planet's starting
    // orbital angle and resetting the camera — mid-interaction. That was the jitter.
  }, []);

  // Satellite labels are only rendered for the currently-selected planet's
  // entries. This is a normal React-driven list (recomputed when selectedPlanetId
  // changes, which is infrequent) — only the per-frame x/y/visibility is handled
  // imperatively via refs in the animate loop above.
  const currentEntries = selectedPlanetId
    ? PLANETARY_DIMENSIONS.find((pd) => pd.id === selectedPlanetId)?.entries ?? []
    : [];
  // Tint satellite labels/connectors with their planet's own category color so
  // it's visually unambiguous which shape a given label belongs to, even when
  // several satellites cluster together on screen.
  const planetColorForLabels = selectedPlanetId
    ? PLANETARY_DIMENSIONS.find((pd) => pd.id === selectedPlanetId)?.color ?? "#ffffff"
    : "#ffffff";

  return (
    <div id="inna-3d-stage" ref={containerRef} className="relative w-full h-full select-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full bg-gradient-to-b from-[#030308] to-[#0a0a14]" />

      {contextLost && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#030308]/95 text-center px-6">
          <p className="text-stone-300 text-sm md:text-base max-w-sm">
            The connection to this view was lost — this happens sometimes on
            mobile under memory pressure. Nothing was lost on your end.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold tracking-tight hover:brightness-110 transition-all"
            >
              Reconnect
            </button>
            <button
              onClick={() => (window.location.href = "/tours/")}
              className="px-6 py-3 rounded-xl bg-transparent border border-stone-500 text-stone-300 font-bold tracking-tight hover:bg-stone-800 transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* HTML SCREEN LABELS (PROJECTED OVER 3D CANVAS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden font-sans">
        {/* Planet Labels — always rendered, position/visibility set imperatively
            each frame via planetLabelRefs (see animate loop above) */}
        {PLANETARY_DIMENSIONS.map((p) => (
          <div
            key={p.id}
            id={`label-${p.id}`}
            ref={(el) => {
              if (el) planetLabelRefs.current.set(p.id, el);
              else planetLabelRefs.current.delete(p.id);
            }}
            style={{ display: "none" }}
            className={`absolute pointer-events-auto cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
              hoveredPlanetId === p.id || selectedPlanetId === p.id
                ? "scale-105"
                : "opacity-85 hover:opacity-100 scale-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onPlanetSelect(p.id);
            }}
            onMouseEnter={() => onPlanetHover(p.id)}
            onMouseLeave={() => onPlanetHover(null)}
          >
            {/* Visual anchor line */}
            <div className={`w-[1px] h-8 bg-gradient-to-t from-white/30 to-transparent mb-1 transition-all ${
              hoveredPlanetId === p.id || selectedPlanetId === p.id ? "from-white/60" : ""
            }`} />

            {/* Glassmorphic Indicator — category/dimension only, no planet name */}
            <div className={`flex flex-col items-center px-2.5 py-1 rounded border shadow-lg backdrop-blur-md transition-all duration-300 ${
              selectedPlanetId === p.id
                ? "bg-amber-500/10 border-amber-400 text-amber-300"
                : hoveredPlanetId === p.id
                ? "bg-white/10 border-white/35 text-white"
                : "bg-black/40 border-white/15 text-white/90"
            }`}>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase font-sans">
                {p.dimension}
              </span>
            </div>
          </div>
        ))}

        {/* Entry Satellite Moons Labels — rendered for the selected planet's
            entries, position/visibility set imperatively via satLabelRefs */}
        {currentEntries.map((entry) => (
          <div
            key={entry.slug}
            id={`label-sat-${entry.slug}`}
            ref={(el) => {
              if (el) satLabelRefs.current.set(entry.slug, el);
              else satLabelRefs.current.delete(entry.slug);
            }}
            style={{ display: "none" }}
            className={`absolute pointer-events-auto cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
              activeEntrySlug === entry.slug ? "scale-110" : "opacity-80 hover:opacity-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onEntrySelect(entry.slug);
            }}
          >
            <div
              style={{ borderColor: planetColorForLabels }}
              className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded border-2 tracking-wider backdrop-blur-sm transition-all duration-300 ${
                activeEntrySlug === entry.slug
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-black/70 text-white/90"
              }`}>
              {entry.title}
            </div>
            <div
              style={{ backgroundColor: planetColorForLabels }}
              className={`w-[2px] h-5 mt-1 transition-all opacity-80 ${activeEntrySlug === entry.slug ? "h-6 opacity-100" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
