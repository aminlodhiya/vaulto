import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = db.getClients(user.id);
    return NextResponse.json({ clients });
  } catch (error) {
    console.error("GET Clients error:", error);
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
    if (!body.name) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    const newClient = db.createClient({
      userId: user.id,
      name: body.name,
      email: body.email || "",
      company: body.company || "",
      address: body.address || "",
      phone: body.phone || "",
      taxId: body.taxId || "",
      currency: body.currency || user.currency || "USD",
      notes: body.notes || "",
    });

    return NextResponse.json({ client: newClient }, { status: 201 });
  } catch (error) {
    console.error("POST Client error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
