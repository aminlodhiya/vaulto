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
  Copy,
  CheckCircle,
  ShieldCheck,
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
      text: "👋 <b>Welcome to Vaulto Bot.</b>\n\nSend expenses directly from your Telegram app:\n• <code>Spent $45 on lunch with Acme</code>\n• <code>Uber $28.50 category:travel</code>\n• <code>/summary</code>",
      time: "10:00 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<TelegramLog[]>([]);

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
      confetti({ particleCount: 30, spread: 50 });
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
    <div className="flex h-screen bg-[#fbfbfa] dark:bg-[#09090b] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Telegram Expense Intelligence"
          subtitle="Pair your Telegram bot for hands-free NLP expense logging & instant invoice drafts."
        />

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Pairing Info Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Setup Guide */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0c0d0e] p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900 dark:text-white">
                      Telegram Bot Sync Setup
                    </h3>
                    <p className="text-[11px] text-zinc-500">Pair your account in 2 steps</p>
                  </div>
                </div>

                <button
                  onClick={handleToggleConnection}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                    user?.telegramConnected
                      ? "bg-blue-950/60 text-blue-300 border border-blue-800"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {user?.telegramConnected ? "● Connected" : "○ Disconnected"}
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-900/50">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white text-xs">Start the Bot on Telegram</p>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Open Telegram and search for <b className="text-blue-600 dark:text-blue-400">@VaultoBot</b> (or configure your own token in .env).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-900/50">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-white text-xs">Send your 6-digit Sync Code</p>
                    <p className="text-zinc-500 text-[11px] mt-0.5 mb-2">
                      Send the following command to link your account:
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg font-mono text-xs border border-blue-200/60 dark:border-blue-900/40">
                      <span className="flex-1 text-blue-600 dark:text-blue-400 font-bold">
                        /connect {user?.telegramSyncToken || "748291"}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                        title="Copy command"
                      >
                        {copied ? (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-sans font-bold">Copied!</span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>
                    No external configuration needed for testing — the interactive simulator on the right is live!
                  </span>
                </div>
              </div>
            </div>

            {/* Live Telegram Interactive Chat Phone View */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0c0d0e] rounded-xl border border-zinc-200/80 dark:border-zinc-850 shadow-2xs overflow-hidden flex flex-col h-[500px]">
              {/* Telegram App Header */}
              <div className="bg-slate-950 text-white p-3 flex items-center justify-between border-b border-blue-950/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs tracking-tight">Vaulto NLP Bot</h4>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block animate-pulse"></span>
                      online • simulator
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                  LIVE
                </span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs font-sans">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-end gap-1.5 ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2.5 shadow-2xs text-xs ${
                        m.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-xs"
                          : "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/80 rounded-bl-xs"
                      }`}
                    >
                      <div
                        className="whitespace-pre-wrap leading-relaxed select-text"
                        dangerouslySetInnerHTML={{ __html: m.text }}
                      />
                      <span
                        className={`text-[9px] mt-1 block text-right font-mono ${
                          m.sender === "user" ? "text-blue-100" : "text-zinc-400"
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex items-center gap-1.5 text-blue-500 italic p-2 bg-white dark:bg-zinc-800 rounded-lg w-fit text-xs border border-blue-200 dark:border-blue-900/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                    Parsing NLP text...
                  </div>
                )}
              </div>

              {/* Prompt Suggestions */}
              <div className="px-3 py-1.5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto flex gap-1.5 no-scrollbar">
                {sampleCommands.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(c)}
                    className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors shrink-0 font-mono"
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
                className="p-2.5 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send: 'Spent $45 on lunch' or '/summary'..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-sm shadow-blue-500/20"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
