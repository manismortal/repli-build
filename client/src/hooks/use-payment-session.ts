import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function usePaymentSession(durationSeconds: number = 50) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Reset timer on mount
    setTimeLeft(durationSeconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLocation("/wallet");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationSeconds, setLocation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return { timeLeft, formatTime };
}
