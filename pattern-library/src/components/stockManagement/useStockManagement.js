import { useQuery } from "@tanstack/react-query";
import { get_item_locations_inventories_by_location_id_api } from "../../services/purchaseApi";
import { useCallback, useState, useEffect } from "react";
import { useExcelExport } from "../common/excelSheetGenerator/excelSheetGenerator";

const useStockManagement = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stockFilter, setStockFilter] = useState("all");
  const itemsPerPage = 10;

  const filteredInventories = inventories
    ? inventories.filter((item) => {
        // Filter by search term
        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          const matchesSearch =
            (item.itemName &&
              item.itemName.toLowerCase().includes(lowerTerm)) ||
            (item.itemCode && item.itemCode.toLowerCase().includes(lowerTerm));
          if (!matchesSearch) return false;
        }

        // Filter by stock level
        const stockInHand = item.stockInHand || 0;
        if (stockFilter === "positive") {
          return stockInHand > 0;
        } else if (stockFilter === "zeroOrBelow") {
          return stockInHand <= 0;
        }
        return true; // "all" - no stock filter
      })
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventories
    ? filteredInventories.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stockFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLocationChange = (e) => {
    console.log("Selected location: ", e.target.value);
    setSelectedLocation(parseInt(e.target.value));
  };

  const handleDateChange = (e) => {
    console.log("Selected date: ", e.target.value);
    setSelectedDate(e.target.value);
  };

  const handleSearch = useCallback(async () => {
    if (!selectedLocation) return;

    setLoading(true);
    try {
      const inventory = await get_item_locations_inventories_by_location_id_api(
        selectedLocation
      );
      setInventories(inventory.data.result);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value);
  };

  const exportToExcel = useExcelExport();

  const getStockFilterLabel = () => {
    switch (stockFilter) {
      case "positive":
        return "Positive Stock Items";
      case "zeroOrBelow":
        return "Zero Stock Items";
      default:
        return "All Items";
    }
  };

  const handleExportToExcel = useCallback(
    (selectedLocationName) => {
      const filterLabel = getStockFilterLabel();
      const today = new Date().toLocaleDateString("en-GB");
      const columns = [
        {
          header: "Item Code",
          accessor: (item) => item.itemCode || "",
          width: 15,
        },
        {
          header: "Item Name",
          accessor: (item) => item.itemName || "",
          width: 30,
        },
        { header: "UOM", accessor: (item) => item.unitName || "", width: 10 },
        {
          header: "Stock in Hand",
          accessor: (item) => item.stockInHand || 0,
          width: 15,
        },
        {
          header: "Batch No",
          accessor: (item) => item.batchNo || "N/A",
          width: 15,
        },
      ];

      exportToExcel({
        data: filteredInventories,
        columns,
        fileName: `Stock_Report_${filterLabel.replace(
          / /g,
          "_"
        )}_for_${selectedLocationName} .xlsx`,
        sheetName: `Stock Report for ${selectedLocationName}`,
        topic: `Stock Report for ${selectedLocationName} on ${today} - ${filterLabel}`,
      });
    },
    [exportToExcel, filteredInventories, stockFilter]
  );

  return {
    selectedLocation,
    inventories: filteredInventories,
    currentItems,
    itemsPerPage,
    currentPage,
    loading,
    paginate,
    handleSearch,
    searchTerm,
    handleSearchChange,
    handleLocationChange,
    handleDateChange,
    stockFilter,
    handleStockFilterChange,
    handleExportToExcel,
  };
};

export default useStockManagement;
