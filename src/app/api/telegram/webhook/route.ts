import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseTelegramMessage } from "@/lib/telegramParser";
import { formatCurrency, generateInvoiceNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true, status: "ignored_non_text" });
    }

    const message = update.message;
    const chatId = String(message.chat.id);
    const text = message.text.trim();

    // 1. Check if user is connecting via /start <code> or /connect <code>
    const parsed = parseTelegramMessage(text);

    if (parsed.actionType === "connect" && parsed.connectCode) {
      const user = db.getUserByTelegramToken(parsed.connectCode);
      if (user) {
        db.updateUser(user.id, {
          telegramConnected: true,
          telegramChatId: chatId,
        });

        await sendTelegramReply(chatId, `🎉 <b>Account Connected Successfully!</b>\n\nWelcome to Vaulto, ${user.name}! You can now send expenses here directly (e.g. <i>"Spent $45 on lunch at Chipotle"</i>).`);
        return NextResponse.json({ ok: true });
      } else {
        await sendTelegramReply(chatId, `❌ Invalid sync code. Please get your 6-digit sync token from your Vaulto Settings page.`);
        return NextResponse.json({ ok: true });
      }
    }

    // 2. Find user by Telegram Chat ID
    let user = db.getUserByTelegramChatId(chatId);
    if (!user) {
      // Demo fallback if testing locally
      user = db.getUserById("usr_demo123");
    }

    if (!user) {
      await sendTelegramReply(chatId, `👋 Please connect your Vaulto account first by typing:\n<code>/connect YOUR_6_DIGIT_CODE</code>`);
      return NextResponse.json({ ok: true });
    }

    // 3. Process actions
    if (parsed.actionType === "expense" && parsed.amount) {
      db.createExpense({
        userId: user.id,
        amount: parsed.amount,
        currency: parsed.currency || user.currency || "USD",
        category: parsed.category || "other",
        description: parsed.description || "Telegram expense",
        merchant: parsed.merchant || "",
        date: new Date().toISOString().split("T")[0],
        tags: parsed.tags,
        source: "telegram",
        telegramMessageId: String(message.message_id),
      });

      const reply = `✅ <b>Expense Logged!</b>\n\n💰 <b>Amount:</b> ${formatCurrency(parsed.amount, parsed.currency || user.currency)}\n📂 <b>Category:</b> ${(parsed.category || "other").toUpperCase()}\n📝 <b>Note:</b> ${parsed.description}\n\n📊 Synced with Google Sheets & Dashboard.`;
      
      db.createTelegramLog({
        userId: user.id,
        rawText: text,
        parsedData: {
          amount: parsed.amount,
          category: parsed.category || "other",
          merchant: parsed.merchant,
          description: parsed.description,
          currency: parsed.currency,
          actionType: "expense",
        },
        success: true,
        responseSent: reply,
      });

      await sendTelegramReply(chatId, reply);
    } else if (parsed.actionType === "invoice" && parsed.amount && parsed.clientName) {
      const existingInvoices = db.getInvoices(user.id);
      const invoiceNumber = generateInvoiceNumber(existingInvoices.length);

      db.createInvoice({
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

      const reply = `📄 <b>Draft Invoice Created!</b>\n\n🔢 <b>Invoice:</b> ${invoiceNumber}\n👤 <b>Client:</b> ${parsed.clientName}\n💵 <b>Amount:</b> ${formatCurrency(parsed.amount, user.currency)}`;
      await sendTelegramReply(chatId, reply);
    } else if (parsed.actionType === "summary") {
      const summary = db.getFinancialSummary(user.id);
      const reply = `📊 <b>Financial Snapshot</b>\n\n🟢 <b>Revenue:</b> ${formatCurrency(summary.totalRevenue, user.currency)}\n🔴 <b>Expenses:</b> ${formatCurrency(summary.totalExpenses, user.currency)}\n📈 <b>Net Cashflow:</b> ${formatCurrency(summary.netIncome, user.currency)}\n⏳ <b>Unpaid Invoices:</b> ${formatCurrency(summary.outstandingRevenue, user.currency)}`;
      await sendTelegramReply(chatId, reply);
    } else {
      const reply = `🤖 <b>Vaulto Bot</b>\n\nSend expenses like: <i>"Spent $45 on team lunch"</i>\nOr <code>/summary</code> for your balance overview.`;
      await sendTelegramReply(chatId, reply);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

async function sendTelegramReply(chatId: string, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch (e) {
    console.error("Failed to send Telegram reply:", e);
  }
}
