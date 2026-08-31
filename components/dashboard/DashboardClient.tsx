"use client";

import React, { useState, useTransition } from "react";
import { TodayProgressCard } from "./TodayProgressCard";
import { MetricsOverview } from "./MetricsOverview";
import { CompletionBanner } from "./CompletionBanner";
import { HabitItem, DashboardHabit } from "./HabitItem";
import { toggleHabitCompletion } from "@/lib/actions/habits";
import { Plus, AlertCircle, ListPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  initialData: {
    today: string;
    habits: DashboardHabit[];
    totalActive: number;
    completedTodayCount: number;
    todayPercentage: number;
    isDayComplete: boolean;
    overallStreak: number;
    bestOverallStreak: number;
  };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Optimistic toggle handler
  const handleToggle = async (habitId: string) => {
    setErrorMessage(null);

    // Save previous state for potential rollback
    const previousState = { ...data };

    // Calculate optimistic state
    const updatedHabits = data.habits.map((h) => {
      if (h.id !== habitId) return h;
      const willBeCompleted = !h.isCompletedToday;
      const streakDelta = willBeCompleted ? 1 : -1;
      const newStreak = Math.max(0, h.currentStreak + streakDelta);
      const newLongest = Math.max(h.longestStreak, newStreak);

      return {
        ...h,
        isCompletedToday: willBeCompleted,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalCompletions: Math.max(
          0,
          h.totalCompletions + (willBeCompleted ? 1 : -1)
        ),
      };
    });

    const newCompletedCount = updatedHabits.filter(
      (h) => h.isCompletedToday
    ).length;
    const newPercentage =
      data.totalActive > 0
        ? Math.round((newCompletedCount / data.totalActive) * 100)
        : 0;
    const isNowComplete =
      data.totalActive > 0 && newCompletedCount === data.totalActive;

    // Apply optimistic update immediately
    setData((prev) => ({
      ...prev,
      habits: updatedHabits,
      completedTodayCount: newCompletedCount,
      todayPercentage: newPercentage,
      isDayComplete: isNowComplete,
      overallStreak: isNowComplete
        ? prev.isDayComplete
          ? prev.overallStreak
          : prev.overallStreak + 1
        : prev.isDayComplete
        ? Math.max(0, prev.overallStreak - 1)
        : prev.overallStreak,
    }));

    try {
      await toggleHabitCompletion(habitId, data.today);
    } catch (err: any) {
      console.error("Failed to toggle habit:", err);
      // Rollback on failure
      setData(previousState);
      setErrorMessage("Failed to save habit status. Please try again.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger-text text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Section: Today Progress Header Card */}
      <TodayProgressCard
        date={data.today}
        totalHabits={data.totalActive}
        completedHabits={data.completedTodayCount}
        percentage={data.todayPercentage}
        isDayComplete={data.isDayComplete}
      />

      {/* Metrics Row */}
      <MetricsOverview
        completedTodayCount={data.completedTodayCount}
        totalActive={data.totalActive}
        todayPercentage={data.todayPercentage}
        overallStreak={data.overallStreak}
        bestOverallStreak={data.bestOverallStreak}
      />

      {/* Day Complete Celebratory Banner */}
      {data.isDayComplete && (
        <CompletionBanner overallStreak={data.overallStreak} />
      )}

      {/* Habits Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono tracking-widest text-cold-400 uppercase">
              TODAY'S DISCIPLINE
            </h2>
            <span className="text-[11px] font-mono text-cold-500">
              ({data.completedTodayCount}/{data.totalActive})
            </span>
          </div>

          <Link
            href="/habits"
            className="text-xs font-mono text-cold-400 hover:text-cold-ice flex items-center gap-1 transition-colors"
          >
            <span>MANAGE</span>
          </Link>
        </div>

        {/* Habit Items List */}
        {data.habits.length > 0 ? (
          <div className="space-y-2">
            {data.habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-lg border border-border border-dashed p-8 text-center bg-surface/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-surface-secondary border border-border mx-auto flex items-center justify-center text-cold-400">
              <ListPlus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-mono text-base font-bold text-white uppercase">
                NO HABITS YET
              </h3>
              <p className="text-xs text-cold-400 max-w-sm mx-auto">
                Build your daily discipline system by adding your habits.
              </p>
            </div>

            <div className="flex items-center justify-center pt-2">
              <Link
                href="/habits"
                className="px-4 py-2.5 rounded bg-white hover:bg-cold-200 text-black font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>CREATE HABIT</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
