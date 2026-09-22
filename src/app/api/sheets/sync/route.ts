import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExpenseCategory } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. External webhook sync from Google Apps Script
    if (body.token) {
      const user = db.getUserByTelegramToken(body.token);
      if (!user) {
        return NextResponse.json({ error: "Invalid API token" }, { status: 401 });
      }

      const rows = body.rows || [];
      let importedCount = 0;

      for (const row of rows) {
        const amount = parseFloat(row.amount);
        if (!isNaN(amount) && amount > 0) {
          db.createExpense({
            userId: user.id,
            amount,
            currency: row.currency || user.currency || "USD",
            category: (row.category?.toLowerCase() as ExpenseCategory) || "other",
            merchant: row.merchant || "",
            description: row.description || "Google Sheet sync",
            date: row.date || new Date().toISOString().split("T")[0],
            source: "sheets",
          });
          importedCount++;
        }
      }

      db.updateUser(user.id, {
        googleSheetsConfig: {
          ...user.googleSheetsConfig,
          isConnected: true,
          lastSyncedAt: new Date().toISOString(),
        },
      });

      return NextResponse.json({ success: true, importedCount });
    }

    // 2. Direct authenticated settings update
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spreadsheetUrl, sheetName, isConnected } = body;

    const updated = db.updateUser(user.id, {
      googleSheetsConfig: {
        spreadsheetUrl: spreadsheetUrl || user.googleSheetsConfig?.spreadsheetUrl || "",
        sheetName: sheetName || user.googleSheetsConfig?.sheetName || "Expenses",
        isConnected: isConnected !== undefined ? isConnected : true,
        lastSyncedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Sheets sync error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
