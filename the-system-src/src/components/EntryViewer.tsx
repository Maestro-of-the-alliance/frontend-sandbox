import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import { EncyclopediaEntry, PlanetaryDimension } from "../types";

interface EntryViewerProps {
  entry: EncyclopediaEntry | null;
  planet: PlanetaryDimension | null;
  onClose: () => void;
}

export default function EntryViewer({ entry, planet, onClose }: EntryViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!entry || !planet) return null;

  // The witness gets the author's own short summary here and a real link to
  // go deeper, instead of the full transcript dumped into this popup —
  // depth becomes a choice, not something forced on everyone regardless of
  // how far they want to engage.
  const teaser = entry.summary;

  const entryUrl = `https://allianceftf.org/entries/${entry.slug}.html`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(entryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#020308]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          id={`entry-card-${entry.slug}`}
          className="relative w-full max-w-2xl max-h-[88vh] bg-[#0d0e15]/95 border border-[#1a1c25]/85 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 md:p-8 overflow-y-auto"
        >
          {/* Subtle glowing ambient background based on planet color */}
          <div
            style={{ backgroundColor: planet.color }}
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full filter blur-[120px] opacity-15 pointer-events-none"
          />

          {/* Close Button — fixed to the viewport, not the scrollable card, so it's
              always reachable no matter how far down a long entry you've scrolled */}
          <button
            id="btn-close-entry"
            onClick={onClose}
            className="fixed top-8 right-8 md:top-10 md:right-10 z-[60] p-2 rounded-full border border-white/10 bg-[#0d0e15]/90 hover:bg-amber-500/10 hover:border-amber-500/30 text-white/75 hover:text-amber-400 backdrop-blur-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Header / Origin information */}
            <div className="space-y-2 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  style={{ backgroundColor: planet.color, color: "#000" }}
                  className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase"
                >
                  {planet.dimension}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                {entry.title} <span className="text-amber-500 font-serif italic">Record</span>
              </h2>
            </div>

            {/* Intro banner: the author's own summary, not an auto-sliced guess */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-sm text-amber-200/90 leading-relaxed font-sans font-light">
              {teaser}
            </div>

            {/* Dive deeper — a real link to the full entry, not the whole
                transcript forced into this popup. Depth is the witness's choice. */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-[#1a1c25]/60 text-xs font-mono">
              <a
                id="btn-read-full-entry"
                href={entryUrl}
                title="Read the full entry"
                className="group flex items-center space-x-3 text-amber-300 hover:text-amber-200 transition-all"
              >
                <span
                  style={{ "--glow-color": planet.color } as Record<string, string>}
                  className="animate-pulse-glow shrink-0 w-11 h-11 rounded-full overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}symbols/${entry.slug}.png`}
                    alt={`${entry.title} symbol`}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      // Fall back to a plain external-link icon if a symbol is missing
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </span>
                <span className="flex items-center space-x-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>READ THE FULL ENTRY →</span>
                </span>
              </a>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  id="btn-copy-link"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500/45 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">COPIED INTEL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY ROUTE URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
