"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CreditCard,
  Save,
  CheckCircle,
  RefreshCw,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [businessName, setBusinessName] = useState(user?.businessName || "Nexus Digital Studio");
  const [businessEmail, setBusinessEmail] = useState(user?.businessEmail || "billing@nexusdigital.io");
  const [businessPhone, setBusinessPhone] = useState(user?.businessPhone || "+1 (555) 234-5678");
  const [businessAddress, setBusinessAddress] = useState(
    user?.businessAddress || "742 Evergreen Terrace, Suite 400, San Francisco, CA 94107"
  );
  const [taxNumber, setTaxNumber] = useState(user?.taxNumber || "US-88392019");
  const [currency, setCurrency] = useState(user?.currency || "USD");
  const [logoUrl, setLogoUrl] = useState(
    user?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
  );
  const [signatureUrl, setSignatureUrl] = useState(user?.signatureUrl || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          businessEmail,
          businessPhone,
          businessAddress,
          taxNumber,
          currency,
          logoUrl,
          signatureUrl,
        }),
      });

      if (res.ok) {
        confetti({ particleCount: 30, spread: 50 });
        setSavedSuccess(true);
        await refreshUser();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen bg-stone-50/50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Account & Branding"
          subtitle="Configure your sender identity, corporate defaults, logos & active membership."
        />

        <div className="p-6 space-y-6 max-w-4xl mx-auto w-full pb-20">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Branding & Invoicing Profile */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-zinc-900 dark:text-white" />
                    Entity & Sender Profile
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    This information appears on generated PDF invoices and client-facing statements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Authorized Signer Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Legal Business / Studio Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Billing / Support Email
                  </label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Business Phone
                  </label>
                  <input
                    type="text"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tax ID / VAT Registration
                  </label>
                  <input
                    type="text"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Default Settlement Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors font-mono"
                  >
                    <option value="USD">USD ($) — United States Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="CAD">CAD (CA$) — Canadian Dollar</option>
                    <option value="AUD">AUD (A$) — Australian Dollar</option>
                    <option value="INR">INR (₹) — Indian Rupee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Physical / Registered Address
                </label>
                <textarea
                  rows={2}
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Brand Logo Image URL
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://your-domain.com/logo.png"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 transition-colors font-mono"
                />
                {logoUrl && (
                  <div className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg inline-block border border-zinc-200 dark:border-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt="Logo Preview" className="h-7 w-auto object-contain rounded" />
                  </div>
                )}
              </div>
            </div>

            {/* Subscription & Paid Tier Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-900 dark:text-white" />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Subscription & Billing Tier
                    </h3>
                    <p className="text-xs text-zinc-500">Managed through Stripe Secure Billing</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {user?.subscriptionTier || "PRO"} ACTIVE
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-50/70 dark:bg-zinc-800/40 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Vaulto Pro Membership ($19 / month)
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Unlimited invoices, AI Telegram parser, 2-way Google Sheets sync, and custom branding.
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenBillingPortal}
                    className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Stripe Customer Portal
                  </button>
                  <a
                    href="/pricing"
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-medium transition-colors"
                  >
                    Change Plan
                  </a>
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {savedSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 font-mono">
                  <CheckCircle className="w-3.5 h-3.5" /> Settings persisted successfully
                </span>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
