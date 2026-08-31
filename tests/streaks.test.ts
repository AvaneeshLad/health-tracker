import { describe, it, expect } from "vitest";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateOverallStreaks,
  calculateCompletionRate,
  getDayStatus,
} from "../lib/streaks";

describe("Streak Algorithm Suite", () => {
  const TODAY = "2026-08-30";
  const YESTERDAY = "2026-08-29";

  it("Scenario 1: No completions -> streak is 0, best is 0", () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0);
    expect(calculateLongestStreak([])).toBe(0);
  });

  it("Scenario 2: One completion on today -> current streak is 1, longest is 1", () => {
    const dates = [TODAY];
    expect(calculateCurrentStreak(dates, TODAY)).toBe(1);
    expect(calculateLongestStreak(dates)).toBe(1);
  });

  it("Scenario 3: Consecutive completions (5 days ending today)", () => {
    const dates = [
      "2026-08-26",
      "2026-08-27",
      "2026-08-28",
      "2026-08-29",
      "2026-08-30",
    ];
    expect(calculateCurrentStreak(dates, TODAY)).toBe(5);
    expect(calculateLongestStreak(dates)).toBe(5);
  });

  it("Scenario 4: Broken streak (last completed was 3 days ago)", () => {
    const dates = [
      "2026-08-20",
      "2026-08-21",
      "2026-08-22",
      "2026-08-27", // missed 28, 29, 30
    ];
    expect(calculateCurrentStreak(dates, TODAY)).toBe(0);
    expect(calculateLongestStreak(dates)).toBe(3);
  });

  it("Scenario 5: Missing today but completed yesterday -> streak is preserved (alive)", () => {
    const dates = [
      "2026-08-25",
      "2026-08-26",
      "2026-08-27",
      "2026-08-28",
      "2026-08-29", // completed yesterday, today (Aug 30) not done yet
    ];
    expect(calculateCurrentStreak(dates, TODAY)).toBe(5);
    expect(calculateLongestStreak(dates)).toBe(5);
  });

  it("Scenario 6: Completing today extends the streak", () => {
    const datesWithToday = [
      "2026-08-25",
      "2026-08-26",
      "2026-08-27",
      "2026-08-28",
      "2026-08-29",
      "2026-08-30",
    ];
    expect(calculateCurrentStreak(datesWithToday, TODAY)).toBe(6);
    expect(calculateLongestStreak(datesWithToday)).toBe(6);
  });

  it("Scenario 7: Future dates do not affect current streak calculation", () => {
    // If a future completion exists (e.g. invalid date in future), calculation from today only looks back
    const dates = ["2026-08-29", "2026-08-30", "2026-09-05"];
    expect(calculateCurrentStreak(dates, TODAY)).toBe(2);
  });

  it("Scenario 8: Gaps in history are correctly handled", () => {
    const dates = [
      "2026-08-01",
      "2026-08-02",
      "2026-08-03",
      "2026-08-04", // 4 day streak
      "2026-08-10",
      "2026-08-11", // 2 day streak
      "2026-08-28",
      "2026-08-29",
      "2026-08-30", // 3 day current streak
    ];
    expect(calculateCurrentStreak(dates, TODAY)).toBe(3);
    expect(calculateLongestStreak(dates)).toBe(4);
  });

  it("Scenario 9: Multiple months boundary (Aug 29 -> Aug 30 -> Aug 31 -> Sep 01)", () => {
    const sepToday = "2026-09-02";
    const dates = [
      "2026-08-29",
      "2026-08-30",
      "2026-08-31",
      "2026-09-01",
      "2026-09-02",
    ];
    expect(calculateCurrentStreak(dates, sepToday)).toBe(5);
    expect(calculateLongestStreak(dates)).toBe(5);
  });

  it("Scenario 10: Leap year transition (Feb 27 -> Feb 28 -> Feb 29 -> Mar 01 on leap year 2028)", () => {
    const marToday = "2028-03-01";
    const dates = [
      "2028-02-27",
      "2028-02-28",
      "2028-02-29",
      "2028-03-01",
    ];
    expect(calculateCurrentStreak(dates, marToday)).toBe(4);
    expect(calculateLongestStreak(dates)).toBe(4);
  });

  it("Scenario 11: Year boundary (Dec 30 -> Dec 31 -> Jan 01)", () => {
    const newYearToday = "2027-01-01";
    const dates = ["2026-12-30", "2026-12-31", "2027-01-01"];
    expect(calculateCurrentStreak(dates, newYearToday)).toBe(3);
    expect(calculateLongestStreak(dates)).toBe(3);
  });

  it("Overall Discipline Streaks and Day Status", () => {
    const disciplineDays = ["2026-08-28", "2026-08-29", "2026-08-30"];
    const overall = calculateOverallStreaks(disciplineDays, TODAY);
    expect(overall.currentStreak).toBe(3);
    expect(overall.longestStreak).toBe(3);

    expect(getDayStatus(8, 8, false, false)).toBe("COMPLETED");
    expect(getDayStatus(5, 8, false, false)).toBe("PARTIAL");
    expect(getDayStatus(0, 8, false, false)).toBe("MISSED");
    expect(getDayStatus(0, 8, false, true)).toBe("EMPTY");
    expect(getDayStatus(0, 8, true, false)).toBe("FUTURE");
  });

  it("Completion rate helper calculation", () => {
    expect(calculateCompletionRate(6, 8)).toBe(75);
    expect(calculateCompletionRate(8, 8)).toBe(100);
    expect(calculateCompletionRate(0, 8)).toBe(0);
    expect(calculateCompletionRate(0, 0)).toBe(0);
  });
});
