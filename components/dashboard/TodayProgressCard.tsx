"use client";

import React from "react";
import { formatDisplayDate, getGreeting } from "@/lib/dates";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface TodayProgressCardProps {
  date: string;
  totalHabits: number;
  completedHabits: number;
  percentage: number;
  isDayComplete: boolean;
}

export function TodayProgressCard({
  date,
  totalHabits,
  completedHabits,
  percentage,
  isDayComplete,
}: TodayProgressCardProps) {
  const greeting = getGreeting();
  const displayDate = formatDisplayDate(date).toUpperCase();

  return (
    <div
      className={clsx(
        "rounded-lg border p-6 transition-all duration-300 relative overflow-hidden",
        isDayComplete
          ? "bg-surface border-success/30 glow-success"
          : "bg-surface border-border"
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-cold-400 uppercase">
            {greeting}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono mt-0.5">
            {displayDate}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isDayComplete ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-success/10 border border-success/30 text-success text-xs font-mono font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DISCIPLINE COMPLETE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-secondary border border-border text-cold-300 text-xs font-mono">
              <span>{totalHabits - completedHabits} REMAINING</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {completedHabits}
            </span>
            <span className="text-base text-cold-400">/</span>
            <span className="text-base text-cold-400 font-medium">
              {totalHabits}
            </span>
            <span className="text-xs uppercase tracking-wider text-cold-500 ml-1">
              COMPLETED
            </span>
          </div>

          <div className="font-mono text-xl sm:text-2xl font-bold text-cold-ice">
            {percentage}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-surface-elevated rounded-full overflow-hidden border border-border/60 relative">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500 ease-out",
              isDayComplete
                ? "bg-gradient-to-r from-success to-emerald-400"
                : "bg-gradient-to-r from-cold-600 to-cold-ice"
            )}
            style={{ width: `${Math.max(percentage, 0)}%` }}
          />
        </div>
      </div>

      {/* Footer Motivation */}
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-cold-400 font-mono">
        <span>
          {isDayComplete
            ? "100% — Nothing left unfinished."
            : percentage >= 50
            ? "Over halfway. Finish strong."
            : "Do the work. Keep the streak. Become better."}
        </span>
      </div>
    </div>
  );
}
