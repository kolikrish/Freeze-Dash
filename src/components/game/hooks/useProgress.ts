import { useState, useRef } from "react";

const useProgress = () => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = (onFinish?: (val: number) => void) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const newVal = p + 0.5;
        if (newVal >= 100) {
          stopProgress();
          if (onFinish) onFinish(newVal);
          return 100;
        }
        return newVal;
      });
    }, 50);
  };

  const stopProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetProgress = () => setProgress(0);

  return { progress, startProgress, stopProgress, resetProgress };
};

export default useProgress;
