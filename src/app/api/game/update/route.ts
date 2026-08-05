import { NextRequest, NextResponse } from "next/server";
// Assuming you have a server-side utility that initializes and exports
// the Firestore database from firebase-admin.
import db from "@/utils/Db"; // Changed import to reflect firebase-admin
import { GameStateenum} from "@/utils/types/game";


export async function POST(req: NextRequest) {
    try {
        const { gameId, playerId, score, status, timer } = await req.json() as {
            gameId: string;
            playerId: string;
            score: number;
            status: GameStateenum;
            timer?: number; // Make timer optional
        };

        const gameDoc = await db.collection("games").doc(gameId).get();
        if (!gameDoc.exists) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const gameData = gameDoc.data();
        if (gameData?.expiresAt && Date.now() > gameData.expiresAt) {
            return NextResponse.json({ error: "Game session has expired" }, { status: 400 });
        }

        const playerRef = db.collection("games").doc(gameId).collection("players").doc(playerId);
        
        let updateData: any = {
            score,
            status,
            state: status,
            lastSeen: Date.now(),
        };

        // Check if a timer was sent and the player has won
        if (status === GameStateenum.WON && timer !== undefined) {
            updateData.timer = timer;
        }

        await playerRef.set(updateData, { merge: true });

        return NextResponse.json({ message: "Player updated successfully" });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
