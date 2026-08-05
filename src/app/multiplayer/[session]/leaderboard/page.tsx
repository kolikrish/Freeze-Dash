"use client";

import React, { useEffect, useState } from "react";
import { Users, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import LeaderboardList from "@/components/LeaderboardList";
import Stats from "@/components/Stats";
import { useParams, useSearchParams } from "next/navigation";

type LeaderboardItem = {
  playerId: string;
  score: number;
  state: string;
  timer?: number | null;
  name?: string;
};

const Page = () => {
  const params = useParams();
  const sessionId = params?.session as string;
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerId") ?? "";

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [player, setPlayer] = useState<LeaderboardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [totalOnline, setTotalOnline] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch leaderboard data
  const fetchLeaderboard = async (isManualRefresh = false) => {
    if (!sessionId || !playerId) return;

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`/api/game/leaderboard?gameId=${sessionId}&playerId=${playerId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const topPlayers: LeaderboardItem[] = data.leaderboard || [];
      setLeaderboard(topPlayers);

      const currentPlayer: LeaderboardItem | null = data.player || null;
      setPlayer(currentPlayer);

      // Player rank in the top 25
      const rankIndex = topPlayers.findIndex((p) => p.playerId === playerId);
      setPlayerRank(rankIndex >= 0 ? rankIndex + 1 : null);

      // Best time among finished players
      const finishedPlayers = topPlayers.filter((p) => p.timer != null);
      const minTime = data.metadata?.bestTime ?? (finishedPlayers.length
        ? Math.min(...finishedPlayers.map((p) => p.timer!))
        : null);
      setBestTime(minTime);

      const maxScore = data.metadata?.bestScore ?? (topPlayers.length
        ? Math.max(...topPlayers.map((p) => p.score))
        : null);
      setBestScore(maxScore);

      setTotalOnline(data.metadata?.totalPlayers ?? topPlayers.length);
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      // You could add error state handling here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeaderboard();
  }, [sessionId, playerId]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchLeaderboard(true);
  };

  return (
    <div className="min-h-screen bg-[#1A212D] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50">
        <Link
          href={`/multiplayer/${sessionId}`}
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:block">Back to Game</span>
        </Link>

        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold bg-emerald-400 bg-clip-text text-transparent">
            LEADERBOARD
          </h1>
          <p className="text-gray-400 text-sm md:text-md">Top Players</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:opacity-50 rounded-lg transition-colors text-xs md:text-md font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-3 h-3 md:w-5 md:h-5" />
            <span>{totalOnline} <span className="hidden md:block">online</span></span>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="px-6 py-2 bg-slate-800/30 border-b border-slate-700/30">
          <p className="text-xs text-gray-400 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Stats Summary */}
      <Stats totalOnline={totalOnline} bestTime={bestTime} bestScore={bestScore} />

      {/* Leaderboard List */}
      <LeaderboardList players={leaderboard} loading={loading} />

      {/* Your Rank */}
      {player && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1F2A38]/50 backdrop-blur-sm border-t border-slate-700/50 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-semibold">Your Rank</div>
                <div className="text-sm text-gray-400">
                  {playerRank ? `#${playerRank}` : "Not in Top 25"} — {player.name ?? player.playerId} {player.state}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400">{player.score} pts</div>
              {player.timer != null && (
                <div className="text-sm text-gray-400">Best: {player.timer}s</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;