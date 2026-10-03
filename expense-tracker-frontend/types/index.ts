export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  monthlyBudget: number;
  createdAt?: string;
}

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Education"
  | "Shopping"
  | "Entertainment"
  | "Hostel"
  | "Bills"
  | "Health"
  | "Other";

export type PaymentMethod = "UPI" | "Cash" | "Card" | "Net Banking";

export interface Expense {
  id: string;
  userId?: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  createdAt?: string;
}

export interface DashboardData {
  totalSpent: number;
  monthlyBudget: number;
  remainingBudget: number;
  recentExpenses: Expense[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
