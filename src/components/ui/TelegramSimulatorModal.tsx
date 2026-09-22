"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Bot,
  User as UserIcon,
  Sparkles,
  HelpCircle,
  BarChart3,
  Receipt,
  CheckCircle2,
  Paperclip,
  Smile,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface TelegramSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseCreated?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  parsed?: any;
}

export function TelegramSimulatorModal({
  isOpen,
  onClose,
  onExpenseCreated,
}: TelegramSimulatorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "👋 <b>Hey Alex!</b> I'm your TeleExpense financial sidekick.\n\nJust send me what you spent or ask for your stats, for example:\n• <code>Spent $45 on lunch with Acme</code>\n• <code>Uber $28.50 category:travel</code>\n• <code>/summary</code>",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/telegram/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.createdExpense || data.createdInvoice) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
          });
          if (onExpenseCreated) onExpenseCreated();
        }

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          parsed: data.parsed,
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "⚠️ Sorry, could not process that message. Try: <code>Spent $45 on lunch</code>",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "⚠️ Connection error occurred. Please try again.",
          timestamp: "Now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Spent $42.50 on dinner with client Acme",
    "AWS hosting $120 #software",
    "Uber ride to airport $35.00 category:travel",
    "/summary",
    "/invoice Lumina Labs 750 Landing page build",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[640px] max-h-[90vh]">
        {/* Telegram Header */}
        <div className="bg-[#24A1DE] text-white px-4 py-3 flex items-center justify-between shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">TeleExpense Bot</h3>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                  SIMULATOR
                </span>
              </div>
              <p className="text-xs text-sky-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                online • AI NLP sidekick
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Chat Wallpaper Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFE7DE]/30 dark:bg-zinc-950/60 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-[#24A1DE] text-white flex items-center justify-center text-xs shrink-0 mb-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                  m.sender === "user"
                    ? "bg-[#24A1DE] text-white rounded-br-none"
                    : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 rounded-bl-none"
                }`}
              >
                <div
                  className="whitespace-pre-wrap leading-relaxed select-text"
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />

                <div
                  className={`text-[10px] mt-1 text-right font-mono ${
                    m.sender === "user" ? "text-sky-100" : "text-zinc-400"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 italic p-2 bg-white/60 dark:bg-zinc-800/60 rounded-xl w-fit border border-zinc-200 dark:border-zinc-700">
              <Bot className="w-3.5 h-3.5 text-[#24A1DE] animate-spin" />
              TeleExpense AI is parsing your message...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type: 'Spent $45 on lunch' or '/summary'..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#24A1DE] focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-white outline-none transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-[#24A1DE] hover:bg-[#1f8fcd] disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
