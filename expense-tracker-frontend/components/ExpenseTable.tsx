"use client";

import React, { useState } from "react";
import { Expense } from "@/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white">
        <p className="text-slate-500 text-sm">No expenses found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Date</th>
              <th className="px-6 py-3.5 font-semibold">Category</th>
              <th className="px-6 py-3.5 font-semibold">Description</th>
              <th className="px-6 py-3.5 font-semibold">Payment</th>
              <th className="px-6 py-3.5 font-semibold text-right">Amount</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {item.paymentMethod || "UPI"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 text-right">
                  ₹{item.amount.toLocaleString("en-IN")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right space-x-3 text-sm">
                  <button
                    onClick={() => onEdit(item)}
                    className="font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="font-medium text-red-600 hover:text-red-800 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal (Section 14) */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 text-center">
            <h4 className="text-lg font-bold text-slate-900">Delete Expense</h4>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this expense?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
