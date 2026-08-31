"use client";

import React from "react";
import {
  Flame,
  Trophy,
  TrendingUp,
  Award,
  AlertCircle,
  Activity,
  CheckCircle2,
  BarChart2,
} from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { formatShortDate } from "@/lib/dates";
import { clsx } from "clsx";

interface AnalyticsData {
  today: string;
  totalActiveHabits: number;
  totalCompletionsAllTime: number;
  overallStreak: number;
  bestOverallStreak: number;
  rate30Days: number;
  trendDays: {
    date: string;
    completed: number;
    total: number;
    percentage: number;
    isDiscipline: boolean;
  }[];
  habitPerformance: {
    id: string;
    name: string;
    icon: string;
    category: string;
    completionsInWindow: number;
    percentage: number;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
  }[];
  bestHabit: any | null;
  weakestHabit: any | null;
  categories: {
    category: string;
    rate: number;
    completed: number;
  }[];
  disciplineDaysCount: number;
}

export function AnalyticsView({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6 font-mono animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono tracking-widest text-cold-400 uppercase">
          PERFORMANCE & CONSISTENCY
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-0.5">
          DISCIPLINE ANALYTICS
        </h1>
      </div>

      {/* Top 3 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 30-Day Completion Rate */}
        <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cold-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest">
              30-DAY CONSISTENCY
            </span>
            <TrendingUp className="w-4 h-4 text-cold-ice" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {data.rate30Days}%
            </div>
            <div className="h-2 w-full bg-surface-secondary rounded-full mt-2 overflow-hidden border border-border">
              <div
                className="h-full bg-cold-ice rounded-full"
                style={{ width: `${data.rate30Days}%` }}
              />
            </div>
          </div>
        </div>

        {/* Strongest Habit */}
        <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cold-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest">
              STRONGEST HABIT
            </span>
            <Award className="w-4 h-4 text-success" />
          </div>
          <div>
            {data.bestHabit ? (
              <>
                <div className="flex items-center gap-2">
                  <IconRenderer
                    name={data.bestHabit.icon}
                    className="w-4 h-4 text-success shrink-0"
                  />
                  <span className="text-base font-bold text-white truncate">
                    {data.bestHabit.name}
                  </span>
                </div>
                <div className="text-xs text-success font-semibold mt-1">
                  {data.bestHabit.percentage}% consistency (
                  {data.bestHabit.currentStreak}d streak)
                </div>
              </>
            ) : (
              <span className="text-xs text-cold-500">Not enough data</span>
            )}
          </div>
        </div>

        {/* Needs Focus Habit */}
        <div className="cold-card rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cold-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest">
              NEEDS WORK
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            {data.weakestHabit ? (
              <>
                <div className="flex items-center gap-2">
                  <IconRenderer
                    name={data.weakestHabit.icon}
                    className="w-4 h-4 text-amber-500 shrink-0"
                  />
                  <span className="text-base font-bold text-white truncate">
                    {data.weakestHabit.name}
                  </span>
                </div>
                <div className="text-xs text-amber-400 font-semibold mt-1">
                  {data.weakestHabit.percentage}% consistency
                </div>
              </>
            ) : (
              <span className="text-xs text-cold-500">All habits consistent</span>
            )}
          </div>
        </div>
      </div>

      {/* 30-Day Trend Chart (Bar Timeline) */}
      <div className="cold-card rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-cold-400 font-bold">
              30-DAY DAILY COMPLETION TREND
            </h3>
            <p className="text-[11px] text-cold-500 mt-0.5">
              Daily percentage of active discipline tasks completed
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-cold-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-success" />
            <span>100% DISCIPLINE</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-cold-ice/70 ml-2" />
            <span>PARTIAL</span>
          </div>
        </div>

        {/* Bar Timeline */}
        <div className="pt-2">
          <div className="h-32 flex items-end gap-1 sm:gap-2 border-b border-border/80 pb-2">
            {data.trendDays.map((day) => (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black border border-border text-[10px] px-2 py-1 rounded pointer-events-none z-20 whitespace-nowrap">
                  {formatShortDate(day.date)}: {day.completed}/{day.total} (
                  {day.percentage}%)
                </div>

                <div
                  className={clsx(
                    "w-full rounded-t transition-all duration-200",
                    day.percentage === 100
                      ? "bg-success hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      : day.percentage >= 50
                      ? "bg-cold-ice/80 hover:bg-cold-ice"
                      : day.percentage > 0
                      ? "bg-cold-500/60 hover:bg-cold-400"
                      : "bg-danger/20 hover:bg-danger/40 h-1"
                  )}
                  style={{
                    height:
                      day.percentage > 0
                        ? `${Math.max(day.percentage, 8)}%`
                        : "4px",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-cold-500 pt-2 font-mono">
            <span>30 DAYS AGO</span>
            <span>15 DAYS AGO</span>
            <span>TODAY</span>
          </div>
        </div>
      </div>

      {/* Habit Breakdown Table */}
      <div className="cold-card rounded-lg p-5 space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-cold-400 font-bold">
          HABIT DISCIPLINE BREAKDOWN
        </h3>

        <div className="space-y-2">
          {data.habitPerformance.map((habit) => (
            <div
              key={habit.id}
              className="p-3 rounded bg-surface-secondary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded bg-surface border border-border flex items-center justify-center text-cold-300 shrink-0">
                  <IconRenderer name={habit.icon} className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-white truncate block">
                    {habit.name}
                  </span>
                  <span className="text-[10px] text-cold-400 uppercase tracking-wider">
                    {habit.category} • {habit.totalCompletions} all-time
                  </span>
                </div>
              </div>

              {/* Progress & Streaks */}
              <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                <div className="w-28 hidden sm:block">
                  <div className="flex justify-between text-[10px] text-cold-400 mb-1">
                    <span>30D Rate</span>
                    <span className="font-bold text-white">
                      {habit.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full",
                        habit.percentage >= 80 ? "bg-success" : "bg-cold-ice"
                      )}
                      style={{ width: `${habit.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>{habit.currentStreak}d streak</span>
                  </div>
                  <div className="text-[10px] text-cold-500">
                    Best: {habit.longestStreak}d
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
