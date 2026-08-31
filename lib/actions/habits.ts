"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { habitSchema, toggleCompletionSchema } from "@/lib/validations";
import { WINTER_ARC_PRESET } from "@/lib/habits/winterArcPreset";
import { calculateCurrentStreak, calculateLongestStreak, calculateOverallStreaks, getDayStatus } from "@/lib/streaks";
import { getTodayString } from "@/lib/dates";

export async function getTodayDashboardData(customDate?: string) {
  const user = await requireAuth();
  const today = customDate || getTodayString();

  // Fetch all active habits for the user ordered by sortOrder
  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      completions: {
        where: {
          userId: user.id,
        },
        select: {
          date: true,
        },
      },
    },
  });

  // Calculate streaks and today status for each habit
  const habitItems = habits.map((habit) => {
    const completedDates = habit.completions.map((c) => c.date);
    const isCompletedToday = completedDates.includes(today);
    const currentStreak = calculateCurrentStreak(completedDates, today);
    const longestStreak = calculateLongestStreak(completedDates);
    const totalCompletions = completedDates.length;

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      category: habit.category,
      sortOrder: habit.sortOrder,
      isActive: habit.isActive,
      isCompletedToday,
      currentStreak,
      longestStreak,
      totalCompletions,
    };
  });

  const totalActive = habitItems.length;
  const completedTodayCount = habitItems.filter((h) => h.isCompletedToday).length;
  const todayPercentage = totalActive > 0 ? Math.round((completedTodayCount / totalActive) * 100) : 0;
  const isDayComplete = totalActive > 0 && completedTodayCount === totalActive;

  // Calculate overall discipline streak (days where 100% of habits were completed)
  // Fetch all completions for the user across all dates
  const allCompletions = await prisma.habitCompletion.findMany({
    where: { userId: user.id },
    select: { date: true, habitId: true },
  });

  // Group completions by date
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

  return {
    today,
    habits: habitItems,
    totalActive,
    completedTodayCount,
    todayPercentage,
    isDayComplete,
    overallStreak: overallStreaks.currentStreak,
    bestOverallStreak: overallStreaks.longestStreak,
  };
}

export async function toggleHabitCompletion(habitId: string, targetDate?: string) {
  const user = await requireAuth();
  const date = targetDate || getTodayString();

  const validated = toggleCompletionSchema.safeParse({ habitId, date });
  if (!validated.success) {
    throw new Error("Invalid request data");
  }

  // Verify habit ownership
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== user.id) {
    throw new Error("Habit not found or unauthorized");
  }

  // Check if completion exists
  const existing = await prisma.habitCompletion.findUnique({
    where: {
      habitId_date: {
        habitId,
        date,
      },
    },
  });

  let isCompleted = false;

  if (existing) {
    // Delete record (toggle off)
    await prisma.habitCompletion.delete({
      where: { id: existing.id },
    });
    isCompleted = false;
  } else {
    // Create record (toggle on)
    await prisma.habitCompletion.create({
      data: {
        userId: user.id,
        habitId,
        date,
        completedAt: new Date(),
      },
    });
    isCompleted = true;
  }

  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  revalidatePath("/habits");

  return { success: true, isCompleted, habitId, date };
}

export async function createHabit(formData: {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}) {
  const user = await requireAuth();

  const validated = habitSchema.safeParse(formData);
  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || "Invalid habit data");
  }

  // Get current max sort order
  const highest = await prisma.habit.findFirst({
    where: { userId: user.id },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const nextOrder = (highest?.sortOrder ?? 0) + 1;

  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      name: validated.data.name.trim(),
      description: validated.data.description?.trim() || null,
      icon: validated.data.icon || "flame",
      category: validated.data.category || "discipline",
      sortOrder: nextOrder,
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, habit };
}

export async function updateHabit(
  habitId: string,
  data: {
    name: string;
    description?: string;
    icon?: string;
    category?: string;
    isActive?: boolean;
    sortOrder?: number;
  }
) {
  const user = await requireAuth();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== user.id) {
    throw new Error("Unauthorized or habit not found");
  }

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: {
      name: data.name.trim(),
      description: data.description?.trim() ?? habit.description,
      icon: data.icon ?? habit.icon,
      category: data.category ?? habit.category,
      isActive: data.isActive !== undefined ? data.isActive : habit.isActive,
      sortOrder: data.sortOrder !== undefined ? data.sortOrder : habit.sortOrder,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  revalidatePath("/calendar");
  return { success: true, habit: updated };
}

export async function toggleHabitActive(habitId: string) {
  const user = await requireAuth();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== user.id) {
    throw new Error("Unauthorized or habit not found");
  }

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: {
      isActive: !habit.isActive,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, habit: updated };
}

export async function deleteHabit(habitId: string, permanent: boolean = false) {
  const user = await requireAuth();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== user.id) {
    throw new Error("Unauthorized or habit not found");
  }

  if (permanent) {
    // Delete completions and habit
    await prisma.habitCompletion.deleteMany({
      where: { habitId },
    });
    await prisma.habit.delete({
      where: { id: habitId },
    });
  } else {
    // Soft delete / deactivation to preserve historical records
    await prisma.habit.update({
      where: { id: habitId },
      data: { isActive: false },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  revalidatePath("/calendar");
  return { success: true };
}

export async function reorderHabits(orderedIds: string[]) {
  const user = await requireAuth();

  const updates = orderedIds.map((id, index) =>
    prisma.habit.updateMany({
      where: { id, userId: user.id },
      data: { sortOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);
  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true };
}

export async function loadWinterArcPreset() {
  const user = await requireAuth();

  // Create all winter arc preset habits for this user
  const highest = await prisma.habit.findFirst({
    where: { userId: user.id },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  let startOrder = (highest?.sortOrder ?? 0) + 1;

  for (const preset of WINTER_ARC_PRESET) {
    await prisma.habit.create({
      data: {
        userId: user.id,
        name: preset.name,
        description: preset.description,
        icon: preset.icon,
        category: preset.category,
        sortOrder: startOrder++,
        isActive: true,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, count: WINTER_ARC_PRESET.length };
}

export async function getAllUserHabits() {
  const user = await requireAuth();

  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }],
    include: {
      completions: {
        select: { date: true },
      },
    },
  });

  const today = getTodayString();

  return habits.map((h) => {
    const dates = h.completions.map((c) => c.date);
    return {
      ...h,
      totalCompletions: dates.length,
      currentStreak: calculateCurrentStreak(dates, today),
      longestStreak: calculateLongestStreak(dates),
    };
  });
}
