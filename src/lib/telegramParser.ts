import { ExpenseCategory } from "./types";

export interface ParsedTelegramMessage {
  actionType: "expense" | "invoice" | "summary" | "help" | "connect" | "unknown";
  amount?: number;
  currency: string;
  category?: ExpenseCategory;
  merchant?: string;
  description: string;
  clientName?: string;
  tags: string[];
  connectCode?: string;
}

const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
  software: [
    "aws", "gcp", "azure", "github", "hosting", "domain", "vercel", "cloudflare",
    "saas", "subscription", "openai", "claude", "slack", "notion", "figma", "adobe",
    "software", "license", "api", "database", "mongodb", "tool", "app", "zoom"
  ],
  travel: [
    "uber", "lyft", "taxi", "flight", "airline", "hotel", "airbnb", "train", "metro",
    "gas", "fuel", "parking", "toll", "bus", "travel", "mileage", "scooter", "cab"
  ],
  meals: [
    "lunch", "dinner", "breakfast", "coffee", "starbucks", "restaurant", "cafe",
    "food", "burger", "pizza", "doordash", "ubereats", "groceries", "supermarket",
    "drinks", "bar", "meal", "snack"
  ],
  office: [
    "office", "desk", "chair", "monitor", "keyboard", "stationery", "paper",
    "printer", "coworking", "wework", "supplies", "hardware", "laptop", "mouse"
  ],
  marketing: [
    "ads", "advertising", "facebook ads", "google ads", "meta ads", "twitter ads",
    "campaign", "sponsorship", "seo", "newsletter", "marketing", "promotion", "flyer"
  ],
  contractor: [
    "contractor", "freelancer", "developer", "designer", "upwork", "fiverr",
    "consultant", "legal", "lawyer", "accounting", "cpa", "audit", "agency"
  ],
  utilities: [
    "internet", "wifi", "broadband", "electricity", "water", "phone", "mobile",
    "sim", "power", "utility", "cellular", "bill"
  ],
  other: [],
};

