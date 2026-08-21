import React from 'react';
import { Player } from '../types';
import { Pawn } from './Pawn';
import { Award, Shield, User, Bot, Moon, Glasses } from 'lucide-react';

interface PlayerRosterProps {
  players: Player[];
  activePlayerId: number;
  onToggleHuman: (id: number) => void;
  humanCount: number;
  onSetHumanCount: (count: number) => void;
  disabled?: boolean;
}

export const PlayerRoster: React.FC<PlayerRosterProps> = ({
  players,
  activePlayerId,
  onToggleHuman,
  humanCount,
  onSetHumanCount,
  disabled = false,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Player Mode Quick Selector */}
      <div className="flex items-center justify-between bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
        <span className="font-bold text-slate-400">PLAYERS ON BOARD:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((count) => (
            <button
              key={count}
              id={`player-count-btn-${count}`}
              disabled={disabled}
              onClick={() => onSetHumanCount(count)}
              className={`px-2 py-0.5 rounded-md font-black text-xs transition-all cursor-pointer ${
                humanCount === count
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {count} {count === 1 ? 'Human' : 'Humans'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Player Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {players.map((player) => {
          const isActive = player.id === activePlayerId;
          const isDork = player.pawnType === 'dork';

          return (
            <div
              key={player.id}
              id={`player-roster-card-${player.id}`}
              className={`relative rounded-2xl p-2 sm:p-2.5 transition-all duration-200 border flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800/95 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 opacity-90'
              }`}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black uppercase rounded-full tracking-wider shadow-sm">
                  Active Turn
                </div>
              )}

              {/* Top Row: Name & Human/Bot Toggle */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: player.hex }}
                  />
                  <span className="text-xs font-black text-white truncate">
                    {player.name}
                  </span>
                </div>

                <button
                  id={`toggle-role-btn-${player.id}`}
                  disabled={disabled}
                  onClick={() => onToggleHuman(player.id)}
                  title={`Click to switch between Human and Auto Bot`}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    player.isHuman
                      ? 'bg-teal-900/60 text-teal-300 border border-teal-600/50 hover:bg-teal-800/60'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {player.isHuman ? (
                    <>
                      <User className="w-2.5 h-2.5" />
                      <span>YOU</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-2.5 h-2.5" />
                      <span>BOT</span>
                    </>
                  )}
                </button>
              </div>

              {/* Middle: Pawn Icon & State */}
              <div className="flex items-center justify-between py-1 px-1 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <Pawn
                    type={player.pawnType}
                    color={player.color}
                    size="sm"
                    animateBounce={isActive}
                  />
                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] font-black uppercase ${
                        isDork ? 'text-amber-300 flex items-center gap-0.5' : 'text-slate-400'
                      }`}
                    >
                      {isDork ? (
                        <>
                          <Glasses className="w-3 h-3 text-amber-400" />
                          <span>DORK</span>
                        </>
                      ) : (
                        'SPARK'
                      )}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      Space #{player.position}
                    </span>
                  </div>
                </div>

                {/* Excellence Counter */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 px-1.5 py-0.5 rounded-lg">
                    <Award className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-amber-300">
                      {player.excellence}
                    </span>
                  </div>
                  <span className="text-[7px] font-bold text-amber-400/80 uppercase">
                    Excellence
                  </span>
                </div>
              </div>

              {/* Status Buffs / Debuffs */}
              <div className="flex items-center gap-1 mt-1 min-h-[14px]">
                {player.shielded && (
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-cyan-300 bg-cyan-950/60 px-1 rounded border border-cyan-800">
                    <Shield className="w-2 h-2 text-cyan-400" /> Shielded
                  </span>
                )}
                {player.missNextTurn && (
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-rose-300 bg-rose-950/60 px-1 rounded border border-rose-800">
                    <Moon className="w-2 h-2 text-rose-400" /> Miss Turn
                  </span>
                )}
                {player.atSeeingWait && (
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-purple-300 bg-purple-950/60 px-1 rounded border border-purple-800">
                    <Glasses className="w-2 h-2 text-purple-400" /> Roll 1 or 2
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
