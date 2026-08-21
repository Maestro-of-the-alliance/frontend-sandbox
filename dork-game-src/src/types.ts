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
  position: number; // 0 to boardLength - 1
  pawnType: PawnType;
  excellence: number;
  missNextTurn: boolean;
  shielded: boolean;
  lapsCompleted: number;
  atSeeingWait: boolean; // Stuck at SEEING waiting for a 1 or 2
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
  isSeeing?: boolean;
}

export type CardType = 'goliath' | 'positive';

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  tagline: string;
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

export type SpinResult = 1 | 2 | 3 | 'goliath';

export interface TurnLog {
  id: string;
  text: string;
  type: 'spin' | 'move' | 'goliath' | 'help' | 'transformation' | 'win';
  timestamp: number;
}
