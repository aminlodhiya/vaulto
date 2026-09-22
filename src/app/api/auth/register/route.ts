import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createToken, sanitizeUser, AUTH_COOKIE_NAME } from "@/lib/auth";
import { generateTelegramToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, businessName } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const newUser = db.createUser({
      email,
      passwordHash: hashPassword(password),
      name,
      businessName: businessName || `${name}'s Consulting`,
      businessAddress: "123 Business Way, Suite 100",
      businessEmail: email,
      businessPhone: "",
      taxNumber: "",
      currency: "USD",
      subscriptionTier: "free",
      telegramConnected: false,
      telegramSyncToken: generateTelegramToken(),
      googleSheetsConfig: {
        isConnected: false,
      },
    });

    const token = await createToken(newUser);
    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(newUser),
      token,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
