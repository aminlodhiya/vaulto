"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { TelegramSimulatorModal } from "@/components/ui/TelegramSimulatorModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { Expense, ExpenseCategory } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Receipt,
  Plus,
  Search,
  Download,
  Trash2,
  Send,
  Table,
  Sparkles,
  Tag,
  DollarSign,
  Calendar,
  Building,
  CheckCircle,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // New Expense Form State
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("software");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      if (data.expenses) setExpenses(data.expenses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: num,
          category,
          description: description || "General expense",
          merchant,
          date,
          tags: tagList,
          source: "web",
        }),
      });

      if (res.ok) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
        setModalOpen(false);
        setAmount("");
        setDescription("");
        setMerchant("");
        setTags("");
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = categoryFilter === "all" || e.category === categoryFilter;
    const matchesSrc = sourceFilter === "all" || e.source === sourceFilter;
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.merchant && e.merchant.toLowerCase().includes(search.toLowerCase())) ||
      (e.tags && e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return matchesCat && matchesSrc && matchesSearch;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getSourceBadge = (source: Expense["source"]) => {
    switch (source) {
      case "telegram":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#24A1DE]/10 text-[#24A1DE] border border-[#24A1DE]/20">
            <Send className="w-2.5 h-2.5" /> Telegram Bot
          </span>
        );
      case "sheets":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Table className="w-2.5 h-2.5" /> Google Sheets
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Web Entry
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar onOpenSimulator={() => setSimulatorOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Expense Tracker"
          subtitle="Log receipts, auto-sync with Telegram & Google Sheets, and categorize business spend."
          onOpenSimulator={() => setSimulatorOpen(true)}
        >
          <a
            href="/api/sheets/export?type=expenses"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Expense
          </button>
        </Header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Summary Metric Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-zinc-900 to-sky-950 p-6 rounded-2xl border border-indigo-800/50 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Total Filtered Spend
              </span>
              <h2 className="text-3xl font-extrabold font-mono mt-1">
                {formatCurrency(totalFilteredAmount, user?.currency)}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {filteredExpenses.length} transactions across categories
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimulatorOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#24A1DE] hover:bg-[#1f8fcd] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Telegram Quick-Log Bot
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category selector */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="software">Software & SaaS</option>
                <option value="travel">Travel & Rides</option>
                <option value="meals">Meals & Food</option>
                <option value="office">Office & Hardware</option>
                <option value="marketing">Marketing & Ads</option>
                <option value="contractor">Contractors & Freelance</option>
                <option value="utilities">Utilities & Internet</option>
                <option value="other">Other Spend</option>
              </select>

              {/* Source selector */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
              >
                <option value="all">All Sources</option>
                <option value="telegram">Telegram Bot</option>
                <option value="web">Web Entry</option>
                <option value="sheets">Google Sheets Sync</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search merchant, tag, note..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-zinc-500">Loading expenses...</div>
            ) : filteredExpenses.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 space-y-3">
                <Receipt className="w-10 h-10 mx-auto text-zinc-400" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  No expenses recorded in this view.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Expense
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Date</th>
                      <th className="py-3.5 px-5">Merchant / Item</th>
                      <th className="py-3.5 px-5">Category</th>
                      <th className="py-3.5 px-5">Source</th>
                      <th className="py-3.5 px-5">Amount</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                    {filteredExpenses.map((exp) => (
                      <tr
                        key={exp.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-4 px-5 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                          {formatDate(exp.date)}
                        </td>

                        <td className="py-4 px-5">
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {exp.merchant || exp.description}
                          </p>
                          {exp.merchant && exp.description && exp.merchant !== exp.description && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {exp.description}
                            </p>
                          )}
                          {exp.tags && exp.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {exp.tags.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {exp.category}
                          </span>
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          {getSourceBadge(exp.source)}
                        </td>

                        <td className="py-4 px-5 font-mono font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(exp.amount, exp.currency)}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Add Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                Log New Expense
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 45.50"
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  >
                    <option value="software">Software & SaaS</option>
                    <option value="travel">Travel & Rides</option>
                    <option value="meals">Meals & Food</option>
                    <option value="office">Office & Hardware</option>
                    <option value="marketing">Marketing & Ads</option>
                    <option value="contractor">Contractors</option>
                    <option value="utilities">Utilities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Merchant / Payee
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. AWS, Uber, Starbucks, Figma"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Description / Notes
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Cloud hosting sprint 2"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. cloud, client, tax-deductible"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  {submitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TelegramSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onExpenseCreated={fetchExpenses}
      />
    </div>
  );
}
