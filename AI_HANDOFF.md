# Project Context & Handoff

**Project Name:** MAERSK.Line BD (Maritime Investment Platform)
**Status:** Production Ready / Deployment Ready
**Last Updated:** January 13, 2026 (Part 2)

## 1. Project Overview
This is a full-stack investment platform web application designed for mobile users (responsive UI). It allows users to register, purchase shipping packages, complete daily video tasks for rewards, and manage a wallet with simulated bKash/Nagad/Binance deposits and withdrawals.

## 2. Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Shadcn UI, Framer Motion, Recharts.
*   **Backend:** Node.js (Express), Passport.js (Auth).
*   **Database:** PostgreSQL (with Drizzle ORM).
*   **Language:** TypeScript.

## 3. Key Features Implemented
*   **Authentication:** Login/Register with password hashing.
*   **Multilingual:** Full English/Bengali support (defaulting to Bengali).
*   **Wallet System:**
    *   **Balances:** Split into Available, Locked (Daily Profits), and Referral.
    *   **Profit Lock:** 30-day lock cycle for daily earnings and welcome bonus.
    *   **Withdrawals:** Per-request destination number (no stored wallet). Supports Main and Referral sources.
    *   **Referral Earning:** 40% instant commission on direct package purchases.
    *   **Referral Unlock:** 3 active referrals required to withdraw referral balance.
*   **Admin Panel:** 
    *   **Dashboard:** Manage users, approve/reject deposits & withdrawals.
    *   **Agent Control:** Add, toggle, and manage agent numbers/wallets.
    *   **Packages:** Now supports configurable daily rewards.
*   **UI/UX:** 
    *   **Referral Hub:** Stepwise progress (1-3) and dedicated dashboard.
    *   **Navigation:** Five-tab bottom navigation including 'Referral'.
    *   **Payments:** Enhanced selection UI with large SVG logos.

## 4. Folder Structure
*   `client/`: React frontend.
*   `server/`: Express API and storage logic.
*   `shared/`: Database schema (`schema.ts`) and types.
*   `handover/`: Development reports and JSON logs.

## 5. Deployment Info
*   **Docker:** `Dockerfile` included.
*   **Environment:** Requires `DATABASE_URL` (Postgres) and `SESSION_SECRET`.
*   **Repo:** `https://github.com/manismortal/MARITME-iNVESTMENT`

## 6. How to Resume Work
1.  **Clone:** `git clone https://github.com/manismortal/MARITME-iNVESTMENT.git`
2.  **Install:** `npm install`
3.  **Run:** `npm run dev` (Development) or `npm start` (Production).
4.  **Admin:** First registered user is Admin.

## 7. Recent Changes (Jan 8, 2026)
*   **Referral Overhaul:** Implemented 40% single-level commission and 3-active-referral withdrawal lock.
*   **Profit Cycle:** Changed distribution cycle from 60 days to 30 days.
*   **Locked Balance:** Implemented `/api/wallet/claim-locked` and task-based locked credits.
*   **Withdrawal Rearchitecture:** Removed persistent wallet numbers; added `destinationNumber` to withdrawal requests.
*   **Package Schema:** Added `dailyReward` field and updated task logic to calculate rewards dynamically.
*   **UI Branding:** Redesigned 'Referral Hub' and updated Bottom Navigation and Profile modules.

## 8. Updates (Jan 9, 2026) - Admin Restoration & Logic Overhaul

### **A. Core Logic & Business Rules**
*   **30-Day Cycle:** Reduced package maturity/profit cycle from 60 days to **30 days**.
*   **Profit Calculation:** Updated to **x12 Multiplier** over 30 days (e.g., 250 BDT -> 100/day).
*   **Inactivity Policy:**
    *   **Ban:** Accounts inactive (no tasks) for **5 days** are automatically banned.
    *   **Withdrawal:** Users must have completed tasks within the last **24 hours** to be eligible for withdrawal.
