"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { ICON_OPTIONS, IconRenderer } from "@/components/ui/IconRenderer";
import { createHabit, updateHabit } from "@/lib/actions/habits";
import { clsx } from "clsx";

const CATEGORIES = [
  { id: "discipline", label: "Discipline" },
  { id: "mindset", label: "Mindset" },
  { id: "fitness", label: "Fitness" },
  { id: "health", label: "Health" },
  { id: "routine", label: "Routine" },
];

interface HabitFormModalProps {
  habitToEdit?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function HabitFormModal({
  habitToEdit,
  onClose,
  onSuccess,
}: HabitFormModalProps) {
  const isEditing = Boolean(habitToEdit);

  const [name, setName] = useState(habitToEdit?.name || "");
  const [description, setDescription] = useState(habitToEdit?.description || "");
  const [icon, setIcon] = useState(habitToEdit?.icon || "flame");
  const [category, setCategory] = useState(habitToEdit?.category || "discipline");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Habit name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateHabit(habitToEdit.id, {
          name,
          description: description.trim() || undefined,
          icon,
          category,
        });
      } else {
        await createHabit({
          name,
          description: description.trim() || undefined,
          icon,
          category,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save habit", err);
      setError(err.message || "Failed to save habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-surface border border-border-strong rounded-lg shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-cold-400 uppercase">
              {isEditing ? "EDIT HABIT" : "NEW HABIT"}
            </span>
            <h2 className="text-lg font-bold font-mono text-white mt-0.5">
              {isEditing ? "Configure Discipline Standard" : "Establish New Discipline"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-surface-secondary text-cold-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono">
          {error && (
            <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger-text text-xs">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs text-cold-300 font-semibold uppercase tracking-wider">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wake up before 7:30 AM"
              className="w-full px-3 py-2 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs text-cold-300 font-semibold uppercase tracking-wider">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Start with discipline. No snooze button."
              className="w-full px-3 py-2 rounded bg-surface-secondary border border-border focus:border-cold-ice focus:outline-none text-white text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs text-cold-300 font-semibold uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={clsx(
                    "py-1.5 px-2 rounded border text-xs text-center transition-all",
                    category === cat.id
                      ? "bg-surface-elevated border-cold-ice text-white font-bold"
                      : "bg-surface-secondary border-border text-cold-400 hover:text-cold-200"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-1.5">
            <label className="text-xs text-cold-300 font-semibold uppercase tracking-wider">
              Icon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-36 overflow-y-auto p-1 bg-surface-secondary rounded border border-border">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIcon(opt.id)}
                  title={opt.label}
                  className={clsx(
                    "aspect-square rounded flex items-center justify-center border transition-all",
                    icon === opt.id
                      ? "bg-cold-ice/20 border-cold-ice text-cold-ice shadow-[0_0_8px_rgba(56,189,248,0.25)]"
                      : "bg-surface border-transparent text-cold-400 hover:text-white hover:bg-surface-elevated"
                  )}
                >
                  <opt.Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-surface border border-border hover:bg-surface-secondary text-cold-300 text-xs uppercase tracking-wider"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-white hover:bg-cold-100 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? "SAVING..." : isEditing ? "SAVE CHANGES" : "CREATE HABIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
