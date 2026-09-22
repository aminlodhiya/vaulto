"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Download,
  CreditCard,
  CheckCircle,
  Receipt,
  Printer,
  ShieldCheck,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PublicInvoiceViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.invoice) setInvoice(data.invoice);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayInvoice = async () => {
    if (!invoice) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });

      if (res.ok) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        setPaidSuccess(true);
        setInvoice({ ...invoice, status: "paid", paidAt: new Date().toISOString() });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-xs text-zinc-500">
        Loading invoice preview...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Invoice Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1">This invoice link may have expired or been removed.</p>
      </div>
    );
  }

  const isPaid = invoice.status === "paid" || paidSuccess;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Floating Client Action Banner */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Invoice from {invoice.senderBusiness || invoice.senderName}
                </h2>
                {isPaid ? (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> PAID
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    AMOUNT DUE: {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                Invoice #{invoice.invoiceNumber} • Due {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {!isPaid && (
              <button
                onClick={handlePayInvoice}
                disabled={paying}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {paying ? "Processing..." : "Pay via Stripe"}
              </button>
            )}

            <InvoicePDF
              elementId="public-invoice-container"
              filename={`${invoice.invoiceNumber}.pdf`}
              buttonLabel="Download PDF"
              variant="outline"
            />
          </div>
        </div>

        {/* Printable Invoice View Container */}
        <div id="public-invoice-container" className="shadow-2xl rounded-2xl overflow-hidden">
          <InvoicePreview invoice={invoice} />
        </div>

        {/* Footer Security Note */}
        <div className="text-center text-xs text-zinc-500 space-y-1 pt-4">
          <p className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" />
            Secured and delivered via TeleExpense Fintech Suite
          </p>
        </div>
      </div>
    </div>
  );
}
