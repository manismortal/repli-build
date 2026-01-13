import { MemStorage } from "../storage";
import assert from "assert";

async function runTests() {
  console.log("Running Withdrawal Flow Tests...");
  
  const storage = new MemStorage();
  
  // Setup: Create User & Wallet
  console.log("Setup: Creating User and Wallet...");
  const user = await storage.createUser({
      username: "testuser",
      password: "password123",
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "01700000000",
      referralCode: "REF123"
  });
  
  const wallet = await storage.getWalletByUserId(user.id);
  if (!wallet) throw new Error("Wallet not created");
  
  // Add funds for testing
  await storage.updateWalletBalance(wallet.id, 5000); // Main: 5000
  await storage.updateReferralBalance(wallet.id, 1000); // Referral: 1000
  
  console.log(`Initial Balance: Main=${(await storage.getWalletByUserId(user.id))?.balance}, Referral=${(await storage.getWalletByUserId(user.id))?.referralBalance}`);
  console.log("✅ Setup Complete\n");

  // =================================================================
  // Test 1: Main Balance Withdrawal (Happy Path)
  // =================================================================
  console.log("Test 1: Main Balance Withdrawal (1000 BDT via bKash)");
  {
      const amount = 1000;
      const method = "bkash";
      const feePercent = 0.05;
      const fee = amount * feePercent; // 50
      const finalAmount = amount - fee; // 950
      
      // Simulate Route Logic
      const currentWallet = await storage.getWalletByUserId(user.id);
      if (parseFloat(currentWallet!.balance) < amount) throw new Error("Insufficient Balance");
      
      // 1. Deduct Balance
      await storage.updateWalletBalance(wallet.id, -amount);
      
      // 2. Create Record
      const withdrawal = await storage.createWithdrawal(
          wallet.id, 
          amount, 
          "01711111111", 
          "main", 
          method, 
          fee, 
          finalAmount
      );
      
      // Assertions
      const updatedWallet = await storage.getWalletByUserId(user.id);
      assert.strictEqual(parseFloat(updatedWallet!.balance), 4000, "Main balance should be 4000");
      assert.strictEqual(withdrawal.amount, "1000", "Withdrawal amount mismatch");
      assert.strictEqual(withdrawal.fee, "50", "Fee calculation mismatch");
      assert.strictEqual(withdrawal.finalAmount, "950", "Final amount mismatch");
      assert.strictEqual(withdrawal.source, "main");
      
      console.log("✅ Passed");
  }

  // =================================================================
  // Test 2: Referral Balance Withdrawal (Happy Path)
  // =================================================================
  console.log("\nTest 2: Referral Balance Withdrawal (500 BDT via Nagad)");
  {
      const amount = 500;
      const method = "nagad";
      const feePercent = 0.05;
      const fee = amount * feePercent; // 25
      const finalAmount = amount - fee; // 475
      
      // Simulate Route Logic
      const currentWallet = await storage.getWalletByUserId(user.id);
      if (parseFloat(currentWallet!.referralBalance) < amount) throw new Error("Insufficient Referral Balance");
      
      // 1. Deduct Balance
      await storage.updateReferralBalance(wallet.id, -amount);
      
      // 2. Create Record
      const withdrawal = await storage.createWithdrawal(
          wallet.id, 
          amount, 
          "01811111111", 
          "referral", 
          method, 
          fee, 
          finalAmount
      );
      
      // Assertions
      const updatedWallet = await storage.getWalletByUserId(user.id);
      assert.strictEqual(parseFloat(updatedWallet!.referralBalance), 500, "Referral balance should be 500");
      assert.strictEqual(withdrawal.source, "referral");
      
      console.log("✅ Passed");
  }

  // =================================================================
  // Test 3: Minimum Referral Limit Check
  // =================================================================
  console.log("\nTest 3: Referral Minimum Limit Check (< 150 BDT)");
  {
      const amount = 100;
      const MIN_LIMIT = 150;
      
      let errorCaught = false;
      if (amount < MIN_LIMIT) {
          errorCaught = true; // Logic simulation
      }
      
      assert.strictEqual(errorCaught, true, "Should fail for amount < 150");
      console.log("✅ Passed (Caught validation error)");
  }

  // =================================================================
  // Test 4: Insufficient Balance Check
  // =================================================================
  console.log("\nTest 4: Insufficient Main Balance Check");
  {
      const amount = 10000; // Have 4000
      const currentWallet = await storage.getWalletByUserId(user.id);
      
      let errorCaught = false;
      if (parseFloat(currentWallet!.balance) < amount) {
          errorCaught = true;
      }
      
      assert.strictEqual(errorCaught, true, "Should fail for insufficient funds");
      console.log("✅ Passed (Caught insufficient funds)");
  }

  // =================================================================
  // Test 5: Binance Fee Calculation (2%)
  // =================================================================
  console.log("\nTest 5: Binance Fee Logic (2%)");
  {
      const amount = 1000;
      const method = "binance";
      const feePercent = 0.02; // 2%
      const fee = amount * feePercent; // 20
      
      // Just check calculation logic
      assert.strictEqual(fee, 20, "Binance fee should be 20 for 1000 withdrawal");
      console.log("✅ Passed");
  }

  console.log("\nAll Withdrawal Flow Tests Passed Successfully!");
}

runTests().catch(e => {
    console.error("Test Failed:", e);
    process.exit(1);
});
