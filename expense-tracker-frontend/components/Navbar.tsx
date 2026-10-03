"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Wallet, LogOut, LayoutDashboard, Receipt, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "Student");
        } catch (e) {
          setUserName("Student");
        }
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
            Expense<span className="text-blue-600">Track</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Features
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 text-sm font-medium transition ${
                  pathname === "/dashboard"
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/expenses"
                className={`flex items-center gap-1.5 text-sm font-medium transition ${
                  pathname === "/expenses"
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Receipt className="w-4 h-4" />
                Expenses
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-1.5 text-sm font-medium transition ${
                  pathname === "/profile"
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
