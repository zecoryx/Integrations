// @ts-nocheck

// This file contains utility functions for exporting data to Excel (.xlsx) format.

// This utility relies on the 'xlsx' library. Ensure it is installed in your project:
// `npm install xlsx` or `yarn add xlsx`
import * as XLSX from 'xlsx';

// Exports an array of JSON objects to an Excel (.xlsx) file.
//
// @param data An array of JavaScript objects, where each object represents a row in the Excel sheet.
// The keys of the objects will be used as column headers.
// @param fileName The name of the Excel file to be downloaded (e.g., "my_data.xlsx").
// @param sheetName The name of the sheet within the Excel file. Defaults to "Sheet1".
export const exportToExcel = (
  data: Record<string, any>[],
  fileName: string,
  sheetName: string = 'Sheet1'
): void => {
  if (!data || data.length === 0) {
    console.warn('No data provided for Excel export.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};