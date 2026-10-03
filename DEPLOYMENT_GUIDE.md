# Deployment Guide: Railway + Vercel + MongoDB Atlas

This guide walks through deploying the **Student Expense Tracker** to production:
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Backend**: Railway (Spring Boot 3 + Java 21)
- **Frontend**: Vercel (Next.js App Router)

---

## 1. Cloud Architecture Map

```text
               USER
                |
                v HTTPS
       +-----------------+
       |     Vercel      |
       |    (Next.js)    |
       +--------+--------+
                |
                | REST API Calls (HTTPS + Bearer JWT)
                v
       +-----------------+
       |     Railway     |
       |  (Spring Boot)  |
       +--------+--------+
                |
                | MongoDB Connection (TLS / SRV)
                v
       +-----------------+
       |  MongoDB Atlas  |
       | (Database:      |
       |  expense_tracker|
       +-----------------+
```

---

## 2. Step 1: MongoDB Atlas Setup

1. **Create Free Tier Cluster**:
   - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - Create a free `M0 Sandbox` cluster in your nearest region.

2. **Create Database User**:
   - Navigate to **Security** -> **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Username: `expense_user`
   - Password: Choose a strong password and save it safely.
   - User Privileges: `Read and write to any database`.

3. **Configure Network Access**:
   - Navigate to **Security** -> **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so that Railway's dynamic container IPs can connect to Atlas.

4. **Obtain Connection String**:
   - Click **Connect** -> **Drivers** (Java).
   - Copy connection URI string:
     ```
     mongodb+srv://expense_user:<password>@cluster0.mongodb.net/expense_tracker?retryWrites=true&w=majority
     ```

---

## 3. Step 2: Backend Deployment on Railway

1. **Push to GitHub**:
   Ensure your backend code is committed to a GitHub repository.

2. **Create New Project in Railway**:
   - Log in at [railway.app](https://railway.app).
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select your `ExpenseTracker` repository and set the **Root Directory** to `/expense-tracker-backend`.

3. **Configure Environment Variables in Railway**:
   Under project **Variables**, add:

   | Variable Key | Example Value | Description |
   | :--- | :--- | :--- |
   | `PORT` | `8080` | Server listening port |
   | `MONGODB_URI` | `mongodb+srv://expense_user:pass@...` | MongoDB Atlas URI |
   | `JWT_SECRET` | `5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437` | Secure 256-bit hex/base64 secret |
   | `MAIL_USERNAME` | `yourapp@gmail.com` | Email used to send OTPs |
   | `MAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | 16-character Google App Password |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` | Vercel domain for CORS |

4. **Generate Public Domain**:
   - Under **Settings** -> **Networking**, click **Generate Domain**.
   - Example: `https://expense-tracker-backend.up.railway.app`

---

## 4. Step 3: Frontend Deployment on Vercel

1. **Import Project to Vercel**:
   - Log in at [vercel.com](https://vercel.com).
   - Click **Add New** -> **Project**.
   - Select your GitHub repository.
   - Set **Root Directory** to `expense-tracker-frontend`.

2. **Configure Environment Variables in Vercel**:
   Under **Environment Variables**, add:

   | Variable Key | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://expense-tracker-backend.up.railway.app` | Railway backend public URL |

3. **Deploy**:
   - Click **Deploy**.
   - Vercel will build and assign your domain: `https://your-app.vercel.app`.

---

## 5. Security & Verification Checklist

- [ ] `0.0.0.0/0` IP whitelist allowed in MongoDB Atlas.
- [ ] Railway backend URL added to CORS allowed origins in Spring Boot.
- [ ] Vercel `NEXT_PUBLIC_API_URL` points to Railway with `https://`.
- [ ] Google 2-Step Verification and App Password generated for SMTP.
- [ ] No plaintext passwords or JWT secrets checked into Git.
