import { storage } from "./storage";
import { User } from "@shared/schema";

export async function processReferralCommissions(sourceUserId: string, amount: number) {
  const settings = await storage.getSiteSettings(); // We need referral settings, but currently stored in separate table or use defaults
  const referralSettings = await storage.getReferralSettings();

  if (!referralSettings) {
    console.error("Referral settings not found. Skipping commissions.");
    return;
  }

  const levels = [
    parseFloat(referralSettings.level1Percent),
    parseFloat(referralSettings.level2Percent),
    parseFloat(referralSettings.level3Percent),
    parseFloat(referralSettings.level4Percent),
    parseFloat(referralSettings.level5Percent),
  ];

  const areaManagerPercent = parseFloat(referralSettings.areaManagerPercent);
  const regionalManagerPercent = parseFloat(referralSettings.regionalManagerPercent);

  let currentUser = await storage.getUser(sourceUserId);
  if (!currentUser || !currentUser.referredBy) return;

  let uplineUser = await storage.getUser(currentUser.referredBy);
  
  let areaManagerPaid = false;
  let regionalManagerPaid = false;

  // Process 5 Levels
  for (let i = 0; i < 5; i++) {
    if (!uplineUser) break;

    // 1. Pay Level Commission
    const commissionPercent = levels[i];
    const commissionAmount = (amount * commissionPercent) / 100;

    if (commissionAmount > 0) {
      await storage.addCommission(
        uplineUser.id, 
        sourceUserId, 
        commissionAmount, 
        `level_${i + 1}`
      );
    }

    // 2. Check for Manager Overrides (within the 5 levels)
    if (!areaManagerPaid && uplineUser.role === 'area_manager') {
      const bonus = (amount * areaManagerPercent) / 100;
      await storage.addCommission(
        uplineUser.id,
        sourceUserId,
        bonus,
        'area_manager_bonus'
      );
      areaManagerPaid = true;
    }

    if (!regionalManagerPaid && uplineUser.role === 'regional_manager') {
      const bonus = (amount * regionalManagerPercent) / 100;
      await storage.addCommission(
        uplineUser.id,
        sourceUserId,
        bonus,
        'regional_manager_bonus'
      );
      regionalManagerPaid = true;
    }

    // Move up
    if (uplineUser.referredBy) {
      uplineUser = await storage.getUser(uplineUser.referredBy);
    } else {
      uplineUser = undefined;
    }
  }

  // Infinite walk for Managers if not yet paid
  while (uplineUser && (!areaManagerPaid || !regionalManagerPaid)) {
    if (!areaManagerPaid && uplineUser.role === 'area_manager') {
      const bonus = (amount * areaManagerPercent) / 100;
      await storage.addCommission(
        uplineUser.id,
        sourceUserId,
        bonus,
        'area_manager_bonus'
      );
      areaManagerPaid = true;
    }

    if (!regionalManagerPaid && uplineUser.role === 'regional_manager') {
       const bonus = (amount * regionalManagerPercent) / 100;
      await storage.addCommission(
        uplineUser.id,
        sourceUserId,
        bonus,
        'regional_manager_bonus'
      );
      regionalManagerPaid = true;
    }
    
    // Stop if both paid
    if (areaManagerPaid && regionalManagerPaid) break;

    if (uplineUser.referredBy) {
      uplineUser = await storage.getUser(uplineUser.referredBy);
    } else {
      break;
    }
  }
}

export function generateReferralCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
