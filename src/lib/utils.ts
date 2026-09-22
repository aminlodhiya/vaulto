import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "CA$",
    AUD: "A$",
    INR: "₹",
    JPY: "¥",
  };

  const symbol = symbolMap[currency.toUpperCase()] || currency;
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function generateId(prefix: string = ""): string {
  const random = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36);
  return prefix ? `${prefix}_${time}${random}` : `${time}${random}`;
}

export function generateInvoiceNumber(existingCount: number = 0): string {
  const nextNum = (existingCount + 1).toString().padStart(4, "0");
  return `INV-${new Date().getFullYear()}-${nextNum}`;
}

export function generateTelegramToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
