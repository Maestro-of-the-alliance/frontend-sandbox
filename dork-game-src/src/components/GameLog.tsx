import React from 'react';
import { TurnLog } from '../types';
import { Sparkles, Skull, ArrowRight, Glasses, Trophy, Shield } from 'lucide-react';

interface GameLogProps {
  logs: TurnLog[];
}

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  const getLogIcon = (type: TurnLog['type']) => {
    switch (type) {
      case 'goliath':
        return <Skull className="w-3.5 h-3.5 text-rose-400" />;
      case 'transformation':
        return <Glasses className="w-3.5 h-3.5 text-purple-400" />;
      case 'help':
        return <Sparkles className="w-3.5 h-3.5 text-teal-400" />;
      case 'win':
        return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-3 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          LIVE MATCH LOG
        </span>
        <span className="text-[9px] text-slate-500 font-semibold">
          ALLIANCE vs GOLIATH
        </span>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        {logs.length === 0 ? (
          <span className="text-slate-500 text-xs italic py-1">
            Game started. Click SPIN to make your opening move!
          </span>
        ) : (
          logs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 py-0.5 text-slate-300 leading-snug animate-fadeIn"
            >
              <div className="mt-0.5 flex-shrink-0">{getLogIcon(log.type)}</div>
              <span className="text-[11px] sm:text-xs">{log.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
