import React from "react";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TemplateModern({ invoice }: { invoice: Partial<Invoice> }) {
  const currency = invoice.currency || "USD";

  return (
    <div className="bg-white text-zinc-900 p-8 sm:p-12 font-sans rounded-xl border border-zinc-200 shadow-sm max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-zinc-100 pb-8">
          <div>
            {invoice.senderLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.senderLogo}
                alt="Logo"
                className="h-12 w-auto max-w-[160px] object-contain rounded-lg mb-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-md">
                {invoice.senderBusiness ? invoice.senderBusiness.charAt(0) : "T"}
              </div>
            )}
            <h2 className="text-xl font-bold text-zinc-900">{invoice.senderBusiness || "Your Business Name"}</h2>
            <p className="text-sm text-zinc-500">{invoice.senderName}</p>
            <p className="text-sm text-zinc-500 whitespace-pre-line">{invoice.senderAddress}</p>
            {invoice.senderEmail && <p className="text-sm text-zinc-500">{invoice.senderEmail}</p>}
            {invoice.senderTaxId && <p className="text-xs text-zinc-400 mt-1">Tax ID: {invoice.senderTaxId}</p>}
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Invoice
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 mt-2 font-mono">
              {invoice.invoiceNumber || "INV-0001"}
            </h1>
            <div className="mt-3 space-y-1 text-sm text-zinc-600">
              <p><span className="text-zinc-400">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="text-zinc-400">Due Date:</span> {formatDate(invoice.dueDate)}</p>
              {invoice.status && (
                <p>
                  <span className="text-zinc-400">Status:</span>{" "}
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    invoice.status === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : invoice.status === "overdue"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {invoice.status}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-zinc-50/80 p-5 rounded-xl border border-zinc-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
              Billed To
            </p>
            <h3 className="text-base font-bold text-zinc-900">{invoice.clientName || "Client Name"}</h3>
            {invoice.clientCompany && <p className="text-sm font-medium text-zinc-700">{invoice.clientCompany}</p>}
            {invoice.clientEmail && <p className="text-sm text-zinc-600">{invoice.clientEmail}</p>}
            {invoice.clientAddress && <p className="text-sm text-zinc-500 whitespace-pre-line mt-1">{invoice.clientAddress}</p>}
            {invoice.clientTaxId && <p className="text-xs text-zinc-400 mt-1">Tax ID: {invoice.clientTaxId}</p>}
          </div>

          <div className="bg-zinc-50/80 p-5 rounded-xl border border-zinc-100 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                Payment Info
              </p>
              <p className="text-xs text-zinc-600">{invoice.paymentTerms || "Net 30 days"}</p>
            </div>
            {invoice.isRecurring && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                <span>🔄 Recurring Invoice ({invoice.recurringInterval})</span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-indigo-600 text-indigo-950 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-center w-20">Qty</th>
                <th className="py-3 px-2 text-right w-28">Unit Price</th>
                <th className="py-3 px-2 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {(invoice.items || []).map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-zinc-50/50">
                  <td className="py-3.5 px-2">
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 whitespace-pre-line">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-center font-mono text-zinc-700">{item.quantity}</td>
                  <td className="py-3.5 px-2 text-right font-mono text-zinc-700">
                    {formatCurrency(item.unitPrice, currency)}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-semibold text-zinc-900">
                    {formatCurrency(item.total || item.quantity * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">{formatCurrency(invoice.subtotal || 0, currency)}</span>
            </div>

            {Boolean(invoice.discountRate && invoice.discountRate > 0) && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({invoice.discountRate}%)</span>
                <span className="font-mono">-{formatCurrency(invoice.discountAmount || 0, currency)}</span>
              </div>
            )}

            {Boolean(invoice.taxRate && invoice.taxRate > 0) && (
              <div className="flex justify-between text-zinc-600">
                <span>Tax / VAT ({invoice.taxRate}%)</span>
                <span className="font-mono">{formatCurrency(invoice.taxAmount || 0, currency)}</span>
              </div>
            )}

            {Boolean(invoice.shipping && invoice.shipping > 0) && (
              <div className="flex justify-between text-zinc-600">
                <span>Shipping / Handling</span>
                <span className="font-mono">{formatCurrency(invoice.shipping || 0, currency)}</span>
              </div>
            )}

            <div className="border-t-2 border-indigo-600 pt-3 flex justify-between text-base font-bold text-indigo-950">
              <span>Total Due</span>
              <span className="font-mono text-lg text-indigo-600">{formatCurrency(invoice.total || 0, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Notes & Signature */}
      <div className="pt-12 mt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-zinc-500">
        <div className="max-w-md space-y-1">
          {invoice.notes && (
            <div>
              <p className="font-semibold text-zinc-700">Notes:</p>
              <p className="whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.senderSignature && (
          <div className="text-center sm:text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invoice.senderSignature} alt="Signature" className="h-10 w-auto inline-block mb-1" />
            <div className="w-36 border-t border-zinc-300 pt-1 text-[11px] text-zinc-500">
              Authorized Signature
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
