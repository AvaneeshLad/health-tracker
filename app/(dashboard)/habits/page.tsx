import React from "react";
import { getAllUserHabits } from "@/lib/actions/habits";
import { HabitManager } from "@/components/habits/HabitManager";

export const revalidate = 0;

export default async function HabitsPage() {
  const habits = await getAllUserHabits();

  return <HabitManager initialHabits={habits} />;
}
