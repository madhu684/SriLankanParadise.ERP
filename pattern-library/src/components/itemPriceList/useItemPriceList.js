import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  get_item_masters_by_company_id_api,
  get_item_masters_by_company_id_with_query_api,
  item_price_list_detail_api,
  post_item_price_list_api,
} from "../../services/inventoryApi";
import toast from "react-hot-toast";

const useItemPriceList = (handleClose) => {
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

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);
  const username = useMemo(() => sessionStorage.getItem("username"), []);

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
        // Map items outside setState to avoid unnecessary recalculations
        const mappedItems = response.data.result.map((item) => ({
          itemMasterId: item.itemMasterId,
          name: item.itemName || "",
          costPrice: "",
          vatAddedPrice: "",
        }));

        // Use functional update to avoid stale closure
        setFormData((prev) => ({
          ...prev,
          itemDetails: mappedItems,
        }));
      }
    } catch (error) {
      console.error("Error loading all items:", error);
      toast.error("Failed to load items. Please try again.");
    } finally {
      setAllItemsLoading(false);
    }
  }, [companyId]);

  const handleSelectItem = useCallback((item) => {
    setFormData((prevData) => {
      // Check if item already exists before adding
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
    setFormData((prev) => ({
      ...prev,
      itemDetails: prev.itemDetails.filter((_, idx) => idx !== index),
    }));

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

      const itemPriceMasterData = {
        listName: formData.listName,
        status: 5,
        effectiveDate: formData.effectiveDate,
        companyId: companyId,
        createdBy: username,
        createdUserId: userId,
        createdDate: new Date().toISOString(),
        remark: formData.remark,
      };

      const response = await post_item_price_list_api(itemPriceMasterData);

      if (response.status === 201) {
        const itemPriceListId = response.data.result.id;

        // Process all item details
        const itemPriceDetailPromises = formData.itemDetails.map((item) =>
          item_price_list_detail_api({
            itemPriceMasterId: itemPriceListId,
            itemMasterId: item.itemMasterId,
            price: item.costPrice,
            vatAddedPrice: item.vatAddedPrice,
          })
        );

        const itemPriceDetailResponse = await Promise.all(
          itemPriceDetailPromises
        );

        const allSuccessful = itemPriceDetailResponse.every(
          (res) => res?.status === 201
        );

        if (allSuccessful) {
          await queryClient.invalidateQueries(["itemPriceList", companyId]);
          toast.success(
            "Item price list created successfully. Approve before it can be used."
          );

          setTimeout(() => {
            setIsSubmitting(false);
            resetFormData();
            handleClose();
          }, 1500);
        } else {
          setIsSubmitting(false);
          toast.error("Some item details failed to save. Please try again.");
        }
      } else {
        setIsSubmitting(false);
        toast.error("Error creating item price list. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while creating the price list"
      );
    }
  }, [
    formData,
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

  console.log(formData);

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

export default useItemPriceList;
