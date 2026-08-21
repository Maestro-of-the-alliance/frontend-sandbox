/**
 * WE ARE DORK — Quick-Play Web Demo
 * The ALLIANCE vs. GOLIATH Family Board Game
 */

import React, { useState, useCallback } from 'react';
import {
  Player,
  SpinResult,
  GameCard,
  TurnLog,
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
import { PledgeModal } from './components/PledgeModal';
import { CardModal } from './components/CardModal';
import { WinModal } from './components/WinModal';
import { SetupModal } from './components/SetupModal';
import { PauseModal } from './components/PauseModal';
import { GameLog } from './components/GameLog';
import { sound } from './utils/audio';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Glasses,
  Info,
  Pause,
  Play,
  Users,
} from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [activeCard, setActiveCard] = useState<GameCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState<boolean>(false);
  const [pledgePlayer, setPledgePlayer] = useState<Player | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isWinModalOpen, setIsWinModalOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<TurnLog[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [humanCount, setHumanCount] = useState<number>(1);
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [turnMessage, setTurnMessage] = useState<string>('Select players to begin!');

  // Player Setup Modal & Mid-game Pause
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(true);
  const [isRestartSetup, setIsRestartSetup] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

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

  // Toggle Mid-Game Pause
  const handleTogglePause = () => {
    if (isSetupModalOpen || isWinModalOpen) return;
    setIsPaused((prev) => !prev);
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

  // Start or Restart Game with selected player count
  const handleStartGame = (selectedCount: number) => {
    setHumanCount(selectedCount);
    setPlayers(
      INITIAL_PLAYERS.map((p, idx) => ({
        ...p,
        isHuman: idx < selectedCount,
        position: 0,
        pawnType: 'spark',
        excellence: 0,
        missNextTurn: false,
        shielded: false,
        lapsCompleted: 0,
        atPledgeWait: false,
      }))
    );
    setActivePlayerIndex(0);
    setActiveCard(null);
    setIsCardModalOpen(false);
    setIsPledgeModalOpen(false);
    setPledgePlayer(null);
    setWinner(null);
    setIsWinModalOpen(false);
    setIsProcessingTurn(false);
    setIsPaused(false);
    setIsSetupModalOpen(false);
    setIsRestartSetup(false);

    const firstIsHuman = 0 < selectedCount;
    setTurnMessage(
      firstIsHuman
        ? `${INITIAL_PLAYERS[0].name}'s turn — Click SPIN!`
        : `${INITIAL_PLAYERS[0].name} (Auto Bot) is spinning...`
    );
    setLogs([]);
    addLog(
      `Game started with ${selectedCount} human player${selectedCount > 1 ? 's' : ''} and ${
        4 - selectedCount
      } auto-bot${4 - selectedCount !== 1 ? 's' : ''}. Every player begins at SEEING as a SPARK!`
    );
  };

  // Prompt restart setup modal
  const handleOpenRestartSetup = () => {
    setIsPaused(false);
    setIsRestartSetup(true);
    setIsSetupModalOpen(true);
  };

  // Quick Restart without changing player count
  const handleQuickRestart = () => {
    handleStartGame(humanCount);
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
      setTurnMessage(`⏳ ${nextPlayer.name} is paused by GOLIATH and skips this turn.`);
      setPlayers((prev) =>
        prev.map((p, idx) => (idx === nextIdx ? { ...p, missNextTurn: false } : p))
      );
      setTimeout(() => {
        advanceTurn((nextIdx + 1) % players.length);
      }, 2200);
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
      setTurnMessage(`⚠ ${activePlayer.name} spun GOLIATH!`);
      
      // Check if player has active shield
      if (activePlayer.shielded) {
        sound.playExcellenceChime();
        addLog(`🛡️ ALLIANCE SHIELD protected ${activePlayer.name} from GOLIATH's hazard!`, 'help');
        setTurnMessage(`🛡️ ALLIANCE SHIELD protected ${activePlayer.name}!`);
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, shielded: false } : p
          )
        );
        setTimeout(() => {
          advanceTurn();
        }, 2200);
        return;
      }

      // Pick a random Goliath card
      const randomCard = GOLIATH_CARDS[Math.floor(Math.random() * GOLIATH_CARDS.length)];
      setActiveCard(randomCard);
      setIsCardModalOpen(true);
      return;
    }

    // 2. NUMERIC SPIN RESULT (1, 2, 3, or 4)
    const moveSteps = result as number;
    addLog(`${activePlayer.name} spun a ${moveSteps}.`);
    setTurnMessage(`🎲 ${activePlayer.name} spun a ${moveSteps} — Moving forward!`);
    executeMovement(moveSteps);
  };

  // Perform movement along track (40 spaces)
  const executeMovement = (steps: number) => {
    const currentPos = activePlayer.position;
    const boardLength = BOARD_SPACES.length; // 40
    const isSpark = activePlayer.pawnType === 'spark';

    // Transformation at PLEDGE (Space 10) for Sparks!
    if (isSpark && currentPos < 10 && currentPos + steps >= 10) {
      const pledgePos = 10;
      sound.playSeeingTransformation();

      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              position: pledgePos,
              pawnType: 'dork',
              excellence: p.excellence + 1, // Bonus for finding DOMO & taking Pledge
            };
          }
          return p;
        })
      );

      const transformedPlayer: Player = {
        ...activePlayer,
        position: pledgePos,
        pawnType: 'dork',
        excellence: activePlayer.excellence + 1,
      };

      setPledgePlayer(transformedPlayer);
      setIsPledgeModalOpen(true);
      addLog(`✨ ${activePlayer.name} reached PLEDGE, joined DOMO, and became a DORK! 😎`, 'transformation');
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
          };
        }
        return p;
      })
    );

    const spaceData = BOARD_SPACES[finalPos];
    sound.playHop();

    // Check Win Condition (Completed circuit + at least 2 Excellence as DORK)
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
        addLog(`🏆 ${activePlayer.name} WON THE GAME by increasing the measure of excellence!`, 'win');
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
      setTurnMessage(`⭐ ${activePlayer.name} landed on ${space.name} (+1 EXCELLENCE)!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
        )
      );
      setTimeout(() => advanceTurn(), 2200);
      return;
    }

    // 4. Milestone spaces
    if (space.id === 20) {
      // THE AGORA (Corner 3)
      sound.playExcellenceChime();
      addLog(`🏛️ ${activePlayer.name} reached THE AGORA (+1 EXCELLENCE)!`, 'help');
      setTurnMessage(`🏛️ ${activePlayer.name} entered THE AGORA (+1 EXCELLENCE)!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
        )
      );
      setTimeout(() => advanceTurn(), 2200);
      return;
    }

    if (space.id === 37) {
      // RHYTHM
      sound.playHop();
      addLog(`⚡ ${activePlayer.name} hit RHYTHM momentum and surged +2 spaces forward!`);
      setTurnMessage(`⚡ ${activePlayer.name} hit RHYTHM — +2 spaces surge!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, position: (p.position + 2) % BOARD_SPACES.length }
            : p
        )
      );
      setTimeout(() => advanceTurn(), 2200);
      return;
    }

    if (space.id === 39) {
      // SPREZZATURA
      sound.playExcellenceChime();
      addLog(`🔥 ${activePlayer.name} reached SPREZZATURA effortless mastery (+1 EXCELLENCE)!`, 'help');
      setTurnMessage(`🔥 ${activePlayer.name} reached SPREZZATURA (+1 EXCELLENCE)!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
        )
      );
      setTimeout(() => advanceTurn(), 2200);
      return;
    }

    if (space.id === 7 || space.id === 14 || space.id === 26 || space.id === 30 || space.id === 36) {
      // Extra Spin spaces
      addLog(`🎲 ${activePlayer.name} earned an extra spin!`);
      setIsProcessingTurn(false);
      setTurnMessage(`🎲 ${activePlayer.name} earned an extra spin!`);
      return;
    }

    if (space.id === 1 || space.id === 4 || space.id === 21 || space.id === 31) {
      // Move Ahead 1
      addLog(`⏩ ${activePlayer.name} moved ahead 1 extra space.`);
      setTurnMessage(`⏩ ${activePlayer.name} stepped forward 1 extra space.`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, position: (p.position + 1) % BOARD_SPACES.length }
            : p
        )
      );
      setTimeout(() => advanceTurn(), 2000);
      return;
    }

    if (space.id === 8 || space.id === 11 || space.id === 19) {
      // Move Ahead 2
      addLog(`⏩ ${activePlayer.name} moved ahead 2 extra spaces.`);
      setTurnMessage(`⏩ ${activePlayer.name} surged ahead 2 extra spaces!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, position: (p.position + 2) % BOARD_SPACES.length }
            : p
        )
      );
      setTimeout(() => advanceTurn(), 2000);
      return;
    }

    if (space.id === 27) {
      // Move Ahead 3
      addLog(`🚀 ${activePlayer.name} surged ahead 3 extra spaces!`);
      setTurnMessage(`🚀 ${activePlayer.name} surged ahead 3 extra spaces!`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, position: (p.position + 3) % BOARD_SPACES.length }
            : p
        )
      );
      setTimeout(() => advanceTurn(), 2000);
      return;
    }

    // Normal space -> advance turn
    setTimeout(() => {
      advanceTurn();
    }, 1800);
  };

  // Close card modal & apply card effect
  const handleApplyCard = () => {
    if (!activeCard) return;

    const result = activeCard.effect(activePlayer, players, BOARD_SPACES.length);
    setPlayers(result.updatedPlayers);
    addLog(result.message, activeCard.type === 'goliath' ? 'goliath' : 'help');
    setTurnMessage(result.message);

    setIsCardModalOpen(false);
    setActiveCard(null);

    // Check if anyone won from this effect
    const potentialWinner = result.updatedPlayers.find(
      (p) => p.excellence >= 2 && p.pawnType === 'dork' && p.lapsCompleted >= 1
    );

    if (potentialWinner) {
      setWinner(potentialWinner);
      setIsWinModalOpen(true);
      return;
    }

    setTimeout(() => {
      advanceTurn();
    }, 1800);
  };

  // Close pledge modal & continue
  const handleContinueFromPledge = () => {
    setIsPledgeModalOpen(false);
    setPledgePlayer(null);
    setTimeout(() => {
      advanceTurn();
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl mb-2 shadow-md">
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
                40 Spaces
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              The ALLIANCE vs. GOLIATH Family Board Game
            </p>
          </div>
        </div>

        {/* Header Controls: Pause, Players/Restart, Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mid-Game Pause Button */}
          <button
            id="pause-toggle-btn"
            onClick={handleTogglePause}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              isPaused
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-slate-950" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          {/* Player Setup / Restart Button */}
          <button
            id="restart-game-btn"
            onClick={handleOpenRestartSetup}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-700 transition-colors cursor-pointer"
            title="Choose number of players / Restart match"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">RESTART</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Game Layout Container */}
      <main className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-4 flex-1">
        {/* Left / Top: Player Roster & Quick Log */}
        <div className="w-full lg:w-72 flex flex-col gap-2.5 order-2 lg:order-1">
          <PlayerRoster
            players={players}
            activePlayerId={activePlayer.id}
            onToggleHuman={handleToggleHuman}
            humanCount={humanCount}
            onSetHumanCount={handleSetHumanCount}
            disabled={isProcessingTurn || isCardModalOpen || isPledgeModalOpen || isPaused || isSetupModalOpen}
          />

          {/* Quick Context / Instruction Hint */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300">
            <div className="flex items-center justify-between font-bold text-amber-400 mb-1">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>HOW TO PLAY</span>
              </div>
              <button
                onClick={handleOpenRestartSetup}
                className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Users className="w-3 h-3" />
                <span>Players</span>
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Start at <strong className="text-emerald-300">SEEING</strong> as a <strong className="text-slate-200">SPARK</strong>. Reach <strong className="text-purple-300">PLEDGE</strong> to meet your <strong className="text-purple-300">DOMO</strong> & become a <strong className="text-amber-300">DORK</strong> 😎. Avoid GOLIATH setbacks, elevate others, and gain <strong className="text-amber-400">Excellence</strong>!
            </p>
          </div>

          <GameLog logs={logs} />
        </div>

        {/* Center / Right: Interactive Board Track with Center Spinner */}
        <div className="w-full max-w-[580px] order-1 lg:order-2 flex flex-col items-center gap-2">
          {/* Prominent Current Action & Explanation Banner */}
          <div className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 shadow-md">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-ping"
                style={{ backgroundColor: activePlayer.hex }}
              />
              <span className="truncate">{turnMessage}</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0 ml-2">
              Space #{activePlayer.position}
            </span>
          </div>

          <Board
            spaces={BOARD_SPACES}
            players={players}
            activePlayerId={activePlayer.id}
            centerContent={
              <Spinner
                onSpinComplete={handleSpinResult}
                disabled={
                  isProcessingTurn ||
                  isCardModalOpen ||
                  isPledgeModalOpen ||
                  !!winner ||
                  isPaused ||
                  isSetupModalOpen
                }
                activePlayerName={activePlayer.name}
                activePlayerColor={activePlayer.hex}
                isHuman={activePlayer.isHuman}
                autoSpin={!activePlayer.isHuman && !isPaused && !isSetupModalOpen}
              />
            }
          />
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full max-w-5xl py-2 mt-2 text-center text-[10px] text-slate-500 border-t border-slate-900">
        <span>WE ARE DORK • Quick-Play Web Demo • The ALLIANCE vs. GOLIATH</span>
      </footer>

      {/* MODALS */}
      {/* 0. Initial Start & Restart Player Count Selection Modal */}
      <SetupModal
        isOpen={isSetupModalOpen}
        currentHumanCount={humanCount}
        onStartGame={handleStartGame}
        isRestart={isRestartSetup}
      />

      {/* Mid-Game Pause Modal */}
      <PauseModal
        isOpen={isPaused && !isSetupModalOpen && !isWinModalOpen}
        onResume={() => setIsPaused(false)}
        onOpenSetup={handleOpenRestartSetup}
        onQuickRestart={handleQuickRestart}
        players={players}
        activePlayer={activePlayer}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 1. Pledge / DOMO Transformation Modal */}
      {pledgePlayer && (
        <PledgeModal
          player={pledgePlayer}
          isOpen={isPledgeModalOpen}
          onContinue={handleContinueFromPledge}
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
        onPlayAgain={handleOpenRestartSetup}
      />
    </div>
  );
}
