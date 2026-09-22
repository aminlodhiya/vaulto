"use client";

import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { PricingSection } from "@/components/landing/PricingSection";

export default function PricingPage() {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title="Subscription & Billing"
          subtitle="Choose the right plan to power your freelancing & agency finances."
        />
        <div className="p-6 max-w-7xl mx-auto w-full pb-20">
          <PricingSection />
        </div>
      </div>
    </div>
  );
}
