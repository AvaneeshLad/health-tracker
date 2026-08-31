import { format, parseISO, addDays, differenceInCalendarDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

/**
 * Returns today's date formatted as YYYY-MM-DD.
 * If user timezone is provided, formats with respect to that timezone.
 */
export function getTodayString(timeZone?: string): string {
  try {
    if (timeZone) {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return formatter.format(now); // en-CA gives YYYY-MM-DD
    }
  } catch (e) {
    // fallback to local if timezone is invalid
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // safe midday date to avoid timezone shift
}

export function addDaysToString(dateStr: string, days: number): string {
  const date = parseDateString(dateStr);
  const nextDate = addDays(date, days);
  return formatDate(nextDate);
}

export function getPreviousDayString(dateStr: string): string {
  return addDaysToString(dateStr, -1);
}

export function getNextDayString(dateStr: string): string {
  return addDaysToString(dateStr, 1);
}

export function getDaysDifference(startStr: string, endStr: string): number {
  const start = parseDateString(startStr);
  const end = parseDateString(endStr);
  return differenceInCalendarDays(end, start);
}

export function isFutureDate(dateStr: string, todayStr: string): boolean {
  return dateStr > todayStr;
}

export function isTodayDate(dateStr: string, todayStr: string): boolean {
  return dateStr === todayStr;
}

export function isPastDate(dateStr: string, todayStr: string): boolean {
  return dateStr < todayStr;
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseDateString(dateStr);
  return format(date, "EEEE, MMMM d, yyyy");
}

export function formatShortDate(dateStr: string): string {
  const date = parseDateString(dateStr);
  return format(date, "MMM d, yyyy");
}

export function getGreeting(timeZone?: string): string {
  let hour = new Date().getHours();
  try {
    if (timeZone) {
      const timeStr = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hour12: false,
      }).format(new Date());
      hour = parseInt(timeStr, 10);
    }
  } catch (e) {}

  if (hour < 5) return "LATE NIGHT";
  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  if (hour < 22) return "GOOD EVENING";
  return "NIGHT";
}

/**
 * Returns full calendar grid days for a given month, including padding days
 * from adjacent months so it aligns to Monday-Sunday (or Sunday-Saturday).
 */
export function getCalendarGridDays(year: number, monthIndex: number): {
  days: {
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFuture: boolean;
  }[];
  monthName: string;
  year: number;
} {
  const firstOfMonth = new Date(year, monthIndex, 1, 12, 0, 0);
  const startMonth = startOfMonth(firstOfMonth);
  const endMonth = endOfMonth(firstOfMonth);
  const todayStr = getTodayString();

  // Day of week for start of month (0 = Sunday, 1 = Monday, etc.)
  // We align starting on Monday (ISO week)
  const startDayOfWeek = (startMonth.getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  const days: {
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFuture: boolean;
  }[] = [];

  // Padding days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = addDays(startMonth, -(i + 1));
    const dStr = formatDate(prevDate);
    days.push({
      dateStr: dStr,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      isFuture: dStr > todayStr,
    });
  }

  // Days of current month
  const monthDays = eachDayOfInterval({ start: startMonth, end: endMonth });
  for (const mDay of monthDays) {
    const dStr = formatDate(mDay);
    days.push({
      dateStr: dStr,
      dayNumber: mDay.getDate(),
      isCurrentMonth: true,
      isToday: dStr === todayStr,
      isFuture: dStr > todayStr,
    });
  }

  // Padding days to fill 5 or 6 weeks (total multiple of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = addDays(endMonth, i);
    const dStr = formatDate(nextDate);
    days.push({
      dateStr: dStr,
      dayNumber: nextDate.getDate(),
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      isFuture: dStr > todayStr,
    });
  }

  return {
    days,
    monthName: format(firstOfMonth, "MMMM"),
    year: firstOfMonth.getFullYear(),
  };
}
