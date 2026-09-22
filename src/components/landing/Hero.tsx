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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Vaulto OS 2.0</span>
          <span className="text-zinc-400 dark:text-zinc-600">/</span>
          <span className="text-zinc-500">Telegram & Google Sheets Invoicing Engine</span>
        </div>

        {/* Main Clean Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Financial operating system for modern solo operators.
        </h1>

        {/* Crisp Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Create bespoke client-ready invoices, log receipts effortlessly via Telegram AI text, and synchronize your complete cashflow in real-time with Google Sheets.
        </p>

        {/* High-Contrast Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-xs shadow-sm transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-medium text-xs transition-all shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {demoLoading ? "Opening Demo..." : "Instant Interactive Demo"}
          </button>
        </div>

        {/* Key Attributes */}
        <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Zero manual bookkeeping</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>2-Way Google Sheets sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Vector-sharp PDF export</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Stripe billing ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
