import { useState, useEffect, useRef } from "react";
import { get_company_locations_api } from "../../services/purchaseApi";
import { get_stock_report_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useStockReport = () => {
  const [selectedLoction, setSelectedLoction] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //set up pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = reportData?.filter(
    (data) =>
      data.itemName
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      data.itemCode.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

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
          sessionStorage.getItem("companyId")
        );
        return response.data.result;
      } catch (error) {
        console.error("Error fetching production companyLocations:", error);
        return [];
      }
    },
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

  const handleSearch = async () => {
    if (!startDate || !endDate || !selectedLoction) return;
    setIsLoading(true);
    try {
      const response = await get_stock_report_api(
        startDate,
        endDate,
        parseInt(selectedLoction)
      );
      setReportData(response.data.result);
    } catch (error) {
      console.error("Error fetching stock report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
    handleSearch,
    paginate,
    handleSearchChange,
  };
};

export default useStockReport;
