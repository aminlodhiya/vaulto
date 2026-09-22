"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { Check, ArrowRight } from "lucide-react";
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
            particleCount: 70,
            spread: 70,
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
      description: "For independent contractors and early-stage solo ventures.",
      monthlyPrice: "$0",
      annualPrice: "$0",
      popular: false,
      features: [
        "Up to 5 invoices / month",
        "20 expense logs / month",
        "Classic invoice templates",
        "Manual CSV exports",
        "Standard support",
      ],
      cta: "Get Started Free",
      color: "border-zinc-200 dark:border-zinc-800",
    },
    {
      id: "pro",
      name: "Professional",
      description: "Our complete suite for active freelancers, consultants, and operators.",
      monthlyPrice: "$19",
      annualPrice: "$15",
      period: "/ month",
      popular: true,
      badge: "MOST POPULAR",
      features: [
        "Unlimited invoices & client accounts",
        "Telegram AI receipt parsing bot",
        "Live 2-Way Google Sheets sync",
        "Automated recurring retainers",
        "Custom branding (Logo & Signature)",
        "Vector PDF exports with no watermark",
        "Stripe customer payment links",
      ],
      cta: "Upgrade to Pro",
      color: "border-zinc-900 dark:border-white shadow-md",
    },
    {
      id: "business",
      name: "Studio Scale",
      description: "For design agencies and development studios managing multi-client accounts.",
      monthlyPrice: "$49",
      annualPrice: "$39",
      period: "/ month",
      popular: false,
      features: [
        "Everything in Professional",
        "Multi-currency support (USD, EUR, GBP, CAD, INR)",
        "Custom domain hosted invoice links",
        "Priority webhook dispatch & logging",
        "Dedicated accountant export schema",
        "Direct Slack / Telegram channel support",
      ],
      cta: "Upgrade to Studio",
      color: "border-zinc-200 dark:border-zinc-800",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2 block">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Simple plans for every stage of growth
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Transparent pricing without surprise fees. Upgrade or cancel anytime with one click.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 bg-zinc-200/80 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                !annual
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                annual
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Annual Billing
              <span className="text-[10px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-1.5 py-0.2 rounded font-mono">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => {
            const isCurrentPlan = user?.subscriptionTier === p.id;
            const price = annual ? p.annualPrice : p.monthlyPrice;

            return (
              <div
                key={p.id}
                className={`bg-white dark:bg-zinc-950 rounded-xl p-8 border flex flex-col justify-between relative transition-all ${p.color}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded font-bold shadow-xs">
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {p.name}
                    </h3>
                    {isCurrentPlan && (
                      <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 min-h-[32px] mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-4xl font-bold font-mono text-zinc-900 dark:text-white">
                      {price}
                    </span>
                    {p.id !== "free" && (
                      <span className="text-xs text-zinc-500">
                        {p.period} {annual ? "(annual)" : ""}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-zinc-700 dark:text-zinc-300">
                    {p.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleCheckout(p.id as any)}
                    disabled={upgradingPlan === p.id || isCurrentPlan}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-2xs ${
                      p.popular
                        ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-750"
                    } ${isCurrentPlan ? "opacity-50 cursor-default" : ""}`}
                  >
                    {upgradingPlan === p.id ? (
                      "Connecting..."
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      <>
                        {p.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
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
