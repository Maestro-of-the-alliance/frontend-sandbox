import { useState, useRef, useEffect, type PointerEvent as ReactPointerEvent } from "react";
import { Play, Pause, Compass, Eye, EyeOff, Minimize2, Sliders, GripHorizontal } from "lucide-react";
import { SimulationConfig } from "../types";

interface SystemControlsProps {
  config: SimulationConfig;
  onChange: (newConfig: SimulationConfig) => void;
  selectedPlanetId: string | null;
  onResetCamera: () => void;
}

const PANEL_WIDTH = 320; // matches md:w-80
const MARGIN = 24; // matches the *-6 tailwind spacing used elsewhere here

function defaultPosition() {
  if (typeof window === "undefined") return { x: MARGIN, y: 120 };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Anchor near the top-right (below the CORE.STABLE pill), where the solar
  // scene tends to be emptiest — bottom placement collided with planet/orbit
  // labels on mobile, especially in portrait.
  const x = vw < 768 ? MARGIN : Math.max(MARGIN, vw - PANEL_WIDTH - MARGIN);
  const y = 120;
  return { x, y: Math.min(y, Math.max(MARGIN, vh - 200)) };
}

export default function SystemControls({
  config,
  onChange,
  selectedPlanetId,
}: SystemControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [pos, setPos] = useState(defaultPosition);
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const clamp = (x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = vw < 768 ? vw - MARGIN * 2 : PANEL_WIDTH;
    const maxX = Math.max(MARGIN, vw - w - MARGIN);
    const maxY = Math.max(MARGIN, vh - 100);
    return { x: Math.min(Math.max(MARGIN, x), maxX), y: Math.min(Math.max(MARGIN, y), maxY) };
  };

  const onDragStart = (e: ReactPointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos(clamp(dragRef.current.origX + dx, dragRef.current.origY + dy));
    };
    const onUp = () => {
      dragRef.current.dragging = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useEffect(() => {
    const onResize = () => setPos((p) => clamp(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const togglePlay = () => {
    onChange({ ...config, isPaused: !config.isPaused });
  };

  const toggleOrbits = () => {
    onChange({ ...config, showOrbits: !config.showOrbits });
  };

  const toggleLabels = () => {
    onChange({ ...config, showLabels: !config.showLabels });
  };

  const setSpeed = (speed: number) => {
    onChange({ ...config, speedFactor: speed });
  };

  if (isCollapsed) {
    return (
      <button
        id="btn-expand-controls"
        onClick={() => setIsCollapsed(false)}
        style={{ position: "fixed", left: pos.x, top: pos.y }}
        className="p-4 rounded-full border border-[#1a1c25]/80 bg-[#0d0e15]/95 hover:bg-[#151824]/95 text-amber-500 hover:text-amber-400 backdrop-blur-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center group"
        title="Expand Simulation Controls"
      >
        <Sliders className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div
      id="system-controls-hud"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: typeof window !== "undefined" && window.innerWidth < 768
          ? `calc(100vw - ${MARGIN * 2}px)`
          : PANEL_WIDTH,
      }}
      className="p-5 rounded-2xl border border-[#1a1c25]/80 bg-[#0d0e15]/90 backdrop-blur-2xl text-[#e5e5e5] font-mono flex flex-col space-y-3.5 z-30 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
    >
      {/* Simulation Info — also doubles as the drag handle */}
      <div
        onPointerDown={onDragStart}
        className="flex items-center justify-between text-[10px] text-white/50 border-b border-[#1a1c25]/60 pb-2.5 cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <span className="flex items-center space-x-1.5 font-bold">
          <GripHorizontal className="w-3.5 h-3.5 text-white/30" />
          <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span>SIMULATION CONTROLLER</span>
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-amber-500 font-bold">
            {config.isPaused ? "PAUSED" : `${config.speedFactor}x WARP`}
          </span>
          <button
            id="btn-collapse-controls"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer"
            title="Collapse Controls"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Buttons toolbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Play/Pause Button */}
        <button
          id="btn-play-pause"
          onClick={togglePlay}
          className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs transition-all cursor-pointer ${
            config.isPaused
              ? "bg-amber-500 border-amber-400 text-black font-semibold hover:bg-amber-400"
              : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-300"
          }`}
        >
          {config.isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>ENGAGE</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSE</span>
            </>
          )}
        </button>

        {/* Speed presets */}
        {!config.isPaused && (
          <div className="flex items-center rounded-xl border border-[#1a1c25]/80 bg-black/40 p-0.5">
            {[1, 2.5, 5].map((speed) => (
              <button
                key={speed}
                id={`btn-speed-${speed}`}
                onClick={() => setSpeed(speed)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] transition-all font-bold cursor-pointer ${
                  config.speedFactor === speed
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Checkboxes Toggle row */}
      <div className="flex items-center justify-between gap-4 pt-1 text-[10px] text-white/70">
        <button
          id="btn-toggle-orbits"
          onClick={toggleOrbits}
          className="flex items-center space-x-1.5 hover:text-amber-400 transition-all cursor-pointer"
        >
          {config.showOrbits ? (
            <Eye className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-white/35" />
          )}
          <span>ORBIT GRIDS</span>
        </button>

        <button
          id="btn-toggle-labels"
          onClick={toggleLabels}
          className="flex items-center space-x-1.5 hover:text-amber-400 transition-all cursor-pointer"
        >
          {config.showLabels ? (
            <Eye className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-white/35" />
          )}
          <span>HUD LABELS</span>
        </button>
      </div>

      {/* Guide Notice */}
      <div className="text-[10px] text-white/40 leading-relaxed pt-2.5 border-t border-[#1a1c25]/60 font-sans font-light">
        {selectedPlanetId ? (
          <p className="text-amber-300/80 font-serif italic">
            ★ Orbit focus active. Click rotating satellite nodes around the planet to view canon dossier logs.
          </p>
        ) : (
          <p>
            ★ Double-click or tap any planet to launch sub-orbital transit vector. Drag background to orbit.
          </p>
        )}
      </div>
    </div>
  );
}
