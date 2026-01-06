import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema, insertPackageSchema, insertDepositSchema, insertAgentNumberSchema, User } from "@shared/schema";
import { z } from "zod";
import { generateReferralCode, processReferralCommissions } from "./referral";
import rateLimit from "express-rate-limit";
import { agentService } from "./services/agent";

const saltRounds = 10;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

async function seedAdminUsers() {
  const admins = [
    { username: "admin01", password: "P@sswOrd123!", role: "admin" },
    { username: "sysop02", password: "Secur3P@ss!", role: "admin" },
    { username: "mgr03", password: "Str0ngP@ss!", role: "admin" },
    { username: "user04", password: "MyP@ssw0rd!", role: "admin" },
  ];

  for (const admin of admins) {
    const existing = await storage.getUserByUsername(admin.username);
    if (!existing) {
      const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
      const referralCode = generateReferralCode();
      
      // Ensure referral code is unique
      let uniqueRef = referralCode;
      let isUnique = false;
      while (!isUnique) {
          const check = await storage.getUserByReferralCode(uniqueRef);
          if (!check) isUnique = true;
          else uniqueRef = generateReferralCode();
      }

      await storage.createUser({
        username: admin.username,
        password: hashedPassword,
        name: `Admin ${admin.username}`,
        referralCode: uniqueRef,
      });
      
      // We need to update the created user to set isAdmin and role, 
      // as createUser might default them or interface might not allow passing them directly depending on implementation.
      // Checking storage.createUser implementation: it takes InsertUser & { referralCode, referredBy? }. 
      // InsertUser doesn't usually include isAdmin/role for security.
      
      const createdUser = await storage.getUserByUsername(admin.username);
      if (createdUser) {
        await storage.updateUser(createdUser.id, { 
            isAdmin: true, 
            role: admin.role as "admin" | "user" | "area_manager" | "regional_manager" 
        });
        console.log(`Seeded admin user: ${admin.username}`);
      }
    }
  }
}

