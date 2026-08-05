import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/Db"; // your firebase-admin instance

export async function POST(req: NextRequest) {
  try {
    const { gameId } = await req.json() as { gameId: string };

    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
    }

    // Reference to the players collection
    const playersRef = db.collection("games").doc(gameId).collection("players");

    // Get all players
    const snapshot = await playersRef.get();

    const totalPlayers = snapshot.size; // total number of players

    return NextResponse.json({ totalPlayers });
  } catch (error) {
    console.error("Error fetching total players:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
