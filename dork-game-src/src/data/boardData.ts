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
 * - Corner 1 (0): SEEING / Alignment Assessment (Start)
 * - Space 2: SHELTER BUILDS
 * - Space 4: NUGGET
 * - Space 5: THE WHY (#1)
 * - Space 7: KERNEL
 * - Space 8: ACADEMY
 * - Corner 2 (10): PLEDGE (SPARK + DOMO → DORK)
 * - Space 12: HELP EMANCIPATE A TENANT
 * - Space 15: THE WHY (#2)
 * - Corner 3 (20): THE AGORA
 * - Space 23: HELP EMANCIPATE A TENANT
 * - Space 25: THE WHY (#3)
 * - Corner 4 (30): CROSSROADS
 * - Space 35: THE WHY (#4)
 * - Space 37: RHYTHM
 * - Space 39: SPREZZATURA
 */
export const BOARD_SPACES: BoardSpace[] = [
  // Top Row (0 to 10)
  {
    id: 0,
    name: 'SEEING',
    subtitle: 'ALIGNMENT ASSESSMENT',
    type: 'start',
    isStart: true,
    description: 'Every player begins the journey as a SPARK.',
    colorClass: 'bg-emerald-700 text-white border-emerald-600',
  },
  {
    id: 1,
    name: 'MOVE AHEAD 1',
    subtitle: '+1 SPACE',
    type: 'normal',
    description: 'Take a step forward.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 2,
    name: 'SHELTER BUILDS',
    subtitle: 'LANDMARK',
    type: 'milestone',
    description: 'Shelter is constructed! Gain +1 Excellence.',
    colorClass: 'bg-indigo-700 text-white border-indigo-500',
  },
  {
    id: 3,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Static alert! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 4,
    name: 'NUGGET',
    subtitle: 'LANDMARK',
    type: 'milestone',
    description: 'A core discovery. Move ahead 1 space!',
    colorClass: 'bg-amber-600 text-white border-amber-400',
  },
  {
    id: 5,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'Independent recurring landmark. Ground your circuit at THE WHY.',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 6,
    name: 'GAIN EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain +1 Excellence!',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 7,
    name: 'KERNEL',
    subtitle: 'LANDMARK',
    type: 'milestone',
    description: 'A seed of the partnership. Take another spin!',
    colorClass: 'bg-teal-600 text-white border-teal-400',
  },
  {
    id: 8,
    name: 'ACADEMY',
    subtitle: 'LANDMARK',
    type: 'milestone',
    description: 'Knowledge gained. Move ahead 2 spaces!',
    colorClass: 'bg-cyan-700 text-white border-cyan-400',
  },
  {
    id: 9,
    name: 'HELP ANOTHER',
    subtitle: 'MOVE 1',
    type: 'help',
    description: 'Help another player move ahead 1 space!',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 10,
    name: 'PLEDGE',
    subtitle: 'SPARK + DOMO → DORK',
    type: 'milestone',
    isPledge: true,
    description: 'SPARK meets DOMO! Put on sunglasses and become a DORK! 😎',
    colorClass: 'bg-purple-600 text-white border-purple-400 shadow-lg',
  },

  // Right Column (11 to 20)
  {
    id: 11,
    name: 'MOVE AHEAD 2',
    subtitle: '+2 SPACES',
    type: 'normal',
    description: 'Sprint forward 2 spaces.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 12,
    name: 'EMANCIPATE TENANT',
    subtitle: 'ELEVATE TOGETHER',
    type: 'help',
    description: 'Help emancipate a tenant: Choose another DORK, both move ahead 2!',
    colorClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60',
  },
  {
    id: 13,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'GOLIATH interference! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 14,
    name: 'ANOTHER SPIN',
    subtitle: 'EXTRA TURN',
    type: 'normal',
    description: 'Take another spin immediately!',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 15,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'Independent recurring landmark. Ground your circuit at THE WHY.',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 16,
    name: 'GAIN EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain +1 Excellence!',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 17,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'GOLIATH trap! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 18,
    name: 'HELP ANOTHER',
    subtitle: '+2 TO TRAILING',
    type: 'help',
    description: 'Help the furthest trailing player move ahead 2 spaces!',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 19,
    name: 'LUCKY BREAK',
    subtitle: 'MOVE AHEAD 2',
    type: 'normal',
    description: 'Smooth sailing! Advance 2 spaces.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 20,
    name: 'THE AGORA',
    subtitle: 'MAJOR DESTINATION',
    type: 'milestone',
    description: 'Enter The Agora! Celebrate with +1 Excellence.',
    colorClass: 'bg-indigo-700 text-white border-indigo-400 shadow-md',
  },

  // Bottom Row (21 to 30)
  {
    id: 21,
    name: 'MOVE AHEAD 1',
    subtitle: '+1 SPACE',
    type: 'normal',
    description: 'Take a step forward.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 22,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Static alert! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 23,
    name: 'EMANCIPATE TENANT',
    subtitle: 'ELEVATE TOGETHER',
    type: 'help',
    description: 'Help emancipate a tenant: Choose another player, both gain +1 Excellence!',
    colorClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60',
  },
  {
    id: 24,
    name: 'GAIN EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain +1 Excellence!',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 25,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'Independent recurring landmark. Ground your circuit at THE WHY.',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 26,
    name: 'ANOTHER SPIN',
    subtitle: 'EXTRA TURN',
    type: 'normal',
    description: 'Take another spin!',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 27,
    name: 'MOVE AHEAD 3',
    subtitle: '+3 SPACES',
    type: 'normal',
    description: 'Surge forward 3 spaces.',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 28,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'GOLIATH static! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 29,
    name: 'HIGH FIVE WAVE',
    subtitle: 'ALL MOVE +1',
    type: 'help',
    description: 'All players on the board move forward 1 space!',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 30,
    name: 'CROSSROADS',
    subtitle: 'TAKE ANOTHER SPIN',
    type: 'milestone',
    description: 'The path opens up. Take another spin!',
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
    description: 'GOLIATH static! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 33,
    name: 'GAIN EXCELLENCE',
    subtitle: '+1 ⭐',
    type: 'excellence',
    description: 'Gain +1 Excellence!',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  },
  {
    id: 34,
    name: 'HELP ANOTHER',
    subtitle: '+2 TO FRIEND',
    type: 'help',
    description: 'Help another player move ahead 2 spaces!',
    colorClass: 'bg-teal-900/60 text-teal-200 border-teal-500/60',
  },
  {
    id: 35,
    name: 'THE WHY',
    type: 'milestone',
    isWhy: true,
    description: 'Final recurring THE WHY anchor before the home stretch. Ground your circuit.',
    colorClass: 'bg-blue-600 text-white border-blue-400',
  },
  {
    id: 36,
    name: 'ANOTHER SPIN',
    subtitle: 'EXTRA TURN',
    type: 'normal',
    description: 'Take another spin!',
    colorClass: 'bg-slate-800 text-slate-200 border-slate-700',
  },
  {
    id: 37,
    name: 'RHYTHM',
    subtitle: 'EFFORTLESS FLOW',
    type: 'milestone',
    description: 'Effortless momentum! Surge +2 spaces forward.',
    colorClass: 'bg-sky-600 text-white border-sky-400 shadow-md',
  },
  {
    id: 38,
    name: 'DRAW GOLIATH',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'GOLIATH roadblock! Draw a GOLIATH card.',
    colorClass: 'bg-rose-950 text-rose-200 border-rose-600',
  },
  {
    id: 39,
    name: 'SPREZZATURA',
    subtitle: 'EFFORTLESS ART',
    type: 'milestone',
    description: 'Making the impossible look effortless. +1 Excellence!',
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
  // If behind space 5, wrap back to space 35 (or space 5 if start of game)
  return currentPos === 0 ? 0 : 35;
}

export const GOLIATH_CARDS: GameCard[] = [
  {
    id: 'g1',
    type: 'goliath',
    title: 'UH-OH! YOUR WIRES GOT CROSSED.',
    tagline: 'GOLIATH jumbled the signal',
    description: 'Go backward until you reach THE WHY. Lose your next turn.',
    actionText: 'Rewind to THE WHY',
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
        message: `${activePlayer.name} got wires crossed! Sent back to THE WHY (Space #${whyPos}) and misses next turn.`,
      };
    },
  },
  {
    id: 'g2',
    type: 'goliath',
    title: 'STATIC FIELD SLIDE',
    tagline: 'GOLIATH jams your gears',
    description: 'Slide back 3 spaces! (Oh, goddammit.)',
    actionText: 'Slide Back 3 Spaces',
    icon: 'Radio',
    effect: (activePlayer, allPlayers) => {
      const targetPos = Math.max(0, activePlayer.position - 3);
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, position: targetPos } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} hit static and slid back 3 spaces to #${targetPos}!`,
      };
    },
  },
  {
    id: 'g3',
    type: 'goliath',
    title: 'SHADOW SWAP',
    tagline: 'GOLIATH reverses fortunes',
    description: 'GOLIATH swaps your position with the player furthest behind you!',
    actionText: 'Swap Positions',
    icon: 'ArrowLeftRight',
    effect: (activePlayer, allPlayers) => {
      const otherPlayers = allPlayers.filter((p) => p.id !== activePlayer.id);
      const minPos = Math.min(...otherPlayers.map((p) => p.position));
      const trailingPlayer = otherPlayers.find((p) => p.position === minPos);

      if (!trailingPlayer || trailingPlayer.position >= activePlayer.position) {
        return {
          updatedPlayers: allPlayers,
          message: `${activePlayer.name} was already in last place, so GOLIATH had nothing to swap!`,
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
    title: 'SNOOZE BEAM',
    tagline: 'GOLIATH hits the off switch',
    description: 'Your pawn falls fast asleep! Move back 1 space and lose your next turn.',
    actionText: 'Fall Asleep',
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
        message: `${activePlayer.name} was hit by a Snooze Beam! Back 1 space & misses next turn.`,
      };
    },
  },
  {
    id: 'g5',
    type: 'goliath',
    title: 'GOLIATH DETOUR',
    tagline: 'Unexpected detour',
    description: 'Slide back 2 spaces! (If you already have your DOMO, you deflect 1 space of the penalty!)',
    actionText: 'Take Detour',
    icon: 'BrainCircuit',
    effect: (activePlayer, allPlayers) => {
      const penalty = activePlayer.pawnType === 'dork' ? 1 : 2;
      const targetPos = Math.max(0, activePlayer.position - penalty);
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, position: targetPos } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} took a detour back ${penalty} space${penalty > 1 ? 's' : ''}!`,
      };
    },
  },
  {
    id: 'g6',
    type: 'goliath',
    title: 'STATIC WAVE',
    tagline: 'GOLIATH shakes the board',
    description: 'All players slip back 1 space, but everyone gains +1 EXCELLENCE for standing together!',
    actionText: 'Endure Together (+1 ⭐)',
    icon: 'Activity',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) => ({
        ...p,
        position: Math.max(0, p.position - 1),
        excellence: p.excellence + 1,
      }));
      return {
        updatedPlayers: updated,
        message: `GOLIATH shook the board! Everyone slid back 1 space but earned +1 EXCELLENCE!`,
      };
    },
  },
  {
    id: 'g7',
    type: 'goliath',
    title: 'SHINY DISTRACTION',
    tagline: 'GOLIATH flashes shiny noise',
    description: 'You lose 1 Excellence (minimum 0) and lose your footing back 1 space.',
    actionText: 'Lose 1 Star',
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
    title: 'ANALYSIS PARALYSIS',
    tagline: 'Overthinking trap',
    description: 'You get stuck overthinking the move. Lose your next turn!',
    actionText: 'Pause for 1 Turn',
    icon: 'EyeOff',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, missNextTurn: true } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} was caught overthinking and will miss next turn.`,
      };
    },
  },
];

