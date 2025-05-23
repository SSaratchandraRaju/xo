import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Trophy, Notebook as Robot } from 'lucide-react';

const GameStatus: React.FC = () => {
  const { winner, currentPlayer, settings, isDraw } = useGameStore();

  const getMessage = () => {
    if (winner) {
      const winnerName = winner === settings?.player1.symbol 
        ? settings.player1.name 
        : settings?.player2?.name || 'AI';
      return (
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>{winnerName} Wins!</span>
        </div>
      );
    }

    if (isDraw) {
      return "It's a Draw!";
    }
    
    const currentPlayerName = currentPlayer === settings?.player1.symbol
      ? settings?.player1.name
      : settings?.player2?.name || 'AI';
    return (
      <div className="flex items-center space-x-2">
        {currentPlayerName === 'AI' && <Robot className="w-6 h-6" />}
        <span>{currentPlayerName}'s Turn</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
      >
        {getMessage()}
      </motion.div>
      {settings?.gameMode === 'single' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          Difficulty: <span className="capitalize">{settings.difficulty}</span>
        </motion.div>
      )}
    </div>
  );
};

export default GameStatus;