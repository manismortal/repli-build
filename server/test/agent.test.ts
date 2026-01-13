import { MemStorage } from "../storage";
import assert from "assert";

async function runTests() {
  console.log("Running Agent Management Tests...");
  
  const storage = new MemStorage();
  
  // Test 1: Create Agent
  console.log("Test 1: Create Agent");
  const agent1 = await storage.createAgent({
      provider: "bkash",
      number: "01700000000",
      isActive: true
  });
  assert.strictEqual(agent1.provider, "bkash");
  assert.strictEqual(agent1.number, "01700000000");
  assert.strictEqual(agent1.isActive, true);
  console.log("✅ Passed");

  // Test 2: Get All Agents
  console.log("Test 2: Get All Agents");
  const agents = await storage.getAllAgents();
  assert.strictEqual(agents.length, 1);
  console.log("✅ Passed");

  // Test 3: Get Agents By Provider
  console.log("Test 3: Get Agents By Provider");
  const bkashAgents = await storage.getAgentsByProvider("bkash");
  const nagadAgents = await storage.getAgentsByProvider("nagad");
  assert.strictEqual(bkashAgents.length, 1);
  assert.strictEqual(nagadAgents.length, 0);
  console.log("✅ Passed");

  // Test 4: Update Agent
  console.log("Test 4: Update Agent");
  const updated = await storage.updateAgent(agent1.id, { number: "01800000000" });
  assert.strictEqual(updated.number, "01800000000");
  
  const fetched = (await storage.getAllAgents()).find(a => a.id === agent1.id);
  assert.strictEqual(fetched?.number, "01800000000");
  console.log("✅ Passed");

  // Test 5: Toggle Status
  console.log("Test 5: Toggle Status");
  const toggled = await storage.toggleAgentStatus(agent1.id, false);
  assert.strictEqual(toggled.isActive, false);
  console.log("✅ Passed");

  // Test 6: Delete Agent
  console.log("Test 6: Delete Agent");
  await storage.deleteAgent(agent1.id);
  const remaining = await storage.getAllAgents();
  assert.strictEqual(remaining.length, 0);
  console.log("✅ Passed");

  console.log("All Tests Passed Successfully!");
}

runTests().catch(e => {
    console.error("Test Failed:", e);
    process.exit(1);
});
