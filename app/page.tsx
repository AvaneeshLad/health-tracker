import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { Flame, Shield, CheckCircle2, Trophy, ArrowRight, Sparkles, Calendar, CheckSquare, BarChart3 } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-cold-ice selection:text-black">
      {/* Top minimal bar */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-surface-secondary border border-border flex items-center justify-center text-cold-ice">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-wider">
              DAILY TRACKER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs uppercase tracking-wider text-cold-400 hover:text-white px-3 py-1.5 rounded transition-colors"
            >
              SIGN IN
            </Link>
            <Link
              href="/register"
              className="text-xs uppercase tracking-wider bg-white text-black font-bold px-3.5 py-1.5 rounded hover:bg-cold-200 transition-colors"
            >
              START
            </Link>
          </div>
        </div>
      </header>

      {/* Main Cold Hero */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col justify-center py-16 sm:py-24 text-center space-y-10">
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary border border-border text-cold-300 text-xs tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>WINTER ARC DISCIPLINE SYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-tight font-sans">
            Do the work. <br className="hidden sm:inline" />
            Keep the streak. <br />
            <span className="text-cold-ice">Become better.</span>
          </h1>

          <p className="text-sm sm:text-base text-cold-400 max-w-xl mx-auto font-mono">
            A cold, dark, distraction-free habit tracking dashboard built around
            absolute consistency, unbreakable streaks, and personal accountability.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded bg-white hover:bg-cold-200 text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>TRY 1-CLICK DEMO (35 DAYS HISTORY)</span>
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded bg-surface-secondary hover:bg-surface-elevated border border-border text-cold-200 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
          >
            CREATE YOUR SYSTEM
          </Link>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 text-left font-mono">
          <div className="cold-card rounded-lg p-5 space-y-2.5">
            <div className="w-8 h-8 rounded bg-surface-secondary border border-border flex items-center justify-center text-cold-ice">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">
              Zero Distraction
            </h3>
            <p className="text-xs text-cold-400">
              One-click instantaneous checkoffs with zero lag, animations calibrated for discipline, and no gamified noise.
            </p>
          </div>

          <div className="cold-card rounded-lg p-5 space-y-2.5">
            <div className="w-8 h-8 rounded bg-surface-secondary border border-border flex items-center justify-center text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">
              Streak Psychology
            </h3>
            <p className="text-xs text-cold-400">
              Individual habit streaks alongside 100% daily discipline streaks. Guard your consistency without broken gaps.
            </p>
          </div>

          <div className="cold-card rounded-lg p-5 space-y-2.5">
            <div className="w-8 h-8 rounded bg-surface-secondary border border-border flex items-center justify-center text-success">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">
              Historical Heatmaps
            </h3>
            <p className="text-xs text-cold-400">
              GitHub-style 90-day consistency heatmap, monthly matrices, and deep historical inspection for every past day.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-cold-500 font-mono">
        DAILY TRACKER • WINTER ARC EDITION • NO EXCUSES
      </footer>
    </div>
  );
}
