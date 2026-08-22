import { BoardSpace, GameCard, Player } from '../types';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 1,
    name: 'Player 1',
    isHuman: true,
    color: 'red',
    hex: '#ef4444',
    lightHex: '#fee2e2',
    borderHex: '#b91c1c',
    position: 0,
    pawnType: 'spark',
    excellence: 0,
    missNextTurn: false,
    shielded: false,
    lapsCompleted: 0,
    atPledgeWait: false,
  },
  {
    id: 2,
    name: 'Player 2',
    isHuman: false,
    color: 'blue',
    hex: '#3b82f6',
    lightHex: '#dbeafe',
    borderHex: '#1d4ed8',
    position: 0,
    pawnType: 'spark',
    excellence: 0,
    missNextTurn: false,
    shielded: false,
    lapsCompleted: 0,
    atPledgeWait: false,
  },
  {
    id: 3,
    name: 'Player 3',
    isHuman: false,
    color: 'green',
    hex: '#10b981',
    lightHex: '#d1fae5',
    borderHex: '#047857',
    position: 0,
    pawnType: 'spark',
    excellence: 0,
    missNextTurn: false,
    shielded: false,
    lapsCompleted: 0,
    atPledgeWait: false,
  },
  {
    id: 4,
    name: 'Player 4',
    isHuman: false,
    color: 'yellow',
    hex: '#f59e0b',
    lightHex: '#fef3c7',
    borderHex: '#b45309',
    position: 0,
    pawnType: 'spark',
    excellence: 0,
    missNextTurn: false,
    shielded: false,
    lapsCompleted: 0,
    atPledgeWait: false,
  },
];

/**
 * 40 Board Spaces (0 to 39)
 * 11x11 perimeter track:
 * - Space 0: SEEING
 * - First stretch: SHELTER BUILDS (2) → NUGGET (4) → THE WHY (5) → KERNEL (7) → ACADEMY (8)
 * - Space 10: PLEDGE (SPARK + DOMO → DORK)
 * - Space 12: HELP EMANCIPATE A TENANT
 * - Space 15: THE WHY (#2)
 * - Space 20: THE AGORA
 * - Space 23: HELP EMANCIPATE A TENANT
 * - Space 25: THE WHY (#3)
 * - Space 30: TAKE ANOTHER SPIN
 * - Space 35: THE WHY (#4)
 * - Space 37: RHYTHM
 * - Space 39: SPREZZATURA
 */
