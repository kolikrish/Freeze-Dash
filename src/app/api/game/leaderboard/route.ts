import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import db from "@/utils/Db";
import { GameStateenum } from "@/utils/types/game";

interface PlayerData {
  playerId: string;
  score: number;
  state: string;
  timer?: number | null;
  name?: string;
  timestamp?: number;
}

const validateScore = (score: any): number => {
  const num = Number(score);
  return isNaN(num) || num < 0 ? 0 : num;
};

const validateTimer = (timer: any): number | null => {
  if (timer == null) return null;
  const num = Number(timer);
  return isNaN(num) || num <= 0 ? null : num;
};

const sanitizeName = (name: string | undefined, playerId: string): string => {
  return (name || playerId || 'Unknown').trim() || 'Unknown';
};

const sortPlayers = (players: PlayerData[]): PlayerData[] => {
  return players.sort((a, b) => {
    const aScore = validateScore(a.score);
    const bScore = validateScore(b.score);
    const aTimer = validateTimer(a.timer);
    const bTimer = validateTimer(b.timer);
    const aName = sanitizeName(a.name, a.playerId);
    const bName = sanitizeName(b.name, b.playerId);

    // console.log(`Comparing: ${aName}(${aScore}pts, ${aTimer ? aTimer + 's' : 'DNF'}) vs ${bName}(${bScore}pts, ${bTimer ? bTimer + 's' : 'DNF'})`);

    // Primary: Score (highest first)
    if (aScore !== bScore) {
      return bScore - aScore;
    }

    // Secondary: Completion status (completed > not completed)
    const aCompleted = aTimer !== null;
    const bCompleted = bTimer !== null;

    if (aCompleted !== bCompleted) {
      return aCompleted ? -1 : 1;
    }

    // Tertiary: If both completed, faster time wins
    if (aCompleted && bCompleted && aTimer !== bTimer) {
      return aTimer! - bTimer!;
    }

    // Quaternary: Alphabetical by name
    const nameComparison = aName.toLowerCase().localeCompare(bName.toLowerCase());
    if (nameComparison !== 0) {
      return nameComparison;
    }

    // Final: Player ID for absolute consistency
    return a.playerId.localeCompare(b.playerId);
  });
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gameId = url.searchParams.get("gameId");
  const playerId = url.searchParams.get("playerId");

  if (!gameId?.trim()) {
    return NextResponse.json({ error: "Invalid or missing gameId" }, { status: 400 });
  }
  
  if (!playerId?.trim()) {
    return NextResponse.json({ error: "Invalid or missing playerId" }, { status: 400 });
  }

  try {
    // console.log(`Fetching leaderboard for game: ${gameId}, player: ${playerId}`);

    const playersRef = db.collection("games").doc(gameId).collection("players");
    const snapshot = await playersRef.get();

    if (snapshot.empty) {
      return NextResponse.json({
        leaderboard: [],
        player: null,
        metadata: {
          totalPlayers: 0,
          completedPlayers: 0,
          bestTime: null,
        }
      });
    }

    const players: PlayerData[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        playerId: doc.id,
        score: data.score,
        state: data.state || data.status || "playing",
        timer: data.timer,
        name: data.name,
        timestamp: data.timestamp || Date.now(),
      };
    });

    console.log(`Raw players: ${players.length}`);

    const sortedPlayers = sortPlayers(players);

    const completedPlayers = sortedPlayers.filter(p => validateTimer(p.timer) !== null);
    const bestTime = completedPlayers.length > 0 
      ? Math.min(...completedPlayers.map(p => validateTimer(p.timer)!))
      : null;
    const bestScore = sortedPlayers.length > 0
      ? Math.max(...sortedPlayers.map(p => validateScore(p.score)))
      : null;

    const leaderboard = sortedPlayers.slice(0, 25).map(p => ({
      playerId: p.playerId,
      score: validateScore(p.score),
      state: p.state,
      timer: validateTimer(p.timer),
      name: sanitizeName(p.name, p.playerId),
    }));

    const requestingPlayer = sortedPlayers.find(p => p.playerId === playerId);
    const playerRank = requestingPlayer 
      ? sortedPlayers.findIndex(p => p.playerId === playerId) + 1
      : null;

    console.log(`Leaderboard generated: ${leaderboard.length} players`);
    console.log(`Requesting player rank: ${playerRank || 'Not found'}`);

    return NextResponse.json({
      leaderboard,
      player: requestingPlayer ? {
        playerId: requestingPlayer.playerId,
        score: validateScore(requestingPlayer.score),
        state: requestingPlayer.state,
        timer: validateTimer(requestingPlayer.timer),
        name: sanitizeName(requestingPlayer.name, requestingPlayer.playerId),
        rank: playerRank,
      } : null,
      metadata: {
        totalPlayers: sortedPlayers.length,
        completedPlayers: completedPlayers.length,
        bestTime,
        bestScore,
        lastUpdated: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error("Leaderboard error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: "Failed to fetch leaderboard",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}