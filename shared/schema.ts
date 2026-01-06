import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =================================================================
// Enums
// =================================================================
export const userRoleEnum = pgEnum("user_role", ["user", "area_manager", "regional_manager", "admin"]);

// =================================================================
// Users
// =================================================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  walletNumber: text("wallet_number"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  referralCode: text("referral_code").unique().notNull(),
  referredBy: varchar("referred_by"), // Self-reference added manually in logic if needed or just store ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Self-reference for referredBy
// Note: Circular references in Drizzle definition can be tricky, 
// so we'll treat it as a varchar that happens to be a user ID.

export const insertUserSchema = createInsertSchema(users, {
  password: z.string().min(8, "Password must be at least 8 characters long"),
}).pick({
  username: true,
  password: true,
  name: true,
  walletNumber: true,
}).extend({
  referralCode: z.string().optional(), // The code of the referrer
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// =================================================================
// Referral Settings
// =================================================================
export const referralSettings = pgTable("referral_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level1Percent: numeric("level1_percent", { precision: 5, scale: 2 }).default("5.00").notNull(),
  level2Percent: numeric("level2_percent", { precision: 5, scale: 2 }).default("3.00").notNull(),
  level3Percent: numeric("level3_percent", { precision: 5, scale: 2 }).default("2.00").notNull(),
  level4Percent: numeric("level4_percent", { precision: 5, scale: 2 }).default("1.00").notNull(),
  level5Percent: numeric("level5_percent", { precision: 5, scale: 2 }).default("0.50").notNull(),
  areaManagerPercent: numeric("area_manager_percent", { precision: 5, scale: 2 }).default("2.00").notNull(),
  regionalManagerPercent: numeric("regional_manager_percent", { precision: 5, scale: 2 }).default("3.00").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ReferralSettings = typeof referralSettings.$inferSelect;

// =================================================================
// Commissions
// =================================================================
export const commissions = pgTable("commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  beneficiaryId: varchar("beneficiary_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sourceUserId: varchar("source_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(), // 'level_1', 'level_2', ..., 'area_manager_bonus', 'regional_manager_bonus'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Commission = typeof commissions.$inferSelect;

// =================================================================
// Packages
// =================================================================
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  name: true,
  price: true,
  description: true,
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

// =================================================================
// User's Purchased Packages (Junction Table)
// =================================================================
export const userPackages = pgTable("user_packages", {
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  packageId: varchar("package_id")
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
});

// =================================================================
// Wallets
// =================================================================
export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  balance: numeric("balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  bonusBalance: numeric("bonus_balance", { precision: 10, scale: 2 })
    .default("250.00")
    .notNull(),
});

export type Wallet = typeof wallets.$inferSelect;

// =================================================================
// Withdrawals
// =================================================================
export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "pending",
  "approved",
  "rejected",
]);

export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: withdrawalStatusEnum("status").default("pending").notNull(),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export type Withdrawal = typeof withdrawals.$inferSelect;

// =================================================================
// Agent Numbers (New)
// =================================================================
export const providerEnum = pgEnum("provider", ["bkash", "nagad", "binance"]);

export const agentNumbers = pgTable("agent_numbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: providerEnum("provider").notNull(),
  number: text("number").notNull(), // Phone number or Wallet Address
  isActive: boolean("is_active").default(true).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAgentNumberSchema = createInsertSchema(agentNumbers).pick({
  provider: true,
  number: true,
  isActive: true,
});

export type AgentNumber = typeof agentNumbers.$inferSelect;
export type InsertAgentNumber = z.infer<typeof insertAgentNumberSchema>;


// =================================================================
// Deposits
// =================================================================
export const depositStatusEnum = pgEnum("deposit_status", [
  "pending",
  "approved",
  "rejected",
]);

export const deposits = pgTable("deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  transactionId: text("transaction_id").notNull(),
  
  // New Fields for Enhanced Deposit System
  method: providerEnum("method").notNull().default("bkash"), 
  agentNumber: text("agent_number"), // The agent number user sent money TO
  userPhoneNumber: text("user_phone_number"), // The number user sent money FROM
  
  status: depositStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export const insertDepositSchema = createInsertSchema(deposits).pick({
  amount: true,
  transactionId: true,
  method: true,
  agentNumber: true,
  userPhoneNumber: true,
});

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

// =================================================================
// Tasks (New)
// =================================================================
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  reward: numeric("reward", { precision: 10, scale: 2 }).notNull(),
  link: text("link"), // Video link or external link
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  reward: true,
  link: true,
  active: true,
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// =================================================================
// User Tasks (Completion Tracking)
// =================================================================
export const userTasks = pgTable("user_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  taskId: varchar("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// =================================================================
// Notifications
// =================================================================
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// =================================================================
// Site Settings
// =================================================================
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramLink: text("telegram_link"),
  whatsappLink: text("whatsapp_link"),
  noticeText: text("notice_text"),
  
  // Popup Settings
  popupTitle: text("popup_title"),
  popupBody: text("popup_body"),
  popupImageUrl: text("popup_image_url"),
  popupLink: text("popup_link"),
  popupActive: boolean("popup_active").default(false),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings);
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
