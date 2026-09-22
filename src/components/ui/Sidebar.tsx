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
  Sparkles,
  LogOut,
  ChevronRight,
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
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Invoices", href: "/invoices", icon: FileText },
    { label: "Create Invoice", href: "/invoices/new", icon: PlusCircle, highlight: true },
    { label: "Expense Tracker", href: "/expenses", icon: Receipt },
    { label: "Telegram Sidekick", href: "/telegram", icon: Send, badge: user?.telegramConnected ? "Active" : "Pair" },
    { label: "Google Sheets Sync", href: "/sheets", icon: Table, badge: "2-Way" },
    { label: "Clients", href: "/clients", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col h-screen sticky top-0 border-r border-zinc-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">
              Tele<span className="text-indigo-400">Expense</span>
            </h1>
            <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
              Fintech Pro
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
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
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : item.highlight ? "text-emerald-400 group-hover:text-emerald-300" : "text-zinc-400 group-hover:text-zinc-200"
                  )}
                />
                <span className={item.highlight && !isActive ? "text-zinc-200 font-semibold" : ""}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    isActive
                      ? "bg-indigo-500/80 text-white"
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
          <div className="pt-3">
            <button
              onClick={onOpenSimulator}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-800/40 text-sky-200 hover:border-sky-600/60 hover:text-white transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram Bot Test</span>
              </div>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                LIVE
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Subscription Tier Banner */}
      <div className="p-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/70 via-zinc-900 to-emerald-950/40 border border-indigo-900/50">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{user?.subscriptionTier?.toUpperCase() || "PRO"} PLAN</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium">
              Active
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-2.5">
            Unlimited invoices & Telegram AI expense parsing.
          </p>
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow transition-colors"
          >
            <Zap className="w-3 h-3" />
            Manage Tier
          </Link>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-white truncate">{user?.name || "User"}</p>
            <p className="text-[11px] text-zinc-400 truncate">{user?.businessName || user?.email || ""}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          title="Sign Out"
          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
