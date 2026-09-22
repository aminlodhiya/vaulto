"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ExpenseCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ExpenseCategoryChartProps {
  data: {
    category: ExpenseCategory;
    amount: number;
    count: number;
    percentage: number;
  }[];
  currency?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  software: "#18181b",
  travel: "#3f3f46",
  meals: "#71717a",
  office: "#a1a1aa",
  marketing: "#047857",
  contractor: "#52525b",
  utilities: "#27272a",
  other: "#d4d4d8",
};

export function ExpenseCategoryChart({ data, currency = "USD" }: ExpenseCategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-zinc-400 font-mono">
        No expense records found.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.category.charAt(0).toUpperCase() + d.category.slice(1),
    value: d.amount,
    percentage: d.percentage,
    color: CATEGORY_COLORS[d.category] || "#52525b",
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={1}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-zinc-950 border border-zinc-700 p-2.5 rounded-lg shadow-md text-xs text-white font-mono space-y-0.5">
                    <p className="font-bold flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </p>
                    <p className="text-zinc-300">
                      {formatCurrency(Number(item.value), currency)} ({item.percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            iconType="circle"
            wrapperStyle={{ paddingTop: "10px", fontSize: "10px", fontFamily: "monospace" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
