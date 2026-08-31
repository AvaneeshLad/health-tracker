"use client";

import React from "react";
import { Flame, Trophy, CheckSquare, Target } from "lucide-react";
import { clsx } from "clsx";

interface MetricsOverviewProps {
  completedTodayCount: number;
  totalActive: number;
  todayPercentage: number;
  overallStreak: number;
  bestOverallStreak: number;
}

export function MetricsOverview({
  completedTodayCount,
  totalActive,
  todayPercentage,
  overallStreak,
  bestOverallStreak,
}: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Metric 1: Overall Streak */}
      <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-cold-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest">
            DISCIPLINE STREAK
          </span>
          <Flame
            className={clsx(
              "w-4 h-4",
              overallStreak > 0 ? "text-amber-500" : "text-cold-500"
            )}
          />
        </div>
        <div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1.5">
            <span>{overallStreak}</span>
            <span className="text-xs text-cold-400 font-normal">DAYS</span>
          </div>
          <span className="text-[10px] text-cold-500 font-mono">
            100% completion days
          </span>
        </div>
      </div>

      {/* Metric 2: Best Streak */}
      <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-cold-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest">
            BEST STREAK
          </span>
          <Trophy className="w-4 h-4 text-cold-ice" />
        </div>
        <div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1.5">
            <span>{bestOverallStreak}</span>
            <span className="text-xs text-cold-400 font-normal">DAYS</span>
          </div>
          <span className="text-[10px] text-cold-500 font-mono">
            Historical personal record
          </span>
        </div>
      </div>

      {/* Metric 3: Today Completed */}
      <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-cold-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest">
            TODAY COMPLETED
          </span>
          <CheckSquare className="w-4 h-4 text-success" />
        </div>
        <div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1.5">
            <span>{completedTodayCount}</span>
            <span className="text-xs text-cold-400 font-normal">
              / {totalActive}
            </span>
          </div>
          <span className="text-[10px] text-cold-500 font-mono">
            {todayPercentage}% finished
          </span>
        </div>
      </div>

      {/* Metric 4: Daily Goal Status */}
      <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-cold-400 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest">
            DAILY STANDARD
          </span>
          <Target className="w-4 h-4 text-cold-300" />
        </div>
        <div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {totalActive > 0 && completedTodayCount === totalActive
              ? "MET"
              : "IN PROGRESS"}
          </div>
          <span className="text-[10px] text-cold-500 font-mono">
            100% required for streak
          </span>
        </div>
      </div>
    </div>
  );
}
