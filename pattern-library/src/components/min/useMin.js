import { useState, useEffect, useRef } from "react";
import { get_requisition_masters_with_out_drafts_api } from "../../services/purchaseApi";
import {
  post_issue_master_api,
  post_issue_detail_api,
  get_issue_masters_by_requisition_master_id_api,
  get_item_batches_api,
  get_locations_inventories_by_location_id_api,
  post_location_inventory_goods_in_transit_api,
} from "../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

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

  const fetchMrns = async () => {
    try {
      const response = await get_requisition_masters_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );
      const filteredMrns = response.data.result?.filter(
        (rm) => rm.requisitionType === "MRN" && rm.status === 2
      );
      return filteredMrns || [];
    } catch (error) {
      console.error("Error fetching mrns:", error);
    }
  };

  const {
    data: mrns,
    isLoading,
    isError,
    error,
    refetch: refetchMrns,
  } = useQuery({
    queryKey: ["mrns"],
    queryFn: fetchMrns,
  });

  const fetchMinsByRequisitionMasterId = async (requisitionMasterId) => {
    try {
      const response = await get_issue_masters_by_requisition_master_id_api(
        requisitionMasterId
      );
      const filteredMins = response.data.result?.filter(
        (rm) => rm.issueType === "MIN"
      );

      if (!filteredMins) {
        return null;
      }

      return filteredMins;
    } catch (error) {
      console.error("Error fetching Mins:", error);
    }
  };

  const {
    data: mins,
    isLoading: isMinsLoading,
    isError: isMinsError,
    error: minError,
    refetch: refetchMins,
  } = useQuery({
    queryKey: ["mins", selectedMrn?.requisitionMasterId],
    queryFn: () =>
      fetchMinsByRequisitionMasterId(selectedMrn.requisitionMasterId),
  });

  const fetchItemBatches = async () => {
    try {
      const response = await get_item_batches_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching item batches:", error);
    }
  };

  const {
    data: itemBatches,
    isLoading: isItemBatchesLoading,
    isError: isItemBatchesError,
    error: ItemBatchesError,
    refetch: refetchItemBatches,
  } = useQuery({
    queryKey: ["itemBatches"],
    queryFn: fetchItemBatches,
  });

  const fetchLocationInventories = async () => {
    try {
      const response = await get_locations_inventories_by_location_id_api(
        selectedMrn?.requestedFromLocationId
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching user location inventories:", error);
    }
  };

  const {
    data: locationInventories,
    isLoading: isLocationInventoriesLoading,
    isError: isLocationInventoriesError,
    error: locationInventoriesError,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: ["locationInventories", selectedMrn?.requestedFromLocationId],
    queryFn: fetchLocationInventories,
    enabled: !!selectedMrn?.requestedFromLocationId,
  });

  useEffect(() => {
    if (selectedMrn?.requestedFromLocationId) {
      refetchLocationInventories();
    }
  }, [selectedMrn, refetchLocationInventories]);

  useEffect(() => {
    if (mins && selectedMrn) {
      const updatedItemDetails = selectedMrn.requisitionDetails
        .map((requestItem) => {
          const issuedQuantity = mins.reduce((total, min) => {
            const minDetail = min.issueDetails.find(
              (detail) =>
                detail.itemMasterId === requestItem.itemMaster?.itemMasterId
            );
            return total + (minDetail ? minDetail.quantity : 0);
          }, 0);

          const remainingQuantity = requestItem.quantity - issuedQuantity;

          return {
            id: requestItem.itemMaster?.itemMasterId,
            name: requestItem.itemMaster?.itemName,
            unit: requestItem.itemMaster?.unit.unitName,
            quantity: requestItem.quantity,
            remainingQuantity: Math.max(0, remainingQuantity),
            issuedQuantity: 0,
            batchId: "",
          };
        })
        .filter((item) => item.remainingQuantity > 0);

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else if (selectedMrn) {
      // If there are no existing Mins, show all items from the selected material requisition note
      const allItemDetails = selectedMrn.requisitionDetails.map(
        (requestItem) => ({
          id: requestItem.itemMaster?.itemMasterId,
          name: requestItem.itemMaster?.itemName,
          unit: requestItem.itemMaster?.unit.unitName,
          quantity: requestItem.quantity,
          remainingQuantity: requestItem.quantity, // Set remaining quantity same as requested quantity
          issuedQuantity: 0,
          batchId: "",
          // Other item properties...
        })
      );

      // Update form data with all items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: allItemDetails,
      }));
    }
  }, [mins, selectedMrn]);

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

  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isStatusValid = validateField("status", "Status", formData.status);

    const isMrnIdValid = validateField(
      "mrnId",
      "Material requisition reference number",
      formData.mrnId
    );

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `issuedQuantity_${index}`;
      const fieldDisplayName = `Dispatched Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.remainingQuantity,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to remaining quantity ${item.remainingQuantity}`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.issuedQuantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return isStatusValid && isMrnIdValid && isItemQuantityValid;
  };

  const generateReferenceNumber = () => {
    const currentDate = new Date();

    // Format the date as needed (e.g., YYYYMMDDHHMMSS)
    const formattedDate = currentDate
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);

    // Generate a random number (e.g., 4 digits)
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    // Combine the date and random number
    const referenceNumber = `MIN_${formattedDate}_${randomNumber}`;

    return referenceNumber;
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      const combinedStatus = parseInt(`${formData.status}${status}`, 10);

      const currentDate = new Date().toISOString();

      const isFormValid = validateForm();
      if (isFormValid) {
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

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            issueMasterId,
            itemMasterId: item.id,
            batchId: item.batchId,
            quantity: item.issuedQuantity,
            permissionId: 1061,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_issue_detail_api(detailsData);

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        if (allDetailsSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Material issue note saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log(
              "Material issue note submitted successfully!",
              formData
            );
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
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
        setLoadingDraft(false);
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      // Ensure positive values for Quantities
      updatedItemDetails[index].issuedQuantity = Math.max(
        0,
        updatedItemDetails[index].issuedQuantity
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  };

  const handleRemoveItem = (index) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    setValidFields({});
    setValidationErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMrnChange = (referenceId) => {
    const selectedMrn = mrns.find((mrn) => mrn.referenceNumber === referenceId);

    setSelectedMrn(selectedMrn);

    setFormData((prevFormData) => ({
      ...prevFormData,
      mrnId: selectedMrn?.requisitionMasterId ?? "",
    }));
    // Refetch Mins
    refetchMins();
    setMrnSearchTerm("");
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: selectedOption?.id,
    }));
  };

  const handleResetMrn = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      mrnId: "",
      itemDetails: [],
    }));

    setSelectedMrn(null);

    setValidFields({});
    setValidationErrors({});
  };

  return {
    formData,
    validFields,
    validationErrors,
    selectedMrn,
    mrns,
    statusOptions,
    submissionStatus,
    alertRef,
    isLoading,
    isError,
    mrnSearchTerm,
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
    handleMrnChange,
    handleStatusChange,
    setMrnSearchTerm,
    setSelectedMrn,
    handleResetMrn,
  };
};

export default useMin;
