"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, Loader2, Printer } from "lucide-react";

interface InvoicePDFProps {
  elementId: string;
  filename?: string;
  buttonLabel?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function InvoicePDF({
  elementId,
  filename = "invoice.pdf",
  buttonLabel = "Download PDF",
  variant = "primary",
}: InvoicePDFProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Invoice preview element not found");
      return;
    }

    try {
      setGenerating(true);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation error:", err);
      // Fallback to window.print()
      window.print();
    } finally {
      setGenerating(false);
    }
  };

  const buttonClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow",
    secondary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow",
    outline:
      "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200",
  }[variant];

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${buttonClasses}`}
    >
      {generating ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <Download className="w-4 h-4 text-current" />
      )}
      {generating ? "Exporting PDF..." : buttonLabel}
    </button>
  );
}
