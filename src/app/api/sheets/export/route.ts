import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  exportInvoicesToCSV,
  exportExpensesToCSV,
  exportPLSummaryToCSV,
} from "@/lib/sheetsExporter";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "invoices";

    let csvContent = "";
    let filename = "";

    if (type === "invoices") {
      const invoices = db.getInvoices(user.id);
      csvContent = exportInvoicesToCSV(invoices);
      filename = `TeleExpense_Invoices_${new Date().toISOString().split("T")[0]}.csv`;
    } else if (type === "expenses") {
      const expenses = db.getExpenses(user.id);
      csvContent = exportExpensesToCSV(expenses);
      filename = `TeleExpense_Expenses_${new Date().toISOString().split("T")[0]}.csv`;
    } else if (type === "summary") {
      const summary = db.getFinancialSummary(user.id);
      csvContent = exportPLSummaryToCSV(summary, user.currency);
      filename = `TeleExpense_Financial_Summary_${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Sheets export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
