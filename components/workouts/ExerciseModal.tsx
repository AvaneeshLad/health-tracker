"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Dumbbell, Sparkles, Plus } from "lucide-react";
import { Exercise, DayWorkout } from "@/lib/workouts/defaultWorkouts";
import { clsx } from "clsx";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dayId: string, exercise: Exercise) => void;
  days: DayWorkout[];
  initialDayId?: string;
  exerciseToEdit?: Exercise | null;
}

const CATEGORIES: { id: Exercise["category"]; label: string; color: string }[] = [
  { id: "push", label: "Push", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { id: "pull", label: "Pull", color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  { id: "legs", label: "Legs", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { id: "core", label: "Core", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  { id: "fullbody", label: "Full Body", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { id: "conditioning", label: "Conditioning", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  { id: "recovery", label: "Recovery", color: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
  { id: "other", label: "Other", color: "text-cold-300 border-border bg-surface" },
];

const SET_PRESETS = [
  "4 × 8–15",
  "3 × 6–12",
  "3 × 8–12",
  "3 × 10–15",
  "4 × 15–25",
  "3 × 30–60 sec",
  "3 × 20–40 sec",
  "4 rounds circuit",
  "3 × max reps",
];

export function ExerciseModal({
  isOpen,
  onClose,
  onSave,
  days,
  initialDayId = "monday",
  exerciseToEdit,
}: ExerciseModalProps) {
  const isEditing = Boolean(exerciseToEdit);

  const [selectedDayId, setSelectedDayId] = useState<string>(initialDayId);
  const [name, setName] = useState<string>("");
  const [setsReps, setSetsReps] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [category, setCategory] = useState<Exercise["category"]>("push");
  const [notes, setNotes] = useState<string>("");
  const [isOptional, setIsOptional] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (exerciseToEdit) {
        setName(exerciseToEdit.name || "");
        setSetsReps(exerciseToEdit.setsReps || "");
        setTarget(exerciseToEdit.target || "");
        setCategory(exerciseToEdit.category || "push");
        setNotes(exerciseToEdit.notes || "");
        setIsOptional(Boolean(exerciseToEdit.isOptional));
      } else {
        setName("");
        setSetsReps("3 × 8–12");
        setTarget("");
        setCategory("push");
        setNotes("");
        setIsOptional(false);
      }
      setSelectedDayId(initialDayId);
      setError(null);
    }
  }, [isOpen, exerciseToEdit, initialDayId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Exercise name is required.");
      return;
    }
    if (!setsReps.trim()) {
      setError("Sets and reps / duration is required.");
      return;
    }

    const newExercise: Exercise = {
      id: exerciseToEdit ? exerciseToEdit.id : `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      setsReps: setsReps.trim(),
      target: target.trim() || undefined,
      category,
      notes: notes.trim() || undefined,
      isOptional,
    };

    onSave(selectedDayId, newExercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-surface border border-border-strong rounded-xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cold-ice/10 border border-cold-ice/30 flex items-center justify-center text-cold-ice">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cold-400 uppercase">
                {isEditing ? "EDIT EXERCISE" : "NEW EXERCISE"}
              </span>
              <h2 className="text-base font-bold font-mono text-white mt-0.5">
                {isEditing ? "Modify Routine Movement" : "Add Movement To Routine"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-secondary text-cold-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger-text text-xs flex items-center gap-2">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Target Day */}
          <div>
            <label className="text-xs text-cold-300 block mb-1.5 font-bold uppercase tracking-wider">
              DAY OF THE WEEK
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {days.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDayId(d.id)}
                  className={clsx(
                    "py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all",
                    selectedDayId === d.id
                      ? "bg-cold-ice text-background border-cold-ice shadow-sm"
                      : "bg-surface-secondary text-cold-400 border-border hover:text-white hover:border-cold-500"
                  )}
                >
                  {d.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Name */}
          <div>
            <label className="text-xs text-cold-300 block mb-1.5 font-bold uppercase tracking-wider">
              EXERCISE NAME *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Archer Push-ups, Pike Push-ups, Squats"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-secondary border border-border text-white placeholder-cold-500 focus:outline-none focus:border-cold-ice transition-colors text-sm"
              autoFocus
            />
          </div>

          {/* Sets & Reps / Duration */}
          <div>
            <label className="text-xs text-cold-300 block mb-1.5 font-bold uppercase tracking-wider">
              SETS & REPS / DURATION *
            </label>
            <input
              type="text"
              value={setsReps}
              onChange={(e) => setSetsReps(e.target.value)}
              placeholder="e.g. 4 × 8–15, 3 × 30–60 sec, 3 × max"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-secondary border border-border text-white placeholder-cold-500 focus:outline-none focus:border-cold-ice transition-colors text-sm"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SET_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSetsReps(p)}
                  className="text-[10px] px-2 py-1 rounded bg-surface-secondary hover:bg-surface-elevated text-cold-400 hover:text-cold-200 border border-border transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-cold-300 block mb-1.5 font-bold uppercase tracking-wider">
              CATEGORY / PATTERN
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={clsx(
                    "py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all",
                    category === c.id
                      ? `${c.color} border-current font-bold shadow-sm`
                      : "bg-surface-secondary text-cold-400 border-border hover:text-cold-200"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Muscles */}
          <div>
            <label className="text-xs text-cold-300 block mb-1.5 font-bold uppercase tracking-wider">
              TARGET MUSCLES / FOCUS (OPTIONAL)
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. Upper Chest, Deltoids, Lats, Quads, Core"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-secondary border border-border text-white placeholder-cold-500 focus:outline-none focus:border-cold-ice transition-colors text-sm"
            />
          </div>

          {/* Notes & Form Cues */}
          <div>
            <label className="text-xs text-cold-300 block mb-1.5 font-bold uppercase tracking-wider">
              NOTES & FORM CUES (OPTIONAL)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 3 sec slow tempo on descent, explode up, pause at top"
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-secondary border border-border text-white placeholder-cold-500 focus:outline-none focus:border-cold-ice transition-colors text-xs resize-none"
            />
          </div>

          {/* Optional Movement Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isOptional"
              checked={isOptional}
              onChange={(e) => setIsOptional(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-surface-secondary text-cold-ice focus:ring-cold-ice"
            />
            <label htmlFor="isOptional" className="text-xs text-cold-300 cursor-pointer select-none">
              Mark as optional (e.g. bar access required or extra bonus set)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated border border-border text-cold-300 hover:text-white text-xs font-bold transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-cold-200 text-black text-xs font-black tracking-wider uppercase flex items-center gap-2 transition-all shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? "SAVE CHANGES" : "ADD EXERCISE"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
