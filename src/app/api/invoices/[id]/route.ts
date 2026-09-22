import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { InvoiceItem } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    
    // If authenticated, get user's invoice. If not, check if public view allowed
    let invoice = user ? db.getInvoiceById(id, user.id) : undefined;
    if (!invoice) {
      invoice = db.getInvoiceById(id);
    }

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("GET Invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = db.getInvoiceById(id, user.id);
    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    let items = existing.items;
    if (body.items) {
      items = (body.items || []).map((item: any) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const price = Math.max(0, Number(item.unitPrice) || 0);
        return {
          id: item.id || Math.random().toString(36).substring(2, 9),
          name: item.name || "Item",
          description: item.description || "",
          quantity: qty,
          unitPrice: price,
          total: Math.round(qty * price * 100) / 100,
        };
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = body.taxRate !== undefined ? Number(body.taxRate) : existing.taxRate;
    const discountRate = body.discountRate !== undefined ? Number(body.discountRate) : existing.discountRate;
    const shipping = body.shipping !== undefined ? Number(body.shipping) : existing.shipping;

    const discountAmount = Math.round(((subtotal * discountRate) / 100) * 100) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(((taxableAmount * taxRate) / 100) * 100) / 100;
    const total = Math.round((taxableAmount + taxAmount + shipping) * 100) / 100;

    let paidAt = existing.paidAt;
    if (body.status === "paid" && existing.status !== "paid") {
      paidAt = new Date().toISOString();
    } else if (body.status && body.status !== "paid") {
      paidAt = undefined;
    }

    const updated = db.updateInvoice(id, user.id, {
      ...body,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountRate,
      discountAmount,
      shipping,
      total,
      paidAt,
    });

    return NextResponse.json({ invoice: updated });
  } catch (error) {
    console.error("PUT Invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = db.deleteInvoice(id, user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
