import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MainMenu } from './components/MainMenu';
import { ChoiceButtons } from './components/ChoiceButtons';
import { GameArena } from './components/GameArena';
import { Home, RotateCcw } from 'lucide-react';

type Direction = 'left' | 'center' | 'right';
type GameResult = 'goal' | 'save' | 'waiting' | null;
type GameMode = 'menu' | 'ai' | 'multiplayer';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [round, setRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Direction | null>(null);
  const [aiChoice, setAiChoice] = useState<Direction | null>(null);
  const [result, setResult] = useState<GameResult>('waiting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pressure, setPressure] = useState(20);

  const handleStartGame = (mode: 'ai' | 'multiplayer') => {
    setGameMode(mode);
    resetGame();
  };

  const handleChoice = useCallback(async (direction: Direction) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPlayerChoice(direction);
    setResult(null);
    setPressure((p) => Math.min(p + 15, 100));

    const dirs: Direction[] = ['left', 'center', 'right'];
    const ai = dirs[Math.floor(Math.random() * 3)];
    await sleep(200);
    setAiChoice(ai);

    const isGoal = direction !== ai;
    await sleep(750);
    if (isGoal) {
      setResult('goal');
      setHomeScore((s) => s + 1);
      setPressure((p) => Math.max(p - 10, 0));
    } else {
      setResult('save');
      setAwayScore((s) => s + 1);
    }

    await sleep(3000);
    setPlayerChoice(null);
    setAiChoice(null);
    setResult('waiting');
    setRound((r) => r + 1);
    setIsProcessing(false);
  }, [isProcessing]);

  const resetGame = () => {
    setHomeScore(0); setAwayScore(0); setRound(1);
    setPlayerChoice(null); setAiChoice(null);
    setResult('waiting'); setIsProcessing(false); setPressure(20);
  };

  const returnToMenu = () => { setGameMode('menu'); resetGame(); };

  if (gameMode === 'menu') return <MainMenu onStartGame={handleStartGame} />;

  return (
    // Корень — фиксированный полный экран
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}>

      {/* ── 3D Canvas занимает ВСЁ ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <GameArena
          result={result}
          playerChoice={playerChoice}
          aiChoice={aiChoice}
          homeScore={homeScore}
          awayScore={awayScore}
        />
      </div>

      {/* ── UI поверх ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', zIndex: 20 }}>

        {/* Верхняя панель */}
        <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <motion.button
                onClick={returnToMenu}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 border border-white/15 transition-all"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ pointerEvents: 'auto' }}
              >
                <Home className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-xs uppercase tracking-wider">Menu</span>
              </motion.button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-0.5">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                  <span className="text-[10px] font-black text-red-400 tracking-widest uppercase">Live</span>
                </div>
                <div className="flex items-center gap-4">
                  <motion.span key={`h${homeScore}`} initial={{ scale: 1.8, color: '#4ade80' }} animate={{ scale: 1, color: '#ffffff' }} transition={{ duration: 0.4 }} className="text-3xl font-black" style={{ color: '#fff' }}>
                    {homeScore}
                  </motion.span>
                  <span className="text-white/30 text-xl">—</span>
                  <motion.span key={`a${awayScore}`} initial={{ scale: 1.8, color: '#f87171' }} animate={{ scale: 1, color: '#ffffff' }} transition={{ duration: 0.4 }} className="text-3xl font-black" style={{ color: '#fff' }}>
                    {awayScore}
                  </motion.span>
                </div>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Round {round}</span>
              </div>

              <motion.button
                onClick={resetGame}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 border border-white/15 transition-all"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ pointerEvents: 'auto' }}
              >
                <RotateCcw className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-xs uppercase tracking-wider">Reset</span>
              </motion.button>
            </div>

            {/* Pressure bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Pressure Tense</span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{pressure}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                  animate={{ width: `${pressure}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Нижние кнопки */}
        <div style={{ pointerEvents: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ChoiceButtons onChoice={handleChoice} disabled={isProcessing} />
        </div>
      </div>
    </div>
  );
}