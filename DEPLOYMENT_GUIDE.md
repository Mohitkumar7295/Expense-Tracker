# Deployment Guide: Render (Docker) + Vercel + MongoDB Atlas

This guide provides end-to-end instructions for deploying the **Expense Tracker** application:
- **Backend**: Render (Spring Boot 21 in Docker container)
- **Frontend**: Vercel (Next.js 15 App Router)
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Local Testing**: Docker Compose (`docker compose up`)

---

## 1. Cloud Architecture Map

```text
               USER
                |
                v HTTPS
       +-----------------+
       |     Vercel      |  --> Next.js 15 Frontend
       |   (Frontend)    |      https://<app>.vercel.app
       +--------+--------+
                |
                | REST API Calls (HTTPS + Bearer JWT)
                v
       +-----------------+
       |     Render      |  --> Spring Boot 21 (Docker Container)
       | (Backend API)   |      https://<app>.onrender.com
       +--------+--------+
                |
                | MongoDB Wire Protocol (TLS / SRV)
                v
       +-----------------+
       |  MongoDB Atlas  |  --> Managed Cloud Database
       | (Database:      |
       |  expense_tracker|
       +-----------------+
```

---

## 2. Prerequisites & Setup

1. **GitHub Repository**:
   Make sure all code and newly generated Docker files are committed and pushed:
   ```bash
   git add .
   git commit -m "feat: add Docker and deployment configuration for Render and Vercel"
   git push origin main
   ```

2. **MongoDB Atlas Account**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Ensure an `M0` (Free) cluster is active.
   - Go to **Network Access** -> **Add IP Address** -> Choose **Allow Access From Anywhere** (`0.0.0.0/0`). *(Render instances use dynamic outbound IPs).*
   - Go to **Database Access** -> Ensure a database user exists with read/write permissions.
   - Copy your connection string from **Connect** -> **Drivers** (Java):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
     ```

---

## 3. Step 1: Deploy Backend to Render (Docker Web Service)

Render automatically builds and runs the container using [`expense-tracker-backend/Dockerfile`](file:///c:/Users/mokum/OneDrive/Desktop/ExpenseTracker/expense-tracker-backend/Dockerfile).

### Option A: Via Render Dashboard (Recommended)

1. Log in to [render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `ExpenseTracker` repository.
4. Configure the service:
   - **Name**: `expense-tracker-backend` (or your preferred name)
   - **Region**: Choose the closest region to you (e.g., Oregon, Ohio, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Root Directory**: `expense-tracker-backend`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile` *(relative to Root Directory)*
   - **Instance Type**: **Free**
5. Expand **Advanced Settings**:
   - **Health Check Path**: `/api/health`
6. Add the following **Environment Variables**:

| Key | Value / Example | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Internal server port (Render auto-routes web traffic) |
| `MONGODB_URI` | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority` | Atlas URI |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit secret key |
| `CORS_ALLOWED_ORIGINS` | `https://*.vercel.app,http://localhost:3000` | Allowed origins (update with exact Vercel URL once created) |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `MAIL_PORT` | `587` | SMTP TLS port |
| `MAIL_USERNAME` | `your-email@gmail.com` | Gmail for sending OTPs |
| `MAIL_PASSWORD` | `your-app-password` | Google 16-character App Password |

7. Click **Create Web Service**.
8. Render will build the Docker container and start your Spring Boot application.
9. Note your Render URL: `https://expense-tracker-backend-xxxx.onrender.com`.
10. Test health check in your browser or curl:
    ```bash
    curl https://expense-tracker-backend-xxxx.onrender.com/api/health
    ```
    Expected response:
    ```json
    {"database":"CONNECTED","databaseName":"expense_tracker","ping":1,"status":"UP"}
    ```

> [!NOTE]
> Render Free Tier services spin down after 15 minutes of inactivity. The first request after sleep may take ~30-50 seconds to respond while the container wakes up.

---

## 4. Step 2: Deploy Frontend to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `ExpenseTracker` GitHub repository.
4. Configure Project Settings:
   - **Framework Preset**: **Next.js** *(Auto-detected)*
   - **Root Directory**: Click **Edit** and select **`expense-tracker-frontend`**.
5. Under **Environment Variables**, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://expense-tracker-backend-xxxx.onrender.com` | Your live Render backend URL (no trailing slash) |

6. Click **Deploy**.
7. Vercel will build and assign your production domain: `https://your-frontend-name.vercel.app`.

---

## 5. Step 3: Link CORS between Vercel & Render

Once you have your production Vercel domain:
1. Go back to your **Render Dashboard** -> `expense-tracker-backend` -> **Environment**.
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://your-frontend-name.vercel.app,https://*.vercel.app,http://localhost:3000
   ```
3. Save changes. Render will automatically trigger a rolling restart with updated CORS permissions.

---

## 6. Local Testing with Docker Compose

If you have Docker Desktop installed, you can spin up MongoDB, Backend, and Frontend all together locally:

```bash
# Build and start all 3 containers
docker compose up --build

# Run in background
docker compose up -d

# Stop all containers
docker compose down
```

Services exposed:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MongoDB**: `mongodb://localhost:27017/expense_tracker`

---

## 7. Troubleshooting & Verification Checklist

- [ ] **MongoDB Atlas IP Access**: Is `0.0.0.0/0` whitelisted under Atlas Network Access?
- [ ] **CORS Configuration**: Does `CORS_ALLOWED_ORIGINS` in Render match your Vercel deployment URL?
- [ ] **Trailing Slashes**: Ensure `NEXT_PUBLIC_API_URL` on Vercel does **NOT** end with `/` (e.g. `https://app.onrender.com`, not `https://app.onrender.com/`).
- [ ] **Health Endpoint**: Does `https://<render-url>/api/health` return `{"status":"UP"}`?
- [ ] **Render Sleep**: If the frontend hangs on initial load, remember that Render Free Tier spins down after 15 mins of inactivity. The first API ping will wake it up.
