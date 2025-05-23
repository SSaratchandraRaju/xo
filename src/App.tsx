import React from 'react';
import { useGameStore } from './store/gameStore';
import GameSetup from './components/GameSetup';
import Board from './components/Board';
import GameControls from './components/GameControls';
import GameStatus from './components/GameStatus';
import { Sun, Moon } from 'lucide-react';

function App() {
  const isGameStarted = useGameStore(state => state.isGameStarted);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {!isGameStarted ? (
        <GameSetup />
      ) : (
        <div className="flex flex-col items-center">
          <GameStatus />
          <Board />
          <GameControls />
        </div>
      )}
    </div>
  );
}

export default App;