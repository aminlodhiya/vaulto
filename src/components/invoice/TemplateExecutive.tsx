import React from "react";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TemplateExecutive({ invoice }: { invoice: Partial<Invoice> }) {
  const currency = invoice.currency || "USD";

  return (
    <div className="bg-[#09090b] text-zinc-100 p-8 sm:p-12 font-sans rounded-xl border border-zinc-800 shadow-xl max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-zinc-800 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-100 font-mono">
                {invoice.senderBusiness ? invoice.senderBusiness.charAt(0) : "V"}
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white">{invoice.senderBusiness || "Vaulto Executive"}</h2>
                <p className="text-[11px] text-zinc-400">{invoice.senderEmail}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 whitespace-pre-line mt-2">{invoice.senderAddress}</p>
            {invoice.senderTaxId && <p className="text-[11px] text-zinc-500 mt-1 font-mono">VAT/Tax ID: {invoice.senderTaxId}</p>}
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] tracking-widest font-mono uppercase text-zinc-300 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded">
              EXECUTIVE INVOICE
            </span>
            <h1 className="text-2xl font-mono font-bold text-white mt-2">
              {invoice.invoiceNumber || "INV-0001"}
            </h1>
            <div className="mt-2 text-xs text-zinc-400 font-mono space-y-0.5">
              <p>Issued: <span className="text-zinc-200">{formatDate(invoice.issueDate)}</span></p>
              <p>Due: <span className="text-zinc-200">{formatDate(invoice.dueDate)}</span></p>
            </div>
          </div>
        </div>

        {/* Client details */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-zinc-800">
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">CLIENT RECIPIENT</p>
            <p className="font-bold text-white text-sm">{invoice.clientName || "Client Name"}</p>
            {invoice.clientCompany && <p className="text-xs text-zinc-300">{invoice.clientCompany}</p>}
            {invoice.clientEmail && <p className="text-xs text-zinc-400 mt-0.5">{invoice.clientEmail}</p>}
            {invoice.clientAddress && <p className="text-xs text-zinc-500 mt-1 whitespace-pre-line">{invoice.clientAddress}</p>}
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">SETTLEMENT TERMS</p>
              <p className="text-xs text-zinc-300">{invoice.paymentTerms || "Wire transfer or corporate card settlement."}</p>
            </div>
            {invoice.isRecurring && (
              <span className="text-xs text-zinc-300 font-mono mt-2">
                🔄 Recurring Cycle: {invoice.recurringInterval}
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
                <th className="py-2.5 px-2">Deliverable Item</th>
                <th className="py-2.5 px-2 text-center w-20">Units</th>
                <th className="py-2.5 px-2 text-right w-28">Rate</th>
                <th className="py-2.5 px-2 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-xs">
              {(invoice.items || []).map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-zinc-900/50">
                  <td className="py-3 px-2">
                    <p className="font-semibold text-zinc-100">{item.name}</p>
                    {item.description && <p className="text-[11px] text-zinc-400 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-zinc-400">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono text-zinc-300">{formatCurrency(item.unitPrice, currency)}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-white">
                    {formatCurrency(item.total || item.quantity * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-1.5 text-xs bg-zinc-900/80 p-4 rounded-lg border border-zinc-800">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-zinc-200">{formatCurrency(invoice.subtotal || 0, currency)}</span>
            </div>
            {Boolean(invoice.discountRate && invoice.discountRate > 0) && (
              <div className="flex justify-between text-zinc-300">
                <span>Discount ({invoice.discountRate}%)</span>
                <span className="font-mono">-{formatCurrency(invoice.discountAmount || 0, currency)}</span>
              </div>
            )}
            {Boolean(invoice.taxRate && invoice.taxRate > 0) && (
              <div className="flex justify-between text-zinc-400">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="font-mono text-zinc-200">{formatCurrency(invoice.taxAmount || 0, currency)}</span>
              </div>
            )}
            <div className="border-t border-zinc-700 pt-2 flex justify-between font-bold text-sm text-white">
              <span>Total Payable</span>
              <span className="font-mono text-base">{formatCurrency(invoice.total || 0, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-zinc-900 text-xs text-zinc-500 flex justify-between items-end">
        <div>
          {invoice.notes && <p className="text-zinc-400 text-[11px]">{invoice.notes}</p>}
          <p className="mt-1 text-[10px] text-zinc-600 font-mono">Generated via Vaulto Financial OS.</p>
        </div>
        {invoice.senderSignature && (
          <div className="text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invoice.senderSignature} alt="Signature" className="h-8 w-auto invert inline-block mb-1" />
            <div className="w-32 border-t border-zinc-800 pt-1 text-[10px] text-zinc-500 font-mono">Signatory</div>
          </div>
        )}
      </div>
    </div>
  );
}
