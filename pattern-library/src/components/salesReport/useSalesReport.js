import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { get_sales_invoice_by_date_range_api } from "../../services/reportApi";
import {
  get_customers_by_company_id_api,
  get_regions_api,
  get_sales_persons_api,
} from "../../services/salesApi";

const useSalesReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const companyId = sessionStorage.getItem("companyId");

  // Fetch master Data
  const {
    data: customers,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    error: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", companyId],
    queryFn: async () => {
      const response = await get_customers_by_company_id_api(companyId);
      return response.data.result || [];
    },
  });

  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const response = await get_regions_api();
      return response.data.result || [];
    },
  });

  const {
    data: salesPersons,
    isLoading: isSalesPersonsLoading,
    isError: isSalesPersonsError,
    error: salesPersonsError,
  } = useQuery({
    queryKey: ["salesPersons"],
    queryFn: async () => {
      const response = await get_sales_persons_api();
      return response.data.result || [];
    },
  });

  // Fetch sales report
  const {
    data: reportResponse = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "salesReportByDateRange",
      fromDate,
      toDate,
      selectedCustomerId,
      selectedRegionId,
      selectedSalesPersonId,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const response = await get_sales_invoice_by_date_range_api({
        fromDate,
        toDate,
        customerId: selectedCustomerId || null,
        regionId: selectedRegionId || null,
        salesPersonId: selectedSalesPersonId || null,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      return response.data.result || [];
    },
    enabled: !!fromDate && !!toDate,
  });

  const reportData = reportResponse?.data || [];
  const pagination = reportResponse?.pagination || null;

  const exportToExcel = () => {
    if (!reportData || reportData.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare summary data
    const summaryData = [
      ["Sales Report"],
      [`Date Range: ${fromDate} to ${toDate}`],
      [],
      ["Summary"],
      ["Total Invoices", reportData.length],
      [
        "Total Amount",
        reportData.reduce((sum, inv) => sum + inv.totalAmount, 0),
      ],
      [
        "Total Amount Due",
        reportData.reduce((sum, inv) => sum + inv.amountDue, 0),
      ],
      [
        "Total Litres",
        reportData.reduce((sum, inv) => sum + inv.totalLitres, 0),
      ],
      [],
    ];

    // Prepare main invoice data
    const invoiceHeaders = [
      "Reference No",
      "Invoiced Date",
      "Due Date",
      "Customer Code",
      "Customer Name",
      "Contact Person",
      "Phone",
      "Sales Person",
      "Region",
      "Total Amount",
      "Amount Due",
      "Total Litres",
      "Status",
      "Remarks",
    ];

    const invoiceRows = reportData.map((invoice) => {
      const statusMap = {
        1: "Pending",
        2: "Approved",
        3: "Cancelled",
        5: "Settled",
        8: "Wright Off",
      };
      return [
        invoice.referenceNo,
        new Date(invoice.invoiceDate).toLocaleDateString(),
        new Date(invoice.dueDate).toLocaleDateString(),
        invoice.customer.customerCode,
        invoice.customer.customerName,
        invoice.customer.contactPerson,
        invoice.customer.phone,
        `${invoice.customer.salesPerson.firstName} ${invoice.customer.salesPerson.lastName}`,
        invoice.customer.region.name,
        invoice.totalAmount,
        invoice.amountDue,
        invoice.totalLitres,
        statusMap[invoice.status] || "Unknown",
        invoice.remarks || "",
      ];
    });

    // Prepare detailed line items data
    const lineItemsData = [[], ["Invoice Line Items"], []];
    const lineItemHeaders = [
      "Invoice Reference",
      "Item Code",
      "Item Name",
      "Quantity",
      "Unit Price",
      "Total Price",
    ];
    lineItemsData.push(lineItemHeaders);

    reportData.forEach((invoice) => {
      invoice.salesInvoiceDetails.forEach((detail) => {
        lineItemsData.push([
          invoice.referenceNo,
          detail.itemMaster.itemCode,
          detail.itemMaster.itemName,
          detail.quantity,
          detail.unitPrice,
          detail.totalPrice,
        ]);
      });
    });

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();

    // Summary and Invoice Data Sheet
    const ws1Data = [
      ...summaryData,
      ["Invoices"],
      invoiceHeaders,
      ...invoiceRows,
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);

    // Set column widths
    ws1["!cols"] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
    ];

    // Line Items Sheet
    const ws2 = XLSX.utils.aoa_to_sheet(lineItemsData);
    ws2["!cols"] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 35 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
    ];

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, ws1, "Sales Report");
    XLSX.utils.book_append_sheet(wb, ws2, "Line Items");

    // Generate filename with date range
    const filename = `Sales_Report_${fromDate}_to_${toDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return {
    fromDate,
    toDate,
    reportData,
    isLoading,
    error,
    customers,
    regions,
    salesPersons,
    selectedCustomerId,
    selectedRegionId,
    selectedSalesPersonId,
    isCustomersLoading,
    isRegionsLoading,
    isSalesPersonsLoading,
    pagination,
    currentPage,
    pageSize,
    setCurrentPage,
    setSelectedCustomerId,
    setSelectedRegionId,
    setSelectedSalesPersonId,
    setFromDate,
    setToDate,
    exportToExcel,
    setPageSize,
  };
};

export default useSalesReport;
