import React from "react";
import {
  FileText,
  Send,
  Table,
  TrendingUp,
  Repeat,
  Download,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "Bespoke Invoicing Engine",
      description:
        "Draft client invoices with customized logos, signatures, and granular tax calculations. Choose between Executive Dark, Swiss Minimal, or Modern layouts.",
    },
    {
      icon: Send,
      title: "Telegram Expense Intelligence",
      description:
        "Text receipts from your phone. Our NLP engine extracts amount, vendor, and expense category into your unified ledger in under two seconds.",
    },
    {
      icon: Table,
      title: "Two-Way Google Sheets Sync",
      description:
        "Maintain total transparency. Every invoice created and receipt logged synchronizes bidirectionally with your Google Sheets spreadsheet.",
    },
    {
      icon: Repeat,
      title: "Automated Recurring Retainers",
      description:
        "Establish weekly, monthly, or quarterly schedules. Vaulto manages cycle roll-overs, due dates, and reminders on autopilot.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Cashflow Analytics",
      description:
        "Instant visibility into settled revenue, outstanding receivables, categorized costs, and operating margins via interactive charts.",
    },
    {
      icon: Download,
      title: "Vector PDF & Hosted Client Links",
      description:
        "Generate print-accurate vector PDF invoices or share hosted links where clients can review deliverables and settle securely via Stripe.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block font-semibold">
            CORE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Engineered for high-performing solo studios
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            No bulky enterprise software. Vaulto delivers precision tools tailored to your daily workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/30 hover:border-blue-300 dark:hover:border-blue-800/80 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
