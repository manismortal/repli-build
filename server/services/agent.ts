import { storage } from "../storage";
import { Parser } from "json2csv";

// Helper to check banking hours (Dynamic)
const isBankingHours = async () => {
  const settings = await storage.getSiteSettings();
  const start = settings?.bankingStartTime || "09:00";
  const end = settings?.bankingEndTime || "17:00";

  const now = new Date();
  const bdTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  const currentMinutes = bdTime.getHours() * 60 + bdTime.getMinutes();

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

// State to hold the current active agent ID for rotation
let currentBkashAgentId: string | null = null;
let currentNagadAgentId: string | null = null;

// Service
export const agentService = {
  
  // Get currently active agent for a provider (Global / Default)
  async getActiveAgent(provider: "bkash" | "nagad" | "binance") {
    // 1. Check Banking Hours for Fiat
    if (provider !== "binance") {
        const isOpen = await isBankingHours();
        if (!isOpen) {
            const settings = await storage.getSiteSettings();
            const start = settings?.bankingStartTime || "09:00";
            const end = settings?.bankingEndTime || "17:00";
            return { status: "closed", message: `Banking hours are ${start} - ${end}` };
        }
    }

    const allAgents = await storage.getAgentsByProvider(provider);
    const agents = allAgents.filter(a => a.isActive);

    if (agents.length === 0) {
      return { status: "unavailable", message: "No agents available" };
    }

    // Default: Return the first active agent if no rotation logic applied yet
    // The route handler will manage session-based stickiness/rotation using getNextAgent
    return { status: "open", agent: agents[0] }; 
  },

  // Get next agent for rotation (Round Robin or Random)
  async getNextAgent(provider: "bkash" | "nagad" | "binance", currentId?: string) {
    const allAgents = await storage.getAgentsByProvider(provider);
    const agents = allAgents.filter(a => a.isActive);

    if (agents.length === 0) return null;
    if (agents.length === 1) return agents[0];

    if (!currentId) {
        // Return a random one if no current ID
        return agents[Math.floor(Math.random() * agents.length)];
    }

    const currentIndex = agents.findIndex(a => a.id === currentId);
    if (currentIndex === -1) return agents[0];

    // Next one
    const nextIndex = (currentIndex + 1) % agents.length;
    return agents[nextIndex];
  },

  // Rotate Agent (Global rotation - legacy support or background shuffle)
  async rotateAgents() {
     // No-op or keep for global cache invalidation if needed
     console.log("Global agent rotation tick (handled per-session now)");
  },


  // Admin Methods (getAllAgents, toggle, create) removed as they are now in routes via storage

  // Generate CSV Report
  async generateReport(provider: "bkash" | "nagad" | "binance", agentNumber?: string) {
    const allDeposits = await storage.getDepositsWithUsers(provider);
    const deposits = agentNumber 
        ? allDeposits.filter(d => d.agentNumber === agentNumber)
        : allDeposits;
    
    // Map to CSV format
    const results = await Promise.all(deposits.map(async (d) => {
        // Fallback: If deposit record missing phone, check user profile
        let phone = d.userPhoneNumber;
        if (!phone || phone === "N/A") {
             const user = await storage.getUser(d.userId);
             phone = user?.phoneNumber || "N/A";
        }

        return {
            trxId: d.transactionId,
            userPhone: phone, 
            systemUsername: d.username,
            fullName: d.name || "N/A",
            amount: d.amount,
            time: d.createdAt ? new Date(d.createdAt).toISOString().replace("T", " ").substring(0, 19) : "",
            agentNumber: d.agentNumber || "N/A",
            status: d.status
        };
    }));

    const fields = ['trxId', 'userPhone', 'systemUsername', 'fullName', 'amount', 'time', 'agentNumber', 'status'];
    const opts = { fields };
    
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(results);
      return csv;
    } catch (err) {
      console.error(err);
      throw new Error("CSV Generation Failed");
    }
  }
};