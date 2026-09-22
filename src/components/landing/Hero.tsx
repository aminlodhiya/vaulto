"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import {
  Sparkles,
  ArrowRight,
  Receipt,
  Send,
  Table,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function Hero() {
  const { login } = useAuth();
  const [demoLoading, setDemoLoading] = React.useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    await login(undefined, undefined, true);
    setDemoLoading(false);
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-sky-500/15 to-emerald-500/20 blur-[100px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Product Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>The Next-Gen Telegram + Google Sheets Fintech Suite</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-normal">
            Ready to monetize
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Your personal invoicing & expense sidekick on{" "}
          <span className="bg-gradient-to-r from-sky-500 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            Telegram & Sheets.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Create client-ready branded invoices in seconds, log receipts on Telegram via AI text,
          and watch your cashflow sync in real-time with Google Sheets. Built for freelancers & modern agencies.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-semibold text-sm shadow-sm hover:shadow transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {demoLoading ? "Opening Live Demo..." : "1-Click Instant Demo"}
          </button>
        </div>

        {/* Value Prop Checkmarks */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Natural language Telegram logging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Real-time Google Sheets 2-way sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Stripe billing & PDF downloads</span>
          </div>
        </div>
      </div>
    </div>
  );
}
