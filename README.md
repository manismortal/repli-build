# MAERSK.Line BD - Maritime Investment Platform

A full-stack investment platform web application designed for the Bangladesh market, featuring a responsive mobile-first UI, localized content (English/Bengali), and a comprehensive wallet system with multi-channel payment support.

## 🚀 Features

### 👤 User Features
*   **Authentication:** Secure Login/Registration with password hashing.
*   **Dashboard:** Personalized dashboard with dynamic avatars (Ship status).
*   **Wallet System:**
    *   **Deposits:** Support for **bKash**, **Nagad**, and **Binance** (USDT).
    *   **Withdrawals:** Secure withdrawal system with balance verification.
    *   **Bonus:** Welcome bonus system with 60-day lock period logic.
*   **Investments:** Purchase shipping packages to earn daily rewards.
*   **Tasks:** Complete daily video tasks to earn fiat rewards.
*   **Localization:** Full English and Bengali language support.

### 🛠 Admin Features
*   **Dashboard:** Real-time statistics on users, deposits, and withdrawals.
*   **Agent Management:**
    *   Add and manage agent numbers for bKash/Nagad.
    *   **Automated Rotation:** Agents rotate hourly to distribute load.
    *   **Banking Hours:** Enforced 9 AM - 5 PM schedule for fiat payments.
*   **Transaction Reports:** Download CSV logs for all payment methods.
*   **Content Management:** Manage packages, tasks, and site settings (popups, social links).

## 💻 Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, Shadcn UI, Lucide Icons.
*   **Backend:** Node.js, Express.js.
*   **Database:** PostgreSQL (with Drizzle ORM).
*   **Authentication:** Passport.js (Local Strategy), Express Session.
*   **State Management:** TanStack Query.

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/manismortal/MARITME-iNVESTMENT.git
    cd MARITME-iNVESTMENT
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory (copy from `.env.example` if available):
    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/maersk_db
    SESSION_SECRET=your_complex_secret_key
    NODE_ENV=development
    PORT=5000
    ```

4.  **Database Setup:**
    Ensure PostgreSQL is running and the database exists. Then push the schema:
    ```bash
    npm run db:push
    ```

5.  **Run the application:**
    *   **Development:** `npm run dev`
    *   **Production:** `npm run build` then `npm start`

## 📂 Project Structure

*   `client/`: React frontend application.
*   `server/`: Node.js/Express backend API.
*   `shared/`: Shared TypeScript types and Drizzle schema.
*   `client/public/`: Static assets and flat SVG logos.

## 📜 License

This project is licensed under the MIT License.
# MARITME-iNVESTMENT
# MARITME-iNVESTMENT
