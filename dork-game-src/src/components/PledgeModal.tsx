import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { Pawn } from './Pawn';
import { sound } from '../utils/audio';
import { Sparkles, Glasses, ArrowRight } from 'lucide-react';

interface PledgeModalProps {
  player: Player;
  isOpen: boolean;
  onContinue: () => void;
}

export const PledgeModal: React.FC<PledgeModalProps> = ({
  player,
  isOpen,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSeeingTransformation();
    }
  }, [isOpen]);

  // Auto proceed for computer players after relaxed delay so players can read the story
  useEffect(() => {
    if (isOpen && !player.isHuman) {
      const timer = setTimeout(() => {
        onContinue();
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, player.isHuman, onContinue]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 border-2 border-purple-500 rounded-3xl p-6 text-center text-white shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 border border-purple-400/40 rounded-full text-xs font-black text-purple-300 uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Corner Milestone: PLEDGE</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              SPARK + DOMO → DORK
            </h2>
            <p className="text-purple-200 text-sm font-medium italic mb-5">
              "I found my partner. Sunglasses equipped." 😎
            </p>

            {/* Transformation Pawn Showcase */}
            <div className="relative py-3 flex items-center justify-center gap-6">
              {/* Spark (Prior) */}
              <div className="flex flex-col items-center opacity-50 scale-90">
                <Pawn type="spark" color={player.color} size="md" />
                <span className="text-[11px] font-bold text-slate-400 mt-2">SPARK</span>
              </div>

              {/* Transformation Icon */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-600/50 border border-purple-400 flex items-center justify-center text-amber-300">
                  <Glasses className="w-5 h-5 animate-pulse" />
                </div>
                <ArrowRight className="w-4 h-4 text-purple-300 mt-1" />
              </div>

              {/* DORK (Transformed!) */}
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1.15, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center"
              >
                <Pawn
                  type="dork"
                  color={player.color}
                  size="lg"
                  animateBounce={true}
                  animateGlow={true}
                />
                <span className="text-xs font-black text-amber-300 mt-2 uppercase tracking-wide">
                  DORK ✨
                </span>
              </motion.div>
            </div>

            {/* Humorous one-liner */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 my-4 text-center">
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                You’re officially a <strong className="text-amber-400">DORK</strong> now. Deflect GOLIATH penalties and increase the measure of excellence!
              </p>
            </div>

            {/* Action Button */}
            <button
              id="pledge-continue-btn"
              onClick={onContinue}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white font-black text-sm uppercase tracking-wider rounded-xl border border-purple-400 shadow-lg cursor-pointer transition-all"
            >
              {player.isHuman ? 'WE ARE DORK — LET’S GO!' : 'Continuing...'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
