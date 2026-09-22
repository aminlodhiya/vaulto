import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, createToken, sanitizeUser, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, isDemo } = await req.json();

    if (isDemo) {
      const demoUser = db.getUserById("usr_demo123");
      if (!demoUser) {
        db.resetDemoData();
      }
      const user = db.getUserById("usr_demo123")!;
      const token = await createToken(user);

      const response = NextResponse.json({
        success: true,
        user: sanitizeUser(user),
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
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = db.getUserByEmail(email);
    if (!user || !user.passwordHash || !comparePassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken(user);
    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
