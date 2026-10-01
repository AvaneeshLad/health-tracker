import { describe, it, expect } from "vitest";
import { DEFAULT_WEEKLY_WORKOUTS, PROGRAM_INFO, PROGRESSION_GUIDE } from "@/lib/workouts/defaultWorkouts";

describe("Workout Planner Data", () => {
  it("should contain all 7 days of the week", () => {
    expect(DEFAULT_WEEKLY_WORKOUTS).toHaveLength(7);
    const dayIds = DEFAULT_WEEKLY_WORKOUTS.map((d) => d.id);
    expect(dayIds).toEqual([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]);
  });

  it("should contain correct focus for Monday Push + Core", () => {
    const monday = DEFAULT_WEEKLY_WORKOUTS.find((d) => d.id === "monday");
    expect(monday).toBeDefined();
    expect(monday?.title).toBe("Push + Core");
    expect(monday?.focus).toContain("Chest, shoulders, triceps, abs");
    expect(monday?.exercises.length).toBeGreaterThanOrEqual(7);
  });

  it("should contain Saturday full body calisthenics circuit", () => {
    const saturday = DEFAULT_WEEKLY_WORKOUTS.find((d) => d.id === "saturday");
    expect(saturday).toBeDefined();
    expect(saturday?.title).toBe("Full Body Calisthenics");
    expect(saturday?.roundsNote).toContain("4 rounds");
    expect(saturday?.exercises.some((e) => e.name.toLowerCase().includes("push-up"))).toBe(true);
    expect(saturday?.exercises.some((e) => e.name.toLowerCase().includes("squat"))).toBe(true);
  });

  it("should include progression guide rules", () => {
    expect(PROGRESSION_GUIDE.progressiveOverload).toBeDefined();
    expect(PROGRESSION_GUIDE.protein).toContain("100–130 g");
  });
});
