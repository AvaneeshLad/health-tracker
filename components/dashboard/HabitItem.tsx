"use client";

import React from "react";
import { Check, Flame, Award } from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { clsx } from "clsx";

export interface DashboardHabit {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  isCompletedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

interface HabitItemProps {
  habit: DashboardHabit;
  onToggle: (habitId: string) => void;
  disabled?: boolean;
}

export function HabitItem({ habit, onToggle, disabled }: HabitItemProps) {
  const isCompleted = habit.isCompletedToday;

  return (
    <div
      onClick={() => {
        if (!disabled) onToggle(habit.id);
      }}
      className={clsx(
        "group relative flex items-center justify-between p-3.5 sm:p-4 rounded-lg border transition-all duration-150 cursor-pointer select-none",
        isCompleted
          ? "bg-surface-secondary/70 border-success/30 hover:border-success/50"
          : "bg-surface border-border hover:border-border-strong hover:bg-surface-secondary/40",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      {/* Left side: Checkbox + Icon + Info */}
      <div className="flex items-center gap-3.5 min-w-0 pr-3">
        {/* Large Custom Checkbox */}
        <button
          type="button"
          aria-label={`Mark ${habit.name} as ${isCompleted ? "incomplete" : "complete"}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onToggle(habit.id);
          }}
          className={clsx(
            "w-7 h-7 sm:w-8 sm:h-8 rounded-md border flex items-center justify-center transition-all duration-150 shrink-0",
            isCompleted
              ? "bg-success border-success text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              : "bg-surface-elevated border-border-strong text-transparent group-hover:border-cold-400"
          )}
        >
          <Check
            className={clsx(
              "w-4 h-4 sm:w-5 sm:h-5 stroke-[3] transition-transform duration-150",
              isCompleted ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          />
        </button>

        {/* Habit Icon */}
        <div
          className={clsx(
            "w-8 h-8 rounded border flex items-center justify-center shrink-0 transition-colors hidden sm:flex",
            isCompleted
              ? "bg-surface border-success/30 text-success"
              : "bg-surface-elevated border-border text-cold-400 group-hover:text-cold-200"
          )}
        >
          <IconRenderer name={habit.icon} className="w-4 h-4" />
        </div>

        {/* Habit Name and Subtext */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={clsx(
                "text-sm sm:text-base font-semibold tracking-tight transition-colors truncate",
                isCompleted
                  ? "text-cold-200 line-through decoration-cold-500/50"
                  : "text-white"
              )}
            >
              {habit.name}
            </h3>
          </div>

          {habit.description && (
            <p className="text-xs text-cold-400 truncate mt-0.5 max-w-sm sm:max-w-md hidden xs:block">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Streak and Best info */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 font-mono">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-xs sm:text-sm font-bold">
            <Flame
              className={clsx(
                "w-3.5 h-3.5 sm:w-4 sm:h-4",
                habit.currentStreak > 0
                  ? isCompleted
                    ? "text-amber-500 fill-amber-500/20"
                    : "text-amber-600/70"
                  : "text-cold-600"
              )}
            />
            <span
              className={clsx(
                habit.currentStreak > 0 ? "text-white" : "text-cold-500"
              )}
            >
              {habit.currentStreak}
            </span>
            <span className="text-[10px] text-cold-500 hidden sm:inline">
              {habit.currentStreak === 1 ? "DAY" : "DAYS"}
            </span>
          </div>

          <div className="text-[10px] text-cold-500 tracking-tight hidden sm:block">
            BEST: {habit.longestStreak}
          </div>
        </div>
      </div>
    </div>
  );
}
