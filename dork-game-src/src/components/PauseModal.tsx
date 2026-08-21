import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { Pawn } from './Pawn';
import { Play, RotateCcw, Users, Volume2, VolumeX, Pause } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onOpenSetup: () => void;
  onQuickRestart: () => void;
  players: Player[];
  activePlayer: Player;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onOpenSetup,
  onQuickRestart,
  players,
  activePlayer,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-700 rounded-3xl p-6 text-white shadow-2xl overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Badge */}
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-black text-amber-300 uppercase tracking-wider">
              <Pause className="w-3.5 h-3.5 fill-amber-300" />
              <span>GAME PAUSED</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight mb-4">
            TAKE A BREATHER
          </h2>

          {/* Current Match Snapshot */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 mb-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 pb-1.5 border-b border-slate-700/80">
              <span>CURRENT TURN:</span>
              <span className="text-white font-black flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activePlayer.hex }}
                />
                {activePlayer.name} ({activePlayer.isHuman ? 'Human' : 'Bot'})
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-center"
                >
                  <Pawn type={p.pawnType} color={p.color} size="xs" />
                  <span className="text-[10px] font-black text-white mt-1 truncate w-full">
                    {p.name}
                  </span>
                  <span className="text-[9px] font-bold text-amber-300">
                    ⭐ {p.excellence}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Resume Button */}
            <button
              id="pause-resume-btn"
              onClick={onResume}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl border-2 border-amber-300 shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>RESUME GAME</span>
            </button>

            {/* Change Number of Players / Setup */}
            <button
              id="pause-change-players-btn"
              onClick={onOpenSetup}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 shadow cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>CHANGE NUMBER OF PLAYERS</span>
            </button>

            {/* Restart Current Setup */}
            <div className="flex items-center gap-2">
              <button
                id="pause-restart-btn"
                onClick={onQuickRestart}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>RESTART MATCH</span>
              </button>

              <button
                id="pause-sound-btn"
                onClick={onToggleMute}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>UNMUTE</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>MUTE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