export const POSITIVE_CARDS: GameCard[] = [
  {
    id: 'p1',
    type: 'positive',
    title: 'HELP EMANCIPATE A TENANT',
    tagline: 'Elevate together',
    description: 'Choose another DORK (or trailing player). Both of you move ahead 2 spaces and gain +1 EXCELLENCE!',
    actionText: 'Both Move Ahead 2 (+1 ⭐)',
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
            excellence: p.excellence + 1,
          };
        }
        if (p.id === targetId) {
          return {
            ...p,
            position: (p.position + 2) % boardLength,
            excellence: p.excellence + 1,
          };
        }
        return p;
      });

      const helpedName = lowest ? lowest.name : 'a teammate';
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} helped emancipate a tenant with ${helpedName}! Both moved +2 and gained +1 EXCELLENCE!`,
      };
    },
  },
  {
    id: 'p2',
    type: 'positive',
    title: 'BOOST A FRIEND!',
    tagline: 'Lift a teammate',
    description: 'The furthest trailing player moves forward 3 spaces! You earn +1 EXCELLENCE for elevating them.',
    actionText: 'Boost Trailing Player (+1 ⭐)',
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

      const helpedName = lowest ? lowest.name : 'a teammate';
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} boosted ${helpedName} +3 spaces and earned +1 EXCELLENCE!`,
      };
    },
  },
  {
    id: 'p3',
    type: 'positive',
    title: 'HIGH FIVE WAVE',
    tagline: 'Collective momentum',
    description: 'Every player on the board advances 1 space! You gain +1 EXCELLENCE for sparking the wave.',
    actionText: 'High Five Everyone (+1 ⭐)',
    icon: 'HandMetal',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) => ({
        ...p,
        position: (p.position + 1) % boardLength,
        excellence: p.id === activePlayer.id ? p.excellence + 1 : p.excellence,
      }));
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} sparked a High Five wave! Everyone moved +1 space!`,
      };
    },
  },
  {
    id: 'p4',
    type: 'positive',
    title: 'DOMO TURBO BOOST',
    tagline: 'Power of the DORK',
    description: 'If you are a DORK, sprint forward 3 spaces! If still a SPARK, move forward 1 space.',
    actionText: 'Turbo Sprint',
    icon: 'Glasses',
    effect: (activePlayer, allPlayers, boardLength) => {
      const bonus = activePlayer.pawnType === 'dork' ? 3 : 1;
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, position: (p.position + bonus) % boardLength }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} used DOMO Turbo Boost to advance +${bonus} spaces!`,
      };
    },
  },
  {
    id: 'p5',
    type: 'positive',
    title: 'ALLIANCE SHIELD',
    tagline: 'GOLIATH protection',
    description: 'You gain a persistent shield! The next GOLIATH setback against you is completely negated.',
    actionText: 'Equip Shield (+1 ⭐)',
    icon: 'ShieldCheck',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, shielded: true, excellence: p.excellence + 1 }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} equipped an ALLIANCE SHIELD and gained +1 EXCELLENCE!`,
      };
    },
  },
  {
    id: 'p6',
    type: 'positive',
    title: 'LUCKY BREAK',
    tagline: 'Smooth sailing',
    description: 'Surge forward 2 extra spaces immediately and take another spin!',
    actionText: 'Surge +2 Spaces',
    icon: 'Zap',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, position: (p.position + 2) % boardLength }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} got a Lucky Break and surged forward +2 spaces!`,
      };
    },
  },
  {
    id: 'p7',
    type: 'positive',
    title: 'FLASH OF EXCELLENCE',
    tagline: 'Inspiring everyone around you',
    description: 'Gain +2 EXCELLENCE directly! The measure of excellence in the world just increased.',
    actionText: 'Claim +2 Excellence',
    icon: 'Award',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, excellence: p.excellence + 2 } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} had a Flash of Excellence (+2 ⭐)!`,
      };
    },
  },
  {
    id: 'p8',
    type: 'positive',
    title: 'SPREZZATURA SURGE',
    tagline: 'Making it look effortless',
    description: 'Leap forward 2 spaces and grant +1 Excellence to all players!',
    actionText: 'Spread Excellence',
    icon: 'Flame',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) => ({
        ...p,
        position: p.id === activePlayer.id ? (p.position + 2) % boardLength : p.position,
        excellence: p.excellence + 1,
      }));
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} performed a Sprezzatura Surge! Advanced 2 spaces and shared Excellence!`,
      };
    },
  },
];
