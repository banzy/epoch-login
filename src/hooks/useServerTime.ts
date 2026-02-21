import { useState, useEffect, useCallback, useRef } from 'react';

export const useServerTime = () => {
  const [time, setTime] = useState(new Date());
  const [isSynced, setIsSynced] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startLocalClock = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime(new Date());
      }, 1000);
    }
  }, []);

  const stopLocalClock = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3007');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Clock sync connected, stopping local fallback');
        setIsSynced(true);
        stopLocalClock();
      };

      ws.onmessage = (event) => {
        setTime(new Date(event.data));
      };

      ws.onclose = () => {
        console.log('Clock sync disconnected, starting local fallback');
        setIsSynced(false);
        startLocalClock();
        // Try to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        console.log('Clock sync error, ensuring local fallback');
        setIsSynced(false);
        startLocalClock();
      };
    };

    startLocalClock();
    connectWebSocket();

    return () => {
      stopLocalClock();
      if (wsRef.current) wsRef.current.close();
    };
  }, [startLocalClock, stopLocalClock]);

  return { time, isSynced };
};
