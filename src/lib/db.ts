import fs from "fs";
import path from "path";
import {
  User,
  Client,
  Invoice,
  Expense,
  TelegramLog,
  FinancialSummary,
  ExpenseCategory,
} from "./types";
import { generateId, generateInvoiceNumber } from "./utils";
import bcrypt from "bcryptjs";

interface DatabaseSchema {
  users: User[];
  clients: Client[];
  invoices: Invoice[];
  expenses: Expense[];
  telegramLogs: TelegramLog[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  ensureDataDir();
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse db.json, re-initializing:", e);
    }
  }
  const initial = getInitialSeededData();
  saveDatabase(initial);
  return initial;
}

function saveDatabase(data: DatabaseSchema): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function getInitialSeededData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("demo1234", salt);

  const demoUser: User = {
    id: "usr_demo123",
    email: "demo@vaulto.io",
    passwordHash,
    name: "Alex Morgan",
    businessName: "Nexus Digital Studio",
    businessAddress: "742 Evergreen Terrace, Suite 400, San Francisco, CA 94107",
    businessEmail: "billing@nexusdigital.io",
    businessPhone: "+1 (555) 234-5678",
    taxNumber: "US-88392019",
    currency: "USD",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    subscriptionTier: "pro",
    telegramConnected: true,
    telegramChatId: "987654321",
    telegramSyncToken: "748291",
    googleSheetsConfig: {
      spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit",
      sheetName: "Finances 2026",
      isConnected: true,
      lastSyncedAt: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
  };

  const clients: Client[] = [
    {
      id: "cli_acme",
      userId: demoUser.id,
      name: "Sarah Jenkins",
      company: "Acme Innovations Inc.",
      email: "sarah@acme-innovations.com",
      address: "100 Tech Blvd, Austin, TX 78701",
      phone: "+1 (512) 555-0199",
      taxId: "TX-998822",
      currency: "USD",
      notes: "Net 30 payment terms. Monthly retainer for product design.",
      createdAt: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "cli_lumina",
      userId: demoUser.id,
      name: "David Chen",
      company: "Lumina Labs UK",
      email: "finance@luminalabs.co.uk",
      address: "45 Silicon Roundabout, London, EC1V 1AB, UK",
      phone: "+44 20 7946 0912",
      taxId: "GB-99238471",
      currency: "USD",
      notes: "Quarterly web app development contracts.",
      createdAt: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "cli_pulse",
      userId: demoUser.id,
      name: "Elena Rostova",
      company: "Pulse HealthTech",
      email: "elena@pulsehealth.co",
      address: "220 Health Pkwy, Boston, MA 02115",
      phone: "+1 (617) 555-0144",
      taxId: "MA-123498",
      currency: "USD",
      notes: "Mobile application UI/UX overhaul.",
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "cli_vanguard",
      userId: demoUser.id,
      name: "Marcus Sterling",
      company: "Vanguard Retail Ventures",
      email: "m.sterling@vanguardrv.com",
      address: "500 Madison Ave, New York, NY 10022",
      phone: "+1 (212) 555-0182",
      taxId: "NY-776655",
      currency: "USD",
      notes: "E-commerce platform migration project.",
      createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const now = new Date();
  const dMinus1 = new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const dMinus15 = new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const dMinus30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const dMinus45 = new Date(now.getTime() - 45 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const dPlus10 = new Date(now.getTime() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const dPlus25 = new Date(now.getTime() + 25 * 24 * 3600 * 1000).toISOString().split("T")[0];

  const invoices: Invoice[] = [
    {
      id: "inv_1001",
      userId: demoUser.id,
      invoiceNumber: "INV-2026-0001",
      issueDate: dMinus45,
      dueDate: dMinus15,
      status: "paid",
      currency: "USD",
      senderName: demoUser.name,
      senderBusiness: demoUser.businessName,
      senderEmail: demoUser.businessEmail,
      senderAddress: demoUser.businessAddress,
      senderPhone: demoUser.businessPhone,
      senderTaxId: demoUser.taxNumber,
      senderLogo: demoUser.logoUrl,
      clientId: clients[0].id,
      clientName: clients[0].name,
      clientCompany: clients[0].company,
      clientEmail: clients[0].email,
      clientAddress: clients[0].address || "",
      clientPhone: clients[0].phone,
      clientTaxId: clients[0].taxId,
      items: [
        {
          id: "item_1",
          name: "UI/UX Redesign - Sprint 1 & 2",
          description: "Complete design system and high-fidelity Figma prototypes",
          quantity: 40,
          unitPrice: 95,
          total: 3800,
        },
        {
          id: "item_2",
          name: "Design System Documentation",
          description: "Component specifications and design tokens handoff",
          quantity: 1,
          unitPrice: 700,
          total: 700,
        },
      ],
      subtotal: 4500,
      taxRate: 0,
      taxAmount: 0,
      discountRate: 0,
      discountAmount: 0,
      shipping: 0,
      total: 4500,
      notes: "Thank you for partnering with Nexus Digital Studio!",
      paymentTerms: "Due within 30 days. Wire transfer or Stripe card payment accepted.",
      template: "modern",
      accentColor: "#4f46e5",
      isRecurring: true,
      recurringInterval: "monthly",
      nextRecurringDate: dPlus15(now),
      paidAt: dMinus15,
      createdAt: dMinus45,
      updatedAt: dMinus15,
    },
    {
      id: "inv_1002",
      userId: demoUser.id,
      invoiceNumber: "INV-2026-0002",
      issueDate: dMinus30,
      dueDate: dMinus1,
      status: "overdue",
      currency: "USD",
      senderName: demoUser.name,
      senderBusiness: demoUser.businessName,
      senderEmail: demoUser.businessEmail,
      senderAddress: demoUser.businessAddress,
      senderPhone: demoUser.businessPhone,
      senderTaxId: demoUser.taxNumber,
      senderLogo: demoUser.logoUrl,
      clientId: clients[1].id,
      clientName: clients[1].name,
      clientCompany: clients[1].company,
      clientEmail: clients[1].email,
      clientAddress: clients[1].address || "",
      clientPhone: clients[1].phone,
      items: [
        {
          id: "item_3",
          name: "Next.js Full-Stack Web Application",
          description: "Interactive dashboard, API integration, and database schema setup",
          quantity: 60,
          unitPrice: 110,
          total: 6600,
        },
        {
          id: "item_4",
          name: "Cloud Infrastructure Setup",
          description: "Automated CI/CD deployment on AWS and Cloudflare DNS configuration",
          quantity: 1,
          unitPrice: 900,
          total: 900,
        },
      ],
      subtotal: 7500,
      taxRate: 8.25,
      taxAmount: 618.75,
      discountRate: 5,
      discountAmount: 375,
      shipping: 0,
      total: 7743.75,
      notes: "Payment is now past due. Please settle at your earliest convenience.",
      paymentTerms: "Net 15 days.",
      template: "emerald",
      accentColor: "#059669",
      isRecurring: false,
      createdAt: dMinus30,
      updatedAt: dMinus30,
    },
    {
      id: "inv_1003",
      userId: demoUser.id,
      invoiceNumber: "INV-2026-0003",
      issueDate: dMinus15,
      dueDate: dPlus10,
      status: "unpaid",
      currency: "USD",
      senderName: demoUser.name,
      senderBusiness: demoUser.businessName,
      senderEmail: demoUser.businessEmail,
      senderAddress: demoUser.businessAddress,
      senderPhone: demoUser.businessPhone,
      senderTaxId: demoUser.taxNumber,
      senderLogo: demoUser.logoUrl,
      clientId: clients[2].id,
      clientName: clients[2].name,
      clientCompany: clients[2].company,
      clientEmail: clients[2].email,
      clientAddress: clients[2].address || "",
      items: [
        {
          id: "item_5",
          name: "HealthTech Mobile App Prototype",
          description: "React Native prototype with biometric authentication",
          quantity: 35,
          unitPrice: 120,
          total: 4200,
        },
      ],
      subtotal: 4200,
      taxRate: 0,
      taxAmount: 0,
      discountRate: 0,
      discountAmount: 0,
      shipping: 0,
      total: 4200,
      notes: "Phase 1 deliverables accepted on review call.",
      paymentTerms: "Payment due within 25 days.",
      template: "executive",
      accentColor: "#1e293b",
      isRecurring: true,
      recurringInterval: "monthly",
      nextRecurringDate: dPlus25,
      createdAt: dMinus15,
      updatedAt: dMinus15,
    },
    {
      id: "inv_1004",
      userId: demoUser.id,
      invoiceNumber: "INV-2026-0004",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: dPlus25,
      status: "draft",
      currency: "USD",
      senderName: demoUser.name,
      senderBusiness: demoUser.businessName,
      senderEmail: demoUser.businessEmail,
      senderAddress: demoUser.businessAddress,
      senderLogo: demoUser.logoUrl,
      clientId: clients[3].id,
      clientName: clients[3].name,
      clientCompany: clients[3].company,
      clientEmail: clients[3].email,
      clientAddress: clients[3].address || "",
      items: [
        {
          id: "item_6",
          name: "E-Commerce Checkout Optimization",
          description: "Conversion rate optimization and Stripe elements integration",
          quantity: 1,
          unitPrice: 3200,
          total: 3200,
        },
      ],
      subtotal: 3200,
      taxRate: 6,
      taxAmount: 192,
      discountRate: 0,
      discountAmount: 0,
      shipping: 0,
      total: 3392,
      notes: "Draft prepared for client sign-off.",
      paymentTerms: "Due on completion of milestone 1.",
      template: "minimal",
      isRecurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const expenses: Expense[] = [
    {
      id: "exp_1",
      userId: demoUser.id,
      amount: 145.2,
      currency: "USD",
      category: "software",
      merchant: "AWS",
      description: "Cloud hosting and EC2 instance compute",
      date: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString().split("T")[0],
      tags: ["cloud", "infrastructure"],
      source: "telegram",
      telegramMessageId: "msg_901",
      createdAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "exp_2",
      userId: demoUser.id,
      amount: 48.5,
      currency: "USD",
      category: "meals",
      merchant: "Starbucks",
      description: "Coffee meeting with Acme Innovations client",
      date: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString().split("T")[0],
      tags: ["client", "lunch"],
      source: "telegram",
      telegramMessageId: "msg_902",
      createdAt: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "exp_3",
      userId: demoUser.id,
      amount: 32.75,
      currency: "USD",
      category: "travel",
      merchant: "Uber",
      description: "Ride to client onsite strategy session",
      date: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
      tags: ["travel", "taxi"],
      source: "telegram",
      telegramMessageId: "msg_903",
      createdAt: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "exp_4",
      userId: demoUser.id,
      amount: 240.0,
      currency: "USD",
      category: "software",
      merchant: "Vercel & Figma",
      description: "Monthly Pro Team design and deployment subscriptions",
      date: new Date(now.getTime() - 12 * 24 * 3600 * 1000).toISOString().split("T")[0],
      tags: ["design", "hosting"],
      source: "web",
      createdAt: new Date(now.getTime() - 12 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "exp_5",
      userId: demoUser.id,
      amount: 850.0,
      currency: "USD",
      category: "contractor",
      merchant: "DevContractor",
      description: "Subcontracted QA testing for Lumina Labs release",
      date: new Date(now.getTime() - 18 * 24 * 3600 * 1000).toISOString().split("T")[0],
      tags: ["dev", "qa"],
      source: "web",
      createdAt: new Date(now.getTime() - 18 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "exp_6",
      userId: demoUser.id,
      amount: 89.99,
      currency: "USD",
      category: "utilities",
      merchant: "Comcast Business",
      description: "Gigabit Fiber internet connection for office studio",
      date: new Date(now.getTime() - 25 * 24 * 3600 * 1000).toISOString().split("T")[0],
      tags: ["internet", "bills"],
      source: "sheets",
      createdAt: new Date(now.getTime() - 25 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const telegramLogs: TelegramLog[] = [
    {
      id: "log_1",
      userId: demoUser.id,
      rawText: "Spent $145.20 on AWS hosting #cloud",
      parsedData: {
        amount: 145.2,
        category: "software",
        merchant: "AWS",
        description: "Cloud hosting",
        currency: "USD",
        actionType: "expense",
      },
      success: true,
      responseSent: "✅ Expense logged! Added $145.20 for AWS under [Software]. Synced to Google Sheets 📊",
      createdAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "log_2",
      userId: demoUser.id,
      rawText: "Uber to airport $32.75",
      parsedData: {
        amount: 32.75,
        category: "travel",
        merchant: "Uber",
        description: "Ride to client onsite strategy session",
        currency: "USD",
        actionType: "expense",
      },
      success: true,
      responseSent: "✅ Expense logged! Added $32.75 for Uber under [Travel]. Synced to Google Sheets 📊",
      createdAt: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  return {
    users: [demoUser],
    clients,
    invoices,
    expenses,
    telegramLogs,
  };
}

function dPlus15(now: Date): string {
  return new Date(now.getTime() + 15 * 24 * 3600 * 1000).toISOString().split("T")[0];
}

export const db = {
  // --- USERS ---
  getUserById(id: string): User | undefined {
    const data = loadDatabase();
    return data.users.find((u) => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    const data = loadDatabase();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserByTelegramToken(token: string): User | undefined {
    const data = loadDatabase();
    return data.users.find((u) => u.telegramSyncToken === token);
  },

  getUserByTelegramChatId(chatId: string): User | undefined {
    const data = loadDatabase();
    return data.users.find((u) => u.telegramChatId === chatId);
  },

  createUser(user: Omit<User, "id" | "createdAt">): User {
    const data = loadDatabase();
    const newUser: User = {
      ...user,
      id: generateId("usr"),
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveDatabase(data);
    return newUser;
  },

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const data = loadDatabase();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    data.users[index] = { ...data.users[index], ...updates };
    saveDatabase(data);
    return data.users[index];
  },

  // --- CLIENTS ---
  getClients(userId: string): Client[] {
    const data = loadDatabase();
    return data.clients.filter((c) => c.userId === userId);
  },

  getClientById(id: string, userId: string): Client | undefined {
    const data = loadDatabase();
    return data.clients.find((c) => c.id === id && c.userId === userId);
  },

  createClient(client: Omit<Client, "id" | "createdAt">): Client {
    const data = loadDatabase();
    const newClient: Client = {
      ...client,
      id: generateId("cli"),
      createdAt: new Date().toISOString(),
    };
    data.clients.push(newClient);
    saveDatabase(data);
    return newClient;
  },

  updateClient(id: string, userId: string, updates: Partial<Client>): Client | undefined {
    const data = loadDatabase();
    const index = data.clients.findIndex((c) => c.id === id && c.userId === userId);
    if (index === -1) return undefined;
    data.clients[index] = { ...data.clients[index], ...updates };
    saveDatabase(data);
    return data.clients[index];
  },

  deleteClient(id: string, userId: string): boolean {
    const data = loadDatabase();
    const initialLen = data.clients.length;
    data.clients = data.clients.filter((c) => !(c.id === id && c.userId === userId));
    if (data.clients.length !== initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // --- INVOICES ---
  getInvoices(userId: string): Invoice[] {
    const data = loadDatabase();
    return data.invoices.filter((inv) => inv.userId === userId);
  },

  getInvoiceById(id: string, userId?: string): Invoice | undefined {
    const data = loadDatabase();
    if (userId) {
      return data.invoices.find((inv) => inv.id === id && inv.userId === userId);
    }
    return data.invoices.find((inv) => inv.id === id);
  },

  createInvoice(invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Invoice {
    const data = loadDatabase();
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId("inv"),
      createdAt: now,
      updatedAt: now,
    };
    data.invoices.unshift(newInvoice);
    saveDatabase(data);
    return newInvoice;
  },

  updateInvoice(id: string, userId: string, updates: Partial<Invoice>): Invoice | undefined {
    const data = loadDatabase();
    const index = data.invoices.findIndex((inv) => inv.id === id && inv.userId === userId);
    if (index === -1) return undefined;
    data.invoices[index] = {
      ...data.invoices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.invoices[index];
  },

  deleteInvoice(id: string, userId: string): boolean {
    const data = loadDatabase();
    const initialLen = data.invoices.length;
    data.invoices = data.invoices.filter((inv) => !(inv.id === id && inv.userId === userId));
    if (data.invoices.length !== initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // --- EXPENSES ---
  getExpenses(userId: string): Expense[] {
    const data = loadDatabase();
    return data.expenses
      .filter((e) => e.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getExpenseById(id: string, userId: string): Expense | undefined {
    const data = loadDatabase();
    return data.expenses.find((e) => e.id === id && e.userId === userId);
  },

  createExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
    const data = loadDatabase();
    const newExpense: Expense = {
      ...expense,
      id: generateId("exp"),
      createdAt: new Date().toISOString(),
    };
    data.expenses.unshift(newExpense);
    saveDatabase(data);
    return newExpense;
  },

  updateExpense(id: string, userId: string, updates: Partial<Expense>): Expense | undefined {
    const data = loadDatabase();
    const index = data.expenses.findIndex((e) => e.id === id && e.userId === userId);
    if (index === -1) return undefined;
    data.expenses[index] = { ...data.expenses[index], ...updates };
    saveDatabase(data);
    return data.expenses[index];
  },

  deleteExpense(id: string, userId: string): boolean {
    const data = loadDatabase();
    const initialLen = data.expenses.length;
    data.expenses = data.expenses.filter((e) => !(e.id === id && e.userId === userId));
    if (data.expenses.length !== initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // --- TELEGRAM LOGS ---
  getTelegramLogs(userId: string): TelegramLog[] {
    const data = loadDatabase();
    return data.telegramLogs
      .filter((l) => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createTelegramLog(log: Omit<TelegramLog, "id" | "createdAt">): TelegramLog {
    const data = loadDatabase();
    const newLog: TelegramLog = {
      ...log,
      id: generateId("log"),
      createdAt: new Date().toISOString(),
    };
    data.telegramLogs.unshift(newLog);
    saveDatabase(data);
    return newLog;
  },

  // --- FINANCIAL SUMMARY & ANALYTICS ---
  getFinancialSummary(userId: string): FinancialSummary {
    const invoices = this.getInvoices(userId);
    const expenses = this.getExpenses(userId);

    let totalRevenue = 0;
    let outstandingRevenue = 0;
    let paidInvoicesCount = 0;
    let unpaidInvoicesCount = 0;
    let overdueInvoicesCount = 0;

    const todayStr = new Date().toISOString().split("T")[0];

    invoices.forEach((inv) => {
      if (inv.status === "paid") {
        totalRevenue += inv.total;
        paidInvoicesCount++;
      } else if (inv.status === "unpaid" || inv.status === "sent") {
        outstandingRevenue += inv.total;
        if (inv.dueDate && inv.dueDate < todayStr) {
          overdueInvoicesCount++;
        } else {
          unpaidInvoicesCount++;
        }
      } else if (inv.status === "overdue") {
        outstandingRevenue += inv.total;
        overdueInvoicesCount++;
      }
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    // Build Last 6 Months Chart Data
    const monthsMap = new Map<string, { revenue: number; expenses: number }>();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthsMap.set(key, { revenue: 0, expenses: 0 });
    }

    invoices.forEach((inv) => {
      if (inv.status === "paid" && inv.paidAt) {
        const d = new Date(inv.paidAt);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (monthsMap.has(key)) {
          monthsMap.get(key)!.revenue += inv.total;
        }
      }
    });

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthsMap.has(key)) {
        monthsMap.get(key)!.expenses += exp.amount;
      }
    });

    const monthlyData = Array.from(monthsMap.entries()).map(([month, val]) => ({
      month,
      revenue: Math.round(val.revenue),
      expenses: Math.round(val.expenses),
      profit: Math.round(val.revenue - val.expenses),
    }));

    // Build Category Breakdown
    const catMap = new Map<ExpenseCategory, { amount: number; count: number }>();
    expenses.forEach((exp) => {
      const existing = catMap.get(exp.category) || { amount: 0, count: 0 };
      catMap.set(exp.category, {
        amount: existing.amount + exp.amount,
        count: existing.count + 1,
      });
    });

    const categoryBreakdown = Array.from(catMap.entries()).map(([category, val]) => ({
      category,
      amount: Math.round(val.amount * 100) / 100,
      count: val.count,
      percentage: totalExpenses > 0 ? Math.round((val.amount / totalExpenses) * 100) : 0,
    }));

    return {
      totalRevenue,
      totalExpenses,
      netIncome,
      outstandingRevenue,
      paidInvoicesCount,
      unpaidInvoicesCount,
      overdueInvoicesCount,
      totalInvoicesCount: invoices.length,
      expensesCount: expenses.length,
      monthlyData,
      categoryBreakdown,
    };
  },

  resetDemoData(): void {
    const seeded = getInitialSeededData();
    saveDatabase(seeded);
  },
};
