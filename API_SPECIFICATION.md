# REST API Specification

This document defines the REST API contract for the **Student Expense Tracker** backend.

**Base URL**: `/api`  
**Data Format**: `application/json`  
**Authentication**: Bearer Token via `Authorization: Bearer <jwt_token>` header for protected endpoints.

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Authentication**: None (Public)
- **Description**: Registers a student account with hashed password, generates a 6-digit OTP, saves the OTP with a 5-minute expiration, and dispatches the OTP via email.

#### Request Body
```json
{
  "name": "Mohit Kumar",
  "email": "mohit@gmail.com",
  "password": "mypassword"
}
```

#### Successful Response (`201 Created` or `200 OK`)
```json
{
  "success": true,
  "message": "Registration initiated. A 6-digit OTP has been sent to your email.",
  "data": {
    "email": "mohit@gmail.com",
    "otpExpiresInSeconds": 300
  }
}
```

#### Error Responses
- `400 Bad Request`: Validation failure (empty field, invalid email format, password under 6 characters).
- `409 Conflict`: Email already exists.

```json
{
  "success": false,
  "message": "User with this email already exists.",
  "error": "CONFLICT"
}
```

---

### 1.2 Verify Registration OTP
- **Method**: `POST`
- **Path**: `/api/auth/verify-registration`
- **Authentication**: None (Public)
- **Description**: Validates the 6-digit code against the recorded OTP for the given email. Upon success, sets `emailVerified = true` on the user, deletes the OTP record, and enables login.

#### Request Body
```json
{
  "email": "mohit@gmail.com",
  "otp": "482913"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in.",
  "data": {
    "email": "mohit@gmail.com",
    "emailVerified": true
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid OTP or expired OTP.

```json
{
  "success": false,
  "message": "Invalid or expired OTP. Please request a new one.",
  "error": "BAD_REQUEST"
}
```

---

### 1.3 Resend Registration OTP
- **Method**: `POST`
- **Path**: `/api/auth/resend-otp`
- **Authentication**: None (Public)
- **Description**: Invalidates prior OTP, generates a fresh 6-digit OTP, updates expiry to 5 minutes from current time, and resends it to the student's email.

#### Request Body
```json
{
  "email": "mohit@gmail.com"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "A fresh OTP has been sent to your email.",
  "data": {
    "email": "mohit@gmail.com",
    "otpExpiresInSeconds": 300
  }
}
```

---

### 1.4 Initiate Login (Step 1)
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Authentication**: None (Public)
- **Description**: Authenticates credentials (Email + Password). Validates `emailVerified == true`, checks BCrypt password hash, generates a secure 6-digit login OTP with 5-minute TTL, sends it to the user's email, and returns OTP dispatch confirmation.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Credentials verified. A 6-digit login OTP has been sent to your email.",
  "data": {
    "email": "user@example.com",
    "otpExpiresInSeconds": 300,
    "devOtp": "123456",
    "requiresOtp": true
  }
}
```

#### Error Responses
- `401 Unauthorized`: Incorrect email or password.
- `403 Forbidden`: Email has not been verified yet via registration OTP.

```json
{
  "success": false,
  "message": "Email is not verified. Please verify your OTP first.",
  "error": "FORBIDDEN"
}
```

---

### 1.5 Verify Login OTP (Step 2 - JWT Issuance)
- **Method**: `POST`
- **Path**: `/api/auth/verify-login`
- **Authentication**: None (Public)
- **Description**: Validates the 6-digit login OTP. Upon success, deletes the OTP and returns the authenticated user payload with a signed JWT Bearer token.

#### Request Body
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": "674d89a4e3b7b250...",
      "name": "User Name",
      "email": "user@example.com",
      "monthlyBudget": 12000.0,
      "emailVerified": true
    }
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid or expired login OTP.

---

### 1.6 Resend Login OTP
- **Method**: `POST`
- **Path**: `/api/auth/resend-login-otp`
- **Authentication**: None (Public)
- **Description**: Generates a fresh 6-digit login OTP, resets expiry to 5 minutes, and resends it to the user's email.

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "A fresh login OTP has been sent to your email.",
  "data": {
    "email": "user@example.com",
    "otpExpiresInSeconds": 300,
    "devOtp": "654321",
    "requiresOtp": true
  }
}
```

---

## 2. Expenses Endpoints (Protected)

Header required: `Authorization: Bearer <jwt_token>`

### 2.1 Add Expense
- **Method**: `POST`
- **Path**: `/api/expenses`

#### Request Body
```json
{
  "amount": 450.0,
  "category": "Food",
  "description": "Dinner at hostel canteen",
  "date": "2026-10-02",
  "paymentMethod": "UPI"
}
```

#### Supported Categories:
`Food`, `Transport`, `Education`, `Shopping`, `Entertainment`, `Hostel`, `Bills`, `Health`, `Other`

#### Supported Payment Methods:
`UPI`, `Cash`, `Card`, `Net Banking`

#### Successful Response (`201 Created`)
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "id": "674d89fbe3b7b2501a34bc12",
    "userId": "674d89a4e3b7b250...",
    "amount": 450.0,
    "category": "Food",
    "description": "Dinner at hostel canteen",
    "date": "2026-10-02",
    "paymentMethod": "UPI",
    "createdAt": "2026-10-02T20:30:00Z"
  }
}
```

