# Deployment Guide

## Deployment Readiness Checklist

- [x] **Database Persistence:** Application is configured to use PostgreSQL.
- [x] **Environment Variables:** `DATABASE_URL` and `SESSION_SECRET` are handled.
- [x] **Build Script:** `npm run build` is tested and working.
- [x] **Docker:** `Dockerfile` is created for containerized deployment.
- [x] **Security:** Admin routes are protected. Password hashing is in place.

## Prerequisites

You need a PostgreSQL database. You can use services like:
- **Neon** (Serverless Postgres)
- **Supabase**
- **Railway** (comes with DB)
- **Render** (comes with DB)
- **Self-Hosted PostgreSQL** (on the same VPS)

## Environment Variables

Set these variables in your hosting provider or `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string for your PostgreSQL DB | `postgres://user:pass@host:5432/dbname` |
| `SESSION_SECRET` | Secret key for session encryption | `complex_random_string_here` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Port to run on (default 5000) | `5000` |

---

## Hosting Instructions

### Option 1: Railway (Recommended for Ease)
1.  Push this code to a GitHub repository.
2.  Log in to [Railway.app](https://railway.app).
3.  Click "New Project" -> "Deploy from GitHub repo".
4.  Select your repository.
5.  Railway will detect the `Dockerfile` or `package.json`.
6.  Go to the "Variables" tab and add `DATABASE_URL` and `SESSION_SECRET`.
    *   *Tip:* You can add a PostgreSQL database plugin in Railway and it will automatically set `DATABASE_URL`.
7.  Railway will build and deploy automatically.

### Option 2: Render
1.  Push code to GitHub.
2.  Log in to [Render.com](https://render.com).
3.  Click "New" -> "Web Service".
4.  Connect your repo.
5.  Select "Docker" as the Runtime.
6.  Add Environment Variables (`DATABASE_URL`, `SESSION_SECRET`).
7.  Click "Create Web Service".

### Option 3: Traditional VPS (Ubuntu/Debian) - "Bare Metal"
*Best for full control and lower cost.*

**1. Prepare the Server**
Install Node.js (v20+), Nginx, and PostgreSQL.
```bash
# Update and install basics
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx postgresql postgresql-contrib

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

**2. Setup Database**
```bash
sudo -u postgres psql
# In the SQL shell:
CREATE DATABASE maersk_db;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE maersk_db TO myuser;
\q
```
*Your DATABASE_URL will be:* `postgres://myuser:mypassword@localhost:5432/maersk_db`

**3. Setup App**
```bash
# Clone your repo (or copy files via SCP/FTP) to /var/www/maersk
git clone <your-repo-url> /var/www/maersk
cd /var/www/maersk

# Install and Build
npm install
npm run build

# Setup Environment
echo "DATABASE_URL=postgres://myuser:mypassword@localhost:5432/maersk_db" > .env
echo "SESSION_SECRET=supersecretkey" >> .env
echo "NODE_ENV=production" >> .env
echo "PORT=5000" >> .env
```

**4. Start Application with PM2**
```bash
pm2 start npm --name "maersk-app" -- start
pm2 save
pm2 startup
```

**5. Configure Nginx (Reverse Proxy)**
Edit `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name yourdomain.com; # or your IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Restart Nginx: `sudo systemctl restart nginx`

### Option 4: Docker (Anywhere)
1.  Build the image:
    ```bash
    docker build -t maersk-app .
    ```
2.  Run the container:
    ```bash
    docker run -d -p 80:5000 \
      -e DATABASE_URL="postgres://..." \
      -e SESSION_SECRET="secret" \
      maersk-app
    ```

---

## Post-Deployment Checklist
1.  **Visit your live URL.**
2.  **Register a new account.** (The first registered user is automatically the Admin).
3.  **Check Logs:** If using PM2, run `pm2 logs`. If using Docker, `docker logs <container-id>`.
4.  **Secure your Domain:** Use Certbot for HTTPS (SSL):
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```