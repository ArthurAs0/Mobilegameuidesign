import { motion } from 'motion/react';
import { Play, Settings } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (mode: 'ai' | 'multiplayer') => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Stadium Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1765130729127-f734df4dff3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdGFkaXVtJTIwY3Jvd2QlMjBkYXlsaWdodHxlbnwxfHx8fDE3NzQ2MzQ2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-blue-50/40 to-green-50/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-green-500 to-blue-600 mb-2 tracking-tight drop-shadow-lg">
            PENALTY
          </h1>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
            DUEL
          </h2>
          <p className="text-gray-700 text-sm mt-4 tracking-wide font-semibold uppercase">
            Master the Perfect Shot
          </p>
        </motion.div>

        {/* Main Play Button */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onStartGame('ai')}
          className="group relative mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-3xl blur-2xl scale-110" />
          
          <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 hover:from-green-400 hover:via-emerald-400 hover:to-blue-400 rounded-3xl px-20 py-7 flex items-center gap-4 shadow-2xl transition-all duration-300 border-2 border-white/30">
            <Play className="w-10 h-10 text-white fill-white" />
            <span className="text-3xl font-black text-white tracking-wide uppercase">
              Play
            </span>
          </div>
        </motion.button>

        {/* Secondary Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col gap-3 w-full max-w-sm"
        >
          <button
            onClick={() => onStartGame('multiplayer')}
            className="w-full bg-white/70 backdrop-blur-md hover:bg-white/90 rounded-2xl px-6 py-4 shadow-xl border-2 border-white/50 transition-all duration-300"
          >
            <span className="text-gray-800 font-bold text-lg">
              Two Players
            </span>
          </button>

          <button
            className="w-full bg-white/50 backdrop-blur-md hover:bg-white/70 rounded-2xl px-6 py-3 shadow-lg border-2 border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-semibold">
              Settings
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
