import { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';

const SCREENS = {
  WELCOME: 'welcome',
  GAME: 'game',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [difficulty, setDifficulty] = useState(1);
  const [gameResult, setGameResult] = useState(null);

  const handleStart = useCallback((diff) => {
    setDifficulty(diff);
    setScreen(SCREENS.GAME);
  }, []);

  const handleGameOver = useCallback((result) => {
    setGameResult(result);
    setScreen(SCREENS.GAME_OVER);
  }, []);

  const handleVictory = useCallback((result) => {
    setGameResult(result);
    setScreen(SCREENS.VICTORY);
  }, []);

  const handleRestart = useCallback(() => {
    setScreen(SCREENS.WELCOME);
    setGameResult(null);
  }, []);

  return (
    <div className="app">
      {screen === SCREENS.WELCOME && <WelcomeScreen onStart={handleStart} />}
      {screen === SCREENS.GAME && (
        <GameScreen
          difficulty={difficulty}
          onGameOver={handleGameOver}
          onVictory={handleVictory}
        />
      )}
      {screen === SCREENS.GAME_OVER && (
        <GameOverScreen result={gameResult} onRestart={handleRestart} />
      )}
      {screen === SCREENS.VICTORY && (
        <VictoryScreen result={gameResult} onRestart={handleRestart} />
      )}
    </div>
  );
}
