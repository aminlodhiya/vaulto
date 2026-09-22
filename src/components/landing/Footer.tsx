import React from "react";
import Link from "next/link";
import { Receipt, Send, Table, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Tele<span className="text-indigo-400">Expense</span>
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed">
              Your AI-powered invoicing and Telegram financial sidekick. Integrated seamlessly with Google Sheets & Stripe.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="hover:text-white transition-colors">Invoicing Suite</Link></li>
              <li><Link href="/#demo" className="hover:text-white transition-colors">Telegram AI Bot</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Google Sheets 2-Way Sync</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Demo Dashboard</Link></li>
              <li><a href="https://github.com/al1abb/invoify" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Open Source Base (Invoify)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Security & Trust</h4>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Stripe & SSL Secured</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                End-to-end encrypted financial data. No banking credentials stored.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© {new Date().getFullYear()} TeleExpense Financial Suite. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for profitable indie fintech businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
