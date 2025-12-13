import * as XLSX from "xlsx";

export const exportAgeAnalysisToExcel = (reportData, filters) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary Report
  const summaryData = generateSummarySheet(reportData, filters);
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);

  // Apply column widths for summary sheet
  const slabCount =
    reportData.data.length > 0
      ? Object.keys(reportData.data[0].slabAmounts).length
      : 0;

  ws1["!cols"] = [
    { wch: 35 }, // NO
    { wch: 15 }, // CUSTOMER CODE
    { wch: 30 }, // CUSTOMER NAME
    { wch: 15 }, // CURRENT Rs
    ...Array(slabCount).fill({ wch: 15 }), // Slab columns
    { wch: 15 }, // TOTAL Rs
  ];

  // Apply borders to summary sheet
  applySummaryBorders(ws1, reportData);

  XLSX.utils.book_append_sheet(wb, ws1, "AGE ANALYSIS SUMMARY REPORT");

  // Sheet 2: Detail Report
  const detailData = generateDetailSheet(reportData, filters);
  const ws2 = XLSX.utils.aoa_to_sheet(detailData);

  // Apply column widths for detail sheet
  ws2["!cols"] = [
    { wch: 35 }, // CUSTOMER CODE or INVOICE DATE
    { wch: 35 }, // CUSTOMER NAME or INVOICE NO
    { wch: 12 }, // INVOICE DATE
    { wch: 12 }, // INVOICE NO
    { wch: 25 }, // INVOICE VALUE
    { wch: 35 }, // CURRENT OUTSTANDING-Rs
    { wch: 15 }, // CURRENT
    ...Array(slabCount).fill({ wch: 15 }), // Slab columns
    { wch: 15 }, // TOTAL Rs
  ];

  // Apply borders to detail sheet
  applyDetailBorders(ws2, reportData);

  XLSX.utils.book_append_sheet(wb, ws2, "AGE ANALYSIS-DETAIL REPORT");

  // Generate file name with current date
  const fileName = `Age_Analysis_Report_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  // Write the workbook
  XLSX.writeFile(wb, fileName);
};

// Border style definition
const borderStyle = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

const applySummaryBorders = (ws, reportData) => {
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // Find the header row (row with "NO", "CUSTOMER CODE", etc.)
  let headerRow = -1;
  for (let row = 0; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
    const cell = ws[cellAddress];
    if (cell && cell.v === "NO") {
      headerRow = row;
      break;
    }
  }

  if (headerRow === -1) return;

  // Find the total row
  let totalRow = -1;
  for (let row = headerRow + 1; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 2 });
    const cell = ws[cellAddress];
    if (cell && cell.v === "TOTAL") {
      totalRow = row;
      break;
    }
  }

  // Apply borders to header row through total row
  const endRow = totalRow !== -1 ? totalRow : range.e.r;
  for (let row = headerRow; row <= endRow; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: "s", v: "" };
      }
      if (!ws[cellAddress].s) {
        ws[cellAddress].s = {};
      }
      ws[cellAddress].s.border = borderStyle;

      // Add bold styling to header and total rows
      if (row === headerRow || row === totalRow) {
        ws[cellAddress].s.font = { bold: true };
      }
    }
  }
};

const applyDetailBorders = (ws, reportData) => {
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // Track which rows need borders (headers and data rows)
  for (let row = range.s.r; row <= range.e.r; row++) {
    const firstCellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
    const secondCellAddress = XLSX.utils.encode_cell({ r: row, c: 1 });
    const thirdCellAddress = XLSX.utils.encode_cell({ r: row, c: 2 });

    const firstCell = ws[firstCellAddress];
    const secondCell = ws[secondCellAddress];
    const thirdCell = ws[thirdCellAddress];

    let shouldApplyBorder = false;
    let isBoldRow = false;

    // Check if this is a header row
    if (
      firstCell &&
      (firstCell.v === "INVOICE DATE" ||
        firstCell.v === "Sales Person" ||
        firstCell.v === "Region" ||
        firstCell.v === "Customer Code" ||
        (typeof firstCell.v === "string" &&
          firstCell.v.includes("CUSTOMER CODE:")))
    ) {
      shouldApplyBorder = true;
      if (firstCell.v === "INVOICE DATE") {
        isBoldRow = true;
      }
    }

    // Check if this is a total row
    if (thirdCell && (thirdCell.v === "TOTAL" || thirdCell.v === "")) {
      if (firstCell && firstCell.v === "GRAND TOTAL") {
        shouldApplyBorder = true;
        isBoldRow = true;
      } else if (thirdCell.v === "TOTAL") {
        shouldApplyBorder = true;
        isBoldRow = true;
      }
    }

    // Check if this is a data row (has invoice date in first column)
    if (
      firstCell &&
      typeof firstCell.v === "string" &&
      firstCell.v.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
    ) {
      shouldApplyBorder = true;
    }

    // Apply borders if needed
    if (shouldApplyBorder) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) {
          ws[cellAddress] = { t: "s", v: "" };
        }
        if (!ws[cellAddress].s) {
          ws[cellAddress].s = {};
        }
        ws[cellAddress].s.border = borderStyle;

        // Add bold styling to header and total rows
        if (isBoldRow) {
          ws[cellAddress].s.font = { bold: true };
        }
      }
    }
  }
};

const generateSummarySheet = (reportData, filters) => {
  const rows = [];

  // Title
  rows.push(["TRADE DEBTORS AGE ANALYSIS"]);
  rows.push([
    `SUMMARY REPORT AS AT ${filters.asOfDate || "..........................."}`,
  ]);
  rows.push([]);

  // Filter information
  rows.push([
    "Sales Person",
    filters.salesPersonFrom || "",
    "to",
    filters.salesPersonTo || "",
  ]);
  rows.push(["Region", filters.regionFrom || "", "to", filters.regionTo || ""]);
  rows.push([
    "Customer Code",
    filters.customerCodeFrom || "",
    "to",
    filters.customerCodeTo || "",
  ]);
  rows.push([]);

  // Get slab labels from first data item
  const slabLabels =
    reportData.data.length > 0
      ? Object.keys(reportData.data[0].slabAmounts)
      : [];

  // Header row
  const headerRow = [
    "NO",
    "CUSTOMER CODE",
    "CUSTOMER NAME",
    "CURRENT Rs",
    ...slabLabels.map((label) => `${label}-Rs`),
    "TOTAL Rs",
  ];
  rows.push(headerRow);

  // Data rows - Group by customer
  const customerMap = new Map();
  reportData.data.forEach((invoice) => {
    const key = invoice.customerCode;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        customerCode: invoice.customerCode,
        customerName: invoice.customerName,
        current: 0,
        slabs: {},
        total: 0,
      });
    }

    const customer = customerMap.get(key);

    // Aggregate slab amounts
    Object.entries(invoice.slabAmounts).forEach(([slabLabel, amount]) => {
      if (!customer.slabs[slabLabel]) {
        customer.slabs[slabLabel] = 0;
      }
      customer.slabs[slabLabel] += amount;
    });

    customer.total += invoice.amountDue;
  });

  // Convert map to array and add to rows
  let rowNum = 1;
  customerMap.forEach((customer) => {
    const dataRow = [
      rowNum++,
      customer.customerCode,
      customer.customerName,
      customer.current || 0,
      ...slabLabels.map((label) => customer.slabs[label] || 0),
      customer.total,
    ];
    rows.push(dataRow);
  });

  // Add empty rows for spacing
  rows.push([]);
  rows.push([]);

  // Total row
  const totalRow = [
    "",
    "",
    "TOTAL",
    reportData.summary.currentTotal || 0,
    ...slabLabels.map((label) => reportData.summary.slabTotals[label] || 0),
    reportData.summary.totalAmountDue,
  ];
  rows.push(totalRow);

  return rows;
};

const generateDetailSheet = (reportData, filters) => {
  const rows = [];

  // Title
  rows.push(["TRADE DEBTORS AGE ANALYSIS"]);
  rows.push([
    `DETAIL REPORT AS AT ${filters.asOfDate || "..........................."}`,
  ]);
  rows.push([]);

  // Filter information at top
  rows.push([
    "Sales Person",
    filters.salesPersonFrom || "",
    "to",
    filters.salesPersonTo || "",
  ]);
  rows.push(["Region", filters.regionFrom || "", "to", filters.regionTo || ""]);
  rows.push([
    "Customer Code",
    filters.customerCodeFrom || "",
    "to",
    filters.customerCodeTo || "",
  ]);
  rows.push([]);

  // Get slab labels
  const slabLabels =
    reportData.data.length > 0
      ? Object.keys(reportData.data[0].slabAmounts)
      : [];

  // Group data by customer
  const customerGroups = new Map();
  reportData.data.forEach((invoice) => {
    const key = invoice.customerCode;
    if (!customerGroups.has(key)) {
      customerGroups.set(key, []);
    }
    customerGroups.get(key).push(invoice);
  });

  let grandTotalCurrent = 0;
  let grandTotalSlabs = {};
  slabLabels.forEach((label) => {
    grandTotalSlabs[label] = 0;
  });
  let grandTotal = 0;

  // Process each customer group
  customerGroups.forEach((invoices, customerCode) => {
    const firstInvoice = invoices[0];

    // Customer header
    rows.push([
      `CUSTOMER CODE: ${firstInvoice.customerCode}`,
      "",
      `CUSTOMER NAME: ${firstInvoice.customerName}`,
    ]);
    rows.push([]);

    // Table header for this customer
    const headerRow = [
      "INVOICE DATE",
      "INVOICE NO",
      "INVOICE VALUE",
      "CURRENT OUTSTANDING",
      "CURRENT",
      ...slabLabels.map((label) => `${label}-Rs`),
      "TOTAL Rs",
    ];
    rows.push(headerRow);

    // Invoice rows for this customer
    let customerTotalCurrent = 0;
    let customerTotalSlabs = {};
    slabLabels.forEach((label) => {
      customerTotalSlabs[label] = 0;
    });
    let customerTotal = 0;

    invoices.forEach((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString(
        "en-GB"
      );
      const current = invoice.amountDue;

      const dataRow = [
        invoiceDate,
        invoice.referenceNo,
        invoice.totalAmount,
        invoice.amountDue,
        current,
        ...slabLabels.map((label) => invoice.slabAmounts[label] || 0),
        invoice.amountDue,
      ];
      rows.push(dataRow);

      customerTotalCurrent += current;
      slabLabels.forEach((label) => {
        customerTotalSlabs[label] += invoice.slabAmounts[label] || 0;
      });
      customerTotal += invoice.amountDue;
    });

    // Customer total row
    rows.push([]);
    const customerTotalRow = [
      "",
      "",
      "TOTAL",
      customerTotalCurrent,
      customerTotalCurrent,
      ...slabLabels.map((label) => customerTotalSlabs[label]),
      customerTotal,
    ];
    rows.push(customerTotalRow);
    rows.push([]);
    rows.push([]);

    // Add to grand totals
    grandTotalCurrent += customerTotalCurrent;
    slabLabels.forEach((label) => {
      grandTotalSlabs[label] += customerTotalSlabs[label];
    });
    grandTotal += customerTotal;
  });

  // Grand total row
  rows.push([
    "GRAND TOTAL",
    "",
    "",
    grandTotalCurrent,
    grandTotalCurrent,
    ...slabLabels.map((label) => grandTotalSlabs[label]),
    grandTotal,
  ]);

  return rows;
};
