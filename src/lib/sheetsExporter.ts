import Papa from "papaparse";
import { Invoice, Expense, FinancialSummary } from "./types";
import { formatCurrency, formatDate } from "./utils";

export function exportInvoicesToCSV(invoices: Invoice[]): string {
  const rows = invoices.map((inv) => ({
    "Invoice #": inv.invoiceNumber,
    "Issue Date": formatDate(inv.issueDate),
    "Due Date": formatDate(inv.dueDate),
    "Client Name": inv.clientName,
    "Client Company": inv.clientCompany || "",
    "Client Email": inv.clientEmail,
    "Status": inv.status.toUpperCase(),
    "Currency": inv.currency,
    "Subtotal": inv.subtotal,
    "Tax %": inv.taxRate,
    "Tax Amount": inv.taxAmount,
    "Discount %": inv.discountRate,
    "Discount Amount": inv.discountAmount,
    "Total": inv.total,
    "Recurring": inv.isRecurring ? `Yes (${inv.recurringInterval})` : "No",
    "Paid At": inv.paidAt ? formatDate(inv.paidAt) : "",
    "Items Count": inv.items.length,
    "Items Summary": inv.items.map((i) => `${i.name} (${i.quantity}x)`).join("; "),
  }));

  return Papa.unparse(rows);
}

export function exportExpensesToCSV(expenses: Expense[]): string {
  const rows = expenses.map((exp) => ({
    "Date": formatDate(exp.date),
    "Category": exp.category.toUpperCase(),
    "Merchant": exp.merchant || "",
    "Description": exp.description,
    "Amount": exp.amount,
    "Currency": exp.currency,
    "Source": exp.source,
    "Tags": (exp.tags || []).join(", "),
    "Logged At": formatDate(exp.createdAt),
  }));

  return Papa.unparse(rows);
}

export function exportPLSummaryToCSV(summary: FinancialSummary, currency: string = "USD"): string {
  const kpiRows = [
    { Section: "SUMMARY KPI", Metric: "Total Revenue (Paid)", Value: formatCurrency(summary.totalRevenue, currency) },
    { Section: "SUMMARY KPI", Metric: "Total Expenses", Value: formatCurrency(summary.totalExpenses, currency) },
    { Section: "SUMMARY KPI", Metric: "Net Profit / Cashflow", Value: formatCurrency(summary.netIncome, currency) },
    { Section: "SUMMARY KPI", Metric: "Outstanding / Pending Invoices", Value: formatCurrency(summary.outstandingRevenue, currency) },
    { Section: "SUMMARY KPI", Metric: "Paid Invoices Count", Value: summary.paidInvoicesCount },
    { Section: "SUMMARY KPI", Metric: "Unpaid/Overdue Invoices Count", Value: summary.unpaidInvoicesCount + summary.overdueInvoicesCount },
  ];

  const monthlyRows = summary.monthlyData.map((m) => ({
    Section: "MONTHLY BREAKDOWN",
    Metric: m.month,
    Value: `Revenue: ${formatCurrency(m.revenue, currency)} | Expenses: ${formatCurrency(m.expenses, currency)} | Profit: ${formatCurrency(m.profit, currency)}`,
  }));

  const catRows = summary.categoryBreakdown.map((c) => ({
    Section: "EXPENSE BY CATEGORY",
    Metric: c.category.toUpperCase(),
    Value: `${formatCurrency(c.amount, currency)} (${c.percentage}%, ${c.count} items)`,
  }));

  return Papa.unparse([...kpiRows, ...monthlyRows, ...catRows]);
}

export function generateGoogleAppsScriptCode(webhookUrl: string, apiToken: string): string {
  return `/**
 * Vaulto Google Sheets 2-Way Synchronization Script
 * Paste this in Google Sheets > Extensions > Apps Script.
 */

const VAULTO_WEBHOOK_URL = "${webhookUrl}";
const VAULTO_API_TOKEN = "${apiToken}";

function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  
  if (sheetName === "Expenses" || sheetName === "Invoices") {
    syncToVaulto();
  }
}

function syncToVaulto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const expenseSheet = ss.getSheetByName("Expenses") || ss.getActiveSheet();
  const data = expenseSheet.getDataRange().getValues();
  
  const headers = data[0];
  const rows = data.slice(1);
  
  const payload = {
    token: VAULTO_API_TOKEN,
    sheetName: expenseSheet.getName(),
    rows: rows.map(r => ({
      date: r[0],
      category: r[1],
      merchant: r[2],
      description: r[3],
      amount: r[4],
      currency: r[5] || "USD"
    }))
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(VAULTO_WEBHOOK_URL, options);
    Logger.log("Vaulto Sync Result: " + response.getContentText());
  } catch (err) {
    Logger.log("Vaulto Sync Error: " + err);
  }
}
`;
}
