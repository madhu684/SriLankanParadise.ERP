import { useState, useEffect, useRef } from "react";
import {
  get_company_locations_api,
  post_purchase_requisition_api,
  post_purchase_requisition_detail_api,
  get_user_locations_by_user_id_api,
} from "../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseRequisition = ({ onFormSubmit }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    requestorName: "",
    department: "",
    departmentLocation: "",
    email: "",
    contactNumber: "",
    expectedDeliveryLocation: null,
    requisitionDate: currentDate,
    purposeOfRequest: "",
    expectedDeliveryDate: "",
    referenceNumber: "",
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

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

  const fetchItems = async (companyId, searchQuery, itemType) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        itemType
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
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "All"),
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount: calculateTotalPrice(),
    }));
  }, [formData.itemDetails]);

  useEffect(() => {
    if (!isUserLocationsLoading && userLocations) {
      const location = userLocations?.find(
        (location) => location?.location?.locationTypeId === 3
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        department: location?.location.locationName,
        departmentLocation: location?.locationId,
      }));
    }
  }, [isUserLocationsLoading, userLocations]);

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

  const validateAttachments = (files) => {
    let isAttachmentsValid = true;
    let errorMessage = "";
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!files || files.length === 0) {
      isAttachmentsValid = true; // Attachments are optional, so it's considered valid if there are none.
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
        "expectedDeliveryLocation",
        "Expected delivery location",
        formData.expectedDeliveryLocation
      );

      const isDeliveryDateValid = validateField(
        "expectedDeliveryDate",
        "Expected delivery date",
        formData.expectedDeliveryDate
      );

      const isRequisitionDateValid = validateField(
        "requisitionDate",
        "Requisition date",
        formData.requisitionDate
      );

      let isItemQuantityValid = true;
      // Validate item details
      formData.itemDetails.forEach((item, index) => {
        const fieldName = `quantity_${index}`;
        const fieldDisplayName = `Quantity for ${item.name}`;

        const additionalRules = {
          validationFunction: (value) => parseFloat(value) > 0,
          errorMessage: `${fieldDisplayName} must be greater than 0`,
        };

        const isValidQuantity = validateField(
          fieldName,
          fieldDisplayName,
          item.quantity,
          additionalRules
        );

        isItemQuantityValid = isItemQuantityValid && isValidQuantity;
      });

      const isAttachmentsValid = validateAttachments(formData.attachments);

      return (
        isDeliveryLocationValid &&
        isAttachmentsValid &&
        isDeliveryDateValid &&
        isRequisitionDateValid &&
        isItemQuantityValid
      );
    }

    setValidFields({});
    setValidationErrors({});

    const isDeliveryLocationValid = validateField(
      "expectedDeliveryLocation",
      "Expected delivery location",
      formData.expectedDeliveryLocation
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    const isEmailValid = formData.email
      ? validateField("email", "Email", formData.email, {
          validationFunction: (value) => /\S+@\S+\.\S+/.test(value),
          errorMessage: "Please enter a valid email address",
        })
      : true;

    const isContactNumberValid = validateField(
      "contactNumber",
      "Contact number",
      formData.contactNumber,
      {
        validationFunction: (value) => /^\d+$/.test(value),
        errorMessage: "Please enter a valid contact number",
      }
    );

    const isRequisitionDateValid = validateField(
      "requisitionDate",
      "Requisition date",
      formData.requisitionDate
    );

    const isDeliveryDateValid = validateField(
      "expectedDeliveryDate",
      "Expected delivery date",
      formData.expectedDeliveryDate
    );

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `${fieldDisplayName} must be greater than 0`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return (
      isEmailValid &&
      isContactNumberValid &&
      isDeliveryLocationValid &&
      isRequisitionDateValid &&
      isDeliveryDateValid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      // Get the current date and time in UTC timezone in the specified format
      const createdDate = new Date().toISOString();

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const purchaseRequisitionData = {
          requestedBy: formData.requestorName,
          requestedUserId: sessionStorage.getItem("userId"),
          department: formData.departmentLocation,
          email: formData.email,
          contactNo: formData.contactNumber,
          requisitionDate: formData.requisitionDate,
          purposeOfRequest: formData.purposeOfRequest,
          expectedDeliveryDate: formData.expectedDeliveryDate,
          expectedDeliveryLocation: formData.expectedDeliveryLocation,
          referenceNo: formData.referenceNumber,
          totalAmount: formData.totalAmount,
          status: status,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage.getItem("companyId"),
          createdDate: createdDate,
          lastUpdatedDate: createdDate,
          permissionId: 9,
        };

        const response = await post_purchase_requisition_api(
          purchaseRequisitionData
        );

        const purchaseRequisitionId =
          response.data.result.purchaseRequisitionId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            purchaseRequisitionId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemMasterId: item.id,
            permissionId: 9,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_purchase_requisition_detail_api(
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
            console.log("Purchase requisition saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log(
              "Purchase requisition submitted successfully!",
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

      // Ensure positive values for Quantities and Unit Prices
      updatedItemDetails[index].quantity = Math.max(
        0,
        updatedItemDetails[index].quantity
      );

      updatedItemDetails[index].unitPrice = !isNaN(
        parseFloat(updatedItemDetails[index].unitPrice)
      )
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      updatedItemDetails[index].totalPrice =
        updatedItemDetails[index].quantity *
        updatedItemDetails[index].unitPrice;
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        totalAmount: calculateTotalPrice(),
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

  const calculateTotalPrice = () => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          quantity: 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
        },
      ],
    }));
    setSearchTerm(""); // Clear the search term
  };

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
    loading,
    loadingDraft,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleSelectItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalPrice,
    setSearchTerm,
  };
};

export default usePurchaseRequisition;
