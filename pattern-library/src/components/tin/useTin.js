import { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  get_requisition_masters_with_out_drafts_api,
  post_issue_master_api,
  post_issue_detail_api,
  get_issue_masters_by_requisition_master_id_api,
  get_item_batches_api,
  get_locations_inventories_by_location_id_api,
  get_sum_of_item_inventory_by_location_id_api,
} from "../../services/purchaseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";

const useTin = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    itemDetails: [],
    status: "4",
    trnId: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTrn, setSelectedTrn] = useState(null);
  const statusOptions = [
    { id: "4", label: "In Progress" },
    { id: "5", label: "Completed" },
  ];
  const alertRef = useRef(null);
  const [trnSearchTerm, setTrnSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const queryClient = useQueryClient();

  const { userLocations } = useContext(UserContext);

  const warehouseUserLocation = userLocations
    ? userLocations
        .filter((loc) => loc.location.locationTypeId === 2)
        .map((l) => l.locationId)
    : null;

  console.log("warehouseUserLocation: ", warehouseUserLocation);

  // Fetch TRNs
  const fetchTrns = async () => {
    try {
      const response = await get_requisition_masters_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );
      const filteredTrns = response.data.result?.filter(
        (rm) =>
          rm.requisitionType === "TRN" &&
          rm.status === 2 &&
          rm.requestedToLocationId === warehouseUserLocation[0]
      );
      return filteredTrns || [];
    } catch (error) {
      console.error("Error fetching TRNs:", error);
      return [];
    }
  };

  const {
    data: trns,
    isLoading,
    isError,
    refetch: refetchTrns,
  } = useQuery({
    queryKey: ["trns"],
    queryFn: fetchTrns,
  });

  // Fetch TINs by requisitionMasterId
  const fetchTinsByRequisitionMasterId = async (requisitionMasterId) => {
    try {
      const response = await get_issue_masters_by_requisition_master_id_api(
        requisitionMasterId
      );
      const filteredTins = response.data.result?.filter(
        (rm) => rm.issueType === "TIN"
      );
      return filteredTins || null;
    } catch (error) {
      console.error("Error fetching TINs:", error);
      return null;
    }
  };

  const {
    data: tins,
    isLoading: isTinsLoading,
    isError: isTinsError,
    refetch: refetchTins,
  } = useQuery({
    queryKey: ["tins", selectedTrn?.requisitionMasterId],
    queryFn: () =>
      fetchTinsByRequisitionMasterId(parseInt(selectedTrn.requisitionMasterId)),
    enabled: !!selectedTrn?.requisitionMasterId,
  });

  // Fetch item batches
  const fetchItemBatches = async () => {
    try {
      const response = await get_item_batches_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching item batches:", error);
      return [];
    }
  };

  const {
    data: itemBatches,
    isLoading: isItemBatchesLoading,
    isError: isItemBatchesError,
    refetch: refetchItemBatches,
  } = useQuery({
    queryKey: ["itemBatches"],
    queryFn: fetchItemBatches,
  });

  // Fetch location inventories
  const fetchLocationInventories = async () => {
    try {
      const response = await get_locations_inventories_by_location_id_api(
        selectedTrn?.requestedToLocationId
      );
      console.log(
        "Fetched location inventories for location",
        selectedTrn?.requestedToLocationId,
        ":",
        response.data.result
      );
      return response.data.result || [];
    } catch (error) {
      console.error(
        "Error fetching location inventories for location",
        selectedTrn?.requestedToLocationId,
        ":",
        error
      );
      return [];
    }
  };

  const {
    data: locationInventories,
    isLoading: isLocationInventoriesLoading,
    isError: isLocationInventoriesError,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: ["locationInventories", selectedTrn?.requestedToLocationId],
    queryFn: fetchLocationInventories,
    enabled: !!selectedTrn?.requestedToLocationId,
  });

  // Update itemDetails when selectedTrn or tins change
  useEffect(() => {
    const processItems = async () => {
      if (selectedTrn) {
        refetchLocationInventories();
        let itemsToProcess = [];

        if (tins) {
          itemsToProcess = selectedTrn.requisitionDetails
            .map((requestItem) => {
              const issuedQuantity = tins.reduce((total, tin) => {
                const tinDetail = tin.issueDetails.find(
                  (detail) =>
                    detail.itemMasterId === requestItem.itemMaster?.itemMasterId
                );
                return total + (tinDetail ? tinDetail.quantity : 0);
              }, 0);

              const pendingRequestQuantity =
                requestItem.quantity - issuedQuantity;

              return {
                requestItem,
                pendingRequestQuantity,
              };
            })
            .filter((item) => item.pendingRequestQuantity > 0);
        } else {
          itemsToProcess = selectedTrn.requisitionDetails.map(
            (requestItem) => ({
              requestItem,
              pendingRequestQuantity: requestItem.quantity,
            })
          );
        }

        // Fetch total stock inventory for the location once
        let locationInventoryMap = {};
        try {
          const inventoryResponse =
            await get_sum_of_item_inventory_by_location_id_api(
              selectedTrn.requestedToLocationId
            );
          const inventoryResult = inventoryResponse.data.result || [];
          // Create a map for quick lookup: itemMasterId -> totalStockInHand
          inventoryResult.forEach((item) => {
            locationInventoryMap[item.itemMasterId] = item.totalStockInHand;
          });
        } catch (error) {
          console.error("Error fetching location inventory summary:", error);
        }

        const updatedItemDetails = itemsToProcess.map(
          ({ requestItem, pendingRequestQuantity }) => {
            const totalStock =
              locationInventoryMap[requestItem.itemMaster?.itemMasterId] || 0;

            return {
              id: requestItem.itemMaster?.itemMasterId,
              name: requestItem.itemMaster?.itemName,
              unit: requestItem.itemMaster?.unit.unitName || "Unit",
              quantity: requestItem.quantity,
              remainingQuantity: totalStock, // Set Remaining Quantity to Total Stock
              pendingRequestQuantity: pendingRequestQuantity, // Keep track of pending request separately if needed for validation
              issuedQuantity: "",
              batchId: "",
            };
          }
        );

        setFormData((prevFormData) => ({
          ...prevFormData,
          itemDetails: updatedItemDetails,
          trnId: selectedTrn?.requisitionMasterId ?? "",
        }));
      }
    };

    processItems();
  }, [selectedTrn, tins, refetchLocationInventories]);

  // Scroll to alert on submission status change
  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // Validate individual fields
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

  // Validate the entire form
  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isStatusValid = validateField("status", "Status", formData.status);
    const isTrnIdValid = validateField(
      "trnId",
      "Transfer requisition reference number",
      formData.trnId
    );

    let isItemQuantityValid = true;

    formData.itemDetails.forEach((item, index) => {
      // Validate issued quantity
      const quantityFieldName = `issuedQuantity_${index}`;
      const quantityFieldDisplayName = `Dispatched Quantity for ${item.name}`;
      const quantityRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.remainingQuantity,
        errorMessage: `${quantityFieldDisplayName} must be greater than 0 and less than or equal to remaining quantity ${item.remainingQuantity}`,
      };
      const isValidQuantity = validateField(
        quantityFieldName,
        quantityFieldDisplayName,
        item.issuedQuantity,
        quantityRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    const isItemsPresent = formData.itemDetails.length > 0;
    if (!isItemsPresent) {
      setValidationErrors((prev) => ({
        ...prev,
        itemDetails: "At least one item is required",
      }));
    }

    return (
      isStatusValid && isTrnIdValid && isItemQuantityValid && isItemsPresent
    );
  };

  // Generate unique reference number
  const generateReferenceNumber = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `TIN_${formattedDate}_${randomNumber}`;
  };

  // Handle form submission
  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const combinedStatus = parseInt(`${formData.status}${status}`, 10);
      const currentDate = new Date().toISOString();

      const isFormValid = validateForm();
      if (!isFormValid) {
        setSubmissionStatus("error");
        setTimeout(() => setSubmissionStatus(null), 3000);
        return;
      }

      if (isSaveAsDraft) setLoadingDraft(true);
      else setLoading(true);

      const TinData = {
        requisitionMasterId: parseInt(formData.trnId),
        issueDate: currentDate,
        createdBy: sessionStorage?.getItem("username") ?? null,
        createdUserId: sessionStorage?.getItem("userId") ?? null,
        status: combinedStatus,
        approvedBy: null,
        approvedDate: null,
        companyId: sessionStorage?.getItem("companyId") ?? null,
        issueType: "TIN",
        referenceNumber: generateReferenceNumber(),
        approvedUserId: null,
        issuedLocationId: parseInt(selectedTrn?.requestedToLocationId) || null,
        permissionId: 1061,
        //toLocationId: parseInt(selectedTrn?.requestedToLocationId) || null,
      };

      const response = await post_issue_master_api(TinData);
      const issueMasterId = response.data.result.issueMasterId;

      const itemDetailsData = formData.itemDetails.map(async (item) => {
        const detailsData = {
          issueMasterId,
          itemMasterId: item.id,
          batchId: parseInt(item.batchId),
          quantity: parseFloat(item.issuedQuantity),
          permissionId: 1063,
        };
        return await post_issue_detail_api(detailsData);
      });

      const detailsResponses = await Promise.all(itemDetailsData);
      const allDetailsSuccessful = detailsResponses.every(
        (detailsResponse) => detailsResponse.status === 201
      );

      if (allDetailsSuccessful) {
        setSubmissionStatus(
          isSaveAsDraft ? "successSavedAsDraft" : "successSubmitted"
        );
        console.log(
          isSaveAsDraft
            ? "Transfer issue note saved as draft!"
            : "Transfer issue note submitted successfully!",
          formData
        );
        queryClient.invalidateQueries(["tinList", companyId]);
        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
          onFormSubmit();
        }, 3000);
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
        setLoadingDraft(false);
      }, 3000);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // Handle item details changes
  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItemDetails = [...prev.itemDetails];
      if (field === "batchId") {
        const selectedBatch = locationInventories.find(
          (batch) =>
            batch.batchId === parseInt(value) &&
            batch.itemMasterId === updatedItemDetails[index].id
        );
        updatedItemDetails[index].batchId = value;
        updatedItemDetails[index].remainingQuantity =
          selectedBatch?.stockInHand ?? 0;
        updatedItemDetails[index].issuedQuantity = "";
      } else {
        updatedItemDetails[index][field] = value;
      }
      return { ...prev, itemDetails: updatedItemDetails };
    });

    if (field === "issuedQuantity") {
      const item = formData.itemDetails[index];
      const fieldName = `issuedQuantity_${index}`;
      const fieldDisplayName = `Dispatched Quantity for ${item.name}`;
      const additionalRules = {
        validationFunction: (val) => {
          const parsedValue = parseFloat(val);
          return (
            !isNaN(parsedValue) &&
            parsedValue > 0 &&
            parsedValue <= item.remainingQuantity
          );
        },
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to ${item.remainingQuantity}`,
      };
      validateField(fieldName, fieldDisplayName, value, additionalRules);
    }
  };
  // Remove an item from itemDetails
  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      const updatedItemDetails = [...prev.itemDetails];
      updatedItemDetails.splice(index, 1);
      return { ...prev, itemDetails: updatedItemDetails };
    });
    setValidFields((prev) => {
      const copy = { ...prev };
      delete copy[`issuedQuantity_${index}`];
      delete copy[`batchId_${index}`];
      return copy;
    });
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[`issuedQuantity_${index}`];
      delete copy[`batchId_${index}`];
      return copy;
    });
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle TRN selection
  const handleTrnChange = (referenceId) => {
    const selectedTrn = trns.find((trn) => trn.referenceNumber === referenceId);
    console.log("selectedTrn", selectedTrn);
    setSelectedTrn(selectedTrn);
    setFormData((prev) => ({
      ...prev,
      trnId: selectedTrn?.requisitionMasterId ?? "",
    }));
    refetchTins();
    setTrnSearchTerm("");
  };

  // Handle status change
  const handleStatusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption?.id,
    }));
  };

  // Reset TRN
  const handleResetTrn = () => {
    setFormData((prev) => ({
      ...prev,
      trnId: "",
      itemDetails: [],
    }));
    setSelectedTrn(null);
    setValidFields({});
    setValidationErrors({});
    // refetchTrns();
    // refetchTins();
    // refetchItemBatches();
    // refetchLocationInventories();
    // queryClient.resetQueries(["tins", null]);
    // queryClient.resetQueries(["locationInventories", null]);
  };

  console.log("formData", formData);

  return {
    formData,
    validFields,
    validationErrors,
    selectedTrn,
    trns: trns || [],
    statusOptions,
    submissionStatus,
    alertRef,
    isLoading: isLoading || isItemBatchesLoading,
    isError,
    trnSearchTerm,
    loading,
    loadingDraft,
    itemBatches: itemBatches || [],
    isItemBatchesLoading,
    isItemBatchesError,
    isLocationInventoriesLoading,
    isLocationInventoriesError,
    locationInventories: locationInventories || [],
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleSubmit,
    handleTrnChange,
    handleStatusChange,
    setTrnSearchTerm,
    handleResetTrn,
  };
};

export default useTin;
