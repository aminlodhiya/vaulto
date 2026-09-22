"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/components/providers/AuthProvider";
import { TelegramLog } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Send,
  Bot,
  Sparkles,
  Copy,
  CheckCircle,
  RefreshCw,
  Zap,
  MessageSquare,
  ShieldCheck,
  Table,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function TelegramPage() {
  const { user, refreshUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string; time: string }[]
  >([
    {
      id: "1",
      sender: "bot",
      text: "👋 <b>Hey Alex!</b> I'm your TeleExpense financial sidekick on Telegram.\n\nYou can send me any expense you make, like:\n• <code>Spent $45 on lunch with Acme</code>\n• <code>Uber $28.50 category:travel</code>\n• <code>/summary</code>",
      time: "10:00 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<TelegramLog[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        // fetch telegram simulate to get logs if any
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCopyCode = () => {
    const code = `/connect ${user?.telegramSyncToken || "748291"}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleConnection = async () => {
    try {
      await fetch("/api/telegram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-connect" }),
      });
      await refreshUser();
      confetti({ particleCount: 40, spread: 60 });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || sending) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user" as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/telegram/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.createdExpense || data.createdInvoice) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        }
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: data.replyText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        if (data.logs) setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const sampleCommands = [
    "Spent $48.50 on lunch with client Acme",
    "AWS cloud hosting $145.20 #software",
    "Uber to meeting $26.80 category:travel",
    "/invoice Acme Corp 600 Web design sprint",
    "/summary",
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Telegram Financial Sidekick"
          subtitle="Pair your Telegram bot for hands-free NLP expense logging & instant invoice drafts."
        />

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Pairing Info Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Setup Guide */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#24A1DE] text-white flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                      Telegram Bot Sync Setup
                    </h3>
                    <p className="text-xs text-zinc-500">Pair your account in 2 steps</p>
                  </div>
                </div>

                <button
                  onClick={handleToggleConnection}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    user?.telegramConnected
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {user?.telegramConnected ? "● Connected" : "○ Disconnected"}
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Start the Bot on Telegram</p>
                    <p className="text-zinc-500 mt-0.5">
                      Open Telegram and search for <b>@TeleExpenseBot</b> (or configure your own Telegram bot token in .env).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900 dark:text-white">Send your 6-digit Sync Code</p>
                    <p className="text-zinc-500 mt-0.5 mb-2">
                      Send the following command to link your account:
                    </p>
                    <div className="flex items-center gap-2 p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-mono text-xs border border-zinc-200 dark:border-zinc-700">
                      <span className="flex-1 text-indigo-600 dark:text-indigo-400 font-bold">
                        /connect {user?.telegramSyncToken || "748291"}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        title="Copy command"
                      >
                        {copied ? (
                          <span className="text-[10px] text-emerald-500 font-sans font-bold">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    No configuration needed for testing — the interactive simulator on the right is live right now!
                  </span>
                </div>
              </div>
            </div>

            {/* Live Telegram Interactive Chat Phone View */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden flex flex-col h-[520px]">
              {/* Telegram App Header */}
              <div className="bg-[#24A1DE] text-white p-3.5 flex items-center justify-between shadow">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs tracking-tight">TeleExpense Sidekick Bot</h4>
                    <p className="text-[10px] text-sky-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      bot • online
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                  LIVE SIMULATOR
                </span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFE7DE]/30 dark:bg-zinc-950/60 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-end gap-1.5 ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                        m.sender === "user"
                          ? "bg-[#24A1DE] text-white rounded-br-none"
                          : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 rounded-bl-none"
                      }`}
                    >
                      <div
                        className="whitespace-pre-wrap leading-relaxed select-text"
                        dangerouslySetInnerHTML={{ __html: m.text }}
                      />
                      <span
                        className={`text-[9px] mt-1 block text-right font-mono ${
                          m.sender === "user" ? "text-sky-100" : "text-zinc-400"
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex items-center gap-1.5 text-zinc-500 italic p-2 bg-white/60 dark:bg-zinc-800/60 rounded-xl w-fit">
                    <Bot className="w-3 h-3 text-[#24A1DE] animate-spin" />
                    Parsing expense text...
                  </div>
                )}
              </div>

              {/* Prompt Suggestions */}
              <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto flex gap-1.5 no-scrollbar">
                {sampleCommands.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(c)}
                    className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors shrink-0"
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send: 'Spent $45 on lunch' or '/summary'..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-[#24A1DE]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="w-8 h-8 rounded-xl bg-[#24A1DE] hover:bg-[#1f8fcd] disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