*   **Registration:** Streamlined flow with Name, **Phone**, **Email**, and **Captcha** (backend-verified).

### **B. Admin Panel Restoration**
*   **Routing Fix:** Refactored `App.tsx` to remove nested routers, fixing the "404 Not Found" error on admin sub-pages.
*   **Controls Enabled:**
    *   **User Deletion:** Added `DELETE` button logic in UI and backend.
    *   **Role Management:** Added `Edit` button logic to change roles (User/Admin/Manager).
    *   **Agent Management:** Added ability to delete agent numbers.
*   **Security:**
    *   Implemented 4 new secure admin accounts (`admin_alpha`, etc.).
    *   Fixed seed logic to force-update admin privileges on server start.

### **C. Technical Improvements**
*   **Atomic Updates:** Fixed race conditions in wallet balance updates (`server/storage.ts`).
*   **Database Seeding:** Added `script/seed_packages.ts` to align database package values with the new frontend logic.
*   **Schema:** Added `email`, `phoneNumber`, `isBanned`, `lastTaskCompletedAt` to `users` table.

### **D. Credentials (Secure)**
*   **Usernames:** `admin_alpha`, `admin_beta`, `admin_gamma`, `admin_delta`
*   **Passwords:** (See `server/routes.ts` seed function)

## 9. Updates (Jan 10, 2026) - UI Modernization, Content & Branding

### **A. Profile & UI Redesign**
*   **Profile Page (`client/src/pages/profile.tsx`):**
    *   Redesigned for a premium mobile-app feel with a `Slate-900` gradient header and floating avatar.
    *   Implemented a unified color palette (Maersk Blue, Slate, Accent Orange) consistent with the Dashboard.
    *   Added a "Quick Stats" card (Balance, Ref Earning, Role) and improved "Quick Links" grid visibility.
    *   Integrated "About Us" into the General menu.

### **B. New "About Us" Page**
*   **Route:** Created prioritized route `/about`.
*   **Localization:** Fully localized to Bengali (বাংলা) for better user engagement.
*   **Content:**
    *   Detailed Mission, Vision, Values (Integrity, Innovation, Collaboration).
    *   **Partnership:** Highlighted association with **Maersk Line BD** and **Chittagong Port** modernization.
    *   **Visuals:** Embedded `/about us.png` for visual context.
*   **Access:** Added an "Info" icon to the top header (`layout.tsx`) and a menu link in the Profile page.

### **C. Branding & Footer**
*   **Footer Component (`client/src/components/footer.tsx`):**
    *   **Metrics:** "Established 2020", "Revenue 100Cr+", and a live "Active Users" ticker (~900k+).
    *   **Placement:** Integrated into both **Dashboard** and **Profile** pages.

### **D. UX Improvements**
*   **Investment Flow:** Changed "Invest Now" button behavior on the Products page (`/products`) to redirect users to the **Deposit** page (`/payment/methods`), creating a more logical user journey.

## 11. Updates (Jan 12, 2026) - Withdrawal System, Notifications & Optimization

### **A. Withdrawal System Overhaul**
*   **Multi-Method Support:** Users can now withdraw via **bKash**, **Nagad**, and **Binance (TRC20)**.
*   **Withdrawal Fee Logic:**
    *   Implemented dynamic fee calculation (2-8%).
    *   Standardized: **5% fee** for Mobile Banking (bKash/Nagad) and **2% fee** for Binance.
    *   Dynamic "You Receive" amount display in the frontend.
*   **Business Rules & Limits:**
    *   **Minimum Limit:** Enforced a **150 BDT minimum** for referral bonus withdrawals.
    *   **Daily Limit:** Limited users to **5 withdrawal requests per day** to prevent spam and manage liquidity.
    *   **Direct Execution:** Removed the mandatory daily task completion requirement for withdrawals (unlocked funds are now directly withdrawable).
    *   **Idempotency:** Implemented a **1-minute cooldown** between similar withdrawal requests to prevent accidental double-submissions.
