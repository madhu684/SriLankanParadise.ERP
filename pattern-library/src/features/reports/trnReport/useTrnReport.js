import { useState, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    get_requisition_masters_with_out_drafts_api,
} from "../../../common/services/purchaseApi";
import { useExcelExport } from "../../../common/components/common/excelSheetGenerator/excelSheetGenerator";
import { UserContext } from "../../../common/context/userContext";
import moment from "moment-timezone";

const useTrnReport = () => {
    const { hasPermission, userLocations } = useContext(UserContext);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");

    const exportToExcel = useExcelExport();

    const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

    // Get warehouse locations for the dropdown
    const warehouseLocations = useMemo(() => {
        if (!userLocations) return [];
        return userLocations
            .filter((loc) => loc.location.locationTypeId === 2)
            .map((l) => ({
                locationId: l.locationId,
                locationName: l.location.locationName,
            }));
    }, [userLocations]);

    // Fetch TRN data using the existing API
    const {
        data: rawData,
        isLoading,
    } = useQuery({
        queryKey: [
            "trnReport",
            companyId,
            selectedWarehouse,
        ],
        queryFn: async () => {
            const response = await get_requisition_masters_with_out_drafts_api(
                companyId,
                null, // status - get all non-drafts
                selectedWarehouse || null, // requestedToLocationId
                null, // requestedFromLocationId
                "TRN", // issueType
            );
            return response?.data?.result || [];
        },
        enabled: !!companyId,
    });

    // Process and flatten TRN + TIN data, filtered by date range
    const reportItems = useMemo(() => {
        if (!rawData || rawData.length === 0) return [];

        // Filter by date range
        let filteredData = rawData;
        if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            filteredData = filteredData.filter((trn) => {
                const trnDate = new Date(trn.requisitionDate);
                return trnDate >= from;
            });
        }
        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            filteredData = filteredData.filter((trn) => {
                const trnDate = new Date(trn.requisitionDate);
                return trnDate <= to;
            });
        }

        // Sort by date descending
        filteredData.sort(
            (a, b) => new Date(b.requisitionDate) - new Date(a.requisitionDate)
        );

        // Flatten TRN + TIN into rows with rowSpan info
        const processedItems = [];
        let trnCounter = 0;

        filteredData.forEach((trn) => {
            trnCounter++;
            const tins = trn.issueMasters || [];

            if (tins.length === 0) {
                // TRN with no TINs - single row
                processedItems.push({
                    trnIndex: trnCounter,
                    rowSpan: 1,
                    // TRN fields
                    trnReferenceNumber: trn.referenceNumber,
                    trnCreatedDate: trn.requisitionDate,
                    trnCreatedUser: trn.requestedBy,
                    trnWarehouse: trn.requestedFromLocation?.locationName || "-",
                    trnToWarehouse: trn.requestedToLocation?.locationName || "-",
                    trnStatus: trn.status,
                    trnApprovedUser: trn.approvedBy,
                    trnApprovedDate: trn.approvedDate,
                    // TIN fields - empty
                    tinReferenceNumber: "-",
                    tinCreatedDate: null,
                    tinCreatedUser: "-",
                    tinWarehouse: "-",
                    tinStatus: null,
                    tinApprovedUser: "-",
                    tinApprovedDate: null,
                    tinAccepted: null,
                });
            } else {
                tins.forEach((tin, tinIndex) => {
                    processedItems.push({
                        trnIndex: trnCounter,
                        rowSpan: tinIndex === 0 ? tins.length : 0,
                        // TRN fields
                        trnReferenceNumber: trn.referenceNumber,
                        trnCreatedDate: trn.requisitionDate,
                        trnCreatedUser: trn.requestedBy,
                        trnWarehouse: trn.requestedFromLocation?.locationName || "-",
                        trnToWarehouse: trn.requestedToLocation?.locationName || "-",
                        trnStatus: trn.status,
                        trnApprovedUser: trn.approvedBy,
                        trnApprovedDate: trn.approvedDate,
                        // TIN fields
                        tinReferenceNumber: tin.referenceNumber || "-",
                        tinCreatedDate: tin.issueDate,
                        tinCreatedUser: tin.createdBy || "-",
                        tinWarehouse: trn.requestedToLocation?.locationName || "-",
                        tinStatus: tin.status,
                        tinApprovedUser: tin.approvedBy || "-",
                        tinApprovedDate: tin.approvedDate,
                        tinAccepted: tin.status
                            ? String(tin.status).charAt(1) === "5"
                            : false,
                    });
                });
            }
        });

        return processedItems;
    }, [rawData, fromDate, toDate]);

    // Summary counts
    const { totalTrnCount, totalTinCount, acceptedTinCount, pendingTinCount } =
        useMemo(() => {
            if (!reportItems || reportItems.length === 0) {
                return {
                    totalTrnCount: 0,
                    totalTinCount: 0,
                    acceptedTinCount: 0,
                    pendingTinCount: 0,
                };
            }

            const trnSet = new Set();
            let tinCount = 0;
            let accepted = 0;
            let pending = 0;

            reportItems.forEach((item) => {
                trnSet.add(item.trnReferenceNumber);
                if (item.tinReferenceNumber !== "-") {
                    tinCount++;
                    if (item.tinAccepted) {
                        accepted++;
                    } else {
                        pending++;
                    }
                }
            });

            return {
                totalTrnCount: trnSet.size,
                totalTinCount: tinCount,
                acceptedTinCount: accepted,
                pendingTinCount: pending,
            };
        }, [reportItems]);

    // Format date/time
    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return moment
            .utc(dateString)
            .tz("Asia/Colombo")
            .format("YYYY-MM-DD hh:mm A");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return moment.utc(dateString).tz("Asia/Colombo").format("YYYY-MM-DD");
    };

    // Status helpers (second digit based)
    const getStatusLabel = (statusCode) => {
        if (statusCode === null || statusCode === undefined) return "-";
        const secondDigit = parseInt(String(statusCode).charAt(1), 10);
        const statusLabels = {
            0: "Draft",
            1: "Pending Approval",
            2: "Approved",
            3: "Rejected",
            4: "In Progress",
            5: "Completed",
            6: "Cancelled",
            7: "On Hold",
        };
        return statusLabels[secondDigit] || "Unknown";
    };

    const getStatusBadgeClass = (statusCode) => {
        if (statusCode === null || statusCode === undefined) return "bg-secondary";
        const secondDigit = parseInt(String(statusCode).charAt(1), 10);
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
        return statusClasses[secondDigit] || "bg-secondary";
    };

    // Excel export
    const handleExportExcel = () => {
        if (reportItems.length === 0) {
            alert("No data to export");
            return;
        }

        const columns = [
            {
                header: "TRN Number",
                accessor: (d) => d.trnReferenceNumber,
                width: 20,
            },
            {
                header: "TRN Created Date",
                accessor: (d) => formatDateTime(d.trnCreatedDate),
                width: 22,
            },
            {
                header: "TRN Created User",
                accessor: (d) => d.trnCreatedUser,
                width: 18,
            },
            {
                header: "TRN From Warehouse",
                accessor: (d) => d.trnWarehouse,
                width: 20,
            },
            {
                header: "TRN To Warehouse",
                accessor: (d) => d.trnToWarehouse,
                width: 20,
            },
            {
                header: "TRN Status",
                accessor: (d) => getStatusLabel(d.trnStatus),
                width: 15,
            },
            {
                header: "TRN Approved User",
                accessor: (d) => d.trnApprovedUser || "-",
                width: 18,
            },
            {
                header: "TRN Approved Date",
                accessor: (d) => formatDateTime(d.trnApprovedDate),
                width: 22,
            },
            {
                header: "TIN Number",
                accessor: (d) => d.tinReferenceNumber,
                width: 20,
            },
            {
                header: "TIN Created Date",
                accessor: (d) => formatDateTime(d.tinCreatedDate),
                width: 22,
            },
            {
                header: "TIN Created User",
                accessor: (d) => d.tinCreatedUser,
                width: 18,
            },
            {
                header: "TIN Warehouse",
                accessor: (d) => d.tinWarehouse,
                width: 20,
            },
            {
                header: "TIN Status",
                accessor: (d) => (d.tinStatus !== null ? getStatusLabel(d.tinStatus) : "-"),
                width: 15,
            },
            {
                header: "TIN Approved User",
                accessor: (d) => d.tinApprovedUser || "-",
                width: 18,
            },
            {
                header: "TIN Approved Date",
                accessor: (d) => formatDateTime(d.tinApprovedDate),
                width: 22,
            },
            {
                header: "Accepted/Not Accepted",
                accessor: (d) =>
                    d.tinAccepted === null ? "-" : d.tinAccepted ? "Accepted" : "Not Accepted",
                width: 20,
            },
        ];

        const warehouseName = selectedWarehouse
            ? warehouseLocations.find(
                (w) => String(w.locationId) === String(selectedWarehouse)
            )?.locationName || ""
            : "All";

        exportToExcel({
            data: reportItems,
            columns: columns,
            fileName: `TRN_Report_${fromDate || "all"}_${toDate || "all"}.xlsx`,
            sheetName: "TRN Report",
            topic: `TRN Report - ${fromDate || "all"} to ${toDate || "all"} - Warehouse: ${warehouseName}`,
        });
    };

    return {
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        selectedWarehouse,
        setSelectedWarehouse,
        warehouseLocations,
        reportItems,
        isLoading,
        handleExportExcel,
        formatDateTime,
        formatDate,
        getStatusLabel,
        getStatusBadgeClass,
        totalTrnCount,
        totalTinCount,
        acceptedTinCount,
        pendingTinCount,
        hasPermission,
    };
};

export default useTrnReport;
