"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const MultiplayerPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [createdSession, setCreatedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "join" | null>(null);
  // Add a new state variable to store and display error messages
  const [error, setError] = useState<string | null>(null);

  const handleCreateSession = async () => {
    setIsLoading(true);
    setMode("create");
    // Clear any previous errors when a new action is initiated
    setError(null);
    try {
      const res = await fetch("/api/game/create", {
        method: "POST",
      });
      const data = await res.json();
      console.log("Session created:", data.gameId);
      setCreatedSession(data.gameId);
      setSessionId(data.gameId);
    } catch (err) {
      console.error("Error creating session:", err);
      // Display a generic error message for network issues
      setError("Failed to create session. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinOrPlay = async () => {
    // Clear any previous errors before trying to join
    setError(null);
    if (!sessionId.trim() || !username.trim()) {
      setError("Please enter a valid Session ID and Username.");
      return;
    }
    setIsLoading(true);
    setMode("join");

    try {
      const res = await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: sessionId, name: username }),
      });

      // Check if the response was not successful
      if (!res.ok) {
        // Parse the JSON response to get the error message from the API
        const errorData = await res.json();
        // Set the error state with the message from the API
        setError(errorData.message || "An unknown error occurred.");
        // Throw an error to trigger the catch block if needed, or just return
        throw new Error(errorData.message || "Join failed");
      }
      
      const data = await res.json();
      const { playerId } = data;

      // If successful, navigate to the game page with both IDs
      router.push(`/multiplayer/${sessionId}?playerId=${playerId}&name=${encodeURIComponent(username)}`);

    } catch (err) {
      console.error("Error joining session:", err);
      // Set a generic error message if the fetch request fails
      if (!error) { // Avoid overwriting a more specific API error
        setError("An error occurred while joining. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="w-full max-w-md space-y-6 bg-[#1F2A38] p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center">
          Multiplayer Mode
        </h1>
        {/* Conditionally render the error message */}
        {error && (
          <div className="text-center text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Create Session */}
        <div className="space-y-3">
          <button
            onClick={handleCreateSession}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading && mode === "create" ? "Creating..." : "Create Session"}
          </button>
          {createdSession && (
            <p className="text-gray-300 text-center text-sm">
              Session created: <span className="font-mono">{createdSession}</span>
            </p>
          )}
        </div>

        <div className="text-center text-gray-400">OR</div>

        {/* Join Session */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 transition-colors"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 transition-colors"
          />
          <button
            onClick={handleJoinOrPlay}
            disabled={isLoading || !username.trim() || !sessionId.trim()}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading && mode === "join" ? "Joining..." : "Join / Play"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerPage;
