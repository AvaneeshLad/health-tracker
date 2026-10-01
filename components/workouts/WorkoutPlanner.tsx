"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dumbbell,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Search,
  Timer,
  BookOpen,
  Info,
  Calendar,
  Flame,
  CheckSquare,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Pencil,
  X,
} from "lucide-react";
import {
  DayWorkout,
  Exercise,
  DEFAULT_WEEKLY_WORKOUTS,
  PROGRAM_INFO,
  WorkoutProgramInfo,
} from "@/lib/workouts/defaultWorkouts";
import { ExerciseModal } from "./ExerciseModal";
import { RestTimer } from "./RestTimer";
import { WorkoutGuideModal } from "./WorkoutGuideModal";
import { clsx } from "clsx";

const LOCAL_STORAGE_KEY = "winter_arc_workout_plan_v2";
const PROGRAM_INFO_STORAGE_KEY = "winter_arc_program_info_v2";

const CATEGORY_COLORS: Record<Exercise["category"], { text: string; bg: string; border: string }> = {
  push: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  pull: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30" },
  legs: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  core: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
  fullbody: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  conditioning: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  recovery: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  other: { text: "text-cold-300", bg: "bg-surface", border: "border-border" },
};

export function WorkoutPlanner() {
  const [workouts, setWorkouts] = useState<DayWorkout[]>(DEFAULT_WEEKLY_WORKOUTS);
  const [programInfo, setProgramInfo] = useState<WorkoutProgramInfo>(PROGRAM_INFO);
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
  const [editGoal, setEditGoal] = useState<string>(PROGRAM_INFO.goal);
  const [editStats, setEditStats] = useState<string>(PROGRAM_INFO.stats);

  const [selectedTab, setSelectedTab] = useState<string>("monday"); // "monday" ... "sunday" or "all"
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Modals & Tools
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [modalTargetDay, setModalTargetDay] = useState<string>("monday");
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState<{ dayId: string; exercise: Exercise; index: number } | null>(null);

  // Determine current day of the week
  const todayDayId = useMemo(() => {
    const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDayIndex = new Date().getDay();
    return daysMap[currentDayIndex];
  }, []);

  // Initialize and select current day by default
  useEffect(() => {
    try {
      const savedWorkouts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedWorkouts) {
        const parsed = JSON.parse(savedWorkouts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWorkouts(parsed);
        }
      }

      const savedInfo = localStorage.getItem(PROGRAM_INFO_STORAGE_KEY);
      if (savedInfo) {
        const parsedInfo = JSON.parse(savedInfo);
        if (parsedInfo && typeof parsedInfo === "object") {
          setProgramInfo(parsedInfo);
          setEditGoal(parsedInfo.goal || PROGRAM_INFO.goal);
          setEditStats(parsedInfo.stats || PROGRAM_INFO.stats);
        }
      }
    } catch (e) {
      console.warn("Could not load workout plan from localStorage", e);
    }
    // Set initial tab to today
    if (todayDayId) {
      setSelectedTab(todayDayId);
    }
  }, [todayDayId]);

  // Persist workouts to localStorage
  const saveWorkouts = (updated: DayWorkout[]) => {
    setWorkouts(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save workouts to localStorage", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleSaveDescription = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WorkoutProgramInfo = {
      ...programInfo,
      goal: editGoal.trim() || PROGRAM_INFO.goal,
      stats: editStats.trim() || PROGRAM_INFO.stats,
    };
    setProgramInfo(updated);
    try {
      localStorage.setItem(PROGRAM_INFO_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save description", err);
    }
    setIsEditingDescription(false);
    showToast("Workout description updated!");
  };

  // Add or Update exercise
  const handleSaveExercise = (dayId: string, exercise: Exercise) => {
    const updated = workouts.map((day) => {
      if (day.id !== dayId) {
        // If moving exercise from one day to another in edit mode
        return {
          ...day,
          exercises: day.exercises.filter((ex) => ex.id !== exercise.id),
        };
      }

      const existingIndex = day.exercises.findIndex((ex) => ex.id === exercise.id);
      if (existingIndex >= 0) {
        // Edit existing
        const newExercises = [...day.exercises];
        newExercises[existingIndex] = exercise;
        return { ...day, exercises: newExercises };
      } else {
        // Add new
        return { ...day, exercises: [...day.exercises, exercise] };
      }
    });

    saveWorkouts(updated);
    showToast(editingExercise ? `Updated "${exercise.name}"` : `Added "${exercise.name}" to ${dayId}`);
    setEditingExercise(null);
  };

  // Delete exercise
  const handleDeleteExercise = (dayId: string, exerciseId: string) => {
    const day = workouts.find((d) => d.id === dayId);
    const exerciseIndex = day?.exercises.findIndex((ex) => ex.id === exerciseId) ?? -1;
    const exerciseToDelete = day?.exercises[exerciseIndex];

    if (!exerciseToDelete) return;

    const updated = workouts.map((d) => {
      if (d.id !== dayId) return d;
      return {
        ...d,
        exercises: d.exercises.filter((ex) => ex.id !== exerciseId),
      };
    });

    saveWorkouts(updated);
    setRecentlyDeleted({ dayId, exercise: exerciseToDelete, index: exerciseIndex });
    showToast(`Removed "${exerciseToDelete.name}"`);
  };

  // Undo delete
  const handleUndoDelete = () => {
    if (!recentlyDeleted) return;
    const { dayId, exercise, index } = recentlyDeleted;

    const updated = workouts.map((d) => {
      if (d.id !== dayId) return d;
      const newExercises = [...d.exercises];
      newExercises.splice(index, 0, exercise);
      return { ...d, exercises: newExercises };
    });

    saveWorkouts(updated);
    setRecentlyDeleted(null);
    showToast(`Restored "${exercise.name}"`);
  };

  // Move exercise up or down
  const handleMoveExercise = (dayId: string, index: number, direction: "up" | "down") => {
    const day = workouts.find((d) => d.id === dayId);
    if (!day) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= day.exercises.length) return;

    const newExercises = [...day.exercises];
    const [moved] = newExercises.splice(index, 1);
    newExercises.splice(targetIndex, 0, moved);

    const updated = workouts.map((d) => (d.id === dayId ? { ...d, exercises: newExercises } : d));
    saveWorkouts(updated);
  };

  // Copy routine to clipboard
  const handleCopyRoutine = () => {
    let text = `${programInfo.title}\n${programInfo.goal}\n\n`;
    workouts.forEach((day) => {
      text += `=== ${day.dayName.toUpperCase()} — ${day.title} ===\n`;
      text += `Focus: ${day.focus}\n`;
      if (day.roundsNote) text += `Note: ${day.roundsNote}\n`;
      day.exercises.forEach((ex, idx) => {
        text += `${idx + 1}. ${ex.name} — ${ex.setsReps}${ex.target ? ` (${ex.target})` : ""}${ex.notes ? ` [${ex.notes}]` : ""}\n`;
      });
      text += "\n";
    });

    navigator.clipboard.writeText(text);
    showToast("Workout plan copied to clipboard!");
  };

  // Open modal for new exercise
  const openNewExerciseModal = (dayId?: string) => {
    setEditingExercise(null);
    setModalTargetDay(dayId || (selectedTab === "all" ? "monday" : selectedTab));
    setIsModalOpen(true);
  };

  // Open modal for editing exercise
  const openEditExerciseModal = (dayId: string, exercise: Exercise) => {
    setEditingExercise(exercise);
    setModalTargetDay(dayId);
    setIsModalOpen(true);
  };

  // Filtered exercises according to search and category
  const activeDaysToDisplay = useMemo(() => {
    if (selectedTab === "all") {
      return workouts;
    }
    return workouts.filter((d) => d.id === selectedTab);
  }, [selectedTab, workouts]);

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-surface border border-border-strong px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cold-ice shrink-0" />
          <span className="text-xs text-white font-medium">{toastMessage}</span>
          {recentlyDeleted && (
            <button
              type="button"
              onClick={handleUndoDelete}
              className="ml-2 text-xs text-cold-ice font-bold underline hover:text-cold-steel"
            >
              UNDO
            </button>
          )}
        </div>
      )}

      {/* Program Header Banner */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-surface via-surface-secondary to-surface-elevated p-6 shadow-xl relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cold-ice/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          {/* Header Content or Edit Form */}
          {isEditingDescription ? (
            <form onSubmit={handleSaveDescription} className="flex-1 space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-border">
                <span className="text-xs font-bold text-cold-ice tracking-wider uppercase flex items-center gap-2">
                  <Pencil className="w-3.5 h-3.5" />
                  <span>EDIT WORKOUT PLANNER DETAILS</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingDescription(false)}
                  className="p-1 rounded text-cold-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-cold-300 uppercase tracking-wider block mb-1">
                  Tagline / Starting Stats
                </label>
                <input
                  type="text"
                  value={editStats}
                  onChange={(e) => setEditStats(e.target.value)}
                  placeholder="Starting point: 72 kg • 165 cm • Home workouts • Sunday rest"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-white text-xs placeholder-cold-500 focus:outline-none focus:border-cold-ice"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cold-300 uppercase tracking-wider block mb-1">
                  Goal & Description
                </label>
                <textarea
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  placeholder="Lean, muscular, athletic physique & gradual fat loss..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-white text-xs placeholder-cold-500 focus:outline-none focus:border-cold-ice resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-white hover:bg-cold-200 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVE DETAILS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingDescription(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-cold-300 hover:text-white text-xs font-bold transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded bg-cold-ice/15 border border-cold-ice/30 text-cold-ice text-[11px] font-bold tracking-wider uppercase">
                  CALISTHENICS DISCIPLINE
                </span>
                <span className="text-xs text-cold-400 font-medium">
                  {programInfo.stats}
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  <Dumbbell className="w-7 h-7 text-cold-ice" />
                  <span>WORKOUT PLANNER</span>
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setEditStats(programInfo.stats);
                    setEditGoal(programInfo.goal);
                    setIsEditingDescription(true);
                  }}
                  className="p-1.5 rounded-lg bg-surface-secondary/80 hover:bg-surface-elevated border border-border hover:border-cold-ice text-cold-400 hover:text-cold-ice transition-all"
                  title="Edit description & stats"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-2 pt-0.5">
                <p className="text-xs sm:text-sm text-cold-300 max-w-2xl leading-relaxed">
                  {programInfo.goal}
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
            <button
              type="button"
              onClick={() => openNewExerciseModal()}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-cold-200 text-black text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ADD EXERCISE</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRestTimer(!showRestTimer)}
              className={clsx(
                "px-3.5 py-2.5 rounded-lg border text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all",
                showRestTimer
                  ? "bg-cold-ice text-black border-cold-ice"
                  : "bg-surface-secondary hover:bg-surface-elevated text-cold-300 hover:text-white border-border"
              )}
            >
              <Timer className="w-4 h-4" />
              <span>REST TIMER</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="px-3.5 py-2.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated border border-border text-cold-300 hover:text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-cold-ice" />
              <span>PLAYBOOK</span>
            </button>

            <button
              type="button"
              onClick={handleCopyRoutine}
              className="p-2.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated border border-border text-cold-400 hover:text-white transition-colors"
              title="Copy Routine to Clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* General Rule Bar */}
        <div className="mt-5 pt-4 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-cold-300">
          <div className="flex items-center gap-2 bg-surface/80 p-2.5 rounded-lg border border-border/60">
            <span className="w-2 h-2 rounded-full bg-cold-ice shrink-0" />
            <span>5 Min Dynamic Warm-up</span>
          </div>
          <div className="flex items-center gap-2 bg-surface/80 p-2.5 rounded-lg border border-border/60">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>60–90s Rest between sets</span>
          </div>
          <div className="flex items-center gap-2 bg-surface/80 p-2.5 rounded-lg border border-border/60">
            <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
            <span>1.5–2m Rest circuit rounds</span>
          </div>
          <div className="flex items-center gap-2 bg-surface/80 p-2.5 rounded-lg border border-border/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Stop on sharp joint pain</span>
          </div>
        </div>
      </div>

      {/* Embedded Rest Timer Widget if opened */}
      {showRestTimer && (
        <div className="animate-scale-in">
          <RestTimer onClose={() => setShowRestTimer(false)} inline />
        </div>
      )}

      {/* Day Selector Navigation Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {workouts.map((day) => {
              const isSelected = selectedTab === day.id;
              const isToday = todayDayId === day.id;

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedTab(day.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all uppercase whitespace-nowrap border",
                    isSelected
                      ? "bg-surface-elevated text-white border-cold-ice shadow-md"
                      : "bg-surface text-cold-400 border-border hover:bg-surface-secondary hover:text-white"
                  )}
                >
                  <span>{day.shortName}</span>
                  {isToday && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cold-ice text-black font-black uppercase">
                      TODAY
                    </span>
                  )}
                  <span className="text-[10px] text-cold-500 font-normal">
                    ({day.exercises.length})
                  </span>
                </button>
              );
            })}

            {/* All Days Tab */}
            <button
              type="button"
              onClick={() => setSelectedTab("all")}
              className={clsx(
                "flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all uppercase whitespace-nowrap border",
                selectedTab === "all"
                  ? "bg-surface-elevated text-white border-cold-ice shadow-md"
                  : "bg-surface text-cold-400 border-border hover:bg-surface-secondary hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>FULL WEEK</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cold-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-surface border border-border text-xs text-white placeholder-cold-500 focus:outline-none focus:border-cold-ice transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] text-cold-500 uppercase tracking-widest mr-1">
            FILTER:
          </span>
          {[
            { id: "all", label: "All Movements" },
            { id: "push", label: "Push" },
            { id: "pull", label: "Pull" },
            { id: "legs", label: "Legs" },
            { id: "core", label: "Core" },
            { id: "fullbody", label: "Full Body" },
            { id: "conditioning", label: "Conditioning" },
            { id: "recovery", label: "Recovery" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={clsx(
                "px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors",
                categoryFilter === cat.id
                  ? "bg-white text-black border-white font-bold"
                  : "bg-surface-secondary/70 text-cold-400 border-border hover:text-white hover:border-cold-500"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Day Cards Content */}
      <div className="space-y-6">
        {activeDaysToDisplay.map((day) => {
          // Filter exercises according to search and category
          const exercisesToShow = day.exercises.filter((ex) => {
            const matchesSearch =
              !searchQuery.trim() ||
              ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (ex.target && ex.target.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (ex.notes && ex.notes.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory =
              categoryFilter === "all" || ex.category === categoryFilter;
            return matchesSearch && matchesCategory;
          });

          const isToday = todayDayId === day.id;

          return (
            <div
              key={day.id}
              className={clsx(
                "rounded-xl border bg-surface overflow-hidden transition-all shadow-md",
                isToday ? "border-cold-ice/60 ring-1 ring-cold-ice/30" : "border-border"
              )}
            >
              {/* Day Card Header */}
              <div className="p-5 border-b border-border/80 bg-surface-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase text-cold-ice tracking-wider">
                      {day.dayName}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded bg-cold-ice text-black text-[10px] font-black uppercase tracking-widest">
                        TODAY'S WORKOUT
                      </span>
                    )}
                    <span className="text-xs text-cold-400 font-mono">
                      • {day.exercises.length} movements
                    </span>
                  </div>

                  <h2 className="text-lg font-black font-mono text-white mt-0.5 flex items-center gap-2">
                    <span>{day.title}</span>
                  </h2>

                  <p className="text-xs text-cold-300 mt-0.5">
                    <span className="text-cold-500 uppercase tracking-wider text-[11px] font-bold mr-1.5">
                      FOCUS:
                    </span>
                    {day.focus}
                  </p>
                </div>

                {/* Day Action */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openNewExerciseModal(day.id)}
                    className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated border border-border text-cold-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-cold-ice" />
                    <span>ADD MOVEMENT</span>
                  </button>
                </div>
              </div>

              {/* Special Notes (e.g. rounds note or cooldown) */}
              {(day.roundsNote || day.cooldownNote) && (
                <div className="px-5 py-3 bg-surface-secondary/30 border-b border-border/60 text-xs text-cold-300 space-y-1">
                  {day.roundsNote && (
                    <div className="flex items-center gap-2 text-amber-300 font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{day.roundsNote}</span>
                    </div>
                  )}
                  {day.cooldownNote && (
                    <div className="flex items-center gap-2 text-teal-300 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>{day.cooldownNote}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Exercises List */}
              <div className="p-4 sm:p-5 space-y-2.5">
                {exercisesToShow.length > 0 ? (
                  exercisesToShow.map((ex, idx) => {
                    const categoryStyle =
                      CATEGORY_COLORS[ex.category] || CATEGORY_COLORS.other;

                    return (
                      <div
                        key={ex.id}
                        className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border hover:border-border-strong transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        {/* Left: Exercise details */}
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-bold text-cold-400 shrink-0 mt-0.5 sm:mt-0">
                            {idx + 1}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-white group-hover:text-cold-ice transition-colors">
                                {ex.name}
                              </span>

                              <span
                                className={clsx(
                                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                  categoryStyle.text,
                                  categoryStyle.bg,
                                  categoryStyle.border
                                )}
                              >
                                {ex.category}
                              </span>

                              {ex.isOptional && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-surface border border-border text-cold-400">
                                  OPTIONAL
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs flex-wrap">
                              <span className="text-cold-ice font-bold bg-cold-ice/10 px-2 py-0.5 rounded border border-cold-ice/20">
                                {ex.setsReps}
                              </span>

                              {ex.target && (
                                <span className="text-cold-400">
                                  Target: <span className="text-cold-300 font-medium">{ex.target}</span>
                                </span>
                              )}
                            </div>

                            {ex.notes && (
                              <p className="text-[11px] text-cold-400 italic">
                                {ex.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1 sm:opacity-90 group-hover:opacity-100 self-end sm:self-center">
                          {/* Move up */}
                          <button
                            type="button"
                            onClick={() => handleMoveExercise(day.id, idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-surface text-cold-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move down */}
                          <button
                            type="button"
                            onClick={() => handleMoveExercise(day.id, idx, "down")}
                            disabled={idx === day.exercises.length - 1}
                            className="p-1.5 rounded hover:bg-surface text-cold-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditExerciseModal(day.id, ex)}
                            className="p-1.5 rounded hover:bg-surface text-cold-400 hover:text-cold-ice transition-colors"
                            title="Edit exercise"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(day.id, ex.id)}
                            className="p-1.5 rounded hover:bg-danger/20 text-cold-400 hover:text-danger-text transition-colors"
                            title="Delete exercise"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Empty state for day */
                  <div className="p-8 text-center border border-dashed border-border rounded-xl bg-surface-secondary/30 space-y-3">
                    <p className="text-xs text-cold-400 font-mono">
                      {searchQuery || categoryFilter !== "all"
                        ? "No exercises matched your search criteria for this day."
                        : "No exercises registered for this day yet."}
                    </p>
                    <button
                      type="button"
                      onClick={() => openNewExerciseModal(day.id)}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-cold-200 text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD FIRST EXERCISE</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ExerciseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExercise(null);
        }}
        onSave={handleSaveExercise}
        days={workouts}
        initialDayId={modalTargetDay}
        exerciseToEdit={editingExercise}
      />

      <WorkoutGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
