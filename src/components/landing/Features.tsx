import React from "react";
import {
  FileText,
  Send,
  Table,
  TrendingUp,
  CreditCard,
  Download,
  Repeat,
  Shield,
  Zap,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: FileText,
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800",
      title: "Branded Invoicing Suite",
      description:
        "Create pixel-perfect invoices with custom logo, colors, signatures, tax/VAT rates, and multiple templates. Track paid, unpaid, and overdue status effortlessly.",
    },
    {
      icon: Send,
      color: "text-sky-500 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800",
      title: "Telegram AI Expense Sidekick",
      description:
        "Text your Telegram bot like 'Spent $45 on lunch with Acme'. The AI extracts amount, merchant, category, and logs it in real-time.",
    },
    {
      icon: Table,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
      title: "2-Way Google Sheets Sync",
      description:
        "Never lose financial visibility. Every invoice and expense automatically synchronizes to your custom Google Sheet or exports to CSV with 1 click.",
    },
    {
      icon: Repeat,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800",
      title: "Automated Recurring Invoices",
      description:
        "Set weekly, monthly, or quarterly schedules. TeleExpense automatically calculates next billing dates and keeps retainers on autopilot.",
    },
    {
      icon: TrendingUp,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
      title: "Real-Time Cashflow Analytics",
      description:
        "Track total revenue, outstanding receivables, categorized expenses, and net profit margins with interactive charts.",
    },
    {
      icon: Download,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800",
      title: "Crisp PDF & Public Links",
      description:
        "Download vector-sharp PDFs or share private viewable web links where clients can review and pay via Stripe.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            All-In-One Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-2 tracking-tight">
            Everything you need to run freelance & agency finances
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Ditch bloated accounting software. TeleExpense gives you lightweight, lightning-fast tools that fit right into your daily workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-xl transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${f.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
