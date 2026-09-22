import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky";
  badge?: string;
}

export function MetricCard({
  title,
  value,
  subValue,
  change,
  isPositive,
  icon: Icon,
  color = "indigo",
  badge,
}: MetricCardProps) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/50",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/50",
    },
    sky: {
      bg: "bg-sky-50 dark:bg-sky-950/40",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-100 dark:border-sky-900/50",
    },
  }[color];

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("p-2.5 rounded-xl border", colorMap.bg, colorMap.border, colorMap.text)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">
          {value}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          {change && (
            <span
              className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded",
                isPositive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              )}
            >
              {change}
            </span>
          )}

          {subValue && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {subValue}
            </span>
          )}

          {badge && (
            <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
