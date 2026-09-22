"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { Check, Zap, Sparkles, Shield, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCheckout = async (plan: "free" | "pro" | "business") => {
    if (plan === "free") {
      window.location.href = user ? "/dashboard" : "/register";
      return;
    }

    setUpgradingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          interval: annual ? "yearly" : "monthly",
        }),
      });

      const data = await res.json();
      if (data.url) {
        if (data.mock) {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Starter",
      description: "Perfect for new freelancers exploring the platform.",
      monthlyPrice: "$0",
      annualPrice: "$0",
      popular: false,
      features: [
        "Up to 5 invoices / month",
        "20 expense entries / month",
        "Classic invoice templates",
        "Manual CSV exports",
        "Email support",
      ],
      cta: "Get Started Free",
      color: "border-zinc-200 dark:border-zinc-800",
    },
    {
      id: "pro",
      name: "Pro Sidekick",
      description: "Our most popular plan for active freelancers & contractors.",
      monthlyPrice: "$19",
      annualPrice: "$15",
      period: "/ month",
      popular: true,
      badge: "MOST POPULAR",
      features: [
        "Unlimited invoices & clients",
        "Telegram AI expense logging bot",
        "Live 2-Way Google Sheets sync",
        "Automated recurring invoices",
        "Custom branding (Logo & Signature)",
        "Vector-sharp PDF downloads",
        "Stripe payment links for clients",
      ],
      cta: "Upgrade to Pro",
      color: "border-indigo-600 ring-2 ring-indigo-500/30",
    },
    {
      id: "business",
      name: "Business Scale",
      description: "For agencies and studios managing multiple client retainers.",
      monthlyPrice: "$49",
      annualPrice: "$39",
      period: "/ month",
      popular: false,
      features: [
        "Everything in Pro Tier",
        "Multi-currency support (USD, EUR, GBP, CAD, INR)",
        "Custom domain invoice links",
        "Priority Telegram webhook dispatch",
        "Dedicated Accountant export format",
        "Priority 24/7 Slack / Telegram support",
      ],
      cta: "Upgrade to Business",
      color: "border-zinc-200 dark:border-zinc-800",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-2 tracking-tight">
            Ready to monetize & scale your revenue
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Start free, upgrade whenever you need unlimited Telegram AI sync and Google Sheets live automation.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white dark:bg-zinc-800 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !annual
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annual
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Annual Billing
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const isCurrentPlan = user?.subscriptionTier === p.id;
            const price = annual ? p.annualPrice : p.monthlyPrice;

            return (
              <div
                key={p.id}
                className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border shadow-sm flex flex-col justify-between relative ${p.color}`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {p.name}
                    </h3>
                    {isCurrentPlan && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 min-h-[32px] mb-6">
                    {p.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-white">
                      {price}
                    </span>
                    {p.id !== "free" && (
                      <span className="text-xs text-zinc-500">
                        {p.period} {annual ? "(billed annually)" : ""}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-zinc-700 dark:text-zinc-300">
                    {p.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleCheckout(p.id as any)}
                    disabled={upgradingPlan === p.id || isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      p.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    } ${isCurrentPlan ? "opacity-60 cursor-default" : ""}`}
                  >
                    {upgradingPlan === p.id ? (
                      "Connecting Stripe..."
                    ) : isCurrentPlan ? (
                      "Your Active Plan"
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        {p.cta}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
