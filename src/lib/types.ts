export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  taxNumber: string;
  currency: string;
  logoUrl?: string;
  signatureUrl?: string;
  subscriptionTier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  telegramConnected: boolean;
  telegramChatId?: string;
  telegramSyncToken: string;
  googleSheetsConfig?: {
    spreadsheetUrl?: string;
    sheetName?: string;
    isConnected: boolean;
    lastSyncedAt?: string;
  };
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  company?: string;
  address?: string;
  phone?: string;
  taxId?: string;
  currency?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'unpaid' | 'overdue';
export type InvoiceTemplate = 'modern' | 'minimal' | 'executive' | 'emerald';
export type RecurringInterval = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: string;
  senderName: string;
  senderBusiness: string;
  senderEmail: string;
  senderAddress: string;
  senderPhone?: string;
  senderTaxId?: string;
  senderLogo?: string;
  senderSignature?: string;
  
  clientId?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone?: string;
  clientTaxId?: string;

  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g., 10 for 10%
  taxAmount: number;
  discountRate: number; // e.g. 5 for 5%
  discountAmount: number;
  shipping: number;
  total: number;
  
  notes?: string;
  paymentTerms?: string;
  template: InvoiceTemplate;
  accentColor?: string;
  
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  nextRecurringDate?: string;
  
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'software'
  | 'travel'
  | 'meals'
  | 'office'
  | 'marketing'
  | 'contractor'
  | 'utilities'
  | 'other';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  merchant?: string;
  date: string;
  receiptUrl?: string;
  tags?: string[];
  source: 'telegram' | 'web' | 'sheets';
  telegramMessageId?: string;
  createdAt: string;
}

export interface TelegramLog {
  id: string;
  userId: string;
  rawText: string;
  parsedData: {
    amount: number;
    category: ExpenseCategory;
    merchant?: string;
    description: string;
    currency?: string;
    actionType: 'expense' | 'invoice' | 'summary' | 'unknown';
  };
  success: boolean;
  responseSent: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  outstandingRevenue: number;
  paidInvoicesCount: number;
  unpaidInvoicesCount: number;
  overdueInvoicesCount: number;
  totalInvoicesCount: number;
  expensesCount: number;
  monthlyData: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  categoryBreakdown: {
    category: ExpenseCategory;
    amount: number;
    count: number;
    percentage: number;
  }[];
}
