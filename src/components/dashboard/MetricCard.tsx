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
  badge,
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-[#0c0d0e] p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold font-mono text-zinc-950 dark:text-white tracking-tight">
          {value}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          {change && (
            <span
              className={cn(
                "text-[10px] font-mono px-1.5 py-0.2 rounded font-medium",
                isPositive
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
              )}
            >
              {change}
            </span>
          )}

          {subValue && (
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {subValue}
            </span>
          )}

          {badge && (
            <span className="text-[9px] font-mono ml-auto px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
