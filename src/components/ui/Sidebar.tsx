"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Receipt,
  Send,
  Table,
  Users,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenSimulator?: () => void;
}

export function Sidebar({ onOpenSimulator }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Invoices", href: "/invoices", icon: FileText },
    { label: "Create Invoice", href: "/invoices/new", icon: PlusCircle, highlight: true },
    { label: "Expense Ledger", href: "/expenses", icon: Receipt },
    { label: "Telegram Bot", href: "/telegram", icon: Send, badge: user?.telegramConnected ? "Active" : "Pair" },
    { label: "Google Sheets", href: "/sheets", icon: Table, badge: "2-Way" },
    { label: "Clients", href: "/clients", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0c0d0e] text-zinc-300 flex flex-col h-screen sticky top-0 border-r border-zinc-850 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-sm shadow-xs">
            V
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight leading-none">
              Vaulto
            </h1>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
              Financial OS
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          Main Menu
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/invoices/new");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-zinc-800 text-white shadow-2xs font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : item.highlight ? "text-emerald-400 group-hover:text-emerald-300" : "text-zinc-400 group-hover:text-zinc-200"
                  )}
                />
                <span className={item.highlight && !isActive ? "text-zinc-200 font-medium" : ""}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded font-medium",
                    isActive
                      ? "bg-zinc-700 text-white"
                      : item.badge === "Active"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-zinc-800 text-zinc-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Telegram Interactive Simulator Trigger Button */}
        {onOpenSimulator && (
          <div className="pt-4">
            <button
              onClick={onOpenSimulator}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-zinc-400" />
                <span>Test Telegram Bot</span>
              </div>
              <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                SIM
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Subscription Tier Box */}
      <div className="p-3">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold text-white uppercase">
              {user?.subscriptionTier || "PRO"} PLAN
            </span>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.2 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-2.5">
            Unlimited invoices & Telegram NLP sync.
          </p>
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
          >
            <Zap className="w-3 h-3" />
            Manage Subscription
          </Link>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-zinc-850 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-white truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-zinc-400 truncate">{user?.businessName || user?.email || ""}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          title="Sign Out"
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded-md transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
