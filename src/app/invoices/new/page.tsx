"use client";

import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto w-full">
          <InvoiceForm />
        </div>
      </div>
    </div>
  );
}
