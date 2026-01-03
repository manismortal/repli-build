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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

// =================================================================
// Storage Interface
// =================================================================
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Wallets
  getWalletByUserId(userId: string): Promise<Wallet | undefined>;
  updateWalletBalance(walletId: string, amount: number): Promise<Wallet>;
  updateWalletBonus(walletId: string, newBonus: number): Promise<Wallet>;

  // Packages
  createPackage(pkg: InsertPackage): Promise<Package>;
  getPackage(id: string): Promise<Package | undefined>;
  getPackages(): Promise<Package[]>;
  updatePackage(id: string, updates: Partial<Package>): Promise<Package>;
  deletePackage(id: string): Promise<void>;

  // User Packages
  purchasePackage(userId: string, packageId: string): Promise<void>;
  hasUserPackage(userId: string): Promise<boolean>;
  
  // Withdrawals
  createWithdrawal(walletId: string, amount: number): Promise<Withdrawal>;
  getWithdrawalsByWalletId(walletId: string): Promise<Withdrawal[]>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal>;

  // Deposits
  createDeposit(userId: string, amount: number, transactionId: string): Promise<Deposit>;
  getDepositsByUserId(userId: string): Promise<Deposit[]>;
  getAllDeposits(): Promise<Deposit[]>;
  updateDepositStatus(id: string, status: string): Promise<Deposit>;
  
  // Notifications
  createNotification(userId: string, message: string): Promise<Notification>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
}

