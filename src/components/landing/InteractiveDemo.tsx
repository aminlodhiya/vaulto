"use client";

import React, { useState } from "react";
import {
  Send,
  Sparkles,
  Bot,
  FileText,
  Table,
  CheckCircle,
  ArrowRight,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { parseTelegramMessage } from "@/lib/telegramParser";
import { formatCurrency } from "@/lib/utils";

export function InteractiveDemo() {
  const [inputText, setInputText] = useState("Spent $65 on client lunch at Chipotle");
  const parsed = parseTelegramMessage(inputText);

  const samplePrompts = [
    "Spent $65 on client lunch at Chipotle",
    "AWS hosting $120 #software",
    "Uber ride to airport $34.50 category:travel",
    "/invoice Lumina Labs 850 Frontend sprint",
    "/summary",
  ];

  return (
    <section id="demo" className="py-16 bg-zinc-50/50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Interactive Playground
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            See the NLP Expense Parser & Invoice Engine in Action
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Type any real-world expense message below to see how our intelligent algorithm extracts the amount,
            merchant, category, and syncs everything automatically.
          </p>
        </div>

        {/* Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive Telegram Input Box */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#24A1DE] text-white flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Telegram NLP Sidekick</h3>
                    <p className="text-xs text-zinc-500">Live Parser Simulation</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>

              {/* Input */}
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Try typing or click a sample prompt:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Spent $45 on lunch at Chipotle"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Sample prompt chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Bot Response Simulation */}
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Simulated Telegram Bot Response:
              </p>
              <div className="bg-[#24A1DE]/10 dark:bg-[#24A1DE]/15 border border-[#24A1DE]/30 p-4 rounded-xl text-xs space-y-1.5 font-sans">
                {parsed.actionType === "expense" && parsed.amount ? (
                  <>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#24A1DE]" />
                      Expense successfully logged!
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      💰 <b>Amount:</b> {formatCurrency(parsed.amount, parsed.currency)}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      📂 <b>Category:</b> {(parsed.category || "other").toUpperCase()}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      🏷️ <b>Merchant:</b> {parsed.merchant || "N/A"}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                      📊 Auto-synced to Google Sheets & Financial Dashboard.
                    </p>
                  </>
                ) : parsed.actionType === "invoice" ? (
                  <>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      📄 Draft Invoice Created for {parsed.clientName || "Client"}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      💵 Total: {formatCurrency(parsed.amount || 0, parsed.currency)}
                    </p>
                  </>
                ) : parsed.actionType === "summary" ? (
                  <>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">📊 Financial Summary</p>
                    <p className="text-zinc-700 dark:text-zinc-300">🟢 Paid Revenue: $18,443.75</p>
                    <p className="text-zinc-700 dark:text-zinc-300">🔴 Total Expenses: $1,406.44</p>
                    <p className="text-emerald-600 font-bold">📈 Net Cashflow: +$17,037.31</p>
                  </>
                ) : (
                  <p className="text-zinc-500">
                    💡 Enter an expense like: <i>"Spent $45 on lunch at Starbucks"</i>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Parsed Data Breakdown Card */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Structured Financial Data</h3>
                    <p className="text-xs text-zinc-500">Instant extraction & 2-way sync</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Google Sheets Ready
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Detected Amount</span>
                    <span className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
                      {parsed.amount ? formatCurrency(parsed.amount, parsed.currency) : "—"}
                    </span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Inferred Category</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {parsed.category || "GENERAL"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Merchant / Recipient</span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {parsed.merchant || parsed.clientName || "Auto-detected from context"}
                  </span>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Parsed Description</span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                    {parsed.description || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Ready to track all your expenses?</span>
              <a
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create Free Account <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
