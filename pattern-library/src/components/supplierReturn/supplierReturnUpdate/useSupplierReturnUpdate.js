import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  get_batches_by_companyId_api,
  get_company_suppliers_api,
  get_location_inventory_by_batch_id_api,
  get_location_inventory_by_locationInvemtoryId_api,
} from "../../../services/purchaseApi";

const useSupplierReturnUpdate = ({ supplyReturnMaster }) => {
  const [formData, setFormData] = useState({
    supplyReturnMasterId: "",
    supplierId: "",
    supplier: "",
    selectedBatch: [],
    itemDetails: [],
    returnDate: "",
    status: 0,
    selectedSupplier: "",
    returnType: "",
    referenceNo: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const returnTypeOptions = [
    { id: "goodsReceivedNote", label: "Goods Received Note" },
    { id: "creditNote", label: "Credit Note" },
  ];
  const alertRef = useRef(null);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [isFormDataError, setIsFormDataError] = useState(false);
  const [formDataError, setFormDataError] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId")
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
        sessionStorage.getItem("companyId")
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
    const fetchData = async () => {
      if (supplyReturnMaster) {
        setLoadingFormData(true);
        try {
          const inventoryDetails = supplyReturnMaster.supplyReturnDetails.map(
            async (item) => {
              const inventory =
                await get_location_inventory_by_locationInvemtoryId_api(
                  parseInt(item.referenceNo)
                );
              return inventory.data.result;
            }
          );
          const inventoryData = await Promise.all(inventoryDetails);

          console.log("Inventory Data:", inventoryData);

          setFormData({
            supplyReturnMasterId: supplyReturnMaster.supplyReturnMasterId,
            supplierId: supplyReturnMaster.supplierId,
            supplier: "",
            selectedBatch: supplyReturnMaster.supplyReturnDetails.map(
              (item) => ({
                batchId: item.batch.batchId,
                batchRef: item.batch.batchRef,
                date: item.batch.date,
                companyId: item.batch.companyId,
              })
            ),
            itemDetails: supplyReturnMaster.supplyReturnDetails.map(
              (item, index) => {
                const inventory = inventoryData.find(
                  (inv) =>
                    inv.locationInventoryId === parseInt(item.referenceNo)
                );

                return {
                  inventoryId: item.referenceNo,
                  itemMasterId: item.itemMasterId,
                  batchId: item.batchId,
                  batchRef: item.batch.batchRef,
                  unit: item.itemMaster.unit.unitName,
                  itemName: item.itemMaster.itemName,
                  stockInHand: inventory ? inventory.stockInHand : 0,
                  returnQuantity: item.returnedQuantity,
                };
              }
            ),
            returnDate: supplyReturnMaster.returnDate.split("T")[0],
            status: supplyReturnMaster.status,
            selectedSupplier: supplyReturnMaster.supplier,
            returnType: supplyReturnMaster.returnType,
            referenceNo: supplyReturnMaster.referenceNo,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsFormDataError(true);
          setFormDataError(error);
          setFormData({});
        } finally {
          setLoadingFormData(false);
        }
      }
    };

    fetchData();
  }, [supplyReturnMaster]);

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
    additionalRules = {}
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
      formData.supplierId
    );

    const isReturnDateValid = validateField(
      "returnDate",
      "Return Date",
      formData.returnDate
    );

    const isReturnTypeValid = validateField(
      "returnType",
      "Return Type",
      formData.returnType
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
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return (
      isSupplierValid &&
      isReturnDateValid &&
      isItemQuantityValid &&
      isReturnTypeValid
    );
  };

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
        (item) => item.batchId === removedItem.batchId
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        selectedBatch: isBatchStillUsed
          ? prevFormData.selectedBatch // Keep batch if still used
          : prevFormData.selectedBatch.filter(
              (batch) => batch.batchId !== removedItem.batchId
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

  console.log("formData in update form: ", formData);

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
    returnTypeOptions,
    loading,
    loadingFormData,
    isFormDataError,
    formDataError,
    submissionStatus,
    alertRef,
    setSupplierSearchTerm,
    setSearchTerm,
    handleSelectSupplier,
    handleSelectBatch,
    handleResetSupplier,
    handleInputChange,
    handleRemoveItem,
    handleItemDetailsChange,
  };
};

export default useSupplierReturnUpdate;
