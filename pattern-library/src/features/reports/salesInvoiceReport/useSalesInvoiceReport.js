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
        const items = reportData?.data?.result || [];
        // Sort items by Invoice No to ensure grouping, although the API might already do this
        const sortedItems = [...items].sort((a, b) => a.invoiceNo.localeCompare(b.invoiceNo));

        const processedItems = [];
        let currentInvoiceId = null;
        let spanCount = 0;
        let spanStartIndex = 0;

        sortedItems.forEach((item, index) => {
            const newItem = { ...item, rowSpan: 0 }; // Default to 0 (hidden)

            if (item.salesInvoiceId !== currentInvoiceId) {
                // New invoice group starting
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

            processedItems.push(newItem);
        });

        // Handle the last group
        if (processedItems.length > 0) {
            processedItems[spanStartIndex].rowSpan = spanCount;
        }

        return processedItems;
    }, [reportData]);

    const { totalInvoiceAmount, totalReceiptAmount, totalDifference, totalInvoiceCount } = useMemo(() => {
        if (!reportItems.length) return { totalInvoiceCount: 0, totalInvoiceAmount: 0, totalReceiptAmount: 0 };

        const uniqueInvoices = new Set();
        let invoiceSum = 0;
        let receiptSum = 0;

        reportItems.forEach((item) => {
            // Sum Receipt Amount
            receiptSum += item.receiptAmount || 0;

            // Sum Invoice Amount (only for unique invoices to avoid double counting)
            if (!uniqueInvoices.has(item.salesInvoiceId)) {
                uniqueInvoices.add(item.salesInvoiceId);
                invoiceSum += item.invoiceAmount || 0;
            }
        });

        return { totalInvoiceAmount: invoiceSum, totalReceiptAmount: receiptSum, totalDifference: invoiceSum - receiptSum, totalInvoiceCount: uniqueInvoices.size };
    }, [reportItems]);



    const handleExportExcel = () => {
        if (reportItems.length === 0) {
            alert("No data to export");
            return;
        }

        const columns = [
            { header: "Invoice No", accessor: (d) => d.invoiceNo, width: 20 },
            { header: "Customer Name", accessor: (d) => d.customerName, width: 30 },
            { header: "Invoice Status", accessor: (d) => getStatusLabel(d.invoiceStatus), width: 15 },
            { header: "Invoice Amount", accessor: (d) => d.invoiceAmount, width: 15 },
            { header: "Receipt No", accessor: (d) => d.receiptNumber, width: 20 },
            { header: "Receipt Amount", accessor: (d) => d.receiptAmount, width: 15 },
            { header: "Excess Amount", accessor: (d) => d.excessAmount, width: 15 },
            { header: "Due Amount", accessor: (d) => d.dueAmount, width: 15 },
            { header: "Payment Mode", accessor: (d) => d.paymentMode, width: 15 },
            { header: "Receipt Status", accessor: (d) => getReceiptStatusLabel(d.receiptStatus), width: 15 },
            { header: "Receipt Date", accessor: (d) => formatDate(d.receiptDate), width: 15 },
        ];

        exportToExcel({
            data: reportItems,
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
        totalDifference,
        totalInvoiceCount,
        hasPermission,
    };
};

export default useSalesInvoiceReport;
