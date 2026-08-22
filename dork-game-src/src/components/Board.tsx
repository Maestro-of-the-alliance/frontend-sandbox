import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardSpace, Player } from '../types';
import { Pawn } from './Pawn';
import {
  Sparkles,
  Zap,
  Glasses,
  Flame,
  Award,
  HeartHandshake,
  Skull,
  Landmark,
  Eye,
  Anchor,
  X,
  Info,
} from 'lucide-react';

interface BoardProps {
  spaces: BoardSpace[];
  players: Player[];
  activePlayerId: number;
  centerContent: React.ReactNode;
}

// 11x11 Perimeter Coordinate Map for 40 spaces (0 to 39)
const SPACE_COORDINATES: { [id: number]: { col: number; row: number } } = {
  // Top Row: left to right (0 to 10)
  0: { col: 0, row: 0 },   // SEEING (Start)
  1: { col: 1, row: 0 },
  2: { col: 2, row: 0 },   // SHELTER BUILDS
  3: { col: 3, row: 0 },
  4: { col: 4, row: 0 },   // NUGGET
  5: { col: 5, row: 0 },   // THE WHY (#1)
  6: { col: 6, row: 0 },
  7: { col: 7, row: 0 },   // KERNEL
  8: { col: 8, row: 0 },   // ACADEMY
  9: { col: 9, row: 0 },
  10: { col: 10, row: 0 }, // PLEDGE (Corner 2)

  // Right Column: top to bottom (11 to 20)
  11: { col: 10, row: 1 },
  12: { col: 10, row: 2 }, // HELP EMANCIPATE A TENANT
  13: { col: 10, row: 3 },
  14: { col: 10, row: 4 },
  15: { col: 10, row: 5 }, // THE WHY (#2)
  16: { col: 10, row: 6 },
  17: { col: 10, row: 7 },
  18: { col: 10, row: 8 },
  19: { col: 10, row: 9 },
  20: { col: 10, row: 10 }, // THE AGORA (Corner 3)

  // Bottom Row: right to left (21 to 30)
  21: { col: 9, row: 10 },
  22: { col: 8, row: 10 },
  23: { col: 7, row: 10 }, // HELP EMANCIPATE A TENANT
  24: { col: 6, row: 10 },
  25: { col: 5, row: 10 }, // THE WHY (#3)
  26: { col: 4, row: 10 },
  27: { col: 3, row: 10 },
  28: { col: 2, row: 10 },
  29: { col: 1, row: 10 },
  30: { col: 0, row: 10 }, // TAKE ANOTHER SPIN (Corner 4)

  // Left Column: bottom to top (31 to 39)
  31: { col: 0, row: 9 },
  32: { col: 0, row: 8 },
  33: { col: 0, row: 7 },
  34: { col: 0, row: 6 },
  35: { col: 0, row: 5 }, // THE WHY (#4)
  36: { col: 0, row: 4 },
  37: { col: 0, row: 3 }, // RHYTHM
  38: { col: 0, row: 2 },
  39: { col: 0, row: 1 }, // SPREZZATURA
};

// Linger threshold in ms required before hover / hold triggers inspection
const LINGER_THRESHOLD_MS = 500;

