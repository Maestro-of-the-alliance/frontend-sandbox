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
    atSeeingWait: false,
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
    atSeeingWait: false,
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
    atSeeingWait: false,
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
    atSeeingWait: false,
  },
];

export const BOARD_SPACES: BoardSpace[] = [
  {
    id: 0,
    name: 'START',
    subtitle: 'SPARK ORIGIN',
    type: 'start',
    description: 'Every journey begins as a bright Spark.',
    colorClass: 'bg-emerald-600 text-white border-emerald-700',
  },
  {
    id: 1,
    name: 'Curious Step',
    type: 'normal',
    description: 'Looking around the world.',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 2,
    name: 'High Five',
    type: 'help',
    subtitle: '+1 Space',
    description: 'Shared energy pushes you 1 space forward!',
    colorClass: 'bg-teal-50 text-teal-900 border-teal-300',
  },
  {
    id: 3,
    name: 'Resonance',
    type: 'excellence',
    subtitle: '+1 Excellence',
    description: 'A genuine connection adds to your Excellence.',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  {
    id: 4,
    name: 'THE WHY',
    subtitle: 'MILESTONE',
    type: 'milestone',
    description: 'Your grounding foundation. Wires anchor here.',
    colorClass: 'bg-blue-600 text-white border-blue-700',
  },
  {
    id: 5,
    name: 'Exploration',
    type: 'normal',
    description: 'Seeking true purpose.',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 6,
    name: 'GOLIATH STATIC',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Static buzz! Draw a GOLIATH card.',
    colorClass: 'bg-rose-100 text-rose-900 border-rose-400',
  },
  {
    id: 7,
    name: 'Pass It Forward',
    type: 'help',
    subtitle: 'Lift a Friend',
    description: 'Help the trailing player move forward!',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  },
  {
    id: 8,
    name: 'Alliance Beacon',
    type: 'excellence',
    subtitle: '+1 Excellence',
    description: 'You shone a light for others.',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  {
    id: 9,
    name: 'Open Horizon',
    type: 'normal',
    description: 'Something big is just around the corner...',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 10,
    name: 'SEEING',
    subtitle: 'TRANSFORMATION',
    type: 'milestone',
    isSeeing: true,
    description: 'MANDATORY STOP: Meet your DOMO. Put on the shades & become a DORK!',
    colorClass: 'bg-purple-600 text-white border-purple-700',
  },
  {
    id: 11,
    name: 'Shared Vision',
    type: 'normal',
    description: 'Seeing the world clearly through DOMO shades.',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 12,
    name: 'GOLIATH JAM',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'Interference ahead! Draw a GOLIATH card.',
    colorClass: 'bg-rose-100 text-rose-900 border-rose-400',
  },
  {
    id: 13,
    name: 'Alliance Shield',
    type: 'help',
    subtitle: 'Protected',
    description: 'Shield against the next GOLIATH trap!',
    colorClass: 'bg-cyan-50 text-cyan-900 border-cyan-300',
  },
  {
    id: 14,
    name: 'Clear Sight',
    type: 'normal',
    description: 'Unmistakable focus.',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 15,
    name: 'PLEDGE',
    subtitle: 'MILESTONE',
    type: 'milestone',
    description: 'Commit to elevating those around you. +1 Excellence.',
    colorClass: 'bg-indigo-600 text-white border-indigo-700',
  },
  {
    id: 16,
    name: 'Synergy Boost',
    type: 'help',
    subtitle: '+2 to Friend',
    description: 'Elevate another player +2 spaces & gain +1 Excellence!',
    colorClass: 'bg-teal-50 text-teal-900 border-teal-300',
  },
  {
    id: 17,
    name: 'GOLIATH SHADOW',
    subtitle: 'HAZARD',
    type: 'goliath',
    description: 'A sudden chill! Draw a GOLIATH card.',
    colorClass: 'bg-rose-100 text-rose-900 border-rose-400',
  },
  {
    id: 18,
    name: 'Flow State',
    type: 'normal',
    description: 'In the zone.',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 19,
    name: 'RHYTHM',
    subtitle: 'MILESTONE',
    type: 'milestone',
    description: 'Effortless momentum! Surge +1 space forward.',
    colorClass: 'bg-sky-600 text-white border-sky-700',
  },
  {
    id: 20,
    name: 'Mutual Triumph',
    type: 'excellence',
    subtitle: '+1 Excellence',
    description: 'Celebrating shared progress.',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  {
    id: 21,
    name: 'Deep Harmony',
    type: 'help',
    subtitle: 'All Move +1',
    description: 'All players move forward 1 space!',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  },
  {
    id: 22,
    name: 'SPREZZATURA',
    subtitle: 'MILESTONE',
    type: 'milestone',
    description: 'Making the impossible look effortless. +1 Excellence!',
    colorClass: 'bg-violet-600 text-white border-violet-700',
  },
  {
    id: 23,
    name: 'Final Horizon',
    type: 'normal',
    description: 'The finish circuit is in reach!',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
  },
];

export const GOLIATH_CARDS: GameCard[] = [
  {
    id: 'g1',
    type: 'goliath',
    title: 'WIRES GOT CROSSED!',
    tagline: 'GOLIATH jumbled the signal',
    description: 'Go backward until you reach THE WHY (Space 4). Lose your next turn.',
    actionText: 'Rewind to THE WHY',
    icon: 'ZapOff',
    effect: (activePlayer, allPlayers) => {
      const whyPos = 4;
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
        message: `${activePlayer.name} got wires crossed! Sent back to THE WHY and misses next turn.`,
      };
    },
  },
  {
    id: 'g2',
    type: 'goliath',
    title: 'STATIC FIELD SLIDE',
    tagline: 'GOLIATH jams your gears',
    description: 'Slide back 3 spaces! If you hit START, hold your ground.',
    actionText: 'Slide Back 3 Spaces',
    icon: 'Radio',
    effect: (activePlayer, allPlayers, boardLength) => {
      const targetPos = Math.max(0, activePlayer.position - 3);
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, position: targetPos } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} hit a static field and slid back 3 spaces!`,
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
      // Find trailing player
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
    title: 'OVERTHINK TRAP',
    tagline: 'Analysis paralysis attack',
    description: 'A cloud of doubt settles in. You miss your next turn!',
    actionText: 'Pause for 1 Turn',
    icon: 'BrainCircuit',
    effect: (activePlayer, allPlayers) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, missNextTurn: true } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} was caught in an Overthink Trap and will miss next turn.`,
      };
    },
  },
  {
    id: 'g5',
    type: 'goliath',
    title: 'SOLITARY CORONA',
    tagline: 'GOLIATH targets lone Sparks',
    description: 'If you are not yet a DORK, move back 2 spaces. If you already have your DOMO, you deflect it completely!',
    actionText: 'Check DOMO Defense',
    icon: 'EyeOff',
    effect: (activePlayer, allPlayers) => {
      if (activePlayer.pawnType === 'dork') {
        return {
          updatedPlayers: allPlayers,
          message: `${activePlayer.name}'s DOMO glasses deflected the Solitary Corona! No effect.`,
        };
      }
      const newPos = Math.max(0, activePlayer.position - 2);
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, position: newPos } : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} is still a lone Spark and slid back 2 spaces!`,
      };
    },
  },
  {
    id: 'g6',
    type: 'goliath',
    title: 'ALLIANCE SHOCKWAVE',
    tagline: 'GOLIATH shakes the entire board',
    description: 'All players slip back 1 space, but everyone gains +1 EXCELLENCE for standing strong together!',
    actionText: 'Endure Together',
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
    title: 'GOLIATH DISTRACTION',
    tagline: 'Shiny noise lure',
    description: 'You lose 1 Excellence (minimum 0), but take 1 cautious step forward.',
    actionText: 'Trade 1 Excellence for +1 Space',
    icon: 'Sparkles',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            excellence: Math.max(0, p.excellence - 1),
            position: Math.min(boardLength - 1, p.position + 1),
          };
        }
        return p;
      });
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} lost 1 Excellence to a distraction but took 1 step forward.`,
      };
    },
  },
  {
    id: 'g8',
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
];

