import { useState, useMemo, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_trn_report_api } from "../../../common/services/purchaseApi";
import { useExcelExport } from "../../../common/components/common/excelSheetGenerator/excelSheetGenerator";
import { UserContext } from "../../../common/context/userContext";
import moment from "moment-timezone";

const useTrnReport = () => {
    const { user, userLocations, allLocations } = useContext(UserContext);

    const PRIVILEGED_USER_IDS = [1, 44];
    // 1 - Mr. Pathum
    //44 - Dr. Chamila

    // Default dates: Yesterday and Today
    const today = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    const yesterday = moment().tz("Asia/Colombo").subtract(1, 'days').format("YYYY-MM-DD");

    const [fromDate, setFromDate] = useState(yesterday);
    const [toDate, setToDate] = useState(today);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [searchText, setSearchText] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [isExporting, setIsExporting] = useState(false);

    const exportToExcel = useExcelExport();

    const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

    // Get warehouse locations based on user role
    const warehouseLocations = useMemo(() => {
        if (!user) return [];

        const locationsSource = PRIVILEGED_USER_IDS.includes(user.userId) ? allLocations : userLocations;

        if (!locationsSource) return [];

        return locationsSource
            .filter((loc) => {
                const location = loc.location || loc;
                return location.locationTypeId === 2;
            })
            .map((loc) => {
                const location = loc.location || loc;
                return {
                    locationId: loc.locationId || location.locationId,
                    locationName: location.locationName,
                };
            });

    }, [user, allLocations, userLocations]);

    const isPrivilegedUser = useMemo(() => {
        return user && PRIVILEGED_USER_IDS.includes(user.userId);
    }, [user, PRIVILEGED_USER_IDS]);

    // Set default warehouse
    useEffect(() => {
        if (isPrivilegedUser) {
            // For privileged users, default to "All Locations" (empty string) if not already set
            if (selectedWarehouse === undefined || selectedWarehouse === null) {
                setSelectedWarehouse("");
            }
        } else if (warehouseLocations.length > 0 && !selectedWarehouse) {
            setSelectedWarehouse(warehouseLocations[0].locationId);
        }
    }, [warehouseLocations, selectedWarehouse, isPrivilegedUser]);

    // Fetch TRN data using the dedicated report API
    const {
        data: rawData,
        isLoading,
    } = useQuery({
        queryKey: [
            "trnReport",
            companyId,
            fromDate,
            toDate,
            selectedWarehouse,
            searchText,
            pageNumber,
            pageSize
        ],
        queryFn: async () => {
            const response = await get_trn_report_api(
                companyId,
                fromDate || null,
                toDate || null,
                selectedWarehouse || null,
                searchText || null,
                null, // createdUserId
                pageNumber,
                pageSize
            );
            return response?.data?.result || { data: [], pagination: {} };
        },
        enabled: !!companyId,
    });

    const { reportData, pagination } = useMemo(() => {
        if (!rawData) return { reportData: [], pagination: {} };
        // Handle both old array format (fallback) and new object format
        if (Array.isArray(rawData)) {
            return { reportData: rawData, pagination: {} };
        }
        return {
            reportData: rawData.data || [],
            pagination: rawData.pagination || {}
        };
    }, [rawData]);

    // Helper to process data
    const processTrnData = (data, startIndex = 0) => {
        const processedItems = [];
        let trnCounter = startIndex;

        data.forEach((trn) => {
            trnCounter++;
            const tins = trn.issueMasters || [];

            if (tins.length === 0) {
                processedItems.push({
                    trnIndex: trnCounter,
                    rowSpan: 1,
                    trnReferenceNumber: trn.referenceNumber,
                    trnCreatedDate: trn.requisitionDate,
                    trnCreatedUser: trn.requestedBy,
                    trnWarehouse: trn.requestedFromLocation?.locationName || "-",
                    trnToWarehouse: trn.requestedToLocation?.locationName || "-",
                    trnStatus: trn.status,
                    trnApprovedUser: trn.approvedBy,
                    trnApprovedDate: trn.approvedDate,
                    tinReferenceNumber: "-",
                    tinCreatedDate: null,
                    tinCreatedUser: "-",
                    tinWarehouse: "-",
                    tinStatus: null,
                    tinApprovedUser: "-",
                    tinApprovedDate: null,
                    tinAccepted: null,
                    tinAcceptedDate: null,
                });
            } else {
                tins.forEach((tin, tinIndex) => {
                    processedItems.push({
                        trnIndex: trnCounter,
                        rowSpan: tinIndex === 0 ? tins.length : 0,
                        trnReferenceNumber: trn.referenceNumber,
                        trnCreatedDate: trn.requisitionDate,
                        trnCreatedUser: trn.requestedBy,
                        trnWarehouse: trn.requestedFromLocation?.locationName || "-",
                        trnToWarehouse: trn.requestedToLocation?.locationName || "-",
                        trnStatus: trn.status,
                        trnApprovedUser: trn.approvedBy,
                        trnApprovedDate: trn.approvedDate,
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
                        tinAcceptedDate: tin.acceptedDate,
                    });
                });
            }
        });
        return processedItems;
    };

    // Process and flatten TRN + TIN data into rows with rowSpan info
    const reportItems = useMemo(() => {
        if (!reportData || reportData.length === 0) return [];
        return processTrnData(reportData, (pageNumber - 1) * pageSize);
    }, [reportData, pageNumber, pageSize]);

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

    // Pagination handler
    const paginate = (page) => {
        setPageNumber(page);
    };

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

    // TRN Status helpers (direct status code)
    const getTrnStatusLabel = (statusCode) => {
        if (statusCode === null || statusCode === undefined) return "-";
        const status = parseInt(statusCode, 10);
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
        return statusLabels[status] || "Unknown";
    };

    // TIN Status helpers (second digit based)
    const getTinStatusLabel = (statusCode) => {
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

    const getTrnStatusBadgeClass = (statusCode) => {
        if (statusCode === null || statusCode === undefined) return "bg-secondary";
        const status = parseInt(statusCode, 10);
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
        return statusClasses[status] || "bg-secondary";
    };

    const getTinStatusBadgeClass = (statusCode) => {
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
    const handleExportExcel = async () => {
        try {
            setIsExporting(true);

            // Fetch all data
            const allDataResponse = await get_trn_report_api(
                companyId,
                fromDate || null,
                toDate || null,
                selectedWarehouse || null,
                searchText || null,
                null, // createdUserId
                1,
                100000 // Large page size to get all records
            );

            const allData = allDataResponse?.data?.result?.data || [];

            if (allData.length === 0) {
                alert("No data to export");
                setIsExporting(false);
                return;
            }

            const processedAllData = processTrnData(allData, 0);

            const columns = [
                {
                    header: "TRN Number",
                    accessor: (d) => d.trnReferenceNumber,
                    width: 25,
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
                    header: "Requested Location",
                    accessor: (d) => d.trnWarehouse,
                    width: 20,
                },
                {
                    header: "TRN Status",
                    accessor: (d) => getTrnStatusLabel(d.trnStatus),
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
                    width: 25,
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
                    header: "Dispatched Location",
                    accessor: (d) => d.tinWarehouse,
                    width: 20,
                },
                {
                    header: "TIN Status",
                    accessor: (d) => (d.tinStatus !== null ? getTinStatusLabel(d.tinStatus) : "-"),
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
                {
                    header: "Accepted Time",
                    accessor: (d) => formatDateTime(d.tinAcceptedDate),
                    width: 22,
                },
            ];

            const warehouseName = selectedWarehouse
                ? warehouseLocations.find(
                    (w) => String(w.locationId) === String(selectedWarehouse)
                )?.locationName || ""
                : "All";

            exportToExcel({
                data: processedAllData,
                columns: columns,
                fileName: `TRN_Report_${fromDate || "all"}_${toDate || "all"}.xlsx`,
                sheetName: "TRN Report",
                topic: `TRN Report - ${fromDate || "all"} to ${toDate || "all"} - Location: ${warehouseName}`,
            });
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export Excel file.");
        } finally {
            setIsExporting(false);
        }
    };

    return {
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        selectedWarehouse,
        setSelectedWarehouse,
        searchText,
        setSearchText,
        warehouseLocations,
        reportItems,
        isLoading,
        handleExportExcel,
        formatDateTime,
        formatDate,
        formatDate,
        getTrnStatusLabel,
        getTinStatusLabel,
        getTrnStatusBadgeClass,
        getTinStatusBadgeClass,
        totalTrnCount,
        totalTinCount,
        acceptedTinCount,
        pendingTinCount,
        isPrivilegedUser,
        paginate,
        pageNumber,
        setPageNumber,
        pageSize,
        setPageSize,
        totalPages: pagination.totalPages || 1,
        totalItems: pagination.totalCount || 0,
        isExporting,
    };
};

export default useTrnReport;
