// @ts-nocheck

// This file contains utility functions for printing HTML content to PDF.

// This utility relies on the 'html2pdf.js' library. Ensure it is installed in your project:
// `npm install html2pdf.js` or `yarn add html2pdf.js`
import html2pdf from 'html2pdf.js';

interface PrintPdfOptions {
  margin?: number | [number, number, number, number];
  filename?: string;
  image?: { type: string; quality: number };
  html2canvas?: { scale: number };
  jsPDF?: { unit: string; format: string; orientation: string };
}

// Converts an HTML element to a PDF and initiates a download.

// @param element The HTML element (or its ID) to convert to PDF.
// @param options Configuration options for PDF generation.
export const printPdf = (
  element: HTMLElement | string,
  options: PrintPdfOptions = {}
): void => {
  const defaultOptions: PrintPdfOptions = {
    margin: 10,
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const targetElement = typeof element === 'string' ? document.getElementById(element) : element;

  if (!targetElement) {
    console.error('Element not found for PDF conversion.');
    return;
  }

  html2pdf().set(mergedOptions).from(targetElement).save();
};