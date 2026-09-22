import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "TeleExpense completely changed how I bill clients. Being able to text my Telegram bot 'Spent $45 on lunch with Acme' and having it show up in my Google Sheet & monthly invoice is pure magic.",
      name: "Jordan Hayes",
      role: "Freelance Senior UI/UX Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "We replaced our heavy QuickBooks setup with TeleExpense for our 4-person design studio. Cleaner invoices, instant PDF exports, and our clients pay directly on Stripe.",
      name: "Marcus Vance",
      role: "Founder, Studio Vance London",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "The Google Sheets 2-way sync keeps my accountant completely happy, while the Telegram bot lets me log expenses in 2 seconds while waiting for an Uber. 10/10 product.",
      name: "Elena Zhang",
      role: "Full-Stack Contractor",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Loved by 2,400+ Creators
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-2 tracking-tight">
            Built for people who do real work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
