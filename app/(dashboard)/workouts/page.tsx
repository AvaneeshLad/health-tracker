import React from "react";
import { WorkoutPlanner } from "@/components/workouts/WorkoutPlanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workout Planner | Winter Arc Calisthenics",
  description: "Day-wise home calisthenics workout planner with progressive overload schedule.",
};

export default function WorkoutsPage() {
  return <WorkoutPlanner />;
}
