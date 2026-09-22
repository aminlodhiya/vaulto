import React from "react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Vaulto fundamentally changed how I bill clients and track project expenses. Texting receipts on Telegram and having them auto-categorized into my Google Sheet and monthly invoices saves me 5 hours every month.",
      name: "Jordan Hayes",
      role: "Principal Product Designer, Studio North",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "We decommissioned our cumbersome accounting software. Vaulto gives our small team crisp branded invoices, direct Stripe payments, and instant cashflow clarity.",
      name: "Marcus Vance",
      role: "Managing Director, Vance Studio London",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "The two-way Google Sheets sync keeps our bookkeeper perfectly aligned, while the Telegram bot lets me log business meals in two seconds right after getting the check.",
      name: "Elena Zhang",
      role: "Full-Stack Engineering Consultant",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2 block">
            PROVEN IN PRODUCTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Trusted by independent operators globally
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover grayscale"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
