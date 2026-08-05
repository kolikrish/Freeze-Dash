"use client";

import React from "react";

interface StatsProps {
  totalOnline: number;
  bestTime: number | null;
  bestScore?: number | null;
}

const Stats: React.FC<StatsProps> = ({ totalOnline, bestTime, bestScore }) => {
  return (
    <div className="p-4 bg-slate-800/50 rounded-xl my-4 max-w-4xl mx-auto">
      <div className="flex justify-between space-x-8">
        {/* Online Players */}
        <div>
          <div className="text-gray-400 text-sm">Online Players</div>
          <div className="text-white font-bold text-xl">{totalOnline}</div>
        </div>

        {/* Best Time */}
        <div>
          <div className="text-gray-400 text-sm">Best Time</div>
          <div className="text-white font-bold text-xl">
            {bestTime != null ? `${bestTime}s` : "N/A"}
          </div>
        </div>

        {/* Dynamic Best Score */}
        <div>
          <div className="text-gray-400 text-sm">Best Score</div>
          <div className="text-white font-bold text-xl">
            {bestScore != null ? bestScore : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
