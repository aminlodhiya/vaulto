"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import { Invoice } from "@/lib/types";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  CheckCircle,
  ExternalLink,
  Share2,
  Printer,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.invoice) setInvoice(data.invoice);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (res.ok) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
        setInvoice({ ...invoice, status: "paid", paidAt: new Date().toISOString() });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/invoices");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center text-xs text-zinc-500">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center flex-col gap-3">
        <p className="text-sm font-semibold">Invoice not found.</p>
        <Link href="/invoices" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Back to invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6 pb-20">
          {/* Top Actions Header */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/invoices"
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="font-mono text-blue-600 dark:text-blue-400">{invoice.invoiceNumber}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      invoice.status === "paid"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </h2>
                <p className="text-xs text-zinc-500">
                  Client: {invoice.clientName} {invoice.clientCompany ? `(${invoice.clientCompany})` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {invoice.status !== "paid" && (
                <button
                  onClick={handleMarkPaid}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Paid
                </button>
              )}

              <InvoicePDF
                elementId="invoice-detail-preview"
                filename={`${invoice.invoiceNumber}.pdf`}
                buttonLabel="Download PDF"
              />

              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {copied ? "Link Copied!" : "Share Link"}
              </button>

              <Link
                href={`/invoices/${invoice.id}/edit`}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Delete invoice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div id="invoice-detail-preview" className="shadow-xl rounded-xl overflow-hidden">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
