import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Configuration
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes idle threshold
const HEARTBEAT_INTERVAL = 2 * 60 * 1000; // Ping server every 2 minutes

export function useActivityTracker() {
  const [location] = useLocation();
  const lastActivityRef = useRef<number>(Date.now());
  const isIdleRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. Events to track user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      isIdleRef.current = false;
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // 2. Heartbeat Interval
    const heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      if (timeSinceLastActivity < IDLE_TIMEOUT) {
        // User is active, send heartbeat
        fetch('/api/user/heartbeat', { method: 'POST' })
          .catch(err => console.error("Heartbeat failed", err));
      } else {
        isIdleRef.current = true;
      }
    }, HEARTBEAT_INTERVAL);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      clearInterval(heartbeatInterval);
    };
  }, []);

  // Track page changes as activity
  useEffect(() => {
      lastActivityRef.current = Date.now();
  }, [location]);
}
