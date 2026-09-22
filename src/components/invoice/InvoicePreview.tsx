import React from "react";
import { Invoice, InvoiceTemplate } from "@/lib/types";
import { TemplateModern } from "./TemplateModern";
import { TemplateEmerald } from "./TemplateEmerald";
import { TemplateExecutive } from "./TemplateExecutive";
import { TemplateMinimal } from "./TemplateMinimal";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  templateOverride?: InvoiceTemplate;
}

export function InvoicePreview({ invoice, templateOverride }: InvoicePreviewProps) {
  const activeTemplate = templateOverride || invoice.template || "modern";

  switch (activeTemplate) {
    case "emerald":
      return <TemplateEmerald invoice={invoice} />;
    case "executive":
      return <TemplateExecutive invoice={invoice} />;
    case "minimal":
      return <TemplateMinimal invoice={invoice} />;
    case "modern":
    default:
      return <TemplateModern invoice={invoice} />;
  }
}
