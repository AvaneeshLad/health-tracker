import React from "react";
import { getAnalyticsData } from "@/lib/actions/stats";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return <AnalyticsView data={data} />;
}
