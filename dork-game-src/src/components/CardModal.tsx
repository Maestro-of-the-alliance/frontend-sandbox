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
  ShieldAlert,
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
  // Auto proceed for AI players after delay
  useEffect(() => {
    if (isOpen && !activePlayer.isHuman) {
      const timer = setTimeout(() => {
        onApply();
      }, 2500);
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
                    <span>GOLIATH CARD</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>ALLIANCE EVENT</span>
                  </>
                )}
              </span>
            </div>

            {/* Icon Graphic */}
            <div className="my-4 flex items-center justify-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
                  isGoliath
                    ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                    : 'bg-teal-600/20 border-teal-400 text-amber-300'
                }`}
              >
                <IconComponent className="w-9 h-9" />
              </div>
            </div>

            {/* Card Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
              {card.title}
            </h3>

            {/* Tagline */}
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                isGoliath ? 'text-rose-400' : 'text-teal-300'
              }`}
            >
              {card.tagline}
            </p>

            {/* Description Card */}
            <div
              className={`rounded-xl p-3.5 mb-6 text-left border ${
                isGoliath
                  ? 'bg-slate-900/90 border-rose-900/60 text-slate-200'
                  : 'bg-slate-900/90 border-teal-900/60 text-slate-200'
              }`}
            >
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {card.description}
              </p>

              {isShieldedFromGoliath && (
                <div className="mt-2 pt-2 border-t border-rose-800 flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span>ALLIANCE SHIELD ACTIVE: Hazard neutralized!</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              id="card-execute-btn"
              onClick={onApply}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                isGoliath
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 border border-teal-300'
              }`}
            >
              {activePlayer.isHuman ? card.actionText || 'Continue' : 'Resolving...'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
