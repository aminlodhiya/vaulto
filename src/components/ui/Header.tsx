"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import {
  Plus,
  Send,
  RefreshCw,
} from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenSimulator?: () => void;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, onOpenSimulator, children }: HeaderProps) {
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemoData = async () => {
    if (!confirm("Reset database to clean demo state?")) return;
    setResetting(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="bg-white dark:bg-[#0c0d0e] border-b border-zinc-200/80 dark:border-zinc-850 px-6 py-4 sticky top-0 z-30 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {children}

          {/* Reset Demo Data Pill */}
          <button
            onClick={handleResetDemoData}
            disabled={resetting}
            title="Reset database to showcase state"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? "animate-spin" : ""}`} />
            {resetSuccess ? "Reset Complete" : "Reset Data"}
          </button>

          {/* Telegram Simulator Trigger Button */}
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 font-medium text-xs transition-colors shadow-2xs"
            >
              <Send className="w-3 h-3 text-zinc-500" />
              <span>Telegram Bot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>
          )}

          {/* New Invoice Button */}
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-xs shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Invoice
          </Link>
        </div>
      </div>
    </header>
  );
}
