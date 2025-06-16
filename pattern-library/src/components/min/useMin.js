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
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
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

  //==============

  const [searchByMrn, setSearchByMrn] = useState(true);
  const [searchByWithoutMrn, setSearchByWithoutMrn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = async (companyId, searchQuery, itemType) => {
    if (!companyId) throw new Error("Company ID is required");
    const response = await get_item_masters_by_company_id_with_query_api(
      companyId,
      searchQuery,
      itemType
    );
    if (!response.data.result) throw new Error("No items found");
    return response.data.result;
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "All"),
    enabled: !!sessionStorage.getItem("companyId") && searchTerm.length > 0,
  });

  const handleAddDummyItem = (item) => {
    const exists = formData.itemDetails.find(
      (d) => d.id === item.itemMasterId || d.id === item.id
    );
    if (exists) return;

    const newItem = {
      id: item.itemMasterId || item.id,
      name: item.itemMaster?.itemName || item.itemName,
      unit: item.itemMaster?.unit?.unitName || "Unit",
      quantity: 0,
      remainingQuantity: item.stockInHand || 0,
      issuedQuantity: "",
      batchId: item.batchId || "",
    };

    handleInputChange("itemDetails", [...formData.itemDetails, newItem]);
  };

  //=============

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
  } = useQuery({
    queryKey: ["itemBatches"],
    queryFn: () =>
      get_item_batches_api(sessionStorage?.getItem("companyId")).then(
        (response) => response.data.result
      ),
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

  useEffect(() => {
    if (selectedMrn?.requestedFromLocationId) {
      refetchLocationInventories();
    }
  }, [selectedMrn, refetchLocationInventories]);

  useEffect(() => {
    if (selectedMrn) {
      refetchLocationInventories();

      const updatedItemDetails = selectedMrn.requisitionDetails.map(
        (requestItem) => {
          return {
            id: requestItem.itemMaster?.itemMasterId,
            name: requestItem.itemMaster?.itemName,
            unit: requestItem.itemMaster?.unit.unitName,
            quantity: requestItem.quantity,
            remainingQuantity: "-",
            issuedQuantity: "",
            batchId: "",
          };
        }
      );

      setFormData((prev) => ({
        ...prev,
        itemDetails: updatedItemDetails,
        mrnId: selectedMrn.requisitionMasterId,
      }));
    }
  }, [selectedMrn, mins, refetchLocationInventories]);

  useEffect(() => {
    if (submissionStatus != null) {
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
            issueMasterId: issueMasterId,
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

  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      const updatedItemDetails = [...prev.itemDetails];
      updatedItemDetails.splice(index, 1);
      return { ...prev, itemDetails: updatedItemDetails };
    });
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
    isError,
    mrnSearchTerm,
    loading,
    loadingDraft,
    itemBatches,
    isItemBatchesLoading,
    isItemBatchesError,
    isLocationInventoriesLoading,
    isLocationInventoriesError,
    locationInventories: locationInventories || [],
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleMrnChange,
    handleStatusChange,
    handleResetMrn,
    handleSubmit,
    handleInputChange,
    setMrnSearchTerm,

    setSearchByMrn,
    setSearchByWithoutMrn,
    searchByMrn,
    searchByWithoutMrn,
    searchTerm,
    setSearchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    handleAddDummyItem,
  };
};

export default useMin;
