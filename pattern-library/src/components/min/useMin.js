import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  get_requisition_masters_with_out_drafts_api,
  post_issue_master_api,
  post_issue_detail_api,
  get_issue_masters_by_requisition_master_id_api,
  get_item_batches_api,
  get_locations_inventories_by_location_id_api,
} from "../../services/purchaseApi";

const useMin = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    itemDetails: [],
    status: "",
    mrnId: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedMrn, setSelectedMrn] = useState(null);
  const statusOptions = [
    { id: "4", label: "In Progress" },
    { id: "5", label: "Completed" },
  ];
  const alertRef = useRef(null);
  const [mrnSearchTerm, setMrnSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  // -------------- Queries --------------

  // Fetch all MRNs (Material Requisition Notes)
  const {
    data: mrns,
    isLoading,
    isError,
    refetch: refetchMrns,
  } = useQuery({
    queryKey: ["mrns"],
    queryFn: () =>
      get_requisition_masters_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      ).then(
        (response) =>
          response.data.result?.filter(
            (rm) => rm.requisitionType === "MRN" && rm.status === 2
          ) || []
      ),
  });

  // Fetch existing MINs for the selected MRN (to calculate how much has already been issued)
  const {
    data: mins,
    isLoading: isMinsLoading,
    refetch: refetchMins,
  } = useQuery({
    queryKey: ["mins", selectedMrn?.requisitionMasterId],
    queryFn: () =>
      selectedMrn?.requisitionMasterId
        ? get_issue_masters_by_requisition_master_id_api(
            selectedMrn.requisitionMasterId
          ).then(
            (response) =>
              response.data.result?.filter((rm) => rm.issueType === "MIN") ||
              null
          )
        : null,
    enabled: !!selectedMrn?.requisitionMasterId,
  });

  // Fetch all item batches (not used directly—but could be used for future batch logic)
  const {
    data: itemBatches,
    isLoading: isItemBatchesLoading,
    refetch: refetchItemBatches,
  } = useQuery({
    queryKey: ["itemBatches"],
    queryFn: () =>
      get_item_batches_api(sessionStorage?.getItem("companyId")).then(
        (response) => response.data.result
      ),
  });

  // Fetch the inventory levels at the "From" warehouse for the selected MRN
  const {
    data: locationInventories,
    isLoading: isLocationInventoriesLoading,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: ["locationInventories", selectedMrn?.requestedFromLocationId],
    queryFn: () =>
      selectedMrn?.requestedFromLocationId
        ? get_locations_inventories_by_location_id_api(
            selectedMrn.requestedFromLocationId
          ).then((response) => response.data.result || [])
        : Promise.resolve([]),
    enabled: !!selectedMrn?.requestedFromLocationId,
  });

  // -------------- Effects --------------

  // Whenever a new MRN is selected (or its MINs load), compute the remaining quantities.
  useEffect(() => {
    if (selectedMrn) {
      refetchLocationInventories(); // refresh inventory for the new location

      const updatedItemDetails = selectedMrn.requisitionDetails
        .map((requestItem) => {
          // Sum up everything already issued for this item across all previous MINs
          const issuedQuantity =
            mins?.reduce((total, min) => {
              const minDetail = min.issueDetails.find(
                (detail) =>
                  detail.itemMasterId === requestItem.itemMaster?.itemMasterId
              );
              return total + (minDetail ? minDetail.quantity : 0);
            }, 0) || 0;

          const remainingQuantity = requestItem.quantity - issuedQuantity;

          return {
            id: requestItem.itemMaster?.itemMasterId,
            name: requestItem.itemMaster?.itemName,
            unit: requestItem.itemMaster?.unit.unitName,
            quantity: requestItem.quantity,
            remainingQuantity: Math.max(0, remainingQuantity),
            issuedQuantity: "", // start blank so user must enter ≥1
            batchId: "",
          };
        })
        .filter((item) => item.remainingQuantity > 0);

      setFormData((prev) => ({
        ...prev,
        itemDetails: updatedItemDetails,
        mrnId: selectedMrn.requisitionMasterId,
      }));
    }
  }, [selectedMrn, mins, refetchLocationInventories]);

  // Scroll to the top when submissionStatus changes (so the user sees the alert)
  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // -------------- Validation Helpers --------------

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {}
  ) => {
    let isFieldValid = true;
    let errorMessage = "";

    // Required‐field check
    if (value === null || value === undefined || `${value}`.trim() === "") {
      isFieldValid = false;
      errorMessage = `${fieldDisplayName} is required`;
    }

    // If still valid, run any extra validationFunction
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
    // Reset previous validation results
    setValidFields({});
    setValidationErrors({});

    const isStatusValid = validateField("status", "Status", formData.status);

    const isMrnIdValid = validateField(
      "mrnId",
      "Material requisition reference number",
      formData.mrnId
    );

    let isItemQuantityValid = true;
    let isItemBatchValid = true;

    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `issuedQuantity_${index}`;
      const fieldDisplayName = `Dispatched Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) => {
          const parsedValue = parseFloat(value);
          return (
            !isNaN(parsedValue) &&
            parsedValue > 0 &&
            parsedValue <= item.remainingQuantity
          );
        },
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to ${item.remainingQuantity}`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.issuedQuantity,
        additionalRules
      );

      //Validate Item Batch (Required)
      const batchFieldName = `batch_${index}`;
      const batchFieldDisplayName = `Batch for ${item.name}`;

      const isValidBatch = validateField(
        batchFieldName,
        batchFieldDisplayName,
        item.batchId
      );

      isItemBatchValid = isItemBatchValid && isValidBatch;

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return isStatusValid && isMrnIdValid && isItemQuantityValid && isItemBatchValid;
  };

  // -------------- Utility Functions --------------

  const generateReferenceNumber = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `MIN_${formattedDate}_${randomNumber}`;
  };

  // -------------- Handlers --------------

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const draftFlag = isSaveAsDraft ? 0 : 1;
      const combinedStatus = parseInt(`${formData.status}${draftFlag}`, 10);
      const currentDate = new Date().toISOString();

      const isFormValid = validateForm();
      if (!isFormValid) {
        return;
      }

      if (isSaveAsDraft) {
        setLoadingDraft(true);
      } else {
        setLoading(true);
      }

      const MinData = {
        requisitionMasterId: formData.mrnId,
        issueDate: currentDate,
        createdBy: sessionStorage?.getItem("username") ?? null,
        createdUserId: sessionStorage?.getItem("userId") ?? null,
        status: combinedStatus,
        approvedBy: null,
        approvedDate: null,
        companyId: sessionStorage?.getItem("companyId") ?? null,
        issueType: "MIN",
        referenceNumber: generateReferenceNumber(),
        approvedUserId: null,
        permissionId: 1061,
      };

      const response = await post_issue_master_api(MinData);
      const issueMasterId = response.data.result.issueMasterId;

      // Post each item detail
      const detailPromises = formData.itemDetails.map((item) => {
        const detailsData = {
          issueMasterId,
          itemMasterId: item.id,
          batchId: item.batchId,
          quantity: parseFloat(item.issuedQuantity),
          permissionId: 1061,
        };
        return post_issue_detail_api(detailsData);
      });

      const detailsResponses = await Promise.all(detailPromises);
      const allDetailsSuccessful = detailsResponses.every(
        (r) => r.status === 201
      );

      if (allDetailsSuccessful) {
        if (isSaveAsDraft) {
          setSubmissionStatus("successSavedAsDraft");
        } else {
          setSubmissionStatus("successSubmitted");
        }

        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
          onFormSubmit();
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setLoading(false);
        setLoadingDraft(false);
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

  const handleItemDetailsChange = (index, field, value) => {
    // 1) Update formData.itemDetails
    setFormData((prev) => {
      const updatedItemDetails = [...prev.itemDetails];
      updatedItemDetails[index][field] = value;
      return { ...prev, itemDetails: updatedItemDetails };
    });

    // 2) If user changed "issuedQuantity", run its validation immediately
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

  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      const updatedItemDetails = [...prev.itemDetails];
      updatedItemDetails.splice(index, 1);
      return { ...prev, itemDetails: updatedItemDetails };
    });

    // Clear any validation state for that item
    setValidFields((prev) => {
      const copy = { ...prev };
      delete copy[`issuedQuantity_${index}`];
      return copy;
    });
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[`issuedQuantity_${index}`];
      return copy;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMrnChange = (referenceId) => {
    const foundMrn = mrns.find((mrn) => mrn.referenceNumber === referenceId);
    setSelectedMrn(foundMrn);
    setFormData((prev) => ({
      ...prev,
      mrnId: foundMrn?.requisitionMasterId ?? "",
    }));
    refetchMins();
    refetchLocationInventories();
    setMrnSearchTerm("");
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption?.id,
    }));
  };

  const handleResetMrn = () => {
    setFormData((prev) => ({
      ...prev,
      mrnId: "",
      itemDetails: [],
    }));
    setSelectedMrn(null);
    setValidFields({});
    setValidationErrors({});
  };

  console.log("formData", formData);

  return {
    formData,
    validFields,
    validationErrors,
    selectedMrn,
    mrns: mrns || [],
    statusOptions,
    submissionStatus,
    alertRef,
    isLoading:
      isLoading ||
      isMinsLoading ||
      isItemBatchesLoading ||
      isLocationInventoriesLoading,
    isError: isError,
    mrnSearchTerm,
    loading,
    loadingDraft,
    locationInventories: locationInventories || [],
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleSubmit,
    handleMrnChange,
    handleStatusChange,
    setMrnSearchTerm,
    handleResetMrn,
  };
};

export default useMin;
