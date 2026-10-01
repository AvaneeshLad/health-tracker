"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, User, Sparkles, AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [winterArcPreset, setWinterArcPreset] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        winterArcPreset,
      });

      // Automatically sign in
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.");
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
            BEGIN YOUR TRACKER
          </h1>
          <p className="text-xs text-cold-400">
            Build your discipline system. Keep the promise.
          </p>
        </div>

        {/* Register Box */}
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
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marcus Aurelius"
                  className="w-full pl-9 pr-3 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm"
                />
                <User className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
              </div>
            </div>

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
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (6+ characters)"
                  className="w-full pl-9 pr-10 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm placeholder-cold-500"
                />
                <Lock className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-0.5 rounded text-cold-400 hover:text-white transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Winter Arc Preset Checkbox Option */}
            <label className="flex items-start gap-3 p-3 rounded bg-surface-secondary/70 border border-border cursor-pointer select-none">
              <input
                type="checkbox"
                checked={winterArcPreset}
                onChange={(e) => setWinterArcPreset(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-surface border-border text-cold-ice focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">
                  Initialize 8 Winter Arc Habits
                </span>
                <span className="text-cold-400 text-[11px] block mt-0.5">
                  Preloads morning wake up, workout, meditation, reading, no sugar, no junk, 3L water, sleep before 11.
                </span>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-white hover:bg-cold-200 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "INITIALIZING..." : "CREATE ACCOUNT & START"}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-cold-400">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="text-cold-ice hover:underline font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
