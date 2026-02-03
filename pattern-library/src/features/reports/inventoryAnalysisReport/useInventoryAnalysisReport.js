import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_company_locations_api } from "common/services/purchaseApi";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator";

const useReportData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const fetchData = async (startDate, endDate, locationId) => {
    setLoading(true);
    try {
      const result = [
        {
          inventory: "Main Warehouse",
          rawMaterial: "Neelayadi Oil",
          itemCode: "10001744",
          uom: "ml",
          openingBalance: 590.0,
          receivedQty: 0.0,
          batchNo: "C79",
          actualUsage: 0.0,
          closingBalance: 590.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "Neelayadi Oil - 4L",
          itemCode: "10001860",
          uom: "Can",
          openingBalance: 30.0,
          receivedQty: 0.0,
          batchNo: "1",
          actualUsage: 0.0,
          closingBalance: 30.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "Pinda Oil",
          itemCode: null,
          uom: "ml",
          openingBalance: 30.0,
          receivedQty: 0.0,
          batchNo: "1",
          actualUsage: 0.0,
          closingBalance: 30.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "Pinda Oil - 4L",
          itemCode: "10032459",
          uom: "Can",
          openingBalance: 150.0,
          receivedQty: 0.0,
          batchNo: "1",
          actualUsage: 0.0,
          closingBalance: 150.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "beam neelayadee can 4.5l",
          itemCode: "10032316",
          uom: "Can",
          openingBalance: 10.0,
          receivedQty: 0.0,
          batchNo: "10",
          actualUsage: 0.0,
          closingBalance: 10.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "beam sarvavisadee 750ml",
          itemCode: "10001037",
          uom: "Bottle",
          openingBalance: 100.0,
          receivedQty: 0.0,
          batchNo: "100",
          actualUsage: 0.0,
          closingBalance: 100.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "beam camphor balm 1kg",
          itemCode: "10032301",
          uom: "g",
          openingBalance: 100.0,
          receivedQty: 0.0,
          batchNo: "100",
          actualUsage: 0.0,
          closingBalance: 100.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "Abana tablets",
          itemCode: "10001541",
          uom: "Units",
          openingBalance: 100.0,
          receivedQty: 0.0,
          batchNo: "100",
          actualUsage: 0.0,
          closingBalance: 100.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
        {
          inventory: "Main Warehouse",
          rawMaterial: "Abana tablets 60's",
          itemCode: "10003103",
          uom: "Units",
          openingBalance: 100.0,
          receivedQty: 0.0,
          batchNo: "10",
          actualUsage: 0.0,
          closingBalance: 100.0,
          grnQty: 0.0,
          productionInQty: 0.0,
          returnInQty: 0.0,
          productionOutQty: 0.0,
          returnQty: 0.0,
          stAdjIn: 0.0,
          stAdjOut: 0.0,
          stDisOut: 0.0,
        },
      ];
      setError(null);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCurrentDate,
    fetchData,
  };
};

const useInventoryAnalysisReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const inedxOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = inedxOfLastItem - itemsPerPage;
  const currentItems = data
    ? data.slice(indexOfFirstItem, inedxOfLastItem)
    : [];

  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const { loading, error, fetchData, getCurrentDate } = useReportData();

  const { data: companyLocations } = useQuery({
    queryKey: ["companyLocations"],
    queryFn: async () => {
      try {
        const response = await get_company_locations_api(
          sessionStorage.getItem("companyId"),
        );
        console.log(response);
        return response.data.result;
      } catch (error) {
        console.error("Error fetching production companyLocations:", error);
        return [];
      }
    },
  });

  const handleStartDateChange = (e) => {
    console.log("start date: ", e.target.value);
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    console.log("End date: ", e.target.value);
    setEndDate(e.target.value);
  };

  const handleWarehouseOnChange = (e) => {
    console.log("Selected warehouse: ", e.target.value);
    setSelectedWarehouse(parseInt(e.target.value));
  };

  const exportToExcel = useExcelExport();

  const handleExportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available for export");
      return;
    }
    const columns = [
      { header: "Raw Material", accessor: (item) => item.rawMaterial },
      { header: "Item Code", accessor: (item) => item.itemCode },
      { header: "UOM", accessor: (item) => item.uom },
      { header: "Lot No", accessor: (item) => item.batchNo },
      { header: "Opening Balance", accessor: (item) => item.openingBalance },
      { header: "GRN", accessor: (item) => item.grnQty },
      { header: "Production In", accessor: (item) => item.productionInQty },
      { header: "Rreturn In", accessor: (item) => item.returnInQty },
      { header: "Total In", accessor: (item) => item.receivedQty },
      { header: "Production Out", accessor: (item) => item.productionOutQty },
      { header: "Return", accessor: (item) => item.returnQty },
      { header: "Total Out", accessor: (item) => item.actualUsage },
      { header: "Stock Adjusted In", accessor: (item) => item.stAdjIn },
      { header: "Stock Adjusted Out", accessor: (item) => item.stAdjOut },
      { header: "Stock Disposal", accessor: (item) => item.stDisOut },
      { header: "Closing Balance", accessor: (item) => item.closingBalance },
    ];
    exportToExcel({
      data: data,
      columns,
      fileName: `Inventory_Analysis_Report_for_${data[0].inventory}.xlsx`,
      sheetName: "Inventory Analysis",
      topic: `Inventory Analysis Report from ${startDate} to ${endDate} for ${data[0].inventory}`,
    });
  };

  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startDate && endDate && selectedWarehouse) {
      const result = await fetchData(startDate, endDate, selectedWarehouse); // Fetch data only when the form is submitted
      setData(result);
    }
  };

  return {
    data,
    loading,
    error,
    companyLocations,
    handleStartDateChange,
    handleEndDateChange,
    handleWarehouseOnChange,
    handleSubmit,
    getCurrentDate,
    handleExportToExcel,
    handlePrint,
    startDate,
    endDate,
    selectedWarehouse,
    totalPages,
    currentPage,
    currentItems,
    itemsPerPage,
    handlePageChange,
  };
};

export default useInventoryAnalysisReport;
