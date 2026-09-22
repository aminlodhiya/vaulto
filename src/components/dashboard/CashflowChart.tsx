"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CashflowChartProps {
  data: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  currency?: string;
}

export function CashflowChart({ data, currency = "USD" }: CashflowChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-zinc-400 font-mono">
        No financial records found.
      </div>
    );
  }

  return (
    <div className="w-full h-80 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27272a" opacity={0.3} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const rev = Number(payload[0]?.value) || 0;
                const exp = Number(payload[1]?.value) || 0;
                return (
                  <div className="bg-[#090d16] border border-blue-900/60 p-3 rounded-lg shadow-xl text-xs text-white space-y-1 font-mono">
                    <p className="font-bold text-zinc-300 border-b border-zinc-800 pb-1">{label}</p>
                    <p className="text-blue-400 font-semibold">
                      Revenue: {formatCurrency(rev, currency)}
                    </p>
                    <p className="text-zinc-400">
                      Expenses: {formatCurrency(exp, currency)}
                    </p>
                    <p className="text-blue-300 pt-0.5 border-t border-zinc-800 font-bold">
                      Net Cashflow: {formatCurrency(rev - exp, currency)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: "12px", fontSize: "11px", fontFamily: "monospace" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue (Paid)"
            stroke="#2563eb"
            strokeWidth={2}
            fill="#2563eb"
            fillOpacity={0.12}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="#64748b"
            fillOpacity={0.05}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
