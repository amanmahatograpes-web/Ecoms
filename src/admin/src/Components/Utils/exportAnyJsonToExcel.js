import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Helper to flatten nested objects
const flattenObject = (obj, parentKey = "", res = {}) => {
  for (const key in obj) {
    const propName = parentKey ? `${parentKey}_${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = Array.isArray(obj[key]) ? JSON.stringify(obj[key]) : obj[key];
    }
  }
  return res;
};

export const exportAnyJsonToExcel = ({
  data = [],
  filePrefix = "Export",
  sheetName = "Sheet1",
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data available to export");
    return;
  }

  // Flatten each object
  const flatData = data.map(item => flattenObject(item));

  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(flatData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate blob
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Dynamic filename with date
  const dateStr = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "_");
  const fileName = `${filePrefix}_${dateStr}.xlsx`;

  // Trigger download
  saveAs(blob, fileName);
};