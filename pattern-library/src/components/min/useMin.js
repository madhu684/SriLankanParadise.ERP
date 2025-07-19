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
  const [searchByMrn, setSearchByMrn] = useState(true);
  const [searchByWithoutMrn, setSearchByWithoutMrn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dummySearchTerm, setDummySearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState();

  // Reset search modes on component mount
  useEffect(() => {
    setSearchByMrn(false);
    setSearchByWithoutMrn(false);
  }, []);

  // Compute filtered items for search without MRN
  const getFilteredItems = () => {
    return (locationInventories || []).filter((inv) =>
      inv?.itemMaster?.itemName
        ?.toLowerCase()
        ?.includes(dummySearchTerm.toLowerCase())
    );
  };

  // Fetch items for search
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

  // Handle adding an item to itemDetails
  const handleAddDummyItem = (item) => {
    const exists = formData.itemDetails.find(
      (d) => d.id === (item.itemMasterId || item.id)
    );
    if (exists) return;

    const itemBatches = locationInventories?.filter(
      (batch) => batch.itemMasterId === (item.itemMasterId || item.id)
    );
    const defaultBatch = itemBatches?.[0] || { batchId: "", stockInHand: 0 };

    const newItem = {
      id: item.itemMasterId || item.id,
      name: item.itemMaster?.itemName || item.itemName,
      unit: item.itemMaster?.unit?.unitName || item.unit?.unitName || "Unit",
      quantity: defaultBatch.stockInHand || 0,
      remainingQuantity: defaultBatch.stockInHand || "-",
      issuedQuantity: "",
      batchId: defaultBatch.batchId || "",
    };

    setFormData((prev) => ({
      ...prev,
      itemDetails: [...prev.itemDetails, newItem],
    }));
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

  // Fetch MINs by requisitionMasterId
  // const fetchMinsByRequisitionMasterId = async (requisitionMasterId) => {
  //   try {
  //     const response = await get_issue_masters_by_requisition_master_id_api(
  //       requisitionMasterId
  //     );
  //     const filteredMins = response.data.result?.filter(
  //       (rm) => rm.issueType === "MIN"
  //     );
  //     return filteredMins || null;
  //   } catch (error) {
  //     console.error("Error fetching MINs:", error);
  //     return null;
  //   }
  // };

  // const {
  //   data: mins,
  //   isLoading: isMinsLoading,
  //   refetch: refetchMins,
  // } = useQuery({
  //   queryKey: ["mins", selectedMrn?.requisitionMasterId],
  //   queryFn: () =>
  //     fetchMinsByRequisitionMasterId(selectedMrn?.requisitionMasterId),
  //   enabled: !!selectedMrn || !!selectedMrn?.requisitionMasterId,
  // });

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
      const response = await get_locations_inventories_by_location_id_api(
        locationId
      );
      console.log(
        "Fetched location inventories for location",
        locationId,
        ":",
        response.data.result
      );
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
    enabled:
      !!selectedLocationId &&
      (searchByWithoutMrn || !!selectedMrn?.requestedFromLocationId),
  });

  // Handle MRN selection and search without MRN
  useEffect(() => {
    try {
      if (selectedMrn) {
        setSelectedLocationId(selectedMrn?.requestedToLocationId);
        refetchLocationInventories();
        const updatedItemDetails = selectedMrn.requisitionDetails.map(
          (requestItem) => ({
            id: requestItem.itemMaster?.itemMasterId,
            name: requestItem.itemMaster?.itemName,
            unit: requestItem.itemMaster?.unit?.unitName || "Unit",
            quantity: requestItem.quantity || 0,
            remainingQuantity: "-",
            issuedQuantity: "",
            batchId: "",
          })
        );
        setFormData((prev) => ({
          ...prev,
          itemDetails: updatedItemDetails,
          mrnId: selectedMrn.requisitionMasterId,
        }));
      } else if (
        searchByWithoutMrn &&
        dummySearchTerm &&
        locationInventories &&
        !isLocationInventoriesLoading
      ) {
        const filteredItems = getFilteredItems();
        console.log("Populating from filtered items:", filteredItems);
        setFormData((prev) => ({
          ...prev,
          itemDetails: filteredItems.map((item) => ({
            id: item.itemMasterId,
            name: item.itemMaster?.itemName || "Unknown Item",
            unit: item.itemMaster?.unit?.unitName || "Unit",
            quantity: item.stockInHand || 0,
            remainingQuantity: item.stockInHand || "-",
            issuedQuantity: "",
            batchId: item.batchId || "",
          })),
          mrnId: "",
        }));
      } else if (searchByWithoutMrn && !dummySearchTerm) {
        setFormData((prev) => ({
          ...prev,
          itemDetails: [],
          mrnId: "",
        }));
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [
    selectedMrn,
    searchByWithoutMrn,
    dummySearchTerm,
    locationInventories,
    isLocationInventoriesLoading,
    refetchLocationInventories,
  ]);

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
    let isMrnIdValid = true;
    if (searchByMrn) {
      isMrnIdValid = validateField(
        "mrnId",
        "Material requisition reference number",
        formData.mrnId
      );
    }

    let isItemQuantityValid = true;
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

    const isItemsPresent = formData.itemDetails.length > 0;
    if (!isItemsPresent) {
      setValidationErrors((prev) => ({
        ...prev,
        itemDetails: "At least one item is required",
      }));
    }

    return (
      isStatusValid && isMrnIdValid && isItemQuantityValid && isItemsPresent
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
        permissionId: 1061,
        fromLocationId: parseInt(selectedLocationId) || 4,
        toLocationId: parseInt(selectedMrn?.requestedToLocationId) || 1,
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
      return copy;
    });
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[`issuedQuantity_${index}`];
      return copy;
    });
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle MRN selection
  const handleMrnChange = (referenceId) => {
    const foundMrn = mrns.find((mrn) => mrn.referenceNumber === referenceId);
    setSelectedMrn(foundMrn);
    setFormData((prev) => ({
      ...prev,
      mrnId: foundMrn?.requisitionMasterId ?? "",
    }));
    //refetchMins();
    refetchLocationInventories();
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
  };

  // Handle mode change (MRN or without MRN)
  const handleModeChange = (mode) => {
    console.log(
      "Mode changed to:",
      mode,
      "Setting selectedLocationId to:",
      sessionStorage.getItem("defaultLocationId") || "4"
    );
    setSearchByMrn(mode === "mrn");
    setSearchByWithoutMrn(mode === "withoutMrn");
    setFormData((prev) => ({
      ...prev,
      itemDetails: [],
      mrnId: "",
    }));
    setSelectedMrn(null);
    setDummySearchTerm("");
    if (mode === "withoutMrn") {
      setSelectedLocationId(sessionStorage.getItem("defaultLocationId") || "4");
      refetchLocationInventories();
    }
  };

  console.log("FormData: ", formData);
  console.log("Selected MRN: ", selectedMrn);
  console.log("Selected Location ID: ", selectedLocationId);

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
      //isMinsLoading ||
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
    dummySearchTerm,
    setDummySearchTerm,
    getFilteredItems,
    handleSearchItemSelect,
    handleModeChange,
  };
};

export default useMin;
