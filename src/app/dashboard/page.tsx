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
  Download,
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
    <div className="flex h-screen bg-[#fbfbfa] dark:bg-[#09090b] overflow-hidden">
      {/* App Sidebar */}
      <Sidebar onOpenSimulator={() => setSimulatorOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title={`Overview`}
          subtitle="Real-time financial status, invoice settlements & cashflow analytics."
          onOpenSimulator={() => setSimulatorOpen(true)}
        >
          {/* Quick Export Button */}
          <a
            href="/api/sheets/export?type=summary"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 text-xs font-medium shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            Export P&L Report
          </a>
        </Header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Top Telegram Pairing Banner if not paired */}
          {!user?.telegramConnected && (
            <div className="p-4 rounded-xl bg-zinc-900 text-white border border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-sans">Telegram Bot Pairing</h3>
                  <p className="text-[11px] text-zinc-400">
                    Log receipts in seconds by sending messages. Your 6-digit sync token is{" "}
                    <span className="font-mono font-bold bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-200">
                      {user?.telegramSyncToken || "748291"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulatorOpen(true)}
                  className="px-3 py-1.5 rounded-md bg-white text-zinc-950 font-medium text-xs transition-colors hover:bg-zinc-100"
                >
                  Test Bot Simulator
                </button>
                <Link
                  href="/telegram"
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
                >
                  Setup Guide
                </Link>
              </div>
            </div>
          )}

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Paid Revenue"
              value={formatCurrency(summary?.totalRevenue || 0, currency)}
              subValue={`${summary?.paidInvoicesCount || 0} settled`}
              change="+14.8%"
              isPositive={true}
              icon={DollarSign}
            />

            <MetricCard
              title="Outstanding"
              value={formatCurrency(summary?.outstandingRevenue || 0, currency)}
              subValue={`${summary?.unpaidInvoicesCount || 0} pending • ${summary?.overdueInvoicesCount || 0} overdue`}
              change={summary?.overdueInvoicesCount ? `${summary.overdueInvoicesCount} overdue` : "Current"}
              isPositive={!summary?.overdueInvoicesCount}
              icon={Clock}
            />

            <MetricCard
              title="Total Expenses"
              value={formatCurrency(summary?.totalExpenses || 0, currency)}
              subValue={`${summary?.expensesCount || 0} logs`}
              change="Synced"
              isPositive={true}
              icon={Receipt}
            />

            <MetricCard
              title="Net Operating Margin"
              value={formatCurrency(summary?.netIncome || 0, currency)}
              subValue={`Margin: ${
                summary?.totalRevenue && summary.totalRevenue > 0
                  ? Math.round(((summary.totalRevenue - summary.totalExpenses) / summary.totalRevenue) * 100)
                  : 0
              }%`}
              change="Healthy"
              isPositive={(summary?.netIncome || 0) >= 0}
              icon={TrendingUp}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cashflow Trend Area Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0c0d0e] p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900 dark:text-white">
                    Cashflow Trajectory (6M)
                  </h3>
                  <p className="text-[11px] text-zinc-500">Revenue vs. Expenses breakdown</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  Monthly
                </span>
              </div>

              <CashflowChart data={summary?.monthlyData || []} currency={currency} />
            </div>

            {/* Expense Category Donut Chart */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0c0d0e] p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900 dark:text-white">
                    Expense Allocation
                  </h3>
                  <p className="text-[11px] text-zinc-500">Taxonomy distribution</p>
                </div>
                <Link
                  href="/expenses"
                  className="text-xs text-zinc-900 dark:text-zinc-200 font-medium hover:underline"
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
          <div className="bg-white dark:bg-[#0c0d0e] rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900 dark:text-white">
                  Recent Invoices
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Status, recurring retainers, and settlement dates
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/invoices"
                  className="text-xs font-medium text-zinc-900 dark:text-zinc-200 hover:underline flex items-center gap-1"
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
            <div className="p-5 bg-white dark:bg-[#0c0d0e] rounded-xl border border-zinc-200/80 dark:border-zinc-850 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center mb-3">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Draft Client Invoice</h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Custom Swiss layouts, tax calculations, and recurring retainers.
                </p>
              </div>
              <Link
                href="/invoices/new"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-200 hover:underline"
              >
                New Invoice Builder →
              </Link>
            </div>

            <div className="p-5 bg-white dark:bg-[#0c0d0e] rounded-xl border border-zinc-200/80 dark:border-zinc-850 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center mb-3">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Telegram Sidekick</h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Test the real-time AI parser or pair your Telegram account.
                </p>
              </div>
              <button
                onClick={() => setSimulatorOpen(true)}
                className="mt-4 text-left inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-200 hover:underline"
              >
                Launch Bot Simulator →
              </button>
            </div>

            <div className="p-5 bg-white dark:bg-[#0c0d0e] rounded-xl border border-zinc-200/80 dark:border-zinc-850 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center mb-3">
                  <Table className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Google Sheets Sync</h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Google Apps Script webhook for automated 2-way sync.
                </p>
              </div>
              <Link
                href="/sheets"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-200 hover:underline"
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
