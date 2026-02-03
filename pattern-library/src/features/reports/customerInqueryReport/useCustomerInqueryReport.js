import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_customer_invoices_by_customer_date_api } from "common/services/reportsApi";
import { search_customers_by_name_phone } from "common/services/salesApi";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator";

const useCustomerInqueryReport = () => {
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [debouncedCustomerSearchQuery, setDebouncedCustomerSearchQuery] =
    useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = useExcelExport();

  const [paginationMeta, setPaginationMeta] = useState({
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Debounce customer search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCustomerSearchQuery(customerSearchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearchQuery]);

  // Fetch customers for search
  const { data: searchResults = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customerSearch", debouncedCustomerSearchQuery],
    queryFn: async () => {
      if (!debouncedCustomerSearchQuery) return [];
      const response = await search_customers_by_name_phone(
        debouncedCustomerSearchQuery,
      );
      return response.data?.result || [];
    },
    enabled: !!debouncedCustomerSearchQuery,
  });

  const fetchInvoices = async () => {
    try {
      if (!selectedCustomer) return [];

      const response = await get_customer_invoices_by_customer_date_api({
        name: selectedCustomer.customerName || null,
        phone: selectedCustomer.phone || null,
        fromDate: fromDate || null,
        toDate: toDate || null,
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });

      if (response.data && response.data.result) {
        setPaginationMeta(response.data.result.pagination);
        return response.data.result.data || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching customer invoices:", error);
      throw error;
    }
  };

  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "customerInvoices",
      selectedCustomer?.customerId,
      fromDate,
      toDate,
      currentPage,
    ],
    queryFn: fetchInvoices,
    enabled: !!selectedCustomer,
    placeholderData: keepPreviousData,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchQuery("");
    setDebouncedCustomerSearchQuery("");
    setCurrentPage(1);
  };

  const toggleInvoiceDetails = (invoiceId) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
  };

  const handleDownloadExcel = async () => {
    try {
      if (!selectedCustomer) return;
      setIsExporting(true);

      let allInvoices = [];
      // Fetch the first page to get total pages count
      const firstResponse = await get_customer_invoices_by_customer_date_api({
        name: selectedCustomer.customerName,
        phone: selectedCustomer.phone,
        fromDate: fromDate || null,
        toDate: toDate || null,
        pageNumber: 1,
        pageSize: 50, // Increase page size for efficiency during export
      });

      if (firstResponse.data && firstResponse.data.result) {
        const { data, pagination } = firstResponse.data.result;
        allInvoices = [...(data || [])];

        // If there are more pages, fetch them all
        if (pagination && pagination.totalPages > 1) {
          const remainingPagePromises = [];
          for (let p = 2; p <= pagination.totalPages; p++) {
            remainingPagePromises.push(
              get_customer_invoices_by_customer_date_api({
                name: selectedCustomer.customerName,
                phone: selectedCustomer.phone,
                fromDate: fromDate || null,
                toDate: toDate || null,
                pageNumber: p,
                pageSize: 50,
              }),
            );
          }

          const otherResponses = await Promise.all(remainingPagePromises);
          otherResponses.forEach((res) => {
            if (res.data && res.data.result && res.data.result.data) {
              allInvoices = [...allInvoices, ...res.data.result.data];
            }
          });
        }
      }

      if (allInvoices.length === 0) {
        alert("No data available to export");
        setIsExporting(false);
        return;
      }

      // Flatten data: Invoice Header + Invoice Items
      const exportData = [];
      allInvoices.forEach((invoice) => {
        if (
          invoice.salesInvoiceDetails &&
          invoice.salesInvoiceDetails.length > 0
        ) {
          invoice.salesInvoiceDetails.forEach((detail, index) => {
            exportData.push({
              ...invoice,
              itemDetail: detail,
              isFirstItem: index === 0,
            });
          });
        } else {
          // If no items, still show the invoice header
          exportData.push({
            ...invoice,
            itemDetail: null,
            isFirstItem: true,
          });
        }
      });

      const columns = [
        {
          header: "Invoice No",
          accessor: (d) =>
            d.isFirstItem
              ? d.referenceNo || d.referenceNumber || d.salesInvoiceId
              : "",
          width: 20,
        },
        {
          header: "Date",
          accessor: (d) => (d.isFirstItem ? formatDate(d.invoiceDate) : ""),
          width: 15,
        },
        {
          header: "Customer",
          accessor: (d) => (d.isFirstItem ? selectedCustomer.customerName : ""),
          width: 25,
        },
        {
          header: "Token No",
          accessor: (d) => (d.isFirstItem ? d.tokenNo || "-" : ""),
          width: 10,
        },
        {
          header: "Item Name",
          accessor: (d) => d.itemDetail?.itemMaster?.itemName || "-",
          width: 30,
        },
        {
          header: "Qty",
          accessor: (d) => d.itemDetail?.quantity || 0,
          width: 10,
        },
        {
          header: "Unit Price",
          accessor: (d) => d.itemDetail?.unitPrice || 0,
          width: 15,
        },
        {
          header: "Item Total",
          accessor: (d) => d.itemDetail?.totalPrice || 0,
          width: 15,
        },
        {
          header: "Invoice Total",
          accessor: (d) => (d.isFirstItem ? d.totalAmount || 0 : ""),
          width: 15,
        },
        {
          header: "Amount Due",
          accessor: (d) => (d.isFirstItem ? d.amountDue || 0 : ""),
          width: 15,
        },
      ];

      exportToExcel({
        data: exportData,
        columns: columns,
        fileName: `Customer_Inquiry_${selectedCustomer.customerName}_${new Date().toISOString().split("T")[0]}.xlsx`,
        sheetName: "Invoices",
        topic: `Customer Inquiry Report - ${selectedCustomer.customerName}`,
      });
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export excel sheet");
    } finally {
      setIsExporting(false);
    }
  };

  console.log("selectedCustomer: ", selectedCustomer);

  return {
    invoices: selectedCustomer ? invoices : [],
    isLoadingInvoices,
    isFetching,
    error: error?.message,
    customerSearchQuery,
    setCustomerSearchQuery,
    searchResults,
    isLoadingCustomers,
    selectedCustomer,
    setSelectedCustomer,
    handleSelectCustomer,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    currentPage,
    setCurrentPage,
    paginationMeta,
    itemsPerPage,
    formatCurrency,
    formatDate,
    refetch,
    expandedInvoiceId,
    toggleInvoiceDetails,
    handleDownloadExcel,
    isExporting,
  };
};

export default useCustomerInqueryReport;













