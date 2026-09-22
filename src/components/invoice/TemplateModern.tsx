import React from "react";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TemplateModern({ invoice }: { invoice: Partial<Invoice> }) {
  const currency = invoice.currency || "USD";

  return (
    <div className="bg-white text-zinc-900 p-8 sm:p-12 font-sans rounded-xl border border-zinc-200 shadow-2xs max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-zinc-200 pb-8">
          <div>
            {invoice.senderLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.senderLogo}
                alt="Logo"
                className="h-10 w-auto max-w-[140px] object-contain rounded-md mb-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-2xs font-mono">
                {invoice.senderBusiness ? invoice.senderBusiness.charAt(0) : "V"}
              </div>
            )}
            <h2 className="text-lg font-bold text-zinc-900">{invoice.senderBusiness || "Vaulto Studio"}</h2>
            <p className="text-xs text-zinc-500">{invoice.senderName}</p>
            <p className="text-xs text-zinc-500 whitespace-pre-line mt-0.5">{invoice.senderAddress}</p>
            {invoice.senderEmail && <p className="text-xs text-zinc-500">{invoice.senderEmail}</p>}
            {invoice.senderTaxId && <p className="text-[11px] text-zinc-400 mt-1 font-mono">Tax ID: {invoice.senderTaxId}</p>}
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
              INVOICE
            </span>
            <h1 className="text-2xl font-bold text-zinc-950 mt-2 font-mono">
              {invoice.invoiceNumber || "INV-0001"}
            </h1>
            <div className="mt-2 space-y-0.5 text-xs text-zinc-600 font-mono">
              <p><span className="text-zinc-400 font-sans">Issued:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="text-zinc-400 font-sans">Due:</span> {formatDate(invoice.dueDate)}</p>
              {invoice.status && (
                <p className="pt-1">
                  <span className={`inline-block px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                    invoice.status === "paid"
                      ? "bg-zinc-100 text-zinc-900 border border-zinc-300"
                      : invoice.status === "overdue"
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : "bg-zinc-50 text-zinc-700 border border-zinc-200"
                  }`}>
                    {invoice.status}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-zinc-100">
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200/60">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              BILLED TO
            </p>
            <h3 className="text-sm font-bold text-zinc-900">{invoice.clientName || "Client Name"}</h3>
            {invoice.clientCompany && <p className="text-xs font-medium text-zinc-700">{invoice.clientCompany}</p>}
            {invoice.clientEmail && <p className="text-xs text-zinc-500 mt-0.5">{invoice.clientEmail}</p>}
            {invoice.clientAddress && <p className="text-xs text-zinc-500 whitespace-pre-line mt-0.5">{invoice.clientAddress}</p>}
            {invoice.clientTaxId && <p className="text-[11px] text-zinc-400 mt-1 font-mono">Tax ID: {invoice.clientTaxId}</p>}
          </div>

          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200/60 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                PAYMENT TERMS
              </p>
              <p className="text-xs text-zinc-600">{invoice.paymentTerms || "Net 30 days"}</p>
            </div>
            {invoice.isRecurring && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200 font-mono">
                <span>🔄 Automated Retainer ({invoice.recurringInterval})</span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-900 text-[11px] uppercase tracking-wider font-bold font-mono">
                <th className="py-2.5 px-2">Deliverable Item</th>
                <th className="py-2.5 px-2 text-center w-20">Units</th>
                <th className="py-2.5 px-2 text-right w-28">Rate</th>
                <th className="py-2.5 px-2 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {(invoice.items || []).map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-zinc-50/50">
                  <td className="py-3 px-2">
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    {item.description && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 whitespace-pre-line">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-zinc-700">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono text-zinc-700">
                    {formatCurrency(item.unitPrice, currency)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-zinc-900">
                    {formatCurrency(item.total || item.quantity * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">{formatCurrency(invoice.subtotal || 0, currency)}</span>
            </div>

            {Boolean(invoice.discountRate && invoice.discountRate > 0) && (
              <div className="flex justify-between text-zinc-700">
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

            <div className="border-t border-zinc-900 pt-2 flex justify-between text-sm font-bold text-zinc-950">
              <span>Total Payable</span>
              <span className="font-mono text-base">{formatCurrency(invoice.total || 0, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Notes & Signature */}
      <div className="pt-8 mt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-zinc-500">
        <div className="max-w-md space-y-1">
          {invoice.notes && (
            <div>
              <p className="font-semibold text-zinc-700 text-[11px]">Notes:</p>
              <p className="whitespace-pre-line text-[11px] mt-0.5">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.senderSignature && (
          <div className="text-center sm:text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invoice.senderSignature} alt="Signature" className="h-8 w-auto inline-block mb-1" />
            <div className="w-32 border-t border-zinc-300 pt-1 text-[10px] font-mono">
              Authorized Signature
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
