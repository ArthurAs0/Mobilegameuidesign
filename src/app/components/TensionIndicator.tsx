import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface TensionIndicatorProps {
  tension: number; // 0-100
  isActive: boolean;
}

export function TensionIndicator({ tension, isActive }: TensionIndicatorProps) {
  const getTensionColor = () => {
    if (tension < 30) return 'from-green-400 to-emerald-500';
    if (tension < 60) return 'from-yellow-400 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getTensionText = () => {
    if (tension < 30) return 'CALM';
    if (tension < 60) return 'TENSE';
    return 'CRITICAL';
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      <div className="relative">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${tension > 60 ? 'text-red-500' : 'text-yellow-500'}`} />
            <span className="text-sm uppercase tracking-wider text-white font-bold drop-shadow">
              Pressure
            </span>
          </div>
          <span className={`text-sm font-black uppercase tracking-wider drop-shadow ${
            tension > 60 ? 'text-red-400' : tension > 30 ? 'text-orange-400' : 'text-green-400'
          }`}>
            {getTensionText()}
          </span>
        </div>

        {/* Bar Background */}
        <div className="relative h-3 bg-gray-800/60 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
          {/* Animated Fill */}
          <motion.div
            className={`h-full bg-gradient-to-r ${getTensionColor()} rounded-full shadow-lg`}
            initial={{ width: 0 }}
            animate={{ width: `${tension}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Pulse effect when active and high tension */}
          {isActive && tension > 60 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-orange-400/50 rounded-full"
              animate={{
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Glow effect */}
        {tension > 60 && (
          <motion.div
            className="absolute inset-0 rounded-full blur-lg opacity-60"
            style={{
              background: `linear-gradient(to right, rgb(248, 113, 113), rgb(251, 146, 60))`,
              width: `${tension}%`,
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
    </div>
  );
}