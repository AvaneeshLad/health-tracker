"use client";

import React, { useState } from "react";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Power,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { HabitFormModal } from "./HabitFormModal";
import {
  toggleHabitActive,
  deleteHabit,
  reorderHabits,
} from "@/lib/actions/habits";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface HabitItemData {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
}

interface HabitManagerProps {
  initialHabits: HabitItemData[];
}

export function HabitManager({ initialHabits }: HabitManagerProps) {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitItemData[]>(initialHabits);
  const [editingHabit, setEditingHabit] = useState<HabitItemData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeHabits = habits.filter((h) => h.isActive);
  const inactiveHabits = habits.filter((h) => !h.isActive);

  const handleToggleActive = async (id: string) => {
    try {
      await toggleHabitActive(id);
      router.refresh();
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, isActive: !h.isActive } : h))
      );
    } catch (err) {
      console.error("Failed to toggle active", err);
    }
  };

  const handlePermanentDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${name}"? This action cannot be undone and will delete all completion history for this habit.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteHabit(id, true);
      router.refresh();
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Failed to permanently delete habit", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeHabits.length) return;

    const reordered = [...activeHabits];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update local state
    setHabits([...reordered, ...inactiveHabits]);

    try {
      await reorderHabits(reordered.map((h) => h.id));
      router.refresh();
    } catch (err) {
      console.error("Failed to reorder", err);
    }
  };

  return (
    <div className="space-y-6 font-mono animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cold-400 uppercase">
            HABIT CONFIGURATION
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-0.5">
            MANAGE DISCIPLINE SYSTEM
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-white hover:bg-cold-200 text-black font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD HABIT</span>
          </button>
        </div>
      </div>

      {/* Active Habits Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-cold-400 uppercase tracking-widest">
            ACTIVE HABITS ({activeHabits.length})
          </h2>
          <span className="text-[11px] text-cold-500">
            Included in daily discipline tracking
          </span>
        </div>

        {activeHabits.length > 0 ? (
          <div className="space-y-2">
            {activeHabits.map((habit, index) => (
              <div
                key={habit.id}
                className="cold-card rounded-lg p-3.5 sm:p-4 flex items-center justify-between gap-3 group"
              >
                {/* Left: Icon + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-surface-secondary border border-border flex items-center justify-center text-cold-ice shrink-0">
                    <IconRenderer name={habit.icon} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-semibold text-white truncate">
                        {habit.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-secondary border border-border text-cold-400 hidden xs:inline">
                        {habit.category}
                      </span>
                    </div>

                    {habit.description && (
                      <p className="text-xs text-cold-400 truncate max-w-sm sm:max-w-md mt-0.5">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Stats + Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Streak stats */}
                  <div className="text-right hidden sm:block mr-2">
                    <div className="flex items-center justify-end gap-1 text-xs font-bold text-white">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{habit.currentStreak}d</span>
                    </div>
                    <div className="text-[10px] text-cold-500">
                      Best: {habit.longestStreak}d
                    </div>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-border rounded bg-surface-secondary/50">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1.5 hover:bg-surface-elevated text-cold-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-3 bg-border" />
                    <button
                      type="button"
                      disabled={index === activeHabits.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1.5 hover:bg-surface-elevated text-cold-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingHabit(habit)}
                    className="p-2 rounded hover:bg-surface-secondary text-cold-400 hover:text-cold-ice transition-colors"
                    title="Edit Habit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Deactivate Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(habit.id)}
                    className="p-2 rounded hover:bg-surface-secondary text-cold-400 hover:text-amber-400 transition-colors"
                    title="Deactivate Habit"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-border border-dashed rounded-lg text-center bg-surface/30 space-y-3">
            <p className="text-xs text-cold-400">
              No active habits. Click "ADD HABIT" to create one.
            </p>
          </div>
        )}
      </div>

      {/* Inactive / Deactivated Habits Section */}
      {inactiveHabits.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-cold-500 uppercase tracking-widest">
              INACTIVE / ARCHIVED ({inactiveHabits.length})
            </h2>
            <span className="text-[11px] text-cold-600">
              Deactivated habits can be reactivated or permanently deleted
            </span>
          </div>

          <div className="space-y-2">
            {inactiveHabits.map((habit) => (
              <div
                key={habit.id}
                className="cold-card rounded-lg p-3.5 flex items-center justify-between gap-3 bg-surface/30 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-surface-secondary border border-border flex items-center justify-center text-cold-600 shrink-0">
                    <IconRenderer name={habit.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-cold-400 truncate block line-through">
                      {habit.name}
                    </span>
                    <span className="text-[10px] text-cold-600">
                      {habit.totalCompletions} total completions
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(habit.id)}
                    className="px-2.5 py-1.5 rounded bg-surface-secondary border border-border hover:border-success text-xs text-cold-300 hover:text-success transition-colors uppercase tracking-wider"
                    title="Reactivate Habit"
                  >
                    Reactivate
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === habit.id}
                    onClick={() => handlePermanentDelete(habit.id, habit.name)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-danger/10 border border-danger/20 hover:bg-danger/20 hover:border-danger/40 text-xs text-danger-text transition-colors uppercase tracking-wider disabled:opacity-50"
                    title="Permanently Delete Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === habit.id ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Habit Create / Edit Modal */}
      {(isCreating || editingHabit) && (
        <HabitFormModal
          habitToEdit={editingHabit}
          onClose={() => {
            setIsCreating(false);
            setEditingHabit(null);
          }}
          onSuccess={() => {
            router.refresh();
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
