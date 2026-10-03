"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseForm from "@/components/ExpenseForm";
import api from "@/lib/api";
import { Expense, ExpenseCategory } from "@/types";

const CATEGORIES = [
  "All",
  "Food",
  "Transport",
  "Education",
  "Shopping",
  "Entertainment",
  "Hostel",
  "Bills",
  "Health",
  "Other",
];

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      if (res.data.success && res.data.data) {
        setExpenses(res.data.data);
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
    fetchExpenses();
  }, [router]);

  useEffect(() => {
    let result = expenses;
    if (selectedCategory !== "All") {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    setFilteredExpenses(result);
  }, [expenses, search, selectedCategory]);

  const handleCreateOrUpdate = async (data: Omit<Expense, "id">) => {
    if (editingExpense) {
      await api.put(`/expenses/${editingExpense.id}`, data);
    } else {
      await api.post("/expenses", data);
    }
    await fetchExpenses();
    setEditingExpense(null);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/expenses/${id}`);
    await fetchExpenses();
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Expenses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and organize your logged transactions
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          + Add Expense
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          Loading expenses...
        </div>
      ) : (
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* Modal Form */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingExpense}
      />
    </div>
  );
}
