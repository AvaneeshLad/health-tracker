"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { getTodayString, addDaysToString, getDaysDifference } from "@/lib/dates";
import { calculateOverallStreaks, calculateCurrentStreak, calculateLongestStreak } from "@/lib/streaks";

export async function getAnalyticsData() {
  const user = await requireAuth();
  const today = getTodayString();

  // Active habits
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: {
      completions: {
        select: { date: true },
      },
    },
  });

  const activeHabits = habits.filter((h) => h.isActive);
  const totalActive = activeHabits.length;

  // All completions
  const allCompletions = await prisma.habitCompletion.findMany({
    where: { userId: user.id },
    select: { date: true, habitId: true },
  });

  // Calculate 30-day window
  const thirtyDaysAgo = addDaysToString(today, -29);
  const completionsLast30Days = allCompletions.filter(
    (c) => c.date >= thirtyDaysAgo && c.date <= today
  );

  // Group by date
  const completionsByDate = new Map<string, number>();
  allCompletions.forEach((c) => {
    completionsByDate.set(c.date, (completionsByDate.get(c.date) || 0) + 1);
  });

  const disciplineDays: string[] = [];
  completionsByDate.forEach((count, date) => {
    if (totalActive > 0 && count >= totalActive) {
      disciplineDays.push(date);
    }
  });

  const overallStreaks = calculateOverallStreaks(disciplineDays, today);

  // 30 days trend
  const trendDays: { date: string; completed: number; total: number; percentage: number; isDiscipline: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const dStr = addDaysToString(today, -i);
    const count = completionsByDate.get(dStr) || 0;
    const pct = totalActive > 0 ? Math.min(100, Math.round((count / totalActive) * 100)) : 0;
    trendDays.push({
      date: dStr,
      completed: count,
      total: totalActive,
      percentage: pct,
      isDiscipline: totalActive > 0 && count >= totalActive,
    });
  }

  // 30 days average completion rate
  const totalPossible30Days = totalActive * 30;
  const totalCompleted30Days = completionsLast30Days.length;
  const rate30Days =
    totalPossible30Days > 0
      ? Math.round((totalCompleted30Days / totalPossible30Days) * 100)
      : 0;

  // Habit performance rankings (past 30 days)
  const habitPerformance = activeHabits.map((habit) => {
    const completionsInWindow = habit.completions.filter(
      (c) => c.date >= thirtyDaysAgo && c.date <= today
    ).length;
    const percentage = Math.round((completionsInWindow / 30) * 100);
    const allDates = habit.completions.map((c) => c.date);

    return {
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      category: habit.category,
      completionsInWindow,
      percentage,
      currentStreak: calculateCurrentStreak(allDates, today),
      longestStreak: calculateLongestStreak(allDates),
      totalCompletions: allDates.length,
    };
  });

  // Sort by percentage descending
  habitPerformance.sort((a, b) => b.percentage - a.percentage);

  const bestHabit = habitPerformance.length > 0 ? habitPerformance[0] : null;
  const weakestHabit =
    habitPerformance.length > 1 ? habitPerformance[habitPerformance.length - 1] : null;

  // Category breakdown
  const categoryStats = new Map<string, { totalPossible: number; completed: number }>();
  activeHabits.forEach((habit) => {
    const current = categoryStats.get(habit.category) || { totalPossible: 0, completed: 0 };
    current.totalPossible += 30;
    current.completed += habit.completions.filter(
      (c) => c.date >= thirtyDaysAgo && c.date <= today
    ).length;
    categoryStats.set(habit.category, current);
  });

  const categories = Array.from(categoryStats.entries()).map(([category, stats]) => ({
    category,
    rate: stats.totalPossible > 0 ? Math.round((stats.completed / stats.totalPossible) * 100) : 0,
    completed: stats.completed,
  }));

  return {
    today,
    totalActiveHabits: totalActive,
    totalCompletionsAllTime: allCompletions.length,
    overallStreak: overallStreaks.currentStreak,
    bestOverallStreak: overallStreaks.longestStreak,
    rate30Days,
    trendDays,
    habitPerformance,
    bestHabit,
    weakestHabit,
    categories,
    disciplineDaysCount: disciplineDays.length,
  };
}
