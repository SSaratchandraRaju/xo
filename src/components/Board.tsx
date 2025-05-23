import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import clsx from 'clsx';

const Board: React.FC = () => {
  const { board, currentPlayer, winner, winningLine, makeMove } = useGameStore();

  const renderCell = (index: number) => {
    const isWinningCell = winningLine?.includes(index);
    
    return (
      <motion.button
        key={index}
        whileHover={{ scale: board[index] ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          'w-full h-full flex items-center justify-center text-4xl font-bold border-2 border-gray-300 dark:border-gray-600',
          {
            'cursor-not-allowed': board[index] || winner,
            'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700': !board[index] && !winner,
            'bg-green-200 dark:bg-green-800': isWinningCell,
          }
        )}
        onClick={() => makeMove(index)}
        disabled={!!board[index] || !!winner}
      >
        {board[index] && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={clsx('text-4xl', {
              'text-blue-600 dark:text-blue-400': board[index] === 'X',
              'text-red-600 dark:text-red-400': board[index] === 'O',
            })}
          >
            {board[index]}
          </motion.span>
        )}
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-3 gap-2 w-72 h-72 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl"
    >
      {Array(9).fill(null).map((_, index) => renderCell(index))}
    </motion.div>
  );
};

export default Board