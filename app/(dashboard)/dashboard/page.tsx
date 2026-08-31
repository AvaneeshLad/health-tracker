import React from "react";
import { getTodayDashboardData } from "@/lib/actions/habits";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const revalidate = 0; // Dynamic data

export default async function DashboardPage() {
  const initialData = await getTodayDashboardData();

  return <DashboardClient initialData={initialData} />;
}