export function parseTelegramMessage(text: string): ParsedTelegramMessage {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Command: Help
  if (lower.startsWith("/help") || lower === "help") {
    return {
      actionType: "help",
      currency: "USD",
      description: "Help command",
      tags: [],
    };
  }

  // Command: Summary
  if (lower.startsWith("/summary") || lower.startsWith("/stats") || lower === "summary" || lower === "stats" || lower === "balance") {
    return {
      actionType: "summary",
      currency: "USD",
      description: "Financial summary inquiry",
      tags: [],
    };
  }

  // Command: Connect account with 6-digit code
  if (lower.startsWith("/connect") || lower.startsWith("/start")) {
    const parts = trimmed.split(" ");
    const code = parts[1] || "";
    return {
      actionType: "connect",
      connectCode: code.replace(/[^0-9]/g, ""),
      currency: "USD",
      description: "Connect Telegram Account",
      tags: [],
    };
  }

  // Command: Quick Invoice creation (e.g. /invoice Acme Corp 500 Web design)
  if (lower.startsWith("/invoice") || lower.startsWith("/bill")) {
    const match = trimmed.match(/^\/(?:invoice|bill)\s+([A-Za-z0-9\s.,-]+?)\s+(\$|€|£|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:([A-Za-z]{3}))?\s*(.*)$/i);
    if (match) {
      const clientName = match[1].trim();
      const amount = parseFloat(match[3]);
      const currencySymbol = match[2];
      const currencyCode = match[4];
      const desc = match[5]?.trim() || "Professional Services";

      let detectedCurrency = "USD";
      if (currencySymbol === "€" || currencyCode?.toUpperCase() === "EUR") detectedCurrency = "EUR";
      if (currencySymbol === "£" || currencyCode?.toUpperCase() === "GBP") detectedCurrency = "GBP";
      if (currencySymbol === "₹" || currencyCode?.toUpperCase() === "INR") detectedCurrency = "INR";

      return {
        actionType: "invoice",
        amount,
        currency: detectedCurrency,
        clientName,
        description: desc,
        tags: ["telegram-invoice"],
      };
    }
  }

  // Standard Expense Entry Parser:
  // Examples:
  // "Spent $45 on lunch with client Acme"
  // "Uber to airport $32.50 category:travel"
  // "Server hosting 120"
  // "45.50 lunch at chipotle"
  // "Bought 12.99 coffee"

  // 1. Extract Tags (#tag or category:name)
  const tags: string[] = [];
  const tagMatches = trimmed.match(/#([a-zA-Z0-9_-]+)/g);
  if (tagMatches) {
    tagMatches.forEach((t) => tags.push(t.replace("#", "").toLowerCase()));
  }

  // 2. Extract Category override if specified
  let explicitCategory: ExpenseCategory | undefined;
  const catMatch = trimmed.match(/(?:category|cat):\s*([a-zA-Z]+)/i);
  if (catMatch) {
    const c = catMatch[1].toLowerCase() as ExpenseCategory;
    if (Object.keys(CATEGORY_KEYWORDS).includes(c)) {
      explicitCategory = c;
    }
  }

  // 3. Extract Currency
  let currency = "USD";
  if (trimmed.includes("€") || lower.includes(" eur ") || lower.endsWith(" eur") || lower.startsWith("eur ")) currency = "EUR";
  else if (trimmed.includes("£") || lower.includes(" gbp ") || lower.endsWith(" gbp") || lower.startsWith("gbp ")) currency = "GBP";
  else if (trimmed.includes("₹") || lower.includes(" inr ") || lower.endsWith(" inr") || lower.startsWith("inr ")) currency = "INR";
  else if (trimmed.includes("CA$") || lower.includes(" cad ")) currency = "CAD";

  // 4. Extract Amount
  // Matches: $45, $45.50, 45.50, 1,200.50, 45$ etc.
  let amount: number | undefined;
  const amountRegex = /(?:[\$€£₹]\s*|CAD\s*|USD\s*|EUR\s*|GBP\s*|INR\s*)?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)(?:\s*(?:[\$€£₹]|CAD|USD|EUR|GBP|INR|bucks|dollars))?/i;
  
  // Find numbers in text
  const tokens = trimmed.split(/\s+/);
  for (const token of tokens) {
    const numClean = token.replace(/[\$€£₹,]/g, "");
    if (/^[0-9]+(?:\.[0-9]{1,2})?$/.test(numClean)) {
      const val = parseFloat(numClean);
      if (!isNaN(val) && val > 0) {
        amount = val;
        break;
      }
    }
  }

  if (amount === undefined) {
    const match = trimmed.match(amountRegex);
    if (match && match[1]) {
      amount = parseFloat(match[1].replace(/,/g, ""));
    }
  }

  // 5. Clean Description and Extract Merchant
  let cleanDesc = trimmed
    .replace(/(?:category|cat):\s*[a-zA-Z]+/gi, "")
    .replace(/#([a-zA-Z0-9_-]+)/g, "")
    .replace(/(?:spent|paid|bought|purchase|for|on|cost)\s+/gi, " ")
    .replace(/[\$€£₹]/g, "")
    .trim();

  // If amount was found, remove amount token from description
  if (amount !== undefined) {
    cleanDesc = cleanDesc.replace(new RegExp(`\\b${amount}\\b`), "").trim();
  }

  cleanDesc = cleanDesc.replace(/\s+/g, " ").trim();
  if (!cleanDesc) {
    cleanDesc = explicitCategory ? `${explicitCategory} expense` : "General expense";
  }

  // 6. Infer Category if not explicit
  let inferredCategory: ExpenseCategory = explicitCategory || "other";
  if (!explicitCategory) {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (category === "other") continue;
      const found = keywords.some((kw) => lower.includes(kw));
      if (found) {
        inferredCategory = category as ExpenseCategory;
        break;
      }
    }
  }

  // 7. Infer Merchant
  let merchant: string | undefined;
  const merchantClues = [
    "uber", "starbucks", "mcdonalds", "aws", "google", "amazon", "apple", "github",
    "vercel", "stripe", "netflix", "doordash", "walmart", "target", "costco",
    "chipotle", "subway", "slack", "notion", "figma", "adobe", "zoom", "airbnb"
  ];
  for (const m of merchantClues) {
    if (lower.includes(m)) {
      merchant = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }

  if (amount !== undefined && amount > 0) {
    return {
      actionType: "expense",
      amount,
      currency,
      category: inferredCategory,
      merchant,
      description: cleanDesc,
      tags,
    };
  }

  return {
    actionType: "unknown",
    currency: "USD",
    description: trimmed,
    tags: [],
  };
}
