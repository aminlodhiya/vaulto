"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CashflowChart } from "@/components/dashboard/CashflowChart";
import { ExpenseCategoryChart } from "@/components/dashboard/ExpenseCategoryChart";
import { RecentInvoicesTable } from "@/components/dashboard/RecentInvoicesTable";
import { TelegramSimulatorModal } from "@/components/ui/TelegramSimulatorModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { FinancialSummary, Invoice, Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Clock,
  Send,
  Table,
  Plus,
  ArrowUpRight,
  Sparkles,
  Download,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [invRes, expRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/expenses"),
      ]);

      const invData = await invRes.json();
      const expData = await expRes.json();

      if (invData.invoices) setInvoices(invData.invoices);
      if (expData.expenses) setExpenses(expData.expenses);
      if (expData.summary) setSummary(expData.summary);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const currency = user?.currency || "USD";

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* App Sidebar */}
      <Sidebar onOpenSimulator={() => setSimulatorOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title={`Welcome back, ${user?.name?.split(" ")[0] || "Alex"}!`}
          subtitle="Real-time financial overview, invoice tracking & cashflow analytics."
          onOpenSimulator={() => setSimulatorOpen(true)}
        >
          {/* Quick Export Button */}
          <a
            href="/api/sheets/export?type=summary"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export P&L Report
          </a>
        </Header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Top Telegram Pairing Banner if not paired */}
          {!user?.telegramConnected && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 via-indigo-950/80 to-zinc-900 border border-sky-800/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#24A1DE] flex items-center justify-center text-white shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Connect your Telegram Sidekick</h3>
                  <p className="text-xs text-sky-200">
                    Log expenses in seconds by typing natural text on Telegram. Your sync code is{" "}
                    <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
                      {user?.telegramSyncToken || "748291"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulatorOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors"
                >
                  Test Bot Live
                </button>
                <Link
                  href="/telegram"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  Setup Guide
                </Link>
              </div>
            </div>
          )}

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Total Paid Revenue"
              value={formatCurrency(summary?.totalRevenue || 0, currency)}
              subValue={`${summary?.paidInvoicesCount || 0} invoices settled`}
              change="+14.8%"
              isPositive={true}
              icon={DollarSign}
              color="indigo"
            />

            <MetricCard
              title="Outstanding Receivables"
              value={formatCurrency(summary?.outstandingRevenue || 0, currency)}
              subValue={`${summary?.unpaidInvoicesCount || 0} unpaid • ${summary?.overdueInvoicesCount || 0} overdue`}
              change={summary?.overdueInvoicesCount ? `${summary.overdueInvoicesCount} overdue` : "On track"}
              isPositive={!summary?.overdueInvoicesCount}
              icon={Clock}
              color={summary?.overdueInvoicesCount ? "rose" : "amber"}
            />

            <MetricCard
              title="Total Logged Expenses"
              value={formatCurrency(summary?.totalExpenses || 0, currency)}
              subValue={`${summary?.expensesCount || 0} transactions`}
              change="Synced with Sheets"
              isPositive={true}
              icon={Receipt}
              color="sky"
            />

            <MetricCard
              title="Net Cashflow Margin"
              value={formatCurrency(summary?.netIncome || 0, currency)}
              subValue={`Gross margin: ${
                summary?.totalRevenue && summary.totalRevenue > 0
                  ? Math.round(((summary.totalRevenue - summary.totalExpenses) / summary.totalRevenue) * 100)
                  : 0
              }%`}
              change="Healthy"
              isPositive={(summary?.netIncome || 0) >= 0}
              icon={TrendingUp}
              color="emerald"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cashflow Trend Area Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Revenue vs. Expenses Trend
                  </h3>
                  <p className="text-xs text-zinc-500">6-Month historical cashflow trajectory</p>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  Monthly View
                </span>
              </div>

              <CashflowChart data={summary?.monthlyData || []} currency={currency} />
            </div>

            {/* Expense Category Donut Chart */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Expenses by Category
                  </h3>
                  <p className="text-xs text-zinc-500">Breakdown of operational spend</p>
                </div>
                <Link
                  href="/expenses"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>

              <ExpenseCategoryChart
                data={summary?.categoryBreakdown || []}
                currency={currency}
              />
            </div>
          </div>

          {/* Recent Invoices Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Recent Invoices
                </h3>
                <p className="text-xs text-zinc-500">
                  Track payment statuses, recurring cycles, and settlement terms
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/invoices"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  All Invoices <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <RecentInvoicesTable
              invoices={invoices.slice(0, 5)}
              onInvoiceUpdated={fetchDashboardData}
            />
          </div>

          {/* Quick Actions Footer Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-zinc-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-3">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Create Branded Invoice</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Customize templates, add VAT/taxes, signatures, and recurring schedules.
                </p>
              </div>
              <Link
                href="/invoices/new"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                New Invoice Builder →
              </Link>
            </div>

            <div className="p-5 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-zinc-900 rounded-2xl border border-sky-100 dark:border-sky-900/50 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#24A1DE] text-white flex items-center justify-center mb-3">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Telegram Sidekick</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Test the real-time AI parser or pair your Telegram account in 30 seconds.
                </p>
              </div>
              <button
                onClick={() => setSimulatorOpen(true)}
                className="mt-4 text-left inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Launch Bot Simulator →
              </button>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-zinc-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <Table className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Google Sheets 2-Way Sync</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Copy our Google Apps Script template or export live CSV reports anytime.
                </p>
              </div>
              <Link
                href="/sheets"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Configure Sheets Sync →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Live Interactive Simulator Modal */}
      <TelegramSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onExpenseCreated={fetchDashboardData}
      />
    </div>
  );
}
