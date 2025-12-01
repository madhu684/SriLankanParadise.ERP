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
import toast from "react-hot-toast";

// Constants
const STATUS_OPTIONS = [
  { id: "4", label: "In Progress" },
  { id: "5", label: "Completed" },
];

const INITIAL_FORM_STATE = {
  itemDetails: [],
  status: STATUS_OPTIONS[0].id,
  trnId: "",
  issuingCustDekNo: "",
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
  custDekNo: requestItem.custDekNo,
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
    const isIssuingCustDekNoValid = validateField(
      "issuingCustDekNo",
      "Issuing Cust Dek Number",
      formData.issuingCustDekNo
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
      isStatusValid &&
      isTrnIdValid &&
      isIssuingCustDekNoValid &&
      isItemQuantityValid &&
      isItemsPresent
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
          issuingCustDekNo: formData.issuingCustDekNo,
          permissionId: 1061,
        };

        const response = await post_issue_master_api(tinData);

        if (response.status === 409) {
          toast.error(response.message);
          setLoading(false);
          setLoadingDraft(false);
          return;
        }

        const issueMasterId = response.data.result.issueMasterId;

        const itemDetailsPromises = formData.itemDetails.map((item) =>
          post_issue_detail_api({
            issueMasterId,
            itemMasterId: item.id,
            batchId: parseInt(item.batchId),
            quantity: parseFloat(item.issuedQuantity),
            custDekNo: item.custDekNo,
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

          queryClient.invalidateQueries(["tinList", companyId]);

          toast.success(
            isSaveAsDraft
              ? "Transfer issue note saved as draft successfully!"
              : "Transfer issue note submitted successfully!"
          );
        } else {
          toast.error("Transfer issue note failed to submit");
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
        toast.error("Transfer issue note failed to submit");
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
    if (!selectedTrn) return;

    const updateItemDetails = async () => {
      const itemDetailsPromises = selectedTrn.requisitionDetails.map(
        async (requestItem) => {
          const issuedQty =
            tins.length > 0
              ? calculateIssuedQuantity(
                  tins,
                  requestItem.itemMaster?.itemMasterId
                )
              : 0;

          let stockInHand = 0;
          let inventory = null;

          try {
            const response = await get_sum_location_inventories_by_ref_api(
              requestItem.custDekNo,
              selectedTrn.requestedToLocationId
            );

            if (response?.data?.result && response.data.result.length > 0) {
              inventory = response.data.result.find(
                (inv) =>
                  inv.itemMasterId === requestItem.itemMaster?.itemMasterId
              );
              stockInHand = inventory?.totalStockInHand || 0;
            }
          } catch (error) {
            console.error("Error fetching location inventory:", error);
          }

          const itemDetail = createItemDetail(
            requestItem,
            issuedQty,
            stockInHand
          );

          if (itemBatches.length > 0) {
            const batch = itemBatches.find(
              (ib) => ib.custDekNo === requestItem.custDekNo
            );
            itemDetail.batchId = batch?.batchId ?? null;
          }

          return itemDetail;
        }
      );

      const itemDetails = (await Promise.all(itemDetailsPromises)).filter(
        (item) => item.remainingQuantity > 0
      );

      setFormData((prev) => ({
        ...prev,
        itemDetails,
        trnId: selectedTrn.requisitionMasterId ?? "",
      }));
    };

    updateItemDetails();
  }, [selectedTrn, tins, itemBatches]);

  useEffect(() => {
    if (submissionStatus && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // Computed values
  const isLoading = useMemo(
    () => isTrnsLoading || isTinsLoading || isItemBatchesLoading,
    [isTrnsLoading, isTinsLoading, isItemBatchesLoading]
  );

  const isError = useMemo(
    () => isTrnsError || isItemBatchesError,
    [isTrnsError, isItemBatchesError]
  );

  console.log("FormData: ", formData);

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
