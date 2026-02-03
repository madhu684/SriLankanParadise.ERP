import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  create_supply_return_detail_api,
  create_supply_return_master_api,
  get_batches_by_companyId_api,
  get_company_suppliers_api,
  get_location_inventory_by_batch_id_api,
} from "common/services/purchaseApi";

const useSupplierReturn = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    supplierId: "",
    supplier: "",
    selectedBatch: [],
    itemDetails: [],
    returnDate: "",
    status: 0,
    selectedSupplier: "",
    returnType: "",
  });
  const [checkBoxOption, setCheckBoxOption] = useState("batch");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [referenceNo, setReferenceNo] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId"),
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
    error: errorSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const fetchBatches = async () => {
    try {
      const response = await get_batches_by_companyId_api(
        sessionStorage.getItem("companyId"),
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching location inventory:", error);
    }
  };

  const {
    data: batches,
    isLoading: isLoadingBatches,
    isError: isErrorBatches,
    error: errorBatches,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: fetchBatches,
  });

  const fetchLocationInventories = async (batchId) => {
    try {
      const response = await get_location_inventory_by_batch_id_api(batchId);
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching location inventory:", error);
    }
  };

  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // Validations

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {},
  ) => {
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
  };

  const validateForm = () => {
    const isSupplierValid = validateField(
      "supplierId",
      "Supplier",
      formData.supplierId,
    );

    const isReturnDateValid = validateField(
      "returnDate",
      "Return Date",
      formData.returnDate,
    );

    let isItemQuantityValid = true;

    formData.itemDetails.forEach((item, index) => {
      const fieldName = `returnQuantity_${index}`;
      const fieldDisplayName = `Return Quantity for ${item.itemName}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.stockInHand,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to stock in hand ${item.returnQuantity}`,
      };
      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.returnQuantity,
        additionalRules,
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return isSupplierValid && isReturnDateValid && isItemQuantityValid;
  };

  // Handlers

  const handleSelectSupplier = (selectedSupplier) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier.supplierId,
      selectedSupplier: selectedSupplier,
    }));
    console.log("selectedSupplier", selectedSupplier);
    setSupplierSearchTerm(""); // Clear the supplier search term
    setValidFields({});
    setValidationErrors({});
  };

  const handleSelectBatch = async (selectedBatch) => {
    console.log("selected batch", selectedBatch);
    setSearchTerm("");
    const inventory = await fetchLocationInventories(selectedBatch.batchId);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedBatch: [...prevFormData.selectedBatch, selectedBatch], // Always add selected batch
      itemDetails:
        inventory && inventory.length > 0
          ? [
              ...prevFormData.itemDetails, // Keep existing items
              ...inventory.map((item) => ({
                inventoryId: item.locationInventoryId,
                itemMasterId: item.itemMasterId,
                batchId: selectedBatch.batchId,
                batchRef: selectedBatch.batchRef,
                unit: item.itemMaster.unit.unitName,
                itemName: item.itemMaster.itemName,
                stockInHand: item.stockInHand,
                returnQuantity: 0,
                locationId: item.locationId,
                locationName: item.location.locationName,
              })),
            ]
          : prevFormData.itemDetails, // Keep the existing itemDetails if no inventory
    }));

    if (!inventory || inventory.length === 0) {
      console.warn("No inventory data found for batch:", selectedBatch.batchId);
    }
  };

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: "",
      supplierId: "",
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      const removedItem = updatedItemDetails[index]; // Get the item being removed
      updatedItemDetails.splice(index, 1); // Remove item

      // Check if there are any remaining items for the same batch
      const isBatchStillUsed = updatedItemDetails.some(
        (item) => item.batchId === removedItem.batchId,
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        selectedBatch: isBatchStillUsed
          ? prevFormData.selectedBatch // Keep batch if still used
          : prevFormData.selectedBatch.filter(
              (batch) => batch.batchId !== removedItem.batchId,
            ), // Remove batch if no items left
      };
    });
    setValidFields({});
    setValidationErrors({});
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  };

  const handleCheckBoxChange = (option) => {
    console.log("option", option);
    setCheckBoxOption(option);
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);

        const supplierReturnData = {
          returnDate: formData.returnDate,
          supplierId: formData.supplierId,
          status: 1,
          returnedBy: sessionStorage.getItem("username"),
          returnedUserId: sessionStorage.getItem("userId"),
          createdDate: currentDate,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          lastUpdatedDate: currentDate,
          companyId: sessionStorage.getItem("companyId"),
        };

        console.log("Supplier Return Data:", supplierReturnData);
        const response =
          await create_supply_return_master_api(supplierReturnData);
        setReferenceNo(response.data.result.referenceNo);

        const supplyReturnMasterId = response.data.result.supplyReturnMasterId;

        const itemDetails = formData.itemDetails.map(async (item) => {
          const itemData = {
            supplyReturnMasterId: supplyReturnMasterId,
            itemMasterId: item.itemMasterId,
            batchId: item.batchId,
            returnedQuantity: item.returnQuantity,
            referenceNo: item.inventoryId,
            locationId: item.locationId,
          };

          const detailApiResponse =
            await create_supply_return_detail_api(itemData);

          return detailApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetails);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201,
        );

        if (allDetailsSuccessful) {
          setSubmissionStatus("successSubmitted");
          console.log("Supply Return submitted successfully!", formData);

          queryClient.invalidateQueries([
            "supplierReturns",
            sessionStorage.getItem("companyId"),
          ]);

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            onFormSubmit();
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

  console.log("formData", formData);

  return {
    formData,
    suppliers,
    isLoadingSuppliers,
    isErrorSuppliers,
    errorSuppliers,
    supplierSearchTerm,
    batches,
    isLoadingBatches,
    isErrorBatches,
    errorBatches,
    searchTerm,
    validFields,
    validationErrors,
    loading,
    referenceNo,
    submissionStatus,
    alertRef,
    checkBoxOption,
    setSupplierSearchTerm,
    setSearchTerm,
    handleSelectSupplier,
    handleSelectBatch,
    handleResetSupplier,
    handleInputChange,
    handleRemoveItem,
    handleItemDetailsChange,
    handleSubmit,
    handleCheckBoxChange,
  };
};

export default useSupplierReturn;
