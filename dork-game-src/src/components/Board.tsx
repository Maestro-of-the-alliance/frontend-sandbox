import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardSpace, Player } from '../types';
import { Pawn } from './Pawn';
import {
  Sparkles,
  Shield,
  Zap,
  Flag,
  Glasses,
  Flame,
  Award,
  HeartHandshake,
  Skull,
  Radio,
} from 'lucide-react';

interface BoardProps {
  spaces: BoardSpace[];
  players: Player[];
  activePlayerId: number;
  centerContent: React.ReactNode;
}

// 7x7 Perimeter Coordinate Map for 24 spaces (0 to 23)
const SPACE_COORDINATES: { [id: number]: { col: number; row: number } } = {
  // Top Row: left to right (0 to 6)
  0: { col: 0, row: 0 },
  1: { col: 1, row: 0 },
  2: { col: 2, row: 0 },
  3: { col: 3, row: 0 },
  4: { col: 4, row: 0 },
  5: { col: 5, row: 0 },
  6: { col: 6, row: 0 },

  // Right Column: top to bottom (7 to 12)
  7: { col: 6, row: 1 },
  8: { col: 6, row: 2 },
  9: { col: 6, row: 3 },
  10: { col: 6, row: 4 }, // SEEING
  11: { col: 6, row: 5 },
  12: { col: 6, row: 6 },

  // Bottom Row: right to left (13 to 18)
  13: { col: 5, row: 6 },
  14: { col: 4, row: 6 },
  15: { col: 3, row: 6 }, // PLEDGE
  16: { col: 2, row: 6 },
  17: { col: 1, row: 6 },
  18: { col: 0, row: 6 },

  // Left Column: bottom to top (19 to 23)
  19: { col: 0, row: 5 }, // RHYTHM
  20: { col: 0, row: 4 },
  21: { col: 0, row: 3 },
  22: { col: 0, row: 2 }, // SPREZZATURA
  23: { col: 0, row: 1 },
};

export const Board: React.FC<BoardProps> = ({
  spaces,
  players,
  activePlayerId,
  centerContent,
}) => {
  const renderSpaceIcon = (space: BoardSpace) => {
    if (space.id === 0) return <Flag className="w-3.5 h-3.5 text-white" />;
    if (space.isSeeing) return <Glasses className="w-4 h-4 text-white animate-bounce" />;
    if (space.id === 4) return <Zap className="w-3.5 h-3.5 text-white" />;
    if (space.id === 15) return <Shield className="w-3.5 h-3.5 text-white" />;
    if (space.id === 19) return <Sparkles className="w-3.5 h-3.5 text-white" />;
    if (space.id === 22) return <Flame className="w-3.5 h-3.5 text-white" />;
    if (space.type === 'goliath') return <Skull className="w-3.5 h-3.5 text-rose-600" />;
    if (space.type === 'help') return <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />;
    if (space.type === 'excellence') return <Award className="w-3.5 h-3.5 text-amber-600" />;
    return <span className="text-[10px] font-bold text-slate-400">{space.id}</span>;
  };

  return (
    <div className="relative w-full max-w-[720px] aspect-square mx-auto p-2 sm:p-4 bg-slate-900/90 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Subtle Board Grain / Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 7x7 Grid of Track Spaces */}
      <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-1 sm:gap-1.5 relative">
        {/* Render 24 Track Spaces around perimeter */}
        {spaces.map((space) => {
          const coords = SPACE_COORDINATES[space.id] || { col: 0, row: 0 };
          const occupyingPlayers = players.filter((p) => p.position === space.id);
          const isMilestone = space.type === 'milestone' || space.type === 'start';
          const isGoliath = space.type === 'goliath';
          const isSeeing = space.isSeeing;

          return (
            <div
              key={space.id}
              id={`board-space-${space.id}`}
              style={{
                gridColumnStart: coords.col + 1,
                gridRowStart: coords.row + 1,
              }}
              className={`relative rounded-xl border flex flex-col justify-between p-1 sm:p-1.5 transition-all duration-200 ${
                isSeeing
                  ? 'bg-gradient-to-br from-purple-700 to-indigo-900 border-purple-400 text-white shadow-lg ring-2 ring-purple-400/50'
                  : isMilestone
                  ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                  : isGoliath
                  ? 'bg-gradient-to-b from-rose-950 to-slate-900 border-rose-600 text-rose-100'
                  : space.type === 'help'
                  ? 'bg-slate-800/90 border-teal-500/60 text-teal-100'
                  : space.type === 'excellence'
                  ? 'bg-slate-800/90 border-amber-500/60 text-amber-100'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
              }`}
            >
              {/* Space Header: Number & Icon */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[8px] sm:text-[10px] font-black text-slate-400 opacity-80">
                  #{space.id}
                </span>
                <div className="flex items-center justify-center">
                  {renderSpaceIcon(space)}
                </div>
              </div>

              {/* Space Name / Milestone Label */}
              <div className="text-center my-auto px-0.5">
                <span
                  className={`block leading-tight font-black tracking-tight ${
                    isSeeing
                      ? 'text-[9px] sm:text-[11px] text-amber-300 drop-shadow'
                      : isMilestone
                      ? 'text-[8px] sm:text-[10px] text-white'
                      : isGoliath
                      ? 'text-[7px] sm:text-[9px] text-rose-300 font-extrabold uppercase'
                      : 'text-[7px] sm:text-[9px] text-slate-300'
                  }`}
                >
                  {space.name}
                </span>
                {space.subtitle && (
                  <span className="block text-[6px] sm:text-[8px] font-bold opacity-75 uppercase tracking-wider">
                    {space.subtitle}
                  </span>
                )}
              </div>

              {/* Pawns currently situated on this space */}
              <div className="min-h-[18px] sm:min-h-[26px] flex items-end justify-center gap-0.5 z-10">
                <AnimatePresence>
                  {occupyingPlayers.map((player) => {
                    const isActive = player.id === activePlayerId;
                    return (
                      <motion.div
                        key={player.id}
                        layoutId={`pawn-player-${player.id}`}
                        initial={{ scale: 0.5, y: -10, opacity: 0 }}
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

        {/* Center Arena: 5x5 Grid Area in the middle (cols 2..6, rows 2..6 in 1-based CSS) */}
        <div
          style={{
            gridColumn: '2 / 7',
            gridRow: '2 / 7',
          }}
          className="relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 shadow-inner z-0 overflow-hidden"
        >
          {/* Alliance vs Goliath Centerpiece Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-7xl sm:text-9xl font-black text-white tracking-widest uppercase">
              DORK
            </span>
          </div>

          {/* Center Interactive Widget (Spinner & Active Turn Controls) */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {centerContent}
          </div>
        </div>
      </div>
    </div>
  );
};
