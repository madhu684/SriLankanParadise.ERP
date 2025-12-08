import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  get_item_masters_by_company_id_api,
  get_item_masters_by_company_id_with_query_api,
  update_item_price_list_master_api,
  update_item_price_detail_list_master_api,
  delete_item_price_detail_list_master_api,
  item_price_list_detail_api,
} from "../../../services/inventoryApi";
import toast from "react-hot-toast";

const useItemPriceListUpdate = (itemPriceList, handleClose) => {
  // VAT Rate constant
  const VAT_RATE = 18;

  const [formData, setFormData] = useState({
    listName: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    status: 5,
    remark: "",
    itemDetails: [],
  });
  const [allItemsLoading, setAllItemsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedItemIds, setDeletedItemIds] = useState([]);

  // Use refs to cache session storage values
  const companyIdRef = useRef(sessionStorage.getItem("companyId"));
  const userIdRef = useRef(sessionStorage.getItem("userId"));
  const usernameRef = useRef(sessionStorage.getItem("username"));

  const companyId = companyIdRef.current;
  const userId = userIdRef.current;
  const username = usernameRef.current;

  const queryClient = useQueryClient();

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const calculateVATAddedPrice = useCallback(
    (costPrice) => {
      if (!costPrice || costPrice === "" || isNaN(costPrice)) {
        return "";
      }
      const price = parseFloat(costPrice);
      const vatAddedPrice = (price * (100 + VAT_RATE)) / 100;
      return vatAddedPrice.toFixed(2);
    },
    [VAT_RATE]
  );

  // ============================================================================
  // LOAD INITIAL DATA
  // ============================================================================

  useEffect(() => {
    if (itemPriceList) {
      setFormData({
        listName: itemPriceList.listName || "",
        effectiveDate: itemPriceList.effectiveDate
          ? new Date(itemPriceList.effectiveDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: itemPriceList.status?.toString() || 5,
        remark: itemPriceList.remark || "",
        itemDetails: Array.isArray(itemPriceList.itemDetails)
          ? itemPriceList.itemDetails.map((detail) => ({
              id: detail.id,
              itemMasterId: detail.itemMasterId,
              name: detail.itemName || "",
              costPrice: detail.price || "",
              vatAddedPrice: detail.vatAddedPrice || "",
              isExisting: true,
            }))
          : [],
      });
    }
  }, [itemPriceList]);

  // ============================================================================
  // DATA FETCHING - REACT QUERY
  // ============================================================================

  // Fetch items by name
  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", companyId, searchTerm],
    queryFn: async () => {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchTerm,
        false
      );
      return response.data.result;
    },
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateField = useCallback(
    (fieldName, fieldDisplayName, value, additionalRules = {}) => {
      let isFieldValid = true;
      let errorMessage = "";

      if (value === null || value === undefined || `${value}`.trim() === "") {
        isFieldValid = false;
        errorMessage = `${fieldDisplayName} is required`;
      }

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
    },
    []
  );

  const validateForm = useCallback(() => {
    const isListNameValid = validateField(
      "listName",
      "List Name",
      formData.listName
    );

    const isEffectiveDateValid = validateField(
      "effectiveDate",
      "Effective Date",
      formData.effectiveDate
    );

    let isItemValid = true;
    formData.itemDetails.forEach((item, index) => {
      // Validate costPrice
      const costPriceValid = validateField(
        `costPrice_${index}`,
        `Cost Price for ${item.name || `item ${index + 1}`}`,
        item.costPrice
      );

      // Validate vatAddedPrice
      const vatAddedPriceValid = validateField(
        `vatAddedPrice_${index}`,
        `VAT Added Price for ${item.name || `item ${index + 1}`}`,
        item.vatAddedPrice
      );

      // Both must be valid for this item
      isItemValid = isItemValid && costPriceValid && vatAddedPriceValid;
    });

    return isListNameValid && isEffectiveDateValid && isItemValid;
  }, [formData, validateField]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleLoadAllItems = useCallback(async () => {
    setAllItemsLoading(true);
    try {
      const response = await get_item_masters_by_company_id_api(companyId);
      if (response?.data?.result?.length > 0) {
        const existingItemIds = new Set(
          formData.itemDetails.map((item) => item.itemMasterId)
        );

        const newItems = response.data.result
          .filter((item) => !existingItemIds.has(item.itemMasterId))
          .map((item) => ({
            itemMasterId: item.itemMasterId,
            name: item.itemName || "",
            costPrice: "",
            vatAddedPrice: "",
            isExisting: false,
          }));

        setFormData((prev) => ({
          ...prev,
          itemDetails: [...prev.itemDetails, ...newItems],
        }));
      }
    } catch (error) {
      console.error("Error loading all items:", error);
      toast.error("Failed to load items. Please try again.");
    } finally {
      setAllItemsLoading(false);
    }
  }, [companyId, formData.itemDetails]);

  const handleSelectItem = useCallback((item) => {
    setFormData((prevData) => {
      const itemExists = prevData.itemDetails.some(
        (detail) => detail.itemMasterId === item.itemMasterId
      );

      if (itemExists) {
        return prevData;
      }

      return {
        ...prevData,
        itemDetails: [
          ...prevData.itemDetails,
          {
            itemMasterId: item.itemMasterId,
            name: item.itemName || "",
            costPrice: "",
            vatAddedPrice: "",
            isExisting: false,
          },
        ],
      };
    });

    setSearchTerm("");
  }, []);

  const handleItemDetailsChange = useCallback(
    (index, field, value) => {
      setFormData((prevData) => {
        const newItemDetails = [...prevData.itemDetails];

        // If changing cost price, calculate VAT added price automatically
        if (field === "costPrice") {
          const vatAddedPrice = calculateVATAddedPrice(value);
          newItemDetails[index] = {
            ...newItemDetails[index],
            costPrice: value,
            vatAddedPrice: vatAddedPrice,
          };
        } else {
          // For other fields, just update the field
          newItemDetails[index] = { ...newItemDetails[index], [field]: value };
        }

        return {
          ...prevData,
          itemDetails: newItemDetails,
        };
      });
    },
    [calculateVATAddedPrice]
  );

  const handleInputChange = useCallback((field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => {
      const itemToRemove = prev.itemDetails[index];

      // If it's an existing item, add its ID to deletedItemIds
      if (itemToRemove.isExisting && itemToRemove.id) {
        setDeletedItemIds((prevIds) => [...prevIds, itemToRemove.id]);
      }

      return {
        ...prev,
        itemDetails: prev.itemDetails.filter((_, idx) => idx !== index),
      };
    });

    // Clear validation for removed item
    setValidFields((prev) => {
      const newValidFields = { ...prev };
      delete newValidFields[`costPrice_${index}`];
      delete newValidFields[`vatAddedPrice_${index}`];
      return newValidFields;
    });

    setValidationErrors((prev) => {
      const newValidationErrors = { ...prev };
      delete newValidationErrors[`costPrice_${index}`];
      delete newValidationErrors[`vatAddedPrice_${index}`];
      return newValidationErrors;
    });
  }, []);

  const resetFormData = useCallback(() => {
    setFormData({
      listName: "",
      effectiveDate: new Date().toISOString().split("T")[0],
      status: 5,
      remark: "",
      itemDetails: [],
    });
    setValidFields({});
    setValidationErrors({});
    setDeletedItemIds([]);
  }, []);

  // ============================================================================
  // Submission
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    try {
      const isFormValid = validateForm();
      if (!isFormValid) {
        toast.error("Please fill in all required fields correctly");
        return;
      }

      if (formData.itemDetails.length === 0) {
        toast.error("Please add at least one item to the price list");
        return;
      }

      setIsSubmitting(true);

      // Update master data
      const itemPriceMasterData = {
        listName: formData.listName,
        status: 5,
        effectiveDate: formData.effectiveDate,
        companyId: itemPriceList.companyId,
        createdBy: itemPriceList.createdBy,
        createdUserId: itemPriceList.createdUserId,
        createdDate: itemPriceList.createdDate,
        remark: formData.remark,
      };

      const masterResponse = await update_item_price_list_master_api(
        itemPriceList.id,
        itemPriceMasterData
      );

      if (masterResponse.status !== 200) {
        throw new Error("Failed to update price list master");
      }

      // Delete removed items
      const deletePromises = deletedItemIds.map((id) =>
        delete_item_price_detail_list_master_api(id)
      );

      if (deletePromises.length > 0) {
        const deleteResponses = await Promise.all(deletePromises);
        const allDeleted = deleteResponses.every(
          (res) => res?.status === 200 || res?.status === 204
        );

        if (!allDeleted) {
          console.warn("Some items failed to delete");
        }
      }

      // Separate existing items (to update) and new items (to create)
      const existingItems = formData.itemDetails.filter(
        (item) => item.isExisting && item.id
      );
      const newItems = formData.itemDetails.filter(
        (item) => !item.isExisting || !item.id
      );

      // Update existing items
      const updatePromises = existingItems.map((item) =>
        update_item_price_detail_list_master_api(item.id, {
          itemPriceMasterId: itemPriceList.id,
          itemMasterId: item.itemMasterId,
          price: item.costPrice,
          vatAddedPrice: item.vatAddedPrice,
        })
      );

      // Create new items
      const createPromises = newItems.map((item) =>
        item_price_list_detail_api({
          itemPriceMasterId: itemPriceList.id,
          itemMasterId: item.itemMasterId,
          price: item.costPrice,
          vatAddedPrice: item.vatAddedPrice,
        })
      );

      // Execute all updates and creates
      const allPromises = [...updatePromises, ...createPromises];

      if (allPromises.length > 0) {
        const detailResponses = await Promise.all(allPromises);
        const allSuccessful = detailResponses.every(
          (res) => res?.status === 200 || res?.status === 201
        );

        if (!allSuccessful) {
          throw new Error("Some item details failed to save");
        }
      }

      // Success
      await queryClient.invalidateQueries(["itemPriceList", companyId]);
      toast.success(
        "Item price list updated successfully. Approve before it can be used."
      );

      setTimeout(() => {
        setIsSubmitting(false);
        resetFormData();
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating form:", error);
      setIsSubmitting(false);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while updating the price list"
      );
    }
  }, [
    formData,
    itemPriceList,
    deletedItemIds,
    username,
    userId,
    companyId,
    handleClose,
    validateForm,
    resetFormData,
    queryClient,
  ]);

  // Memoize filtered available items to prevent recalculation
  const filteredAvailableItems = useMemo(() => {
    if (!availableItems) return [];

    return availableItems.filter((item) => {
      return !formData.itemDetails.some(
        (detail) => detail.itemMasterId === item.itemMasterId
      );
    });
  }, [availableItems, formData.itemDetails]);

  console.log("Form data: ", formData);
  console.log("itemPriceList: ", itemPriceList);

  return {
    formData,
    availableItems: filteredAvailableItems,
    isItemsLoading,
    allItemsLoading,
    isItemsError,
    itemsError,
    searchTerm,
    isSubmitting,
    validFields,
    validationErrors,

    // EVENT HANDLERS
    setSearchTerm,
    handleSelectItem,
    handleItemDetailsChange,
    handleInputChange,
    handleLoadAllItems,
    handleRemoveItem,
    handleSubmit,
  };
};

export default useItemPriceListUpdate;
