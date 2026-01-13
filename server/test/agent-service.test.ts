
import { agentService } from "../services/agent";
import { storage } from "../storage";
import assert from "assert";

// Helper to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  console.log("Running Agent Service Unit Tests...");
  console.log("===================================");

  // 1. Setup: Create Agents
  // Clean up any existing? MemStorage starts fresh if we are running this script standalone.
  // But if storage is a singleton module, it might be shared if we were in a persistent process.
  // Here, running `tsx ...` starts a new process, so MemStorage is empty (except for seed data if routes.ts was imported, but we import storage/agent directly).
  // Wait, `routes.ts` seeds data. We are NOT importing `routes.ts`. So storage is empty.
  
  const agent1 = await storage.createAgent({
      provider: "bkash",
      number: "01711111111",
      isActive: true
  });
  
  const agent2 = await storage.createAgent({
      provider: "bkash",
      number: "01722222222",
      isActive: true
  });
  
  console.log("Created 2 Active bKash Agents:", agent1.number, agent2.number);

  // =========================================================
  // Test Case 1: Banking Hours (CLOSED)
  // =========================================================
  console.log("\nTest 1: Banking Hours Check (Closed Time)");
  
  // Mock Date to 8 PM (20:00) BD Time (+6)
  // 20:00 BD = 14:00 UTC
  const originalDate = global.Date;
  
  class MockDateClosed extends originalDate {
      constructor(...args: any[]) {
          if (args.length) {
              super(...args);
          } else {
              // Return fixed time: 8 PM BD
              super("2026-01-11T20:00:00+06:00");
          }
      }
      static now() {
          return new MockDateClosed().getTime();
      }
  }
  
  global.Date = MockDateClosed as any;
  
  const resultClosed = await agentService.getActiveAgent("bkash");
  // Expected: status "closed"
  try {
      assert.strictEqual(resultClosed.status, "closed");
      console.log("✅ Passed: Banking hours enforced correctly (Closed at 8 PM).");
  } catch (e) {
      console.error("❌ Failed: Expected 'closed', got", resultClosed);
      process.exit(1);
  }

  // =========================================================
  // Test Case 2: Banking Hours (OPEN)
  // =========================================================
  console.log("\nTest 2: Banking Hours Check (Open Time)");
  
  // Mock Date to 10 AM (10:00) BD Time
  class MockDateOpen extends originalDate {
      constructor(...args: any[]) {
          if (args.length) {
              super(...args);
          } else {
              // Return fixed time: 10 AM BD
              super("2026-01-11T10:00:00+06:00");
          }
      }
      static now() {
          return new MockDateOpen().getTime();
      }
  }
  global.Date = MockDateOpen as any;
  
  const resultOpen = await agentService.getActiveAgent("bkash");
  
  try {
      assert.strictEqual(resultOpen.status, "open");
      assert.ok(resultOpen.agent);
      console.log(`✅ Passed: Service open at 10 AM. Active Agent: ${resultOpen.agent?.number}`);
  } catch (e) {
      console.error("❌ Failed: Expected 'open', got", resultOpen);
      process.exit(1);
  }

  // =========================================================
  // Test Case 3: Agent Rotation
  // =========================================================
  console.log("\nTest 3: Agent Rotation Logic");
  
  // First call should return Agent 1 (or whichever picked first)
  // Note: logic says "if no current set, pick first".
  
  // Reset Date to normal? No, keep it OPEN.
  
  // We already called getActiveAgent once, so current agent IS set.
  // Let's capture who it is.
  const currentAgent = resultOpen.agent;
  assert.ok(currentAgent);
  console.log(`Current Active: ${currentAgent.number}`);
  
  // Rotate!
  console.log(">> Rotating Agents...");
  await agentService.rotateAgents();
  
  // Get Again
  const resultRotated = await agentService.getActiveAgent("bkash");
  const nextAgent = resultRotated.agent;
  assert.ok(nextAgent);
  console.log(`New Active: ${nextAgent.number}`);
  
  try {
      assert.notStrictEqual(currentAgent.id, nextAgent.id);
      console.log("✅ Passed: Agent rotated successfully.");
  } catch (e) {
      console.error("❌ Failed: Agent did NOT rotate. Still " + currentAgent.number);
      process.exit(1);
  }
  
  // Rotate Again (Should loop back)
  console.log(">> Rotating Agents Again...");
  await agentService.rotateAgents();
  
  const resultLooped = await agentService.getActiveAgent("bkash");
  const loopedAgent = resultLooped.agent;
  assert.ok(loopedAgent);
  console.log(`Next Active: ${loopedAgent.number}`);
  
  try {
      assert.strictEqual(loopedAgent.id, currentAgent.id);
      console.log("✅ Passed: Agent rotation looped back to first agent.");
  } catch (e) {
      console.error("❌ Failed: Agent did NOT loop back.");
      process.exit(1);
  }

  // Restore Date
  global.Date = originalDate;
  
  console.log("\nAll Tests Passed Successfully!");
}

runTests().catch(e => {
    console.error("Test Suite Error:", e);
    process.exit(1);
});
