"use client";
import React, { useState, useEffect, useRef } from "react";
import { Hand } from "lucide-react";
import { useRouter } from "next/navigation";

import useTimer from "./hooks/useTimer";
import useLight from "./hooks/useLight";
import useProgress from "./hooks/useProgress";
import { GameStateenum } from "@/utils/types/game";

type GameAreaProps = {
  setScore: (score: number) => void;
  setTime: (time: number) => void;
  setState: (state: GameStateenum) => void;
};

const GameArea: React.FC<GameAreaProps> = ({ setScore, setTime, setState }) => {
  const router = useRouter();

  // Audio refs
  const greenSoundRef = useRef<HTMLAudioElement | null>(null);
  const redSoundRef = useRef<HTMLAudioElement | null>(null);

  // Hooks
  const { timer, startTimer, stopTimer, formatTime } = useTimer();
  const { light, gameState, startLightCycle, stopLightCycle } = useLight();
  const { progress, startProgress, stopProgress, resetProgress } = useProgress();

  // Internal state
  const [isHolding, setIsHolding] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState<GameStateenum>(GameStateenum.PLAYING);
  const [progressRunning, setProgressRunning] = useState(false);

  // audio useeffect 
  useEffect(() => {
    greenSoundRef.current = new Audio('/sound/play.mp3');
    redSoundRef.current = new Audio('/sound/stop.mp3');

    // Set audio properties
    if (greenSoundRef.current) {
      greenSoundRef.current.preload = 'auto';
      greenSoundRef.current.volume = 0.8; // Adjust volume 
    }
    if (redSoundRef.current) {
      redSoundRef.current.preload = 'auto';
      redSoundRef.current.volume = 0.8; // Adjust volume 
    }

    // Cleanup
    return () => {
      if (greenSoundRef.current) {
        greenSoundRef.current.pause();
        greenSoundRef.current = null;
      }
      if (redSoundRef.current) {
        redSoundRef.current.pause();
        redSoundRef.current = null;
      }
    };
  }, []);

  // Play sound based on game state
  useEffect(() => {
    if (!gameStarted) return;

    const playSound = async (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0; // Reset to beginning
          await audioRef.current.play();
        } catch (error) {
          console.warn('Audio play failed:', error);
        }
      }
    };

    const stopSound = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    if (gameState === "green") {
      stopSound(redSoundRef);
      playSound(greenSoundRef);
    } else if (gameState === "red") {
      stopSound(greenSoundRef);
      playSound(redSoundRef);
    }
  }, [gameState, gameStarted]);

  // Stop all sounds when game ends
  useEffect(() => {
    if (gameResult !== GameStateenum.PLAYING) {
      if (greenSoundRef.current) {
        greenSoundRef.current.pause();
        greenSoundRef.current.currentTime = 0;
      }
      if (redSoundRef.current) {
        redSoundRef.current.pause();
        redSoundRef.current.currentTime = 0;
      }
    }
  }, [gameResult]);

  // Uplift the state
  useEffect(() => {
    setScore(progress);
    setTime(timer);
    setState(gameResult);
  }, [progress, timer, gameResult, setScore, setTime, setState]);

  // Handle hold start
  const handleStart = () => {
    if (!gameStarted && gameResult === GameStateenum.PLAYING) {
      setGameStarted(true);
      startTimer();
      startLightCycle();
    }
    setIsHolding(true);
  };

  // Handle hold end
  const handleEnd = () => {
    setIsHolding(false);
    stopProgress();
  };

  // Handle holding logic
  useEffect(() => {
    if (!isHolding || gameResult !== GameStateenum.PLAYING) {
      if (progressRunning) {
        stopProgress();
        setProgressRunning(false);
      }
      return;
    }

    if (gameState === "green" && !progressRunning) {
      setProgressRunning(true);
      startProgress((val) => {
        if (val >= 100) {
          setGameResult(GameStateenum.WON);
          setGameStarted(false);
          stopTimer();
          stopLightCycle();
          stopProgress();
          setProgressRunning(false);
        }
      });
    } else if (gameState === "red") {
      stopProgress();
      setProgressRunning(false);
      setGameResult(GameStateenum.OVER);
      setGameStarted(false);
      stopTimer();
      stopLightCycle();
    }
  }, [isHolding, gameState, gameResult, startProgress, stopProgress, stopLightCycle, stopTimer, progressRunning]);

  // Auto game over at 60s
  useEffect(() => {
    if (timer === 60 && gameResult === GameStateenum.PLAYING) {
      setGameResult(GameStateenum.OVER);
      setGameStarted(false);
      stopTimer();
      stopLightCycle();
      stopProgress();
      setProgressRunning(false);
    }
  }, [timer, gameResult, stopLightCycle, stopTimer, stopProgress]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Timer */}
      <div className="my-4">
        <div className="text-2xl font-bold text-center">{formatTime(timer)}</div>
        <div className="text-slate-300 text-xs text-center">Time</div>
      </div>

      {/* Lights */}
      <div className="bg-slate-700/80 rounded-3xl p-4 border-2 border-slate-600 shadow-2xl my-4">
        <div className="space-y-2">
          <div
            className={`w-12 h-12 rounded-full ${
              light === "red"
                ? "bg-red-500 shadow-red-500/50 animate-pulse"
                : "bg-red-900/30 border border-red-800/50"
            }`}
          />
          <div
            className={`w-12 h-12 rounded-full ${
              light === "green"
                ? "bg-emerald-400 shadow-emerald-400/50 animate-pulse"
                : "bg-emerald-900/30 border border-emerald-800/50"
            }`}
          />
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-10">
        <div
          className={`text-3xl font-bold ${
            gameState === "green" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {gameState === "green" ? "GREEN LIGHT" : "RED LIGHT"}
        </div>
        <div className="text-slate-400 text-lg">{gameState === "green" ? "GO!" : "STOP!"}</div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-4">
        <div className="relative h-4 bg-slate-700 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <img
            src="/assets/player.png"
            alt="runner"
            className="absolute top-1/2 -translate-y-14 -translate-x-1 w-16 h-16"
            style={{ left: `calc(${progress}% - 16px)` }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-400 mt-1">
          <span>Start</span>
          <span>{Math.round(progress)}%</span>
          <span>Finish</span>
        </div>
      </div>

      {/* Button */}
      <button
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerLeave={handleEnd}
        onPointerCancel={handleEnd}
        disabled={gameResult !== GameStateenum.PLAYING}
        className={`relative w-40 h-40 rounded-full border-4 ${
          isHolding
            ? "bg-emerald-500/20 border-emerald-400 scale-95 shadow-lg"
            : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
        } ${gameResult !== GameStateenum.PLAYING ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Hand size={50} />
          <div className="text-lg font-semibold">TAP & HOLD</div>
          <div className="text-sm text-slate-400">TO MOVE</div>
        </div>
        {isHolding && gameResult === GameStateenum.PLAYING && (
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
        )}
      </button>
    </div>
  );
};

export default GameArea;