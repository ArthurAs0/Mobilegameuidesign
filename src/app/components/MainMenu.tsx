import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (mode: 'ai' | 'multiplayer') => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-slate-900 px-4">
      {/* Фоновое изображение */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518605368461-1ee125232924?q=80&w=2000&auto=format&fit=crop')` }}
      />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-2 filter drop-shadow-lg">
            PENALTY DUEL
          </h1>
          <p className="text-gray-300 tracking-widest uppercase font-bold text-sm">Game of Prediction</p>
        </motion.div>

        <motion.div 
          className="w-full flex flex-col gap-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => onStartGame('ai')}
            className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white p-5 rounded-2xl font-black text-xl uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all overflow-hidden"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Single Player</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>

          <button
            onClick={() => onStartGame('multiplayer')}
            className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white p-5 rounded-2xl font-black text-xl uppercase tracking-wider shadow-lg border border-slate-600 transition-all opacity-70"
          >
            <Users className="w-6 h-6" />
            <span>Multiplayer (Soon)</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}