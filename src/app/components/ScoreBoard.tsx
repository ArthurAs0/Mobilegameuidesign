import { Trophy, Target } from 'lucide-react';

interface ScoreBoardProps {
  playerScore: number;
  aiScore: number;
  round: number;
}

export function ScoreBoard({ playerScore, aiScore, round }: ScoreBoardProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600/90 to-green-600/90 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-4 shadow-2xl">
        {/* Player Score */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-300" />
            <span className="text-xs uppercase tracking-wider text-white font-bold drop-shadow">You</span>
          </div>
          <div className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{playerScore}</div>
        </div>

        {/* Round Indicator */}
        <div className="flex flex-col items-center gap-1 px-6">
          <span className="text-xs text-white/80 uppercase tracking-wider font-semibold">Round</span>
          <div className="text-2xl font-black text-white tabular-nums drop-shadow">{round}</div>
          <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
        </div>

        {/* AI Score */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-xs uppercase tracking-wider text-white font-bold drop-shadow">AI</span>
          </div>
          <div className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{aiScore}</div>
        </div>
      </div>
    </div>
  );
}