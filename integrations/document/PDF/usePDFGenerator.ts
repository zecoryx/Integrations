import { useState, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFOptions {
  filename?: string;
  margin?: number;
  imageQuality?: number;
}

interface UsePDFGeneratorReturn {
  generateFromElement: (element: HTMLElement, options?: PDFOptions) => Promise<void>;
  generateFromData: (data: PDFData, options?: PDFOptions) => Promise<void>;
  isGenerating: boolean;
  error: Error | null;
}

interface PDFRow {
  [key: string]: string | number;
}

interface PDFData {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: PDFRow[];
}

export const usePDFGenerator = (): UsePDFGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // HTML elementdan PDF yaratish
  const generateFromElement = useCallback(
    async (element: HTMLElement, options: PDFOptions = {}) => {
      const { filename = "document.pdf", margin = 10, imageQuality = 0.98 } = options;
      setIsGenerating(true);
      setError(null);

      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/jpeg", imageQuality);

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let posY = margin;
        const usableHeight = pageHeight - margin * 2;

        if (imgHeight <= usableHeight) {
          pdf.addImage(imgData, "JPEG", margin, posY, imgWidth, imgHeight);
        } else {
          // Ko'p sahifali hujjat
          let remainingHeight = imgHeight;
          let sourceY = 0;

          while (remainingHeight > 0) {
            const sliceHeight = Math.min(usableHeight, remainingHeight);
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = (sliceHeight / imgWidth) * canvas.width;
            const ctx = sliceCanvas.getContext("2d")!;
            ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);

            const sliceData = sliceCanvas.toDataURL("image/jpeg", imageQuality);
            if (sourceY > 0) pdf.addPage();
            pdf.addImage(sliceData, "JPEG", margin, posY, imgWidth, sliceHeight);

            sourceY += sliceCanvas.height;
            remainingHeight -= sliceHeight;
          }
        }

        pdf.save(filename);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  // Jadval ma'lumotlardan PDF yaratish
  const generateFromData = useCallback(async (data: PDFData, options: PDFOptions = {}) => {
    const { filename = "report.pdf", margin = 15 } = options;
    setIsGenerating(true);
    setError(null);

    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      let y = margin;

      // Sarlavha
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(data.title, pageWidth / 2, y, { align: "center" });
      y += 10;

      if (data.subtitle) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(data.subtitle, pageWidth / 2, y, { align: "center" });
        y += 8;
      }

      // Jadval ustun kengliklari
      const colCount = data.columns.length;
      const colWidth = (pageWidth - margin * 2) / colCount;

      // Jadval sarlavhasi
      pdf.setFillColor(41, 128, 185);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");
      data.columns.forEach((col, i) => {
        pdf.text(col, margin + i * colWidth + 2, y + 5.5);
      });
      y += 8;

      // Jadval qatorlari
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      data.rows.forEach((row, rowIdx) => {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(margin, y, pageWidth - margin * 2, 7, "F");
        }
        data.columns.forEach((col, i) => {
          const value = String(row[col] ?? "");
          pdf.text(value, margin + i * colWidth + 2, y + 5);
        });
        y += 7;
      });

      pdf.save(filename);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateFromElement, generateFromData, isGenerating, error };
};
