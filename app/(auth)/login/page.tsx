"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setError(res.error || "Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    setEmail("demo@winterarc.com");
    setPassword("discipline2026");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "demo@winterarc.com",
        password: "discipline2026",
      });

      if (res?.error) {
        setError("Demo user not initialized. Run db seed.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-in font-mono">
        {/* Brand Logo & Headline */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-surface border border-border-strong mx-auto flex items-center justify-center text-cold-ice shadow-[0_0_20px_rgba(56,189,248,0.15)]">
            <Flame className="w-6 h-6 text-cold-ice" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase mt-4">
            DAILY TRACKER
          </h1>
          <p className="text-xs text-cold-400">
            No excuses. Just consistency.
          </p>
        </div>

        {/* Login Box */}
        <div className="cold-card rounded-lg p-6 sm:p-8 space-y-6 shadow-2xl border-border-strong">
          {error && (
            <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger-text text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cold-300 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@discipline.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm"
                />
                <Mail className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cold-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm"
                />
                <Lock className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-white hover:bg-cold-200 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-4 border-t border-border space-y-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded bg-surface-secondary hover:bg-surface-elevated border border-border-strong text-cold-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cold-ice" />
              <span>QUICK 1-CLICK DEMO (35 DAYS HISTORY)</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-cold-400">
          <span>Don't have an account? </span>
          <Link
            href="/register"
            className="text-cold-ice hover:underline font-semibold"
          >
            Create your system
          </Link>
        </div>
      </div>
    </div>
  );
}
