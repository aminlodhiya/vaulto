"use client";

import React, { useEffect, useState, use } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { Invoice } from "@/lib/types";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.invoice) setInvoice(data.invoice);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center text-xs text-zinc-500">
        Loading invoice details...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center text-xs">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto w-full">
          <InvoiceForm initialInvoice={invoice} isEditMode={true} />
        </div>
      </div>
    </div>
  );
}
