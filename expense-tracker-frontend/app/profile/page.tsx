"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState<string>("12000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        if (res.data.success && res.data.data) {
          const user = res.data.data;
          setProfile(user);
          setName(user.name || "");
          setMonthlyBudget((user.monthlyBudget || 12000).toString());
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const parsedBudget = isNaN(parseFloat(monthlyBudget)) ? 12000 : parseFloat(monthlyBudget);

    try {
      const res = await api.put("/users/me", {
        name: name.trim(),
        monthlyBudget: parsedBudget,
      });

      if (res.data.success) {
        setMessage("Profile updated successfully!");
        // Update cached user
        const cached = localStorage.getItem("user");
        if (cached) {
          const u = JSON.parse(cached);
          u.name = name.trim();
          u.monthlyBudget = parsedBudget;
          localStorage.setItem("user", JSON.stringify(u));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatMemberDate = (dateStr?: string) => {
    if (!dateStr) return "October 2026";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "October 2026";
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile</h1>

        {message && (
          <div className="mb-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={profile?.email || ""}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Status
              </div>
              <div className="text-sm font-semibold text-emerald-600 mt-0.5">
                {profile?.emailVerified ? "Verified ✓" : "Pending Verification"}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Member Since
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                {formatMemberDate(profile?.createdAt)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Monthly Budget (₹)
            </label>
            <input
              type="number"
              required
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-400">
              Used to calculate remaining balance on your dashboard.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
