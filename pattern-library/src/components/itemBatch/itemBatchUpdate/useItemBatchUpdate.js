import { useState, useEffect, useRef } from "react";
import {
  get_item_batches_by_item_master_id_api,
  put_item_batch_api,
} from "../../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useItemBatchUpdate = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    unit: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConfirmationModalInParent, setshowConfirmationModalInParent] =
    useState(false);

  const fetchItemBatches = async (itemMasterId) => {
    try {
      const response = await get_item_batches_by_item_master_id_api(
        itemMasterId,
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching item batches:", error);
    }
  };

  const {
    data: itemBatches,
    isLoading,
    isError,
    error,
    refetch: refetchItemBatches,
  } = useQuery({
    queryKey: ["itemBatches", formData.id],
    queryFn: () => fetchItemBatches(formData.id),
  });

  const fetchItems = async (companyId, searchQuery, itemType) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        itemType
      );
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
    queryKey: ["items", searchTerm],
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "All"),
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

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

  const validateForm = (isSaveAsDraft) => {
    setValidFields({});
    setValidationErrors({});

    const isSellingPriceValid = validateField(
      "sellingPrice",
      "Selling price",
      formData.sellingPrice,
      {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: "Selling price must be greater than 0",
      }
    );

    const isExpiryDateValid = validateField(
      "expiryDate",
      "Expiry Date",
      formData.expiryDate
    );

    return isSellingPriceValid && isExpiryDateValid;
  };

  const handleSubmit = async (isSaveAsDraft, isUpdateAllBatches) => {
    try {
      const status = isSaveAsDraft ? false : true;

      const isFormValid = validateForm(isSaveAsDraft);

      if (isFormValid && !isUpdateAllBatches) {
        setLoading(true);

        const itemBatchUpdateData = {
          batchId: selectedBatch.batchId,
          itemMasterId: selectedBatch.itemMasterId,
          costPrice: selectedBatch.costPrice,
          sellingPrice: formData.sellingPrice,
          status: status,
          companyId: sessionStorage.getItem("companyId"),
          createdBy: sessionStorage.getItem("username"),
          createdUserId: sessionStorage.getItem("userId"),
          tempQuantity: selectedBatch.tempQuantity,
          locationId: selectedBatch.locationId,
          expiryDate: formData.expiryDate,
          permissionId: 1065,
        };

        const response = await put_item_batch_api(
          selectedBatch.batchId,
          selectedBatch.itemMasterId,
          itemBatchUpdateData
        );

        if (response.status === 200) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Item batch saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Item batch updated successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            onFormSubmit();
            handleReset();
          }, 3000);
        } else {
          setSubmissionStatus("error");
        }
      } else if (isFormValid && isUpdateAllBatches) {
        setLoading(true);

        // Update all batches
        const updatedBatches = itemBatches.map((batch) => {
          return {
            batchId: batch.batchId,
            itemMasterId: batch.itemMasterId,
            costPrice: batch.costPrice,
            sellingPrice: formData.sellingPrice, // Update selling price for all batches
            status: status,
            companyId: sessionStorage.getItem("companyId"),
            createdBy: sessionStorage.getItem("username"),
            createdUserId: sessionStorage.getItem("userId"),
            tempQuantity: batch.tempQuantity,
            locationId: batch.locationId,
            expiryDate: batch.expiryDate,
            permissionId: 1065,
          };
        });

        // Submit updates for all batches
        const batchUpdatePromises = updatedBatches.map((batch) => {
          return put_item_batch_api(batch.batchId, batch.itemMasterId, batch);
        });

        // Wait for all batch updates to complete
        const batchUpdateResponses = await Promise.all(batchUpdatePromises);

        // Check if all batch updates were successful
        const allBatchUpdatesSuccessful = batchUpdateResponses.every(
          (response) => response.status === 200
        );

        if (allBatchUpdatesSuccessful) {
          setSubmissionStatus("successSubmittedAll");
          console.log("All item batches updated successfully!");

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            onFormSubmit();
            handleReset();
          }, 3000);
        } else {
          setSubmissionStatus("error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      id: 0,
      name: "",
      unit: "",
      sellingPrice: "",
      expiryDate: "",
    });
    setValidFields({});
    setValidationErrors({});
    setSelectedBatch(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = (item) => {
    setFormData({
      id: item.itemMasterId,
      name: item.itemName,
      unit: item.unit.unitName,
    });
    setSearchTerm(""); // Clear the search term

    setSelectedBatch(null);
    refetchItemBatches();
    setValidFields({});
    setValidationErrors({});
  };

  const handleBatchSelection = (e) => {
    const selectedBatchId = e.target.value;
    console.log(selectedBatchId);
    const batch = itemBatches.find(
      (batch) => batch.batchId === parseInt(selectedBatchId, 10)
    );

    // Ensure batch exists
    if (batch) {
      setSelectedBatch(batch);

      // Add selling price and expiry date to formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        sellingPrice: batch.sellingPrice,
        expiryDate: batch.expiryDate?.split("T")[0],
      }));
    } else {
      setSelectedBatch(null);
    }
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
    setshowConfirmationModalInParent(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    handleCloseConfirmationModalInParent();
  };

  const handleCloseConfirmationModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setshowConfirmationModalInParent(false);
    }, delay);
  };

  return {
    formData,
    itemBatches,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    isError,
    isLoading,
    error,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    loading,
    selectedBatch,
    showConfirmationModalInParent,
    showConfirmationModal,
    handleInputChange,
    handleReset,
    handlePrint,
    setFormData,
    setSearchTerm,
    handleSelectItem,
    handleBatchSelection,
    handleSubmit,
    handleShowConfirmationModal,
    handleCloseConfirmationModal,
  };
};

export default useItemBatchUpdate;
