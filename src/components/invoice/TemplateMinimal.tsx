import React from "react";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TemplateMinimal({ invoice }: { invoice: Partial<Invoice> }) {
  const currency = invoice.currency || "USD";

  return (
    <div className="bg-white text-zinc-900 p-8 sm:p-12 font-mono rounded-xl border border-zinc-200 shadow-sm max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 uppercase">
              {invoice.senderBusiness || invoice.senderName || "INVOICE"}
            </h1>
            <p className="text-xs text-zinc-600 mt-1">{invoice.senderEmail}</p>
            <p className="text-xs text-zinc-500">{invoice.senderAddress}</p>
          </div>

          <div className="text-right">
            <h2 className="text-lg font-bold text-zinc-900">{invoice.invoiceNumber || "INV-0001"}</h2>
            <p className="text-xs text-zinc-600 mt-1">DATE: {formatDate(invoice.issueDate)}</p>
            <p className="text-xs text-zinc-600">DUE: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <div className="py-6 border-b border-zinc-200">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">TO:</p>
          <p className="font-bold text-sm text-zinc-900">{invoice.clientName || "Client Name"}</p>
          {invoice.clientCompany && <p className="text-xs text-zinc-700">{invoice.clientCompany}</p>}
          {invoice.clientEmail && <p className="text-xs text-zinc-600">{invoice.clientEmail}</p>}
          {invoice.clientAddress && <p className="text-xs text-zinc-500 whitespace-pre-line">{invoice.clientAddress}</p>}
        </div>

        <div className="my-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-900 uppercase font-bold">
                <th className="py-2 px-1">DESCRIPTION</th>
                <th className="py-2 px-1 text-center w-16">QTY</th>
                <th className="py-2 px-1 text-right w-24">PRICE</th>
                <th className="py-2 px-1 text-right w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {(invoice.items || []).map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3 px-1">
                    <p className="font-bold text-zinc-900">{item.name}</p>
                    {item.description && <p className="text-zinc-500 text-[11px] mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-3 px-1 text-center">{item.quantity}</td>
                  <td className="py-3 px-1 text-right">{formatCurrency(item.unitPrice, currency)}</td>
                  <td className="py-3 px-1 text-right font-bold">
                    {formatCurrency(item.total || item.quantity * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>SUBTOTAL</span>
              <span>{formatCurrency(invoice.subtotal || 0, currency)}</span>
            </div>
            {Boolean(invoice.discountRate && invoice.discountRate > 0) && (
              <div className="flex justify-between text-zinc-600">
                <span>DISCOUNT ({invoice.discountRate}%)</span>
                <span>-{formatCurrency(invoice.discountAmount || 0, currency)}</span>
              </div>
            )}
            {Boolean(invoice.taxRate && invoice.taxRate > 0) && (
              <div className="flex justify-between text-zinc-600">
                <span>TAX ({invoice.taxRate}%)</span>
                <span>{formatCurrency(invoice.taxAmount || 0, currency)}</span>
              </div>
            )}
            <div className="border-t border-zinc-900 pt-2 flex justify-between font-bold text-sm text-zinc-900">
              <span>TOTAL DUE</span>
              <span>{formatCurrency(invoice.total || 0, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-200 text-xs text-zinc-500">
        <p>TERMS: {invoice.paymentTerms || "Payment due within 30 days."}</p>
        {invoice.notes && <p className="mt-1">NOTES: {invoice.notes}</p>}
      </div>
    </div>
  );
}
