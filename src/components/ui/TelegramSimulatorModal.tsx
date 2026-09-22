"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Bot,
  Terminal,
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
      text: "👋 <b>Welcome to Vaulto Bot.</b>\n\nSend expenses naturally from Telegram:\n• <code>Spent $45 on lunch with Acme</code>\n• <code>AWS compute $120.00 #software</code>\n• <code>/summary</code>",
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
            particleCount: 30,
            spread: 50,
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
            text: "⚠️ Could not parse expense. Format like: <code>Spent $45 on lunch</code>",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-zinc-900 text-white px-4 py-3 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs tracking-tight">Vaulto Telegram Bot</h3>
                <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded">
                  SIMULATOR
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                online • nlp parser active
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-900/60 font-sans text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs ${
                  m.sender === "user"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-br-xs"
                    : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-xs shadow-2xs"
                }`}
              >
                <div
                  className="whitespace-pre-wrap leading-relaxed select-text font-sans"
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />

                <div
                  className={`text-[9px] mt-1 text-right font-mono ${
                    m.sender === "user" ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 italic p-2 bg-white dark:bg-zinc-800 rounded-md w-fit border border-zinc-200 dark:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping"></span>
              Parsing NLP text...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Chips */}
        <div className="px-3 py-1.5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors shrink-0 font-mono"
            >
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
          className="p-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type: 'Spent $45 on lunch' or '/summary'..."
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