export const BOARD_SPACES: BoardSpace[] = [
  // Top Row (0 to 10)
  {
    id: 0,
    name: 'SEEING',
    type: 'start',
    isStart: true,
    description: 'Every player begins here as a SPARK.',
    colorClass: 'bg-emerald-700 text-white border-emerald-600',
  },
  {
    id: 1,
    name: 'MOVE AHEAD 1',
    subtitle: '+1 SPACE',
    type: 'normal',
    description: 'Move ahead 1 space.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 2,
    name: 'SHELTER BUILDS',
    type: 'milestone',
    description: 'Gain 1 Excellence.',
    colorClass: 'bg-indigo-700 text-white border-indigo-500',
  },
  {
    id: 3,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 4,
    name: 'NUGGET',
    type: 'milestone',
    description: 'Move ahead 1 space.',
    colorClass: 'bg-amber-600 text-white border-amber-400',
  },
  {
    id: 5,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'THE WHY',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 6,
    name: 'GAIN 1 EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain 1 Excellence.',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 7,
    name: 'KERNEL',
    type: 'milestone',
    description: 'Take another spin.',
    colorClass: 'bg-teal-600 text-white border-teal-400',
  },
  {
    id: 8,
    name: 'ACADEMY',
    type: 'milestone',
    description: 'Move ahead 2 spaces.',
    colorClass: 'bg-cyan-700 text-white border-cyan-400',
  },
  {
    id: 9,
    name: 'HELP ANOTHER PLAYER',
    subtitle: 'MOVE 1',
    type: 'help',
    description: 'Help another player move ahead 1 space.',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 10,
    name: 'PLEDGE',
    subtitle: 'SPARK + DOMO → DORK',
    type: 'milestone',
    isPledge: true,
    description: 'SPARK meets DOMO. Put on sunglasses and become a DORK! 😎',
    colorClass: 'bg-purple-600 text-white border-purple-400 shadow-lg',
  },

  // Right Column (11 to 20)
  {
    id: 11,
    name: 'MOVE AHEAD 2',
    subtitle: '+2 SPACES',
    type: 'normal',
    description: 'Move ahead 2 spaces.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 12,
    name: 'HELP EMANCIPATE A TENANT',
    type: 'help',
    description: 'Help emancipate a tenant: Both you and another player move forward 2 spaces.',
    colorClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60',
  },
  {
    id: 13,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 14,
    name: 'TAKE ANOTHER SPIN',
    type: 'normal',
    description: 'Take another spin.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 15,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'THE WHY',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 16,
    name: 'GAIN 1 EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain 1 Excellence.',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 17,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 18,
    name: 'HELP ANOTHER PLAYER',
    subtitle: '+2 TO TRAILING',
    type: 'help',
    description: 'Help the player furthest behind move ahead 2 spaces.',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 19,
    name: 'NICE SAVE',
    subtitle: 'MOVE AHEAD 2',
    type: 'normal',
    description: 'Move ahead 2 spaces.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 20,
    name: 'THE AGORA',
    type: 'milestone',
    description: 'Reach THE AGORA. Gain 1 Excellence.',
    colorClass: 'bg-indigo-700 text-white border-indigo-400 shadow-md',
  },

  // Bottom Row (21 to 30)
  {
    id: 21,
    name: 'MOVE AHEAD 1',
    subtitle: '+1 SPACE',
    type: 'normal',
    description: 'Move ahead 1 space.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 22,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 23,
    name: 'HELP EMANCIPATE A TENANT',
    type: 'help',
    description: 'Help emancipate a tenant: Both you and another player gain 1 Excellence.',
    colorClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60',
  },
  {
    id: 24,
    name: 'GAIN 1 EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain 1 Excellence.',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 25,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'THE WHY',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 26,
    name: 'TAKE ANOTHER SPIN',
    type: 'normal',
    description: 'Take another spin.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 27,
    name: 'MOVE AHEAD 3',
    subtitle: '+3 SPACES',
    type: 'normal',
    description: 'Move ahead 3 spaces.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 28,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 29,
    name: 'HELP ANOTHER PLAYER',
    subtitle: 'ALL MOVE +1',
    type: 'help',
    description: 'All players move forward 1 space.',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 30,
    name: 'TAKE ANOTHER SPIN',
    type: 'milestone',
    description: 'Take another spin.',
    colorClass: 'bg-cyan-700 text-white border-cyan-400',
  },

  // Left Column (31 to 39)
  {
    id: 31,
    name: 'MOVE AHEAD 1',
    subtitle: '+1 SPACE',
    type: 'normal',
    description: 'Move ahead 1 space.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 32,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 33,
    name: 'GAIN 1 EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain 1 Excellence.',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 34,
    name: 'HELP ANOTHER PLAYER',
    subtitle: '+2 TO FRIEND',
    type: 'help',
    description: 'Help another player move ahead 2 spaces.',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 35,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'THE WHY',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 36,
    name: 'TAKE ANOTHER SPIN',
    type: 'normal',
    description: 'Take another spin.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 37,
    name: 'RHYTHM',
    type: 'milestone',
    description: 'Move ahead 2 spaces.',
    colorClass: 'bg-sky-600 text-white border-sky-400 shadow-md',
  },
  {
    id: 38,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 39,
    name: 'SPREZZATURA',
    type: 'milestone',
    description: 'Gain 1 Excellence.',
    colorClass: 'bg-violet-600 text-white border-violet-400 shadow-md',
  },
];

/**
 * THE WHY positions on the 40-space board
 */
export const THE_WHY_POSITIONS = [5, 15, 25, 35];

/**
 * Finds the nearest backward THE WHY space from current position
 */
export function getBackwardWhyPosition(currentPos: number): number {
  const precedingWhys = THE_WHY_POSITIONS.filter((p) => p < currentPos);
  if (precedingWhys.length > 0) {
    return precedingWhys[precedingWhys.length - 1];
  }
  return currentPos === 0 ? 0 : 35;
}

