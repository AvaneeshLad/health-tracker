"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  TrendingUp,
  Flame,
  Utensils,
  Footprints,
  Moon,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { PROGRESSION_GUIDE, DAILY_CHECKLIST_ITEMS } from "@/lib/workouts/defaultWorkouts";
import { clsx } from "clsx";

interface WorkoutGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkoutGuideModal({ isOpen, onClose }: WorkoutGuideModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-surface border border-border-strong rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cold-ice/10 border border-cold-ice/30 flex items-center justify-center text-cold-ice">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-cold-400 uppercase">
                CALISTHENICS PLAYBOOK
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Progression & Fat-Loss Guide
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Daily Checklist Interactive Card */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border-strong space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-success" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Simple Daily Checklist
                </h3>
              </div>
              <span className="text-[10px] text-cold-400">
                {Object.values(checkedItems).filter(Boolean).length} / {DAILY_CHECKLIST_ITEMS.length} completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {DAILY_CHECKLIST_ITEMS.map((item, idx) => {
                const isChecked = Boolean(checkedItems[idx]);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(idx)}
                    className={clsx(
                      "p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5",
                      isChecked
                        ? "bg-success/10 border-success/40 text-success-text"
                        : "bg-surface border-border text-cold-300 hover:border-cold-500 hover:text-white"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors",
                        isChecked ? "bg-success border-success text-black" : "border-cold-500"
                      )}
                    >
                      {isChecked && <CheckSquare className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <span className={clsx("font-medium", isChecked && "line-through opacity-90")}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guide Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Progressive Overload */}
            <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-2">
              <div className="flex items-center gap-2 text-cold-ice">
                <TrendingUp className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Progressive Overload
                </h4>
              </div>
              <p className="text-xs text-cold-300 leading-relaxed">
                {PROGRESSION_GUIDE.progressiveOverload}
              </p>
              <div className="p-2 rounded bg-surface border border-border text-[11px] text-cold-400 font-mono">
                Standard Push-up → Decline → Archer → Pseudo Planche
              </div>
            </div>

            {/* Fat Loss Truth */}
            <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Flame className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Fat Loss Mechanics
                </h4>
              </div>
              <p className="text-xs text-cold-300 leading-relaxed">
                {PROGRESSION_GUIDE.fatLoss}
              </p>
            </div>

            {/* Protein Target */}
            <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Utensils className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Daily Protein Target
                </h4>
              </div>
              <p className="text-xs text-cold-300 leading-relaxed">
                {PROGRESSION_GUIDE.protein}
              </p>
            </div>

            {/* Daily Steps */}
            <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-2">
              <div className="flex items-center gap-2 text-sky-400">
                <Footprints className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Steps & NEAT Activity
                </h4>
              </div>
              <p className="text-xs text-cold-300 leading-relaxed">
                {PROGRESSION_GUIDE.walking}
              </p>
            </div>

            {/* Sleep & Recovery */}
            <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Moon className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Sleep & Recovery
                </h4>
              </div>
              <p className="text-xs text-cold-300 leading-relaxed">
                {PROGRESSION_GUIDE.sleep}
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Progress Tracking
                </h4>
              </div>
              <p className="text-xs text-cold-300 leading-relaxed">
                {PROGRESSION_GUIDE.tracking}
              </p>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Home Safety Rule
              </h5>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {PROGRESSION_GUIDE.safety}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white hover:bg-cold-200 text-black text-xs font-bold uppercase tracking-wider transition-colors"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
