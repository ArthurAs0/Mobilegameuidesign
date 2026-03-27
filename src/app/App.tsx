import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MainMenu } from './components/MainMenu';
import { ChoiceButtons } from './components/ChoiceButtons';
import { GameArena } from './components/GameArena';
import { Home, RotateCcw } from 'lucide-react';

type Direction = 'left' | 'center' | 'right';
type GameResult = 'goal' | 'save' | 'waiting' | null;
type GameMode = 'menu' | 'ai' | 'multiplayer';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [round, setRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Direction | null>(null);
  const [aiChoice, setAiChoice] = useState<Direction | null>(null);
  const [result, setResult] = useState<GameResult>('waiting');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartGame = (mode: 'ai' | 'multiplayer') => {
    setGameMode(mode);
    resetGame();
  };

  const handleChoice = (direction: Direction) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setPlayerChoice(direction);
    setResult(null);

    const aiDirections: Direction[] = ['left', 'center', 'right'];
    const aiDirection = aiDirections[Math.floor(Math.random() * 3)];
    
    setTimeout(() => {
      setAiChoice(aiDirection);
      
      const isGoal = direction !== aiDirection;
      
      setTimeout(() => {
        if (isGoal) {
          setResult('goal');
          setHomeScore(prev => prev + 1);
        } else {
          setResult('save');
          setAwayScore(prev => prev + 1);
        }

        setTimeout(() => {
          setPlayerChoice(null);
          setAiChoice(null);
          setResult('waiting');
          setRound(prev => prev + 1);
          setIsProcessing(false);
        }, 3000);
      }, 750);
    }, 200);
  };

  const resetGame = () => {
    setHomeScore(0);
    setAwayScore(0);
    setRound(1);
    setPlayerChoice(null);
    setAiChoice(null);
    setResult('waiting');
    setIsProcessing(false);
  };

  const returnToMenu = () => {
    setGameMode('menu');
    resetGame();
  };

  if (gameMode === 'menu') {
    return <MainMenu onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Highly Realistic Blurred Stadium Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="w-full h-full bg-cover bg-center blur-md scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1765130729127-f734df4dff3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdGFkaXVtJTIwY3Jvd2QlMjBkYXlsaWdodHxlbnwxfHx8fDE3NzQ2MzQ2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 via-green-500/20 to-blue-600/30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen py-6 px-4">
        {/* Top Header with Glassmorphism */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl border-2 border-white/50">
            <motion.button
              onClick={returnToMenu}
              className="flex items-center gap-2 bg-white/60 hover:bg-white/80 rounded-xl px-4 py-2 shadow-md border border-white/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5 text-gray-700" />
              <span className="text-gray-800 font-bold text-sm uppercase">Menu</span>
            </motion.button>

            <div className="text-center">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                PENALTY DUEL
              </h1>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                Round {round}
              </p>
            </div>

            <motion.button
              onClick={resetGame}
              className="flex items-center gap-2 bg-white/60 hover:bg-white/80 rounded-xl px-4 py-2 shadow-md border border-white/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
              <span className="text-gray-800 font-bold text-sm uppercase">Reset</span>
            </motion.button>
          </div>
        </div>

        {/* Main Game Arena */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <GameArena
            result={result}
            playerChoice={playerChoice}
            aiChoice={aiChoice}
            homeScore={homeScore}
            awayScore={awayScore}
          />
        </div>

        {/* Bottom Control Panel */}
        <ChoiceButtons onChoice={handleChoice} disabled={isProcessing} />
      </div>
    </div>
  );
}