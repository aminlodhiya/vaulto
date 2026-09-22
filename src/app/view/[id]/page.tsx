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
    <div className="min-h-screen bg-stone-50/60 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Floating Client Action Banner */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">
                  Invoice from {invoice.senderBusiness || invoice.senderName}
                </h2>
                {isPaid ? (
                  <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" /> PAID
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-200/80 dark:border-blue-900/60 font-mono">
                    DUE: {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 font-mono">
                #{invoice.invoiceNumber} • Due {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {!isPaid && (
              <button
                onClick={handlePayInvoice}
                disabled={paying}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-[0.98]"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {paying ? "Processing..." : "Pay with Card"}
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
        <div id="public-invoice-container" className="shadow-lg rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800">
          <InvoicePreview invoice={invoice} />
        </div>

        {/* Footer Security Note */}
        <div className="text-center text-xs text-zinc-500 space-y-1 pt-4 font-mono">
          <p className="flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
            <span>Secured and verified by <strong className="text-zinc-700 dark:text-zinc-300 font-sans font-medium tracking-tight">Vaulto</strong></span>
          </p>
        </div>
      </div>
    </div>
  );
}
