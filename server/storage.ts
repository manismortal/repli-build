import {
  type User,
  type InsertUser,
  type Package,
  type InsertPackage,
  type Wallet,
  type Withdrawal,
  type Notification,
  type Deposit,
  type InsertDeposit,
  users,
  packages,
  wallets,
  userPackages,
  withdrawals,
  notifications,
  deposits,
  siteSettings,
  type SiteSettings,
  type ReferralSettings,
  type Commission,
  referralSettings,
  commissions,
  agentNumbers,
  activityLogs,
  type ActivityLog,
  type InsertActivityLog,
  taskSessions,
  type TaskSession,
  type Task,
  type InsertTask,
  type AgentNumber,
  type InsertAgentNumber,
  tasks,
  userTasks,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, lt, gt, gte, and, ne } from "drizzle-orm";
import { randomUUID } from "crypto";

// =================================================================
// Storage Interface
// =================================================================
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser & { referralCode: string, referredBy?: string }): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUsersPaginated(page: number, limit: number, role?: string): Promise<{ users: User[], total: number }>;
  countUsers(): Promise<number>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  markWelcomeSeen(userId: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
  getReferrals(userId: string): Promise<User[]>;

  // Wallets
  getWalletByUserId(userId: string): Promise<Wallet | undefined>;
  getUserByWalletId(walletId: string): Promise<User | undefined>;
  updateWalletBalance(walletId: string, amount: number): Promise<Wallet>;
  updateWalletBonus(walletId: string, newBonus: number): Promise<Wallet>;
  updateReferralBalance(walletId: string, amount: number): Promise<Wallet>;
  updateLockedBalance(walletId: string, amount: number): Promise<Wallet>;

  // Packages
  createPackage(pkg: InsertPackage): Promise<Package>;
  getPackage(id: string): Promise<Package | undefined>;
  getPackages(): Promise<Package[]>;
  updatePackage(id: string, updates: Partial<Package>): Promise<Package>;
  deletePackage(id: string): Promise<void>;

  // Tasks
  createTask(task: InsertTask): Promise<Task>;
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;

  // User Packages
  purchasePackage(userId: string, packageId: string): Promise<void>;
  hasUserPackage(userId: string): Promise<boolean>;
  getUserPackages(userId: string): Promise<(Package & { purchaseDate: Date })[]>;
  
  // Withdrawals
  createWithdrawal(walletId: string, amount: number, destinationNumber: string, source: string, method: string, fee: number, finalAmount: number): Promise<Withdrawal>;
  getWithdrawalsByWalletId(walletId: string): Promise<Withdrawal[]>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal>;

  // Deposits
  createDeposit(userId: string, deposit: InsertDeposit): Promise<Deposit>;
  getDepositsByUserId(userId: string): Promise<Deposit[]>;
  getAllDeposits(): Promise<Deposit[]>;
  getDepositsByProvider(provider: string): Promise<Deposit[]>;
  getDepositsWithUsers(provider: string): Promise<(Deposit & { username: string, name: string | null })[]>;
  updateDepositStatus(id: string, status: string): Promise<Deposit>;
  
  // Notifications
  createNotification(userId: string, message: string, type?: string): Promise<Notification>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  markAllNotificationsRead(userId: string): Promise<void>;
  markNotificationRead(id: string): Promise<void>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;

  // Referral System
  getReferralSettings(): Promise<ReferralSettings | undefined>;
  updateReferralSettings(settings: Partial<ReferralSettings>): Promise<ReferralSettings>;
  addCommission(userId: string, sourceUserId: string, amount: number, type: string): Promise<Commission>;
  getCommissionsByUserId(userId: string): Promise<Commission[]>;

  // Agents
  createAgent(agent: InsertAgentNumber): Promise<AgentNumber>;
  getAllAgents(): Promise<AgentNumber[]>;
  getAgentsByProvider(provider: string): Promise<AgentNumber[]>;
  toggleAgentStatus(id: string, isActive: boolean): Promise<AgentNumber>;
  updateAgent(id: string, updates: Partial<AgentNumber>): Promise<AgentNumber>;
  deleteAgent(id: string): Promise<void>;

  // Activity & Ban System
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(userId: string): Promise<ActivityLog[]>;
  updateUserStatus(userId: string, status: string): Promise<void>;
  getInactiveUsers(daysThreshold: number): Promise<User[]>;
  banUser(userId: string, reason: string): Promise<User>;
  countActiveUsers(): Promise<number>;
  
  // Task Tracking
  recordTaskCompletion(userId: string, taskId: string): Promise<void>;
  getTodayUserTaskCount(userId: string): Promise<number>;

  // Task Sessions (Event-Driven)
  createTaskSession(userId: string, taskId: string): Promise<TaskSession>;
  getActiveTaskSession(userId: string, taskId: string): Promise<TaskSession | undefined>;
  updateTaskSessionStatus(sessionId: string, status: string): Promise<void>;
  
  // History
  getDailyTaskCompletionHistory(userId: string): Promise<string[]>;
  
  // Analytics
  getDailyStats(days?: number): Promise<{ date: string, deposits: number, withdrawals: number, newUsers: number }[]>;

  // Agent Count
  updateAgentCount(provider: string, count: number): Promise<void>;
  getAgentCount(provider: string): Promise<number>;
}

