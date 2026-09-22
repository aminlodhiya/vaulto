import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateTelegramToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, chatId } = await req.json();

    if (action === "refresh-token") {
      const newToken = generateTelegramToken();
      const updated = db.updateUser(user.id, {
        telegramSyncToken: newToken,
      });
      return NextResponse.json({ success: true, token: newToken, user: updated });
    }

    if (action === "toggle-connect") {
      const isConnected = !user.telegramConnected;
      const updated = db.updateUser(user.id, {
        telegramConnected: isConnected,
        telegramChatId: isConnected ? (chatId || user.telegramChatId || "987654321") : undefined,
      });
      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Telegram connect error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
