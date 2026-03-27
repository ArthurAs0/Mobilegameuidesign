import { motion } from 'motion/react';
import { ArrowLeft, Circle, ArrowRight } from 'lucide-react';

type Direction = 'left' | 'center' | 'right';

interface ChoiceButtonsProps {
  onChoice: (direction: Direction) => void;
  disabled: boolean;
}

export function ChoiceButtons({ onChoice, disabled }: ChoiceButtonsProps) {
  const buttons: { 
    direction: Direction; 
    icon: typeof ArrowLeft; 
    label: string; 
    gradient: string;
    color: string;
  }[] = [
    { 
      direction: 'left', 
      icon: ArrowLeft, 
      label: 'LEFT', 
      gradient: 'from-blue-500 to-blue-600',
      color: 'blue'
    },
    { 
      direction: 'center', 
      icon: Circle, 
      label: 'CENTER', 
      gradient: 'from-green-500 to-emerald-600',
      color: 'green'
    },
    { 
      direction: 'right', 
      icon: ArrowRight, 
      label: 'RIGHT', 
      gradient: 'from-red-500 to-red-600',
      color: 'red'
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Instruction text */}
      {!disabled && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-700 font-bold text-sm mb-4 uppercase tracking-wider"
        >
          Choose Your Shot Direction
        </motion.p>
      )}
      
      <div className="flex gap-4 justify-center">
        {buttons.map(({ direction, icon: Icon, label, gradient, color }) => (
          <motion.button
            key={direction}
            onClick={() => onChoice(direction)}
            disabled={disabled}
            className={`
              relative flex-1 flex flex-col items-center justify-center gap-3 py-8 px-6
              bg-gradient-to-br ${gradient}
              border-3 border-white/50 rounded-3xl shadow-2xl
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
              hover:border-white/70 hover:-translate-y-1
              backdrop-blur-sm
            `}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-3xl" />
            
            {/* Icon */}
            <Icon 
              className="w-12 h-12 relative z-10 text-white drop-shadow-lg" 
              strokeWidth={3}
              fill={direction === 'center' ? 'none' : 'currentColor'}
            />
            
            {/* Label */}
            <span className="text-lg font-black uppercase tracking-wider relative z-10 text-white drop-shadow-lg">
              {label}
            </span>

            {/* Active indicator */}
            {!disabled && (
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg border-2 border-white"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
