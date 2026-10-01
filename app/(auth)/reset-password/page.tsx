"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { resetPassword } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email: email.trim().toLowerCase(),
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please verify your email.");
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
            <KeyRound className="w-6 h-6 text-cold-ice" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase mt-4">
            RESET PASSWORD
          </h1>
          <p className="text-xs text-cold-400">
            Regain access to your daily discipline tracker.
          </p>
        </div>

        {/* Form Box */}
        <div className="cold-card rounded-lg p-6 sm:p-8 space-y-6 shadow-2xl border-border-strong">
          {success ? (
            <div className="space-y-5 text-center py-2 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-success/10 border border-success/30 mx-auto flex items-center justify-center text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase">
                  PASSWORD RESET SUCCESSFUL
                </h3>
                <p className="text-xs text-cold-400 leading-relaxed">
                  Your password has been updated. You can now log in with your new credentials.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 rounded bg-white hover:bg-cold-200 text-black font-bold text-xs uppercase tracking-wider transition-colors inline-block text-center"
              >
                PROCEED TO LOGIN
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger-text text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-cold-300 uppercase tracking-wider">
                    Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@discipline.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm placeholder-cold-500"
                    />
                    <Mail className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* New Password Field with Eye Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-cold-300 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="•••••••• (6+ characters)"
                      className="w-full pl-9 pr-10 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm placeholder-cold-500"
                    />
                    <Lock className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 p-0.5 rounded text-cold-400 hover:text-white transition-colors"
                      title={showNewPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field with Eye Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-cold-300 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="•••••••• (re-enter password)"
                      className="w-full pl-9 pr-10 py-2.5 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm placeholder-cold-500"
                    />
                    <Lock className="w-4 h-4 text-cold-500 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 p-0.5 rounded text-cold-400 hover:text-white transition-colors"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded bg-white hover:bg-cold-200 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? "UPDATING PASSWORD..." : "RESET PASSWORD"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer Link back to login */}
        <div className="text-center text-xs text-cold-400 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 text-cold-500" />
          <Link
            href="/login"
            className="text-cold-ice hover:underline font-semibold"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
