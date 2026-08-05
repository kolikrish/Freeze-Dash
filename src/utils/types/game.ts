export type GameStatus = "active" | "finished";
export enum GameStateenum
{
  WON = "won",
  OVER   = "over",
  PLAYING = "playing"
}
export interface Game {
  createdAt: number;
  expiresAt: number;
  status: GameStatus;
  // A new optional field to track the game's start time for backend timer calculation,
  // in case you switch back from front-end calculation.
  startTime?: number; 
}

export interface Player {
  name: string;
  score: number;
  status: GameStateenum;
  lastSeen: number;
  // The time taken to win the game, in milliseconds.
  // This field is optional because it only applies to the winning player.
  timer?: number;
}

export interface LeaderboardEntry extends Player {
  id: string;
}