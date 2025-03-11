import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  get_location_types_by_company_id_api,
  get_company_locations_api,
} from "../../services/purchaseApi";
import { useExcelExport } from "../common/excelSheetGenerator/excelSheetGenerator";

const useReportData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const fetchData = async (startDate, locationTypeId, locationId) => {
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
          itemCode: "10032969",
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

const useInventoryAsAtDateReport = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [locationTypeId, setLocationTypeId] = useState(0);
  const [locationId, setLocationId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const inedxOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = inedxOfLastItem - itemsPerPage;

  const currentItems = data
    ? data.slice(indexOfFirstItem, inedxOfLastItem)
    : [];
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const { loading, error, fetchData, getCurrentDate } = useReportData();
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const { data: locationTypes } = useQuery({
    queryKey: ["locationTypes"],
    queryFn: async () => {
      try {
        const response = await get_location_types_by_company_id_api(
          sessionStorage.getItem("companyId")
        );
        const filteredRes = response.data.result.filter(
          (loc) => loc.locationTypeId !== 3
        );
        return filteredRes;
      } catch (error) {
        console.error("Error fetching location types:", error);
        return [];
      }
    },
  });

  useEffect(() => {
    if (locationTypes?.length > 0) {
      setLocationTypeId(locationTypes[0]?.locationTypeId);
    }
  }, [locationTypes]);

  console.log(locationId);

  const { data: locations } = useQuery({
    queryKey: ["companyLocations"],
    queryFn: async () => {
      try {
        const response = await get_company_locations_api(
          sessionStorage.getItem("companyId")
        );
        return response.data.result;
      } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
      }
    },
  });

  const filteredLocations = useMemo(() => {
    return locations?.filter(
      (location) => location.locationTypeId === locationTypeId
    );
  }, [locations, locationTypeId]);

  const handleStartDateChange = (e) => {
    console.log("start date: ", e.target.value);
    setStartDate(e.target.value);
  };

  const handleLocationTypeChange = (e) => {
    setLocationTypeId(parseInt(e.target.value));
    setLocationId(0);
  };

  const handleLocationChange = (e) => {
    console.log("Selected location: ", e.target.value);
    setLocationId(parseInt(e.target.value));
  };

  const exportToExcel = useExcelExport();

  const handleExportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    const columns = [
      { header: "Inventory", accessor: (item) => item.inventory },
      { header: "Raw Material", accessor: (item) => item.rawMaterial },
      { header: "Item Code", accessor: (item) => item.itemCode },
      { header: "UOM", accessor: (item) => item.uom },
      { header: "Lot No", accessor: (item) => item.batchNo },
      { header: "Closing Balance", accessor: (item) => item.closingBalance },
    ];
    exportToExcel({
      data: data,
      columns,
      fileName: `Inventory_Analysis_Report_for_${data[0].inventory}_on_${startDate}.xlsx`,
      sheetName: "Inventory Analysis",
      topic: `Inventory Analysis Report for ${data[0].inventory} On ${startDate}}`,
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
    if (startDate) {
      const result = await fetchData(startDate, locationTypeId, locationId);
      setData(result);
    }
  };

  return {
    data,
    loading,
    error,
    locationTypes,
    locations,
    filteredLocations,
    handleStartDateChange,
    handleLocationTypeChange,
    handleLocationChange,
    handleSubmit,
    getCurrentDate,
    startDate,
    locationTypeId,
    locationId,
    totalPages,
    currentPage,
    currentItems,
    itemsPerPage,
    handlePageChange,
    handleExportToExcel,
    handlePrint,
  };
};

export default useInventoryAsAtDateReport;