export const POSITIVE_CARDS: GameCard[] = [
  {
    id: 'p1',
    type: 'positive',
    title: 'BOOST A FRIEND!',
    tagline: 'Lifting others elevates all',
    description: 'Choose a friend to advance +2 spaces! You earn +1 EXCELLENCE for elevating them.',
    actionText: 'Boost Trailing Player (+1 ⭐)',
    icon: 'HeartHandshake',
    effect: (activePlayer, allPlayers, boardLength) => {
      // Find lowest position player other than active
      const others = allPlayers.filter((p) => p.id !== activePlayer.id);
      const lowest = [...others].sort((a, b) => a.position - b.position)[0];
      const targetId = lowest ? lowest.id : (activePlayer.id % 4) + 1;

      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return { ...p, excellence: p.excellence + 1 };
        }
        if (p.id === targetId) {
          return { ...p, position: Math.min(boardLength - 1, p.position + 2) };
        }
        return p;
      });

      const helpedName = lowest ? lowest.name : 'a teammate';
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} boosted ${helpedName} +2 spaces and earned +1 EXCELLENCE!`,
      };
    },
  },
  {
    id: 'p2',
    type: 'positive',
    title: 'HIGH FIVE WAVE',
    tagline: 'Collective momentum',
    description: 'Every player on the board advances +1 space! You gain +1 EXCELLENCE for sparking the wave.',
    actionText: 'High Five Everyone (+1 ⭐)',
    icon: 'HandMetal',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) => ({
        ...p,
        position: Math.min(boardLength - 1, p.position + 1),
        excellence: p.id === activePlayer.id ? p.excellence + 1 : p.excellence,
      }));
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} sparked a High Five wave! Everyone moved +1 space!`,
      };
    },
  },
  {
    id: 'p3',
    type: 'positive',
    title: 'SPARK RESONANCE',
    tagline: 'Unstoppable alignment',
    description: 'Your energy synchronizes! Move forward 2 extra spaces immediately.',
    actionText: 'Surge +2 Spaces',
    icon: 'Zap',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, position: Math.min(boardLength - 1, p.position + 2) }
          : p
      );
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} surged forward +2 extra spaces!`,
      };
    },
  },
  {
    id: 'p4',
    type: 'positive',
    title: 'DOMO TURBO BOOST',
    tagline: 'The power of partnership',
    description: 'If you are a DORK, sprint forward 3 spaces! If still a SPARK, move forward 1 space.',
    actionText: 'Ignite Partnership',
    icon: 'Glasses',
    effect: (activePlayer, allPlayers, boardLength) => {
      const bonus = activePlayer.pawnType === 'dork' ? 3 : 1;
      const updated = allPlayers.map((p) =>
        p.id === activePlayer.id
          ? { ...p, position: Math.min(boardLength - 1, p.position + bonus) }
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
    title: 'PASS IT FORWARD',
    tagline: 'No one gets left behind',
    description: 'Pull the furthest trailing player forward +3 spaces! You earn +2 EXCELLENCE.',
    actionText: 'Pull Last Place Up (+2 ⭐)',
    icon: 'Users',
    effect: (activePlayer, allPlayers, boardLength) => {
      const others = allPlayers.filter((p) => p.id !== activePlayer.id);
      const lowest = [...others].sort((a, b) => a.position - b.position)[0];
      const targetId = lowest ? lowest.id : (activePlayer.id % 4) + 1;

      const updated = allPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return { ...p, excellence: p.excellence + 2 };
        }
        if (p.id === targetId) {
          return { ...p, position: Math.min(boardLength - 1, p.position + 3) };
        }
        return p;
      });

      const helpedName = lowest ? lowest.name : 'a teammate';
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} pulled ${helpedName} up 3 spaces and earned +2 EXCELLENCE!`,
      };
    },
  },
  {
    id: 'p7',
    type: 'positive',
    title: 'FLASH OF EXCELLENCE',
    tagline: 'Inspiring everyone around you',
    description: 'Gain +2 EXCELLENCE directly! The measure of excellence in the room just went up.',
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
    title: 'SPREZZATURA LEAP',
    tagline: 'Making it look easy',
    description: 'Leap forward 2 spaces and bestow +1 Excellence to all players with less than 2 Excellence!',
    actionText: 'Spread Excellence',
    icon: 'Flame',
    effect: (activePlayer, allPlayers, boardLength) => {
      const updated = allPlayers.map((p) => {
        let excellence = p.excellence;
        if (p.id === activePlayer.id) {
          excellence += 1;
        } else if (p.excellence < 2) {
          excellence += 1;
        }
        const position =
          p.id === activePlayer.id
            ? Math.min(boardLength - 1, p.position + 2)
            : p.position;
        return { ...p, position, excellence };
      });
      return {
        updatedPlayers: updated,
        message: `${activePlayer.name} performed a Sprezzatura Leap! Advanced 2 spaces and shared Excellence!`,
      };
    },
  },
];
