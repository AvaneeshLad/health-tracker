"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { getCalendarGridDays, getTodayString, isFutureDate } from "@/lib/dates";
import { getDayStatus } from "@/lib/streaks";

export async function getCalendarMonthData(year: number, monthIndex: number) {
  const user = await requireAuth();
  const today = getTodayString();

  // Get active habits count
  const activeHabits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true },
    select: { id: true, name: true, icon: true },
  });
  const totalActive = activeHabits.length;

  // Generate calendar grid days
  const { days, monthName, year: targetYear } = getCalendarGridDays(year, monthIndex);

  if (days.length === 0) {
    return { days: [], monthName, year: targetYear, totalActive, monthlyRate: 0, disciplineDaysCount: 0 };
  }

  const startDate = days[0].dateStr;
  const endDate = days[days.length - 1].dateStr;

  // Fetch all completions in this date range
  const completions = await prisma.habitCompletion.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      date: true,
      habitId: true,
    },
  });

  // Map completions count per day
  const completionsByDate = new Map<string, number>();
  completions.forEach((c) => {
    completionsByDate.set(c.date, (completionsByDate.get(c.date) || 0) + 1);
  });

  let totalPossiblePast = 0;
  let totalCompletedPast = 0;
  let disciplineDaysCount = 0;

  const calendarDays = days.map((day) => {
    const completedCount = completionsByDate.get(day.dateStr) || 0;
    const isFuture = day.isFuture;
    const isToday = day.isToday;
    const isPast = !isFuture && !isToday;

    const percentage = totalActive > 0 ? Math.min(100, Math.round((completedCount / totalActive) * 100)) : 0;
    const status = getDayStatus(completedCount, totalActive, isFuture, isToday);
    const isDisciplineDay = totalActive > 0 && completedCount >= totalActive;

    if (day.isCurrentMonth && (isPast || (isToday && completedCount > 0))) {
      totalPossiblePast += totalActive;
      totalCompletedPast += completedCount;
    }
    if (day.isCurrentMonth && isDisciplineDay) {
      disciplineDaysCount++;
    }

    return {
      ...day,
      totalHabits: totalActive,
      completedHabits: completedCount,
      percentage,
      status,
      isDisciplineDay,
    };
  });

  const monthlyRate = totalPossiblePast > 0 ? Math.round((totalCompletedPast / totalPossiblePast) * 100) : 0;

  return {
    days: calendarDays,
    monthName,
    year: targetYear,
    totalActive,
    monthlyRate,
    disciplineDaysCount,
  };
}

export async function getDayDetail(dateStr: string) {
  const user = await requireAuth();
  const today = getTodayString();
  const isFuture = isFutureDate(dateStr, today);
  const isToday = dateStr === today;

  // Fetch all active habits (plus any inactive habits that have a completion on this day)
  const allHabits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      OR: [
        { isActive: true },
        {
          completions: {
            some: { date: dateStr },
          },
        },
      ],
    },
    orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }],
    include: {
      completions: {
        where: { date: dateStr },
        select: { id: true, completedAt: true },
      },
    },
  });

  const habitsWithStatus = allHabits.map((habit) => {
    const isCompleted = habit.completions.length > 0;
    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      category: habit.category,
      isActive: habit.isActive,
      isCompleted,
      completedAt: habit.completions[0]?.completedAt || null,
    };
  });

  const totalHabits = habitsWithStatus.filter((h) => h.isActive).length;
  const completedHabits = habitsWithStatus.filter((h) => h.isCompleted).length;
  const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  const status = getDayStatus(completedHabits, totalHabits, isFuture, isToday);

  return {
    date: dateStr,
    isFuture,
    isToday,
    isEditable: !isFuture, // Past and today are editable
    totalHabits,
    completedHabits,
    percentage,
    status,
    habits: habitsWithStatus,
  };
}

export async function getHeatmapData(daysCount: number = 90) {
  const user = await requireAuth();
  const today = getTodayString();

  const activeHabitsCount = await prisma.habit.count({
    where: { userId: user.id, isActive: true },
  });

  // Query past `daysCount` days of completions
  const completions = await prisma.habitCompletion.findMany({
    where: {
      userId: user.id,
    },
    select: {
      date: true,
    },
  });

  const countsByDate = new Map<string, number>();
  completions.forEach((c) => {
    countsByDate.set(c.date, (countsByDate.get(c.date) || 0) + 1);
  });

  return {
    today,
    activeHabitsCount,
    completionsMap: Object.fromEntries(countsByDate),
  };
}
