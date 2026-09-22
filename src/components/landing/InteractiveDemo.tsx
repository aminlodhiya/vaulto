"use client";

import React, { useState } from "react";
import {
  Send,
  Sparkles,
  Bot,
  Table,
  CheckCircle,
  ArrowRight,
  Terminal,
  Receipt,
} from "lucide-react";
import { parseTelegramMessage } from "@/lib/telegramParser";
import { formatCurrency } from "@/lib/utils";

export function InteractiveDemo() {
  const [inputText, setInputText] = useState("Spent $65 on client lunch at Chipotle");
  const parsed = parseTelegramMessage(inputText);

  const samplePrompts = [
    "Spent $65 on client lunch at Chipotle",
    "AWS cloud compute $120.00 #software",
    "Uber ride to terminal $34.50 category:travel",
    "/invoice Lumina Labs 850 Frontend sprint",
    "/summary",
  ];

  return (
    <section id="demo" className="py-20 bg-zinc-100/60 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block font-semibold">
            LIVE PARSER ENGINE
          </span>
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Intelligent NLP parsing & structured data extraction
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Send raw natural sentences. Vaulto extracts the numerical amount, merchant entity, and financial category automatically.
          </p>
        </div>

        {/* Console & Data Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Console */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Telegram Ingestion Simulator</h3>
                    <p className="text-[11px] text-zinc-500 font-mono">nlp_engine: v2.4-active</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-medium">
                  REAL-TIME
                </span>
              </div>

              {/* Input */}
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Type an expense message:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Spent $45 on lunch at Chipotle"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Sample prompt chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/60 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200/80 dark:border-zinc-800 font-mono cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Bot Response */}
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Simulated Bot Response Output
              </p>
              <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg text-xs space-y-1 font-mono">
                {parsed.actionType === "expense" && parsed.amount ? (
                  <>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-sans">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Transaction Recorded
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Amount: <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{formatCurrency(parsed.amount, parsed.currency)}</span>
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Category: <span className="text-zinc-900 dark:text-zinc-200 uppercase">{parsed.category || "OTHER"}</span>
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Merchant: <span className="text-zinc-900 dark:text-zinc-200">{parsed.merchant || "Auto-detected"}</span>
                    </p>
                    <p className="text-[11px] text-zinc-500 pt-1 font-sans">
                      &rarr; Synchronized with Google Sheets and active dashboard.
                    </p>
                  </>
                ) : parsed.actionType === "invoice" ? (
                  <>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      Draft Invoice Created for {parsed.clientName || "Client"}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Total: <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{formatCurrency(parsed.amount || 0, parsed.currency)}</span>
                    </p>
                  </>
                ) : parsed.actionType === "summary" ? (
                  <>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">Vaulto Financial Overview</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Paid Revenue: $18,443.75</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Total Expenses: $1,406.44</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">Net Cashflow: +$17,037.31</p>
                  </>
                ) : (
                  <p className="text-zinc-500 font-sans">
                    Enter an expense string to test NLP extraction.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Parsed Data Breakdown */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center">
                    <Table className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Structured Output Schema</h3>
                    <p className="text-[11px] text-zinc-500 font-mono">format: json / sheet_row</p>
                  </div>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium">
                  google_sheets_v4
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">Amount Value</span>
                    <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                      {parsed.amount ? formatCurrency(parsed.amount, parsed.currency) : "—"}
                    </span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">Taxonomy Category</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono">
                      {parsed.category || "GENERAL"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Merchant / Counterparty</span>
                  <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {parsed.merchant || parsed.clientName || "Extracted from message"}
                  </span>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Normalized Ledger Note</span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                    {parsed.description || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Ready to automate your financial records?</span>
              <a
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create Account <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
