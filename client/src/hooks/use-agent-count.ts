import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface AgentCounts {
  bkash: number;
  nagad: number;
  binance: number;
}

export function useAgentCount() {
  const [counts, setCounts] = useState<AgentCounts>({ bkash: 0, nagad: 0, binance: 0 });

  // Initial Fetch
  const { data: initialCounts } = useQuery({
    queryKey: ["/api/agents/count"],
    queryFn: async () => {
      const res = await fetch("/api/agents/count");
      if (!res.ok) return { bkash: 0, nagad: 0, binance: 0 };
      return res.json();
    }
  });

  useEffect(() => {
    if (initialCounts) {
      setCounts(initialCounts);
    }
  }, [initialCounts]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to Agent Count WS");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "agentCountUpdate") {
          setCounts(message.data);
        }
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WS Error", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return counts;
}
