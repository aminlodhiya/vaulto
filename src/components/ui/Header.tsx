"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import {
  Bell,
  Search,
  Plus,
  Send,
  Sparkles,
  Download,
  CheckCircle2,
  Table,
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
    if (!confirm("Reset demo data to initial rich showcase state?")) return;
    setResetting(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 sticky top-0 z-30 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {children}

          {/* Reset Demo Data Pill */}
          <button
            onClick={handleResetDemoData}
            disabled={resetting}
            title="Reset database to showcase demo data"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin text-indigo-500" : ""}`} />
            {resetSuccess ? "Reset Done!" : "Reset Demo Data"}
          </button>

          {/* Telegram Simulator Trigger Button */}
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 font-medium text-xs transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span>Telegram Quick-Log</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          {/* New Invoice Button */}
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Invoice
          </Link>
        </div>
      </div>
    </header>
  );
}
