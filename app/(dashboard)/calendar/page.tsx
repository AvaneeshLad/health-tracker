import React from "react";
import { getCalendarMonthData, getHeatmapData } from "@/lib/actions/calendar";
import { CalendarClient } from "@/components/calendar/CalendarClient";

export const revalidate = 0;

export default async function CalendarPage() {
  const now = new Date();
  const initialMonthData = await getCalendarMonthData(now.getFullYear(), now.getMonth());
  const initialHeatmapData = await getHeatmapData(84);

  return (
    <CalendarClient
      initialMonthData={initialMonthData}
      initialHeatmapData={initialHeatmapData}
    />
  );
}
