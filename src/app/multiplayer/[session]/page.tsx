"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/game/Navbar";
import GameArea from "@/components/game/GameArea";
import { GameStateenum } from "@/utils/types/game";
import { useDebounce } from "@/components/game/hooks/useDebounce";

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = (params.session as string) || "";
  const playerId = searchParams.get("playerId") || "";
  const playername = searchParams.get("name") || "";

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [state, setState] = useState<GameStateenum>(GameStateenum.PLAYING);
  const [onlineCount, setOnlineCount] = useState(0);
  const [eliminatedCount, setEliminatedCount] = useState(0);

  // Dialog state
  const [name, setName] = useState(playername);
  const [showDialog, setShowDialog] = useState(!playerId); // open dialog if no playerId
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      console.log(name)
      const res = await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: sessionId, name }),
      });

      if (!res.ok) {
        throw new Error("Failed to join game");
      }

      const { playerId } = await res.json();
      const encodedName = encodeURIComponent(name);

      // full page reload so state resets
      window.location.replace(`/multiplayer/${sessionId}?playerId=${playerId}&name=${encodedName}`);
    } catch (err) {
      console.error(err);
      alert("Error joining game");
    } finally {
      setLoading(false);
    }
  };

  const sendUpdate = (currentScore: number, currentTime: number, currentState: GameStateenum) => {
    if (!playerId || !sessionId) return;
    fetch('/api/game/update', {
      method: 'POST',
      body: JSON.stringify({ score: currentScore, timer: currentTime, status: currentState, playerId, gameId: sessionId }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => console.error("Failed to update score:", err));
  };

  const debouncedUpdateScore = useDebounce(() => {
    sendUpdate(score, time, state);
  }, 500);

  useEffect(() => {
    if (state === GameStateenum.WON || state === GameStateenum.OVER) {
      sendUpdate(score, time, state);
    } else if (score > 0) {
      debouncedUpdateScore();
    }
  }, [score, state, time]);

// Auto update stats every 10 seconds
useEffect(() => {
  if (!sessionId) return;

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/game/stats?gameId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOnlineCount(data.onlineCount);
        setEliminatedCount(data.eliminatedCount);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Initial fetch
  fetchStats();

  // Auto-refresh every 10 seconds > SSE
  const interval = setInterval(fetchStats, 10000);

  return () => clearInterval(interval);
}, [sessionId]);

  // Auto redirect after game ends
  useEffect(() => {
    if (state === GameStateenum.OVER || state === GameStateenum.WON) {
      const timer = setTimeout(() => {
        router.push(`/multiplayer/${sessionId}/leaderboard?playerId=${playerId}`);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state, router, sessionId, playerId]);

  return (
    <>
      <Navbar userName={name} playersOnline={onlineCount} playersEliminated={eliminatedCount} />

      {/* Show game area while playing */}
      {state === GameStateenum.PLAYING ? (
        <GameArea setScore={setScore} setTime={setTime} setState={setState} />
      ) : (
        // End screen after game over / won
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {state === GameStateenum.OVER ? "💀 Game Over!" : "🎉 You Won!"}
          </h2>
          <p className="text-lg text-gray-300 mb-6">Final Score: {score}</p>
          <button
            onClick={() =>
              router.push(`/multiplayer/${sessionId}/leaderboard?playerId=${playerId}`)
            }
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow"
          >
            Go to Leaderboard
          </button>
          <p className="text-gray-400 mt-2 text-sm">
            Redirecting in 4 seconds...
          </p>
        </div>
      )}

      {/* Dialog for entering name */}
      {showDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-[#1F2A38] p-6 rounded-xl w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Enter your name</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Your name"
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-emerald-400 text-[#1A212D] font-bold py-2 px-4 rounded-lg hover:bg-emerald-300 transition"
            >
              {loading ? "Joining..." : "Join Game"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
