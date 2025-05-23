import { create } from 'zustand';
import { GameState, GameSettings, Difficulty } from '../types';

const initialState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
  moveHistory: [],
  isGameStarted: false,
  settings: null,
  isDraw: false,
};

const getEmptyCells = (board: Array<string | null>): number[] => {
  return board.reduce<number[]>((cells, cell, index) => {
    if (cell === null) cells.push(index);
    return cells;
  }, []);
};

const checkWinner = (board: Array<string | null>): { winner: string | null; winningLine: number[] | null; isDraw: boolean } => {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const combo of winningCombos) {
    if (
      board[combo[0]] &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[0]] === board[combo[2]]
    ) {
      return { winner: board[combo[0]], winningLine: combo, isDraw: false };
    }
  }

  const isDraw = !board.includes(null);
  return { winner: null, winningLine: null, isDraw };
};

const minimax = (
  board: Array<string | null>,
  depth: number,
  isMaximizing: boolean,
  aiSymbol: string,
  humanSymbol: string
): number => {
  const { winner } = checkWinner(board);
  
  if (winner === aiSymbol) return 10 - depth;
  if (winner === humanSymbol) return depth - 10;
  if (getEmptyCells(board).length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = minimax(board, depth + 1, false, aiSymbol, humanSymbol);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = humanSymbol;
        const score = minimax(board, depth + 1, true, aiSymbol, humanSymbol);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getAIMove = (
  board: Array<string | null>,
  difficulty: Difficulty,
  aiSymbol: string,
  humanSymbol: string
): number => {
  const emptyCells = getEmptyCells(board);
  
  // Easy: Random moves
  if (difficulty === 'easy') {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  // Medium: 70% optimal moves, 30% random moves
  if (difficulty === 'medium' && Math.random() < 0.3) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  // Hard/Medium: Use minimax for optimal moves
  let bestScore = -Infinity;
  let bestMove = emptyCells[0];
  
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = aiSymbol;
      const score = minimax(board, 0, false, aiSymbol, humanSymbol);
      board[i] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
};

const makeAIMove = (state: GameState) => {
  const aiSymbol = state.settings?.player1.symbol === 'X' ? 'O' : 'X';
  const humanSymbol = state.settings?.player1.symbol;
  const aiMove = getAIMove(
    state.board,
    state.settings?.difficulty || 'medium',
    aiSymbol,
    humanSymbol
  );

  const aiBoard = [...state.board];
  aiBoard[aiMove] = aiSymbol;
  
  const { winner, winningLine, isDraw } = checkWinner(aiBoard);
  
  return {
    board: aiBoard,
    currentPlayer: aiSymbol === 'X' ? 'O' : 'X',
    winner,
    winningLine,
    isDraw,
    moveHistory: [...state.moveHistory, aiMove],
  };
};

export const useGameStore = create<GameState & {
  makeMove: (index: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  startGame: (settings: GameSettings) => void;
}>((set, get) => ({
  ...initialState,

  makeMove: (index: number) => {
    const state = get();
    if (state.board[index] || state.winner || state.isDraw) return;

    const newBoard = [...state.board];
    newBoard[index] = state.currentPlayer;
    
    const { winner, winningLine, isDraw } = checkWinner(newBoard);
    
    set({
      board: newBoard,
      currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      winningLine,
      isDraw,
      moveHistory: [...state.moveHistory, index],
    });

    // AI move
    if (!winner && !isDraw && state.settings?.gameMode === 'single' && state.currentPlayer === state.settings.player1.symbol) {
      setTimeout(() => {
        const aiState = get();
        if (aiState.winner || aiState.isDraw) return;
        set(makeAIMove(aiState));
      }, 500);
    }
  },

  undoMove: () => {
    const state = get();
    if (state.moveHistory.length === 0) return;

    const newHistory = [...state.moveHistory];
    // Remove both AI and player moves in single player mode
    const movesToUndo = state.settings?.gameMode === 'single' ? 2 : 1;
    newHistory.splice(-movesToUndo);
    
    const newBoard = Array(9).fill(null);
    newHistory.forEach((move, index) => {
      newBoard[move] = index % 2 === 0 ? 'X' : 'O';
    });

    set({
      board: newBoard,
      currentPlayer: (newHistory.length % 2 === 0) ? 'X' : 'O',
      winner: null,
      winningLine: null,
      isDraw: false,
      moveHistory: newHistory,
    });
  },

  resetGame: () => {
    set(initialState);
  },

  startGame: (settings: GameSettings) => {
    const newState = {
      ...initialState,
      isGameStarted: true,
      settings,
    };

    // If player chose 'O', AI makes the first move
    if (settings.gameMode === 'single' && settings.player1.symbol === 'O') {
      set(newState);
      setTimeout(() => {
        set(makeAIMove(get()));
      }, 500);
    } else {
      set(newState);
    }
  },
}));