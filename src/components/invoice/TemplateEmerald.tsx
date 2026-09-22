import React from "react";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TemplateEmerald({ invoice }: { invoice: Partial<Invoice> }) {
  const currency = invoice.currency || "USD";

  return (
    <div className="bg-white text-zinc-900 p-8 sm:p-12 font-sans rounded-xl border border-emerald-100 shadow-sm max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between">
      <div>
        {/* Emerald Header Accent Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 p-8 sm:p-10 rounded-t-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            {invoice.senderLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={invoice.senderLogo} alt="Logo" className="h-12 w-auto bg-white/90 p-1.5 rounded-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-xl backdrop-blur-sm">
                {invoice.senderBusiness ? invoice.senderBusiness.charAt(0) : "E"}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold tracking-tight">{invoice.senderBusiness || "Your Company"}</h2>
              <p className="text-xs text-emerald-100">{invoice.senderEmail}</p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200">INVOICE</span>
            <h1 className="text-2xl font-mono font-bold">{invoice.invoiceNumber || "INV-0001"}</h1>
            <p className="text-xs text-emerald-100 mt-1">Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-zinc-100">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">From</p>
            <p className="font-semibold text-zinc-900">{invoice.senderName}</p>
            <p className="text-sm text-zinc-500 whitespace-pre-line">{invoice.senderAddress}</p>
            {invoice.senderPhone && <p className="text-xs text-zinc-400 mt-1">{invoice.senderPhone}</p>}
            {invoice.senderTaxId && <p className="text-xs text-zinc-400">Tax ID: {invoice.senderTaxId}</p>}
          </div>

          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Invoice To</p>
            <p className="font-semibold text-zinc-900">{invoice.clientName || "Client Name"}</p>
            {invoice.clientCompany && <p className="text-sm font-medium text-zinc-700">{invoice.clientCompany}</p>}
            {invoice.clientEmail && <p className="text-sm text-zinc-500">{invoice.clientEmail}</p>}
            {invoice.clientAddress && <p className="text-sm text-zinc-500 whitespace-pre-line">{invoice.clientAddress}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/70 text-emerald-900 text-xs uppercase font-bold tracking-wider rounded-lg">
                <th className="py-3 px-3 rounded-l-lg">Item & Description</th>
                <th className="py-3 px-3 text-center w-20">Qty</th>
                <th className="py-3 px-3 text-right w-28">Rate</th>
                <th className="py-3 px-3 text-right w-28 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {(invoice.items || []).map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    {item.description && <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3.5 px-3 text-right font-mono">{formatCurrency(item.unitPrice, currency)}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-zinc-900">
                    {formatCurrency(item.total || item.quantity * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal || 0, currency)}</span>
            </div>
            {Boolean(invoice.discountRate && invoice.discountRate > 0) && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({invoice.discountRate}%)</span>
                <span className="font-mono">-{formatCurrency(invoice.discountAmount || 0, currency)}</span>
              </div>
            )}
            {Boolean(invoice.taxRate && invoice.taxRate > 0) && (
              <div className="flex justify-between text-zinc-600">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="font-mono">{formatCurrency(invoice.taxAmount || 0, currency)}</span>
              </div>
            )}
            <div className="bg-emerald-700 text-white p-3 rounded-xl flex justify-between font-bold text-base mt-2">
              <span>Amount Due</span>
              <span className="font-mono">{formatCurrency(invoice.total || 0, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-zinc-100 text-xs text-zinc-500 flex justify-between items-end">
        <div>
          <p className="font-semibold text-emerald-800">Payment Terms</p>
          <p>{invoice.paymentTerms || "Please settle within agreed timeline."}</p>
          {invoice.notes && <p className="mt-1 text-zinc-400">{invoice.notes}</p>}
        </div>
        {invoice.senderSignature && (
          <div className="text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invoice.senderSignature} alt="Signature" className="h-9 w-auto inline-block mb-1" />
            <div className="w-32 border-t border-zinc-200 pt-1 text-[10px]">Authorized Signature</div>
          </div>
        )}
      </div>
    </div>
  );
}
