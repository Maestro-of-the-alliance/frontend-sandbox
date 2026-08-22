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
import { OpportunityModal } from './components/OpportunityModal';
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
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState<boolean>(false);
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
    setIsOpportunityModalOpen(false);
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
      } auto bot${4 - selectedCount !== 1 ? 's' : ''}.`
    );
  };

  // Quick reset game (keeps current player mode)
  const handleQuickRestart = () => {
    handleStartGame(humanCount);
  };

  // Open Restart Setup
  const handleOpenRestartSetup = () => {
    setIsPaused(false);
    setIsRestartSetup(true);
    setIsSetupModalOpen(true);
  };

  // Advance turn to next player
  const advanceTurn = useCallback(() => {
    setIsProcessingTurn(false);
    setActivePlayerIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % players.length;
      const nextPlayer = players[nextIndex];

      // Check if next player is asleep / misses turn
      if (nextPlayer.missNextTurn) {
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === nextIndex ? { ...p, missNextTurn: false } : p
          )
        );
        addLog(`💤 ${nextPlayer.name} misses their turn.`, 'hazard');
        setTurnMessage(`💤 ${nextPlayer.name} misses this turn.`);

        // Skip to player after next
        setTimeout(() => {
          advanceTurn();
        }, 1500);
        return nextIndex;
      }

      setTurnMessage(
        nextPlayer.isHuman
          ? `${nextPlayer.name}'s turn — Click SPIN!`
          : `${nextPlayer.name} (Auto Bot) is spinning...`
      );
      return nextIndex;
    });
  }, [players, addLog]);

  // Handle Spinner outcome
  const handleSpinResult = (result: SpinResult) => {
    if (isProcessingTurn || winner || isPaused) return;
    setIsProcessingTurn(true);

    if (result === 'goliath') {
      sound.playGoliathAlarm();
      addLog(`🚨 ${activePlayer.name} spun GOLIATH! Draw a hazard card!`, 'hazard');
      setTurnMessage(`🚨 ${activePlayer.name} hit GOLIATH! Drawing hazard...`);
      const randomCard = GOLIATH_CARDS[Math.floor(Math.random() * GOLIATH_CARDS.length)];
      setActiveCard(randomCard);
      setIsCardModalOpen(true);
      return;
    }

    // Numerical move (1, 2, 3, or 4)
    const steps = Number(result);
    sound.playHop();
    addLog(`🎲 ${activePlayer.name} spun ${steps}. Moving forward ${steps} space${steps > 1 ? 's' : ''}.`);
    setTurnMessage(`🎲 ${activePlayer.name} spun ${steps} — moving ${steps} space${steps > 1 ? 's' : ''}...`);

    handleMovePlayer(steps);
  };

  // Move player along perimeter track
  const handleMovePlayer = (steps: number) => {
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
              excellence: p.excellence + 1,
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

    // Update state position
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

    // Check Win Condition: Completed circuit + at least 2 Excellence as DORK
    if (completedLap || (newLaps >= 1 && finalPos >= 0)) {
      if (activePlayer.excellence >= 2 && activePlayer.pawnType === 'dork') {
        const victoriousPlayer = {
          ...activePlayer,
          position: finalPos,
          lapsCompleted: newLaps,
        };
        setWinner(victoriousPlayer);
        setIsWinModalOpen(true);
        addLog(`🏆 ${activePlayer.name} WON THE GAME by increasing the measure of excellence!`, 'win');
        return;
      } else if (completedLap && activePlayer.excellence < 2) {
        // Final Opportunity Mechanic: Completing a lap does NOT grant automatic Excellence.
        // Instead, the player gets a final opportunity to help another or draw a card!
        addLog(`${activePlayer.name} completed the lap but needs 2 Excellence. Final opportunity triggered!`);
        setTurnMessage(`🌟 ${activePlayer.name} completed the lap! Final opportunity to gain Excellence.`);
        setIsOpportunityModalOpen(true);
        return;
      }
    }

    // Resolve landing on space
    resolveSpaceLanding(spaceData, finalPos);
  };

  // Final Opportunity: Option A - Help another player
  const handleOpportunityHelp = () => {
    setIsOpportunityModalOpen(false);
    const others = players.filter((p) => p.id !== activePlayer.id);
    const lowest = [...others].sort((a, b) => a.position - b.position)[0];
    const targetId = lowest ? lowest.id : (activePlayer.id % 4) + 1;

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === activePlayer.id) {
          return { ...p, excellence: p.excellence + 1 };
        }
        if (p.id === targetId) {
          return { ...p, position: (p.position + 2) % BOARD_SPACES.length };
        }
        return p;
      })
    );

    const helpedName = lowest ? lowest.name : 'a player';
    sound.playExcellenceChime();
    addLog(`⭐ ${activePlayer.name} helped ${helpedName} move +2 and earned +1 EXCELLENCE!`, 'help');
    setTurnMessage(`⭐ ${activePlayer.name} helped ${helpedName} and gained 1 Excellence!`);

    // Re-check win condition after gaining Excellence
    if (activePlayer.excellence + 1 >= 2 && activePlayer.pawnType === 'dork') {
      setTimeout(() => {
        const victoriousPlayer = {
          ...activePlayer,
          excellence: activePlayer.excellence + 1,
        };
        setWinner(victoriousPlayer);
        setIsWinModalOpen(true);
        addLog(`🏆 ${activePlayer.name} WON THE GAME by increasing the measure of excellence!`, 'win');
      }, 1200);
      return;
    }

    setTimeout(() => advanceTurn(), 2200);
  };

  // Final Opportunity: Option B - Draw an action card
  const handleOpportunityDraw = () => {
    setIsOpportunityModalOpen(false);
    const randomPositive = POSITIVE_CARDS[Math.floor(Math.random() * POSITIVE_CARDS.length)];
    setActiveCard(randomPositive);
    setIsCardModalOpen(true);
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
      // THE AGORA
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
      addLog(`⚡ ${activePlayer.name} hit RHYTHM and moved +2 spaces forward!`);
      setTurnMessage(`⚡ ${activePlayer.name} hit RHYTHM — +2 spaces!`);
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
      addLog(`🔥 ${activePlayer.name} reached SPREZZATURA (+1 EXCELLENCE)!`, 'help');
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
      addLog(`⏩ ${activePlayer.name} moved ahead 1 space.`);
      setTurnMessage(`⏩ ${activePlayer.name} stepped forward 1 space.`);
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

    if (space.id === 2 || space.id === 8 || space.id === 11 || space.id === 19 || space.id === 27) {
      // Milestone or surge spaces
      if (space.id === 2) {
        sound.playExcellenceChime();
        addLog(`⭐ ${activePlayer.name} reached SHELTER BUILDS (+1 EXCELLENCE)!`, 'help');
        setTurnMessage(`⭐ ${activePlayer.name} reached SHELTER BUILDS (+1 EXCELLENCE)!`);
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, excellence: p.excellence + 1 } : p
          )
        );
        setTimeout(() => advanceTurn(), 2200);
        return;
      }

      const advanceAmt = space.id === 27 ? 3 : 2;
      addLog(`⏩ ${activePlayer.name} moved ahead ${advanceAmt} spaces.`);
      setTurnMessage(`⏩ ${activePlayer.name} moved ahead ${advanceAmt} spaces.`);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, position: (p.position + advanceAmt) % BOARD_SPACES.length }
            : p
        )
      );
      setTimeout(() => advanceTurn(), 2000);
      return;
    }

    // Default: End turn and proceed
    setTimeout(() => {
      advanceTurn();
    }, 1800);
  };

  // Apply Card Modal action
  const handleApplyCard = () => {
    if (!activeCard) return;

    // Check if player is protected from Goliath
    if (activeCard.type === 'goliath' && activePlayer.shielded) {
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, shielded: false } : p
        )
      );
      addLog(`🛡️ ${activePlayer.name}'s shield absorbed the GOLIATH card!`, 'help');
      setTurnMessage(`🛡️ Shield protected ${activePlayer.name}!`);
      setIsCardModalOpen(false);
      setActiveCard(null);
      setTimeout(() => advanceTurn(), 2000);
      return;
    }

    // Execute effect function
    const result = activeCard.effect(
      activePlayer,
      players,
      BOARD_SPACES.length
    );

    setPlayers(result.updatedPlayers);
    addLog(result.message, activeCard.type === 'goliath' ? 'hazard' : 'help');
    setTurnMessage(result.message);

    setIsCardModalOpen(false);
    setActiveCard(null);

    // Check if player gained enough Excellence to win after positive card
    const updatedActive = result.updatedPlayers.find((p) => p.id === activePlayer.id);
    if (
      updatedActive &&
      updatedActive.lapsCompleted >= 1 &&
      updatedActive.excellence >= 2 &&
      updatedActive.pawnType === 'dork'
    ) {
      setWinner(updatedActive);
      setIsWinModalOpen(true);
      addLog(`🏆 ${updatedActive.name} WON THE GAME by increasing the measure of excellence!`, 'win');
      return;
    }

    setTimeout(() => advanceTurn(), 2200);
  };

  // Continue from Pledge Modal
  const handleContinueFromPledge = () => {
    setIsPledgeModalOpen(false);
    setPledgePlayer(null);
    setTimeout(() => advanceTurn(), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-3 sm:px-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-lg mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-amber-300">
            <Glasses className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5 leading-none">
              WE ARE DORK
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DEMO
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              The ALLIANCE vs. GOLIATH Board Game
            </p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1.5">
          {/* Pause / Resume Button */}
          <button
            id="header-pause-btn"
            onClick={handleTogglePause}
            disabled={isSetupModalOpen || isWinModalOpen}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
              isPaused
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isPaused ? 'Resume Match' : 'Pause Match'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-slate-950" /> : <Pause className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Change Setup / Restart */}
          <button
            id="header-players-setup-btn"
            onClick={handleOpenRestartSetup}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Configure Player Count / Restart"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{humanCount}P Setup</span>
          </button>

          {/* Mute toggle */}
          <button
            id="header-mute-btn"
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Quick Restart */}
          <button
            id="header-restart-btn"
            onClick={handleQuickRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Restart Match"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="w-full max-w-5xl flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-3">
        {/* Left Column: Player Roster + Event Match Feed */}
        <div className="w-full lg:w-80 flex flex-col gap-2.5 order-2 lg:order-1">
          <PlayerRoster
            players={players}
            activePlayerId={activePlayer.id}
            onToggleHuman={handleToggleHuman}
            humanCount={humanCount}
            onSetHumanCount={handleSetHumanCount}
            disabled={isProcessingTurn || isPaused}
          />

          {/* Game Objective Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300">
            <div className="font-black text-amber-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Goal of the Game</span>
              <span className="text-[10px] text-slate-400">2 ⭐ & 1 Lap</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Start at <strong className="text-emerald-300">SEEING</strong> as a <strong className="text-slate-200">SPARK</strong>. Reach <strong className="text-purple-300">PLEDGE</strong> to meet your <strong className="text-purple-300">DOMO</strong> & become a <strong className="text-amber-300">DORK</strong> 😎. Avoid GOLIATH setbacks, help others, and gain <strong className="text-amber-400">Excellence</strong>!
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
                  isOpportunityModalOpen ||
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

      {/* 2. Final Opportunity Modal */}
      <OpportunityModal
        player={activePlayer}
        isOpen={isOpportunityModalOpen}
        onHelpOther={handleOpportunityHelp}
        onDrawCard={handleOpportunityDraw}
      />

      {/* 3. GOLIATH / ALLIANCE Card Modal */}
      <CardModal
        card={activeCard}
        activePlayer={activePlayer}
        isOpen={isCardModalOpen}
        onApply={handleApplyCard}
      />

      {/* 4. Victory Modal */}
      <WinModal
        winner={winner}
        isOpen={isWinModalOpen}
        onPlayAgain={handleOpenRestartSetup}
      />
    </div>
  );
}
