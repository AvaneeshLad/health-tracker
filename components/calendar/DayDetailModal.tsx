"use client";

import React, { useEffect, useState } from "react";
import { X, Check, Flame, Lock, CheckCircle2, XCircle } from "lucide-react";
import { formatDisplayDate } from "@/lib/dates";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { getDayDetail } from "@/lib/actions/calendar";
import { toggleHabitCompletion } from "@/lib/actions/habits";
import { clsx } from "clsx";

interface DayDetailModalProps {
  dateStr: string | null;
  onClose: () => void;
  onDataChanged?: () => void;
}

export function DayDetailModal({ dateStr, onClose, onDataChanged }: DayDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!dateStr) return;

    let isMounted = true;
    setLoading(true);
    getDayDetail(dateStr)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load day details", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dateStr]);

  if (!dateStr) return null;

  const handleToggle = async (habitId: string) => {
    if (!data || !data.isEditable || togglingId) return;

    setTogglingId(habitId);

    // Optimistically update
    const prevHabits = [...data.habits];
    const updatedHabits = data.habits.map((h: any) => {
      if (h.id === habitId) {
        return { ...h, isCompleted: !h.isCompleted };
      }
      return h;
    });

    const newCompleted = updatedHabits.filter((h: any) => h.isCompleted && h.isActive).length;
    const newPercentage = data.totalHabits > 0 ? Math.round((newCompleted / data.totalHabits) * 100) : 0;

    setData((prev: any) => ({
      ...prev,
      habits: updatedHabits,
      completedHabits: newCompleted,
      percentage: newPercentage,
    }));

    try {
      await toggleHabitCompletion(habitId, dateStr);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error("Toggle error:", err);
      // rollback
      setData((prev: any) => ({
        ...prev,
        habits: prevHabits,
      }));
    } finally {
      setTogglingId(null);
    }
  };

  const formattedDate = formatDisplayDate(dateStr).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-surface border border-border-strong rounded-lg shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-cold-400 uppercase">
              DAY INSPECTOR
            </span>
            <h2 className="text-lg font-bold font-mono text-white mt-0.5">
              {formattedDate}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-surface-secondary text-cold-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-3 py-6">
              <div className="h-12 rounded bg-surface-secondary skeleton-shimmer" />
              <div className="h-12 rounded bg-surface-secondary skeleton-shimmer" />
              <div className="h-12 rounded bg-surface-secondary skeleton-shimmer" />
            </div>
          ) : data ? (
            <>
              {/* Daily Progress summary card */}
              <div className="p-4 rounded-lg bg-surface-secondary border border-border flex items-center justify-between font-mono">
                <div>
                  <span className="text-xs text-cold-400 block uppercase tracking-wider">
                    DAILY PROGRESS
                  </span>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    {data.completedHabits} / {data.totalHabits}
                    <span className="text-xs font-normal text-cold-400 ml-2">
                      COMPLETED
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={clsx(
                      "text-2xl font-bold font-mono",
                      data.percentage === 100
                        ? "text-success"
                        : data.percentage >= 50
                        ? "text-cold-ice"
                        : "text-cold-400"
                    )}
                  >
                    {data.percentage}%
                  </span>
                </div>
              </div>

              {/* Editable instruction / Lock info */}
              <div className="flex items-center justify-between text-xs font-mono text-cold-400">
                <span>TASKS BREAKDOWN</span>
                {data.isFuture ? (
                  <span className="flex items-center gap-1 text-cold-500">
                    <Lock className="w-3.5 h-3.5" /> Future Date Locked
                  </span>
                ) : (
                  <span className="text-cold-500 text-[11px]">
                    Click task to toggle completion
                  </span>
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                {data.habits.map((habit: any) => {
                  const isDone = habit.isCompleted;

                  return (
                    <button
                      key={habit.id}
                      type="button"
                      disabled={!data.isEditable}
                      onClick={() => handleToggle(habit.id)}
                      className={clsx(
                        "w-full flex items-center justify-between p-3 rounded-md border text-left transition-colors font-mono",
                        isDone
                          ? "bg-surface-elevated border-success/30 hover:border-success/50"
                          : "bg-surface border-border hover:border-border-strong",
                        !data.isEditable && "cursor-default opacity-80"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkmark or Cross Indicator */}
                        <div
                          className={clsx(
                            "w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs font-bold",
                            isDone
                              ? "bg-success text-black"
                              : "bg-surface-secondary border border-border text-cold-500"
                          )}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-xs">✕</span>}
                        </div>

                        <div className="flex items-center gap-2 min-w-0">
                          <IconRenderer name={habit.icon} className="w-3.5 h-3.5 text-cold-400 shrink-0" />
                          <span
                            className={clsx(
                              "text-xs sm:text-sm font-semibold truncate",
                              isDone ? "text-cold-200" : "text-cold-400"
                            )}
                          >
                            {habit.name}
                          </span>
                        </div>
                      </div>

                      <span
                        className={clsx(
                          "text-[10px] uppercase font-bold shrink-0 ml-2",
                          isDone ? "text-success" : "text-cold-600"
                        )}
                      >
                        {isDone ? "DONE" : "MISSED"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-xs text-cold-500 py-4 font-mono">
              Failed to load day information.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-secondary/50 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface border border-border hover:bg-surface-secondary text-cold-200 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
