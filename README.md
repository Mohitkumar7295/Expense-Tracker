# Student Expense Tracker 🎓💸

[![Live Demo on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://expense-tracker-xi-lake.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen?style=for-the-badge&logo=springboot)](https://github.com/Mohitkumar7295/Expense-Tracker)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)

A modern, fast, and secure full-stack web application tailored for college and university students to effortlessly monitor, categorize, and control their daily expenses against a monthly budget.

🌐 **Live Web App**: [https://expense-tracker-xi-lake.vercel.app/](https://expense-tracker-xi-lake.vercel.app/)

Built with **Next.js (React + TypeScript + Tailwind CSS)** on the frontend and **Java Spring Boot 3 + Spring Security + MongoDB Atlas** on the backend.

---

## 🚀 Key Highlights & Philosophy

- **Registration with OTP Verification**: Ensures valid student emails by dispatching a 6-digit verification code with a 5-minute expiry.
- **Secure 2-Step Login with OTP**: Authenticates credentials and dispatches a fresh 6-digit login OTP code to user's email before issuing a session JWT.
- **Stateless JWT Security**: Industry-standard cryptographic token security with BCrypt password hashing.
- **Student-Centric Dashboard**: Real-time spending overview, monthly budget tracking, remaining balance calculation, and recent activity log.
- **Intuitive Expense Management**: Categorize expenses (Food, Transport, Education, Shopping, Entertainment, Hostel, Bills, Health, Other) with payment method tags (UPI, Cash, Card, Net Banking).
- **Zero Complexity MVP**: Clean, performant, mobile-responsive interface without unnecessary bloat.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | [Next.js (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), Axios |
| **Backend** | [Java 21/23](https://www.oracle.com/java/), [Spring Boot 3+](https://spring.io/projects/spring-boot), [Spring Security](https://spring.io/projects/spring-security), [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb), [JJWT](https://github.com/jwtk/jjwt), [Maven](https://maven.apache.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (Managed NoSQL Cloud Database) |
| **Email Service** | Spring Mail with SMTP (Gmail / SendGrid / Amazon SES) |
| **Deployment** | Frontend on **Vercel** ([Live App](https://expense-tracker-xi-lake.vercel.app/)), Backend on **Render** (Docker), Database on **MongoDB Atlas** |

---

## 📂 Repository Structure

```text
ExpenseTracker/
├── README.md                      # Project documentation and developer quick start
├── ARCHITECTURE.md               # Complete project tree map, diagrams, and design decisions
├── API_SPECIFICATION.md          # REST API documentation with sample request/responses
├── DATABASE_SCHEMA.md            # MongoDB collection structure, indexes, and queries
├── DEPLOYMENT_GUIDE.md           # Step-by-step production deployment guide
│
├── expense-tracker-backend/      # Spring Boot REST API
│   ├── src/main/java/com/expensetracker/backend/
│   │   ├── config/               # CORS, MongoDB, and Mail configuration
│   │   ├── controller/           # Auth, Expense, Dashboard, User endpoints
│   │   ├── dto/                  # Request/Response payloads
│   │   ├── exception/            # Global exception handling
│   │   ├── model/                # MongoDB entities (User, RegistrationOtp, Expense)
│   │   ├── repository/           # Spring Data MongoDB repositories
│   │   ├── security/             # JWT filter, SecurityConfig, UserDetailsService
│   │   └── service/              # Core business services
│   ├── src/main/resources/       # application.properties
│   └── pom.xml                   # Maven dependencies and build setup
│
└── expense-tracker-frontend/     # Next.js App Router Client
    ├── app/                      # Pages: landing, login, register, verify-otp, dashboard, expenses, profile
    ├── components/               # UI components: Navbar, SummaryCard, ExpenseForm, ExpenseTable
    ├── lib/                      # Axios API client, authentication helpers, utilities
    ├── types/                    # TypeScript interfaces
    ├── package.json              # NPM dependencies
    └── tailwind.config.ts        # Tailwind configuration
```

For the comprehensive tree map and complete file breakdown, refer to [ARCHITECTURE.md](file:///c:/Users/mokum/OneDrive/Desktop/ExpenseTracker/ARCHITECTURE.md).

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Java JDK 21+** (Verified with Java 23)
- **Apache Maven 3.9+**
- **Node.js 18+** (Verified with Node.js v24)
- **MongoDB Atlas Account** (Free tier cluster)

---

### 2. Backend Setup (`expense-tracker-backend`)

1. **Navigate to the backend directory**:
   ```powershell
   cd expense-tracker-backend
   ```

2. **Configure environment variables or `application.properties`**:
   Update `src/main/resources/application.properties`:
   ```properties
   spring.application.name=backend
   server.port=8080

   # MongoDB Atlas Connection
   spring.data.mongodb.uri=${MONGODB_URI:mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense_tracker?retryWrites=true&w=majority}

   # JWT Secret Key (HMAC-SHA256 compliant, min 256 bits)
   jwt.secret=${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
   jwt.expiration=86400000

   # Mail Configuration (Gmail App Password)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
   spring.mail.password=${MAIL_PASSWORD:your-gmail-app-password}
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```

3. **Build and Run the Backend**:
   ```powershell
   mvn spring-boot:run
   ```
   The backend API will start at: `http://localhost:8080`

---

### 3. Frontend Setup (`expense-tracker-frontend`)

1. **Navigate to the frontend directory**:
   ```powershell
   cd expense-tracker-frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in `expense-tracker-frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start the Development Server**:
   ```powershell
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Application User Flow

```text
LANDING PAGE (Hero, Feature Highlights)
    │
    ├──> REGISTER PAGE (Name, Email, Password, Confirm Password)
    │       │
    │       ▼
    │    VERIFY REGISTRATION OTP (6 digits sent to email, 5-minute expiry)
    │       │
    │       ▼
    │    Email Verified (emailVerified = true)
    │       │
    └───> LOGIN PAGE (Email + Password)
            │
            ▼
         VERIFY LOGIN OTP (6-digit OTP code sent to email)
            │
            ▼
         DASHBOARD (JWT Authentication)
            │
            ├── Summary Cards: Total Spent | Monthly Budget | Remaining Balance
            ├── Recent Expenses (Top 5 transactions)
            ├── Add Expense Modal (Amount, Category, Description, Date, Payment Method)
            ├── My Expenses Page (Search, Category Filters, Edit & Delete Modal)
            ├── Profile Page (User details, Email status, Budget settings)
            └── Logout (Destroys local JWT session)
```

---

## 📡 REST API Summary

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new student & send OTP | ❌ |
| **Auth** | `POST` | `/api/auth/verify-registration` | Verify registration 6-digit OTP code | ❌ |
| **Auth** | `POST` | `/api/auth/resend-otp` | Re-generate and resend registration OTP | ❌ |
| **Auth** | `POST` | `/api/auth/login` | Verify credentials & send login OTP | ❌ |
| **Auth** | `POST` | `/api/auth/verify-login` | Verify login OTP & issue session JWT token | ❌ |
| **Auth** | `POST` | `/api/auth/resend-login-otp` | Re-generate and resend login OTP | ❌ |
| **Expenses** | `POST` | `/api/expenses` | Create a new expense entry | ✅ Bearer JWT |
| **Expenses** | `GET` | `/api/expenses` | List all user expenses (with query filters) | ✅ Bearer JWT |
| **Expenses** | `GET` | `/api/expenses/{id}` | Get single expense details | ✅ Bearer JWT |
| **Expenses** | `PUT` | `/api/expenses/{id}` | Update existing expense | ✅ Bearer JWT |
| **Expenses** | `DELETE`| `/api/expenses/{id}` | Delete an expense entry | ✅ Bearer JWT |
| **Dashboard**| `GET` | `/api/dashboard` | Aggregated spent, budget, remaining, recent 5 | ✅ Bearer JWT |
| **Profile** | `GET` | `/api/users/me` | Fetch authenticated user profile | ✅ Bearer JWT |
| **Profile** | `PUT` | `/api/users/me` | Update name and monthly budget | ✅ Bearer JWT |

For full request/response schemas, see [API_SPECIFICATION.md](file:///c:/Users/mokum/OneDrive/Desktop/ExpenseTracker/API_SPECIFICATION.md).

---

## 📅 Phased Development Roadmap

- [x] **Phase 0 — Project Setup & Architecture**: Clean folder layout, detailed architectural documentation, specifications, and data design.
- [ ] **Phase 1 — Database & Models**: MongoDB Atlas cluster configuration, Spring Data entities (`User`, `RegistrationOtp`, `Expense`), and indexing.
- [ ] **Phase 2 — Authentication Engine**: BCrypt hashing, JavaMailSender 6-digit OTP, verification TTL, JWT generation, and Spring Security filters.
- [ ] **Phase 3 — Expense Operations**: Full CRUD services for expenses, category validations, and user data isolation.
- [ ] **Phase 4 — Dashboard & Analytics**: Aggregation queries for monthly spending totals, remaining balance calculation, and recent transactions.
- [ ] **Phase 5 — Modern Frontend UI**: Next.js App Router views, responsive Tailwind design, interactive forms, toast notifications, and client routing guards.
- [ ] **Phase 6 — Production Deployment**: Deploy Spring Boot on Railway, Next.js on Vercel, secure environment variables, and live integration testing.

---

## 🔒 Security Best Practices

1. **Passwords**: Never stored in plain text; hashed using BCrypt with salt strength 10.
2. **OTP Security**: Expirations enforced at 300 seconds; purged automatically upon verification.
3. **JWT Expiry**: Set to 24 hours to limit token exposure window.
4. **Environment Variables**: Sensitive values (`MONGODB_URI`, `JWT_SECRET`, `MAIL_PASSWORD`) are kept out of source control.
