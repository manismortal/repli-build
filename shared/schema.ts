import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  numeric,
  integer,
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
  username: text("username").notNull().unique(), // Will map phoneNumber to this for auth compat
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  phoneNumber: text("phone_number").unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(), // Added for ban logic
  isFrozen: boolean("is_frozen").default(false).notNull(), // Added for freeze logic (financial)
  banReason: text("ban_reason"), // Reason for the ban (e.g., "lazy")
  savedWalletNumber: text("saved_wallet_number"), // User's saved withdrawal number
  savedWalletProvider: text("saved_wallet_provider"), // 'bkash', 'nagad', 'binance'
  walletLastUpdatedAt: timestamp("wallet_last_updated_at"), // Track 15-day lock
  lastTaskCompletedAt: timestamp("last_task_completed_at"), // Added for inactivity tracking
  lastActiveAt: timestamp("last_active_at"), // Last heartbeat/activity
  status: text("status").default("offline"), // online, offline, idle
  role: userRoleEnum("role").default("user").notNull(),
  referralCode: text("referral_code").unique().notNull(),
  referredBy: varchar("referred_by"), 
  hasSeenWelcome: boolean("has_seen_welcome").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  password: z.string().min(8, "Password must be at least 8 characters long"),
  email: z.string().email("Invalid email address").optional(), // Optional per "user will put... email" but maybe strictly required? Prompt said "user will put ... email". I'll make it optional in schema but required in form if needed. Let's make it standard z.string().email() but nullable in DB if they skip? Prompt implies fields are: Name, Phone, Email. So Email is likely required input.
}).pick({
  username: true, // Keep for backward compat, optional in form input
  password: true,
  name: true,
  email: true,
  phoneNumber: true,
}).extend({
  referralCode: z.string().optional(),
  captcha: z.string().optional(), // For controller validation
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
  dailyReward: numeric("daily_reward", { precision: 10, scale: 2 }).default("0.00").notNull(),
  description: text("description"),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  name: true,
  price: true,
  dailyReward: true,
  description: true,
  isVisible: true,
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
  lockedBalance: numeric("locked_balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  referralBalance: numeric("referral_balance", { precision: 10, scale: 2 })
    .default("0.00")
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

export const withdrawalSourceEnum = pgEnum("withdrawal_source", [
  "main",
  "referral",
]);

export const withdrawalMethodEnum = pgEnum("withdrawal_method", [
  "bkash",
  "nagad",
  "binance",
]);

export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  fee: numeric("fee", { precision: 10, scale: 2 }).default("0.00").notNull(),
  finalAmount: numeric("final_amount", { precision: 10, scale: 2 }).notNull(),
  method: withdrawalMethodEnum("method").default("bkash").notNull(),
  status: withdrawalStatusEnum("status").default("pending").notNull(),
  source: withdrawalSourceEnum("source").default("main").notNull(),
  destinationNumber: text("destination_number").notNull(),
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
export const linkTypeEnum = pgEnum("link_type", ["video", "subscription", "external"]);

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  link: text("link"), // Primary link (can be video or external)
  linkType: linkTypeEnum("link_type").default("video").notNull(),
  visitDuration: integer("visit_duration").default(60).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  link: true,
  linkType: true,
  visitDuration: true,
  active: true,
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// =================================================================
// Task Sessions (Event-Driven Tracking)
// =================================================================
export const taskSessions = pgTable("task_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  status: text("status").default("in_progress").notNull(), // 'in_progress', 'completed'
});

export type TaskSession = typeof taskSessions.$inferSelect;

// =================================================================
// User Tasks (Completion Tracking - Historical)
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
export const notificationTypeEnum = pgEnum("notification_type", [
  "general",
  "welcome",
  "deposit_approved",
  "withdrawal_approved",
  "referral_bonus"
]);

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").default("general").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// =================================================================
// Activity Logs
// =================================================================
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // 'login', 'logout', 'task_complete', 'heartbeat', 'ban'
  details: text("details"), // JSON string or text details
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  details: true,
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

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

  // Offer Modal Settings
  offerModalActive: boolean("offer_modal_active").default(false),
  offerModalTitle: text("offer_modal_title").default("Exclusive Offer!"),
  offerModalBenefits: text("offer_modal_benefits").default("Unlock premium features now!"), // Can be multiline or JSON string
  offerModalLink: text("offer_modal_link").default("/products"), // Defaults to products page
  offerModalCtaText: text("offer_modal_cta_text").default("Subscribe Now"),
  
  // Banking & Transaction Settings
  bankingStartTime: text("banking_start_time").default("09:00"), // HH:mm format
  bankingEndTime: text("banking_end_time").default("17:00"), // HH:mm format
  isDepositEnabled: boolean("is_deposit_enabled").default(true).notNull(),
  isWithdrawalEnabled: boolean("is_withdrawal_enabled").default(true).notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings);
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
