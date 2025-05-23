import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameMode, Difficulty, GameSettings } from '../types';
import { useGameStore } from '../store/gameStore';
import { Settings, Bot, Users, Monitor } from 'lucide-react';

const GameSetup: React.FC = () => {
  const startGame = useGameStore(state => state.startGame);
  const [name, setName] = useState('Player');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [symbol, setSymbol] = useState<'X' | 'O'>('X');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: GameSettings = {
      player1: { name: name.trim() || 'Player', symbol },
      player2: gameMode !== 'single' ? {
        name: player2Name.trim() || 'Player 2',
        symbol: symbol === 'X' ? 'O' : 'X'
      } : undefined,
      gameMode,
      difficulty: gameMode === 'single' ? difficulty : undefined,
    };
    startGame(settings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
    >
      <div className="flex items-center justify-center mb-6">
        <Settings className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <h2 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Game Setup</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Player 1 Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player 1 name"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {(gameMode === 'local' || gameMode === 'online') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Player 2 Name
            </label>
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder="Enter player 2 name"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Player 1 Symbol
          </label>
          <div className="mt-2 flex space-x-4">
            {['X', 'O'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSymbol(s as 'X' | 'O')}
                className={`px-4 py-2 rounded-md ${
                  symbol === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {(gameMode === 'local' || gameMode === 'online') && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Player 2 will be {symbol === 'X' ? 'O' : 'X'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Game Mode
          </label>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setGameMode('single')}
              className={`flex flex-col items-center p-3 rounded-md ${
                gameMode === 'single'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Bot className="w-6 h-6 mb-1" />
              <span className="text-sm">vs AI</span>
            </button>
            <button
              type="button"
              onClick={() => setGameMode('local')}
              className={`flex flex-col items-center p-3 rounded-md ${
                gameMode === 'local'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Monitor className="w-6 h-6 mb-1" />
              <span className="text-sm">Local</span>
            </button>
            <button
              type="button"
              onClick={() => setGameMode('online')}
              className={`flex flex-col items-center p-3 rounded-md ${
                gameMode === 'online'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Users className="w-6 h-6 mb-1" />
              <span className="text-sm">Online</span>
            </button>
          </div>
        </div>

        {gameMode === 'single' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Game
        </button>
      </form>
    </motion.div>
  );
};

export default GameSetup;