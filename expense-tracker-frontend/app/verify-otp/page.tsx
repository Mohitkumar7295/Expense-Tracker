"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("verify_email");
    const mode = searchParams.get("mode") || sessionStorage.getItem("verify_mode");
    const loginFlag = mode === "login";
    setIsLoginMode(loginFlag);

    if (!savedEmail) {
      router.push(loginFlag ? "/login" : "/register");
    } else {
      setEmail(savedEmail);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLoginMode) {
        const response = await api.post("/auth/verify-login", {
          email,
          otp: fullOtp,
        });

        if (response.data.success && response.data.data?.token) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          sessionStorage.removeItem("verify_email");
          sessionStorage.removeItem("verify_mode");
          router.push("/dashboard");
        } else {
          setError(response.data.message || "Login OTP verification failed");
        }
      } else {
        const response = await api.post("/auth/verify-registration", {
          email,
          otp: fullOtp,
        });

        if (response.data.success) {
          sessionStorage.removeItem("verify_email");
          sessionStorage.removeItem("verify_mode");
          router.push("/login?verified=true");
        } else {
          setError(response.data.message || "Registration OTP verification failed");
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setError("");
    setMessage("");

    try {
      const endpoint = isLoginMode ? "/auth/resend-login-otp" : "/auth/resend-otp";
      const res = await api.post(endpoint, { email });
      if (res.data.success) {
        setMessage("A fresh 6-digit OTP has been sent to your email. Please check your inbox.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setTimer(300);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {isLoginMode ? "Verify Login" : "Verify Email"}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {isLoginMode ? "Enter the 6-digit OTP sent to " : "OTP sent to "}
          <span className="font-medium text-slate-800">{email}</span>
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-200">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Expires in: <span className="font-semibold text-slate-600">{formatTimer(timer)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Verifying..." : isLoginMode ? "Verify & Login" : "Verify"}
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || timer > 240}
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 disabled:text-slate-400"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
