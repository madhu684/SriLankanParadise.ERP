import { useState, useEffect, useRef } from "react";
import { get_company_locations_api } from "common/services/purchaseApi";
import { get_stock_report_api } from "common/services/inventoryApi";
import { useQuery } from "@tanstack/react-query";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator";

const useStockReport = () => {
  const [selectedLoction, setSelectedLoction] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  //set up pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const {
    data: companyLocations,
    isLoading: isCompanyLocationsLoading,
    isError: isCompanyLocationsError,
    error: companyLocationsError,
  } = useQuery({
    queryKey: ["companyLocations"],
    queryFn: async () => {
      try {
        const response = await get_company_locations_api(
          sessionStorage.getItem("companyId"),
        );
        return response.data.result;
      } catch (error) {
        console.error("Error fetching production companyLocations:", error);
        return [];
      }
    },
  });

  const {
    data: reportData = [], // Default to empty array
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stockReport", startDate, endDate, selectedLoction],
    queryFn: async () => {
      const response = await get_stock_report_api(
        startDate,
        endDate,
        parseInt(selectedLoction),
      );
      return response.data.result;
    },
    enabled: !!startDate && !!endDate && !!selectedLoction, // Only fetch if all filters are selected
  });

  const handleStartDateChange = (e) => {
    console.log("from date", e.target.value);
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    console.log("to date", e.target.value);
    setEndDate(e.target.value);
  };

  const handleLocationChange = (e) => {
    console.log("location", e.target.value);
    setSelectedLoction(e.target.value);
  };

  const filteredData = reportData?.filter(
    (data) =>
      data.itemName
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      data.itemCode.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const excelExport = useExcelExport();

  const handleExport = () => {
    if (!reportData || reportData.length === 0) {
      alert("No data to export");
      return;
    }

    const columns = [
      { header: "Item Name", accessor: (item) => item.itemName, width: 20 },
      { header: "Item Code", accessor: (item) => item.itemCode, width: 15 },
      {
        header: "Batch Number",
        accessor: (item) => item.batchNumber,
        width: 15,
      },
      { header: "Unit", accessor: (item) => item.unitName, width: 10 },
      {
        header: "Opening Qty",
        accessor: (item) => item.openingBalance,
        width: 15,
      },
      { header: "In", accessor: (item) => item.totalIn, width: 10 },
      { header: "Out", accessor: (item) => item.totalOut, width: 10 },
      { header: "Sale Order", accessor: (item) => item.salesOrder, width: 15 },
      {
        header: "Purchase Order",
        accessor: (item) => item.purchaseOrder,
        width: 15,
      },
      {
        header: "Sales Invoice",
        accessor: (item) => item.salesInvoice,
        width: 15,
      },
      { header: "GRN", accessor: (item) => item.grn, width: 10 },
      { header: "MIN", accessor: (item) => item.min, width: 10 },
      { header: "TIN", accessor: (item) => item.tin, width: 10 },
      { header: "TRN", accessor: (item) => item.trnIn, width: 10 },
      { header: "Prod In", accessor: (item) => item.productionIn, width: 10 },
      { header: "Prod Out", accessor: (item) => item.productionOut, width: 10 },
      {
        header: "Packing Slip",
        accessor: (item) => item.packingSlip,
        width: 15,
      },
      {
        header: "Supp. Return",
        accessor: (item) => item.supplierReturnNote,
        width: 15,
      },
      {
        header: "Emp. Ret. In",
        accessor: (item) => item.emptyReturnIn,
        width: 15,
      },
      {
        header: "Emp. Ret. Out",
        accessor: (item) => item.emptyReturnOut,
        width: 15,
      },
      {
        header: "Emp. Ret. Red.",
        accessor: (item) => item.emptyReturnReduce,
        width: 15,
      },
      { header: "Adjusted In", accessor: (item) => item.adjustIn, width: 15 },
      { header: "Adjusted Out", accessor: (item) => item.adjustOut, width: 15 },
      {
        header: "Closing Bal",
        accessor: (item) => item.closingBalance,
        width: 15,
      },
    ];

    excelExport({
      data: reportData,
      columns: columns,
      fileName: `Stock_Report_${startDate}_to_${endDate}.xlsx`,
      sheetName: "Stock Report",
      topic: `Stock Report from ${startDate} to ${endDate}`,
    });
  };

  return {
    companyLocations,
    isCompanyLocationsLoading,
    isCompanyLocationsError,
    companyLocationsError,
    startDate,
    endDate,
    reportData,
    isLoading,
    selectedLoction,
    currentItems,
    itemsPerPage,
    currentPage,
    filteredData,
    searchTerm,
    handleStartDateChange,
    handleEndDateChange,
    handleLocationChange,
    //handleSearch,
    paginate,
    handleSearchChange,
    handleExport,
  };
};

export default useStockReport;
