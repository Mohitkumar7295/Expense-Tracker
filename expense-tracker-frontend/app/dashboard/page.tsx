"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SummaryCard from "@/components/SummaryCard";
import ExpenseForm from "@/components/ExpenseForm";
import api from "@/lib/api";
import { Expense, ExpenseCategory } from "@/types";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Plus,
  Pencil,
  ArrowRight,
  Utensils,
  Bus,
  BookOpen,
  ShoppingBag,
  Film,
  Home as HomeIcon,
  Zap,
  HeartPulse,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Student");
  const [spent, setSpent] = useState<number>(0);
  const [budget, setBudget] = useState<number>(12000);
  const [remaining, setRemaining] = useState<number>(12000);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState<string>("12000");
  const [loading, setLoading] = useState(true);
  const [savingBudget, setSavingBudget] = useState(false);
  const [budgetError, setBudgetError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const [dashRes, expRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/expenses").catch(() => ({ data: { success: false, data: [] } })),
      ]);

      if (dashRes.data.success && dashRes.data.data) {
        const data = dashRes.data.data;
        setSpent(data.totalSpent || 0);
        setBudget(data.monthlyBudget || 12000);
        setRemaining(
          data.remainingBudget ?? (data.monthlyBudget - data.totalSpent)
        );
        setRecentExpenses(data.recentExpenses || []);
        setNewBudgetValue((data.monthlyBudget || 12000).toString());
      }

      if (expRes.data?.success && expRes.data?.data) {
        setAllExpenses(expRes.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserName(u.name || "Student");
      } catch (e) {
        setUserName("Student");
      }
    }

    fetchDashboardData();
  }, [router]);

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    await api.post("/expenses", newExpense);
    await fetchDashboardData();
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBudgetValue);
    if (isNaN(val) || val < 0) {
      setBudgetError("Please enter a valid non-negative budget amount.");
      return;
    }

    setSavingBudget(true);
    setBudgetError("");
    try {
      // Send both name and monthlyBudget for maximum backend compatibility
      await api.put("/users/me", { 
        name: userName || "Student",
        monthlyBudget: val 
      });

      setBudget(val);
      setRemaining(val - spent);
      setIsBudgetModalOpen(false);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          u.monthlyBudget = val;
          localStorage.setItem("user", JSON.stringify(u));
        } catch (ignored) {}
      }

      // Re-fetch dashboard data to synchronize all server calculations
      await fetchDashboardData();
    } catch (err: any) {
      setBudgetError(err.response?.data?.message || "Failed to save budget. Please try again.");
    } finally {
      setSavingBudget(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate days remaining in current month
  const daysRemainingInMonth = useMemo(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.max(1, lastDay - now.getDate() + 1);
  }, []);

  const safeDailyBudget = useMemo(() => {
    if (remaining <= 0) return 0;
    return Math.floor(remaining / daysRemainingInMonth);
  }, [remaining, daysRemainingInMonth]);

  const spentPercentage = useMemo(() => {
    if (!budget || budget <= 0) return 0;
    return (spent / budget) * 100;
  }, [spent, budget]);

  // Category breakdown calculations
  const categoryBreakdown = useMemo(() => {
    const source = allExpenses.length > 0 ? allExpenses : recentExpenses;
    if (source.length === 0) return [];

    const map: Record<string, number> = {};
    let total = 0;
    source.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + item.amount;
      total += item.amount;
    });

    return Object.entries(map)
      .map(([cat, amt]) => ({
        category: cat as ExpenseCategory,
        amount: amt,
        percentage: total > 0 ? (amt / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [allExpenses, recentExpenses]);

  // Category icon mapping
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case "Food":
        return { icon: Utensils, bg: "bg-amber-50 text-amber-600 ring-amber-100" };
      case "Transport":
        return { icon: Bus, bg: "bg-blue-50 text-blue-600 ring-blue-100" };
      case "Education":
        return { icon: BookOpen, bg: "bg-purple-50 text-purple-600 ring-purple-100" };
      case "Shopping":
        return { icon: ShoppingBag, bg: "bg-pink-50 text-pink-600 ring-pink-100" };
      case "Entertainment":
        return { icon: Film, bg: "bg-indigo-50 text-indigo-600 ring-indigo-100" };
      case "Hostel":
        return { icon: HomeIcon, bg: "bg-emerald-50 text-emerald-600 ring-emerald-100" };
      case "Bills":
        return { icon: Zap, bg: "bg-yellow-50 text-yellow-600 ring-yellow-100" };
      case "Health":
        return { icon: HeartPulse, bg: "bg-rose-50 text-rose-600 ring-rose-100" };
      default:
        return { icon: Layers, bg: "bg-slate-50 text-slate-600 ring-slate-100" };
    }
  };

  const formattedCurrentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{formattedCurrentDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {getGreeting()}, <span className="text-blue-600">{userName}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's your real-time student expense & budget snapshot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
          >
            <Pencil className="w-4 h-4 text-slate-400" />
            <span>Set Budget</span>
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Spent This Month"
          amount={spent}
          variant="spent"
          icon={TrendingUp}
          percentage={spentPercentage}
          badgeText={`${Math.round(spentPercentage)}% of budget`}
          subtitle={`₹${(budget - spent > 0 ? budget - spent : 0).toLocaleString("en-IN")} buffer left`}
        />

        <SummaryCard
          title="Monthly Budget"
          amount={budget}
          variant="budget"
          icon={Wallet}
          badgeText="Student Limit"
          subtitle={`${daysRemainingInMonth} days remaining in this month`}
          onAction={() => {
            setNewBudgetValue(budget.toString());
            setBudgetError("");
            setIsBudgetModalOpen(true);
          }}
          actionLabel="Change"
        />

        <SummaryCard
          title="Remaining Balance"
          amount={remaining}
          variant="remaining"
          icon={PiggyBank}
          badgeText={remaining >= 0 ? "On Track" : "Over Budget"}
          subtitle={
            remaining >= 0
              ? `Safe daily spend: ~₹${safeDailyBudget} / day`
              : "Exceeded target limit"
          }
        />
      </div>

      {/* Budget Health Insight Banner */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border flex items-center justify-between gap-4 transition-all ${
          spentPercentage >= 90
            ? "bg-rose-50 border-rose-200 text-rose-800"
            : spentPercentage >= 70
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}
      >
        <div className="flex items-center gap-3">
          {spentPercentage >= 90 ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <div className="text-sm">
            <span className="font-bold">
              {spentPercentage >= 90
                ? "Budget Alert: "
                : spentPercentage >= 70
                ? "Caution: "
                : "Budget Status: "}
            </span>
            {spentPercentage >= 90
              ? `You've used ${Math.round(spentPercentage)}% of your monthly budget. Watch out for discretionary spends!`
              : spentPercentage >= 70
              ? `You've reached ${Math.round(spentPercentage)}% of your limit with ${daysRemainingInMonth} days to go.`
              : `You are in great shape! Safe spending pace is approximately ₹${safeDailyBudget} per day.`}
          </div>
        </div>

        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="text-xs font-bold underline hover:opacity-80 shrink-0 whitespace-nowrap"
        >
          Adjust Budget
        </button>
      </div>

      {/* Two Column Layout: Recent Expenses + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Expenses List (2 Columns wide on desktop) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Expenses</h2>
              <p className="text-xs text-slate-500">Latest transactions from this month</p>
            </div>
            <Link
              href="/expenses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Loading transactions...
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No expenses recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Start tracking your daily college expenses by clicking the Add Expense button.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Log First Expense
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentExpenses.slice(0, 5).map((exp) => {
                const details = getCategoryDetails(exp.category);
                const IconComponent = details.icon;
                return (
                  <div
                    key={exp.id}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${details.bg} ring-1 flex items-center justify-center shrink-0`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {exp.description}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{exp.category}</span>
                          <span>•</span>
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {exp.paymentMethod || "UPI"}
                          </span>
                          <span>•</span>
                          <span>{exp.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900">
                        -₹{exp.amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Category Spending Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 pb-1">Top Categories</h2>
            <p className="text-xs text-slate-500 mb-6">Where your money is going</p>

            {categoryBreakdown.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Log expenses to see category distribution.
              </div>
            ) : (
              <div className="space-y-4">
                {categoryBreakdown.map((item) => {
                  const details = getCategoryDetails(item.category);
                  const CatIcon = details.icon;
                  return (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <CatIcon className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-slate-800">{item.category}</span>
                        </div>
                        <span className="text-slate-900">
                          ₹{item.amount.toLocaleString("en-IN")}{" "}
                          <span className="text-slate-400 font-normal">
                            ({Math.round(item.percentage)}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Tip Box for Students */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Student Tip</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track small daily costs like tea, photocopying, and metro rides. They often account for over 35% of a student's total monthly spending!
            </p>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
      />

      {/* Edit Monthly Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Set Monthly Budget</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your monthly student allowance or spending limit.
            </p>

            {budgetError && (
              <div className="mb-4 rounded-xl bg-red-50 p-2.5 text-xs text-red-600 border border-red-200">
                {budgetError}
              </div>
            )}

            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  step="100"
                  required
                  value={newBudgetValue}
                  onChange={(e) => setNewBudgetValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBudget}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {savingBudget ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