*   **Admin Reporting:**
    *   Added **CSV Export** functionality for withdrawals, filtered by payment method (bKash, Nagad, Binance, or All).
    *   Organized data includes: Date, Username, Method, Dest. Number, Amount, Fee, and Final Amount.

### **B. Dedicated Notification Service**
*   **Service Architecture:** Created `server/services/notification.ts` to centralize notification logic.
*   **Broadcast Optimization:** Admin broadcasts are now processed in **chunks (batching)** to handle large user bases without timing out.
*   **Notification Center:**
    *   Implemented a dedicated **Notifications Page** for users.
    *   Added a **Bell Icon with Unread Badge** to the top header.
    *   Implemented "Mark all as read" functionality and visual unread indicators.
*   **Service Monitoring:** Added a service stats endpoint to track uptime and basic service health.

### **C. Image Optimization & Branding**
*   **WebP Transition:** Converted all primary image assets from `.png` to **`.webp`** for faster loading and better compression.
    *   Updated Bkash, Nagad, and Binance icons.
    *   Updated Ship images and "About Us" visuals.
*   **Randomized Avatars:**
    *   Implemented a deterministic random avatar system (`avater1.webp` to `avater4.webp`).
    *   Users are assigned an avatar based on their unique ID, ensuring consistency across sessions.
*   **Support Branding:** Replaced generic icons with a custom **`service.webp`** support logo.

### **D. Stability & Bug Fixes**
*   **Withdrawal Fix:** Resolved a critical bug where the withdrawal page would appear blank due to missing state definitions.
*   **TypeScript Enforcement:** Fixed over 10 TypeScript errors related to `any` types and undefined property access in payment and admin modules.
*   **Build Integrity:** Verified that `npx tsc --noEmit` passes with 0 errors.

## 12. Future AI Development & Recommendations
*   **Automated CSV Mailing:** Schedule the admin withdrawal CSVs to be emailed daily to finance managers.
*   **Real-time Notifications:** Integrate WebSockets (Socket.io) for instant notification delivery without page refresh.
*   **Enhanced IDOR Checks:** Perform deeper security audits on withdrawal ID access patterns.
*   **Unit Testing:** Expand coverage for the new `NotificationService` and withdrawal fee calculators.

## 13. Updates (Jan 13, 2026) - User Onboarding, UX Polish & Deployment Readiness

### **A. User Onboarding Flow**
*   **Welcome System (`client/src/components/welcome-flow.tsx`):**
    *   **Lucrative Popup:** A new, animated welcome modal congratulates users on registration with a **250 BDT** bonus confirmation.
    *   **Tutorial Mode:** After claiming the bonus, a second modal provides a quick visual guide on "How to Deposit" and "How to Complete Tasks".
    *   **Persistence:** Added `hasSeenWelcome` boolean flag to the database to ensure this flow appears **only once** per user lifetime.
*   **Special Event Popups (`client/src/components/event-popups.tsx`):**
    *   Implemented a unified popup system for major events: **Deposit Approval**, **Withdrawal Approval**, and **Referral Bonus**.
    *   These popups trigger automatically when the corresponding notification type is received.

### **B. Authentication & Registration Fixes**
*   **Simplified Registration:** Removed the **Email** field from the registration form to reduce friction. Backend schema updated to handle optional email.
*   **Session Stability:**
    *   **Trust Proxy:** Enabled `app.set("trust proxy", 1)` to allow secure cookies behind Render's load balancer.
    *   **MemoryStore:** Replaced default memory store with `memorystore` package to prevent memory leaks and improve session persistence.
    *   **Cookie Policy:** Relaxed cookie `sameSite` policy to `lax` to fix the "Invalid Captcha" issue during cross-origin or initial loads.

