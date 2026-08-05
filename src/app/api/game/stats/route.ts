import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import db from "@/utils/Db";
import { GameStateenum, Player } from "@/utils/types/game";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }

  try {
    const snapshot = await db
      .collection("games")
      .doc(gameId)
      .collection("players")
      .get();

    const players = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...(doc.data() as Player) 
    }));

    const onlineCount = players.filter(p => p.status === GameStateenum.PLAYING).length;
    const eliminatedCount = players.filter(p => p.status === GameStateenum.OVER).length;

    return NextResponse.json({
      onlineCount,
      eliminatedCount,
      totalPlayers: players.length
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}