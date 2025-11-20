import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PDFRenderer({ targetId = "budget-view" }) {
  const exporting = useRef(false);

  const generatePDF = async () => {
    if (exporting.current) return;
    exporting.current = true;

    const element = document.getElementById(targetId);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(img);
    const imgRatio = imgProps.width / imgProps.height;

    let pdfWidth = pageWidth;
    let pdfHeight = pdfWidth / imgRatio;

    if (pdfHeight > pageHeight) {
      pdfHeight = pageHeight;
      pdfWidth = imgRatio * pdfHeight;
    }

    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("orcamento.pdf");

    exporting.current = false;
  };

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow p-4">
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Exportar PDF</h2>
        <Button onClick={generatePDF} className="rounded-xl py-5 text-base font-medium">
          Baixar PDF
        </Button>
      </CardContent>
    </Card>
  );
}