
import { NextResponse } from "next/server";
// Assuming you have a server-side utility that initializes and exports
// the Firestore database from firebase-admin.
// You will need to create a file at "@/utils/admin-db.ts" or similar path.
import  db  from "@/utils/Db";


// Define the shape of a game object for type safety
interface Game {
  createdAt: number;
  expiresAt: number;
  status: "active" | "completed" | "expired";
}

export async function POST(req: Request) {
  try {
    // The framework handles this for you if a method is not exported.
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const newGame: Game = {
      createdAt: Date.now(),
      expiresAt,
      status: "active",
    };

    // Add the new game document to the 'games' collection in Firestore.
    // Ensure 'games' is the correct collection name in your database.
    // The firebase-admin SDK uses a slightly different syntax.
    const gamesCollection = db.collection("games");
    const gameRef = await gamesCollection.add(newGame);

    // Use NextResponse.json to return a JSON response.
    return NextResponse.json({ gameId: gameRef.id, expiresAt }, { status: 200 });

  } catch (error) {
    // It's good practice to handle potential errors.
    console.error("Error creating new game:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
