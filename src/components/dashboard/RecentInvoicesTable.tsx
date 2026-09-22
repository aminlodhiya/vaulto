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
  MoreVertical,
  Download,
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
          particleCount: 50,
          spread: 60,
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case "sent":
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Draft
          </span>
        );
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 space-y-3">
        <FileText className="w-8 h-8 mx-auto text-zinc-400" />
        <p className="text-sm">No invoices found. Create your first invoice!</p>
        <Link
          href="/invoices/new"
          className="inline-block px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
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
          <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <th className="py-3 px-4">Invoice #</th>
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
              className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5"
                >
                  {inv.invoiceNumber}
                  {inv.isRecurring && (
                    <span className="text-[10px] text-indigo-500 font-sans font-normal">
                      (🔄)
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

              <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">
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
                      onClick={(e) => handleMarkPaid(e, inv.id)}
                      disabled={updatingId === inv.id}
                      className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold transition-colors"
                      title="Mark as paid"
                    >
                      {updatingId === inv.id ? "..." : "Mark Paid"}
                    </button>
                  )}

                  <Link
                    href={`/view/${inv.id}`}
                    target="_blank"
                    className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors"
                    title="Public Invoice Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/invoices/${inv.id}`}
                    className="p-1 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                    title="View & Edit Details"
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