// =================================================================
// In-Memory Storage Implementation
// =================================================================
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private packages: Map<string, Package> = new Map();
  private userPackages: Map<string, string[]> = new Map(); // userId -> packageId[]
  private wallets: Map<string, Wallet> = new Map();
  private withdrawals: Map<string, Withdrawal> = new Map();
  private deposits: Map<string, Deposit> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private settings: SiteSettings | undefined;

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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password, // IMPORTANT: In a real app, hash this password!
      name: insertUser.name || null,
      isAdmin: false,
      createdAt: now,
    };
    this.users.set(id, user);

    // Also create a wallet for the new user
    await this.createWallet(id);

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
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
    };
    this.wallets.set(id, wallet);
    return wallet;
  }
  
  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId,
    );
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

  // =================================
  // Package Methods
  // =================================
  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const now = new Date();
    const newPackage: Package = {
      id,
      ...pkg,
      price: pkg.price!,
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
  // User Package Methods
  // =================================
  async purchasePackage(userId: string, packageId: string): Promise<void> {
    if (!this.users.has(userId) || !this.packages.has(packageId)) {
      throw new Error("User or Package not found");
    }
    const userPackageList = this.userPackages.get(userId) || [];
    userPackageList.push(packageId);
    this.userPackages.set(userId, userPackageList);
  }

  async hasUserPackage(userId: string): Promise<boolean> {
    const list = this.userPackages.get(userId);
    return !!list && list.length > 0;
  }

  // =================================
  // Withdrawal Methods
  // =================================
  async createWithdrawal(walletId: string, amount: number): Promise<Withdrawal> {
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
        requestedAt: now,
        processedAt: null,
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

  // =================================
  // Deposit Methods
  // =================================
  async createDeposit(userId: string, amount: number, transactionId: string): Promise<Deposit> {
    if (!this.users.has(userId)) {
      throw new Error("User not found");
    }
    const id = randomUUID();
    const now = new Date();
    const deposit: Deposit = {
      id,
      userId,
      amount: String(amount),
      transactionId,
      status: 'pending',
      createdAt: now,
      processedAt: null,
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
  
  // =================================
  // Notification Methods
  // =================================
  async createNotification(userId: string, message: string): Promise<Notification> {
      if (!this.users.has(userId)) {
          throw new Error("User not found");
      }
      const id = randomUUID();
      const now = new Date();
      const notification: Notification = {
          id,
          userId,
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
            updatedAt: now,
        };
    } else {
        this.settings = { ...this.settings, ...settings, updatedAt: now };
    }
    return this.settings;
  }
}

// =================================================================
// Database Storage Implementation
// =================================================================
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    // Create wallet
    await db.insert(wallets).values({ userId: user.id });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Wallets
  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async updateWalletBalance(walletId: string, amount: number): Promise<Wallet> {
      // Note: This is a simple update. In production, consider atomic increments or more robust handling.
      const [wallet] = await db.select().from(wallets).where(eq(wallets.id, walletId));
      if (!wallet) throw new Error("Wallet not found");
      
      const newBalance = (parseFloat(wallet.balance) + amount).toFixed(2);
      const [updatedWallet] = await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, walletId)).returning();
      return updatedWallet;
  }

  async updateWalletBonus(walletId: string, newBonus: number): Promise<Wallet> {
      const [wallet] = await db.select().from(wallets).where(eq(wallets.id, walletId));
      if (!wallet) throw new Error("Wallet not found");
      
      const [updatedWallet] = await db.update(wallets).set({ bonusBalance: newBonus.toFixed(2) }).where(eq(wallets.id, walletId)).returning();
      return updatedWallet;
  }

  // Packages
  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPkg] = await db.insert(packages).values({
        ...pkg,
        price: pkg.price!.toString()
    }).returning();
    return newPkg;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package> {
    const [updatedPkg] = await db.update(packages).set(updates).where(eq(packages.id, id)).returning();
    return updatedPkg;
  }

  async deletePackage(id: string): Promise<void> {
    await db.delete(packages).where(eq(packages.id, id));
  }

  // User Packages
  async purchasePackage(userId: string, packageId: string): Promise<void> {
    await db.insert(userPackages).values({
      userId,
      packageId,
    });
  }

  async hasUserPackage(userId: string): Promise<boolean> {
      const [result] = await db.select({ count: sql<number>`count(*)` })
        .from(userPackages)
        .where(eq(userPackages.userId, userId));
      return Number(result.count) > 0;
  }

  // Withdrawals
  async createWithdrawal(walletId: string, amount: number): Promise<Withdrawal> {
    const [withdrawal] = await db.insert(withdrawals).values({
      walletId,
      amount: String(amount),
    }).returning();
    return withdrawal;
  }

  async getWithdrawalsByWalletId(walletId: string): Promise<Withdrawal[]> {
    return await db.select().from(withdrawals).where(eq(withdrawals.walletId, walletId)).orderBy(desc(withdrawals.requestedAt));
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return await db.select().from(withdrawals).orderBy(desc(withdrawals.requestedAt));
  }

  async updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal> {
    const [withdrawal] = await db.update(withdrawals).set({
      status: status as any,
      processedAt: new Date(),
    }).where(eq(withdrawals.id, id)).returning();
    return withdrawal;
  }

  // Deposits
  async createDeposit(userId: string, amount: number, transactionId: string): Promise<Deposit> {
    const [deposit] = await db.insert(deposits).values({
      userId,
      amount: String(amount),
      transactionId,
    }).returning();
    return deposit;
  }

  async getDepositsByUserId(userId: string): Promise<Deposit[]> {
    return await db.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
  }

  async getAllDeposits(): Promise<Deposit[]> {
    return await db.select().from(deposits).orderBy(desc(deposits.createdAt));
  }

  async updateDepositStatus(id: string, status: string): Promise<Deposit> {
    const [deposit] = await db.update(deposits).set({
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
  async createNotification(userId: string, message: string): Promise<Notification> {
    const [notification] = await db.insert(notifications).values({
      userId,
      message,
    }).returning();
    return notification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings;
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const [existing] = await db.select().from(siteSettings).limit(1);
    if (existing) {
        const [updated] = await db.update(siteSettings).set({ ...settings, updatedAt: new Date() }).where(eq(siteSettings.id, existing.id)).returning();
        return updated;
    } else {
        const [created] = await db.insert(siteSettings).values({ 
            telegramLink: settings.telegramLink,
            whatsappLink: settings.whatsappLink,
            noticeText: settings.noticeText,
            popupTitle: settings.popupTitle,
            popupBody: settings.popupBody,
            popupImageUrl: settings.popupImageUrl,
            popupLink: settings.popupLink,
            popupActive: settings.popupActive
        }).returning();
        return created;
    }
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
