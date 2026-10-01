"use client";

import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Minus, X } from "lucide-react";
import { clsx } from "clsx";

interface RestTimerProps {
  onClose?: () => void;
  inline?: boolean;
}

export function RestTimer({ onClose, inline = false }: RestTimerProps) {
  const [duration, setDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Play audio chime using Web Audio API (cross-browser without external asset files)
  const playBeep = (isFinish: boolean = false) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (isFinish) {
        // Triple chime for finish
        [0, 0.15, 0.3].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(idx === 2 ? 880 : 587.33, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.35);
        });
      } else {
        // Single subtle tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep(true);
            return 0;
          }
          if (prev <= 4) {
            playBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, soundEnabled]);

  const handleSelectPreset = (seconds: number) => {
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const handleTogglePlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const handleAdjustTime = (delta: number) => {
    const next = Math.max(5, timeLeft + delta);
    setTimeLeft(next);
    if (!isRunning) {
      setDuration(next);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <div
      className={clsx(
        "bg-surface-secondary border border-border-strong rounded-xl p-5 shadow-2xl transition-all font-mono",
        inline ? "w-full" : "w-full max-w-md"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cold-ice/10 text-cold-ice border border-cold-ice/20">
            <Timer className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">REST INTERVAL TIMER</h3>
            <p className="text-[11px] text-cold-400">Between sets (60–90s) & rounds (1.5–2m)</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded hover:bg-surface text-cold-400 hover:text-cold-200 transition-colors"
            title={soundEnabled ? "Mute audio beep" : "Unmute audio beep"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cold-ice" /> : <VolumeX className="w-4 h-4 text-cold-500" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-surface text-cold-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="py-6 flex flex-col items-center justify-center">
        {/* Progress ring or box */}
        <div className="relative flex items-center justify-center">
          <div
            className={clsx(
              "text-5xl md:text-6xl font-extrabold tracking-tight font-mono transition-colors",
              timeLeft === 0
                ? "text-success animate-bounce"
                : timeLeft <= 5
                ? "text-amber-400 animate-pulse"
                : "text-white"
            )}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface h-2 rounded-full overflow-hidden mt-4 border border-border">
          <div
            className="bg-gradient-to-r from-cold-ice to-success h-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Quick adjustment buttons */}
        <div className="flex items-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => handleAdjustTime(-15)}
            className="px-2.5 py-1 text-xs rounded bg-surface hover:bg-surface-elevated border border-border text-cold-300 hover:text-white flex items-center gap-1 transition-all"
          >
            <Minus className="w-3 h-3" /> 15s
          </button>
          <span className="text-[11px] text-cold-500 uppercase tracking-wider">
            {isRunning ? "Active countdown" : "Paused / Ready"}
          </span>
          <button
            type="button"
            onClick={() => handleAdjustTime(15)}
            className="px-2.5 py-1 text-xs rounded bg-surface hover:bg-surface-elevated border border-border text-cold-300 hover:text-white flex items-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" /> 15s
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 pb-4">
        <button
          type="button"
          onClick={handleReset}
          className="p-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-cold-300 hover:text-white transition-all shadow-sm"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={clsx(
            "flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg",
            isRunning
              ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
              : "bg-cold-ice hover:bg-cold-steel text-background font-black"
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSE REST</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{timeLeft === 0 ? "START AGAIN" : "START REST"}</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Targets */}
      <div className="space-y-1.5 pt-3 border-t border-border/70">
        <span className="text-[10px] text-cold-400 uppercase tracking-widest block text-center">
          QUICK PRESETS
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "30s", sec: 30, desc: "Quick" },
            { label: "60s", sec: 60, desc: "Normal" },
            { label: "90s", sec: 90, desc: "Heavy" },
            { label: "120s", sec: 120, desc: "Circuit" },
          ].map((preset) => (
            <button
              key={preset.sec}
              type="button"
              onClick={() => handleSelectPreset(preset.sec)}
              className={clsx(
                "py-2 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center",
                duration === preset.sec && timeLeft > 0
                  ? "bg-cold-ice/15 border-cold-ice text-cold-ice font-bold"
                  : "bg-surface hover:bg-surface-elevated border-border text-cold-300 hover:text-white"
              )}
            >
              <span className="text-xs font-bold">{preset.label}</span>
              <span className="text-[9px] text-cold-500">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
