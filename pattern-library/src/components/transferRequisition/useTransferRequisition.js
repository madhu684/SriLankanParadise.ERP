import { useState, useEffect, useRef } from "react";
import {
  get_company_locations_api,
  post_requisition_master_api,
  post_requisition_detail_api,
  get_user_locations_by_user_id_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
  get_Low_Stock_Items_for_location_api,
  get_unique_item_batch_ref,
} from "../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useTransferRequisition = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    deliveryLocation: "",
    deliveryLocationId: null,
    toWarehouseLocation: null,
    fromWarehouseLocation: null,
    itemDetails: [],
    attachments: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [trGenerating, setTRGenerating] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isTRGenerated, setIsTRGenerated] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchLocations = async () => {
    try {
      const response = await get_company_locations_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const {
    data: locations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user locations:", error);
    }
  };

  const {
    data: userLocations,
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", sessionStorage.getItem("userId")],
    queryFn: fetchUserLocations,
  });

  const userDepartments =
    userLocations?.filter(
      (location) => location?.location?.locationTypeId === 3
    ) || [];

  useEffect(() => {
    if (!isUserLocationsLoading && userLocations) {
      const departments = userLocations?.filter(
        (location) => location?.location?.locationTypeId === 3
      );

      console.log("User departments: ", departments);

      if (departments && departments.length === 1) {
        const department = departments[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          deliveryLocation: department?.location.locationName,
          deliveryLocationId: department?.locationId,
        }));
      } else if (departments && departments.length > 1) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          deliveryLocation: "",
          deliveryLocationId: "",
        }));
      }
    }
  }, [isUserLocationsLoading, userLocations]);

  const fetchItems = async (companyId, searchQuery) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        false
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchTerm),
  });

  const fetchUniqueItembatchRefs = async () => {
    try {
      const response = await get_unique_item_batch_ref(
        formData.toWarehouseLocation,
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching unique item batch refs:", error);
    }
  };

  const {
    data: uniqueItemBatchRefs = [],
    isLoading: isUniqueItemBatchRefsLoading,
    isError: isUniqueItemBatchRefsError,
    error: uniqueItemBatchRefsError,
  } = useQuery({
    queryKey: ["uniqueItemBatchRefs", formData.toWarehouseLocation],
    queryFn: fetchUniqueItembatchRefs,
    enabled: !!formData.toWarehouseLocation,
  });

  const fetchStockDetails = async (locationId, itemMasterId) => {
    try {
      const response =
        await get_sum_location_inventories_by_locationId_itemMasterId_api(
          itemMasterId,
          locationId
        );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching stock details:", error);
      return null;
    }
  };

  // Fixed useEffect to prevent unnecessary re-renders
  useEffect(() => {
    const updateStockDetails = async () => {
      if (
        formData.fromWarehouseLocation &&
        formData.toWarehouseLocation &&
        formData.itemDetails.length > 0 &&
        !isUpdatingStock
      ) {
        setIsUpdatingStock(true);
        setLoading(true);

        try {
          const updatedItemDetails = await Promise.all(
            formData.itemDetails.map(async (item) => {
              const fromStockDetails = await fetchStockDetails(
                formData.fromWarehouseLocation,
                item.id
              );
              const toStockDetails = await fetchStockDetails(
                formData.toWarehouseLocation,
                item.id
              );
              return {
                ...item,
                totalStockInHand: fromStockDetails?.totalStockInHand || 0,
                totalStockInHandTo: toStockDetails?.totalStockInHand || 0,
                reOrderLevel: fromStockDetails?.minReOrderLevel || 0,
                maxStockLevel: fromStockDetails?.maxStockLevel || 0,
              };
            })
          );

          setFormData((prevFormData) => ({
            ...prevFormData,
            itemDetails: updatedItemDetails,
          }));
        } catch (error) {
          console.error("Error updating stock details:", error);
        } finally {
          setLoading(false);
          setIsUpdatingStock(false);
        }
      }
    };

    updateStockDetails();
  }, [
    formData.fromWarehouseLocation,
    formData.toWarehouseLocation,
    formData.itemDetails.length,
  ]);

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

  const validateAttachments = (files) => {
    let isAttachmentsValid = true;
    let errorMessage = "";
    const maxSizeInBytes = 10 * 1024 * 1024;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!files || files.length === 0) {
      isAttachmentsValid = true;
      errorMessage = "";
    }

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        isAttachmentsValid = false;
        errorMessage = "Attachment size exceeds the limit (10MB)";
      }

      if (!allowedTypes.includes(file.type)) {
        isAttachmentsValid = false;
        errorMessage =
          "Invalid file type. Allowed types: JPEG, PNG, PDF, Word documents";
      }
    }

    setValidFields((prev) => ({ ...prev, attachments: isAttachmentsValid }));
    setValidationErrors((prev) => ({ ...prev, attachments: errorMessage }));

    return isAttachmentsValid;
  };

  const validateForm = (isSaveAsDraft) => {
    if (isSaveAsDraft) {
      setValidFields({});
      setValidationErrors({});

      const isDeliveryLocationValid = validateField(
        "deliveryLocation",
        "Delivery location",
        formData.deliveryLocation
      );

      const isAttachmentsValid = validateAttachments(formData.attachments);
      return isAttachmentsValid && isDeliveryLocationValid;
    }

    const isDeliveryLocationValid = validateField(
      "deliveryLocation",
      "Delivery location",
      formData.deliveryLocation
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    const isPurposeOfRequestValid = validateField(
      "purposeOfRequest",
      "Purpose of request",
      formData.purposeOfRequest
    );

    const isToWarehouseLocationValid = validateField(
      "toWarehouseLocation",
      "To warehouse location",
      formData.toWarehouseLocation
    );

    let isItemQuantityValid = true;
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 &&
          parseFloat(value) <= (item.totalStockInHandTo || Infinity),
        errorMessage: `${fieldDisplayName} must be greater than 0 and not exceed available stock (${
          item.totalStockInHandTo || 0
        })`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    const isFromWarehouseLocationValid = validateField(
      "fromWarehouseLocation",
      "From warehouse location",
      formData.fromWarehouseLocation
    );

    return (
      isDeliveryLocationValid &&
      isPurposeOfRequestValid &&
      isAttachmentsValid &&
      isToWarehouseLocationValid &&
      isItemQuantityValid &&
      isFromWarehouseLocationValid
    );
  };

  const generateReferenceNumber = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `TRN_${formattedDate}_${randomNumber}`;
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const requisitionDate = new Date().toISOString();
      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        setLoading(true);

        const transferRequisitionData = {
          requestedUserId: sessionStorage.getItem("userId"),
          requestedBy: sessionStorage.getItem("username"),
          requisitionDate: requisitionDate,
          purposeOfRequest: formData.purposeOfRequest,
          status: status,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage.getItem("companyId"),
          requisitionType: "TRN",
          requestedFromLocationId: formData.fromWarehouseLocation,
          requestedToLocationId: formData.toWarehouseLocation,
          referenceNumber: generateReferenceNumber(),
          permissionId: 1052,
        };

        const response = await post_requisition_master_api(
          transferRequisitionData
        );

        const requisitionMasterId = response.data.result.requisitionMasterId;

        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            requisitionMasterId,
            itemMasterId: item.id,
            quantity: item.quantity,
            permissionId: 1052,
          };

          const detailsApiResponse = await post_requisition_detail_api(
            detailsData
          );

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        if (allDetailsSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Transfer requisition saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log(
              "Transfer requisition submitted successfully!",
              formData
            );
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
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
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "toWarehouseLocation") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: [],
      }));
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleDepartmentChange = (departmentLocationId) => {
    const selectedDepartment = userDepartments.find(
      (dept) => dept.locationId === parseInt(departmentLocationId)
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      deliveryLocation: selectedDepartment?.location.locationName || "",
      deliveryLocationId: parseInt(departmentLocationId),
    }));
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      updatedItemDetails[index].quantity = Math.max(
        0,
        updatedItemDetails[index].quantity
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

  const handleAttachmentChange = (files) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  };

  const handleSelectItem = async (item, e) => {
    e.preventDefault();
    // Check if item already exists
    const itemExists = formData.itemDetails.some(
      (detail) => detail.id === item.itemMasterId
    );

    if (itemExists) {
      console.log("Item already exists in the list");
      setSearchTerm("");
      return;
    }

    let currentStockDetails = null;
    let toStockDetails = null;

    // Only fetch stock details if both warehouse locations are selected
    if (formData.fromWarehouseLocation) {
      currentStockDetails = await fetchStockDetails(
        formData.fromWarehouseLocation,
        item.itemMasterId
      );
    }

    if (formData.toWarehouseLocation) {
      toStockDetails = await fetchStockDetails(
        formData.toWarehouseLocation,
        item.itemMasterId
      );
    }

    const newItem = {
      id: item.itemMasterId,
      name: item.itemName,
      unit: item.unit.unitName,
      quantity: 0,
      totalStockInHand: currentStockDetails?.totalStockInHand || 0,
      totalStockInHandTo: toStockDetails?.totalStockInHand || 0,
      reOrderLevel: currentStockDetails?.minReOrderLevel || 0,
      maxStockLevel: currentStockDetails?.maxStockLevel || 0,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [...prevFormData.itemDetails, newItem],
    }));

    setSearchTerm("");
  };

  const handleGenerateTRN = async () => {
    try {
      setTRGenerating(true);
      setIsTRGenerated(true);
      const response = await get_Low_Stock_Items_for_location_api(
        formData.toWarehouseLocation
      );
      const lowStockItems = response.data.result || [];
      if (lowStockItems.length === 0) {
        setShowToast(true);
        setTimeout(() => {
          setTRGenerating(false);
          setIsTRGenerated(false);
          setShowToast(false);
        }, 5000);
        //setLoading(false);
        return;
      }

      if (lowStockItems.length > 0) {
        const newItemDetails = await Promise.all(
          lowStockItems.map(async (item) => {
            const fromStockDetails = await fetchStockDetails(
              formData.fromWarehouseLocation,
              item.itemMasterId
            );

            return {
              id: item.itemMasterId,
              name: item.itemMaster.itemName,
              //quantity: 0,
              quantity:
                fromStockDetails?.maxStockLevel -
                  fromStockDetails?.totalStockInHand >
                0
                  ? fromStockDetails?.maxStockLevel -
                      fromStockDetails?.totalStockInHand >
                    item.totalStockInHand
                    ? item.totalStockInHand
                    : fromStockDetails?.maxStockLevel -
                      fromStockDetails?.totalStockInHand
                  : 0,
              maxStockLevel: item.maxStockLevel || 0,
              minReOrderLevel: item.minReOrderLevel || 0,
              totalStockInHand: fromStockDetails?.totalStockInHand || 0,
              totalStockInHandTo: item.totalStockInHand || 0,
              unit: item.itemMaster.unit?.unitName || "",
            };
          })
        );

        setFormData((prevFormData) => ({
          ...prevFormData,
          itemDetails: newItemDetails,
        }));
      }
    } catch (error) {
      console.error("Error generating purchase order:", error);
    } finally {
      setTRGenerating(false);
    }
  };

  console.log("formData:", formData);

  return {
    formData,
    locations,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    isError,
    isLoading,
    error,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    loading: loading || isUpdatingStock,
    userLocations,
    userDepartments,
    showToast,
    isTRGenerated,
    trGenerating,
    uniqueItemBatchRefs,
    setShowToast,
    handleInputChange,
    handleDepartmentChange,
    handleItemDetailsChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    setFormData,
    setSearchTerm,
    handleSelectItem,
    handleGenerateTRN,
  };
};

export default useTransferRequisition;