---

### 2.2 List Expenses
- **Method**: `GET`
- **Path**: `/api/expenses`
- **Optional Query Parameters**:
  - `category` (string, e.g. `Food`)
  - `search` (string, e.g. `Dinner`)
  - `startDate` (string, `YYYY-MM-DD`)
  - `endDate` (string, `YYYY-MM-DD`)

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": [
    {
      "id": "674d89fbe3b7b2501a34bc12",
      "amount": 450.0,
      "category": "Food",
      "description": "Dinner at hostel canteen",
      "date": "2026-10-02",
      "paymentMethod": "UPI",
      "createdAt": "2026-10-02T20:30:00Z"
    },
    {
      "id": "674d89fbe3b7b2501a34bc13",
      "amount": 80.0,
      "category": "Transport",
      "description": "Metro recharge",
      "date": "2026-10-02",
      "paymentMethod": "UPI",
      "createdAt": "2026-10-02T15:10:00Z"
    }
  ]
}
```

---

### 2.3 Get Single Expense
- **Method**: `GET`
- **Path**: `/api/expenses/{id}`

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "674d89fbe3b7b2501a34bc12",
    "amount": 450.0,
    "category": "Food",
    "description": "Dinner at hostel canteen",
    "date": "2026-10-02",
    "paymentMethod": "UPI",
    "createdAt": "2026-10-02T20:30:00Z"
  }
}
```

---

### 2.4 Update Expense
- **Method**: `PUT`
- **Path**: `/api/expenses/{id}`

#### Request Body
```json
{
  "amount": 500.0,
  "category": "Food",
  "description": "Special dinner with friends",
  "date": "2026-10-02",
  "paymentMethod": "UPI"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "id": "674d89fbe3b7b2501a34bc12",
    "amount": 500.0,
    "category": "Food",
    "description": "Special dinner with friends",
    "date": "2026-10-02",
    "paymentMethod": "UPI",
    "updatedAt": "2026-10-02T21:00:00Z"
  }
}
```

---

### 2.5 Delete Expense
- **Method**: `DELETE`
- **Path**: `/api/expenses/{id}`

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Expense deleted successfully",
  "data": {
    "id": "674d89fbe3b7b2501a34bc12"
  }
}
```

---

## 3. Dashboard Endpoint (Protected)

### 3.1 Get Dashboard Summary
- **Method**: `GET`
- **Path**: `/api/dashboard`
- **Authentication**: Bearer JWT

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "totalSpent": 8450.0,
    "monthlyBudget": 12000.0,
    "remainingBudget": 3550.0,
    "currency": "INR",
    "recentExpenses": [
      {
        "id": "674d89fbe3b7b2501a34bc12",
        "category": "Food",
        "description": "Dinner",
        "amount": 450.0,
        "date": "2026-10-02"
      },
      {
        "id": "674d89fbe3b7b2501a34bc13",
        "category": "Transport",
        "description": "Metro",
        "amount": 80.0,
        "date": "2026-10-02"
      },
      {
        "id": "674d89fbe3b7b2501a34bc14",
        "category": "Education",
        "description": "Books",
        "amount": 500.0,
        "date": "2026-10-01"
      },
      {
        "id": "674d89fbe3b7b2501a34bc15",
        "category": "Shopping",
        "description": "Clothes",
        "amount": 900.0,
        "date": "2026-09-30"
      }
    ]
  }
}
```

---

## 4. User Profile Endpoints (Protected)

### 4.1 Get Profile
- **Method**: `GET`
- **Path**: `/api/users/me`

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "674d89a4e3b7b250...",
    "name": "Mohit Kumar",
    "email": "mohit@gmail.com",
    "emailVerified": true,
    "monthlyBudget": 12000.0,
    "createdAt": "2026-10-02T10:00:00Z"
  }
}
```

### 4.2 Update Profile
- **Method**: `PUT`
- **Path**: `/api/users/me`

#### Request Body
```json
{
  "name": "Mohit Kumar",
  "monthlyBudget": 15000.0
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "name": "Mohit Kumar",
    "monthlyBudget": 15000.0
  }
}
```

---

## 5. System Health & Database Endpoint (Public)

### 5.1 Check MongoDB Connection & Health
- **Method**: `GET`
- **Path**: `/api/health`
- **Authentication**: None (Public)
- **Description**: Executes a live ping command against the configured MongoDB database and returns connectivity status.

#### Successful Response (`200 OK`)
```json
{
  "status": "UP",
  "database": "CONNECTED",
  "databaseName": "expense_tracker",
  "ping": 1.0,
  "timestamp": "2026-10-02T12:50:35.123Z"
}
```

#### Degraded Response (`503 Service Unavailable`)
```json
{
  "status": "DEGRADED",
  "database": "DISCONNECTED",
  "error": "Timed out after 30000 ms while waiting for a server that matches ReadPreferenceServerSelector",
  "timestamp": "2026-10-02T12:50:35.123Z"
}
```