function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as User).isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed Admins
  await seedAdminUsers();

  // Session middleware
  // In a production app, you'd want to use a persistent session store
  // like connect-pg-simple instead of the default MemoryStore.
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "a-very-secret-secret-key", // Use an environment variable for this
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production", // true in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: "strict", // Added security
      },
    })
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Local Strategy for username/password login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, (user as User).id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // =================================================================
  // API Routes
  // =================================================================

  // --- AUTHENTICATION ---

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { username, password, name, referralCode: providedRefCode } = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken." });
      }

      let referredBy: string | undefined = undefined;
      if (providedRefCode) {
        const referrer = await storage.getUserByReferralCode(providedRefCode);
        if (referrer) {
            referredBy = referrer.id;
        } else {
             // Optional: Return error if code is invalid, or just ignore. 
             // Let's return error to be helpful.
             return res.status(400).json({ message: "Invalid referral code provided." });
        }
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Generate unique 6-digit referral code
      let newReferralCode = generateReferralCode();
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 5) {
        const existing = await storage.getUserByReferralCode(newReferralCode);
        if (!existing) {
          isUnique = true;
        } else {
          newReferralCode = generateReferralCode();
          attempts++;
        }
      }
      
      if (!isUnique) {
        return res.status(500).json({ message: "Failed to generate unique referral code. Please try again." });
      }

      const user = await storage.createUser({
        username,
        password: hashedPassword,
        name,
        referralCode: newReferralCode,
        referredBy,
      });

      // Check if this is the first user, if so, make them admin
      const allUsers = await storage.getAllUsers();
      if (allUsers.length === 1) {
        await storage.updateUser(user.id, { isAdmin: true });
        user.isAdmin = true; // Reflect in response
      }

      // Create welcome notification
      await storage.createNotification(user.id, "Welcome to Maersk Line! Your account has been successfully created.");

      // Log the user in automatically after registration
      req.login(user, async (err) => {
        if (err) {
          return next(err);
        }
        // Exclude password from the response and include balance
        const wallet = await storage.getWalletByUserId(user.id);
        const { password: _, ...userResponse } = user;
        return res.status(201).json({ 
          ...userResponse, 
          balance: wallet?.balance || "0.00",
          bonusBalance: wallet?.bonusBalance || "0.00",
          hasPackage: false
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", details: error.errors });
      }
      next(error);
    }
  });

  app.post("/api/auth/login", loginLimiter, passport.authenticate("local"), async (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    const user = req.user as User;
    const wallet = await storage.getWalletByUserId(user.id);
    const hasPackage = await storage.hasUserPackage(user.id);
    
    const { password: _, ...userResponse } = user;
    res.json({ 
      ...userResponse, 
      balance: wallet?.balance || "0.00",
      bonusBalance: wallet?.bonusBalance || "0.00",
      hasPackage
    });
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return next(destroyErr);
        }
        res.clearCookie("connect.sid"); // The default session cookie name
        res.status(200).json({ message: "Logged out successfully." });
      });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as User;
      const wallet = await storage.getWalletByUserId(user.id);
      // Check for active packages
      // We don't have direct access to userPackages here easily without storage method
      // Let's add `hasUserPackage` to storage
      const hasPackage = await storage.hasUserPackage(user.id);

      const { password: _, ...userResponse } = user;
      res.json({ 
        ...userResponse, 
        balance: wallet?.balance || "0.00",
        bonusBalance: wallet?.bonusBalance || "0.00",
        hasPackage
      });
    } else {
      res.status(401).json({ message: "You are not authenticated." });
    }
  });

  // --- REFERRALS ---
  app.get("/api/user/referrals", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as User;

    const commissions = await storage.getCommissionsByUserId(user.id);
    const totalEarned = commissions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
    
    const directReferrals = await storage.getReferrals(user.id);
    
    const referralsWithStatus = await Promise.all(directReferrals.map(async (u) => {
        const hasPackage = await storage.hasUserPackage(u.id);
        return { 
            username: u.username,
            joinedAt: u.createdAt,
            isActive: hasPackage
        };
    }));

    res.json({
        totalEarned: totalEarned.toFixed(2),
        totalReferrals: referralsWithStatus.length,
        activeReferrals: referralsWithStatus.filter(r => r.isActive).length,
        referrals: referralsWithStatus,
        role: user.role,
        referralCode: user.referralCode
    });
  });

  // --- NOTIFICATIONS ---
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const notifications = await storage.getNotificationsByUserId((req.user as User).id);
    res.json(notifications);
  });

  // --- PACKAGES PURCHASE ---
  app.post("/api/packages/purchase", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const { packageId } = req.body;
    const user = req.user as User;

    try {
        const pkg = await storage.getPackage(packageId);
        if (!pkg) return res.status(404).json({ message: "Package not found" });

        const wallet = await storage.getWalletByUserId(user.id);
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        const price = parseFloat(pkg.price);
        if (parseFloat(wallet.balance) < price) {
             return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct balance
        await storage.updateWalletBalance(wallet.id, -price);

        // Record Purchase
        await storage.purchasePackage(user.id, pkg.id);

        // Process Commissions
        await processReferralCommissions(user.id, price);

        res.json({ message: "Package purchased successfully", balance: (parseFloat(wallet.balance) - price).toFixed(2) });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Purchase failed" });
    }
  });

  // --- DEPOSITS ---
  app.post("/api/deposits", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const data = insertDepositSchema.parse(req.body);
      const deposit = await storage.createDeposit((req.user as User).id, parseFloat(data.amount as string), data.transactionId);
      res.status(201).json(deposit);
    } catch (error) {
       if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", details: error.errors });
      }
      res.status(500).json({ message: "Failed to create deposit" });
    }
  });

  app.get("/api/deposits", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const deposits = await storage.getDepositsByUserId((req.user as User).id);
    res.json(deposits);
  });

  app.put("/api/users/wallet", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { walletNumber } = req.body;
    if (!walletNumber || walletNumber.length !== 11) {
      return res.status(400).json({ message: "Invalid wallet number" });
    }
    try {
      const updatedUser = await storage.updateUser((req.user as User).id, { walletNumber });
      res.json(updatedUser);
    } catch (e) {
      res.status(500).json({ message: "Failed to update wallet number" });
    }
  });

  // --- WITHDRAWALS ---
  app.post("/api/withdrawals", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user as User;
    if (!user.walletNumber) {
        return res.status(400).json({ message: "Please set your withdrawal wallet number first." });
    }

    const { amount } = req.body;
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await storage.getWalletByUserId(user.id);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Check Balance
    const currentBalance = parseFloat(wallet.balance);
    const bonusBalance = parseFloat(wallet.bonusBalance || "0");
    
    // 60-day rule check
    const registrationDate = new Date(user.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const isBonusWithdrawable = diffDays >= 60;

    let totalAvailable = currentBalance;
    if (isBonusWithdrawable) {
        totalAvailable += bonusBalance;
    }

    if (withdrawAmount > totalAvailable) {
        return res.status(400).json({ message: "Insufficient funds." });
    }

    // Special Rule: If withdrawing BEFORE 60 days, and they have a bonus, they FORFEIT it.
    // However, they can only withdraw from MAIN BALANCE.
    if (!isBonusWithdrawable) {
        if (withdrawAmount > currentBalance) {
             return res.status(400).json({ message: "Bonus balance is locked for 60 days." });
        }
        // If they proceed with ANY withdrawal, they forfeit the bonus
        if (bonusBalance > 0) {
            await storage.updateWalletBonus(wallet.id, 0);
            await storage.createNotification(user.id, "Your welcome bonus of 250 BDT has been forfeited due to early withdrawal.");
        }
    } else {
        // If > 60 days, merge bonus to main balance if available
        if (bonusBalance > 0) {
             await storage.updateWalletBalance(wallet.id, bonusBalance); 
             await storage.updateWalletBonus(wallet.id, 0); 
             // Now balance is current + bonus.
        }
    }
    
    // Deduct from main balance
    try {
        await storage.updateWalletBalance(wallet.id, -withdrawAmount); // Deduct now
        const withdrawal = await storage.createWithdrawal(wallet.id, withdrawAmount);
        res.status(201).json(withdrawal);
    } catch (e) {
        res.status(500).json({ message: "Withdrawal failed" });
    }
  });

  // --- ADMIN ROUTES ---

  app.get("/api/admin/stats", isAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    const withdrawals = await storage.getAllWithdrawals();
    const packages = await storage.getPackages();
    const deposits = await storage.getAllDeposits();

    const stats = {
      totalUsers: users.length,
      pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
      activePackages: packages.length,
      totalDeposits: deposits.filter(d => d.status === 'approved').reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2),
      totalPayouts: withdrawals.filter(w => w.status === 'approved').reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2),
    };
    res.json(stats);
  });

  app.get("/api/admin/users", isAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    // Don't send passwords
    const safeUsers = await Promise.all(users.map(async u => {
      const { password, ...safeUser } = u;
      const wallet = await storage.getWalletByUserId(u.id);
      return { ...safeUser, balance: wallet?.balance };
    }));
    res.json(safeUsers);
  });

  app.get("/api/admin/withdrawals", isAdmin, async (req, res) => {
    const withdrawals = await storage.getAllWithdrawals();
    // Enrich with username
    const enrichedWithdrawals = await Promise.all(withdrawals.map(async w => {
      const wallet = Array.from((storage as any).wallets?.values() || []).find((wl: any) => wl.id === w.walletId) as any 
                    || await storage.getWalletByUserId((await storage.getUser((await storage.getWalletByUserId(w.walletId as any))?.userId as any) as any)?.id); 
      // The above is getting messy due to lack of direct relation in MemStorage map access in route. 
      // Better:
      // In database implementation, we would do a join.
      // Here, let's just get the wallet then user.
      
      // Since `getWalletByUserId` returns wallet by userId, we actually need getWallet(id). 
      // But we don't have getWallet(id) exposed clearly in IStorage for generic access, only getWalletByUserId.
      // However, we know w.walletId.
      
      // Let's rely on finding the user who owns this wallet.
      // In MemStorage, we can iterate. In DB, we query.
      
      // Hacky fix for now to support both:
      const allUsers = await storage.getAllUsers();
      let username = "Unknown";
      
      for (const u of allUsers) {
          const uWallet = await storage.getWalletByUserId(u.id);
          if (uWallet && uWallet.id === w.walletId) {
              username = u.username;
              break;
          }
      }
      
      return { ...w, username };
    }));
    res.json(enrichedWithdrawals);
  });

  app.post("/api/admin/withdrawals/:id", isAdmin, async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    try {
      const withdrawal = await storage.updateWithdrawalStatus(req.params.id, status);
      res.json(withdrawal);
    } catch (e) {
      res.status(404).json({ message: "Withdrawal not found" });
    }
  });

  app.get("/api/admin/packages", isAdmin, async (req, res) => {
    const packages = await storage.getPackages();
    res.json(packages);
  });

  app.post("/api/admin/packages", isAdmin, async (req, res) => {
    try {
      const pkgData = insertPackageSchema.parse(req.body);
      const newPkg = await storage.createPackage(pkgData);
      res.status(201).json(newPkg);
    } catch (e) {
      res.status(400).json({ message: "Invalid package data" });
    }
  });

  app.put("/api/admin/packages/:id", isAdmin, async (req, res) => {
    try {
      const pkg = await storage.updatePackage(req.params.id, req.body);
      res.json(pkg);
    } catch (e) {
      res.status(404).json({ message: "Package not found" });
    }
  });

  app.delete("/api/admin/packages/:id", isAdmin, async (req, res) => {
    try {
      await storage.deletePackage(req.params.id);
      res.status(204).end();
    } catch (e) {
      res.status(404).json({ message: "Package not found" });
    }
  });

  app.post("/api/admin/notifications", isAdmin, async (req, res) => {
    const { userId, message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });
    
    try {
      if (userId) {
        await storage.createNotification(userId, message);
      } else {
        // Broadcast to all users
        const users = await storage.getAllUsers();
        await Promise.all(users.map(u => storage.createNotification(u.id, message)));
      }
      res.status(201).json({ message: "Notification sent" });
    } catch (e) {
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  app.get("/api/admin/deposits", isAdmin, async (req, res) => {
    const deposits = await storage.getAllDeposits();
    // Enrich with username
    const enrichedDeposits = await Promise.all(deposits.map(async d => {
        const user = await storage.getUser(d.userId);
        return { ...d, username: user?.username || "Unknown" };
    }));
    res.json(enrichedDeposits);
  });

  app.post("/api/admin/deposits/:id", isAdmin, async (req, res) => {
      const { status } = req.body;
      if (!['approved', 'rejected'].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
      }
      try {
          const deposit = await storage.updateDepositStatus(req.params.id, status);
          res.json(deposit);
      } catch (e) {
          res.status(404).json({ message: "Deposit not found" });
      }
  });

  // --- SETTINGS ROUTES ---
  app.get("/api/settings", async (_req, res) => {
      const settings = await storage.getSiteSettings();
      res.json(settings || {});
  });

  app.put("/api/admin/settings", isAdmin, async (req, res) => {
      try {
          const settings = await storage.updateSiteSettings(req.body);
          res.json(settings);
      } catch (e) {
          res.status(500).json({ message: "Failed to update settings" });
      }
  });

  // --- AGENT & REPORTS ROUTES ---

  app.get("/api/agents/:provider", async (req, res) => {
    // Public route to get active agent
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const { provider } = req.params;
    if (!["bkash", "nagad", "binance"].includes(provider)) {
      return res.status(400).json({ message: "Invalid provider" });
    }
    const result = await agentService.getActiveAgent(provider as any);
    if (result.status !== "open") {
      return res.status(503).json(result);
    }
    res.json(result.agent);
  });

  app.get("/api/admin/agents", isAdmin, async (req, res) => {
    const agents = await agentService.getAllAgents();
    res.json(agents);
  });

  app.post("/api/admin/agents", isAdmin, async (req, res) => {
    try {
      const data = insertAgentNumberSchema.parse(req.body);
      const agent = await agentService.createAgent(data);
      res.status(201).json(agent);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", details: e.errors });
      }
      res.status(500).json({ message: "Failed to create agent" });
    }
  });

  app.patch("/api/admin/agents/:id", isAdmin, async (req, res) => {
    const { isActive } = req.body;
    try {
      const agent = await agentService.toggleAgentStatus(req.params.id, isActive);
      res.json(agent);
    } catch (e) {
      res.status(404).json({ message: "Agent not found" });
    }
  });

  app.get("/api/admin/reports/:provider", isAdmin, async (req, res) => {
    const { provider } = req.params;
    if (!["bkash", "nagad", "binance"].includes(provider)) {
      return res.status(400).json({ message: "Invalid provider" });
    }
    try {
      const csv = await agentService.generateReport(provider as any);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${provider}-report-${Date.now()}.csv`);
      res.send(csv);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  return httpServer;
}
