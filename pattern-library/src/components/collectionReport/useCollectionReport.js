import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { get_collection_report_by_date_user_api } from "../../services/reportsApi";
import { useExcelExport } from "../common/excelSheetGenerator/excelSheetGenerator";

const useCollectionReport = () => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const exportToExcel = useExcelExport();

  const {
    data: reportData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["collectionReport", user?.userId, date],
    queryFn: async () => {
      const response = await get_collection_report_by_date_user_api(
        user.userId,
        date
      );

      if (response.data?.handShake && response.data?.result) {
        return response.data.result;
      } else {
        throw new Error("Invalid response format from server");
      }
    },
    enabled: !!user?.userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    // Ensure the date is treated as UTC if it doesn't have timezone info
    let normalizedDateStr = dateString.replace(" ", "T");
    if (!normalizedDateStr.endsWith("Z")) {
      normalizedDateStr += "Z";
    }
    const date = new Date(normalizedDateStr);
    return date.toLocaleString("en-GB", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleExport = () => {
    if (!reportData?.items) return;

    const columns = [
      {
        header: "Bill No",
        accessor: (item) => item.billNo,
        width: 15,
      },
      {
        header: "Channel No",
        accessor: (item) => (item.isSummary ? "" : item.channelNo || "-"),
        width: 15,
      },
      {
        header: "Patient Name",
        accessor: (item) => (item.isSummary ? "" : item.patientName),
        width: 25,
      },
      {
        header: "Telephone",
        accessor: (item) => (item.isSummary ? "" : item.telephoneNo || "-"),
        width: 15,
      },
      {
        header: "Amount",
        accessor: (item) =>
          item.isSummary && item.amount === undefined
            ? ""
            : formatCurrency(item.amount),
        width: 15,
      },
      {
        header: "Short",
        accessor: (item) =>
          item.isSummary
            ? ""
            : item.shortAmount > 0
            ? formatCurrency(item.shortAmount)
            : "-",
        width: 15,
      },
      {
        header: "Excess",
        accessor: (item) =>
          item.isSummary
            ? ""
            : item.excessAmount > 0
            ? formatCurrency(item.excessAmount)
            : "-",
        width: 15,
      },
      {
        header: "Payment Mode",
        accessor: (item) => (item.isSummary ? "" : item.modeOfPayment),
        width: 15,
      },
      {
        header: "Entered Time",
        accessor: (item) =>
          item.isSummary ? "" : formatDateTime(item.enteredTime),
        width: 20,
      },
    ];

    const summaryRows = [
      { billNo: "", isSummary: true }, // Empty row for spacing
      {
        billNo: "Total Amount",
        amount: reportData.totalAmount || 0,
        isSummary: true,
      },
      {
        billNo: "Cash Collection",
        amount: reportData.totalCashCollection || 0,
        isSummary: true,
      },
      {
        billNo: "Bank Transfers",
        amount: reportData.totalBankTransferAmount || 0,
        isSummary: true,
      },
      {
        billNo: "Cashier Expenses",
        amount: reportData.totalCashierExpenseOutAmount || 0,
        isSummary: true,
      },
    ];

    const dataWithSummary = [...reportData.items, ...summaryRows];

    exportToExcel({
      data: dataWithSummary,
      columns,
      fileName: `Collection_Report_${date}.xlsx`,
      sheetName: "Collection Report",
      topic: `Collection Report - ${date} - ${user?.username || ""}`,
    });
  };

  return {
    user,
    date,
    reportData,
    loading,
    error: error?.response?.data?.message || error?.message,
    setDate,
    refetch,
    handleExport,
    formatDateTime,
    formatCurrency,
  };
};

export default useCollectionReport;