// =================================================================
// In-Memory Storage Implementation
// =================================================================
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private packages: Map<string, Package> = new Map();
  private tasks: Map<string, Task> = new Map();
  private userPackages: Map<string, { packageId: string, purchaseDate: Date }[]> = new Map();
  private userTaskCompletions: Map<string, { id: string, userId: string, taskId: string, completedAt: Date }> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private withdrawals: Map<string, Withdrawal> = new Map();
  private deposits: Map<string, Deposit> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private settings: SiteSettings | undefined;
  private referralSettings: ReferralSettings | undefined;
  private commissions: Map<string, Commission> = new Map();
  private agents: Map<string, AgentNumber> = new Map();
  private activityLogs: Map<string, ActivityLog> = new Map();
  private agentCounts: Map<string, number> = new Map();

  // =================================
  // User Methods
  // =================================
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === code,
    );
  }

  async createUser(insertUser: InsertUser & { referralCode: string, referredBy?: string }): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password, // IMPORTANT: In a real app, hash this password!
      name: insertUser.name || null,
      email: insertUser.email || null,
      phoneNumber: insertUser.phoneNumber || null,
      isAdmin: false,
      isBanned: false,
      banReason: null,
      lastTaskCompletedAt: null,
      lastActiveAt: null,
      status: "offline",
      role: 'user',
      referralCode: insertUser.referralCode,
      referredBy: insertUser.referredBy || null,
      hasSeenWelcome: false,
      createdAt: now,
    };
    this.users.set(id, user);

    // Also create a wallet for the new user
    await this.createWallet(id);

    return user;
  }

  async markWelcomeSeen(userId: string): Promise<void> {
      const user = this.users.get(userId);
      if (user) {
          this.users.set(userId, { ...user, hasSeenWelcome: true });
      }
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersPaginated(page: number, limit: number, role?: string): Promise<{ users: User[], total: number }> {
    let users = Array.from(this.users.values());
    if (role) {
      users = users.filter(u => u.role === role);
    }
    const total = users.length;
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);
    return { users: paginatedUsers, total };
  }

  async countUsers(): Promise<number> {
    return this.users.size;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
      this.users.delete(id);
  }

  async getReferrals(userId: string): Promise<User[]> {
      return Array.from(this.users.values()).filter(u => u.referredBy === userId);
  }

  // =================================
  // Wallet Methods
  // =================================
  async createWallet(userId: string): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = {
      id,
      userId,
      balance: "0.00",
      bonusBalance: "250.00",
      lockedBalance: "0.00",
      referralBalance: "0.00",
    };
    this.wallets.set(id, wallet);
    return wallet;
  }
  
  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId,
    );
  }

  async getUserByWalletId(walletId: string): Promise<User | undefined> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) return undefined;
    return this.users.get(wallet.userId);
  }

  async updateWalletBalance(walletId: string, amount: number): Promise<Wallet> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error("Wallet not found");
    
    const currentBalance = parseFloat(wallet.balance);
    const newBalance = (currentBalance + amount).toFixed(2);
    
    const updatedWallet = { ...wallet, balance: newBalance };
    this.wallets.set(walletId, updatedWallet);
    return updatedWallet;
  }

  async updateWalletBonus(walletId: string, newBonus: number): Promise<Wallet> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error("Wallet not found");
    
    const updatedWallet = { ...wallet, bonusBalance: newBonus.toFixed(2) };
    this.wallets.set(walletId, updatedWallet);
    return updatedWallet;
  }

  async updateReferralBalance(walletId: string, amount: number): Promise<Wallet> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error("Wallet not found");
    
    const currentBalance = parseFloat(wallet.referralBalance);
    const newBalance = (currentBalance + amount).toFixed(2);
    
    const updatedWallet = { ...wallet, referralBalance: newBalance };
    this.wallets.set(walletId, updatedWallet);
    return updatedWallet;
  }

  async updateLockedBalance(walletId: string, amount: number): Promise<Wallet> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error("Wallet not found");
    
    const currentBalance = parseFloat(wallet.lockedBalance);
    const newBalance = (currentBalance + amount).toFixed(2);
    
    const updatedWallet = { ...wallet, lockedBalance: newBalance };
    this.wallets.set(walletId, updatedWallet);
    return updatedWallet;
  }

  // =================================
  // Package Methods
  // =================================
  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const now = new Date();
    const newPackage: Package = {
      id,
      ...pkg,
      description: pkg.description || null,
      price: pkg.price!,
      dailyReward: pkg.dailyReward || "0.00",
      isVisible: pkg.isVisible ?? true,
      createdAt: now,
    };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package> {
    const pkg = this.packages.get(id);
    if (!pkg) throw new Error("Package not found");
    const updatedPackage = { ...pkg, ...updates };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: string): Promise<void> {
    this.packages.delete(id);
  }

  // =================================
  // Task Methods
  // =================================
  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const newTask: Task = {
      id,
      ...task,
      description: task.description || null,
      link: task.link || null,
      linkType: task.linkType || "video",
      visitDuration: task.visitDuration || 60,
      active: task.active ?? true,
      createdAt: new Date(),
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error("Task not found");
    const updated = { ...task, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks.delete(id);
  }

  // =================================
  // User Package Methods
  // =================================
  async purchasePackage(userId: string, packageId: string): Promise<void> {
    if (!this.users.has(userId) || !this.packages.has(packageId)) {
      throw new Error("User or Package not found");
    }
    const userPackageList = this.userPackages.get(userId) || [];
    userPackageList.push({ packageId, purchaseDate: new Date() });
    this.userPackages.set(userId, userPackageList);
  }

  async hasUserPackage(userId: string): Promise<boolean> {
    const list = this.userPackages.get(userId);
    return !!list && list.length > 0;
  }

  async getUserPackages(userId: string): Promise<(Package & { purchaseDate: Date })[]> {
      const list = this.userPackages.get(userId) || [];
      const pkgs: (Package & { purchaseDate: Date })[] = [];
      for (const item of list) {
          const p = this.packages.get(item.packageId);
          if (p) pkgs.push({ ...p, purchaseDate: item.purchaseDate });
      }
      return pkgs;
  }

  // Withdrawals
  async createWithdrawal(walletId: string, amount: number, destinationNumber: string, source: string = 'main', method: string = 'bkash', fee: number = 0, finalAmount: number = amount): Promise<Withdrawal> {
    if (!this.wallets.has(walletId)) {
        throw new Error("Wallet not found");
    }
    const id = randomUUID();
    const now = new Date();
    const withdrawal: Withdrawal = {
        id,
        walletId,
        amount: String(amount),
        status: 'pending',
        source: source as any,
        destinationNumber,
        requestedAt: now,
        processedAt: null,
        method: method as any,
        fee: String(fee),
        finalAmount: String(finalAmount)
    };
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }

  async getWithdrawalsByWalletId(walletId: string): Promise<Withdrawal[]> {
      return Array.from(this.withdrawals.values()).filter(w => w.walletId === walletId);
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values());
  }

  async updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal> {
    const withdrawal = this.withdrawals.get(id);
    if (!withdrawal) throw new Error("Withdrawal not found");
    const updatedWithdrawal: Withdrawal = { 
      ...withdrawal, 
      status: status as any, 
      processedAt: new Date() 
    };
    this.withdrawals.set(id, updatedWithdrawal);
    return updatedWithdrawal;
  }

  // Deposits
  async createDeposit(userId: string, depositData: InsertDeposit): Promise<Deposit> {
    if (!this.users.has(userId)) {
      throw new Error("User not found");
    }
    const id = randomUUID();
    const now = new Date();
    const deposit: Deposit = {
      id,
      userId,
      amount: String(depositData.amount),
      transactionId: depositData.transactionId,
      status: 'pending',
      createdAt: now,
      processedAt: null,
      method: depositData.method || "bkash",
      agentNumber: depositData.agentNumber || null,
      userPhoneNumber: depositData.userPhoneNumber || null,
    };
    this.deposits.set(id, deposit);
    return deposit;
  }

  async getDepositsByUserId(userId: string): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(d => d.userId === userId);
  }

  async getAllDeposits(): Promise<Deposit[]> {
    return Array.from(this.deposits.values());
  }

  async getDepositsByProvider(provider: string): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(d => d.method === provider);
  }

  async getDepositsWithUsers(provider: string): Promise<(Deposit & { username: string, name: string | null })[]> {
    const deposits = await this.getDepositsByProvider(provider);
    return deposits.map(d => {
        const user = this.users.get(d.userId);
        return {
            ...d,
            username: user?.username || "Unknown",
            name: user?.name || "N/A"
        };
    });
  }

  async updateDepositStatus(id: string, status: string): Promise<Deposit> {
    const deposit = this.deposits.get(id);
    if (!deposit) throw new Error("Deposit not found");
    
    // Update balance if approved
    if (status === 'approved' && deposit.status !== 'approved') {
        const wallet = await this.getWalletByUserId(deposit.userId);
        if (wallet) {
            await this.updateWalletBalance(wallet.id, parseFloat(deposit.amount));
        }
    }

    const updatedDeposit: Deposit = {
      ...deposit,
      status: status as any,
      processedAt: new Date(),
    };
    this.deposits.set(id, updatedDeposit);
    return updatedDeposit;
  }
  
  // Notifications
  async createNotification(userId: string, message: string, type: string = "general"): Promise<Notification> {
      if (!this.users.has(userId)) {
          throw new Error("User not found");
      }
      const id = randomUUID();
      const now = new Date();
      const notification: Notification = {
          id,
          userId,
          type: type as any,
          message,
          isRead: false,
          createdAt: now,
      };
      this.notifications.set(id, notification);
      return notification;
  }
  
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
      return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
      for (const n of Array.from(this.notifications.values())) {
          if (n.userId === userId && !n.isRead) {
              this.notifications.set(n.id, { ...n, isRead: true });
          }
      }
  }

  async markNotificationRead(id: string): Promise<void> {
      const n = this.notifications.get(id);
      if (n) {
          this.notifications.set(id, { ...n, isRead: true });
      }
  }

  // =================================
  // Site Settings Methods
  // =================================
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.settings;
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const now = new Date();
    if (!this.settings) {
        this.settings = {
            id: randomUUID(),
            telegramLink: settings.telegramLink || null,
            whatsappLink: settings.whatsappLink || null,
            noticeText: settings.noticeText || null,
            popupTitle: settings.popupTitle || null,
            popupBody: settings.popupBody || null,
            popupImageUrl: settings.popupImageUrl || null,
            popupLink: settings.popupLink || null,
            popupActive: settings.popupActive ?? false,
            offerModalActive: settings.offerModalActive ?? false,
            offerModalTitle: settings.offerModalTitle || "Exclusive Offer!",
            offerModalBenefits: settings.offerModalBenefits || "Unlock premium features now!",
            offerModalLink: settings.offerModalLink || "/products",
            offerModalCtaText: settings.offerModalCtaText || "Subscribe Now",
            updatedAt: now,
        };
    } else {
        this.settings = { ...this.settings, ...settings, updatedAt: now };
    }
    return this.settings;
  }

  // =================================
  // Referral Methods
  // =================================
  async getReferralSettings(): Promise<ReferralSettings | undefined> {
    if (!this.referralSettings) {
        // Return default settings for MemStorage if not set
        return {
            id: "default",
            level1Percent: "5.00",
            level2Percent: "3.00",
            level3Percent: "2.00",
            level4Percent: "1.00",
            level5Percent: "0.50",
            areaManagerPercent: "2.00",
            regionalManagerPercent: "3.00",
            updatedAt: new Date()
        };
    }
    return this.referralSettings;
  }

  async updateReferralSettings(settings: Partial<ReferralSettings>): Promise<ReferralSettings> {
      if (!this.referralSettings) {
           this.referralSettings = {
            id: "default",
            level1Percent: "5.00",
            level2Percent: "3.00",
            level3Percent: "2.00",
            level4Percent: "1.00",
            level5Percent: "0.50",
            areaManagerPercent: "2.00",
            regionalManagerPercent: "3.00",
            updatedAt: new Date(),
             ...settings
        };
      } else {
          this.referralSettings = { ...this.referralSettings, ...settings, updatedAt: new Date() };
      }
      return this.referralSettings;
  }

  async addCommission(userId: string, sourceUserId: string, amount: number, type: string): Promise<Commission> {
      const id = randomUUID();
      const commission: Commission = {
          id,
          beneficiaryId: userId,
          sourceUserId,
          amount: String(amount),
          type,
          description: null,
          createdAt: new Date()
      };
      this.commissions.set(id, commission);

      // Add to Wallet
      const wallet = await this.getWalletByUserId(userId);
      if (wallet) {
          await this.updateReferralBalance(wallet.id, amount);
      }
      
      return commission;
  }

  async getCommissionsByUserId(userId: string): Promise<Commission[]> {
      return Array.from(this.commissions.values()).filter(c => c.beneficiaryId === userId);
  }

  // =================================
  // Agent Methods
  // =================================
  async createAgent(agent: InsertAgentNumber): Promise<AgentNumber> {
    const id = randomUUID();
    const newAgent: AgentNumber = {
      id,
      provider: agent.provider,
      number: agent.number,
      isActive: agent.isActive ?? true,
      lastUsedAt: null,
      createdAt: new Date(),
    };
    this.agents.set(id, newAgent);
    return newAgent;
  }

  async getAllAgents(): Promise<AgentNumber[]> {
    return Array.from(this.agents.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAgentsByProvider(provider: string): Promise<AgentNumber[]> {
    return Array.from(this.agents.values())
      .filter(a => a.provider === provider)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async toggleAgentStatus(id: string, isActive: boolean): Promise<AgentNumber> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error("Agent not found");
    const updated = { ...agent, isActive };
    this.agents.set(id, updated);
    return updated;
  }

  async updateAgent(id: string, updates: Partial<AgentNumber>): Promise<AgentNumber> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error("Agent not found");
    const updated = { ...agent, ...updates };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<void> {
    this.agents.delete(id);
  }

  // =================================
  // Activity & Ban Methods
  // =================================
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const newLog: ActivityLog = {
      id,
      userId: log.userId,
      action: log.action,
      details: log.details || null,
      createdAt: new Date(),
    };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  async getActivityLogs(userId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      this.users.set(userId, { ...user, status: status, lastActiveAt: new Date() });
    }
  }

  async getInactiveUsers(daysThreshold: number): Promise<User[]> {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);
    
    return Array.from(this.users.values()).filter(user => {
      // If user is already banned, skip
      if (user.isBanned) return false;
      
      // If user never completed a task, check creation date? 
      // Prompt says "absence from daily task". If they never did one, maybe we check createdAt?
      // For now, let's assume if lastTaskCompletedAt is null, they rely on createdAt or are safe until first task.
      // Strict interpretation: "absence from daily task". 
      // Let's check lastTaskCompletedAt. If null, maybe use createdAt as fallback.
      const lastActivity = user.lastTaskCompletedAt || user.createdAt;
      return lastActivity < thresholdDate;
    });
  }

  async banUser(userId: string, reason: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, isBanned: true, banReason: reason };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async countActiveUsers(): Promise<number> {
    const now = new Date();
    const threshold = new Date(now.getTime() - 5 * 60 * 1000); // 5 mins
    return Array.from(this.users.values()).filter(u => 
        u.status === 'online' && 
        u.lastActiveAt && 
        u.lastActiveAt > threshold
    ).length;
  }

  async recordTaskCompletion(userId: string, taskId: string): Promise<void> {
    const id = randomUUID();
    this.userTaskCompletions.set(id, { id, userId, taskId, completedAt: new Date() });
  }

  async getTodayUserTaskCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.userTaskCompletions.values()).filter(
        t => t.userId === userId && t.completedAt >= today
    ).length;
  }

  // Task Sessions
  private taskSessionsMap: Map<string, TaskSession> = new Map();

  async createTaskSession(userId: string, taskId: string): Promise<TaskSession> {
    const id = randomUUID();
    const session: TaskSession = {
        id,
        userId,
        taskId,
        startedAt: new Date(),
        completedAt: null,
        status: "in_progress"
    };
    this.taskSessionsMap.set(id, session);
    return session;
  }

  async getActiveTaskSession(userId: string, taskId: string): Promise<TaskSession | undefined> {
      return Array.from(this.taskSessionsMap.values())
        .filter(s => s.userId === userId && s.taskId === taskId && s.status === 'in_progress')
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
  }

  async updateTaskSessionStatus(sessionId: string, status: string): Promise<void> {
      const session = this.taskSessionsMap.get(sessionId);
      if (session) {
          this.taskSessionsMap.set(sessionId, { ...session, status, completedAt: status === 'completed' ? new Date() : null });
      }
  }

  async getDailyTaskCompletionHistory(userId: string): Promise<string[]> {
      const completions = Array.from(this.userTaskCompletions.values())
          .filter(t => t.userId === userId);
      
      const dailyCounts = new Map<string, number>();
      for (const c of completions) {
          const day = c.completedAt.toISOString().split('T')[0];
          dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
      }
      
      return Array.from(dailyCounts.entries())
          .filter(([_, count]) => count >= 5)
          .map(([day]) => day);
  }
  async getDailyStats(days: number = 7): Promise<{ date: string, deposits: number, withdrawals: number, newUsers: number }[]> {
    const stats = new Map<string, { date: string, deposits: number, withdrawals: number, newUsers: number }>();
    
    // Initialize last 7 days
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        stats.set(dateStr, { date: dateStr, deposits: 0, withdrawals: 0, newUsers: 0 });
    }

    // Process Deposits
    for (const d of Array.from(this.deposits.values())) {
        if (d.status === 'approved' && d.processedAt) {
            const dateStr = d.processedAt.toISOString().split('T')[0];
            if (stats.has(dateStr)) {
                const curr = stats.get(dateStr)!;
                curr.deposits += parseFloat(d.amount);
            }
        }
    }

    // Process Withdrawals
    for (const w of Array.from(this.withdrawals.values())) {
        if (w.status === 'approved' && w.processedAt) {
            const dateStr = w.processedAt.toISOString().split('T')[0];
            if (stats.has(dateStr)) {
                const curr = stats.get(dateStr)!;
                curr.withdrawals += parseFloat(w.amount);
            }
        }
    }

    // Process Users
    for (const u of Array.from(this.users.values())) {
        const dateStr = u.createdAt.toISOString().split('T')[0];
        if (stats.has(dateStr)) {
            const curr = stats.get(dateStr)!;
            curr.newUsers += 1;
        }
    }

    return Array.from(stats.values());
  }

  async updateAgentCount(provider: string, count: number): Promise<void> {
    this.agentCounts.set(provider, count);
  }

  async getAgentCount(provider: string): Promise<number> {
    if (this.agentCounts.has(provider)) {
      return this.agentCounts.get(provider)!;
    }
    return Array.from(this.agents.values()).filter(a => a.provider === provider && a.isActive).length;
  }
}

