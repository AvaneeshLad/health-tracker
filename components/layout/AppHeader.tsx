"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Flame, LogOut, Shield, User, Sparkles } from "lucide-react";
import { formatShortDate, getTodayString } from "@/lib/dates";

interface AppHeaderProps {
  overallStreak?: number;
}

export function AppHeader({ overallStreak }: AppHeaderProps) {
  const { data: session } = useSession();
  const todayStr = getTodayString();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-surface-secondary border border-border-strong flex items-center justify-center text-cold-ice group-hover:border-cold-ice transition-colors">
            <Flame className="w-4 h-4 text-cold-ice" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-white">
                DAILY TRACKER
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-surface-secondary border border-border text-cold-400">
                WINTER ARC
              </span>
            </div>
            <p className="text-[11px] text-cold-400 tracking-tight hidden sm:block">
              {formatShortDate(todayStr)}
            </p>
          </div>
        </Link>

        {/* Right side: Streak pill + User menu */}
        <div className="flex items-center gap-3">
          {overallStreak !== undefined && overallStreak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-border text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 animate-pulse-subtle" />
              <span className="text-white font-semibold">{overallStreak}</span>
              <span className="text-cold-400 hidden sm:inline">DAYS</span>
            </div>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <span className="text-xs text-cold-300 font-mono hidden md:inline truncate max-w-[140px]">
              {session?.user?.name || session?.user?.email?.split("@")[0]}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out"
              className="p-2 rounded hover:bg-surface-secondary text-cold-400 hover:text-cold-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
