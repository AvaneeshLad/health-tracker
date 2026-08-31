"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CheckSquare, BarChart3, Settings } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "TODAY",
    icon: LayoutDashboard,
  },
  {
    href: "/calendar",
    label: "CALENDAR",
    icon: Calendar,
  },
  {
    href: "/habits",
    label: "HABITS",
    icon: CheckSquare,
  },
  {
    href: "/analytics",
    label: "ANALYTICS",
    icon: BarChart3,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Sub-Navigation */}
      <nav className="hidden md:flex border-b border-border/80 bg-surface/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-center gap-1 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 px-3.5 py-2 text-xs font-mono tracking-wider transition-all rounded",
                  isActive
                    ? "bg-surface-secondary text-white border border-border-strong font-semibold"
                    : "text-cold-400 hover:text-cold-200 hover:bg-surface-secondary/40"
                )}
              >
                <Icon className={clsx("w-3.5 h-3.5", isActive ? "text-cold-ice" : "text-cold-500")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border px-3 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-1 py-1 px-3 rounded text-[10px] font-mono tracking-wider transition-colors",
                  isActive
                    ? "text-cold-ice font-bold"
                    : "text-cold-400 hover:text-cold-200"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive ? "text-cold-ice" : "text-cold-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
