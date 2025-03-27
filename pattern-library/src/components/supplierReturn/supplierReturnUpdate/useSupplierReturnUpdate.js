import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  create_supply_return_detail_api,
  delete_supply_return_detail_api,
  get_batches_by_companyId_api,
  get_company_suppliers_api,
  get_location_inventory_by_batch_id_api,
  get_location_inventory_by_locationInvemtoryId_api,
  put_supply_return_detail_api,
  put_supply_return_master_api,
} from "../../../services/purchaseApi";

const useSupplierReturnUpdate = ({ supplyReturnMaster, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    supplyReturnMasterId: "",
    supplierId: "",
    supplier: "",
    selectedBatch: [],
    itemDetails: [],
    returnDate: "",
    status: 0,
    selectedSupplier: "",
    referenceNo: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
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
                  supplyReturnDetailId: item.supplyReturnDetailId || null,
                  inventoryId: item.referenceNo,
                  itemMasterId: item.itemMasterId,
                  batchId: item.batchId,
                  batchRef: item.batch.batchRef,
                  unit: item.itemMaster.unit.unitName,
                  itemName: item.itemMaster.itemName,
                  stockInHand: inventory ? inventory.stockInHand : 0,
                  returnQuantity: item.returnedQuantity,
                  locationId: item.locationId,
                };
              }
            ),
            returnDate: supplyReturnMaster.returnDate.split("T")[0],
            status: supplyReturnMaster.status,
            selectedSupplier: supplyReturnMaster.supplier,
            referenceNo: supplyReturnMaster.referenceNo,
          });
          setItemIdsToBeDeleted([]);
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

    return isSupplierValid && isReturnDateValid && isItemQuantityValid;
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
                supplyReturnDetailId: null,
                inventoryId: item.locationInventoryId,
                itemMasterId: item.itemMasterId,
                batchId: selectedBatch.batchId,
                batchRef: selectedBatch.batchRef,
                unit: item.itemMaster.unit.unitName,
                itemName: item.itemMaster.itemName,
                stockInHand: item.stockInHand,
                returnQuantity: 0,
                locationId: item.locationId,
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

  const handleRemoveItem = (index, item) => {
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

    if (
      item.supplyReturnDetailId !== null &&
      item.supplyReturnDetailId !== undefined
    ) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, item]);
    }

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

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);
        const supplierReturnData = {
          returnDate: formData.returnDate,
          supplierId: formData.supplierId,
          status: supplyReturnMaster.status,
          returnedBy: supplyReturnMaster.returnedBy,
          returnedUserId: supplyReturnMaster.returnedUserId,
          createdDate: supplyReturnMaster.createdDate,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          lastUpdatedDate: currentDate,
          companyId: sessionStorage.getItem("companyId"),
        };
        console.log("Supplier Return Data:", supplierReturnData);
        const response = await put_supply_return_master_api(
          supplyReturnMaster.supplyReturnMasterId,
          supplierReturnData
        );

        if (response.status === 200) {
          let allDeletionsSuccessful = true;
          let allDetailsUpdatedSuccessful = true;
          let allDetailsSuccessful = true;

          // Handle Deletions
          if (itemIdsToBeDeleted.length > 0) {
            const deletePromises = itemIdsToBeDeleted.map(async (item) => {
              try {
                await delete_supply_return_detail_api(
                  item.supplyReturnDetailId
                );
                console.log(
                  `Successfully deleted item with ID: ${item.supplyReturnDetailId}`
                );
                return { status: 201 }; // Treat as success
              } catch (error) {
                console.error(
                  `Failed to delete item with ID: ${item.supplyReturnDetailId}`,
                  error
                );
                return { status: 500 }; // Failure
              }
            });

            const deleteResponses = await Promise.all(deletePromises);
            setItemIdsToBeDeleted([]); // Clear deleted items

            allDeletionsSuccessful = deleteResponses.every(
              (response) => response.status === 201
            );
          }

          // Handle Item Creation
          if (
            formData.itemDetails.filter(
              (item) => item.supplyReturnDetailId == null
            ).length > 0
          ) {
            const itemDetails = formData.itemDetails
              .filter((item) => item.supplyReturnDetailId == null)
              .map(async (item) => {
                const itemData = {
                  supplyReturnMasterId: supplyReturnMaster.supplyReturnMasterId,
                  itemMasterId: item.itemMasterId,
                  batchId: item.batchId,
                  returnedQuantity: parseFloat(item.returnQuantity),
                  referenceNo: item.inventoryId,
                  locationId: item.locationId,
                };

                const detailApiResponse = await create_supply_return_detail_api(
                  itemData
                );
                return detailApiResponse;
              });

            const detailsResponses = await Promise.all(itemDetails);

            allDetailsSuccessful = detailsResponses.every(
              (detailsResponse) => detailsResponse.status === 201
            );
          }

          // Handle Item Updates
          if (
            formData.itemDetails.filter(
              (item) => item.supplyReturnDetailId !== null
            ).length > 0
          ) {
            const itemDetails = formData.itemDetails
              .filter((item) => item.supplyReturnDetailId !== null)
              .map(async (item) => {
                const itemData = {
                  supplyReturnMasterId: supplyReturnMaster.supplyReturnMasterId,
                  itemMasterId: item.itemMasterId,
                  batchId: item.batchId,
                  returnedQuantity: parseFloat(item.returnQuantity),
                  referenceNo: item.inventoryId,
                  locationId: item.locationId,
                };

                const detailApiResponse = await put_supply_return_detail_api(
                  item.supplyReturnDetailId,
                  itemData
                );
                return detailApiResponse;
              });

            const detailsResponses = await Promise.all(itemDetails);

            allDetailsUpdatedSuccessful = detailsResponses.every(
              (detailsResponse) => detailsResponse.status === 200
            );
          }

          console.log("Deletions Status:", allDeletionsSuccessful);
          console.log("Details Status:", allDetailsSuccessful);
          console.log("Details Updated Status:", allDetailsUpdatedSuccessful);

          // Set Submission Status
          if (
            allDeletionsSuccessful &&
            allDetailsSuccessful &&
            allDetailsUpdatedSuccessful
          ) {
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
            console.error("Error submitting form!");
          }
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

  console.log("formData in update form: ", formData);
  console.log("itemIdsToBeDeleted: ", itemIdsToBeDeleted);

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
    handleSubmit,
  };
};

export default useSupplierReturnUpdate;
