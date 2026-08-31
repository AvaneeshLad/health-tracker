"use client";

import React from "react";
import { formatShortDate, parseDateString, addDaysToString } from "@/lib/dates";
import { clsx } from "clsx";

interface ContributionHeatmapProps {
  today: string;
  completionsMap: Record<string, number>;
  activeHabitsCount: number;
  onSelectDay: (dateStr: string) => void;
}

export function ContributionHeatmap({
  today,
  completionsMap,
  activeHabitsCount,
  onSelectDay,
}: ContributionHeatmapProps) {
  // Generate past 84 days (12 weeks) ending today
  const totalDays = 84;
  const days: { dateStr: string; count: number; percentage: number }[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const dStr = addDaysToString(today, -i);
    const count = completionsMap[dStr] || 0;
    const percentage =
      activeHabitsCount > 0
        ? Math.min(100, Math.round((count / activeHabitsCount) * 100))
        : 0;

    days.push({
      dateStr: dStr,
      count,
      percentage,
    });
  }

  const getCellColor = (percentage: number, count: number) => {
    if (count === 0) return "bg-surface-secondary border-border/50 hover:border-cold-400";
    if (percentage >= 100)
      return "bg-success border-success/60 shadow-[0_0_6px_rgba(16,185,129,0.3)]";
    if (percentage >= 75) return "bg-cold-ice/80 border-cold-ice";
    if (percentage >= 50) return "bg-cold-400/60 border-cold-400";
    return "bg-cold-600/40 border-cold-600";
  };

  return (
    <div className="cold-card rounded-lg p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-cold-400 font-bold">
            DISCIPLINE HEATMAP
          </h3>
          <p className="text-[11px] text-cold-500 mt-0.5">
            Consistency over the last 12 weeks
          </p>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-cold-500">
          <span>0%</span>
          <div className="w-3 h-3 rounded-sm bg-surface-secondary border border-border" />
          <div className="w-3 h-3 rounded-sm bg-cold-600/40 border border-cold-600" />
          <div className="w-3 h-3 rounded-sm bg-cold-400/60 border border-cold-400" />
          <div className="w-3 h-3 rounded-sm bg-cold-ice/80 border border-cold-ice" />
          <div className="w-3 h-3 rounded-sm bg-success border border-success" />
          <span>100%</span>
        </div>
      </div>

      {/* Grid container with horizontal scroll for smaller screens */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[560px]">
          {days.map((day) => (
            <button
              key={day.dateStr}
              type="button"
              title={`${formatShortDate(day.dateStr)}: ${day.count}/${activeHabitsCount} (${day.percentage}%)`}
              onClick={() => onSelectDay(day.dateStr)}
              className={clsx(
                "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border transition-all duration-100 cursor-pointer hover:scale-125 hover:z-10",
                getCellColor(day.percentage, day.count),
                day.dateStr === today && "ring-1 ring-white"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
