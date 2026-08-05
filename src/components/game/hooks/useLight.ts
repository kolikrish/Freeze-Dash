import { useState, useRef } from "react";

const useLight = () => {
  const [light, setLight] = useState<"green" | "red">("green");
  const [gameState, setGameState] = useState<"green" | "red">("green");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLightCycle = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setLight((prev) => {
        const next = prev === "green" ? "red" : "green";
        setTimeout(() => setGameState(next), 350);
        return next;
      });
    }, Math.random() * 3000 + 2000);
  };

  const stopLightCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { light, gameState, startLightCycle, stopLightCycle };
};

export default useLight;
