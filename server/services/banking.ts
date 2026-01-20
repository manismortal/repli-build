import { storage } from "../storage";
import { type BankingSchedule, type BankingException } from "@shared/schema";

export class BankingService {
  
  // ==========================================
  // Core Status Check Logic
  // ==========================================
  async getBankingStatus(provider?: string): Promise<{ 
      isOpen: boolean; 
      reason?: string; 
      nextOpen?: string;
      schedule?: any;
  }> {
    // 1. Check Global Disable Switches first
    const settings = await storage.getSiteSettings();
    if (provider === 'deposit' && settings?.isDepositEnabled === false) {
        return { isOpen: false, reason: "Deposits are globally disabled by admin." };
    }
    if (provider === 'withdrawal' && settings?.isWithdrawalEnabled === false) {
        return { isOpen: false, reason: "Withdrawals are globally disabled by admin." };
    }

    // 2. Determine Current Time in configured Timezone
    const timezone = settings?.bankingTimezone || "Asia/Dhaka";
    const now = new Date();
    const localTimeStr = now.toLocaleString("en-US", { timeZone: timezone });
    const localDate = new Date(localTimeStr); // Date object representing local time
    
    const todayDateStr = localDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentDayOfWeek = localDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentMinutes = localDate.getHours() * 60 + localDate.getMinutes();

    // 3. Check Exceptions (Holidays/Special Overrides)
    // Exceptions take precedence over weekly schedule
    const exceptions = await storage.getBankingExceptions(true);
    const todayException = exceptions.find(e => e.date === todayDateStr);

    if (todayException) {
        if (todayException.isClosed) {
             return { isOpen: false, reason: todayException.reason || "Holiday / Special Closure" };
        }
        // If exception exists but not closed, check if it has specific hours
        if (todayException.startTime && todayException.endTime) {
            const [startH, startM] = todayException.startTime.split(':').map(Number);
            const [endH, endM] = todayException.endTime.split(':').map(Number);
            const startMins = startH * 60 + startM;
            const endMins = endH * 60 + endM;

            if (currentMinutes >= startMins && currentMinutes < endMins) {
                 return { isOpen: true, schedule: { start: todayException.startTime, end: todayException.endTime, type: 'exception' } };
            } else {
                 return { isOpen: false, reason: `Special Hours: ${todayException.startTime} - ${todayException.endTime}` };
            }
        }
    }

    // 4. Check Weekly Schedule
    const schedules = await storage.getBankingSchedules();
    const todaySchedule = schedules.find(s => s.dayOfWeek === currentDayOfWeek);

    // Fallback to legacy settings if no schedule found (migration safety)
    if (!todaySchedule) {
        // Fallback logic using settings.bankingStartTime
        const start = settings?.bankingStartTime || "09:00";
        const end = settings?.bankingEndTime || "17:00";
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const startMins = startH * 60 + startM;
        const endMins = endH * 60 + endM;
        
        const isOpen = currentMinutes >= startMins && currentMinutes < endMins;
        return { isOpen, reason: isOpen ? undefined : `Banking Hours: ${start} - ${end}`, schedule: { start, end, type: 'legacy' } };
    }

    if (todaySchedule.isClosed) {
        return { isOpen: false, reason: "Closed on " + currentDayOfWeek };
    }

    const [startH, startM] = todaySchedule.startTime.split(':').map(Number);
    const [endH, endM] = todaySchedule.endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    if (currentMinutes >= startMins && currentMinutes < endMins) {
        return { isOpen: true, schedule: todaySchedule };
    } else {
        return { isOpen: false, reason: `Operating Hours: ${todaySchedule.startTime} - ${todaySchedule.endTime}` };
    }
  }

  // ==========================================
  // Admin Management Logic
  // ==========================================
  async updateSchedule(adminId: string, scheduleId: string, updates: Partial<BankingSchedule>) {
      const updated = await storage.updateBankingSchedule(scheduleId, updates);
      await storage.logBankingAction(adminId, 'update_schedule', `Updated ${updated.dayOfWeek}: ${JSON.stringify(updates)}`);
      return updated;
  }

  async addException(adminId: string, exception: any) {
      const created = await storage.addBankingException(exception);
      await storage.logBankingAction(adminId, 'add_exception', `Added exception for ${exception.date}`);
      return created;
  }
}

export const bankingService = new BankingService();
