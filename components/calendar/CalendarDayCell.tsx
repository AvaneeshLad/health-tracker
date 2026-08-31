"use client";

import React from "react";
import { clsx } from "clsx";

interface CalendarDayCellProps {
  day: {
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFuture: boolean;
    totalHabits: number;
    completedHabits: number;
    percentage: number;
    status: "FUTURE" | "COMPLETED" | "PARTIAL" | "MISSED" | "EMPTY";
    isDisciplineDay: boolean;
  };
  onClick: (dateStr: string) => void;
}

export function CalendarDayCell({ day, onClick }: CalendarDayCellProps) {
  const { isCurrentMonth, isToday, isFuture, status, percentage, completedHabits, totalHabits } = day;

  // Determine cell background styling based on status and completion intensity
  let bgClass = "bg-surface/40 border-border/40 text-cold-600";
  let indicatorColor = "";

  if (isFuture) {
    bgClass = "bg-surface/20 border-border/30 text-cold-600 cursor-not-allowed";
  } else if (status === "COMPLETED") {
    // Solid cold success
    bgClass = "bg-success/15 border-success/40 text-white hover:border-success/60 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
    indicatorColor = "bg-success";
  } else if (status === "PARTIAL") {
    if (percentage >= 75) {
      bgClass = "bg-cold-ice/15 border-cold-ice/35 text-white hover:border-cold-ice/60";
      indicatorColor = "bg-cold-ice";
    } else {
      bgClass = "bg-surface-secondary border-border-strong text-cold-200 hover:border-cold-400";
      indicatorColor = "bg-cold-400";
    }
  } else if (status === "MISSED") {
    // Missed past day
    bgClass = "bg-danger/10 border-danger/25 text-cold-400 hover:border-danger/40";
    indicatorColor = "bg-danger/60";
  } else if (status === "EMPTY") {
    // Today with 0 completed
    bgClass = "bg-surface border-border text-cold-300 hover:border-cold-300";
  }

  return (
    <button
      type="button"
      disabled={isFuture}
      onClick={() => !isFuture && onClick(day.dateStr)}
      className={clsx(
        "relative aspect-square p-1.5 sm:p-2.5 rounded-md border flex flex-col justify-between transition-all duration-150 text-left font-mono",
        bgClass,
        !isCurrentMonth && "opacity-40",
        isToday && "ring-1 ring-cold-ice/70 font-bold",
        !isFuture && "cursor-pointer hover:scale-[1.02]"
      )}
    >
      {/* Top: Day number + Today pill */}
      <div className="flex items-center justify-between w-full">
        <span
          className={clsx(
            "text-xs sm:text-sm leading-none",
            isToday ? "text-cold-ice font-bold" : isCurrentMonth ? "text-white" : "text-cold-500"
          )}
        >
          {day.dayNumber}
        </span>

        {isToday && (
          <span className="text-[9px] uppercase tracking-tighter px-1 rounded bg-cold-ice/20 text-cold-ice border border-cold-ice/30 hidden xs:inline">
            TODAY
          </span>
        )}
      </div>

      {/* Bottom: Completion Indicator & Mini Ratio */}
      <div className="flex items-end justify-between w-full">
        {!isFuture && totalHabits > 0 ? (
          <>
            <div className="flex items-center gap-1">
              {indicatorColor && (
                <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", indicatorColor)} />
              )}
              <span className="text-[10px] text-cold-400 leading-none hidden sm:inline">
                {completedHabits}/{totalHabits}
              </span>
            </div>

            <span className="text-[10px] font-bold text-cold-300 leading-none">
              {percentage > 0 ? `${percentage}%` : ""}
            </span>
          </>
        ) : (
          <div />
        )}
      </div>
    </button>
  );
}
