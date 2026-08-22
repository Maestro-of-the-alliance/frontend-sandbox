export type PlayerId = 1 | 2 | 3 | 4;

export type PawnType = 'spark' | 'dork';

export interface Player {
  id: PlayerId;
  name: string;
  isHuman: boolean;
  color: 'red' | 'blue' | 'green' | 'yellow';
  hex: string;
  lightHex: string;
  borderHex: string;
  position: number; // 0 to 39
  pawnType: PawnType;
  excellence: number;
  missNextTurn: boolean;
  shielded: boolean;
  lapsCompleted: number;
  atPledgeWait?: boolean;
}

export type SpaceType = 
  | 'start'
  | 'milestone'
  | 'normal'
  | 'goliath'
  | 'help'
  | 'excellence';

export interface BoardSpace {
  id: number;
  name: string;
  type: SpaceType;
  subtitle?: string;
  description?: string;
  iconName?: string;
  colorClass?: string;
  isPledge?: boolean;
  isWhy?: boolean;
  isStart?: boolean;
}

export type CardType = 'goliath' | 'positive';

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  tagline?: string;
  description: string;
  actionText: string;
  icon: string;
  effect: (
    activePlayer: Player,
    allPlayers: Player[],
    boardLength: number
  ) => {
    updatedPlayers: Player[];
    message: string;
    excellenceDelta?: number;
    moveDelta?: number;
  };
}

export type SpinResult = 1 | 2 | 3 | 4 | 'goliath';

export interface TurnLog {
  id: string;
  text: string;
  type: 'spin' | 'move' | 'goliath' | 'help' | 'transformation' | 'win' | 'hazard';
  timestamp: number;
}
