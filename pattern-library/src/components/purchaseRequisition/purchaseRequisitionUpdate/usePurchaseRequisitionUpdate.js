import { useState, useEffect, useRef } from "react";
import {
  get_company_locations_api,
  put_purchase_requisition_api,
  put_purchase_requisition_detail_api,
  post_purchase_requisition_detail_api,
  delete_purchase_requisition_detail_api,
} from "../../../services/purchaseApi";

const usePurchaseRequisitionUpdate = ({
  purchaseRequisition,
  onFormSubmit,
}) => {
  const [formData, setFormData] = useState({
    PurchaseRequisitionId: "",
    requestorName: "",
    department: "",
    email: "",
    contactNumber: "",
    deliveryLocation: null,
    requisitionDate: "",
    purposeOfRequest: "",
    deliveryDate: "",
    referenceNumber: "",
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
  });
  const [locations, setLocations] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await get_company_locations_api(1);
        setLocations(response.data.result);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const deepCopyPurchaseRequisition = JSON.parse(
      JSON.stringify(purchaseRequisition)
    );
    setFormData({
      purchaseRequisitionId:
        deepCopyPurchaseRequisition?.purchaseRequisitionId ?? "",
      requestorName: deepCopyPurchaseRequisition?.requestedBy ?? "",
      department: deepCopyPurchaseRequisition?.department ?? "",
      email: deepCopyPurchaseRequisition?.email ?? "",
      contactNumber: deepCopyPurchaseRequisition?.contactNo ?? "",
      deliveryLocation: deepCopyPurchaseRequisition?.deliveryLocation ?? "",
      requisitionDate:
        deepCopyPurchaseRequisition?.requisitionDate?.split("T")[0] ?? "",
      purposeOfRequest: deepCopyPurchaseRequisition?.purposeOfRequest ?? "",
      deliveryDate:
        deepCopyPurchaseRequisition?.deliveryDate?.split("T")[0] ?? "",
      referenceNumber: deepCopyPurchaseRequisition?.referenceNo ?? "",
      itemDetails:
        deepCopyPurchaseRequisition?.purchaseRequisitionDetails ?? [],
      attachments: deepCopyPurchaseRequisition?.attachments ?? [],
      totalAmount: deepCopyPurchaseRequisition?.totalAmount ?? "",
    });
  }, [purchaseRequisition]);

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
      const isRequestorNameValid = validateField(
        "requestorName",
        "Requestor name",
        formData.requestorName
      );

      const isDepartmentValid = validateField(
        "department",
        "Department",
        formData.department
      );

      const isDeliveryLocationValid = validateField(
        "deliveryLocation",
        "Delivery location",
        formData.deliveryLocation
      );

      const isDeliveryDateValid = validateField(
        "deliveryDate",
        "Delivery date",
        formData.deliveryDate
      );

      const isRequisitionDateValid = validateField(
        "requisitionDate",
        "Requisition date",
        formData.requisitionDate
      );

      const isAttachmentsValid = validateAttachments(formData.attachments);
      return (
        isRequestorNameValid &&
        isDepartmentValid &&
        isDeliveryLocationValid &&
        isAttachmentsValid &&
        isDeliveryDateValid &&
        isRequisitionDateValid
      );
    }
    const isRequestorNameValid = validateField(
      "requestorName",
      "Requestor name",
      formData.requestorName
    );

    const isDeliveryLocationValid = validateField(
      "deliveryLocation",
      "Delivery location",
      formData.deliveryLocation
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    const isDepartmentValid = validateField(
      "department",
      "Department",
      formData.department
    );

    const isEmailValid = validateField("email", "Email", formData.email, {
      validationFunction: (value) => /\S+@\S+\.\S+/.test(value),
      errorMessage: "Please enter a valid email address",
    });

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

    const isPurposeOfRequestValid = validateField(
      "purposeOfRequest",
      "Purpose of request",
      formData.purposeOfRequest
    );

    const isDeliveryDateValid = validateField(
      "deliveryDate",
      "Delivery date",
      formData.deliveryDate
    );

    return (
      isRequestorNameValid &&
      isDepartmentValid &&
      isEmailValid &&
      isContactNumberValid &&
      isDeliveryLocationValid &&
      isRequisitionDateValid &&
      isPurposeOfRequestValid &&
      isDeliveryDateValid &&
      isAttachmentsValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        const purchaseRequisitionData = {
          requestedBy: formData.requestorName,
          RequestedUserId: sessionStorage.getItem("userId"),
          department: formData.department,
          email: formData.email,
          contactNo: formData.contactNumber,
          requisitionDate: formData.requisitionDate,
          purposeOfRequest: formData.purposeOfRequest,
          deliveryDate: formData.deliveryDate,
          deliveryLocation: formData.deliveryLocation,
          referenceNo: formData.referenceNumber,
          totalAmount: formData.totalAmount,
          status: status,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage.getItem("companyId"),
          permissionId: 16,
        };

        const response = await put_purchase_requisition_api(
          purchaseRequisition.purchaseRequisitionId,
          purchaseRequisitionData
        );

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          let detailsApiResponse;
          const detailsData = {
            purchaseRequisitionId: purchaseRequisition.purchaseRequisitionId,
            itemCategory: item.itemCategory,
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            permissionId: 16,
          };

          if (item.purchaseRequisitionDetailId != null) {
            // Call put_purchase_requisition_detail_api for each item
            detailsApiResponse = await put_purchase_requisition_detail_api(
              item.purchaseRequisitionDetailId,
              detailsData
            );
          } else {
            // Call post_purchase_requisition_detail_api for each item
            detailsApiResponse = await post_purchase_requisition_detail_api(
              detailsData
            );
          }
          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201 || 200
        );

        for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
          const response = await delete_purchase_requisition_detail_api(
            itemIdToBeDeleted
          );
          console.log(
            `Successfully deleted item with ID: ${itemIdToBeDeleted}`
          );
        }
        // Clear the itmeIdsToBeDeleted array after deletion
        setItemIdsToBeDeleted([]);

        if (allDetailsSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log(
              "Purchase requisition updated and saved as draft!",
              formData
            );
          } else {
            setSubmissionStatus("successSubmitted");
            console.log(
              "Purchase requisition submitted successfully!",
              formData
            );
          }

          setTimeout(() => {
            setSubmissionStatus(null);
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

  const handleAddItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          itemCategory: "",
          itemId: "",
          name: "",
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = async (index, purchaseRequisitionDetailId) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (
      purchaseRequisitionDetailId !== null &&
      purchaseRequisitionDetailId !== undefined
    ) {
      setItemIdsToBeDeleted((prevIds) => [
        ...prevIds,
        purchaseRequisitionDetailId,
      ]);
    }
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

  return {
    formData,
    locations,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalPrice,
  };
};

export default usePurchaseRequisitionUpdate;
