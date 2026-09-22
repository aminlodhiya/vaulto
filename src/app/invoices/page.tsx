"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { TelegramSimulatorModal } from "@/components/ui/TelegramSimulatorModal";
import { Invoice, InvoiceStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  ExternalLink,
  Edit,
  Sparkles,
  Repeat,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (data.invoices) setInvoices(data.invoices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (res.ok) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        fetchInvoices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === "all" || inv.status === filter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientCompany && inv.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: Invoice["status"], dueDate: string) => {
    const isPastDue = dueDate && new Date(dueDate) < new Date() && status !== "paid";
    const actual = isPastDue && status === "unpaid" ? "overdue" : status;

    switch (actual) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-mono">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case "sent":
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-mono">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen bg-stone-50/50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar onOpenSimulator={() => setSimulatorOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Invoices"
          subtitle="Create, manage, and track client billing with PDF downloads and Stripe links."
          onOpenSimulator={() => setSimulatorOpen(true)}
        >
          <a
            href="/api/sheets/export?type=invoices"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-blue-300 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            Export CSV
          </a>
        </Header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Controls Bar: Filters & Search */}
          <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: "all", label: "All Invoices" },
                  { id: "paid", label: "Paid" },
                  { id: "unpaid", label: "Unpaid" },
                  { id: "overdue", label: "Overdue" },
                  { id: "draft", label: "Drafts" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    filter === tab.id
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoice or client..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Invoices List Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs font-mono text-zinc-500">Loading invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 space-y-3">
                <FileText className="w-8 h-8 mx-auto text-blue-400" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  No invoices matched your filter.
                </p>
                <Link
                  href="/invoices/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create First Invoice
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Client / Business</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                    {filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                          <Link
                            href={`/invoices/${inv.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                          >
                            {inv.invoiceNumber}
                            {inv.isRecurring && (
                              <span
                                title={`Recurring: ${inv.recurringInterval}`}
                                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-sans"
                              >
                                <Repeat className="w-3 h-3" />
                                {inv.recurringInterval}
                              </span>
                            )}
                          </Link>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                            {inv.clientName}
                          </p>
                          {inv.clientCompany && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {inv.clientCompany}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                          {formatDate(inv.issueDate)}
                        </td>

                        <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                          {formatDate(inv.dueDate)}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                          {formatCurrency(inv.total, inv.currency)}
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(inv.status, inv.dueDate)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inv.status !== "paid" && (
                              <button
                                onClick={() => handleMarkPaid(inv.id)}
                                className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyLink(inv.id)}
                              className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Copy Shareable Public Invoice Link"
                            >
                              {copiedId === inv.id ? (
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Copied!</span>
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <Link
                              href={`/invoices/${inv.id}/edit`}
                              className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Edit Invoice"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                              href={`/view/${inv.id}`}
                              target="_blank"
                              className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Public View"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDelete(inv.id)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <TelegramSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onExpenseCreated={fetchInvoices}
      />
    </div>
  );
}
