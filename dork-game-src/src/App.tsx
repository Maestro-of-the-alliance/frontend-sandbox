/**
 * WE ARE DORK — Quick-Play Web Demo
 * The ALLIANCE vs. GOLIATH Family Board Game
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Player,
  SpinResult,
  GameCard,
  TurnLog,
  PlayerId,
} from './types';
import {
  INITIAL_PLAYERS,
  BOARD_SPACES,
  GOLIATH_CARDS,
  POSITIVE_CARDS,
} from './data/boardData';
import { Board } from './components/Board';
import { Spinner } from './components/Spinner';
import { PlayerRoster } from './components/PlayerRoster';
import { SeeingModal } from './components/SeeingModal';
import { CardModal } from './components/CardModal';
import { WinModal } from './components/WinModal';
import { GameLog } from './components/GameLog';
import { sound } from './utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Glasses,
  Info,
  Shield,
  Award,
} from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [activeCard, setActiveCard] = useState<GameCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [isSeeingModalOpen, setIsSeeingModalOpen] = useState<boolean>(false);
  const [seeingPlayer, setSeeingPlayer] = useState<Player | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isWinModalOpen, setIsWinModalOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<TurnLog[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [humanCount, setHumanCount] = useState<number>(1);
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [turnMessage, setTurnMessage] = useState<string>('Click SPIN to begin your journey!');

  const activePlayer = players[activePlayerIndex];

  // Helper to append logs
  const addLog = useCallback((text: string, type: TurnLog['type'] = 'move') => {
    setLogs((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        text,
        type,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 19),
    ]);
  }, []);

  // Toggle sound
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
  };

  // Change human count setup (1 to 4 players)
  const handleSetHumanCount = (count: number) => {
    setHumanCount(count);
    setPlayers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        isHuman: idx < count,
      }))
    );
    addLog(`Configured for ${count} human player${count > 1 ? 's' : ''}.`);
  };

  // Toggle single player between human & bot
  const handleToggleHuman = (id: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isHuman;
          addLog(`${p.name} is now ${next ? 'Human controlled' : 'an Auto Bot'}.`);
          return { ...p, isHuman: next };
        }
        return p;
      })
    );
  };

  // Reset entire game
  const handleRestart = () => {
    setPlayers(
      INITIAL_PLAYERS.map((p, idx) => ({
        ...p,
        isHuman: idx < humanCount,
        position: 0,
        pawnType: 'spark',
        excellence: 0,
        missNextTurn: false,
        shielded: false,
        lapsCompleted: 0,
        atSeeingWait: false,
      }))
    );
    setActivePlayerIndex(0);
    setActiveCard(null);
    setIsCardModalOpen(false);
    setIsSeeingModalOpen(false);
    setSeeingPlayer(null);
    setWinner(null);
    setIsWinModalOpen(false);
    setIsProcessingTurn(false);
    setTurnMessage('New game started! Click SPIN.');
    setLogs([]);
    addLog('New game started! Every player begins as a SPARK.');
  };

  // Advance to next player
  const advanceTurn = useCallback((overrideIndex?: number) => {
    const nextIdx = overrideIndex !== undefined ? overrideIndex : (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIdx);
    setIsProcessingTurn(false);

    const nextPlayer = players[nextIdx];
    
    // Check if next player is asleep / misses turn
    if (nextPlayer.missNextTurn) {
      addLog(`${nextPlayer.name} was paused by GOLIATH and skipped their turn.`, 'goliath');
      setPlayers((prev) =>
        prev.map((p, idx) => (idx === nextIdx ? { ...p, missNextTurn: false } : p))
      );
      setTimeout(() => {
        advanceTurn((nextIdx + 1) % players.length);
      }, 1000);
      return;
    }

    if (nextPlayer.isHuman) {
      setTurnMessage(`${nextPlayer.name}'s turn — Click SPIN!`);
    } else {
      setTurnMessage(`${nextPlayer.name} (Auto Bot) is spinning...`);
    }
  }, [activePlayerIndex, players, addLog]);

  // Handle spin outcome
  const handleSpinResult = (result: SpinResult) => {
    setIsProcessingTurn(true);

    // 1. GOLIATH SPIN RESULT
    if (result === 'goliath') {
      addLog(`${activePlayer.name} spun GOLIATH!`, 'goliath');
      
      // Check if player has active shield
      if (activePlayer.shielded) {
        sound.playExcellenceChime();
        addLog(`🛡️ ALLIANCE SHIELD protected ${activePlayer.name} from GOLIATH's attack!`, 'help');
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, shielded: false } : p
          )
        );
        setTimeout(() => {
          advanceTurn();
        }, 1200);
        return;
      }

      // Pick a random Goliath card
      const randomCard = GOLIATH_CARDS[Math.floor(Math.random() * GOLIATH_CARDS.length)];
      setActiveCard(randomCard);
      setIsCardModalOpen(true);
      return;
    }

    // 2. NUMERIC SPIN RESULT (1, 2, or 3)
    const moveSteps = result as number;
    addLog(`${activePlayer.name} spun a ${moveSteps}.`);

    // Check if player is stuck at SEEING (Space 10) waiting for a 1 or 2
    if (activePlayer.atSeeingWait) {
      if (moveSteps === 3) {
        addLog(`${activePlayer.name} spun a 3. Must spin 1 or 2 to depart SEEING!`, 'transformation');
        setTurnMessage(`${activePlayer.name} remains at SEEING. Try again next turn!`);
        setTimeout(() => {
          advanceTurn();
        }, 1200);
        return;
      } else {
        // Roll 1 or 2 -> released from SEEING!
        addLog(`${activePlayer.name} departed SEEING with DOMO sunglasses!`, 'transformation');
        executeMovement(moveSteps, true);
        return;
      }
    }

    executeMovement(moveSteps, false);
  };

  // Perform movement along track
  const executeMovement = (steps: number, releasedFromSeeing: boolean = false) => {
    const currentPos = activePlayer.position;
    const boardLength = BOARD_SPACES.length; // 24
    const isSpark = activePlayer.pawnType === 'spark';

    // Mandatory Stop at SEEING (Space 10) for Sparks!
    if (isSpark && currentPos < 10 && currentPos + steps >= 10) {
      const seeingPos = 10;
      sound.playSeeingTransformation();

      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              position: seeingPos,
              pawnType: 'dork',
              atSeeingWait: true,
              excellence: p.excellence + 1, // Bonus for finding DOMO
            };
          }
          return p;
        })
      );

      const transformedPlayer: Player = {
        ...activePlayer,
        position: seeingPos,
        pawnType: 'dork',
        atSeeingWait: true,
        excellence: activePlayer.excellence + 1,
      };

      setSeeingPlayer(transformedPlayer);
      setIsSeeingModalOpen(true);
      addLog(`✨ ${activePlayer.name} reached SEEING, found their DOMO, and became a DORK!`, 'transformation');
      return;
    }

    // Standard Movement
    const newRawPos = currentPos + steps;
    const completedLap = newRawPos >= boardLength;
    const finalPos = newRawPos % boardLength;
    const newLaps = activePlayer.lapsCompleted + (completedLap ? 1 : 0);

    // Update state
    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx === activePlayerIndex) {
          return {
            ...p,
            position: finalPos,
            lapsCompleted: newLaps,
            atSeeingWait: false,
          };
        }
        return p;
      })
    );

    const spaceData = BOARD_SPACES[finalPos];
    sound.playHop();

    // Check Win Condition (Completed circuit + at least 2 Excellence)
    if (completedLap || (newLaps >= 1 && finalPos >= 0)) {
      if (activePlayer.excellence >= 2 && activePlayer.pawnType === 'dork') {
        // Instant Victory!
        const victoriousPlayer = {
          ...activePlayer,
          position: finalPos,
          lapsCompleted: newLaps,
        };
        setWinner(victoriousPlayer);
        setIsWinModalOpen(true);
        addLog(`🏆 ${activePlayer.name} WON THE GAME by elevating excellence!`, 'win');
        return;
      } else if (activePlayer.excellence < 2) {
        // Quick boost opportunity to keep game fast
        sound.playExcellenceChime();
        addLog(`${activePlayer.name} completed a circuit! Rewarded +1 EXCELLENCE for endurance.`, 'help');
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
          )
        );
      }
    }

    // Resolve landing on space
    resolveSpaceLanding(spaceData, finalPos);
  };

  // Resolve space effects
  const resolveSpaceLanding = (space: (typeof BOARD_SPACES)[0], finalPos: number) => {
    // 1. Hazard / Goliath space
    if (space.type === 'goliath') {
      sound.playGoliathAlarm();
      const randomCard = GOLIATH_CARDS[Math.floor(Math.random() * GOLIATH_CARDS.length)];
      setActiveCard(randomCard);
      setIsCardModalOpen(true);
      return;
    }

    // 2. Helpful Alliance spaces
    if (space.type === 'help') {
      const randomPositive = POSITIVE_CARDS[Math.floor(Math.random() * POSITIVE_CARDS.length)];
      setActiveCard(randomPositive);
      setIsCardModalOpen(true);
      return;
    }

    // 3. Direct Excellence Space
    if (space.type === 'excellence') {
      sound.playExcellenceChime();
      addLog(`⭐ ${activePlayer.name} landed on ${space.name} and gained +1 EXCELLENCE!`, 'help');
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
        )
      );
      setTimeout(() => advanceTurn(), 1000);
      return;
    }

    // 4. Milestone spaces
    if (space.id === 15) {
      // PLEDGE
      sound.playExcellenceChime();
      addLog(`🤝 ${activePlayer.name} took the PLEDGE (+1 EXCELLENCE)!`, 'help');
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
        )
      );
      setTimeout(() => advanceTurn(), 1000);
      return;
    }

    if (space.id === 19) {
      // RHYTHM
      sound.playHop();
      addLog(`⚡ ${activePlayer.name} hit RHYTHM momentum and surged +1 extra space!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, position: (p.position + 1) % BOARD_SPACES.length }
            : p
        )
      );
      setTimeout(() => advanceTurn(), 1000);
      return;
    }

    if (space.id === 22) {
      // SPREZZATURA
      sound.playExcellenceChime();
      addLog(`🔥 ${activePlayer.name} reached SPREZZATURA effortless mastery (+1 EXCELLENCE)!`, 'help');
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
        )
      );
      setTimeout(() => advanceTurn(), 1000);
      return;
    }

    // Normal space -> advance turn
    setTimeout(() => {
      advanceTurn();
    }, 800);
  };

  // Close card modal & apply card effect
  const handleApplyCard = () => {
    if (!activeCard) return;

    const result = activeCard.effect(activePlayer, players, BOARD_SPACES.length);
    setPlayers(result.updatedPlayers);
    addLog(result.message, activeCard.type === 'goliath' ? 'goliath' : 'help');

    setIsCardModalOpen(false);
    setActiveCard(null);

    // Check if anyone won from this effect
    const potentialWinner = result.updatedPlayers.find(
      (p) => p.excellence >= 3 && p.pawnType === 'dork' && p.lapsCompleted >= 1
    );

    if (potentialWinner) {
      setWinner(potentialWinner);
      setIsWinModalOpen(true);
      return;
    }

    setTimeout(() => {
      advanceTurn();
    }, 600);
  };

  // Close seeing modal & continue
  const handleContinueFromSeeing = () => {
    setIsSeeingModalOpen(false);
    setSeeingPlayer(null);
    setTimeout(() => {
      advanceTurn();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl mb-2 shadow-md">
        {/* Branding & Subtitle */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-600 border border-rose-400 flex items-center justify-center text-white font-black text-sm shadow-inner">
            <Glasses className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                WE ARE DORK
              </h1>
              <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded uppercase tracking-wider">
                Quick Demo
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              The ALLIANCE vs. GOLIATH Family Board Game
            </p>
          </div>
        </div>

        {/* Header Controls: Sound, Reset */}
        <div className="flex items-center gap-2">
          <button
            id="sound-toggle-btn"
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            id="restart-game-btn"
            onClick={handleRestart}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-700 transition-colors cursor-pointer"
            title="Restart Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESTART</span>
          </button>
        </div>
      </header>

      {/* Main Game Layout Container */}
      <main className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-4 flex-1">
        {/* Left / Top: Player Roster & Quick Log */}
        <div className="w-full lg:w-80 flex flex-col gap-3 order-2 lg:order-1">
          <PlayerRoster
            players={players}
            activePlayerId={activePlayer.id}
            onToggleHuman={handleToggleHuman}
            humanCount={humanCount}
            onSetHumanCount={handleSetHumanCount}
            disabled={isProcessingTurn || isCardModalOpen || isSeeingModalOpen}
          />

          {/* Quick Context / Instruction Hint */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>THE ALLIANCE JOURNEY</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Start as a <strong className="text-slate-200">SPARK</strong>. Meet your <strong className="text-purple-300">DOMO</strong> at <strong className="text-purple-300">SEEING</strong> to become a <strong className="text-amber-300">DORK</strong>. Outwit GOLIATH, elevate others, and gain <strong className="text-amber-400">Excellence</strong> to win!
            </p>
          </div>

          <GameLog logs={logs} />
        </div>

        {/* Center / Right: Interactive Board Track with Center Spinner */}
        <div className="w-full max-w-[560px] order-1 lg:order-2 flex flex-col items-center">
          <Board
            spaces={BOARD_SPACES}
            players={players}
            activePlayerId={activePlayer.id}
            centerContent={
              <Spinner
                onSpinComplete={handleSpinResult}
                disabled={isProcessingTurn || isCardModalOpen || isSeeingModalOpen || !!winner}
                activePlayerName={activePlayer.name}
                activePlayerColor={activePlayer.hex}
                isHuman={activePlayer.isHuman}
                autoSpin={!activePlayer.isHuman}
              />
            }
          />
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full max-w-4xl py-2 mt-2 text-center text-[10px] text-slate-500 border-t border-slate-900">
        <span>WE ARE DORK • 60–90 Second Interactive Board Game Proof • The ALLIANCE vs. GOLIATH</span>
      </footer>

      {/* MODALS */}
      {/* 1. Seeing / DOMO Transformation Modal */}
      {seeingPlayer && (
        <SeeingModal
          player={seeingPlayer}
          isOpen={isSeeingModalOpen}
          onContinue={handleContinueFromSeeing}
        />
      )}

      {/* 2. GOLIATH / ALLIANCE Card Modal */}
      <CardModal
        card={activeCard}
        activePlayer={activePlayer}
        isOpen={isCardModalOpen}
        onApply={handleApplyCard}
      />

      {/* 3. Victory Modal */}
      <WinModal
        winner={winner}
        isOpen={isWinModalOpen}
        onPlayAgain={handleRestart}
      />
    </div>
  );
}
