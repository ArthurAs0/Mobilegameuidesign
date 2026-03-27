import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Direction = 'left' | 'center' | 'right';

interface GameArenaProps {
  result: 'goal' | 'save' | 'waiting' | null;
  playerChoice: Direction | null;
  aiChoice: Direction | null;
  homeScore: number;
  awayScore: number;
}

export function GameArena({ result, playerChoice, aiChoice, homeScore, awayScore }: GameArenaProps) {
  const getTargetPosition = (direction: Direction) => {
    switch (direction) {
      case 'left':
        return { x: '25%', y: '35%' };
      case 'center':
        return { x: '50%', y: '40%' };
      case 'right':
        return { x: '75%', y: '35%' };
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Live-feed Container with Glassmorphism */}
      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border-4 border-white/60 shadow-2xl backdrop-blur-xl bg-white/10">
        {/* Stadium Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1705300332068-5f55b46ef98e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBmb290YmFsbCUyMHN0YWRpdW0lMjBncmVlbiUyMGZpZWxkfGVufDF8fHx8MTc3NDYzNDY3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Stadium"
            className="w-full h-full object-cover opacity-90 blur-[2px]"
            unsplashKeywords="bright football stadium"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-800/40 via-transparent to-blue-400/30" />
        </div>

        {/* Field */}
        <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-green-700/50 to-transparent" />

        {/* Goal Post - 3D Style */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[70%] h-[50%] perspective-1000">
          <div className="relative w-full h-full">
            {/* Net */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800/60 to-gray-900/70 rounded-t-3xl border-4 border-white/90 shadow-2xl">
              <div 
                className="absolute inset-0 opacity-25 rounded-t-3xl"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 2px, transparent 2px, transparent 15px),
                                    repeating-linear-gradient(90deg, white 0px, white 2px, transparent 2px, transparent 15px)`,
                }}
              />
            </div>
            {/* Goal posts */}
            <div className="absolute -left-2 top-0 bottom-0 w-3 bg-white rounded-full shadow-xl" />
            <div className="absolute -right-2 top-0 bottom-0 w-3 bg-white rounded-full shadow-xl" />
            <div className="absolute -top-2 left-0 right-0 h-3 bg-white rounded-full shadow-xl" />
          </div>
        </div>

        {/* Goalkeeper - Green Kit #1 */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10">
          <AnimatePresence mode="wait">
            {aiChoice && playerChoice && (
              <motion.div
                key="diving"
                initial={{ x: 0, y: 0, rotate: 0 }}
                animate={{
                  x: aiChoice === 'left' ? -85 : aiChoice === 'right' ? 85 : 0,
                  y: aiChoice === 'center' ? -35 : -20,
                  rotate: aiChoice === 'left' ? -45 : aiChoice === 'right' ? 45 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Goalkeeper body - Green kit */}
                <div className="relative">
                  <div className="w-28 h-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl shadow-2xl border-3 border-green-400 relative">
                    {/* Number 1 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-3xl font-black drop-shadow-lg">1</span>
                    </div>
                    {/* Kit details */}
                    <div className="absolute inset-x-0 top-1/3 h-1 bg-white/20" />
                  </div>
                  
                  {/* Head */}
                  <div className="absolute -top-6 left-4 w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full border-3 border-orange-500 shadow-xl" />
                  
                  {/* Gloves - reaching for ball */}
                  <motion.div 
                    className="absolute top-2 -left-8 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full border-3 border-yellow-500 shadow-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3, repeat: 1 }}
                  />
                  <div className="absolute top-2 -right-4 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full border-3 border-yellow-500 shadow-lg" />
                  
                  {/* Legs */}
                  <div className="absolute bottom-2 right-4 w-7 h-20 bg-gradient-to-b from-green-600 to-green-800 rounded-lg shadow-md transform rotate-25" />
                </div>
              </motion.div>
            )}
            {!playerChoice && (
              <motion.div
                key="ready"
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="relative">
                  <div className="w-20 h-24 bg-gradient-to-b from-green-500 via-green-600 to-green-700 rounded-xl shadow-2xl border-3 border-green-400 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-2xl font-black drop-shadow-lg">1</span>
                    </div>
                  </div>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-9 h-9 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full border-2 border-orange-500 shadow-xl" />
                  <div className="absolute top-4 -left-5 w-8 h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full border-2 border-yellow-500 shadow-lg" />
                  <div className="absolute top-4 -right-5 w-8 h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full border-2 border-yellow-500 shadow-lg" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Striker - Blue Kit #10 (bottom of screen) */}
        {playerChoice && (
          <motion.div
            className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-5"
            initial={{ scale: 1 }}
            animate={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <div className="relative">
              {/* Striker body - Blue kit */}
              <div className="w-20 h-24 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-2xl border-3 border-blue-400 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-black drop-shadow-lg">10</span>
                </div>
                <div className="absolute inset-x-0 top-1/3 h-1 bg-white/20" />
              </div>
              
              {/* Head */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-9 h-9 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full border-2 border-orange-500 shadow-xl" />
              
              {/* Kicking leg */}
              <motion.div 
                className="absolute -bottom-2 left-1/2 w-6 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-md origin-top"
                initial={{ rotate: 0 }}
                animate={{ rotate: 45 }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </motion.div>
        )}

        {/* Ball with Glowing Trajectory Line */}
        <AnimatePresence>
          {playerChoice && (
            <>
              {/* Trajectory Line - Glowing Yellow/Blue */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none z-15"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <defs>
                  <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#eab308" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <motion.path
                  d={`M 50% 92% Q ${playerChoice === 'center' ? '50%' : playerChoice === 'left' ? '40%' : '60%'} 60%, ${getTargetPosition(playerChoice).x} ${getTargetPosition(playerChoice).y}`}
                  stroke="url(#trajectoryGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </motion.svg>

              {/* Ball following trajectory */}
              <motion.div
                key="ball"
                className="absolute z-20"
                initial={{ 
                  left: '50%',
                  bottom: '8%',
                  x: '-50%',
                }}
                animate={{
                  left: getTargetPosition(playerChoice).x,
                  top: getTargetPosition(playerChoice).y,
                  x: '-50%',
                  y: '-50%',
                }}
                transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative">
                  {/* Ball glow */}
                  <div className="absolute inset-0 w-12 h-12 bg-yellow-400 rounded-full blur-xl opacity-60" />
                  
                  {/* Ball */}
                  <motion.div
                    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl border-3 border-gray-300"
                    animate={{ rotate: 720 }}
                    transition={{ duration: 0.65, ease: 'linear' }}
                  >
                    <div className="absolute top-1 left-1 w-4 h-4 bg-black rounded-sm rotate-45 opacity-80" />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-black rounded-sm rotate-12 opacity-80" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/70 via-transparent to-transparent rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Top UI Overlays */}
        <div className="absolute top-4 left-0 right-0 px-4 z-30">
          <div className="flex items-center justify-between">
            {/* Live Badge */}
            <motion.div
              className="flex items-center gap-2 bg-red-600/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border-2 border-white/50"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-2.5 h-2.5 bg-white rounded-full"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-white text-sm font-black uppercase tracking-wide">Live</span>
            </motion.div>

            {/* Scoreboard - HOME vs AWAY */}
            <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border-2 border-white/70">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-bold text-sm uppercase">Home</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-gray-900 tabular-nums">{homeScore}</span>
                  <span className="text-gray-500 font-bold">-</span>
                  <span className="text-2xl font-black text-gray-900 tabular-nums">{awayScore}</span>
                </div>
                <span className="text-gray-700 font-bold text-sm uppercase">Away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Choice Confirmed Badge */}
        <AnimatePresence>
          {playerChoice && (
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-green-500/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-white/60">
                <span className="text-white text-base font-black uppercase tracking-wider">
                  ✓ Choice Confirmed
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Overlay */}
        <AnimatePresence>
          {result && result !== 'waiting' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {result === 'goal' ? (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(234,179,8,1)]">
                    GOAL! ⚽
                  </div>
                  <div className="text-2xl text-yellow-300 mt-4 font-bold uppercase tracking-wide drop-shadow-lg">
                    Perfect Shot!
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5, x: -30 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(34,197,94,1)]">
                    SAVED! 🧤
                  </div>
                  <div className="text-2xl text-green-300 mt-4 font-bold uppercase tracking-wide drop-shadow-lg">
                    Incredible Save!
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waiting State */}
        {!playerChoice && result === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <motion.div
              className="text-center"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg mb-3">
                Ready to Shoot?
              </div>
              <div className="text-yellow-300 text-lg font-bold drop-shadow">
                Pick your target below ⚡
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
