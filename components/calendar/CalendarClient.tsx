"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, CheckCircle2 } from "lucide-react";
import { CalendarDayCell } from "./CalendarDayCell";
import { DayDetailModal } from "./DayDetailModal";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { getCalendarMonthData, getHeatmapData } from "@/lib/actions/calendar";
import { clsx } from "clsx";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface CalendarClientProps {
  initialMonthData: any;
  initialHeatmapData: any;
}

export function CalendarClient({
  initialMonthData,
  initialHeatmapData,
}: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [monthData, setMonthData] = useState(initialMonthData);
  const [heatmapData, setHeatmapData] = useState(initialHeatmapData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMonth = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const data = await getCalendarMonthData(date.getFullYear(), date.getMonth());
      setMonthData(data);
      const heat = await getHeatmapData(84);
      setHeatmapData(heat);
    } catch (err) {
      console.error("Failed to load month", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
    fetchMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
    fetchMonth(next);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    fetchMonth(now);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Calendar Header & Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cold-400 uppercase">
            HISTORY & CALENDAR
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-0.5">
            {monthData.monthName} {monthData.year}
          </h1>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded bg-surface border border-border hover:bg-surface-secondary text-xs text-cold-300 transition-colors uppercase tracking-wider"
          >
            TODAY
          </button>

          <div className="flex items-center rounded border border-border bg-surface">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-surface-secondary text-cold-400 hover:text-white transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-border" />
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-surface-secondary text-cold-400 hover:text-white transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="cold-card rounded-lg p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-cold-400 uppercase tracking-wider">
            MONTHLY RATE
          </span>
          <div className="text-2xl font-bold text-white mt-1">
            {monthData.monthlyRate}%
          </div>
          <span className="text-[10px] text-cold-500">
            Active days completion
          </span>
        </div>

        <div className="cold-card rounded-lg p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-cold-400 uppercase tracking-wider">
            DISCIPLINE DAYS
          </span>
          <div className="text-2xl font-bold text-success mt-1">
            {monthData.disciplineDaysCount}
          </div>
          <span className="text-[10px] text-cold-500">
            100% completed days
          </span>
        </div>

        <div className="cold-card rounded-lg p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] text-cold-400 uppercase tracking-wider">
            ACTIVE HABITS
          </span>
          <div className="text-2xl font-bold text-cold-ice mt-1">
            {monthData.totalActive}
          </div>
          <span className="text-[10px] text-cold-500">
            Tracking daily
          </span>
        </div>
      </div>

      {/* Main Monthly Calendar Matrix */}
      <div className="cold-card rounded-lg p-4 sm:p-6 space-y-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-cold-500 uppercase tracking-wider">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {monthData.days.map((day: any) => (
            <CalendarDayCell
              key={day.dateStr}
              day={day}
              onClick={(dStr) => setSelectedDate(dStr)}
            />
          ))}
        </div>

        {/* Calendar Legend */}
        <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-[10px] text-cold-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-success/30 border border-success" />
              <span>100% COMPLETE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cold-ice/30 border border-cold-ice" />
              <span>PARTIAL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-danger/20 border border-danger/40" />
              <span>MISSED DAY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-surface/40 border border-border/40" />
              <span>FUTURE</span>
            </div>
          </div>

          <span className="text-cold-500 hidden md:inline">
            Click any past day to inspect or modify
          </span>
        </div>
      </div>

      {/* 90-Day Contribution Heatmap */}
      {heatmapData && (
        <ContributionHeatmap
          today={heatmapData.today}
          completionsMap={heatmapData.completionsMap}
          activeHabitsCount={heatmapData.activeHabitsCount}
          onSelectDay={(dStr) => setSelectedDate(dStr)}
        />
      )}

      {/* Day Detail Inspector Modal */}
      {selectedDate && (
        <DayDetailModal
          dateStr={selectedDate}
          onClose={() => setSelectedDate(null)}
          onDataChanged={() => fetchMonth(currentDate)}
        />
      )}
    </div>
  );
}
