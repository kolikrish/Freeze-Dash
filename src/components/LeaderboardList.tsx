import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

export type LeaderboardItem = {
  playerId: string;
  score: number;
  state: string;
  timer?: number | null;
  name?: string;
};

interface LeaderboardListProps {
  players: LeaderboardItem[];
  loading?: boolean;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ players, loading }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-400 font-bold text-lg">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 1: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 2: return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default: return "bg-slate-800/50 border-slate-700/50";
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-400">Loading leaderboard...</div>;
  }
  if (!players?.length) {
    return <div className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-400">No players yet</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pb-8">
      <div className="space-y-3">
        {players.map((p, index) => (
          <div
            key={p.playerId}
            className={`flex items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${getRankBg(index)}`}
          >
            <div className="flex items-center justify-center w-12 h-12 mr-4">
              {getRankIcon(index)}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-lg">{p.name ?? p.playerId}</div>
              <div className="text-sm text-gray-400">Rank #{index + 1}</div>
            </div>

            <div className="text-right mr-6">
              <div className="text-xl font-bold text-emerald-400">{p.score.toLocaleString()}</div>
              <div className="text-sm text-gray-400">points</div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-emerald-300">{p.timer != null ? `${p.timer}s` : "--"}</div>
              <div className="text-sm text-gray-400">time</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardList;
