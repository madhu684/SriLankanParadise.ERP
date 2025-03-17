import { useQuery } from "@tanstack/react-query";
import {
  get_company_locations_api,
  get_item_locations_inventories_by_location_id_api,
} from "../../services/purchaseApi";
import { useCallback, useState } from "react";

const useStockManagement = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventories
    ? inventories.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { data: companyLocations, isLoading: companyLocationsLoading } =
    useQuery({
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

  return {
    companyLocations,
    companyLocationsLoading,
    selectedLocation,
    inventories,
    currentItems,
    itemsPerPage,
    currentPage,
    loading,
    paginate,
    handleSearch,
    handleSearchChange,
    handleLocationChange,
    handleDateChange,
  };
};

export default useStockManagement;