// =================================================================
// Database Storage Implementation
// =================================================================
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.referralCode, code));
    return user;
  }

  async createUser(insertUser: InsertUser & { referralCode: string, referredBy?: string }): Promise<User> {
    const [user] = await db!.insert(users).values(insertUser).returning();
    // Create wallet
    await db!.insert(wallets).values({ userId: user.id });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db!.select().from(users);
  }

  async getUsersPaginated(page: number, limit: number, role?: string): Promise<{ users: User[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = role ? eq(users.role, role as any) : undefined;
    
    const [countResult] = await db!
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);
    const total = Number(countResult.count);

    const paginatedUsers = await db!
      .select()
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));
      
    return { users: paginatedUsers, total };
  }

  async countUsers(): Promise<number> {
    const [result] = await db!.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result.count);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db!
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async markWelcomeSeen(userId: string): Promise<void> {
      await db!.update(users)
        .set({ hasSeenWelcome: true })
        .where(eq(users.id, userId));
  }

  async deleteUser(id: string): Promise<void> {
      await db!.delete(users).where(eq(users.id, id));
  }

  async deleteAgent(id: string): Promise<void> {
      await db!.delete(agentNumbers).where(eq(agentNumbers.id, id));
  }

  async getReferrals(userId: string): Promise<User[]> {
      return await db!.select().from(users).where(eq(users.referredBy, userId));
  }

  // Wallets
  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db!.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async getUserByWalletId(walletId: string): Promise<User | undefined> {
    const [result] = await db!.select()
      .from(users)
      .innerJoin(wallets, eq(users.id, wallets.userId))
      .where(eq(wallets.id, walletId));
    return result?.users;
  }

  async updateWalletBalance(walletId: string, amount: number): Promise<Wallet> {
      const [updatedWallet] = await db!
        .update(wallets)
        .set({ balance: sql`${wallets.balance} + ${amount}` })
        .where(eq(wallets.id, walletId))
        .returning();
      
      if (!updatedWallet) throw new Error("Wallet not found");
      return updatedWallet;
  }

  async updateWalletBonus(walletId: string, newBonus: number): Promise<Wallet> {
      // Bonus update is usually a "set" operation (reset to 0 or set initial), not always an increment.
      // But looking at usage: /api/wallet/claim-locked sets it to 0.
      // The interface implies "update" (set), but let's check strict usage.
      // Interface: updateWalletBonus(walletId, newBonus).
      // Usage 1: claim-locked -> sets to 0.
      // Usage 2: createWallet -> defaults 250.
      // So this method sets the absolute value.
      // However, to keep it consistent with the previous implementation which SET the value:
      
      const [updatedWallet] = await db!.update(wallets)
        .set({ bonusBalance: newBonus.toFixed(2) })
        .where(eq(wallets.id, walletId))
        .returning();
        
      if (!updatedWallet) throw new Error("Wallet not found");
      return updatedWallet;
  }

  async updateReferralBalance(walletId: string, amount: number): Promise<Wallet> {
      const [updatedWallet] = await db!
        .update(wallets)
        .set({ referralBalance: sql`${wallets.referralBalance} + ${amount}` })
        .where(eq(wallets.id, walletId))
        .returning();

      if (!updatedWallet) throw new Error("Wallet not found");
      return updatedWallet;
  }

  async updateLockedBalance(walletId: string, amount: number): Promise<Wallet> {
      const [updatedWallet] = await db!
        .update(wallets)
        .set({ lockedBalance: sql`${wallets.lockedBalance} + ${amount}` })
        .where(eq(wallets.id, walletId))
        .returning();

      if (!updatedWallet) throw new Error("Wallet not found");
      return updatedWallet;
  }

  // Packages
  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPkg] = await db!.insert(packages).values({
        ...pkg,
        price: pkg.price!.toString(),
        dailyReward: pkg.dailyReward?.toString() || "0.00"
    }).returning();
    return newPkg;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const [pkg] = await db!.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async getPackages(): Promise<Package[]> {
    return await db!.select().from(packages);
  }

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package> {
    const [updatedPkg] = await db!.update(packages).set(updates).where(eq(packages.id, id)).returning();
    return updatedPkg;
  }

  async deletePackage(id: string): Promise<void> {
    await db!.delete(packages).where(eq(packages.id, id));
  }

  // Tasks
  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db!.insert(tasks).values({
        ...task,
        linkType: task.linkType || "video"
    }).returning();
    return newTask;
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db!.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return await db!.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const [updated] = await db!.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    await db!.delete(tasks).where(eq(tasks.id, id));
  }

  // User Packages
  async purchasePackage(userId: string, packageId: string): Promise<void> {
    await db!.insert(userPackages).values({
      userId,
      packageId,
    });
  }

  async hasUserPackage(userId: string): Promise<boolean> {
      const [result] = await db!.select({ count: sql<number>`count(*)` })
        .from(userPackages)
        .where(eq(userPackages.userId, userId));
      return Number(result.count) > 0;
  }

  async getUserPackages(userId: string): Promise<(Package & { purchaseDate: Date })[]> {
      const result = await db!.select({
          id: packages.id,
          name: packages.name,
          price: packages.price,
          dailyReward: packages.dailyReward,
          description: packages.description,
          isVisible: packages.isVisible,
          createdAt: packages.createdAt,
          purchaseDate: userPackages.purchaseDate
      })
      .from(userPackages)
      .innerJoin(packages, eq(userPackages.packageId, packages.id))
      .where(eq(userPackages.userId, userId));
      
      return result;
  }

  // Withdrawals
  async createWithdrawal(walletId: string, amount: number, destinationNumber: string, source: string = 'main', method: string = 'bkash', fee: number = 0, finalAmount: number = amount): Promise<Withdrawal> {
    const [withdrawal] = await db!.insert(withdrawals).values({
      walletId,
      amount: String(amount),
      source: source as any,
      destinationNumber,
      method: method as any,
      fee: String(fee),
      finalAmount: String(finalAmount)
    }).returning();
    return withdrawal;
  }

  async getWithdrawalsByWalletId(walletId: string): Promise<Withdrawal[]> {
    return await db!.select().from(withdrawals).where(eq(withdrawals.walletId, walletId)).orderBy(desc(withdrawals.requestedAt));
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return await db!.select().from(withdrawals).orderBy(desc(withdrawals.requestedAt));
  }

  async updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal> {
    const [withdrawal] = await db!.update(withdrawals).set({
      status: status as any,
      processedAt: new Date(),
    }).where(eq(withdrawals.id, id)).returning();
    return withdrawal;
  }

  // Deposits
  async createDeposit(userId: string, depositData: InsertDeposit): Promise<Deposit> {
    const [deposit] = await db!.insert(deposits).values({
      userId,
      amount: String(depositData.amount),
      transactionId: depositData.transactionId,
      method: depositData.method || "bkash",
      agentNumber: depositData.agentNumber,
      userPhoneNumber: depositData.userPhoneNumber
    }).returning();
    return deposit;
  }

  async getDepositsByUserId(userId: string): Promise<Deposit[]> {
    return await db!.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
  }

  async getAllDeposits(): Promise<Deposit[]> {
    return await db!.select().from(deposits).orderBy(desc(deposits.createdAt));
  }

  async getDepositsByProvider(provider: string): Promise<Deposit[]> {
    return await db!.select().from(deposits)
      .where(eq(deposits.method, provider as any))
      .orderBy(desc(deposits.createdAt));
  }

  async getDepositsWithUsers(provider: string): Promise<(Deposit & { username: string, name: string | null })[]> {
    const result = await db!.select({
        deposit: deposits,
        user: users
    })
    .from(deposits)
    .leftJoin(users, eq(deposits.userId, users.id))
    .where(eq(deposits.method, provider as any))
    .orderBy(desc(deposits.createdAt));

    return result.map(({ deposit, user }) => ({
        ...deposit,
        username: user?.username || "Unknown",
        name: user?.name || "N/A"
    }));
  }

  async updateDepositStatus(id: string, status: string): Promise<Deposit> {
    const [deposit] = await db!.update(deposits).set({
      status: status as any,
      processedAt: new Date(),
    }).where(eq(deposits.id, id)).returning();

    // If approved, update wallet balance
    if (status === 'approved') {
        const wallet = await this.getWalletByUserId(deposit.userId);
        if (wallet) {
            await this.updateWalletBalance(wallet.id, parseFloat(deposit.amount));
        }
    }

    return deposit;
  }

  // Notifications
  async createNotification(userId: string, message: string, type: string = "general"): Promise<Notification> {
    const [notification] = await db!.insert(notifications).values({
      userId,
      message,
      type: type as any,
    }).returning();
    return notification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db!.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
      await db!.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
  }

  async markNotificationRead(id: string): Promise<void> {
      await db!.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, id));
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db!.select().from(siteSettings).limit(1);
    return settings;
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const [existing] = await db!.select().from(siteSettings).limit(1);
    if (existing) {
        const [updated] = await db!.update(siteSettings).set({ ...settings, updatedAt: new Date() }).where(eq(siteSettings.id, existing.id)).returning();
        return updated;
    } else {
        const [created] = await db!.insert(siteSettings).values({ 
            telegramLink: settings.telegramLink,
            whatsappLink: settings.whatsappLink,
            noticeText: settings.noticeText,
            popupTitle: settings.popupTitle,
            popupBody: settings.popupBody,
            popupImageUrl: settings.popupImageUrl,
            popupLink: settings.popupLink,
            popupActive: settings.popupActive,
            offerModalActive: settings.offerModalActive,
            offerModalTitle: settings.offerModalTitle,
            offerModalBenefits: settings.offerModalBenefits,
            offerModalLink: settings.offerModalLink,
            offerModalCtaText: settings.offerModalCtaText
        }).returning();
        return created;
    }
  }

  // =================================
  // Referral Methods
  // =================================
  async getReferralSettings(): Promise<ReferralSettings | undefined> {
      const [settings] = await db!.select().from(referralSettings).limit(1);
      return settings;
  }

  async updateReferralSettings(settings: Partial<ReferralSettings>): Promise<ReferralSettings> {
      const [existing] = await db!.select().from(referralSettings).limit(1);
      if (existing) {
          const [updated] = await db!.update(referralSettings).set({ ...settings, updatedAt: new Date() }).where(eq(referralSettings.id, existing.id)).returning();
          return updated;
      } else {
          const [created] = await db!.insert(referralSettings).values(settings as any).returning();
          return created;
      }
  }

  async addCommission(userId: string, sourceUserId: string, amount: number, type: string): Promise<Commission> {
      const [commission] = await db!.insert(commissions).values({
          beneficiaryId: userId,
          sourceUserId,
          amount: String(amount),
          type,
      }).returning();

      // Add to Wallet
      const wallet = await this.getWalletByUserId(userId);
      if (wallet) {
          await this.updateReferralBalance(wallet.id, amount);
      }

      return commission;
  }

  async getCommissionsByUserId(userId: string): Promise<Commission[]> {
      return await db!.select().from(commissions).where(eq(commissions.beneficiaryId, userId)).orderBy(desc(commissions.createdAt));
  }

  // Agents
  async createAgent(agent: InsertAgentNumber): Promise<AgentNumber> {
    const [newAgent] = await db!.insert(agentNumbers).values(agent).returning();
    return newAgent;
  }

  async getAllAgents(): Promise<AgentNumber[]> {
    return await db!.select().from(agentNumbers).orderBy(desc(agentNumbers.createdAt));
  }

  async getAgentsByProvider(provider: string): Promise<AgentNumber[]> {
    return await db!.select().from(agentNumbers)
      .where(eq(agentNumbers.provider, provider as any))
      .orderBy(desc(agentNumbers.createdAt));
  }

  async toggleAgentStatus(id: string, isActive: boolean): Promise<AgentNumber> {
    const [updated] = await db!.update(agentNumbers)
      .set({ isActive })
      .where(eq(agentNumbers.id, id))
      .returning();
    return updated;
  }

  async updateAgent(id: string, updates: Partial<AgentNumber>): Promise<AgentNumber> {
    const [updated] = await db!.update(agentNumbers)
      .set(updates)
      .where(eq(agentNumbers.id, id))
      .returning();
    return updated;
  }

  // Activity & Ban Methods
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db!.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getActivityLogs(userId: string): Promise<ActivityLog[]> {
    return await db!.select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt));
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    await db!.update(users)
      .set({ 
        status: status, 
        lastActiveAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async getInactiveUsers(daysThreshold: number): Promise<User[]> {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);
    
    // Find users who are NOT banned AND ((lastTaskCompletedAt < threshold) OR (lastTaskCompletedAt IS NULL AND createdAt < threshold))
    // Simplification: Check lastTaskCompletedAt < threshold. If null, ignore or check createdAt?
    // Let's rely on the `lastTaskCompletedAt` field primarily. If it's null, we check `createdAt`.
    
    // We can use SQL 'COALESCE' to fallback to createdAt if lastTaskCompletedAt is null
    return await db!.select().from(users).where(
      and(
        eq(users.isBanned, false),
        lt(sql`COALESCE(${users.lastTaskCompletedAt}, ${users.createdAt})`, thresholdDate)
      )
    );
  }

  async banUser(userId: string, reason: string): Promise<User> {
    const [updatedUser] = await db!.update(users)
      .set({ 
        isBanned: true, 
        banReason: reason 
      })
      .where(eq(users.id, userId))
      .returning();
      
    // Also log this action
    await this.createActivityLog({
        userId,
        action: 'ban',
        details: `Auto-banned: ${reason}`
    });
    
    return updatedUser;
  }

  async countActiveUsers(): Promise<number> {
    const now = new Date();
    const threshold = new Date(now.getTime() - 5 * 60 * 1000); // 5 mins active window
    
    const [result] = await db!
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        and(
          eq(users.status, 'online'),
          gt(users.lastActiveAt, threshold)
        )
      );
      
    return Number(result.count);
  }

  async recordTaskCompletion(userId: string, taskId: string): Promise<void> {
    await db!.insert(userTasks).values({ userId, taskId });
  }

  async getTodayUserTaskCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [result] = await db!.select({ count: sql<number>`count(*)` })
        .from(userTasks)
        .where(and(
            eq(userTasks.userId, userId),
            gte(userTasks.completedAt, today)
        ));
    return Number(result.count);
  }

  // Task Sessions
  async createTaskSession(userId: string, taskId: string): Promise<TaskSession> {
    const [session] = await db!.insert(taskSessions).values({
        userId,
        taskId,
        status: 'in_progress'
    }).returning();
    return session;
  }

  async getActiveTaskSession(userId: string, taskId: string): Promise<TaskSession | undefined> {
      const [session] = await db!.select().from(taskSessions)
        .where(and(
            eq(taskSessions.userId, userId),
            eq(taskSessions.taskId, taskId),
            eq(taskSessions.status, 'in_progress')
        ))
        .orderBy(desc(taskSessions.startedAt))
        .limit(1);
      return session;
  }

  async updateTaskSessionStatus(sessionId: string, status: string): Promise<void> {
      await db!.update(taskSessions)
        .set({ 
            status, 
            completedAt: status === 'completed' ? new Date() : null 
        })
        .where(eq(taskSessions.id, sessionId));
  }

  async getDailyTaskCompletionHistory(userId: string): Promise<string[]> {
      const result = await db!.execute(sql`
        SELECT TO_CHAR(completed_at, 'YYYY-MM-DD') as day
        FROM user_tasks
        WHERE user_id = ${userId}
        GROUP BY day
        HAVING COUNT(*) >= 5
      `);
      
      return result.rows.map((r: any) => r.day);
  }

  async getDailyStats(days: number = 7): Promise<{ date: string, deposits: number, withdrawals: number, newUsers: number }[]> {
    // This is a complex query, often better to do in raw SQL for time-series generation
    // We generate a series of dates then LEFT JOIN each table
    const result = await db!.execute(sql`
      WITH dates AS (
          SELECT generate_series(
            current_date - (${days} - 1) * interval '1 day',
            current_date,
            '1 day'
          )::date AS date
      )
      SELECT 
        TO_CHAR(d.date, 'YYYY-MM-DD') as date,
        COALESCE(SUM(dep.amount), 0) as deposits,
        COALESCE(SUM(w.amount), 0) as withdrawals,
        COUNT(DISTINCT u.id) as "newUsers"
      FROM dates d
      LEFT JOIN deposits dep ON DATE(dep.processed_at) = d.date AND dep.status = 'approved'
      LEFT JOIN withdrawals w ON DATE(w.processed_at) = d.date AND w.status = 'approved'
      LEFT JOIN users u ON DATE(u.created_at) = d.date
      GROUP BY d.date
      ORDER BY d.date ASC
    `);

    return result.rows.map((r: any) => ({
        date: r.date,
        deposits: parseFloat(r.deposits),
        withdrawals: parseFloat(r.withdrawals),
        newUsers: parseInt(r.newUsers)
    }));
  }

  async updateAgentCount(provider: string, count: number): Promise<void> {
    // No-op for DB as we derive from table
  }

  async getAgentCount(provider: string): Promise<number> {
    const [result] = await db!
      .select({ count: sql<number>`count(*)` })
      .from(agentNumbers)
      .where(and(eq(agentNumbers.provider, provider as any), eq(agentNumbers.isActive, true)));
    return Number(result.count);
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
