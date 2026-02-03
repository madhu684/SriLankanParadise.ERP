import { useState, useContext, useMemo } from "react";
import { UserContext } from "common/context/userContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get_min_report_api } from "common/services/reportsApi";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator";

const useMinReport = () => {
  const { allLocations, user } = useContext(UserContext);
  const companyId = user?.companyId || 1;

  const [locationId, setLocationId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [issueType, setIssueType] = useState("MIN"); // Default to MIN as per the name of the report

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = useExcelExport();

  const {
    data: reportData,
    isLoading: isLoadingReport,
    error: reportError,
    refetch,
  } = useQuery({
    queryKey: [
      "minReport",
      companyId,
      locationId,
      fromDate,
      toDate,
      issueType,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      get_min_report_api({
        companyId,
        locationId: locationId || null,
        startDate: fromDate || null,
        endDate: toDate || null,
        issueType: issueType || null,
        pageNumber,
        pageSize,
      }),
    enabled: !!companyId && !!issueType,
    placeholderData: keepPreviousData,
  });

  const toggleIssueDetails = (id) => {
    setExpandedIssueId(expandedIssueId === id ? null : id);
  };

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

  const handleDownloadExcel = async () => {
    try {
      setIsExporting(true);

      let allReportItems = [];
      const firstResponse = await get_min_report_api({
        companyId,
        locationId: locationId || null,
        startDate: fromDate || null,
        endDate: toDate || null,
        issueType: issueType || null,
        pageNumber: 1,
        pageSize: 50,
      });

      if (firstResponse?.data?.result) {
        const { data, pagination } = firstResponse.data.result;
        allReportItems = [...(data || [])];

        if (pagination && pagination.totalPages > 1) {
          const remainingPagePromises = [];
          for (let p = 2; p <= pagination.totalPages; p++) {
            remainingPagePromises.push(
              get_min_report_api({
                companyId,
                locationId: locationId || null,
                startDate: fromDate || null,
                endDate: toDate || null,
                issueType: issueType || null,
                pageNumber: p,
                pageSize: 50,
              }),
            );
          }

          const otherResponses = await Promise.all(remainingPagePromises);
          otherResponses.forEach((res) => {
            if (res?.data?.result?.data) {
              allReportItems = [...allReportItems, ...res.data.result.data];
            }
          });
        }
      }

      if (allReportItems.length === 0) {
        alert("No data available to export");
        setIsExporting(false);
        return;
      }

      const exportData = [];
      allReportItems.forEach((item) => {
        if (item.issueDetails && item.issueDetails.length > 0) {
          item.issueDetails.forEach((detail, index) => {
            exportData.push({
              ...item,
              itemDetail: detail,
              isFirstItem: index === 0,
            });
          });
        } else {
          exportData.push({
            ...item,
            itemDetail: null,
            isFirstItem: true,
          });
        }
      });

      const columns = [
        {
          header: "Reference",
          accessor: (d) =>
            d.isFirstItem ? d.referenceNumber || d.issueMasterId : "",
          width: 30,
        },
        {
          header: "Date",
          accessor: (d) => (d.isFirstItem ? formatDate(d.issueDate) : ""),
          width: 15,
        },
        {
          header: "Location",
          accessor: (d) =>
            d.isFirstItem
              ? allLocations.find(
                  (loc) => loc.locationId === d.issuedLocationId,
                )?.locationName || d.issuedLocationId
              : "",
          width: 20,
        },
        {
          header: "Type",
          accessor: (d) => (d.isFirstItem ? d.issueType : ""),
          width: 10,
        },
        {
          header: "Token No",
          accessor: (d) => (d.isFirstItem ? d.tokenNo || "-" : ""),
          width: 10,
        },
        {
          header: "Created User",
          accessor: (d) => (d.isFirstItem ? d.createdBy || "-" : ""),
          width: 15,
        },
        {
          header: "Item Name",
          accessor: (d) => d.itemDetail?.itemMaster?.itemName || "-",
          width: 30,
        },
        {
          header: "Unit",
          accessor: (d) => d.itemDetail?.itemMaster?.unit?.unitName || "-",
          width: 10,
        },
        {
          header: "Dispatched Qty",
          accessor: (d) => d.itemDetail?.quantity || 0,
          width: 15,
        },
      ];

      // Dynamic naming based on issueType
      const getReportNames = (type) => {
        switch (type?.toUpperCase()) {
          case "MIN":
            return {
              prefix: "MIN",
              sheetName: "MIN Report",
              fullName: "Material Issue Note",
            };
          case "TIN":
            return {
              prefix: "TIN",
              sheetName: "TIN Report",
              fullName: "Transfer Issue Note",
            };
          default:
            return {
              prefix: "Issue",
              sheetName: "Issue Report",
              fullName: "Issue",
            };
        }
      };

      const reportNames = getReportNames(issueType);
      const currentDate = new Date().toISOString().split("T")[0];

      exportToExcel({
        data: exportData,
        columns: columns,
        fileName: `${reportNames.prefix}_Report_${currentDate}.xlsx`,
        sheetName: reportNames.sheetName,
        topic: `${reportNames.fullName} Report - ${issueType || "All"}`,
      });
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export excel sheet");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (name, value) => {
    // This function is kept for backward compatibility if needed,
    // but we'll likely use individual setters in the component.
    if (name === "locationId") setLocationId(value);
    if (name === "fromDate") setFromDate(value);
    if (name === "toDate") setToDate(value);
    if (name === "issueType") setIssueType(value);
    setPageNumber(1);
  };

  const paginate = (page) => {
    setPageNumber(page);
  };

  const reportItems = useMemo(() => {
    return reportData?.data?.result?.data || [];
  }, [reportData]);

  const totalItems = useMemo(() => {
    return reportData?.data?.result?.pagination?.totalCount || 0;
  }, [reportData]);

  return {
    allLocations,
    locationId,
    setLocationId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    issueType,
    setIssueType,
    handleFilterChange,
    reportItems,
    isLoadingReport,
    reportError,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    totalItems,
    paginate,
    refetch,
    expandedIssueId,
    toggleIssueDetails,
    formatCurrency,
    formatDate,
    handleDownloadExcel,
    isExporting,
  };
};

export default useMinReport;













