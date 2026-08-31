import { getPreviousDayString, getDaysDifference, parseDateString } from "@/lib/dates";

/**
 * Calculates current streak for a single habit given a list of completed date strings (YYYY-MM-DD)
 * and the reference date `today` (YYYY-MM-DD).
 */
export function calculateCurrentStreak(
  completedDates: string[],
  today: string
): number {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  const completedSet = new Set(completedDates);

  // Check if completed today
  let streak = 0;
  let checkDate = today;

  if (completedSet.has(today)) {
    streak = 1;
    checkDate = getPreviousDayString(today);
    while (completedSet.has(checkDate)) {
      streak++;
      checkDate = getPreviousDayString(checkDate);
    }
    return streak;
  }

  // If not completed today, check if yesterday was completed (streak is alive for today)
  const yesterday = getPreviousDayString(today);
  if (completedSet.has(yesterday)) {
    streak = 1;
    checkDate = getPreviousDayString(yesterday);
    while (completedSet.has(checkDate)) {
      streak++;
      checkDate = getPreviousDayString(checkDate);
    }
    return streak;
  }

  // Neither today nor yesterday was completed
  return 0;
}

/**
 * Calculates the longest consecutive streak of completed dates in history.
 */
export function calculateLongestStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  // Remove duplicates and sort ascending
  const uniqueSorted = Array.from(new Set(completedDates)).sort();
  if (uniqueSorted.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueSorted.length; i++) {
    const prev = uniqueSorted[i - 1];
    const curr = uniqueSorted[i];

    const diff = getDaysDifference(prev, curr);
    if (diff === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else if (diff > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Calculates completion rate (0-100 percentage) over a given date range or total possible days.
 */
export function calculateCompletionRate(
  completedCount: number,
  totalPossibleCount: number
): number {
  if (totalPossibleCount <= 0) return 0;
  return Math.round((completedCount / totalPossibleCount) * 100);
}

/**
 * Type representing the completion breakdown for a given day.
 */
export interface DayCompletionSummary {
  date: string; // YYYY-MM-DD
  totalHabits: number;
  completedHabits: number;
  percentage: number;
  isDisciplineDay: boolean; // 100% completed
  status: "FUTURE" | "COMPLETED" | "PARTIAL" | "MISSED" | "EMPTY";
}

/**
 * Calculates overall discipline streaks from a list of discipline days.
 */
export function calculateOverallStreaks(
  disciplineDates: string[],
  today: string
): { currentStreak: number; longestStreak: number } {
  const currentStreak = calculateCurrentStreak(disciplineDates, today);
  const longestStreak = calculateLongestStreak(disciplineDates);
  return { currentStreak, longestStreak };
}

/**
 * Evaluates day status given completed and active habits count.
 */
export function getDayStatus(
  completedCount: number,
  activeCount: number,
  isFuture: boolean,
  isToday: boolean
): "FUTURE" | "COMPLETED" | "PARTIAL" | "MISSED" | "EMPTY" {
  if (isFuture) return "FUTURE";
  if (activeCount === 0) return "EMPTY";
  if (completedCount >= activeCount) return "COMPLETED";
  if (completedCount > 0) return "PARTIAL";
  if (isToday) return "EMPTY"; // Today with 0 completed is empty/in-progress, not yet missed
  return "MISSED"; // Past day with 0 completed is missed
}
