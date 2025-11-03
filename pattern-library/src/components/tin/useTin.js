import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  get_requisition_masters_with_out_drafts_api,
  post_issue_master_api,
  post_issue_detail_api,
  get_issue_masters_by_requisition_master_id_api,
  get_item_batches_api,
  get_sum_location_inventories_by_ref_api,
} from "../../services/purchaseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Constants
const STATUS_OPTIONS = [
  { id: "4", label: "In Progress" },
  { id: "5", label: "Completed" },
];

const INITIAL_FORM_STATE = {
  itemDetails: [],
  status: STATUS_OPTIONS[0].id,
  trnId: "",
};

const SUBMISSION_STATUS = {
  SUCCESS_SUBMITTED: "successSubmitted",
  SUCCESS_DRAFT: "successSavedAsDraft",
  ERROR: "error",
};

const ALERT_TIMEOUT = 3000;

// Helper Functions
const getSessionValue = (key) => sessionStorage?.getItem(key) ?? null;

const generateReferenceNumber = () => {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TIN_${timestamp}_${random}`;
};

const calculateIssuedQuantity = (tins, itemMasterId) => {
  return tins.reduce((total, tin) => {
    const tinDetail = tin.issueDetails.find(
      (detail) => detail.itemMasterId === itemMasterId
    );
    return total + (tinDetail?.quantity || 0);
  }, 0);
};

const createItemDetail = (
  requestItem,
  issuedQuantity = 0,
  stockInHand = 0
) => ({
  id: requestItem.itemMaster?.itemMasterId,
  name: requestItem.itemMaster?.itemName,
  unit: requestItem.itemMaster?.unit?.unitName || "Unit",
  quantity: requestItem.quantity,
  remainingQuantity: Math.max(0, requestItem.quantity - issuedQuantity),
  stockInHand: stockInHand,
  issuedQuantity: "",
  batchId: "",
});

// Custom Hook
const useTin = ({ onFormSubmit }) => {
  // State Management
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTrn, setSelectedTrn] = useState(null);
  const [trnSearchTerm, setTrnSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const alertRef = useRef(null);
  const queryClient = useQueryClient();

  // Memoized values
  const companyId = useMemo(() => getSessionValue("companyId"), []);
  const username = useMemo(() => getSessionValue("username"), []);
  const userId = useMemo(() => getSessionValue("userId"), []);

  // Query Functions
  const fetchTrns = useCallback(async () => {
    try {
      const response = await get_requisition_masters_with_out_drafts_api(
        companyId
      );
      return (
        response.data.result?.filter(
          (rm) => rm.requisitionType === "TRN" && rm.status === 2
        ) || []
      );
    } catch (error) {
      console.error("Error fetching TRNs:", error);
      throw error;
    }
  }, [companyId]);

  const fetchTinsByRequisitionMasterId = useCallback(
    async (requisitionMasterId) => {
      try {
        const response = await get_issue_masters_by_requisition_master_id_api(
          requisitionMasterId
        );
        return (
          response.data.result?.filter((rm) => rm.issueType === "TIN") || []
        );
      } catch (error) {
        console.error("Error fetching TINs:", error);
        throw error;
      }
    },
    []
  );

  const fetchItemBatches = useCallback(async () => {
    try {
      const response = await get_item_batches_api(companyId);
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching item batches:", error);
      throw error;
    }
  }, [companyId]);

  const fetchLocationInventoriesByRef = useCallback(async () => {
    if (!selectedTrn?.grnDekReference || !selectedTrn?.requestedToLocationId) {
      return [];
    }

    try {
      const response = await get_sum_location_inventories_by_ref_api(
        selectedTrn.grnDekReference,
        selectedTrn.requestedToLocationId
      );
      console.log(
        `Fetched location inventories for GRN reference ${selectedTrn.grnDekReference}:`,
        response.data.result
      );
      return response.data.result || [];
    } catch (error) {
      console.error(
        `Error fetching location inventories for GRN reference ${selectedTrn?.grnDekReference}:`,
        error
      );
      throw error;
    }
  }, [selectedTrn?.grnDekReference, selectedTrn?.requestedToLocationId]);

  // React Query Hooks
  const {
    data: trns = [],
    isLoading: isTrnsLoading,
    isError: isTrnsError,
    refetch: refetchTrns,
  } = useQuery({
    queryKey: ["trns", companyId],
    queryFn: fetchTrns,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: tins = [],
    isLoading: isTinsLoading,
    isError: isTinsError,
    refetch: refetchTins,
  } = useQuery({
    queryKey: ["tins", selectedTrn?.requisitionMasterId],
    queryFn: () =>
      fetchTinsByRequisitionMasterId(selectedTrn.requisitionMasterId),
    enabled: !!selectedTrn?.requisitionMasterId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: itemBatches = [],
    isLoading: isItemBatchesLoading,
    isError: isItemBatchesError,
  } = useQuery({
    queryKey: ["itemBatches", companyId],
    queryFn: fetchItemBatches,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: locationInventories = [],
    isLoading: isLocationInventoriesLoading,
    isError: isLocationInventoriesError,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: [
      "locationInventoriesByRef",
      selectedTrn?.grnDekReference,
      selectedTrn?.requestedToLocationId,
    ],
    queryFn: fetchLocationInventoriesByRef,
    enabled:
      !!selectedTrn?.grnDekReference && !!selectedTrn?.requestedToLocationId,
    staleTime: 2 * 60 * 1000,
  });

  // Validation Functions
  const validateField = useCallback(
    (fieldName, fieldDisplayName, value, additionalRules = {}) => {
      let isFieldValid = true;
      let errorMessage = "";

      const stringValue = `${value ?? ""}`.trim();
      if (stringValue === "") {
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
      const isValidQuantity = validateField(
        quantityFieldName,
        quantityFieldDisplayName,
        item.issuedQuantity,
        {
          validationFunction: (value) => {
            const numValue = parseFloat(value);
            return (
              !isNaN(numValue) && numValue > 0 && numValue <= item.stockInHand
            );
          },
          errorMessage: `${quantityFieldDisplayName} must be between 1 and ${item.stockInHand}`,
        }
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
  }, [formData, validateField]);

  // Event Handlers
  const handleSubmit = useCallback(
    async (isSaveAsDraft = false) => {
      try {
        if (!validateForm()) {
          setSubmissionStatus(SUBMISSION_STATUS.ERROR);
          setTimeout(() => setSubmissionStatus(null), ALERT_TIMEOUT);
          return;
        }

        const loadingSetter = isSaveAsDraft ? setLoadingDraft : setLoading;
        loadingSetter(true);

        const status = isSaveAsDraft ? 0 : 1;
        const combinedStatus = parseInt(`${formData.status}${status}`, 10);

        const tinData = {
          requisitionMasterId: parseInt(formData.trnId),
          issueDate: new Date().toISOString(),
          createdBy: username,
          createdUserId: userId,
          status: combinedStatus,
          approvedBy: null,
          approvedDate: null,
          companyId,
          issueType: "TIN",
          referenceNumber: generateReferenceNumber(),
          approvedUserId: null,
          issuedLocationId:
            parseInt(selectedTrn?.requestedToLocationId) || null,
          permissionId: 1061,
        };

        const response = await post_issue_master_api(tinData);
        const issueMasterId = response.data.result.issueMasterId;

        const itemDetailsPromises = formData.itemDetails.map((item) =>
          post_issue_detail_api({
            issueMasterId,
            itemMasterId: item.id,
            batchId: parseInt(item.batchId),
            quantity: parseFloat(item.issuedQuantity),
            permissionId: 1063,
          })
        );

        const detailsResponses = await Promise.all(itemDetailsPromises);
        const allSuccessful = detailsResponses.every(
          (res) => res.status === 201
        );

        if (allSuccessful) {
          const successStatus = isSaveAsDraft
            ? SUBMISSION_STATUS.SUCCESS_DRAFT
            : SUBMISSION_STATUS.SUCCESS_SUBMITTED;
          setSubmissionStatus(successStatus);

          console.log(
            isSaveAsDraft
              ? "Transfer issue note saved as draft!"
              : "Transfer issue note submitted successfully!",
            formData
          );

          setTimeout(() => {
            setSubmissionStatus(null);
            loadingSetter(false);
            onFormSubmit();
          }, ALERT_TIMEOUT);
        } else {
          throw new Error("Some item details failed to submit");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus(SUBMISSION_STATUS.ERROR);
        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
        }, ALERT_TIMEOUT);
      }
    },
    [
      formData,
      selectedTrn,
      username,
      userId,
      companyId,
      validateForm,
      onFormSubmit,
    ]
  );

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleItemDetailsChange = useCallback(
    (index, field, value) => {
      setFormData((prev) => {
        const updatedItemDetails = [...prev.itemDetails];
        updatedItemDetails[index][field] = value;
        return { ...prev, itemDetails: updatedItemDetails };
      });

      if (field === "issuedQuantity") {
        const item = formData.itemDetails[index];
        validateField(
          `issuedQuantity_${index}`,
          `Dispatched Quantity for ${item.name}`,
          value,
          {
            validationFunction: (val) => {
              const numValue = parseFloat(val);
              return (
                !isNaN(numValue) && numValue > 0 && numValue <= item.stockInHand
              );
            },
            errorMessage: `Dispatched Quantity must be between 1 and ${item.stockInHand}`,
          }
        );
      }
    },
    [formData.itemDetails, validateField]
  );

  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      itemDetails: prev.itemDetails.filter((_, i) => i !== index),
    }));

    setValidFields((prev) => {
      const updated = { ...prev };
      delete updated[`issuedQuantity_${index}`];
      return updated;
    });

    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[`issuedQuantity_${index}`];
      return updated;
    });
  }, []);

  const handleTrnChange = useCallback(
    (referenceId) => {
      const selected = trns.find((trn) => trn.referenceNumber === referenceId);
      console.log("selectedTrn", selected);

      setSelectedTrn(selected);
      setFormData((prev) => ({
        ...prev,
        trnId: selected?.requisitionMasterId ?? "",
      }));
      setTrnSearchTerm("");

      if (selected) {
        refetchTins();
      }
    },
    [trns, refetchTins]
  );

  const handleStatusChange = useCallback((selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption?.id ?? "",
    }));
  }, []);

  const handleResetTrn = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setSelectedTrn(null);
    setValidFields({});
    setValidationErrors({});

    queryClient.removeQueries(["tins"]);
    queryClient.removeQueries(["locationInventoriesByRef"]);
  }, [queryClient]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Effects
  useEffect(() => {
    if (!selectedTrn || locationInventories.length === 0) return;

    const updateItemDetails = () => {
      const itemDetails = selectedTrn.requisitionDetails
        .map((requestItem) => {
          const issuedQty =
            tins.length > 0
              ? calculateIssuedQuantity(
                  tins,
                  requestItem.itemMaster?.itemMasterId
                )
              : 0;

          // Find matching inventory for this item
          const inventory = locationInventories.find(
            (inv) => inv.itemMasterId === requestItem.itemMaster?.itemMasterId
          );

          const stockInHand = inventory?.totalStockInHand || 0;

          // Create item detail with stock info
          const itemDetail = createItemDetail(
            requestItem,
            issuedQty,
            stockInHand
          );

          if (itemBatches.length > 0 && inventory) {
            const batch = itemBatches.find(
              (ib) =>
                ib.itemMasterId === requestItem.itemMaster?.itemMasterId &&
                ib.referenceNo === selectedTrn.grnDekReference
            );
            itemDetail.batchId = batch?.batchId ?? null;
          }

          return itemDetail;
        })
        .filter((item) => item.remainingQuantity > 0);

      setFormData((prev) => ({
        ...prev,
        itemDetails,
        trnId: selectedTrn.requisitionMasterId ?? "",
      }));
    };

    updateItemDetails();
  }, [selectedTrn, tins, locationInventories]);

  useEffect(() => {
    if (submissionStatus && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // Computed values
  const isLoading = useMemo(
    () =>
      isTrnsLoading ||
      isTinsLoading ||
      isItemBatchesLoading ||
      isLocationInventoriesLoading,
    [
      isTrnsLoading,
      isTinsLoading,
      isItemBatchesLoading,
      isLocationInventoriesLoading,
    ]
  );

  const isError = useMemo(
    () =>
      isTrnsError ||
      isTinsError ||
      isItemBatchesError ||
      isLocationInventoriesError,
    [isTrnsError, isTinsError, isItemBatchesError, isLocationInventoriesError]
  );

  console.log("FormData: ", formData);
  console.log("Location Inventories: ", locationInventories);

  // Return values
  return {
    formData,
    validFields,
    validationErrors,
    selectedTrn,
    trns,
    statusOptions: STATUS_OPTIONS,
    submissionStatus,
    alertRef,
    isLoading,
    isError,
    trnSearchTerm,
    loading,
    loadingDraft,
    itemBatches,
    isItemBatchesLoading,
    isItemBatchesError,
    isLocationInventoriesLoading,
    isLocationInventoriesError,
    locationInventories,
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
