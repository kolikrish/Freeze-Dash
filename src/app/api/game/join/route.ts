import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import db from "@/utils/Db";
import { v4 as uuidv4 } from "uuid";
import { GameStateenum, Player } from "@/utils/types/game";


/**
 * Handles POST requests to add a player to a specific game.
 * It first checks if the game exists and returns an error if not found.
 * @param req The incoming request object containing gameId and player name.
 * @returns A NextResponse object with the player ID and a JWT token.
 */
export async function POST(req: NextRequest) {
  try {
    const { gameId, name } = await req.json() as { gameId: string; name: string };
    
    // Check if the gameId is provided in the request body
    if (!gameId) {
      return NextResponse.json({ message: "Game ID is required" }, { status: 400 });
    }

    // Check if the game exists in the database before adding a player
    const gameRef = db.collection("games").doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      // Return an error message if the game document is not found
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    const gameData = gameDoc.data();
    if (gameData?.expiresAt && Date.now() > gameData.expiresAt) {
      return NextResponse.json({ message: "Game session has expired" }, { status: 400 });
    }

    const playerId = uuidv4();

    const newPlayer: Player = {
      name,
      score: 0,
      status: GameStateenum.PLAYING,
      lastSeen: Date.now()
    };

    await gameRef.collection("players").doc(playerId).set(newPlayer);
   

    return NextResponse.json({ playerId });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
