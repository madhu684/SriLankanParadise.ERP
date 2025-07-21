import { useQuery } from "@tanstack/react-query";
import {
  get_company_locations_api,
  get_item_locations_inventories_by_location_id_api,
  put_location_inventory_by_id_api,
} from "../../services/purchaseApi";
import { useCallback, useState, useMemo } from "react";

const useStockLevel = () => {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    itemDetails: [],
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalAdjustedVolumes, setModalAdjustedVolumes] = useState({
    reOrderLevel: null,
    maxStockLevel: null,
  });
  const [modalErrors, setModalErrors] = useState("");

  const itemsPerPage = 10;

  const filteredInventories = useMemo(() => {
    console.log("Filtering inventories with searchTerm:", searchTerm);
    return inventories.filter((item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventories, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { data: companyLocations, isLoading: companyLocationsLoading } =
    useQuery({
      queryKey: ["companyLocations"],
      queryFn: async () => {
        try {
          const response = await get_company_locations_api(
            sessionStorage.getItem("companyId")
          );
          console.log("Company locations fetched:", response.data.result);
          return response.data.result;
        } catch (error) {
          console.error("Error fetching company locations:", error);
          return [];
        }
      },
    });

  const handleLocationChange = (e) => {
    console.log("Selected location: ", e.target.value);
    setSelectedLocation(parseInt(e.target.value));
    setFormData((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleDateChange = (e) => {
    console.log("Selected date: ", e.target.value);
    setSelectedDate(e.target.value);
    setFormData((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleSearch = useCallback(async () => {
    console.log("handleSearch triggered, selectedLocation:", selectedLocation);
    if (!selectedLocation) return;

    setLoading(true);
    try {
      console.log("Fetching inventory for location:", selectedLocation);
      const inventory = await get_item_locations_inventories_by_location_id_api(
        selectedLocation
      );
      console.log("Raw API response:", inventory);
      if (inventory.data && inventory.data.result) {
        console.log("Inventory fetched:", inventory.data.result);
        const fetchedIds = inventory.data.result.map(
          (item) => item.locationInventoryId
        );
        console.warn(
          "Fetched locationInventoryIds:",
          fetchedIds,
          "Expected: 1041, 1042, 1043, 1044, 1046"
        );
        setInventories(inventory.data.result);
      } else {
        console.warn("No result in inventory data, setting empty array");
        setInventories([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventories([]);
    } finally {
      setLoading(false);
      console.log(
        "Loading set to false, updated inventories length:",
        inventories.length
      );
    }
  }, [selectedLocation]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    console.log("Search term changed to:", newSearchTerm);
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleEdit = (item) => {
    console.log("Edit clicked for item:", item);
    setSelectedItem(item);
    setModalAdjustedVolumes({
      reOrderLevel: item.reOrderLevel,
      maxStockLevel: item.maxStockLevel,
    });
    setModalErrors("");
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    setModalAdjustedVolumes({
      reOrderLevel: null,
      maxStockLevel: null,
    });
    setModalErrors("");
  };

  const handleModalInputChange = (field, value) => {
    console.log(`Modal input change: ${field} = ${value}`);
    setModalAdjustedVolumes((prev) => ({
      ...prev,
      [field]: value !== "" ? parseFloat(value) : null,
    }));
    setModalErrors("");
  };

  const validateModalForm = () => {
    const reOrderLevel = modalAdjustedVolumes.reOrderLevel;
    const maxStockLevel = modalAdjustedVolumes.maxStockLevel;

    console.log(
      `Validating modal: reOrderLevel=${reOrderLevel}, maxStockLevel=${maxStockLevel}`
    );

    if (reOrderLevel !== null && reOrderLevel < 0) {
      return "ReOrder Level cannot be negative.";
    }
    if (maxStockLevel !== null && maxStockLevel < 0) {
      return "Max Stock Level cannot be negative.";
    }
    if (
      reOrderLevel !== null &&
      maxStockLevel !== null &&
      reOrderLevel > maxStockLevel
    ) {
      return "ReOrder Level cannot exceed Max Stock Level.";
    }
    return "";
  };

  const updateSingleLocationInventoryLevel = async () => {
    console.log(
      "updateSingleLocationInventoryLevel triggered for:",
      selectedItem
    );

    if (!selectedItem) return false;

    const existingItem = inventories.find(
      (i) => i.locationInventoryId === selectedItem.locationInventoryId
    );

    if (!existingItem) {
      console.error("Existing item not found");
      return false;
    }

    const payload = {
      locationInventoryId: selectedItem.locationInventoryId,
      itemMasterId: existingItem.itemMasterId,
      batchId: existingItem.batchId,
      locationId: existingItem.locationId,
      stockInHand: existingItem.stockInHand,
      reOrderLevel: modalAdjustedVolumes.reOrderLevel,
      maxStockLevel: modalAdjustedVolumes.maxStockLevel,
    };

    console.log(
      `Sending update payload for ${selectedItem.locationInventoryId}:`,
      payload
    );

    try {
      const response = await put_location_inventory_by_id_api(
        selectedItem.locationInventoryId,
        payload
      );
      console.log(
        `API response for ${selectedItem.locationInventoryId}:`,
        response
      );

      if (response.status !== 200 || !response.data.handShake) {
        throw new Error(
          `Update failed for ${selectedItem.locationInventoryId}: ${
            response.message || "Unknown error"
          }`
        );
      }

      console.log(
        `Updated LocationInventory ${
          selectedItem.locationInventoryId
        } at ${new Date().toISOString()}`
      );
      return true;
    } catch (error) {
      console.error(
        `Error updating LocationInventory ${selectedItem.locationInventoryId}:`,
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const handleModalSubmit = async () => {
    console.log("Modal submit triggered");

    const validationError = validateModalForm();
    if (validationError) {
      setModalErrors(validationError);
      return;
    }

    setIsSubmitting(true);
    console.log("IsSubmitting set to true");

    try {
      const success = await updateSingleLocationInventoryLevel();
      console.log("Update result:", success);

      if (success) {
        setSubmissionStatus("successSubmitted");
        handleCloseModal();
        handleSearch();
        console.log("Success message set, refreshing data");
      } else {
        throw new Error("Update failed due to server error");
      }
    } catch (error) {
      console.log(
        "Error in modal submission process:",
        error.response ? error.response.data : error.message
      );
      setSubmissionStatus("error");
      setModalErrors("Error updating stock levels. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmissionStatus(null), 3000);
      console.log("IsSubmitting set to false");
    }
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
    isSubmitting,
    submissionStatus,
    filteredInventories,
    searchTerm,

    showEditModal,
    selectedItem,
    modalAdjustedVolumes,
    modalErrors,
    handleEdit,
    handleCloseModal,
    handleModalInputChange,
    handleModalSubmit,
  };
};

export default useStockLevel;
