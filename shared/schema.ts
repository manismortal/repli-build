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
// Users
// =================================================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  walletNumber: text("wallet_number"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  password: z.string().min(8, "Password must be at least 8 characters long"),
}).pick({
  username: true,
  password: true,
  name: true,
  walletNumber: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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
  status: depositStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export const insertDepositSchema = createInsertSchema(deposits).pick({
  amount: true,
  transactionId: true,
});

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

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
