import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { sound } from '../utils/audio';
import { Award, Sparkles, HeartHandshake, Layers } from 'lucide-react';

interface OpportunityModalProps {
  player: Player;
  isOpen: boolean;
  onHelpOther: () => void;
  onDrawCard: () => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  player,
  isOpen,
  onHelpOther,
  onDrawCard,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playExcellenceChime();
    }
  }, [isOpen]);

  // If automated computer player, pick randomly after a relaxed delay
  useEffect(() => {
    if (isOpen && !player.isHuman) {
      const timer = setTimeout(() => {
        if (Math.random() > 0.5) {
          onHelpOther();
        } else {
          onDrawCard();
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, player.isHuman, onHelpOther, onDrawCard]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden text-center"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Badge */}
          <div className="flex items-center justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-black text-amber-300 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>FINAL OPPORTUNITY</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            YOU COMPLETED THE LAP!
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Completing the lap alone does not grant victory. You need at least 2 Excellence to win. Choose how to earn your final opportunity:
          </p>

          <div className="flex flex-col gap-3">
            {/* Option A: Help another player */}
            <button
              id="opportunity-help-player-btn"
              onClick={onHelpOther}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border border-teal-400 shadow-lg cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-950/60 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4 text-teal-300" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-white">HELP ANOTHER PLAYER</div>
                  <div className="text-[10px] font-medium text-teal-100 normal-case">
                    Advance the furthest trailing player forward
                  </div>
                </div>
              </div>
              <span className="text-amber-300 font-black text-xs px-2 py-1 bg-teal-950/80 rounded-lg">
                +1 ⭐
              </span>
            </button>

            {/* Option B: Draw a Card */}
            <button
              id="opportunity-draw-card-btn"
              onClick={onDrawCard}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-100 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border border-slate-600 shadow cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-white">DRAW A CARD</div>
                  <div className="text-[10px] font-medium text-slate-400 normal-case">
                    Draw an action card to resolve
                  </div>
                </div>
              </div>
              <span className="text-slate-300 text-xs px-2 py-1 bg-slate-900 rounded-lg">
                Draw 🎴
              </span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 mt-4">
            {player.isHuman ? 'Choose an action to proceed' : 'Player is choosing...'}
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
