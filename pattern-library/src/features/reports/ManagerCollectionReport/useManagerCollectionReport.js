import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "common/context/userContext";
import { get_manager_collection_report_api } from "common/services/reportsApi";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator";

const useManagerCollectionReport = () => {
  const { user, hasPermission } = useContext(UserContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const exportToExcel = useExcelExport();

  const {
    data: reportResponse,
    isLoading: loading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["managerCollectionReport", date],
    queryFn: () => get_manager_collection_report_api(date),
    enabled: !!date && !!hasPermission("View Manager Collection Report"),
  });

  const reportData = reportResponse?.data?.result || null;
  const error = isError
    ? queryError?.response?.data?.message || queryError.message
    : null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
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

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    // Ensure the date is treated as UTC if it doesn't have timezone info
    let normalizedDateStr = dateString.replace(" ", "T");
    if (!normalizedDateStr.endsWith("Z")) {
      normalizedDateStr += "Z";
    }
    const date = new Date(normalizedDateStr);
    return date.toLocaleString("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleExport = () => {
    if (!reportData) return;

    // 1. Overall Summary Sheet
    const overallSummaryColumns = [
      { header: "Description", accessor: (item) => item.description, width: 30 },
      { header: "Amount", accessor: (item) => formatCurrency(item.amount), width: 20 },
    ];

    const overallSummaryData = [
      { description: "Overall Total Amount", amount: reportData.totalAmount },
      { description: "Overall Cash Collection", amount: reportData.totalCash },
      { description: "Overall Bank Transfer", amount: reportData.totalBankTransfer },
      { description: "Overall Gift Voucher", amount: reportData.totalGiftVoucher },
      { description: "Overall Total Short", amount: reportData.totalShort },
      { description: "Overall Total Excess", amount: reportData.totalExcess },
      { description: "Overall Cashier Expenses", amount: reportData.totalExpenses },
      { description: "Overall Cash In Hand", amount: reportData.totalCashInHand },
    ];

    // 2. User Wise Details Sheet
    const userDetailsColumns = [
      { header: "User Name", accessor: (item) => item.userName || "", width: 25 },
      { header: "Session", accessor: (item) => item.sessionDisplay || "", width: 20 },
      { header: "Total Amount", accessor: (item) => item.amount !== undefined ? formatCurrency(item.amount) : "", width: 15 },
      { header: "Short", accessor: (item) => item.short !== undefined ? formatCurrency(item.short) : "", width: 15 },
      { header: "Excess", accessor: (item) => item.excess !== undefined ? formatCurrency(item.excess) : "", width: 15 },
      { header: "Cash", accessor: (item) => item.cash !== undefined ? formatCurrency(item.cash) : "", width: 15 },
      { header: "Bank Transfer", accessor: (item) => item.bankTransfer !== undefined ? formatCurrency(item.bankTransfer) : "", width: 15 },
      { header: "Gift Voucher", accessor: (item) => item.giftVoucher !== undefined ? formatCurrency(item.giftVoucher) : "", width: 15 },
      { header: "Expenses", accessor: (item) => item.expenses !== undefined ? formatCurrency(item.expenses) : "", width: 15 },
      { header: "Cash In Hand", accessor: (item) => item.cashInHand !== undefined ? formatCurrency(item.cashInHand) : "", width: 15 },
    ];

    const userDetailsData = [];
    reportData.userReports?.forEach((userReport) => {
      // Add session rows
      userReport.sessions.forEach((session) => {
        userDetailsData.push({
          userName: userReport.userName,
          sessionDisplay: session.sessionIn
            ? formatTime(session.sessionIn)
            : session.sessionId
            ? `Session #${session.sessionId}`
            : "Main Session",
          amount: session.sessionTotalAmount,
          short: session.sessionTotalShort,
          excess: session.sessionTotalExcess,
          cash: session.sessionTotalCash,
          bankTransfer: session.sessionTotalBankTransfer,
          giftVoucher: session.sessionTotalGiftVoucher,
          expenses: session.sessionTotalExpenses,
          cashInHand: session.sessionTotalCashInHand,
        });
      });

      // Add user total row
      userDetailsData.push({
        userName: `${userReport.userName} (TOTAL)`,
        sessionDisplay: "User Totals",
        amount: userReport.userTotalAmount,
        short: userReport.userTotalShort,
        excess: userReport.userTotalExcess,
        cash: userReport.userTotalCash,
        bankTransfer: userReport.userTotalBankTransfer,
        giftVoucher: userReport.userTotalGiftVoucher,
        expenses: userReport.userTotalExpenses,
        cashInHand: userReport.userTotalCashInHand,
      });

      // Add empty row for spacing
      userDetailsData.push({});
    });

    exportToExcel({
      fileName: `Manager_Collection_Report_${date}.xlsx`,
      sheets: [
        {
          data: overallSummaryData,
          columns: overallSummaryColumns,
          sheetName: "Overall Summary",
          topic: `Overall Collection Summary for ${date}`,
        },
        {
          data: userDetailsData,
          columns: userDetailsColumns,
          sheetName: "User Wise Details",
          topic: `User Wise Collection Details for ${date}`,
        },
      ],
    });
  };

  return {
    user,
    date,
    reportData,
    loading,
    error,
    hasPermission,
    refetch,
    formatCurrency,
    formatDateTime,
    formatTime,
    setDate,
    handleExport,
  };
};

export default useManagerCollectionReport;













