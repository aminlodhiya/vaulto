import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    db.resetDemoData();
    return NextResponse.json({ success: true, message: "Database reset to rich demo state." });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
