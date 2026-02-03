import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { get_collection_report_by_date_user_api } from "../../services/reportsApi";
import { get_cashier_session_by_user_date_api } from "../../services/salesApi";
import { useExcelExport } from "../common/excelSheetGenerator/excelSheetGenerator";

const useCollectionReport = () => {
  const { user, activeCashierSession } = useContext(UserContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSessionId, setSelectedSessionId] = useState(
    activeCashierSession?.cashierSessionId,
  );
  const exportToExcel = useExcelExport();

  const { data: userCashierSessions = [] } = useQuery({
    queryKey: ["userCashierSessions", user?.userId, date],
    queryFn: async () => {
      const response = await get_cashier_session_by_user_date_api(
        user.userId,
        date,
      );
      return response.data.result;
    },
    enabled: !!user?.userId && !!date,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  // Effect to update selectedSessionId when userCashierSessions changes or activeCashierSession changes
  useEffect(() => {
    if (userCashierSessions && userCashierSessions.length > 0) {
      // Check if active session is in the list (for the selected date)
      const activeSessionInList = userCashierSessions.find(
        (session) =>
          session.cashierSessionId === activeCashierSession?.cashierSessionId,
      );

      if (activeSessionInList) {
        setSelectedSessionId(activeSessionInList.cashierSessionId);
      } else {
        // If active session is not in list (e.g., date changed to past), select the last one (assuming latest)
        // Or the first one? Let's pick the last one as it likely represents the latest session for that day.
        // Assuming the API returns sorted or we just pick one.
        // Let's pick the last one.
        setSelectedSessionId(
          userCashierSessions[userCashierSessions.length - 1].cashierSessionId,
        );
      }
    } else {
      setSelectedSessionId(null);
    }
  }, [userCashierSessions, activeCashierSession]);

  const {
    data: reportData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["collectionReport", user?.userId, date, selectedSessionId],
    queryFn: async () => {
      const response = await get_collection_report_by_date_user_api(
        user.userId,
        date,
        selectedSessionId, // Use selected session ID
      );

      if (response.data?.handShake && response.data?.result) {
        return response.data.result;
      } else {
        throw new Error("Invalid response format from server");
      }
    },
    enabled: !!user?.userId && !!selectedSessionId, // Only fetch if session selected
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
        width: 30,
      },
      {
        header: "Invoice Reference",
        accessor: (item) => item.invoiceReference,
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
        billNo: "Gift Vouchers",
        amount: reportData.totalGiftVoucherAmount || 0,
        isSummary: true,
      },
      {
        billNo: "Cashier Expenses",
        amount: reportData.totalCashierExpenseOutAmount || 0,
        isSummary: true,
      },
      {
        billNo: "Cash In Hand",
        amount: reportData.totalCashInHandAmount || 0,
        isSummary: true,
      },
    ];

    const dataWithSummary = [...reportData.items, ...summaryRows];

    // Daily Summary Sheet Configuration
    const dailySummaryColumns = [
      {
        header: "Description",
        accessor: (item) => item.description,
        width: 30,
      },
      {
        header: "Amount",
        accessor: (item) => formatCurrency(item.amount),
        width: 20,
      },
    ];

    const dailySummaryData = [
      {
        description: "Total Amount",
        amount: reportData.dailyTotalAmount || 0,
      },
      {
        description: "Cash Collection",
        amount: reportData.dailyTotalCashCollection || 0,
      },
      {
        description: "Bank Transfers",
        amount: reportData.dailyTotalBankTransferAmount || 0,
      },
      {
        description: "Gift Vouchers",
        amount: reportData.dailyTotalGiftVoucherAmount || 0,
      },
      {
        description: "Cashier Expenses",
        amount: reportData.dailyTotalCashierExpenseOutAmount || 0,
      },
      {
        description: "Total Cash In Hand",
        amount: reportData.dailyTotalCashInHandAmount || 0,
      },
    ];

    // Add conditional rows if they have values > 0 to match UI logic, or just include them
    if (reportData.dailyTotalShortAmount > 0) {
      dailySummaryData.push({
        description: "Short Amount",
        amount: reportData.dailyTotalShortAmount,
      });
    }

    if (reportData.dailyTotalExcessAmount > 0) {
      dailySummaryData.push({
        description: "Excess Amount",
        amount: reportData.dailyTotalExcessAmount,
      });
    }

    const selectedSession = userCashierSessions.find(
      (session) => session.cashierSessionId === selectedSessionId,
    );

    exportToExcel({
      fileName: `Collection_Report_${date}.xlsx`,
      sheets: [
        {
          data: dataWithSummary,
          columns,
          sheetName: "Session Details",
          topic: `Collection Report of ${
            user?.username || ""
          } for Session ${formatDateTime(selectedSession?.sessionIn)}`,
        },
        {
          data: dailySummaryData,
          columns: dailySummaryColumns,
          sheetName: "Daily Summary",
          topic: `Daily Summary of ${user?.username || ""} on ${date}`,
        },
      ],
    });
  };

  return {
    user,
    activeCashierSession,
    date,
    reportData,
    loading,
    error: error?.response?.data?.message || error?.message,
    setDate,
    refetch,
    handleExport,
    formatDateTime,
    formatCurrency,
    selectedSessionId,
    setSelectedSessionId,
    userCashierSessions,
  };
};

export default useCollectionReport;
