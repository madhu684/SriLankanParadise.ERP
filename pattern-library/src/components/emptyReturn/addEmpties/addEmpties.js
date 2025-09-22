import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  get_company_locations_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  get_user_locations_by_user_id_api,
  get_batches_by_batchRef_api,
  post_batch_api,
  post_itemBatch_api,
} from "../../../services/purchaseApi";
import {
  get_item_masters_by_company_id_with_query_api,
  post_Empty_Return_api,
  get_added_empty_items_by_masterId_api,
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
  const [errors, setErrors] = useState({});

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
  const fetchItems = async (companyId, searchQuery) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        false
      );
      return response.data.result;
    } catch (error) {}
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchItem],
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchItem),
  });

  const batchId = async () => {
    try {
      const response = await get_batches_by_batchRef_api("E-20250728-0000");
      return response.data.result;
    } catch (error) {
      console.error("Error fetching Batch:", error);
    }
  };

  const {
    data: batch,
    isLoading: isBatchLoading,
    isError: isBatchError,
    error: batchError,
  } = useQuery({
    queryKey: ["batch"],
    queryFn: () => batchId(),
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
          quantity: 0,
        },
      ],
    }));
    setSearchItem("");
  };

  const handleSubmit = async (isSaveAsDraft) => {
    if (!validateWarehouseLocation()) {
      return;
    }
    if (validateForm(isSaveAsDraft)) {
      try {
        setLoading(true);
        setSubmissionStatus(null);

        const locationId = formData.warehouseLocation;

        const EmptyReturnData = {
          companyId: parseInt(sessionStorage.getItem("companyId")),
          fromLocationId: locationId,
          toLocationId: locationId,
          status: 0,
          createdBy: parseInt(sessionStorage.getItem("userId")),
          emptyReturnDetails: formData.itemDetails.map((item) => ({
            itemMasterId: item.id,
            batchId: batch?.batchId,
            addedQuantity: item.quantity,
          })),
        };

        try {
          const response = await post_Empty_Return_api(EmptyReturnData);

          if (
            response.data &&
            response.data.result &&
            response.data.result.emptyReturnMasterId
          ) {
            const emptyReturnMasterId =
              response.data.result.emptyReturnMasterId;

            // const EmptyReturnitemResponse =
            //   await get_added_empty_items_by_masterId_api(emptyReturnMasterId);

            for (const item of formData.itemDetails) {
              const itemBatchData = {
                batchId: batch?.batchId,
                itemMasterId: item.id,
                costPrice: 0,
                sellingPrice: 0,
                status: true,
                companyId: parseInt(sessionStorage.getItem("companyId")),
                createdBy: sessionStorage.getItem("username"),
                createdUserId: parseInt(sessionStorage.getItem("userId")),
                tempQuantity: 0,
                locationId: locationId,
                expiryDate: "2025-07-28T05:36:11.521Z",
                qty: item.quantity,
                permissionId: 188,
              };

              const locationInventoryData = {
                itemMasterId: item.id,
                batchId: batch?.batchId,
                locationId: locationId,
                stockInHand: item.quantity,
                permissionId: 1088,
                movementTypeId: 1,
                // remark: parseInt(emptyReturnMasterId),
              };

              const locationInventoryMovementData = {
                movementTypeId: 1,
                transactionTypeId: 11,
                itemMasterId: item.id,
                batchId: batch?.batchId,
                locationId: locationId,
                date: new Date().toISOString(),
                qty: item.quantity,
                permissionId: 1090,
              };

              await post_itemBatch_api(itemBatchData);

              const responseInventryAdded = await post_location_inventory_api(
                locationInventoryData
              );

              await post_location_inventory_movement_api(
                locationInventoryMovementData
              );

              console.log(
                "Location Inventory dinusha Response dinusha 207: ",
                responseInventryAdded
              );
            }
          } else {
            console.error("emptyReturnMasterId not found in response");
          }
        } catch (error) {
          console.error("Error calling the API: ", error);
        }

        queryClient.invalidateQueries("addedEmptyItems");
        setFormData({ warehouseLocation: null, itemDetails: [] });
        refetchWarehouses();
        setSubmissionStatus("success");
        setErrors({});
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (error) {
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

  const validateWarehouseLocation = () => {
    const newErrors = {};
    const warehouseLocation = formData.warehouseLocation;

    if (!warehouseLocation) {
      newErrors.warehouseLocation = "Please select a warehouse location.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setErrors({});
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

    errors,
  };
};
export default AddEmptiesManagement;
