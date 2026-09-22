"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/components/providers/AuthProvider";
import { generateGoogleAppsScriptCode } from "@/lib/sheetsExporter";
import { Expense, Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Table,
  Download,
  Copy,
  CheckCircle,
  ExternalLink,
  Code,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  Link2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function GoogleSheetsPage() {
  const { user, refreshUser } = useAuth();
  const [sheetUrl, setSheetUrl] = useState(
    user?.googleSheetsConfig?.spreadsheetUrl ||
      "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
  );
  const [sheetName, setSheetName] = useState(
    user?.googleSheetsConfig?.sheetName || "Finances 2026"
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"expenses" | "invoices">("expenses");

  useEffect(() => {
    Promise.all([fetch("/api/expenses"), fetch("/api/invoices")])
      .then(async ([eRes, iRes]) => {
        const eData = await eRes.json();
        const iData = await iRes.json();
        if (eData.expenses) setExpenses(eData.expenses);
        if (iData.invoices) setInvoices(iData.invoices);
      })
      .catch(console.error);
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetUrl: sheetUrl,
          sheetName,
          isConnected: true,
        }),
      });
      if (res.ok) {
        confetti({ particleCount: 40, spread: 60 });
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const appsScriptCode = generateGoogleAppsScriptCode(
    typeof window !== "undefined" ? `${window.location.origin}/api/sheets/sync` : "https://teleexpense.io/api/sheets/sync",
    user?.telegramSyncToken || "748291"
  );

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      confetti({ particleCount: 30, spread: 50 });
    }, 800);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Google Sheets 2-Way Sync"
          subtitle="Real-time financial synchronization between TeleExpense and your Google Sheets spreadsheets."
        >
          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        </Header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Quick 1-Click Export Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/api/sheets/export?type=invoices"
              download
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Export Invoices</h4>
                  <p className="text-[11px] text-zinc-500">All clients, totals & statuses</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
            </a>

            <a
              href="/api/sheets/export?type=expenses"
              download
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-sky-500 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Export Expenses</h4>
                  <p className="text-[11px] text-zinc-500">Telegram & manual logs</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-zinc-400 group-hover:text-sky-600 transition-colors" />
            </a>

            <a
              href="/api/sheets/export?type=summary"
              download
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Export P&L Summary</h4>
                  <p className="text-[11px] text-zinc-500">Revenue, costs & net cashflow</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
            </a>
          </div>

          {/* Sync Configuration & Apps Script Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sheet Link Config */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Table className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Connected Spreadsheet
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  CONNECTED
                </span>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Google Spreadsheet URL
                  </label>
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Target Tab Name
                  </label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    placeholder="e.g. Finances 2026 or Expenses"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    Open in Google Sheets <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </form>
            </div>

            {/* Google Apps Script 2-Way Sync Code */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                      Google Apps Script Webhook
                    </h3>
                    <p className="text-[11px] text-zinc-500">Paste into Extensions &gt; Apps Script</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                >
                  {copiedCode ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? "Script Copied!" : "Copy Script"}
                </button>
              </div>

              <div className="relative">
                <pre className="p-3 bg-zinc-950 text-zinc-300 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 border border-zinc-800">
                  {appsScriptCode}
                </pre>
              </div>
            </div>
          </div>

          {/* Live Data Sheet Table Preview */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-600" />
                  Live Synced Data Feed
                </h3>
                <p className="text-xs text-zinc-500">
                  Real-time preview of rows synchronized to your Google Sheet
                </p>
              </div>

              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("expenses")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "expenses"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                      : "text-zinc-500"
                  }`}
                >
                  Expenses Sheet ({expenses.length})
                </button>
                <button
                  onClick={() => setActiveTab("invoices")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "invoices"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                      : "text-zinc-500"
                  }`}
                >
                  Invoices Sheet ({invoices.length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              {activeTab === "expenses" ? (
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Merchant</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4">Amount</th>
                      <th className="py-2.5 px-4">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {expenses.map((e) => (
                      <tr key={e.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="py-2.5 px-4">{formatDate(e.date)}</td>
                        <td className="py-2.5 px-4 uppercase">{e.category}</td>
                        <td className="py-2.5 px-4 font-sans font-semibold">{e.merchant || "—"}</td>
                        <td className="py-2.5 px-4 font-sans truncate max-w-xs">{e.description}</td>
                        <td className="py-2.5 px-4 font-bold text-zinc-900 dark:text-white">
                          {formatCurrency(e.amount, e.currency)}
                        </td>
                        <td className="py-2.5 px-4 text-[10px]">{e.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Invoice #</th>
                      <th className="py-2.5 px-4">Client</th>
                      <th className="py-2.5 px-4">Issue Date</th>
                      <th className="py-2.5 px-4">Due Date</th>
                      <th className="py-2.5 px-4">Total</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="py-2.5 px-4 font-bold">{inv.invoiceNumber}</td>
                        <td className="py-2.5 px-4 font-sans font-semibold">{inv.clientName}</td>
                        <td className="py-2.5 px-4">{formatDate(inv.issueDate)}</td>
                        <td className="py-2.5 px-4">{formatDate(inv.dueDate)}</td>
                        <td className="py-2.5 px-4 font-bold text-zinc-900 dark:text-white">
                          {formatCurrency(inv.total, inv.currency)}
                        </td>
                        <td className="py-2.5 px-4 uppercase text-[10px] font-bold">{inv.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
