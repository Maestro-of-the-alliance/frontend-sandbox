import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCard, Player } from '../types';
import {
  Skull,
  ZapOff,
  Radio,
  ArrowLeftRight,
  BrainCircuit,
  EyeOff,
  Activity,
  Sparkles,
  Moon,
  HeartHandshake,
  HandMetal,
  Zap,
  Glasses,
  ShieldCheck,
  Users,
  Award,
  Flame,
} from 'lucide-react';

interface CardModalProps {
  card: GameCard | null;
  activePlayer: Player;
  isOpen: boolean;
  onApply: () => void;
}

const ICON_MAP: { [key: string]: React.ElementType } = {
  Skull,
  ZapOff,
  Radio,
  ArrowLeftRight,
  BrainCircuit,
  EyeOff,
  Activity,
  Sparkles,
  Moon,
  HeartHandshake,
  HandMetal,
  Zap,
  Glasses,
  ShieldCheck,
  Users,
  Award,
  Flame,
};

export const CardModal: React.FC<CardModalProps> = ({
  card,
  activePlayer,
  isOpen,
  onApply,
}) => {
  // Auto proceed for AI players after relaxed delay so players can read the card
  useEffect(() => {
    if (isOpen && !activePlayer.isHuman) {
      const timer = setTimeout(() => {
        onApply();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activePlayer.isHuman, onApply]);

  if (!card) return null;

  const isGoliath = card.type === 'goliath';
  const IconComponent = ICON_MAP[card.icon] || (isGoliath ? Skull : Sparkles);
  const isShieldedFromGoliath = isGoliath && activePlayer.shielded;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <motion.div
            initial={{ scale: 0.7, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className={`relative w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl overflow-hidden border-2 ${
              isGoliath
                ? 'bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 border-rose-600 text-rose-100'
                : 'bg-gradient-to-b from-slate-950 via-teal-950 to-slate-950 border-teal-500 text-teal-100'
            }`}
          >
            {/* Header Pill */}
            <div className="flex items-center justify-center mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isGoliath
                    ? 'bg-rose-900/60 text-rose-300 border border-rose-500/50'
                    : 'bg-teal-900/60 text-teal-300 border border-teal-500/50'
                }`}
              >
                {isGoliath ? (
                  <>
                    <Skull className="w-3.5 h-3.5 text-rose-400" />
                    <span>GOLIATH HAZARD</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>ALLIANCE CARD</span>
                  </>
                )}
              </span>
            </div>

            {/* Icon Banner */}
            <div className="flex items-center justify-center my-3">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
                  isGoliath
                    ? 'bg-rose-900/40 border-rose-500/80 text-rose-400'
                    : 'bg-teal-900/40 border-teal-400/80 text-teal-300'
                }`}
              >
                <IconComponent className="w-9 h-9" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase mb-1">
              {card.title}
            </h3>

            {/* Description */}
            <div
              className={`rounded-2xl p-3.5 my-3 text-xs sm:text-sm font-medium leading-relaxed ${
                isGoliath
                  ? 'bg-rose-950/70 border border-rose-800/80 text-rose-200'
                  : 'bg-teal-950/70 border border-teal-800/80 text-teal-100'
              }`}
            >
              {isShieldedFromGoliath ? (
                <div className="flex flex-col items-center gap-1 text-emerald-300 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>ALLIANCE SHIELD BLOCKED THIS GOLIATH SETBACK!</span>
                </div>
              ) : (
                card.description
              )}
            </div>

            {/* Action / Continue Button */}
            <button
              id="apply-card-btn"
              onClick={onApply}
              className={`w-full py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-98 cursor-pointer border ${
                isGoliath
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400'
                  : 'bg-teal-600 hover:bg-teal-500 text-white border-teal-400'
              }`}
            >
              {activePlayer.isHuman
                ? card.actionText || 'Continue'
                : 'Applying card...'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
