import { useState, useEffect, useRef } from "react";
import { get_item_masters_by_company_id_api } from "../../services/inventoryApi";
import {
  get_item_batches_api,
  get_grn_masters_with_out_drafts_api,
  get_issue_masters_with_out_drafts_api,
} from "../../services/purchaseApi";
import {
  get_sales_orders_with_out_drafts_api,
  get_sales_invoices_with_out_drafts_api,
} from "../../services/salesApi";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const useStockReport = () => {
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const alertRef = useRef(null);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState("");
  const [generateReport, setGenerateReport] = useState(false);
  const [generatedDateTime, setGeneratedDateTime] = useState(null);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const fetchItemBatches = async () => {
    try {
      const response = await get_item_batches_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching item batches:", error);
    }
  };

  const {
    data: itemBatches,
    isLoading: isItemBatchesLoading,
    isError: isItemBatchesError,
    error: itemBatchesError,
  } = useQuery({
    queryKey: ["itemBatches", sessionStorage.getItem("companyId")],
    queryFn: fetchItemBatches,
  });

  const fetchItemMasters = async () => {
    try {
      const response = await get_item_masters_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching item masters:", error);
    }
  };

  const {
    data: itemMasters,
    isLoading: isitemMastersLoading,
    isError: isitemMastersError,
    error: itemMastersError,
  } = useQuery({
    queryKey: ["itemMasters", sessionStorage.getItem("companyId")],
    queryFn: fetchItemMasters,
  });

  const fetchGrnMasters = async () => {
    try {
      const response = await get_grn_masters_with_out_drafts_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching grn masters:", error);
    }
  };

  const {
    data: grnMasters,
    isLoading: isGrnMastersLoading,
    isError: isGrnMastersError,
    error: grnMastersError,
  } = useQuery({
    queryKey: ["grnMasters", sessionStorage.getItem("companyId")],
    queryFn: fetchGrnMasters,
  });

  const fetchIssueMasters = async () => {
    try {
      const response = await get_issue_masters_with_out_drafts_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching issue masters:", error);
    }
  };

  const {
    data: issueMasters,
    isLoading: isIssueMastersLoading,
    isError: isIssueMastersError,
    error: issueMastersError,
  } = useQuery({
    queryKey: ["issueMasters", sessionStorage.getItem("companyId")],
    queryFn: fetchIssueMasters,
  });

  const fetchSalesOrders = async () => {
    try {
      const response = await get_sales_orders_with_out_drafts_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sales orders:", error);
    }
  };

  const {
    data: salesOrders,
    isLoading: isSalesOrdersLoading,
    isError: isSalesOrdersError,
    error: salesOrdersError,
  } = useQuery({
    queryKey: ["salesOrders", sessionStorage.getItem("companyId")],
    queryFn: fetchSalesOrders,
  });

  const fetchSalesInvoices = async () => {
    try {
      const response = await get_sales_invoices_with_out_drafts_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sales invoices:", error);
    }
  };

  const {
    data: salesInvoices,
    isLoading: isSalesInvoicesLoading,
    isError: isSalesInvoicesError,
    error: salesInvoicesError,
  } = useQuery({
    queryKey: ["salesInvoices", sessionStorage.getItem("companyId")],
    queryFn: fetchSalesInvoices,
  });

  useEffect(() => {
    setIsReportGenerated(false);
  }, [startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    if (
      !isitemMastersLoading &&
      !isItemBatchesLoading &&
      !isGrnMastersLoading &&
      !isSalesOrdersLoading &&
      !isSalesInvoicesLoading &&
      itemBatches &&
      itemMasters &&
      grnMasters &&
      salesOrders &&
      salesInvoices
    ) {
      //setLoading(true);

      // Filter approved GRNs by status and date range using moment
      const approvedGrns = grnMasters?.filter((grn) => {
        const approvedDate = moment.utc(grn.approvedDate?.split("T")[0]);
        const start = moment.utc(startDate);
        const end = moment.utc(endDate);

        return (
          (grn.status === 52 || grn.status === 42) &&
          approvedDate.isBetween(start, end, null, "[]") // '[]' includes the start and end dates
        );
      });

      const stockInQty = {};

      approvedGrns?.forEach((grn) => {
        grn.grnDetails?.forEach((detail) => {
          if (!stockInQty[detail.item.itemMasterId]) {
            stockInQty[detail.item.itemMasterId] = 0;
          }
          stockInQty[detail.item.itemMasterId] += detail.acceptedQuantity;
        });
      });

      const salesOrderStockOutQty = calculateSalesOrderStockOutQty();

      const salesInvoiceStockOutQty = calculateSalesInvoiceStockOutQty();

      const issueMastersStockOutQty = calculateIssueMastersStockOutQty();

      const combinedData = itemMasters?.map((item) => {
        const batches = itemBatches.filter(
          (batch) => batch.itemMasterId === item.itemMasterId
        );
        const totalTempQuantity = batches.reduce(
          (sum, batch) => sum + batch.tempQuantity,
          0
        );

        return {
          ...item,
          currentQty: totalTempQuantity,
          in: stockInQty[item?.itemMasterId] || 0,
          out:
            (salesOrderStockOutQty[item?.itemMasterId] || 0) +
            (salesInvoiceStockOutQty[item?.itemMasterId] || 0) +
            (issueMastersStockOutQty[item?.itemMasterId] || 0),
        };
      });
      setReportData(combinedData);
      setGeneratedDateTime(new Date());
      setIsReportGenerated(true);
      setLoading(false);
    }
  }, [
    isitemMastersLoading,
    isItemBatchesLoading,
    isGrnMastersLoading,
    isSalesOrdersLoading,
    isSalesInvoicesLoading,
    itemMasters,
    itemBatches,
    grnMasters,
    salesOrders,
    salesInvoices,
    generateReport,
  ]);

  const handleGenerateReport = () => {
    setGenerateReport((prev) => !prev); // Toggle the state to trigger useEffect
  };

  const calculateSalesOrderStockOutQty = () => {
    // Filter submitted sales orders by status and date range using moment
    const submittedSalesOrders = salesOrders?.filter((salesOrder) => {
      const orderDate = moment.utc(salesOrder.orderDate?.split("T")[0]);
      const start = moment.utc(startDate);
      const end = moment.utc(endDate);

      return (
        (salesOrder.status === 1 || salesOrder.status === 2) &&
        orderDate.isBetween(start, end, null, "[]") // '[]' includes the start and end dates
      );
    });

    const stockOutQty = {};

    submittedSalesOrders?.forEach((salesOrder) => {
      salesOrder.salesOrderDetails?.forEach((detail) => {
        if (!stockOutQty[detail?.itemBatch?.itemMasterId]) {
          stockOutQty[detail?.itemBatch?.itemMasterId] = 0;
        }
        stockOutQty[detail?.itemBatch?.itemMasterId] += detail.quantity;
      });
    });

    return stockOutQty;
  };

  const calculateSalesInvoiceStockOutQty = () => {
    // Filter submitted sales invoices by status and date range using moment
    const submittedSalesInvoices = salesInvoices?.filter((salesInvoice) => {
      const invoiceDate = moment.utc(salesInvoice.invoiceDate?.split("T")[0]);
      const start = moment.utc(startDate);
      const end = moment.utc(endDate);

      return (
        (salesInvoice.status === 1 ||
          salesInvoice.status === 2 ||
          salesInvoice.status === 5) &&
        invoiceDate.isBetween(start, end, null, "[]") // '[]' includes the start and end dates
      );
    });

    const stockOutQty = {};

    submittedSalesInvoices?.forEach((salesInvoice) => {
      salesInvoice.salesInvoiceDetails?.forEach((detail) => {
        if (!stockOutQty[detail?.itemBatch?.itemMasterId]) {
          stockOutQty[detail?.itemBatch?.itemMasterId] = 0;
        }
        stockOutQty[detail?.itemBatch?.itemMasterId] += detail.quantity;
      });
    });

    return stockOutQty;
  };

  const calculateIssueMastersStockOutQty = () => {
    // Filter approved isuue masters by status and date range using moment
    const approvedIssueMasters = issueMasters?.filter((issueMaster) => {
      const issueDate = moment.utc(issueMaster.issueDate?.split("T")[0]);
      const start = moment.utc(startDate);
      const end = moment.utc(endDate);

      return (
        (issueMaster.status === 42 || issueMaster.status === 52) &&
        (issueMaster.issueType === "MIN" || issueMaster.issueType === "TIN") &&
        issueDate.isBetween(start, end, null, "[]") // '[]' includes the start and end dates
      );
    });

    const stockOutQty = {};

    approvedIssueMasters?.forEach((issueMaster) => {
      issueMaster.issueDetails?.forEach((detail) => {
        if (!stockOutQty[detail?.itemMaster?.itemMasterId]) {
          stockOutQty[detail?.itemMaster?.itemMasterId] = 0;
        }
        stockOutQty[detail?.itemMaster?.itemMasterId] += detail.quantity;
      });
    });

    return stockOutQty;
  };

  const getFilteredData = () => {
    return reportData?.filter(
      (item) =>
        item?.itemName
          ?.toLowerCase()
          .replace(/\s+/g, "")
          ?.includes(searchTerm.toLowerCase().replace(/\s+/g, "")) ||
        item?.itemCode
          ?.toLowerCase()
          .replace(/\s+/g, "")
          ?.includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
    );
  };

  return {
    loading,
    startDate,
    endDate,
    alertRef,
    reportData,
    isitemMastersLoading,
    isItemBatchesLoading,
    searchTerm,
    generatedDateTime,
    generateReport,
    isReportGenerated,
    isitemMastersError,
    isItemBatchesError,
    isGrnMastersError,
    isIssueMastersError,
    isSalesOrdersError,
    isSalesInvoicesError,
    setStartDate,
    setEndDate,
    handleGenerateReport,
    setSearchTerm,
    getCurrentDate,
    getFilteredData,
  };
};

export default useStockReport;
