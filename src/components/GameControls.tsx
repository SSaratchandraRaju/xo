import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { RotateCcw, Undo } from 'lucide-react';

const GameControls: React.FC = () => {
  const { undoMove, resetGame, moveHistory } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex space-x-4 mt-6"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
        onClick={() => undoMove()}
        disabled={moveHistory.length === 0}
      >
        <Undo className="w-5 h-5 mr-2" />
        Undo
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md"
        onClick={() => resetGame()}
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Reset
      </motion.button>
    </motion.div>
  );
};

export default GameControls