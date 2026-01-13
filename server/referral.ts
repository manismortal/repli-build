import { storage } from "./storage";
import { User } from "@shared/schema";

export async function processReferralCommissions(sourceUserId: string, amount: number) {
  // New Requirement: Single level 40% commission
  const COMMISSION_RATE = 0.40; // 40%

  let currentUser = await storage.getUser(sourceUserId);
  if (!currentUser || !currentUser.referredBy) return;

  const uplineUser = await storage.getUser(currentUser.referredBy);
  if (!uplineUser) return;

  const commissionAmount = amount * COMMISSION_RATE;

  if (commissionAmount > 0) {
    await storage.addCommission(
      uplineUser.id, 
      sourceUserId, 
      commissionAmount, 
      'package_commission_40_percent'
    );
    
    // Notify the upline user
    await storage.createNotification(
        uplineUser.id, 
        `Congratulations! You earned a referral bonus of ৳${commissionAmount.toFixed(2)} from a new package purchase by your team member.`,
        "referral_bonus"
    );
  }
}

export function generateReferralCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
