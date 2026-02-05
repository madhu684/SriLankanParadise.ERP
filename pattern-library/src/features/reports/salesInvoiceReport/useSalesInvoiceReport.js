import { useState, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_invoice_report_api } from "../../../common/services/reportsApi";
import { useExcelExport } from "../../../common/components/common/excelSheetGenerator/excelSheetGenerator";
import { UserContext } from "../../../common/context/userContext";

const useSalesInvoiceReport = () => {
    const { hasPermission } = useContext(UserContext);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [filter, setFilter] = useState("All");

    const exportToExcel = useExcelExport();

    const {
        data: reportData,
        isLoading,
    } = useQuery({
        queryKey: ["invoiceReport", fromDate, toDate, filter],
        queryFn: () => get_invoice_report_api({ fromDate, toDate, filter }),
        enabled: !!fromDate && !!toDate, // Auto-fetch when dates are selected
    });

    const reportItems = useMemo(() => {
        const items = reportData?.data?.result?.items || [];
        // Sort items by Invoice No to ensure grouping, although the API might already do this
        const sortedItems = [...items].sort((a, b) => a.invoiceNo.localeCompare(b.invoiceNo));

        const processedItems = [];
        let currentInvoiceId = null;
        let spanCount = 0;
        let spanStartIndex = 0;
        let invoiceCounter = 0;

        sortedItems.forEach((item, index) => {
            const newItem = { ...item, rowSpan: 0 }; // Default to 0 (hidden)

            if (item.salesInvoiceId !== currentInvoiceId) {
                // New invoice group starting
                invoiceCounter++;
                if (currentInvoiceId !== null) {
                    // Update the start item of the previous group
                    processedItems[spanStartIndex].rowSpan = spanCount;
                }

                currentInvoiceId = item.salesInvoiceId;
                spanCount = 1;
                spanStartIndex = index;
                newItem.rowSpan = 1; // Temporary, will be updated if group ends
            } else {
                // Continuing same invoice group
                spanCount++;
            }
            newItem.invoiceIndex = invoiceCounter;

            processedItems.push(newItem);
        });

        // Handle the last group
        if (processedItems.length > 0) {
            processedItems[spanStartIndex].rowSpan = spanCount;
        }

        return processedItems;
    }, [reportData]);

    const { totalInvoiceAmount, totalReceiptAmount, totalExcessAmount, totalOutstandingAmount, totalInvoiceCount } = useMemo(() => {
        const result = reportData?.data?.result || {};
        return {
            totalInvoiceAmount: result.totalInvoiceAmount || 0,
            totalReceiptAmount: result.totalReceiptAmount || 0,
            totalExcessAmount: result.totalExcessAmount || 0,
            totalOutstandingAmount: result.totalOutstandingAmount || 0,
            totalInvoiceCount: result.totalInvoiceCount || 0
        };
    }, [reportData]);



    const handleExportExcel = () => {
        if (reportItems.length === 0) {
            alert("No data to export");
            return;
        }

        // Calculate Payment Mode Breakdowns
        let cashCollection = 0;
        let bankTransfers = 0;
        let giftVouchers = 0;

        reportItems.forEach(item => {
            const amount = item.receiptAmount || 0;
            const mode = item.paymentMode;
            if (mode === "Cash") cashCollection += amount;
            else if (mode === "Bank Transfer") bankTransfers += amount;
            else if (mode === "Gift Voucher") giftVouchers += amount;
        });

        const summaryRows = [
            { isTotal: true }, // Empty row
            {
                isTotal: true,
                invoiceNo: "Total Invoice Amount",
                customerName: totalInvoiceAmount
            },
            {
                isTotal: true,
                invoiceNo: "Total Receipt Amount",
                customerName: totalReceiptAmount
            },
            {
                isTotal: true,
                invoiceNo: "Cash Collection",
                customerName: cashCollection
            },
            {
                isTotal: true,
                invoiceNo: "Bank Transfers",
                customerName: bankTransfers
            },
            {
                isTotal: true,
                invoiceNo: "Gift Vouchers",
                customerName: giftVouchers
            },
            {
                isTotal: true,
                invoiceNo: "Total Excess Amount",
                customerName: totalExcessAmount
            },
            {
                isTotal: true,
                invoiceNo: "Total Outstanding Amount",
                customerName: totalOutstandingAmount
            }
        ];

        const columns = [
            { header: "Invoice No", accessor: (d) => d.invoiceNo, width: 25 },
            { header: "Customer Name", accessor: (d) => d.customerName, width: 30 },
            { header: "Invoice Status", accessor: (d) => d.isTotal ? "" : getStatusLabel(d.invoiceStatus), width: 15 },
            { header: "Invoice Amount", accessor: (d) => d.invoiceAmount, width: 15 },
            { header: "Receipt No", accessor: (d) => d.isTotal ? "" : d.receiptNumber, width: 20 },
            { header: "Receipt Amount", accessor: (d) => d.receiptAmount, width: 15 },
            { header: "Excess Amount", accessor: (d) => d.excessAmount, width: 15 },
            { header: "Due Amount", accessor: (d) => d.dueAmount, width: 15 },
            { header: "Payment Mode", accessor: (d) => d.isTotal ? "" : d.paymentMode, width: 15 },
            { header: "Receipt Status", accessor: (d) => d.isTotal ? "" : getReceiptStatusLabel(d.receiptStatus), width: 15 },
            { header: "Receipt Date", accessor: (d) => d.isTotal ? "" : formatDate(d.receiptDate), width: 15 },
        ];

        exportToExcel({
            data: [...reportItems, ...summaryRows],
            columns: columns,
            fileName: `Invoice_Report_${fromDate}_${toDate}.xlsx`,
            sheetName: "Invoice Report",
            topic: `Invoice Report - ${fromDate} to ${toDate}`,
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    const getStatusLabel = (statusCode) => {
        const statusLabels = {
            0: "Draft",
            1: "Pending Approval",
            2: "Approved",
            3: "Rejected",
            4: "In Progress",
            5: "Settled",
            6: "Cancelled",
            7: "On Hold",
            8: "Write Offed",
        };

        return statusLabels[statusCode] || "Unknown Status";
    };

    const getReceiptStatusLabel = (statusCode) => {
        const statusLabels = {
            0: "Draft",
            1: "Created",
            2: "Approved",
            3: "Rejected",
            4: "In Progress",
            5: "Completed",
            6: "Cancelled",
            7: "On Hold",
        };

        return statusLabels[statusCode] || "Unknown Status";
    };

    const getReceiptStatusBadgeClass = (statusCode) => {
        const statusClasses = {
            0: "bg-secondary",
            1: "bg-warning",
            2: "bg-success",
            3: "bg-danger",
            4: "bg-info",
            5: "bg-primary",
            6: "bg-dark",
            7: "bg-secondary",
        };

        return statusClasses[statusCode] || "bg-secondary";
    };

    const getStatusBadgeClass = (statusCode) => {
        const statusClasses = {
            0: "bg-secondary",
            1: "bg-warning",
            2: "bg-success",
            3: "bg-danger",
            4: "bg-info",
            5: "bg-primary",
            6: "bg-dark",
            7: "bg-secondary",
            8: "bg-danger",
        };

        return statusClasses[statusCode] || "bg-secondary";
    };

    return {
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        reportItems,
        isLoading,
        handleExportExcel,
        formatCurrency,
        formatDate,
        getStatusLabel,
        getReceiptStatusLabel,
        getStatusBadgeClass,
        getReceiptStatusBadgeClass,
        filter,
        setFilter,
        totalInvoiceAmount,
        totalReceiptAmount,
        totalExcessAmount,
        totalOutstandingAmount,
        totalInvoiceCount,
        hasPermission,
    };
};

export default useSalesInvoiceReport;