export const GOLIATH_CARDS: GameCard[] = [
  {
    id: 'g1',
    type: 'goliath',
    title: 'UH-OH! YOUR WIRES GOT CROSSED.',
    description: 'Go backward until you reach THE WHY. Lose your next turn.',
    actionText: 'Go to THE WHY',
    icon: 'ZapOff',
    effect: (activePlayer, allPlayers) => {
      const whyPos = getBackwardWhyPosition(activePlayer.position);
      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            position: whyPos,
            missNextTurn: true,
          };
        }
        return p;
      });
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name}'s wires got crossed! Moved back to THE WHY (#${whyPos}) and loses next turn.`,
      };
    },
  },
  {
    id: 'g2',
    type: 'goliath',
    title: 'SLIDE BACK 3 SPACES',
    description: 'Slide backward 3 spaces.',
    actionText: 'Slide Back 3 Spaces',
    icon: 'Radio',
    effect: (activePlayer, allPlayers) => {
      const targetPos = Math.max(0, activePlayer.position - 3);
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, position: targetPos } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} slid back 3 spaces to #${targetPos}.`,
      };
    },
  },
  {
    id: 'g3',
    type: 'goliath',
    title: 'SWAP POSITIONS',
    description: 'Swap positions with the player furthest behind you.',
    actionText: 'Swap Positions',
    icon: 'ArrowLeftRight',
    effect: (activePlayer, allPlayers) => {
      const otherPlayers = allPlayers.filter((p) => p.id !== activePlayer.id);
      const minPos = Math.min(...otherPlayers.map((p) => p.position));
      const trailingPlayer = otherPlayers.find((p) => p.position === minPos);

      if (!trailingPlayer || trailingPlayer.position >= activePlayer.position) {
        return {
          updatedPlayers: allPlayers,
          message: `${activePlayer.name} was already in last place, so positions stayed the same.`,
        };
      }

      const activePos = activePlayer.position;
      const trailPos = trailingPlayer.position;

      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) return { ...p, position: trailPos };
        if (p.id === trailingPlayer.id) return { ...p, position: activePos };
        return p;
      });

      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} swapped positions with ${trailingPlayer.name}!`,
      };
    },
  },
  {
    id: 'g4',
    type: 'goliath',
    title: 'LOSE A TURN',
    description: 'Move back 1 space and lose your next turn.',
    actionText: 'Lose Next Turn',
    icon: 'Moon',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            position: Math.max(0, p.position - 1),
            missNextTurn: true,
          };
        }
        return p;
      });
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} moved back 1 space and loses their next turn.`,
      };
    },
  },
  {
    id: 'g5',
    type: 'goliath',
    title: 'DETOUR',
    description: 'Slide back 2 spaces. (If you are a DORK, you deflect 1 space and only move back 1!)',
    actionText: 'Move Backward',
    icon: 'BrainCircuit',
    effect: (activePlayer, allPlayers) => {
      const penalty = activePlayer.pawnType === 'dork' ? 1 : 2;
      const targetPos = Math.max(0, activePlayer.position - penalty);
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, position: targetPos } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} slid back ${penalty} space${penalty > 1 ? 's' : ''}.`,
      };
    },
  },
  {
    id: 'g6',
    type: 'goliath',
    title: 'EVERYBODY SLIDES BACK 1',
    description: 'All players move backward 1 space.',
    actionText: 'All Move Back 1',
    icon: 'Activity',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) => ({
        ...p,
        position: Math.max(0, p.position - 1),
      }));
      return {
        updatedPlayers: updated,
        message: `All players moved backward 1 space.`,
      };
    },
  },
  {
    id: 'g7',
    type: 'goliath',
    title: 'LOSE 1 EXCELLENCE',
    description: 'Lose 1 Excellence (minimum 0) and slide back 1 space.',
    actionText: 'Lose 1 Excellence',
    icon: 'Sparkles',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            excellence: Math.max(0, p.excellence - 1),
            position: Math.max(0, p.position - 1),
          };
        }
        return p;
      });
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} lost 1 Excellence and slid back 1 space.`,
      };
    },
  },
  {
    id: 'g8',
    type: 'goliath',
    title: 'PAUSE',
    description: 'Lose your next turn.',
    actionText: 'Skip Next Turn',
    icon: 'EyeOff',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, missNextTurn: true } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} loses their next turn.`,
      };
    },
  },
];

export const POSITIVE_CARDS: GameCard[] = [
  {
    id: 'p1',
    type: 'positive',
    title: 'HELP EMANCIPATE A TENANT',
    description: 'Both you and another player move forward 2 spaces.',
    actionText: 'Both Move Ahead 2',
    icon: 'Users',
    effect: (activePlayer, allPlayers, boardLength) => {
      const others = allPlayers.filter((p) => p.id !== activePlayer.id);
      const lowest = [...others].sort((a, b) => a.position - b.position)[0];
      const targetId = lowest ? lowest.id : (activePlayer.id % 4) + 1;

      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            position: (p.position + 2) % boardLength,
          };
        }
        if (p.id === targetId) {
          return {
            ...p,
            position: (p.position + 2) % boardLength,
          };
        }
        return p;
      });

      const helpedName = lowest ? lowest.name : 'a player';
      return {
        updatedPlayers: updated,
        message: `Both ${activePlayer.name} and ${helpedName} moved forward 2 spaces.`,
      };
    },
  },
  {
    id: 'p2',
    type: 'positive',
    title: 'HELP ANOTHER PLAYER',
    description: 'Help the player furthest behind move forward 3 spaces. Gain 1 Excellence.',
    actionText: 'Help Player (+1 ⭐)',
    icon: 'HeartHandshake',
    effect: (activePlayer, allPlayers, boardLength) => {
      const others = allPlayers.filter((p) => p.id !== activePlayer.id);
      const lowest = [...others].sort((a, b) => a.position - b.position)[0];
      const targetId = lowest ? lowest.id : (activePlayer.id % 4) + 1;

      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return { ...p, excellence: p.excellence + 1 };
        }
        if (p.id === targetId) {
          return { ...p, position: (p.position + 3) % boardLength };
        }
        return p;
      });

      const helpedName = lowest ? lowest.name : 'a player';
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} helped ${helpedName} move ahead 3 spaces and gained 1 Excellence.`,
      };
    },
  },
  {
    id: 'p3',
    type: 'positive',
    title: 'ALL PLAYERS MOVE AHEAD 1',
    description: 'Every player on the board advances 1 space. Gain 1 Excellence.',
    actionText: 'All Move Ahead (+1 ⭐)',
    icon: 'HandMetal',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) => ({
        ...p,
        position: (p.position + 1) % boardLength,
        excellence: p.id === activePlayer.id ? p.excellence + 1 : p.excellence,
      }));
      return {
        updatedPlayers: updated,
        message: `All players moved ahead 1 space! ${activePlayer.name} gained 1 Excellence.`,
      };
    },
  },
  {
    id: 'p4',
    type: 'positive',
    title: 'YOUR DOMO CAUGHT THAT',
    description: 'Move ahead 2 spaces.',
    actionText: 'Move Ahead 2',
    icon: 'Glasses',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, position: (p.position + 2) % boardLength }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `Your DOMO caught that! ${activePlayer.name} moved ahead 2 spaces.`,
      };
    },
  },
  {
    id: 'p5',
    type: 'positive',
    title: 'NICE SAVE',
    description: 'Protect yourself from the next GOLIATH card.',
    actionText: 'Gain Protection',
    icon: 'ShieldCheck',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, shielded: true }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `Nice save! ${activePlayer.name} is protected from the next GOLIATH card.`,
      };
    },
  },
  {
    id: 'p6',
    type: 'positive',
    title: 'TAKE ANOTHER SPIN',
    description: 'Move ahead 1 space and take another spin.',
    actionText: 'Move 1 & Spin',
    icon: 'Zap',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, position: (p.position + 1) % boardLength }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} moved ahead 1 space and gets another spin.`,
      };
    },
  },
  {
    id: 'p7',
    type: 'positive',
    title: 'GAIN 1 EXCELLENCE',
    description: 'Gain 1 Excellence.',
    actionText: 'Gain 1 Excellence (+1 ⭐)',
    icon: 'Award',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, excellence: p.excellence + 1 } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} gained 1 Excellence.`,
      };
    },
  },
  {
    id: 'p8',
    type: 'positive',
    title: 'HELP ANOTHER PLAYER',
    description: 'Choose another player: both of you move forward 2 spaces.',
    actionText: 'Both Move 2 Spaces',
    icon: 'Flame',
    effect: (activePlayer, allPlayers, boardLength) => {
      const others = allPlayers.filter((p) => p.id !== activePlayer.id);
      const lowest = [...others].sort((a, b) => a.position - b.position)[0];
      const targetId = lowest ? lowest.id : (activePlayer.id % 4) + 1;

      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id || p.id === targetId) {
          return {
            ...p,
            position: (p.position + 2) % boardLength,
          };
        }
        return p;
      });

      const helpedName = lowest ? lowest.name : 'a player';
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} and ${helpedName} both moved forward 2 spaces.`,
      };
    },
  },
];
