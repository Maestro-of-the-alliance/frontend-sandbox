import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pawn } from './Pawn';
import { Play, Users, Sparkles, ChevronDown } from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  currentHumanCount: number;
  onStartGame: (humanCount: number) => void;
  isRestart?: boolean;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  currentHumanCount,
  onStartGame,
  isRestart = false,
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(currentHumanCount || 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-700 rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-black text-amber-300 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRestart ? 'Restart Match' : 'Player Setup'}</span>
            </span>

            <span className="text-[11px] font-bold text-slate-400">
              4 Pawns on Track
            </span>
          </div>

          {/* Question & Clean Dropdown */}
          <div className="mb-6">
            <label
              htmlFor="human-player-dropdown"
              className="block text-base sm:text-lg font-black text-white tracking-tight mb-1"
            >
              How many players?
            </label>
            <p className="text-slate-400 text-xs sm:text-sm mb-4">
              Select how many human players are playing. Any remaining spots are filled by auto-bots.
            </p>

            {/* Clean Dropdown */}
            <div className="relative">
              <select
                id="human-player-dropdown"
                value={selectedCount}
                onChange={(e) => setSelectedCount(Number(e.target.value))}
                className="w-full appearance-none py-3.5 px-4 pr-10 bg-slate-800 border-2 border-slate-600 focus:border-amber-400 focus:outline-none rounded-2xl text-white font-bold text-sm sm:text-base cursor-pointer transition-colors shadow-inner"
              >
                <option value={1} className="bg-slate-900 text-white py-2">
                  1 Player (You vs. 3 Bots)
                </option>
                <option value={2} className="bg-slate-900 text-white py-2">
                  2 Players (2 Humans + 2 Bots)
                </option>
                <option value={3} className="bg-slate-900 text-white py-2">
                  3 Players (3 Humans + 1 Bot)
                </option>
                <option value={4} className="bg-slate-900 text-white py-2">
                  4 Players (All 4 Humans)
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Compact summary box */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1.5 items-center">
                <Pawn type="spark" color="red" size="xs" />
                <Pawn type="spark" color="blue" size="xs" />
                <Pawn type="spark" color="green" size="xs" />
                <Pawn type="spark" color="yellow" size="xs" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {selectedCount} Human{selectedCount > 1 ? 's' : ''} + {4 - selectedCount} Auto-Bot{4 - selectedCount !== 1 ? 's' : ''}
                </span>
                <span className="text-[10px] text-slate-400">
                  Ready to spin on the 40-space board
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2 py-1 rounded-lg">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>SPARK ➔ DORK</span>
            </div>
          </div>

          {/* Start Game Action */}
          <button
            id="confirm-start-game-btn"
            onClick={() => onStartGame(selectedCount)}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-98 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-2 border-amber-300 shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{isRestart ? 'RESTART MATCH' : 'START GAME'}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
