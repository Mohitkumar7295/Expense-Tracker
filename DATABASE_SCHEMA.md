# MongoDB Database Schema Specification

This document details the MongoDB Atlas database structure, collection models, indexes, and queries for the **Student Expense Tracker** application.

**Database Name**: `expense_tracker`

---

## 1. Collection Architecture Overview

```text
expense_tracker
│
├── users                 # User profile, credentials, verification flag, budget
├── registration_otps     # Temporary 6-digit OTP codes with 300-second TTL
└── expenses              # Student expense transactions associated with a userId
```

---

## 2. Collection Schemas

### 2.1 `users` Collection

Stores account information, encrypted credentials, and budget preferences.

```json
{
  "_id": { "$oid": "674d89a4e3b7b2501a34bc10" },
  "name": "Mohit Kumar",
  "email": "mohit@gmail.com",
  "password": "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  "emailVerified": true,
  "monthlyBudget": 12000.0,
  "createdAt": { "$date": "2026-10-02T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-10-02T10:05:00.000Z" }
}
```

#### Field Specifications:

| Field | Type | Required | Unique | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Yes | MongoDB primary key (auto-generated) |
| `name` | String | Yes | No | Full name of the student |
| `email` | String | Yes | Yes | Unique lowercased email address used for login |
| `password` | String | Yes | No | BCrypt hashed password (never stored plain) |
| `emailVerified` | Boolean | Yes | No | `false` on initial register; `true` after OTP verification |
| `monthlyBudget` | Double / Number | No | No | Monthly target budget in INR (default: 10000.0) |
| `createdAt` | ISODate | Yes | No | Account creation timestamp |
| `updatedAt` | ISODate | Yes | No | Timestamp of the last profile update |

#### Indexes:
- `db.users.createIndex({ "email": 1 }, { "unique": true })`

---

### 2.2 `registration_otps` Collection

Stores temporary 6-digit verification codes generated during user sign-up.

```json
{
  "_id": { "$oid": "674d89c0e3b7b2501a34bc11" },
  "email": "user@example.com",
  "otp": "482913",
  "type": "REGISTRATION",
  "expiresAt": { "$date": "2026-10-02T10:20:00.000Z" },
  "createdAt": { "$date": "2026-10-02T10:15:00.000Z" }
}
```

#### Field Specifications:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Auto-generated primary key |
| `email` | String | Yes | Target student email |
| `otp` | String | Yes | Cryptographically secure 6-digit numeric string |
| `type` | String | Yes | Purpose of OTP: `"REGISTRATION"` or `"LOGIN"` |
| `expiresAt` | ISODate | Yes | Expiration timestamp (created time + 5 minutes) |
| `createdAt` | ISODate | Yes | Creation timestamp |

#### Indexes:
- `db.registration_otps.createIndex({ "email": 1 })`
- **TTL Index**: `db.registration_otps.createIndex({ "expiresAt": 1 }, { "expireAfterSeconds": 0 })`  
  *MongoDB will automatically purge any document whose `expiresAt` is in the past.*

---

### 2.3 `expenses` Collection

Stores individual expenses logged by students.

```json
{
  "_id": { "$oid": "674d89fbe3b7b2501a34bc12" },
  "userId": "674d89a4e3b7b2501a34bc10",
  "amount": 450.0,
  "category": "Food",
  "description": "Dinner at hostel canteen",
  "date": "2026-10-02",
  "paymentMethod": "UPI",
  "createdAt": { "$date": "2026-10-02T20:30:00.000Z" },
  "updatedAt": { "$date": "2026-10-02T20:30:00.000Z" }
}
```

#### Field Specifications:

| Field | Type | Required | Constraints / Allowed Values |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Auto-generated primary key |
| `userId` | String / ObjectId | Yes | Reference to `users._id` |
| `amount` | Double | Yes | Numeric positive value (min: 0.01) |
| `category` | String | Yes | `Food`, `Transport`, `Education`, `Shopping`, `Entertainment`, `Hostel`, `Bills`, `Health`, `Other` |
| `description` | String | Yes | Brief description of item or activity |
| `date` | String / LocalDate | Yes | Date of expense formatted as `YYYY-MM-DD` |
| `paymentMethod` | String | Yes | `UPI`, `Cash`, `Card`, `Net Banking` |
| `createdAt` | ISODate | Yes | Timestamp of insertion |
| `updatedAt` | ISODate | Yes | Timestamp of modification |

#### Indexes:
- `db.expenses.createIndex({ "userId": 1, "date": -1 })` (Compound index for dashboard and sorting)
- `db.expenses.createIndex({ "userId": 1, "category": 1 })` (For category filtering)

---

## 3. Key Aggregation Pipelines

### 3.1 Total Spending Calculation (Current Month)
Calculates sum of expenses for a specific user within the current month:

```javascript
[
  {
    $match: {
      userId: "674d89a4e3b7b2501a34bc10",
      date: { $gte: "2026-10-01", $lte: "2026-10-31" }
    }
  },
  {
    $group: {
      _id: null,
      totalSpent: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  }
]
```

### 3.2 Category-Wise Spending Breakdown
Used for analytics or category summaries:

```javascript
[
  {
    $match: {
      userId: "674d89a4e3b7b2501a34bc10"
    }
  },
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { total: -1 }
  }
]
```
