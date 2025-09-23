import { useState, useEffect, useRef } from "react";
import {
  get_requisition_masters_with_out_drafts_api,
  get_user_locations_by_user_id_api,
} from "../../services/purchaseApi";
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
  const [searchByMrn, setSearchByMrn] = useState(false);
  const [searchByWithoutMrn, setSearchByWithoutMrn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dummySearchTerm, setDummySearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const [noItembatchesError, setNoItembatchesError] = useState(false);

  // Reset search modes on component mount
  useEffect(() => {
    setSearchByMrn(false);
    setSearchByWithoutMrn(false);
  }, []);

  // Fetch items for search
  const fetchItems = async (companyId, searchQuery) => {
    if (!companyId) throw new Error("Company ID is required");
    const response = await get_item_masters_by_company_id_with_query_api(
      companyId,
      searchQuery,
      false
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
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchTerm),
    enabled: !!sessionStorage.getItem("companyId") && searchTerm.length > 0,
  });

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response?.data?.result?.filter(
        (loc) => loc.location.locationTypeId === 2
      );
    } catch (error) {
      console.error("Error fetching user locations:", error);
      return [];
    }
  };

  const { data: userLocations = [] } = useQuery({
    queryKey: ["userLocations", sessionStorage.getItem("userId")],
    queryFn: fetchUserLocations,
    enabled: !!sessionStorage.getItem("userId") && searchByWithoutMrn,
  });

  // Handle adding an item to itemDetails
  const handleAddDummyItem = (item) => {
    const exists = formData.itemDetails.find(
      (d) => d.id === (item.itemMasterId || item.id)
    );
    if (exists) {
      console.log("Item already exists in the list");
      return;
    }

    // For items added via search (without MRN), we need to get available batches from locationInventories
    const itemBatches = locationInventories?.filter(
      (batch) => batch.itemMasterId === (item.itemMasterId || item.id)
    );

    if (!itemBatches || itemBatches.length === 0) {
      console.log("No batches available for this item in selected location");
      setNoItembatchesError(true);
      setSearchTerm("");
      setDummySearchTerm("");
      setTimeout(() => setNoItembatchesError(false), 3500);
      return;
    }

    const defaultBatch = itemBatches?.[0] || { batchId: "", stockInHand: 0 };

    const newItem = {
      id: item.itemMasterId || item.id,
      name: item.itemMaster?.itemName || item.itemName,
      unit: item.itemMaster?.unit?.unitName || item.unit?.unitName || "Unit",
      //quantity: defaultBatch.stockInHand || 0,
      quantity: 0,
      remainingQuantity: 0,
      issuedQuantity: "",
      //batchId: defaultBatch.batchId || "",
      batchId: "",
    };

    setFormData((prev) => ({
      ...prev,
      itemDetails: [...prev.itemDetails, newItem],
    }));

    setSearchTerm("");
    setDummySearchTerm("");
  };

  // Fetch MRNs
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
      console.error("Error fetching MRNs:", error);
      return [];
    }
  };

  const {
    data: mrns,
    isLoading,
    isError,
    refetch: refetchMrns,
  } = useQuery({
    queryKey: ["mrns"],
    queryFn: fetchMrns,
  });

  // Fetch item batches
  const fetchItemBatches = async () => {
    try {
      const response = await get_item_batches_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching item batches:", error);
      return [];
    }
  };

  const {
    data: itemBatches,
    isLoading: isItemBatchesLoading,
    isError: isItemBatchesError,
  } = useQuery({
    queryKey: ["itemBatches"],
    queryFn: fetchItemBatches,
  });

  // Fetch location inventories
  const fetchLocationInventories = async (locationId) => {
    try {
      if (!locationId) return [];
      const response = await get_locations_inventories_by_location_id_api(
        locationId
      );
      console.log("Location inventories:", response.data.result);
      return response.data.result || [];
    } catch (error) {
      console.error(
        "Error fetching location inventories for location",
        locationId,
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
    queryKey: ["locationInventories", selectedLocationId],
    queryFn: () => fetchLocationInventories(selectedLocationId),
    enabled: !!selectedLocationId,
  });

  // Handle MRN selection and search without MRN
  useEffect(() => {
    try {
      if (selectedMrn) {
        setSelectedLocationId(selectedMrn?.requestedToLocationId);

        const updatedItemDetails = selectedMrn.requisitionDetails.map(
          (requestItem) => ({
            id: requestItem.itemMaster?.itemMasterId,
            name: requestItem.itemMaster?.itemName,
            unit: requestItem.itemMaster?.unit?.unitName || "Unit",
            quantity: requestItem.quantity || 0,
            remainingQuantity: 0,
            issuedQuantity: "",
            batchId: "",
          })
        );
        setFormData((prev) => ({
          ...prev,
          itemDetails: updatedItemDetails,
          mrnId: selectedMrn.requisitionMasterId,
        }));
      } else if (searchByWithoutMrn) {
        // Clear item details when switching to search without MRN mode
        setFormData((prev) => ({
          ...prev,
          itemDetails: [],
          mrnId: "",
        }));
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [selectedMrn, searchByWithoutMrn]);

  // Set default location when switching to "without MRN" mode
  useEffect(() => {
    if (
      searchByWithoutMrn &&
      userLocations?.length > 0 &&
      !selectedLocationId
    ) {
      console.log("Setting default location:", userLocations[0]);
      setSelectedLocationId(userLocations[0]?.locationId);
    }
  }, [searchByWithoutMrn, userLocations, selectedLocationId]);

  // Scroll to alert on submission status change
  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
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
    let isMrnIdValid = true;
    if (searchByMrn) {
      isMrnIdValid = validateField(
        "mrnId",
        "Material requisition reference number",
        formData.mrnId
      );
    }

    let isItemQuantityValid = true;
    let isBatchValid = true;

    formData.itemDetails.forEach((item, index) => {
      // Validate issued quantity
      const quantityFieldName = `issuedQuantity_${index}`;
      const quantityFieldDisplayName = `Dispatched Quantity for ${item.name}`;
      const quantityAdditionalRules = {
        validationFunction: (value) => {
          const parsedValue = parseFloat(value);
          return (
            !isNaN(parsedValue) &&
            parsedValue > 0 &&
            parsedValue <= item.remainingQuantity
          );
        },
        errorMessage: `${quantityFieldDisplayName} must be greater than 0 and less than or equal to remaining quantity ${item.remainingQuantity}`,
      };
      const isValidQuantity = validateField(
        quantityFieldName,
        quantityFieldDisplayName,
        item.issuedQuantity,
        quantityAdditionalRules
      );
      isItemQuantityValid = isItemQuantityValid && isValidQuantity;

      // Validate batch selection
      const batchFieldName = `batchId_${index}`;
      const batchFieldDisplayName = `Item Batch for ${item.name}`;
      const isValidBatch = validateField(
        batchFieldName,
        batchFieldDisplayName,
        item.batchId
      );
      isBatchValid = isBatchValid && isValidBatch;
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
      isMrnIdValid &&
      isItemQuantityValid &&
      isBatchValid &&
      isItemsPresent
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
    return `MIN_${formattedDate}_${randomNumber}`;
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

      const MinData = {
        requisitionMasterId:
          searchByMrn && formData.mrnId ? parseInt(formData.mrnId) : null,
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
        issuedLocationId: parseInt(selectedLocationId),
        permissionId: 1061,
        // toLocationId: searchByMrn
        //   ? parseInt(selectedMrn?.requestedToLocationId)
        //   : null,
      };

      const response = await post_issue_master_api(MinData);
      const issueMasterId = response.data.result.issueMasterId;

      const itemDetailsData = formData.itemDetails.map(async (item) => {
        const detailsData = {
          issueMasterId: issueMasterId,
          itemMasterId: item.id,
          batchId: item.batchId ? parseInt(item.batchId) : null,
          quantity: parseFloat(item.issuedQuantity),
          permissionId: 1061,
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
        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
          onFormSubmit();
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
        }, 3000);
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
        const selectedBatch = locationInventories?.find(
          (batch) =>
            batch.batchId === parseInt(value) &&
            batch.itemMasterId === updatedItemDetails[index].id
        );
        updatedItemDetails[index].batchId = value;
        updatedItemDetails[index].remainingQuantity =
          selectedBatch?.stockInHand ?? 0;
        updatedItemDetails[index].issuedQuantity = "";

        // Clear validation errors for this batch
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[`batchId_${index}`];
          return newErrors;
        });
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

    // Clean up validation states for removed item
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

  // Handle MRN selection
  const handleMrnChange = (referenceId) => {
    const foundMrn = mrns?.find((mrn) => mrn.referenceNumber === referenceId);
    setSelectedMrn(foundMrn);
    setFormData((prev) => ({
      ...prev,
      mrnId: foundMrn?.requisitionMasterId ?? "",
    }));
    setMrnSearchTerm("");
  };

  // Handle status change
  const handleStatusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption?.id,
    }));
  };

  // Reset MRN
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

  // Handle item selection from search
  const handleSearchItemSelect = (item) => {
    handleAddDummyItem(item);
    setSearchTerm("");
    setDummySearchTerm("");
  };

  // Handle location change for "without MRN" mode
  const handleLocationChange = (locationId) => {
    setSelectedLocationId(parseInt(locationId));
    // Clear existing items when location changes
    setFormData((prev) => ({
      ...prev,
      itemDetails: [],
    }));
  };

  // Handle mode change (MRN or without MRN)
  const handleModeChange = (mode) => {
    if (mode === "withoutMrn") {
      setSearchByWithoutMrn(true);
      setSearchByMrn(false);
    } else if (mode === "mrn") {
      setSearchByMrn(true);
      setSearchByWithoutMrn(false);
      setSelectedLocationId(null);
    }

    setFormData((prev) => ({
      ...prev,
      itemDetails: [],
      mrnId: "",
    }));
    setSelectedMrn(null);
    setDummySearchTerm("");
    setSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  };

  console.log("FormData: ", formData);
  console.log("locationInventories: ", locationInventories);

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
      isLoading || isItemBatchesLoading || isLocationInventoriesLoading,
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
    userLocations: userLocations || [],
    selectedLocationId,
    searchByMrn,
    searchByWithoutMrn,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    dummySearchTerm,
    noItembatchesError,
    setNoItembatchesError,
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleMrnChange,
    handleStatusChange,
    handleResetMrn,
    handleSubmit,
    handleInputChange,
    handleLocationChange,
    setMrnSearchTerm,
    setSearchByMrn,
    setSearchByWithoutMrn,
    setSearchTerm,
    handleAddDummyItem,
    setDummySearchTerm,
    handleSearchItemSelect,
    handleModeChange,
  };
};

export default useMin;
