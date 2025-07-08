import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  get_company_locations_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  get_user_locations_by_user_id_api,
} from "../../../services/purchaseApi";
import {
  get_item_masters_by_company_id_with_query_api,
  post_Empty_Return_api,
} from "../../../services/inventoryApi";

export const AddEmptiesManagement = (handleClose) => {
  const [formData, setFormData] = useState({
    warehouseLocation: null,
    itemDetails: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // fetch Warehouses
  // const fetchWarehouses = async () => {
  //   try {
  //     const response = await get_company_locations_api(
  //       sessionStorage.getItem("companyId")
  //     );
  //     return response.data.result;
  //   } catch (error) {
  //     console.error("Error fetching locations:", error);
  //   }
  // };

  const fetchWarehouses = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const {
    data: warehouses,
    isLoading: warehousesLoading,
    refetch: refetchWarehouses,
    isError,
    error,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
  });

  // fetch items
  const fetchItems = async (companyId, searchQuery, itemType) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        itemType
      );
      console.log("Fetched itemsssssssssssssss:", response.data.result);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchItem],
    queryFn: () =>
      fetchItems(
        sessionStorage.getItem("companyId"),
        searchItem,
        "Consumable,Raw Material,Sellable"
      ),
  });

  // Handler to add the selected item to itemDetails
  const handleSelectItem = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          quantity: 0, // You can set a default quantity here
        },
      ],
    }));
    setSearchItem(""); // Clear the search Item
  };

  const handleSubmit = async (isSaveAsDraft) => {
    if (validateForm(isSaveAsDraft)) {
      try {
        setLoading(true);
        setSubmissionStatus(null); // Reset submission status

        console.log("📝 Submitting Form Data:", formData);

        const locationId = formData.warehouseLocation;

        for (const item of formData.itemDetails) {
          const locationInventoryData = {
            itemMasterId: item.id,
            batchId: 21,
            locationId: locationId,
            stockInHand: item.quantity,
            permissionId: 1088,
            movementTypeId: 1,
          };

          const locationInventoryMovementData = {
            movementTypeId: 1,
            transactionTypeId: 4,
            itemMasterId: item.id,
            batchId: 21,
            locationId: locationId,
            date: new Date().toISOString(),
            qty: item.quantity,
            permissionId: 1090,
          };

          // ✅ Log the payloads before sending
          console.log(
            "📦 Posting to Location Inventory API:",
            locationInventoryData
          );
          await post_location_inventory_api(locationInventoryData);

          console.log(
            "🔁 Posting to Inventory Movement API:",
            locationInventoryMovementData
          );
          await post_location_inventory_movement_api(
            locationInventoryMovementData
          );
        }

        const EmptyReturnData = {
          companyId: parseInt(sessionStorage.getItem("companyId")),
          fromLocationId: locationId,
          toLocationId: locationId,
          status: 0,
          createdBy: parseInt(sessionStorage.getItem("userId")),
          emptyReturnDetails: formData.itemDetails.map((item) => ({
            itemMasterId: item.id,
            addedQuantity: item.quantity,
          })),
        };

        console.log("📦 Posting to Empty Return API:", EmptyReturnData);
        await post_Empty_Return_api(EmptyReturnData);
        queryClient.invalidateQueries("addedEmptyItems");
        // ✅ Reset form
        setFormData({ warehouseLocation: null, itemDetails: [] });
        // ✅ Refetch dropdown options
        refetchWarehouses();
        setSubmissionStatus("success");
        // handleClose();
      } catch (error) {
        console.error("❌ Error submitting items:", error);
        setSubmissionStatus("error");
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = (isSaveAsDraft) => {
    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `${fieldDisplayName} must be greater than 0`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return isItemQuantityValid;
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      // Ensure positive values for Quantities and Unit Prices
      updatedItemDetails[index].quantity = Math.max(
        0,
        updatedItemDetails[index].quantity
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  };

  const handleWarehouseLocationChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      warehouseLocation: value,
    }));
  };

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {}
  ) => {
    let isFieldValid = true;
    let errorMessage = "";

    // Required validation
    if (value === null || value === undefined || `${value}`.trim() === "") {
      isFieldValid = false;
      errorMessage = `${fieldDisplayName} is required`;
    }

    // Additional validation
    if (
      isFieldValid &&
      additionalRules.validationFunction &&
      !additionalRules.validationFunction(value)
    ) {
      isFieldValid = false;
      errorMessage = additionalRules.errorMessage;
    }

    setValidFields((prev) => ({ ...prev, [fieldName]: isFieldValid }));
    setValidationErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));

    return isFieldValid;
  };

  const handleRemoveItem = (index) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
    setValidFields({});
    setValidationErrors({});
  };

  const handleCancel = () => {
    setFormData({ warehouseLocation: null, itemDetails: [] });
    handleClose();
  };

  return {
    formData,
    warehouses,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    searchItem,
    validFields,
    validationErrors,
    loading,
    submissionStatus,
    alertRef,
    setSubmissionStatus,
    handleSubmit,
    setFormData,
    setSearchItem,
    handleSelectItem,
    handleItemDetailsChange,
    handleRemoveItem,
    handleCancel,
    handleWarehouseLocationChange,
  };
};
export default AddEmptiesManagement;
