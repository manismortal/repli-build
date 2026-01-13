# Project Context & Handoff

**Project Name:** MAERSK.Line BD (Maritime Investment Platform)
**Status:** Production Ready / Deployment Ready
**Last Updated:** January 12, 2026

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