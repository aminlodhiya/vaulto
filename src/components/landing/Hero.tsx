"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { ArrowRight, Check, Shield, Zap, Terminal, Sparkles } from "lucide-react";

export function Hero() {
  const { login } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    await login(undefined, undefined, true);
    setDemoLoading(false);
  };

  return (
    <div className="relative pt-16 pb-24 md:pt-28 md:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Release Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-xs font-mono mb-8 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span className="font-semibold">Vaulto OS 2.0</span>
          <span className="text-blue-300 dark:text-blue-700">/</span>
          <span className="text-blue-700 dark:text-blue-300 font-sans">Telegram & Google Sheets Invoicing Engine</span>
        </div>

        {/* Main Clean Editorial Headline with Blue Accent */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Financial operating system for{" "}
          <span className="text-blue-600 dark:text-blue-400">modern solo operators.</span>
        </h1>

        {/* Crisp Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Create bespoke client-ready invoices, log receipts effortlessly via Telegram AI text, and synchronize your complete cashflow in real-time with Google Sheets.
        </p>

        {/* High-Contrast Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-600/25 transition-all active:scale-[0.98]"
          >
            Start Free Trial
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-zinc-900 hover:bg-blue-50/50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-800 font-medium text-xs transition-all shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {demoLoading ? "Opening Demo..." : "Instant Interactive Demo"}
          </button>
        </div>

        {/* Key Attributes */}
        <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">Zero manual bookkeeping</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">2-Way Google Sheets sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">Vector-sharp PDF export</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">Stripe billing ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
