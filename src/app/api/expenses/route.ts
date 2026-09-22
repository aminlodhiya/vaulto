import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExpenseCategory } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as ExpenseCategory | "all" | null;
    const source = searchParams.get("source");
    const search = searchParams.get("search")?.toLowerCase();

    let expenses = db.getExpenses(user.id);

    if (category && category !== "all") {
      expenses = expenses.filter((e) => e.category === category);
    }

    if (source && source !== "all") {
      expenses = expenses.filter((e) => e.source === source);
    }

    if (search) {
      expenses = expenses.filter(
        (e) =>
          e.description.toLowerCase().includes(search) ||
          (e.merchant && e.merchant.toLowerCase().includes(search)) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(search)))
      );
    }

    const summary = db.getFinancialSummary(user.id);

    return NextResponse.json({ expenses, summary });
  } catch (error) {
    console.error("GET Expenses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const amount = parseFloat(body.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Valid expense amount is required" }, { status: 400 });
    }

    const newExpense = db.createExpense({
      userId: user.id,
      amount,
      currency: body.currency || user.currency || "USD",
      category: body.category || "other",
      description: body.description || "General expense",
      merchant: body.merchant || "",
      date: body.date || new Date().toISOString().split("T")[0],
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
      source: body.source || "web",
      receiptUrl: body.receiptUrl || "",
    });

    return NextResponse.json({ expense: newExpense }, { status: 201 });
  } catch (error) {
    console.error("POST Expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