export const Board: React.FC<BoardProps> = ({
  spaces,
  players,
  activePlayerId,
  centerContent,
}) => {
  // Popover state: opens on intentional tap / click or lingering hover / hold
  const [inspectedSpace, setInspectedSpace] = useState<BoardSpace | null>(null);

  // Timers to enforce hover/touch linger exception
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const clearTouchTimer = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHoverTimer();
      clearTouchTimer();
    };
  }, []);

  const handleMouseEnterSpace = (space: BoardSpace) => {
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => {
      setInspectedSpace(space);
    }, LINGER_THRESHOLD_MS);
  };

  const handleMouseLeaveSpace = () => {
    clearHoverTimer();
  };

  const handleClickSpace = (e: React.MouseEvent, space: BoardSpace) => {
    e.stopPropagation();
    clearHoverTimer();
    clearTouchTimer();
    setInspectedSpace((prev) => (prev?.id === space.id ? null : space));
  };

  const handleTouchStartSpace = (space: BoardSpace) => {
    clearTouchTimer();
    touchTimerRef.current = setTimeout(() => {
      setInspectedSpace(space);
    }, LINGER_THRESHOLD_MS);
  };

  const handleTouchEndSpace = () => {
    clearTouchTimer();
  };

  const renderSpaceIcon = (space: BoardSpace, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const iconClass =
      size === 'lg'
        ? 'w-6 h-6'
        : size === 'md'
        ? 'w-4 h-4'
        : 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5';

    if (space.id === 0) return <Eye className={`${iconClass} text-emerald-300`} />;
    if (space.isPledge) return <Glasses className={`${iconClass} text-amber-300 animate-pulse`} />;
    if (space.id === 20) return <Landmark className={`${iconClass} text-indigo-300`} />;
    if (space.id === 30) return <Zap className={`${iconClass} text-cyan-300`} />;
    if (space.isWhy) return <Anchor className={`${iconClass} text-blue-300`} />;
    if (space.id === 37) return <Sparkles className={`${iconClass} text-sky-300`} />;
    if (space.id === 39) return <Flame className={`${iconClass} text-violet-300`} />;
    if (space.type === 'goliath') return <Skull className={`${iconClass} text-rose-400`} />;
    if (space.type === 'help') return <HeartHandshake className={`${iconClass} text-teal-400`} />;
    if (space.type === 'excellence') return <Award className={`${iconClass} text-amber-400`} />;
    return <span className="text-[7px] sm:text-[9px] font-black text-slate-400">#{space.id}</span>;
  };

  const getSpaceTypeBadge = (space: BoardSpace) => {
    if (space.id === 0) return { label: 'START', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (space.isPledge) return { label: 'PLEDGE CORNER', bg: 'bg-purple-500/25 text-purple-200 border-purple-400/50' };
    if (space.id === 20) return { label: 'THE AGORA', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' };
    if (space.isWhy) return { label: 'THE WHY', bg: 'bg-blue-500/25 text-blue-200 border-blue-400/50' };
    if (space.type === 'goliath') return { label: 'GOLIATH', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    if (space.type === 'help') return { label: 'HELP', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
    if (space.type === 'excellence') return { label: 'EXCELLENCE', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { label: 'SPACE', bg: 'bg-slate-700/40 text-slate-300 border-slate-600/40' };
  };

  return (
    <div className="relative w-full max-w-[820px] aspect-square mx-auto p-1.5 sm:p-3 bg-slate-900/95 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Subtle Board Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 11x11 Grid of Track Spaces */}
      <div className="w-full h-full grid grid-cols-11 grid-rows-11 gap-0.5 sm:gap-1 relative">
        {/* Render 40 Track Spaces around perimeter */}
        {spaces.map((space) => {
          const coords = SPACE_COORDINATES[space.id] || { col: 0, row: 0 };
          const occupyingPlayers = players.filter((p) => p.position === space.id);
          const isCorner = space.id === 0 || space.id === 10 || space.id === 20 || space.id === 30;
          const isGoliath = space.type === 'goliath';
          const isPledge = space.isPledge;
          const isWhy = space.isWhy;
          const isInspected = inspectedSpace?.id === space.id;

          return (
            <div
              key={space.id}
              id={`board-space-${space.id}`}
              style={{
                gridColumnStart: coords.col + 1,
                gridRowStart: coords.row + 1,
              }}
              onMouseEnter={() => handleMouseEnterSpace(space)}
              onMouseLeave={handleMouseLeaveSpace}
              onClick={(e) => handleClickSpace(e, space)}
              onTouchStart={() => handleTouchStartSpace(space)}
              onTouchEnd={handleTouchEndSpace}
              onTouchMove={handleTouchEndSpace}
              onTouchCancel={handleTouchEndSpace}
              className={`relative rounded-lg sm:rounded-xl border flex flex-col justify-between p-0.5 sm:p-1 transition-all duration-200 overflow-hidden cursor-pointer ${
                isInspected
                  ? 'ring-2 ring-amber-400 scale-[1.04] z-30 shadow-xl'
                  : ''
              } ${
                isPledge
                  ? 'bg-gradient-to-br from-purple-700 to-indigo-900 border-purple-400 text-white shadow-lg ring-1 ring-purple-400/50'
                  : space.id === 0
                  ? 'bg-gradient-to-br from-emerald-800 to-teal-950 border-emerald-400 text-white shadow-md'
                  : isCorner
                  ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                  : isWhy
                  ? 'bg-gradient-to-b from-blue-900 to-blue-950 border-blue-400/80 text-blue-100 shadow-sm'
                  : isGoliath
                  ? 'bg-gradient-to-b from-rose-950/90 to-slate-900 border-rose-600/70 text-rose-100'
                  : space.type === 'help'
                  ? 'bg-teal-950/70 border-teal-500/50 text-teal-100'
                  : space.type === 'excellence'
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-100'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
              }`}
              title={`Space #${space.id}: ${space.name} (Linger or click to inspect)`}
            >
              {/* Space Header: Number & Icon */}
              <div className="flex items-center justify-between w-full leading-none">
                <span className="text-[6px] sm:text-[8px] font-black text-slate-400 opacity-90">
                  #{space.id}
                </span>
                <div className="flex items-center justify-center">
                  {renderSpaceIcon(space)}
                </div>
              </div>

              {/* Space Name */}
              <div className="text-center my-auto px-0.5 leading-tight">
                <span
                  className={`block font-black tracking-tight leading-none truncate ${
                    isPledge
                      ? 'text-[7px] sm:text-[10px] text-amber-300 drop-shadow'
                      : isCorner
                      ? 'text-[7px] sm:text-[9px] text-white font-extrabold'
                      : isWhy
                      ? 'text-[7px] sm:text-[9.5px] text-blue-200 font-black uppercase'
                      : isGoliath
                      ? 'text-[6px] sm:text-[8px] text-rose-300 font-extrabold uppercase'
                      : 'text-[6px] sm:text-[8px] text-slate-300 font-bold'
                  }`}
                >
                  {isWhy ? 'The WHY' : space.name}
                </span>
                {!isWhy && space.subtitle && (
                  <span className="hidden sm:block text-[6px] font-bold opacity-75 uppercase tracking-wider truncate">
                    {space.subtitle}
                  </span>
                )}
              </div>

              {/* Pawns situated on this space */}
              <div className="min-h-[12px] sm:min-h-[20px] flex items-end justify-center gap-0.5 z-10">
                <AnimatePresence>
                  {occupyingPlayers.map((player) => {
                    const isActive = player.id === activePlayerId;
                    return (
                      <motion.div
                        key={player.id}
                        layoutId={`pawn-player-${player.id}`}
                        initial={{ scale: 0.5, y: -6, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="relative"
                      >
                        <Pawn
                          type={player.pawnType}
                          color={player.color}
                          size="xs"
                          animateBounce={isActive}
                          badgeNumber={player.id}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {/* Center Arena: 9x9 Grid Area in the middle */}
        <div
          style={{
            gridColumn: '2 / 11',
            gridRow: '2 / 11',
          }}
          onClick={() => setInspectedSpace(null)}
          className="relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 shadow-inner z-0 overflow-hidden"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-6xl sm:text-8xl font-black text-white tracking-widest uppercase">
              DORK
            </span>
          </div>

          {/* Center Interactive Widget */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {centerContent}
          </div>

          {/* Quick Helper Tag */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] text-slate-500 font-medium bg-slate-950/70 px-2 py-0.5 rounded-full border border-slate-800/80 pointer-events-none whitespace-nowrap">
            <Info className="w-2.5 h-2.5 text-amber-400" />
            <span>Linger or click any square for details</span>
          </div>
        </div>
      </div>

      {/* SPACE DETAIL POPOVER */}
      <AnimatePresence>
        {inspectedSpace && (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setInspectedSpace(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 text-white shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                id="close-space-popover-btn"
                onClick={() => setInspectedSpace(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Space Badge & Number */}
              <div className="flex items-center gap-2 mb-2 pr-8">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    getSpaceTypeBadge(inspectedSpace).bg
                  }`}
                >
                  {renderSpaceIcon(inspectedSpace, 'sm')}
                  <span>{getSpaceTypeBadge(inspectedSpace).label}</span>
                </span>
                <span className="text-xs font-black text-amber-400">
                  Space #{inspectedSpace.id}
                </span>
              </div>

              {/* Full Title */}
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug mb-0.5">
                {inspectedSpace.name}
              </h3>

              {/* Full Subtitle (if available) */}
              {inspectedSpace.subtitle && (
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-2">
                  {inspectedSpace.subtitle}
                </p>
              )}

              {/* Full Untruncated Description / Rules Text */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 my-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal shadow-inner">
                {inspectedSpace.description}
              </div>

              {/* Occupying Pawns */}
              {(() => {
                const occupants = players.filter((p) => p.position === inspectedSpace.id);
                return (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      Current Occupants:
                    </span>
                    {occupants.length === 0 ? (
                      <span className="text-slate-500 italic">None</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {occupants.map((occ) => (
                          <div
                            key={occ.id}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700"
                          >
                            <Pawn type={occ.pawnType} color={occ.color} size="xs" />
                            <span
                              className="font-bold text-[11px]"
                              style={{ color: occ.hex }}
                            >
                              {occ.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <p className="text-[10px] text-center text-slate-500 mt-3">
                Tap anywhere outside or press ✕ to close
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
