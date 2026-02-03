import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  get_added_empty_items_api,
  get_Empty_Return_Item_locations_inventories_by_location_id_api,
  update_empty_return_api,
  get_added_empty_items_by_masterId_api,
} from "../../../services/inventoryApi";

import {
  get_company_locations_api,
  post_location_inventory_movement_api,
  post_location_inventory_api,
  get_user_locations_by_user_id_api,
  patch_Empty_location_inventory_api,
  patch_location_inventory_api,
  get_batches_by_batchRef_api,
} from "../../../services/purchaseApi";

const useEmptyReturnsLogic = () => {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    itemDetails: [],
  });

  const [showAddEmptiesForm, setShowAddEmptiesForm] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);
  const [showReduceEmptyModal, setShowReduceEmptyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [transferDetails, setTransferDetails] = useState({
    transferQty: null,
    location: null,
  });
  const [modalErrors, setModalErrors] = useState("");

  const itemsPerPage = 10;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const filteredInventories = useMemo(() => {
    return inventories.filter((item) =>
      item.itemMaster.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          console.log("Company locations fetched 71:", response.data.result);
          return response.data.result;
        } catch (error) {
          console.error("Error fetching company locations:", error);
          return [];
        }
      },
    });

  const { data: userLocations, isLoading: userLocationsLoading } = useQuery({
    queryKey: ["userLocations"],
    queryFn: async () => {
      try {
        const response = await get_user_locations_by_user_id_api(
          sessionStorage.getItem("userId")
        );
        console.log("User locations fetched 88:", response.data.result);
        return response.data.result;
      } catch (error) {
        console.error("Error fetching company locations:", error);
        return [];
      }
    },
  });

  const handleLocationChange = (e) => {
    setSelectedLocation(parseInt(e.target.value));
    setFormData((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleToLocationChange = (e) => {
    setTransferDetails((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleSearch = useCallback(
    async (locationId = null) => {
      // Use provided locationId if available, otherwise fall back to selectedLocation
      const targetLocationId = locationId ?? selectedLocation;

      if (!targetLocationId) return;

      // Update state if a specific locationId is provided and it's different
      if (locationId && locationId !== selectedLocation) {
        console.log(`Switching selected location to: ${locationId}`);
        setSelectedLocation(parseInt(locationId));
        setFormData((prev) => ({ ...prev, location: locationId }));
      }

      setLoading(true);
      try {
        const inventory =
          await get_Empty_Return_Item_locations_inventories_by_location_id_api(
            sessionStorage.getItem("companyId"),
            targetLocationId
          );
        if (inventory.data && inventory.data.result) {
          const filteredStock = inventory.data?.result?.filter(
            (item) => item.stockInHand > 0
          );
          setInventories(filteredStock);
        } else {
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
    },
    [selectedLocation, inventories]
  );

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleTransfer = (item) => {
    setSelectedItem(item);
    setTransferDetails({
      transferQty: item.transferQty,
    });
    setModalErrors("");
    setShowEditModal(true);
  };

  // reduse empty
  const handleReduceEmpty = (item) => {
    setSelectedItem(item);
    setTransferDetails({
      transferQty: item.transferQty,
    });
    setModalErrors("");
    setShowReduceEmptyModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    setTransferDetails({
      transferQty: null,
    });
    setModalErrors("");
    setErrors({});
  };

  // reduse empty
  const handleCloseReduceModal = () => {
    setShowReduceEmptyModal(false);
    setSelectedItem(null);
    setTransferDetails({
      transferQty: null,
    });
    setModalErrors("");
    setErrors({});
  };

  const handleModalInputChange = (field, value) => {
    console.log(`Modal input change: ${field} = ${value}`);
    setTransferDetails((prev) => ({
      ...prev,
      [field]: value !== "" ? parseFloat(value) : null,
    }));
    setModalErrors("");
  };

  const validateModalForm = () => {
    const newErrors = {};
    const transferQty = transferDetails.transferQty;
    const stockInHand = selectedItem.stockInHand;
    const selectedLocation = transferDetails.location;

    if (!selectedLocation) {
      newErrors.selectedLocation = "Please select a location warehouse.";
    }

    if (transferQty <= 0 || isNaN(transferQty)) {
      newErrors.transferQty = "Transfer quantity must be greater than 0.";
    }

    if (transferQty > stockInHand) {
      newErrors.transferQty = `Transfer quantity cannot exceed the stock in hand (${stockInHand}).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // reduse empty
  const validateEmptyReduceModalForm = () => {
    const newErrors = {};
    const transferQty = transferDetails.transferQty;
    const stockInHand = selectedItem.stockInHand;

    if (transferQty <= 0 || isNaN(transferQty)) {
      newErrors.transferQty = "Reduce quantity must be greater than 0.";
    }

    if (transferQty > stockInHand) {
      newErrors.transferQty = `Reduce quantity cannot exceed the stock in hand (${stockInHand}).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateSingleLocationInventoryLevel = async () => {
    try {
      if (
        transferDetails.transferQty === null ||
        transferDetails.location === null
      ) {
        return false;
      }

      // existing inventory Down
      const response1 = await patch_location_inventory_api(
        selectedItem.locationId,
        selectedItem.itemMasterId,
        selectedItem.batchId,
        "subtract",
        {
          stockInHand: transferDetails.transferQty,
          permissionId: 1089,
        }
      );

      if (response1.status !== 200 && response1.status !== 201) {
        return false;
      }

      // existing movement inventory Down
      const response2 = await post_location_inventory_movement_api({
        movementTypeId: 2,
        transactionTypeId: 12,
        itemMasterId: selectedItem.itemMasterId,
        batchId: selectedItem.batchId,
        locationId: selectedItem.locationId,
        date: new Date().toISOString(),
        qty: transferDetails.transferQty,
        permissionId: 1090,
      });

      if (response2.status !== 200 && response2.status !== 201) {
        return false;
      }

      // existing inventory up
      const response3 = await post_location_inventory_api({
        itemMasterId: selectedItem.itemMasterId,
        batchId: selectedItem.batchId,
        locationId: transferDetails.location,
        stockInHand: transferDetails.transferQty,
        permissionId: 1088,
        movementTypeId: 1,
      });

      if (response3.status !== 200 && response3.status !== 201) {
        return false;
      }

      // existing movement inventory up
      const response4 = await post_location_inventory_movement_api({
        movementTypeId: 1,
        transactionTypeId: 11,
        itemMasterId: selectedItem.itemMasterId,
        batchId: selectedItem.batchId,
        locationId: parseInt(transferDetails.location), // Convert to integer selectedItem.locationId,
        date: new Date().toISOString(),
        qty: transferDetails.transferQty,
        permissionId: 1090,
      });

      if (response4.status !== 200 && response4.status !== 201) {
        return false;
      }

      return true; // Success if all responses are 200/201
    } catch (error) {
      console.error("Error in API calls:", error);
      return false;
    }
  };

  const updateEmptyReduceInventoryLevel = async () => {
    try {
      if (transferDetails.transferQty === null) {
        return false;
      }

      // existing inventory Down API 1
      const response1 = await patch_location_inventory_api(
        selectedItem.locationId,
        selectedItem.itemMasterId,
        selectedItem.batchId,

        "subtract",
        {
          stockInHand: transferDetails.transferQty,
          permissionId: 1089,
        }
      );

      if (response1.status !== 200 && response1.status !== 201) {
        return false;
      }

      // existing movement inventory Down API 2
      const response2 = await post_location_inventory_movement_api({
        movementTypeId: 2,
        transactionTypeId: 13,
        itemMasterId: selectedItem.itemMasterId,
        batchId: selectedItem.batchId,
        locationId: selectedItem.locationId,
        date: new Date().toISOString(),
        qty: transferDetails.transferQty,
        permissionId: 1090,
      });

      if (response2.status !== 200 && response2.status !== 201) {
        return false;
      }

      // if (
      //   response1.data &&
      //   response1.data.result &&
      //   response1.data.result.remark
      // ) {
      //   const emptyReturnMasterId = parseInt(response1.data.result.remark);
      //   console.log("emptyReturnMasterId dinusha 357: ", emptyReturnMasterId);

      //   // get existing empty item details API 3
      //   const emptyReturnitemResponse =
      //     await get_added_empty_items_by_masterId_api(emptyReturnMasterId);

      //   console.log(
      //     "emptyReturnDetails dinusha 384: ",
      //     emptyReturnitemResponse.data.result.emptyReturnDetails
      //   );

      //   const emptyReturnData = {
      //     toLocationId: selectedItem.locationId,
      //     status: 0,
      //     modifyedBy: parseInt(sessionStorage.getItem("userId")),
      //     ModifyDate: new Date().toISOString(),
      //     emptyReturnDetails:
      //       emptyReturnitemResponse.data.result.emptyReturnDetails.map(
      //         (item) => ({
      //           emptyReturnDetailId: item.emptyReturnDetailId,
      //           itemMasterId: selectedItem.itemMasterId,
      //           addedQuantity: item.addedQuantity - transferDetails.transferQty,
      //         })
      //       ),
      //   };

      //   // patch existing empty item details API 4
      //   const response3 = await update_empty_return_api(
      //     emptyReturnMasterId,
      //     emptyReturnData
      //   );

      //   if (response3.status !== 200 && response2.status !== 201) {
      //     return false;
      //   }
      // }

      return true;
    } catch (error) {
      console.error("Error in API calls:", error);
      return false;
    }
  };

  const handleModalSubmit = async () => {
    if (!validateModalForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updateSingleLocationInventoryLevel();

      if (success) {
        setSubmissionStatus("successSubmitted");
        showSuccessAlert("Empty Return Transfer successfully!");
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
      showErrorAlert("Error Empty Return Transfer. Please try again.");
      setModalErrors("Error Empty Return Transfer. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmissionStatus(null), 3000);
    }
  };

  // reduse empty
  const handleEmptyReduceModalSubmit = async () => {
    if (!validateEmptyReduceModalForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updateEmptyReduceInventoryLevel();

      if (success) {
        // setSubmissionStatus("successSubmitted");
        showSuccessAlert("Empty Reduce successfully!");
        handleCloseReduceModal();
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
      // setSubmissionStatus("error");
      showErrorAlert("Error Empty Reduce. Please try again.");
      setModalErrors("Error Empty Reduce Transfer. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmissionStatus(null), 3000);
    }
  };

  const showSuccessAlert = (message) => {
    setToastMessage(message);
    setToastType("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showErrorAlert = (message) => {
    setToastMessage(message);
    setToastType("danger");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  console.log("selectedItem 379:", selectedItem);

  console.log("Selected to location new: ", transferDetails);

  return {
    showAddEmptiesForm,
    setShowAddEmptiesForm,

    companyLocations,
    companyLocationsLoading,
    userLocations,
    userLocationsLoading,
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
    handleToLocationChange,
    isSubmitting,
    submissionStatus,
    filteredInventories,
    searchTerm,

    showEditModal,
    showReduceEmptyModal,
    selectedItem,
    transferDetails,
    modalErrors,
    handleTransfer,
    handleReduceEmpty,
    handleCloseModal,
    handleCloseReduceModal,
    handleModalInputChange,
    handleModalSubmit,
    handleEmptyReduceModalSubmit,

    showToast,
    toastMessage,
    toastType,
    setShowToast,

    errors,
  };
};

export default useEmptyReturnsLogic;
