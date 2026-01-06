# Project Context & Handoff

**Project Name:** MAERSK.Line BD (Maritime Investment Platform)
**Status:** Production Ready / Deployment Ready
**Last Updated:** January 6, 2026

## 1. Project Overview
This is a full-stack investment platform web application designed for mobile users (responsive UI). It allows users to register, purchase shipping packages, complete daily video tasks for rewards, and manage a wallet with simulated bKash deposits/withdrawals.

## 2. Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Shadcn UI, Framer Motion, Recharts.
*   **Backend:** Node.js (Express), Passport.js (Auth).
*   **Database:** PostgreSQL (with Drizzle ORM).
*   **Language:** TypeScript.

## 3. Key Features Implemented
*   **Authentication:** Login/Register with password hashing.
*   **Multilingual:** Full English/Bengali support (defaulting to Bengali).
*   **Wallet System:**
    *   **Multi-Channel Deposits:** bKash, Nagad, and Binance (USDT TRC20).
    *   **Agent Management:** Automated hourly rotation of agent numbers for security and load balancing.
    *   **Banking Hours:** Enforced 9 AM - 5 PM schedule for fiat (bKash/Nagad); 24/7 for Binance.
    *   **Data Collection:** Captures sender phone numbers and wallet addresses for verification.
    *   **Withdrawals:** Minimum 500 BDT. Requires setting a personal bKash number.
    *   **Bonus Logic:** 250 BDT Welcome Bonus locked for 60 days. Early withdrawal forfeits bonus.
*   **Admin Panel:** 
    *   **Dashboard:** Manage users, approve/reject deposits & withdrawals.
    *   **Agent Control:** Add, toggle, and manage agent numbers/wallets.
    *   **Reports:** Download CSV logs for all transaction types (bKash, Nagad, Binance).
    *   **Settings:** Update site settings (social links, popup).
*   **UI/UX:** 
    *   **Responsive Pagination:** Integrated into all admin tables.
    *   **Visual Assets:** High-quality SVG logos for payment methods.
    *   **Dashboard:** Dynamic user avatar (Ship = Paid, Sad Emoji = Free), Notification Popup.
*   **Support:** Telegram & WhatsApp links controlled via backend.

## 4. Folder Structure
*   `client/`: React frontend.
*   `server/`: Express API and storage logic.
*   `shared/`: Database schema (`schema.ts`) and types.
*   `attached_assets/`: Static assets (images).

## 5. Deployment Info
*   **Docker:** `Dockerfile` included.
*   **Environment:** Requires `DATABASE_URL` (Postgres) and `SESSION_SECRET`.
*   **Repo:** `https://github.com/manismortal/MARITME-iNVESTMENT`

## 6. How to Resume Work
1.  **Clone:** `git clone https://github.com/manismortal/MARITME-iNVESTMENT.git`
2.  **Install:** `npm install`
3.  **Run:** `npm run dev` (Development) or `npm start` (Production).
4.  **Admin:** First registered user is Admin.

## 7. Recent Changes (Jan 6, 2026)
*   **New Payment Pages:** Created `payment-methods`, `nagad-payment`, and `binance-payment` pages.
*   **Agent Logic:** Implemented `agentService` for hourly rotation and banking hour enforcement.
*   **Database:** Added `agent_numbers` table and updated `deposits` schema.
*   **Admin Features:** Added Agent Management (`/admin/agents`) and Reports (`/admin/reports`).
*   **Security:** Removed hardcoded PII from frontend; implemented dynamic fetching.
*   **Fixes:** Resolved `vite` build issues, added missing `serveStatic`, and fixed favicon/logo imports.
*   **UI Polish:** Added flat SVG logos for payment providers and responsive pagination.

## 8. Future AI Development & Recommendations
*   **Crypto Verification:** Implement a background service to verify Binance (TRC20) transactions on-chain using an external API (e.g., TronGrid) to match the Hash and Amount automatically.
*   **SMS Integration:** Replace mocked OTP/verification with a real SMS gateway for bKash/Nagad transactions.
*   **Email Notifications:** Add email alerts for admin on new deposits and users on approval.
*   **Unit Testing:** Add tests for `agentService` rotation logic and banking hour calculations.
*   **CI/CD:** Set up GitHub Actions for automated testing and deployment.