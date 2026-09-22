import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/utils";
import { InvoiceItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    let invoices = db.getInvoices(user.id);

    if (status && status !== "all") {
      invoices = invoices.filter((inv) => inv.status === status);
    }

    if (search) {
      invoices = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(search) ||
          inv.clientName.toLowerCase().includes(search) ||
          (inv.clientCompany && inv.clientCompany.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("GET Invoices error:", error);
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
    const existingInvoices = db.getInvoices(user.id);

    // Calculate items totals
    const items: InvoiceItem[] = (body.items || []).map((item: any) => {
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

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = Number(body.taxRate) || 0;
    const discountRate = Number(body.discountRate) || 0;
    const shipping = Number(body.shipping) || 0;

    const discountAmount = Math.round(((subtotal * discountRate) / 100) * 100) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(((taxableAmount * taxRate) / 100) * 100) / 100;
    const total = Math.round((taxableAmount + taxAmount + shipping) * 100) / 100;

    const invoiceNumber = body.invoiceNumber || generateInvoiceNumber(existingInvoices.length);

    const newInvoice = db.createInvoice({
      userId: user.id,
      invoiceNumber,
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
      status: body.status || "unpaid",
      currency: body.currency || user.currency || "USD",
      senderName: body.senderName || user.name,
      senderBusiness: body.senderBusiness || user.businessName,
      senderEmail: body.senderEmail || user.businessEmail,
      senderAddress: body.senderAddress || user.businessAddress,
      senderPhone: body.senderPhone || user.businessPhone,
      senderTaxId: body.senderTaxId || user.taxNumber,
      senderLogo: body.senderLogo || user.logoUrl,
      senderSignature: body.senderSignature || user.signatureUrl,
      
      clientId: body.clientId,
      clientName: body.clientName || "Client",
      clientCompany: body.clientCompany || "",
      clientEmail: body.clientEmail || "",
      clientAddress: body.clientAddress || "",
      clientPhone: body.clientPhone || "",
      clientTaxId: body.clientTaxId || "",

      items,
      subtotal,
      taxRate,
      taxAmount,
      discountRate,
      discountAmount,
      shipping,
      total,
      
      notes: body.notes || "Thank you for your business!",
      paymentTerms: body.paymentTerms || "Payment is due within 30 days of invoice date.",
      template: body.template || "modern",
      accentColor: body.accentColor || "#4f46e5",
      
      isRecurring: Boolean(body.isRecurring),
      recurringInterval: body.recurringInterval || "monthly",
      nextRecurringDate: body.isRecurring ? body.nextRecurringDate : undefined,
      paidAt: body.status === "paid" ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ invoice: newInvoice }, { status: 201 });
  } catch (error) {
    console.error("POST Invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
