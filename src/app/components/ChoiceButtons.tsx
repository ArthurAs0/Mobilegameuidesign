import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Circle, ArrowRight } from 'lucide-react';

type Direction = 'left' | 'center' | 'right';

interface ChoiceButtonsProps {
  onChoice: (direction: Direction) => void;
  disabled: boolean;
}

export function ChoiceButtons({ onChoice, disabled }: ChoiceButtonsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-auto backdrop-blur-md bg-black/30 p-4 rounded-3xl border border-white/10 flex justify-between gap-3 shadow-2xl">
      
      {/* Кнопка LEFT */}
      <motion.button
        onClick={() => onChoice('left')}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border-2 border-b-8 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed bg-blue-900 border-blue-950' : 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-400 border-b-blue-900 hover:border-blue-300 hover:brightness-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
        }`}
      >
        <ArrowLeft className="w-8 h-8 text-white drop-shadow-md" />
        <span className="text-white font-black uppercase tracking-wider text-sm drop-shadow-md">Left</span>
      </motion.button>

      {/* Кнопка CENTER */}
      <motion.button
        onClick={() => onChoice('center')}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border-2 border-b-8 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed bg-green-900 border-green-950' : 'bg-gradient-to-b from-green-500 to-green-700 border-green-400 border-b-green-900 hover:border-green-300 hover:brightness-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
        }`}
      >
        <Circle className="w-7 h-7 text-white drop-shadow-md border-[3px] border-white rounded-full" />
        <span className="text-white font-black uppercase tracking-wider text-sm drop-shadow-md mt-1">Center</span>
      </motion.button>

      {/* Кнопка RIGHT */}
      <motion.button
        onClick={() => onChoice('right')}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border-2 border-b-8 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed bg-red-900 border-red-950' : 'bg-gradient-to-b from-red-500 to-red-700 border-red-400 border-b-red-900 hover:border-red-300 hover:brightness-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
        }`}
      >
        <ArrowRight className="w-8 h-8 text-white drop-shadow-md" />
        <span className="text-white font-black uppercase tracking-wider text-sm drop-shadow-md">Right</span>
      </motion.button>

    </div>
  );
}