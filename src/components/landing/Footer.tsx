import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#09090b] text-zinc-400 border-t border-zinc-800 py-16 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
                V
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Vaulto
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              The financial operating system for modern solo studios and operators. Invoicing, Telegram expense intelligence, and Google Sheets sync.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 font-mono uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#features" className="hover:text-white transition-colors">Invoicing Engine</Link></li>
              <li><Link href="/#demo" className="hover:text-white transition-colors">Telegram NLP Bot</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Google Sheets Sync</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 font-mono uppercase tracking-wider text-[11px]">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Live Dashboard</Link></li>
              <li><a href="https://github.com/al1abb/invoify" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Open Source Core</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 font-mono uppercase tracking-wider text-[11px]">Security</h4>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-200 font-medium text-xs">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stripe & SSL Secured</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                End-to-end encrypted financial ledger. No banking credentials stored.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© {new Date().getFullYear()} Vaulto Financial Technologies Inc. All rights reserved.</p>
          <p>
            Built for profitable indie studios and high-volume solo operators.
          </p>
        </div>
      </div>
    </footer>
  );
}
