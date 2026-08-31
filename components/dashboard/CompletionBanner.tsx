"use client";

import React from "react";
import { CheckCircle2, Flame } from "lucide-react";

interface CompletionBannerProps {
  overallStreak: number;
}

export function CompletionBanner({ overallStreak }: CompletionBannerProps) {
  return (
    <div className="rounded-lg border border-success/40 bg-gradient-to-r from-success/10 via-surface to-success/5 p-4 sm:p-5 flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-success/20 border border-success/30 flex items-center justify-center text-success shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold tracking-wider text-white uppercase">
            DAY COMPLETE
          </h3>
          <p className="text-xs text-cold-300 font-mono mt-0.5">
            You kept the promise. Consistency compounded today.
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-surface border border-border shrink-0">
        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        <span className="font-mono text-xs text-white font-bold">
          {overallStreak} DAYS UNBROKEN
        </span>
      </div>
    </div>
  );
}
