"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Invoice, InvoiceItem, Client, InvoiceTemplate, RecurringInterval } from "@/lib/types";
import { InvoicePreview } from "./InvoicePreview";
import { InvoicePDF } from "./InvoicePDF";
import { useAuth } from "../providers/AuthProvider";
import { formatCurrency, generateId } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  Edit3,
  Calendar,
  Sparkles,
  Repeat,
  DollarSign,
  Building2,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  Copy,
} from "lucide-react";
import Link from "next/link";

interface InvoiceFormProps {
  initialInvoice?: Invoice;
  isEditMode?: boolean;
}

export function InvoiceForm({ initialInvoice, isEditMode = false }: InvoiceFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Form State
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: initialInvoice?.invoiceNumber || "",
    issueDate: initialInvoice?.issueDate || new Date().toISOString().split("T")[0],
    dueDate: initialInvoice?.dueDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
    status: initialInvoice?.status || "unpaid",
    currency: initialInvoice?.currency || user?.currency || "USD",
    
    senderName: initialInvoice?.senderName || user?.name || "Alex Morgan",
    senderBusiness: initialInvoice?.senderBusiness || user?.businessName || "Nexus Digital Studio",
    senderEmail: initialInvoice?.senderEmail || user?.businessEmail || "billing@nexusdigital.io",
    senderAddress: initialInvoice?.senderAddress || user?.businessAddress || "742 Evergreen Terrace, Suite 400, San Francisco, CA",
    senderPhone: initialInvoice?.senderPhone || user?.businessPhone || "+1 (555) 234-5678",
    senderTaxId: initialInvoice?.senderTaxId || user?.taxNumber || "US-88392019",
    senderLogo: initialInvoice?.senderLogo || user?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    senderSignature: initialInvoice?.senderSignature || user?.signatureUrl || "",

    clientId: initialInvoice?.clientId || "",
    clientName: initialInvoice?.clientName || "",
    clientCompany: initialInvoice?.clientCompany || "",
    clientEmail: initialInvoice?.clientEmail || "",
    clientAddress: initialInvoice?.clientAddress || "",
    clientPhone: initialInvoice?.clientPhone || "",
    clientTaxId: initialInvoice?.clientTaxId || "",

    items: initialInvoice?.items || [
      {
        id: generateId("item"),
        name: "Full-Stack Development & Strategy",
        description: "Milestone 1 design system handoff & API integrations",
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
      },
    ],

    taxRate: initialInvoice?.taxRate || 0,
    discountRate: initialInvoice?.discountRate || 0,
    shipping: initialInvoice?.shipping || 0,
    notes: initialInvoice?.notes || "Thank you for choosing Nexus Digital Studio. We appreciate your business!",
    paymentTerms: initialInvoice?.paymentTerms || "Payment is due within 30 days of invoice date.",
    template: initialInvoice?.template || "modern",
    
    isRecurring: initialInvoice?.isRecurring || false,
    recurringInterval: initialInvoice?.recurringInterval || "monthly",
    nextRecurringDate: initialInvoice?.nextRecurringDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
  });

  // Fetch clients for autocomplete
  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        if (data.clients) setClients(data.clients);
      })
      .catch((e) => console.error(e));
  }, []);

  // Update client fields when selecting an existing client
  const handleSelectClient = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        clientId: selected.id,
        clientName: selected.name,
        clientCompany: selected.company || "",
        clientEmail: selected.email,
        clientAddress: selected.address || "",
        clientPhone: selected.phone || "",
        clientTaxId: selected.taxId || "",
      }));
    }
  };

  // Recalculate item totals
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(formData.items || [])];
    const current = { ...newItems[index], [field]: value };
    
    if (field === "quantity" || field === "unitPrice") {
      const q = Math.max(0, Number(current.quantity) || 0);
      const p = Math.max(0, Number(current.unitPrice) || 0);
      current.total = Math.round(q * p * 100) / 100;
    }
    
    newItems[index] = current;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: generateId("item"),
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if ((formData.items || []).length <= 1) return;
    const newItems = (formData.items || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // Compute subtotal, taxes, discount, total
  const items = formData.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountRate = Number(formData.discountRate) || 0;
  const discountAmount = Math.round(((subtotal * discountRate) / 100) * 100) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(formData.taxRate) || 0;
  const taxAmount = Math.round(((taxableAmount * taxRate) / 100) * 100) / 100;
  const shipping = Number(formData.shipping) || 0;
  const total = Math.round((taxableAmount + taxAmount + shipping) * 100) / 100;

  const fullInvoicePayload: Partial<Invoice> = {
    ...formData,
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };

  const handleSave = async (statusOverride?: "draft" | "sent" | "paid" | "unpaid") => {
    if (!formData.clientName) {
      alert("Please enter a client name.");
      return;
    }

    setSaving(true);
    const payload = {
      ...fullInvoicePayload,
      status: statusOverride || formData.status || "unpaid",
    };

    try {
      const url = isEditMode && initialInvoice ? `/api/invoices/${initialInvoice.id}` : "/api/invoices";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save invoice");
        return;
      }

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      router.push("/invoices");
    } catch (e: any) {
      alert("Error saving invoice: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isEditMode ? `Edit Invoice (${formData.invoiceNumber})` : "Create New Invoice"}
            </h2>
            <p className="text-xs text-zinc-500">
              Customize branding, items, taxes, recurring schedules & export PDF
            </p>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 ${
              activeTab === "edit"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow"
                : "text-zinc-500"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow"
                : "text-zinc-500"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Save Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("sent")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-xs font-medium shadow-2xs transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : isEditMode ? "Update Invoice" : "Save & Finalize"}
          </button>
        </div>
      </div>

      {/* Main 2-Column Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            activeTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Template & Styling Bar */}
          <div className="bg-white dark:bg-[#0c0d0e] p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                Select Template
              </label>
              <span className="text-[11px] text-zinc-500">Pick layout typography</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: "modern", label: "Modern Swiss", color: "bg-zinc-900 dark:bg-white" },
                  { id: "emerald", label: "Racing Green", color: "bg-[#0f291e]" },
                  { id: "executive", label: "Executive Dark", color: "bg-zinc-800" },
                  { id: "minimal", label: "Minimalist Mono", color: "bg-zinc-400" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, template: t.id as InvoiceTemplate })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.template === t.id
                      ? "border-zinc-900 dark:border-white ring-1 ring-zinc-900/10 dark:ring-white/20 bg-zinc-100 dark:bg-zinc-850"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${t.color} mb-1.5`} />
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Meta & Dates */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Invoice Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="Auto-generated (e.g. INV-2026-0005)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD (CA$) - Canadian Dollar</option>
                  <option value="AUD">AUD (A$) - Australian Dollar</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Recurring Toggle */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-indigo-500" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Recurring Invoice</p>
                    <p className="text-[11px] text-zinc-500">Automatically repeat this invoice on schedule</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {formData.isRecurring && (
                <div className="mt-3 grid grid-cols-2 gap-3 p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                      Billing Interval
                    </label>
                    <select
                      value={formData.recurringInterval}
                      onChange={(e) => setFormData({ ...formData, recurringInterval: e.target.value as RecurringInterval })}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                      Next Billing Date
                    </label>
                    <input
                      type="date"
                      value={formData.nextRecurringDate}
                      onChange={(e) => setFormData({ ...formData, nextRecurringDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Client (Billed To)
              </h3>
              {clients.length > 0 && (
                <select
                  onChange={(e) => handleSelectClient(e.target.value)}
                  defaultValue=""
                  className="text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                >
                  <option value="" disabled>
                    Choose saved client...
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  placeholder="e.g. Acme Innovations Inc."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="sarah@acme.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Tax / VAT ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.clientTaxId}
                  onChange={(e) => setFormData({ ...formData, clientTaxId: e.target.value })}
                  placeholder="e.g. TX-998822"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Billing Address
              </label>
              <textarea
                rows={2}
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                placeholder="100 Tech Blvd, Austin, TX 78701"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                Line Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        placeholder="Item name / service..."
                        className="w-full font-semibold text-xs px-2.5 py-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 rounded transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={1}
                    value={item.description || ""}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="Description or scope notes..."
                    className="w-full text-[11px] px-2.5 py-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] text-zinc-500">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500">Unit Price</label>
                      <input
                        type="number"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500">Total</label>
                      <div className="px-2 py-1 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded">
                        {formatCurrency(item.total || item.quantity * item.unitPrice, formData.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations & Discounts */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountRate}
                    onChange={(e) => setFormData({ ...formData, discountRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Tax / VAT %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Shipping
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shipping}
                    onChange={(e) => setFormData({ ...formData, shipping: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg flex items-center justify-between text-sm font-bold">
                <span className="text-zinc-700 dark:text-zinc-300">Grand Total:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base">
                  {formatCurrency(total, formData.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Notes for Client
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div
          className={`lg:col-span-6 sticky top-24 space-y-4 ${
            activeTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Live Preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <InvoicePDF
                elementId="invoice-printable-container"
                filename={`${formData.invoiceNumber || "Invoice"}.pdf`}
                buttonLabel="Download PDF"
              />
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div id="invoice-printable-container" className="rounded-xl overflow-hidden shadow-lg">
            <InvoicePreview invoice={fullInvoicePayload} />
          </div>
        </div>
      </div>
    </div>
  );
}
