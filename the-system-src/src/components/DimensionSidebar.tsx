import { motion } from "motion/react";
import { Info, Landmark, Orbit, RotateCcw, ShieldCheck, Compass, Radio } from "lucide-react";
import { PLANETARY_DIMENSIONS, SUN_DATA } from "../data/encyclopedia";
import { PlanetaryDimension } from "../types";

interface DimensionSidebarProps {
  selectedPlanetId: string | null;
  onPlanetSelect: (planetId: string | null) => void;
  onEntrySelect: (entrySlug: string) => void;
  hoveredPlanetId: string | null;
}

export default function DimensionSidebar({
  selectedPlanetId,
  onPlanetSelect,
  onEntrySelect,
  hoveredPlanetId,
}: DimensionSidebarProps) {
  // Find current planet
  const activePlanetId = selectedPlanetId || hoveredPlanetId;
  const planet: PlanetaryDimension | undefined = PLANETARY_DIMENSIONS.find(
    (p) => p.id === activePlanetId
  );

  return (
    <div className="w-full md:w-[420px] h-full flex flex-col border-r border-[#1a1c25]/85 bg-[#020308]/90 backdrop-blur-2xl text-[#e5e5e5] overflow-y-auto">
      {/* Artistic Flair Header with subtle golden/amber accents */}
      <div className="p-8 border-b border-[#1a1c25]/60 flex flex-col justify-start items-start">
        <div className="text-[10px] tracking-[0.5em] uppercase text-amber-500/75 mb-2 font-black font-mono">
          Solar Navigation Interface
        </div>
        <div className="flex items-center justify-between w-full" id="inna-logo">
          <h1 className="text-4xl font-light tracking-[-0.05em] text-white">
            THE <span className="text-amber-500 font-serif italic">SYSTEM</span>
          </h1>
          <div className="flex items-center space-x-1.5 font-mono text-[9px] px-2.5 py-1 rounded bg-amber-500/5 border border-amber-500/15 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>CORE.STABLE</span>
          </div>
        </div>
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-amber-500/50 to-transparent"></div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-8">
        {planet ? (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col space-y-6"
          >
            {/* Dimension Banner */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  style={{ backgroundColor: planet.color }}
                  className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/50 uppercase">
                  {planet.dimension}
                </span>
              </div>
              <h2 className="text-4xl font-light tracking-tight text-white">
                {planet.name}
              </h2>
              <p className="text-xs font-serif italic text-amber-500/80">{planet.tagline}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl border border-white/5 bg-white/[0.02] font-mono text-xs">
              <div className="space-y-1">
                <div className="text-white/40 text-[9px] uppercase tracking-wider flex items-center space-x-1">
                  <Compass className="w-3 h-3 text-amber-500/70" />
                  <span>Real Orbit AU</span>
                </div>
                <div className="font-semibold text-white/90">
                  {planet.realOrbitDistance} AU
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-white/40 text-[9px] uppercase tracking-wider flex items-center space-x-1">
                  <Orbit className="w-3 h-3 text-amber-500/70" />
                  <span>Orbital Year</span>
                </div>
                <div className="font-semibold text-white/90">
                  {planet.orbitPeriod} Years
                </div>
              </div>
              <div className="space-y-1 border-t border-white/5 pt-2.5">
                <div className="text-white/40 text-[9px] uppercase tracking-wider flex items-center space-x-1">
                  <Landmark className="w-3 h-3 text-amber-500/70" />
                  <span>Earth Size Ratio</span>
                </div>
                <div className="font-semibold text-white/90">
                  {planet.realRadius}x Earth
                </div>
              </div>
              <div className="space-y-1 border-t border-white/5 pt-2.5">
                <div className="text-white/40 text-[9px] uppercase tracking-wider flex items-center space-x-1">
                  <Radio className="w-3 h-3 text-amber-500/70" />
                  <span>Telemetry Hex</span>
                </div>
                <div
                  style={{ color: planet.color }}
                  className="font-semibold"
                >
                  {planet.color.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Core Description */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-mono tracking-widest uppercase text-white/40 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500/80" />
                <span>Dimension Intel</span>
              </h3>
              <p className="text-sm text-white/70 leading-relaxed font-sans font-light">
                {planet.description}
              </p>
            </div>

            {/* Entries List */}
            <div className="space-y-3.5 pt-2">
              <h3 className="text-[10px] font-mono tracking-widest uppercase text-white/40 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
                <span>Canonical Entries</span>
              </h3>
              <div className="space-y-2.5">
                {planet.entries.map((entry) => (
                  <button
                    key={entry.slug}
                    id={`btn-entry-${entry.slug}`}
                    onClick={() => onEntrySelect(entry.slug)}
                    className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-amber-500/35 transition-all group flex flex-col space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide text-white group-hover:text-amber-400 transition-colors">
                        {entry.title}
                      </span>
                      <span className="text-[9px] font-mono text-amber-500/70 uppercase bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                        {entry.coordinates.split(".")[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/55 leading-normal font-sans font-light line-clamp-2">
                      {entry.summary}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Default Alliance Briefing Panel with Artistic flair */
          <div className="flex-1 flex flex-col justify-between" id="alliance-briefing">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-block text-[9px] font-mono font-semibold tracking-[0.25em] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded">
                  SYSTEM OVERVIEW
                </div>
                <h2 className="text-3xl font-light tracking-tight text-white">
                  {SUN_DATA.name}
                </h2>
                <p className="text-xs font-serif italic text-amber-500">{SUN_DATA.tagline}</p>
              </div>

              <p className="text-xs text-white/65 leading-relaxed font-light font-sans">
                {SUN_DATA.description}
              </p>

              {/* Grid of dimensions for fast exploration */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] font-mono tracking-widest uppercase text-amber-500/60 font-bold">
                  Select a Dimension Node
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {PLANETARY_DIMENSIONS.map((p) => (
                    <button
                      key={p.id}
                      id={`btn-dimension-${p.id}`}
                      onClick={() => onPlanetSelect(p.id)}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/10 hover:border-amber-500/20 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          style={{ backgroundColor: p.color }}
                          className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        />
                        <span className="text-[11px] font-mono text-white/90 group-hover:text-amber-400 transition-colors">
                          {p.name.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-white/45 uppercase tracking-wider group-hover:text-white/70 transition-colors">
                        {p.dimension}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Credit details */}
            <div className="border-t border-white/5 pt-4 mt-8 text-[9px] font-mono text-white/35 flex items-center justify-between">
              <span>AVPI NETWORK CORRELATOR</span>
              <span>v3.8.1-PROT</span>
            </div>
          </div>
        )}

        {/* Selected Close Action */}
        {selectedPlanetId && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              id="btn-back-system"
              onClick={() => onPlanetSelect(null)}
              className="w-full py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/35 text-xs font-mono font-semibold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer text-amber-300"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>RETURN TO SOLAR SYSTEM</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
