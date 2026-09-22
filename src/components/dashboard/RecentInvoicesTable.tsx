"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

interface RecentInvoicesTableProps {
  invoices: Invoice[];
  onInvoiceUpdated?: () => void;
}

export function RecentInvoicesTable({ invoices, onInvoiceUpdated }: RecentInvoicesTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleMarkPaid = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdatingId(id);

    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });

      if (res.ok) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
        if (onInvoiceUpdated) onInvoiceUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Invoice["status"], dueDate: string) => {
    const isPastDue = dueDate && new Date(dueDate) < new Date() && status !== "paid";
    const actualStatus = isPastDue && status === "unpaid" ? "overdue" : status;

    switch (actualStatus) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-medium">
            Paid
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            Overdue
          </span>
        );
      case "sent":
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-100 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-750">
            Pending
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
            Draft
          </span>
        );
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 space-y-3">
        <FileText className="w-8 h-8 mx-auto text-blue-400" />
        <p className="text-xs">No invoices created yet.</p>
        <Link
          href="/invoices/new"
          className="inline-block px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
        >
          Create Invoice
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <th className="py-3 px-4">Invoice</th>
            <th className="py-3 px-4">Client</th>
            <th className="py-3 px-4">Due Date</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40 transition-colors"
            >
              <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  {inv.invoiceNumber}
                  {inv.isRecurring && (
                    <span className="text-[10px] text-blue-400 font-sans">
                      (🔄)
                    </span>
                  )}
                </Link>
              </td>

              <td className="py-3 px-4">
                <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                  {inv.clientName}
                </p>
                {inv.clientCompany && (
                  <p className="text-[11px] text-zinc-500">
                    {inv.clientCompany}
                  </p>
                )}
              </td>

              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                {formatDate(inv.dueDate)}
              </td>

              <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                {formatCurrency(inv.total, inv.currency)}
              </td>

              <td className="py-3 px-4">
                {getStatusBadge(inv.status, inv.dueDate)}
              </td>

              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {inv.status !== "paid" && (
                    <button
                      onClick={(e) => handleMarkPaid(e, inv.id)}
                      disabled={updatingId === inv.id}
                      className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-900/60 text-[10px] font-mono transition-colors cursor-pointer"
                    >
                      {updatingId === inv.id ? "..." : "Mark Paid"}
                    </button>
                  )}

                  <Link
                    href={`/view/${inv.id}`}
                    target="_blank"
                    className="p-1 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                    title="Public Invoice View"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/invoices/${inv.id}`}
                    className="p-1 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                    title="Details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
