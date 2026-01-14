import { useCallback } from "react";
import * as XLSX from "xlsx";

export const useExcelExport = () =>
  useCallback(
    ({
      data = [],
      columns = [],
      fileName = "Report.xlsx",
      sheetName = "Sheet1",
      topic = "",
      sheets = [], // Add support for multiple sheets
    }) => {
      const workbook = XLSX.utils.book_new();

      const addSheet = (sheetData, sheetColumns, sheetName, sheetTopic) => {
        if (!sheetData || sheetData.length === 0) return;

        // Format data based on columns
        const formattedData = sheetData.map((item) =>
          sheetColumns.reduce((acc, col) => {
            acc[col.header] = col.accessor(item);
            return acc;
          }, {})
        );

        // Build worksheet data
        const worksheetData = [
          { [sheetColumns[0].header]: sheetTopic }, // Title row
          {}, // Blank row
          Object.fromEntries(
            sheetColumns.map((col) => [col.header, col.header])
          ), // Header row
          ...formattedData, // Data rows
        ];

        const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
          skipHeader: true, // Skip default headers as we manually added them
        });

        // Set column widths
        worksheet["!cols"] = sheetColumns.map((col) => ({
          wch: col.width || 15,
        }));

        // Merge cells for the topic
        const lastColumn = String.fromCharCode(65 + sheetColumns.length - 1); // Get the last column (e.g., 'F' for 6 columns)
        const topicCellRange = `A1:${lastColumn}1`;
        if (!worksheet["!merges"]) worksheet["!merges"] = [];
        worksheet["!merges"].push(XLSX.utils.decode_range(topicCellRange));

        // Style the topic row (centered and bold)
        worksheet["A1"].s = {
          font: { bold: true }, // Bold font
          alignment: { horizontal: "center", vertical: "center" },
        };

        // Apply styling to all topic cells in the merge
        for (let colIndex = 0; colIndex < sheetColumns.length; colIndex++) {
          const cell = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Get cell address (e.g., 'A1', 'B1', etc.)
          if (worksheet[cell]) {
            worksheet[cell].s = worksheet["A1"].s;
          }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      };

      if (sheets && sheets.length > 0) {
        sheets.forEach((sheet) => {
          addSheet(sheet.data, sheet.columns, sheet.sheetName, sheet.topic);
        });
      } else {
        // Fallback for single sheet usage
        if (!data || data.length === 0) {
          alert("No data available for export");
          return;
        }
        addSheet(data, columns, sheetName, topic);
      }

      if (workbook.SheetNames.length === 0) {
        alert("No data available for export");
        return;
      }

      // Write to file
      XLSX.writeFile(workbook, fileName);
    },
    []
  );
