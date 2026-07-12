import { useState, useEffect } from "react";
import { PLANETARY_DIMENSIONS } from "./data/encyclopedia";
import { SimulationConfig } from "./types";
import SolarSystemCanvas from "./components/SolarSystemCanvas";
import DimensionSidebar from "./components/DimensionSidebar";
import EntryViewer from "./components/EntryViewer";
import SystemControls from "./components/SystemControls";

export default function App() {
  // Navigation & focus state
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const [activeEntrySlug, setActiveEntrySlug] = useState<string | null>(null);

  // Simulation parameters
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    speedFactor: 1,
    showOrbits: true,
    showLabels: true,
    isPaused: false,
    camLock: false,
  });

  // Handle Initial Deep-linking on mount & history popstate
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const match = path.match(/\/entries\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const slug = match[1];
        // Find which planet owns this entry
        const planet = PLANETARY_DIMENSIONS.find((p) =>
          p.entries.some((e) => e.slug === slug)
        );
        if (planet) {
          setSelectedPlanetId(planet.id);
          setActiveEntrySlug(slug);
          return;
        }
      }
      
      // Fallback: reset if main route
      if (path === "/" || path === "") {
        setSelectedPlanetId(null);
        setActiveEntrySlug(null);
      }
    };

    // Run once on load
    handleUrlRoute();

    // Listen to back/forward button clicks
    window.addEventListener("popstate", handleUrlRoute);
    return () => window.removeEventListener("popstate", handleUrlRoute);
  }, []);

  // Set selected planet & update URL
  const handlePlanetSelect = (planetId: string | null) => {
    setSelectedPlanetId(planetId);
    
    if (planetId === null) {
      setActiveEntrySlug(null);
      window.history.pushState(null, "", "/");
    } else {
      // If a planet is clicked, check if there is an active entry. If so, clear it since we are zooming back to the planet orbit level
      setActiveEntrySlug(null);
      // We can push standard route or simple state
      window.history.pushState(null, "", "/");
    }
  };

  // Set selected entry & update URL
  const handleEntrySelect = (entrySlug: string) => {
    setActiveEntrySlug(entrySlug);
    window.history.pushState(null, "", `/entries/${entrySlug}`);
  };

  // Close entry dossier, reset URL to orbit level
  const handleCloseEntry = () => {
    setActiveEntrySlug(null);
    window.history.pushState(null, "", "/");
  };

  // Find active entry details
  const activeEntry = PLANETARY_DIMENSIONS.flatMap((p) => p.entries).find(
    (e) => e.slug === activeEntrySlug
  ) || null;

  const activePlanet = PLANETARY_DIMENSIONS.find((p) =>
    p.entries.some((e) => e.slug === activeEntrySlug)
  ) || PLANETARY_DIMENSIONS.find((p) => p.id === selectedPlanetId) || null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#020308] text-white flex flex-col md:flex-row relative selection:bg-amber-500 selection:text-black">
      {/* LEFT SIDEBAR HUD PANEL */}
      <DimensionSidebar
        selectedPlanetId={selectedPlanetId}
        onPlanetSelect={handlePlanetSelect}
        onEntrySelect={handleEntrySelect}
        hoveredPlanetId={hoveredPlanetId}
      />

      {/* MAIN 3D SIMULATION CONTAINER */}
      <div className="flex-1 h-full relative" id="threejs-container">
        <SolarSystemCanvas
          selectedPlanetId={selectedPlanetId}
          onPlanetSelect={handlePlanetSelect}
          onEntrySelect={handleEntrySelect}
          simulationConfig={simulationConfig}
          hoveredPlanetId={hoveredPlanetId}
          onPlanetHover={setHoveredPlanetId}
          activeEntrySlug={activeEntrySlug}
        />

        {/* FLOATING SIMULATION CONTROL PANEL */}
        <SystemControls
          config={simulationConfig}
          onChange={setSimulationConfig}
          selectedPlanetId={selectedPlanetId}
          onResetCamera={() => handlePlanetSelect(null)}
        />
      </div>

      {/* FULL SCREEN READING DOSSIER FOR ENTRIES */}
      {activeEntrySlug && activeEntry && (
        <EntryViewer
          entry={activeEntry}
          planet={activePlanet}
          onClose={handleCloseEntry}
        />
      )}
    </div>
  );
}
