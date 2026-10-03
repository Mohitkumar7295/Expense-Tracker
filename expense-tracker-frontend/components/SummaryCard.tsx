import React from "react";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  icon: LucideIcon;
  variant: "spent" | "budget" | "remaining";
  percentage?: number;
  badgeText?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export default function SummaryCard({
  title,
  amount,
  subtitle,
  icon: Icon,
  variant,
  percentage,
  badgeText,
  onAction,
  actionLabel,
}: SummaryCardProps) {
  const styles = {
    spent: {
      cardBg: "bg-white",
      borderColor: "border-slate-200/90",
      iconBg: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
      amountColor: "text-slate-900",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      progressBg: "bg-rose-500",
    },
    budget: {
      cardBg: "bg-white",
      borderColor: "border-slate-200/90",
      iconBg: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
      amountColor: "text-slate-900",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      progressBg: "bg-blue-500",
    },
    remaining: {
      cardBg: "bg-white",
      borderColor: "border-slate-200/90",
      iconBg:
        amount >= 0
          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
          : "bg-red-50 text-red-600 ring-1 ring-red-100",
      amountColor: amount >= 0 ? "text-emerald-700" : "text-red-600",
      badgeColor:
        amount >= 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200",
      progressBg: amount >= 0 ? "bg-emerald-500" : "bg-red-500",
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`rounded-2xl border ${current.borderColor} ${current.cardBg} p-6 shadow-xs hover:shadow-md transition-all group relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
            >
              <span>{actionLabel || "Edit"}</span>
            </button>
          )}
          <div
            className={`w-10 h-10 rounded-xl ${current.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className={`text-3xl font-extrabold tracking-tight ${current.amountColor}`}>
          ₹{Math.abs(amount).toLocaleString("en-IN")}
        </div>
        {badgeText && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${current.badgeColor}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {percentage !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Utilization</span>
            <span>{Math.min(Math.round(percentage), 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${current.progressBg}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {subtitle && (
        <div className="mt-3 text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {subtitle}
        </div>
      )}
    </div>
  );
}
