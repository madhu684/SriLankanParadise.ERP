import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "common/context/userContext";
import {
  get_manager_collection_report_api,
  get_collection_report_by_date_user_api,
} from "common/services/reportsApi";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator";

const useManagerCollectionReport = () => {
  const { user, hasPermission } = useContext(UserContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const exportToExcel = useExcelExport();

  const [isExporting, setIsExporting] = useState(false);

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

  const handleExport = async () => {
    if (!reportData) return;

    try {
      setIsExporting(true);

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
      const detailedInvoicePromises = [];

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

          // Queue promise to fetch details for this session
          detailedInvoicePromises.push(
            get_collection_report_by_date_user_api(
              userReport.userId,
              date,
              session.sessionId
            ).then((res) => ({
              userName: userReport.userName,
              sessionDisplay: session.sessionIn
                ? formatTime(session.sessionIn)
                : `Session #${session.sessionId}`,
              data: res?.data?.result?.items || []
            }))
          );
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

      // 3. Fetch Detailed Invoices
      const detailedResults = await Promise.all(detailedInvoicePromises);
      const allDetailedItems = [];

      detailedResults.forEach(result => {
        result.data.forEach(item => {
          allDetailedItems.push({
            ...item,
            userName: result.userName,
            sessionDisplay: result.sessionDisplay
          });
        });
      });

      const detailedInvoiceColumns = [
        { header: "User Name", accessor: (item) => item.userName, width: 20 },
        { header: "Session", accessor: (item) => item.sessionDisplay, width: 15 },
        { header: "Bill No", accessor: (item) => item.billNo, width: 30 },
        { header: "Invoice Ref", accessor: (item) => item.invoiceReference || "-", width: 15 },
        { header: "Patient Name", accessor: (item) => item.patientName, width: 25 },
        { header: "Token No", accessor: (item) => item.tokenNumber, width: 15 },
        { header: "Amount", accessor: (item) => formatCurrency(item.amount), width: 15 },
        { header: "Short", accessor: (item) => item.shortAmount > 0 ? formatCurrency(item.shortAmount) : "-", width: 15 },
        { header: "Excess", accessor: (item) => item.excessAmount > 0 ? formatCurrency(item.excessAmount) : "-", width: 15 },
        { header: "Payment Mode", accessor: (item) => item.modeOfPayment, width: 15 },
        { header: "Time", accessor: (item) => formatDateTime(item.enteredTime), width: 20 },
      ];

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
          {
            data: allDetailedItems,
            columns: detailedInvoiceColumns,
            sheetName: "Detailed Invoices",
            topic: `Detailed Invoices for ${date}`,
          },
        ],
      });
    } catch (err) {
      console.error("Export failed", err);
      // Ideally handle error UI state here if needed
    } finally {
      setIsExporting(false);
    }
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
    isExporting,
  };
};

export default useManagerCollectionReport;