### **C. Admin & Navigation UX**
*   **Admin Access:** Added a visible **Admin Shield Icon** to the top header in the main layout (`layout.tsx`). It is conditionally rendered only for users with `isAdmin: true`.
*   **Crash Fix:** Resolved a critical runtime error on the **Team Page** caused by a missing `framer-motion` import.

### **D. Deployment & CI/CD**
*   **Render Deployment:**
    *   Created `render.yaml` (Infrastructure as Code) for one-click deployment.
    *   Configured **Free Tier** explicitly for Web Service and Postgres.
    *   Added `/health` endpoint for uptime monitoring.
*   **Build Optimization:**
    *   Refactored `server/index.ts` to **lazy-load Vite** dependencies. This prevents the production server from crashing due to bundling build-time ESM plugins (like `@tailwindcss/vite`) into the CJS runtime.
    *   Switched build output to **CommonJS (`cjs`)** for better Node.js compatibility.
*   **CI/CD Pipeline:**
    *   Created `.github/workflows/ci-cd.yml` for automated testing and building on push.
    *   Added `GITHUB_SETUP.md` with detailed instructions for repository creation and secret management.

## 14. Updates (Jan 13, 2026 - Part 2) - Critical Fixes & UX Enhancements

### **A. Critical Bug Fixes (Withdraw Page)**
*   **White Screen Error:** Resolved a crash on the Withdraw page caused by missing `Tabs`, `TabsList`, and `TabsTrigger` imports in `client/src/pages/withdraw.tsx`.
*   **Build Integrity:** Fixed TypeScript errors in `server/storage.ts` (iterator handling) and `client/src/components/ui/dialog.tsx` (missing props), ensuring a clean `npx tsc --noEmit`.

### **B. Wallet & Transaction History**
*   **Real Data Integration:** Replaced mock transaction data on the Wallet page (`/wallet`) with real-time data fetched from the backend.
*   **Data Aggregation:** Implemented logic to merge and sort data from `/api/deposits` and `/api/withdrawals` to show a unified transaction history sorted by date.
*   **UI Polish:** Added status badges (Approved/Pending/Rejected) and localized text for transaction types.

### **C. Authentication UX**
*   **Password Visibility:** Added a "Show/Hide" eye icon toggle to password fields in both Login and Registration forms.
*   **Reusable Component:** Created a new `PasswordInput` component (`client/src/components/ui/password-input.tsx`) to encapsulate this logic for reusability and maintainability.

### **D. Deployment Status**
*   **Current State:** The codebase is fully updated, tested, and ready for deployment. All recent changes have been pushed to the `main` branch.

## 15. Updates (Jan 15, 2026) - Wallet Management & Security

### **A. User Wallet Management**
*   **Saved Wallets:** Users can now save a preferred **Nagad** or **bKash** wallet number in their Account Settings.
*   **Security Lock:** To prevent fraud, the saved wallet number can only be changed **once every 15 days**.
*   **Withdrawal Optimization:** The withdrawal page now **auto-fills** the saved wallet number and provider, displaying a "Verified" badge for a faster "Rapid Withdraw" experience.

### **B. Admin Controls**
*   **Account Freeze:** Admins can now **Freeze** and **Unfreeze** user accounts directly from the User Management panel. Frozen users cannot deposit or withdraw funds.
*   **Wallet Override:** Admins have the authority to manually **view and update** a user's saved wallet number, bypassing the 15-day lock if necessary (e.g., for correcting errors).

### **C. Schema Updates**
*   **Users Table:** Added `savedWalletNumber`, `savedWalletProvider`, `walletLastUpdatedAt`, and `isFrozen` columns.
*   **Activity Logs:** Added new log types: `wallet_update`, `admin_wallet_update`, `account_freeze`, `account_unfreeze`.

### **D. Action Required**
*   **Database Migration:** Run `npm run db:push` to apply the schema changes (adding new columns to the `users` table).
