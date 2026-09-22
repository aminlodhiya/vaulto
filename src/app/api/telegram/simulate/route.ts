import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseTelegramMessage } from "@/lib/telegramParser";
import { formatCurrency, generateInvoiceNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    const parsed = parseTelegramMessage(message);
    let replyText = "";
    let createdExpense = null;
    let createdInvoice = null;

    if (parsed.actionType === "expense" && parsed.amount) {
      createdExpense = db.createExpense({
        userId: user.id,
        amount: parsed.amount,
        currency: parsed.currency || user.currency || "USD",
        category: parsed.category || "other",
        description: parsed.description || "Telegram expense",
        merchant: parsed.merchant || "",
        date: new Date().toISOString().split("T")[0],
        tags: parsed.tags,
        source: "telegram",
      });

      const formattedAmt = formatCurrency(parsed.amount, parsed.currency || user.currency);
      const catName = parsed.category ? parsed.category.toUpperCase() : "GENERAL";
      const merchText = parsed.merchant ? ` at ${parsed.merchant}` : "";

      replyText = `🧾 <b>Expense Logged!</b>\n\n` +
        `💰 <b>Amount:</b> ${formattedAmt}\n` +
        `📂 <b>Category:</b> ${catName}\n` +
        `🏷️ <b>Merchant:</b> ${parsed.merchant || "N/A"}\n` +
        `📝 <b>Note:</b> ${parsed.description}${merchText}\n\n` +
        `✨ <i>Auto-synced to your Vaulto dashboard & Google Sheets!</i>`;

      db.createTelegramLog({
        userId: user.id,
        rawText: message,
        parsedData: {
          amount: parsed.amount,
          category: parsed.category || "other",
          merchant: parsed.merchant,
          description: parsed.description,
          currency: parsed.currency,
          actionType: "expense",
        },
        success: true,
        responseSent: replyText,
      });
    } else if (parsed.actionType === "invoice" && parsed.amount && parsed.clientName) {
      const existingInvoices = db.getInvoices(user.id);
      const invoiceNumber = generateInvoiceNumber(existingInvoices.length);

      createdInvoice = db.createInvoice({
        userId: user.id,
        invoiceNumber,
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
        status: "draft",
        currency: parsed.currency || user.currency || "USD",
        senderName: user.name,
        senderBusiness: user.businessName,
        senderEmail: user.businessEmail,
        senderAddress: user.businessAddress,
        senderLogo: user.logoUrl,
        clientName: parsed.clientName,
        clientEmail: "",
        clientAddress: "",
        items: [
          {
            id: Math.random().toString(36).substring(2, 9),
            name: parsed.description || "Professional Services",
            quantity: 1,
            unitPrice: parsed.amount,
            total: parsed.amount,
          },
        ],
        subtotal: parsed.amount,
        taxRate: 0,
        taxAmount: 0,
        discountRate: 0,
        discountAmount: 0,
        shipping: 0,
        total: parsed.amount,
        template: "modern",
        isRecurring: false,
      });

      const formattedAmt = formatCurrency(parsed.amount, parsed.currency || user.currency);
      replyText = `📄 <b>Invoice Draft Created!</b>\n\n` +
        `🔢 <b>Invoice:</b> ${invoiceNumber}\n` +
        `👤 <b>Client:</b> ${parsed.clientName}\n` +
        `💵 <b>Total:</b> ${formattedAmt}\n` +
        `📝 <b>Item:</b> ${parsed.description}\n\n` +
        `👉 View & send from your dashboard!`;

      db.createTelegramLog({
        userId: user.id,
        rawText: message,
        parsedData: {
          amount: parsed.amount,
          category: "other",
          merchant: parsed.clientName,
          description: parsed.description,
          currency: parsed.currency,
          actionType: "invoice",
        },
        success: true,
        responseSent: replyText,
      });
    } else if (parsed.actionType === "summary") {
      const summary = db.getFinancialSummary(user.id);
      replyText = `📊 <b>Your Financial Summary</b>\n\n` +
        `🟢 <b>Paid Revenue:</b> ${formatCurrency(summary.totalRevenue, user.currency)}\n` +
        `🔴 <b>Total Expenses:</b> ${formatCurrency(summary.totalExpenses, user.currency)}\n` +
        `📈 <b>Net Cashflow:</b> ${formatCurrency(summary.netIncome, user.currency)}\n` +
        `⏳ <b>Outstanding Invoices:</b> ${formatCurrency(summary.outstandingRevenue, user.currency)} (${summary.unpaidInvoicesCount} pending, ${summary.overdueInvoicesCount} overdue)\n\n` +
        `💡 <i>Tip: Send '/invoice Client 250 Task' to generate a quick invoice!</i>`;

      db.createTelegramLog({
        userId: user.id,
        rawText: message,
        parsedData: {
          amount: 0,
          category: "other",
          description: "Summary inquiry",
          actionType: "summary",
        },
        success: true,
        responseSent: replyText,
      });
    } else if (parsed.actionType === "connect") {
      replyText = `🔗 <b>Telegram Account Connected!</b>\n\n` +
        `Code verified successfully. You can now log expenses simply by sending text messages like:\n` +
        `• <i>"Spent $45 on lunch with Acme"</i>\n` +
        `• <i>"AWS hosting 120"</i>\n` +
        `• <i>"/summary"</i>`;
    } else if (parsed.actionType === "help") {
      replyText = `🤖 <b>Vaulto Commands Guide</b>\n\n` +
        `• <b>Log Expense:</b> <code>Spent $45 on lunch at Chipotle</code>\n` +
        `• <b>Fast Entry:</b> <code>Uber 24.50 category:travel</code>\n` +
        `• <b>Create Invoice:</b> <code>/invoice Acme Corp 500 Design</code>\n` +
        `• <b>Check Stats:</b> <code>/summary</code>\n` +
        `• <b>Help:</b> <code>/help</code>`;
    } else {
      replyText = `⚠️ Could not parse expense amount. Try format like:\n<i>"Spent $50 on software subscription"</i> or <i>"Uber 25.50"</i>`;
    }

    const updatedLogs = db.getTelegramLogs(user.id);

    return NextResponse.json({
      success: true,
      parsed,
      replyText,
      createdExpense,
      createdInvoice,
      logs: updatedLogs,
    });
  } catch (error) {
    console.error("Telegram Simulate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
