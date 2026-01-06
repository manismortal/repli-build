import { db } from "../db";
import { agentNumbers, deposits, AgentNumber } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { Parser } from "json2csv";

// Helper to check banking hours (9 AM - 5 PM)
const isBankingHours = () => {
  const now = new Date();
  // Adjust for BD Time (UTC+6) if server is UTC. 
  // For simplicity, we assume server time or simple offset. 
  // Let's assume standard local time for now, or use UTC+6.
  const bdTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  const hours = bdTime.getHours();
  return hours >= 9 && hours < 17; // 09:00 to 16:59
};

// State to hold the current active agent ID for rotation
let currentBkashAgentId: string | null = null;
let currentNagadAgentId: string | null = null;

// Service
export const agentService = {
  
  // Get currently active agent for a provider
  async getActiveAgent(provider: "bkash" | "nagad" | "binance") {
    // 1. Check Banking Hours for Fiat
    if (provider !== "binance" && !isBankingHours()) {
      return { status: "closed", message: "Banking hours are 9 AM - 5 PM" };
    }

    // 2. Get all active agents for the provider
    const agents = await db.select().from(agentNumbers).where(and(
      eq(agentNumbers.provider, provider),
      eq(agentNumbers.isActive, true)
    ));

    if (agents.length === 0) {
      return { status: "unavailable", message: "No agents available" };
    }

    // 3. Binance (24/7, just pick one or rotate simple)
    if (provider === "binance") {
      // Return the most recently created or just the first one
      return { status: "open", agent: agents[0] }; 
    }

    // 4. Fiat Rotation Logic
    // If we have a cached active agent ID, check if it's still valid/active
    let currentId = provider === "bkash" ? currentBkashAgentId : currentNagadAgentId;
    let currentAgent = agents.find(a => a.id === currentId);

    // If no current agent set, or it became inactive/removed, pick a new one (e.g., the first one)
    if (!currentAgent) {
      currentAgent = agents[0];
      if (provider === "bkash") currentBkashAgentId = currentAgent.id;
      else currentNagadAgentId = currentAgent.id;
    }

    return { status: "open", agent: currentAgent };
  },

  // Rotate Agent (Call this every hour via Cron/Interval)
  async rotateAgents() {
    console.log("Rotating agents...");
    
    // Rotate bKash
    const bkashAgents = await db.select().from(agentNumbers).where(and(
      eq(agentNumbers.provider, "bkash"),
      eq(agentNumbers.isActive, true)
    ));
    if (bkashAgents.length > 1) {
      const currentIndex = bkashAgents.findIndex(a => a.id === currentBkashAgentId);
      const nextIndex = (currentIndex + 1) % bkashAgents.length;
      currentBkashAgentId = bkashAgents[nextIndex].id;
    }

    // Rotate Nagad
    const nagadAgents = await db.select().from(agentNumbers).where(and(
      eq(agentNumbers.provider, "nagad"),
      eq(agentNumbers.isActive, true)
    ));
    if (nagadAgents.length > 1) {
      const currentIndex = nagadAgents.findIndex(a => a.id === currentNagadAgentId);
      const nextIndex = (currentIndex + 1) % nagadAgents.length;
      currentNagadAgentId = nagadAgents[nextIndex].id;
    }
  },

  // Admin: Get all agents
  async getAllAgents() {
    return await db.select().from(agentNumbers).orderBy(desc(agentNumbers.createdAt));
  },

  // Admin: Toggle Active
  async toggleAgentStatus(id: string, status: boolean) {
    return await db.update(agentNumbers).set({ isActive: status }).where(eq(agentNumbers.id, id)).returning();
  },

  // Admin: Create Agent
  async createAgent(data: any) {
    return await db.insert(agentNumbers).values(data).returning();
  },

  // Generate CSV Report
  async generateReport(provider: "bkash" | "nagad" | "binance") {
    // Fetch deposits for this provider
    // Note: Schema change required 'method' and 'agentNumber' fields in 'deposits' table
    // We assume 'method' in deposits table matches 'provider' enum
    const results = await db.select({
      trxId: deposits.transactionId,
      userPhone: deposits.userPhoneNumber,
      amount: deposits.amount,
      time: deposits.createdAt,
      agentNumber: deposits.agentNumber,
      status: deposits.status
    })
    .from(deposits)
    .where(eq(deposits.method, provider))
    .orderBy(desc(deposits.createdAt));

    const fields = ['trxId', 'userPhone', 'amount', 'time', 'agentNumber', 'status'];
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
