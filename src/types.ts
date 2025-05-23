export type Player = {
  name: string;
  symbol: 'X' | 'O';
};

export type GameMode = 'single' | 'local' | 'online';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameSettings = {
  player1: Player;
  player2?: Player;
  gameMode: GameMode;
  difficulty?: Difficulty;
};

export type GameState = {
  board: Array<string | null>;
  currentPlayer: 'X' | 'O';
  winner: string | null;
  winningLine: number[] | null;
  moveHistory: Array<number>;
  isGameStarted: boolean;
  settings: GameSettings | null;
  isDraw: boolean;
};