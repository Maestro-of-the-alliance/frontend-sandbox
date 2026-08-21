import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Player } from '../types';
import { Pawn } from './Pawn';
import { sound } from '../utils/audio';
import { Trophy, Award, RotateCcw, ExternalLink } from 'lucide-react';

interface WinModalProps {
  winner: Player | null;
  isOpen: boolean;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  winner,
  isOpen,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (isOpen && winner) {
      sound.playWinFanfare();

      // Launch multi-stage confetti
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen, winner]);

  if (!winner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Trophy Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-400 mb-4 shadow-lg">
              <Trophy className="w-9 h-9" />
            </div>

            {/* Winner Badge */}
            <div className="mb-2">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: winner.hex }}
              >
                {winner.name} Wins!
              </span>
            </div>

            {/* Core Message requested by user */}
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight uppercase leading-tight mb-3">
              YOU INCREASED THE MEASURE OF EXCELLENCE IN THE WORLD.
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
              A SPARK found their DOMO, became a DORK, weathered GOLIATH's interference, elevated their fellow travelers, and completed the journey.
            </p>

            {/* Winner Pawn Visual */}
            <div className="py-2 flex items-center justify-center gap-4">
              <Pawn
                type="dork"
                color={winner.color}
                size="lg"
                animateBounce={true}
                animateGlow={true}
              />
              <div className="text-left bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  Final Measure
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 text-base font-black">
                  <Award className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{winner.excellence} Excellence Stars</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  ✓ DOMO Partnership Active
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="play-again-btn"
                onClick={onPlayAgain}
                className="w-full sm:w-auto flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl border border-amber-300 shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>

              <a
                id="back-to-alliance-btn"
                href="https://allianceftf.org"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex-1 py-3 px-6 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-black text-sm uppercase tracking-wider rounded-xl border border-slate-700 shadow cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span>BACK TO THE ALLIANCE</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
