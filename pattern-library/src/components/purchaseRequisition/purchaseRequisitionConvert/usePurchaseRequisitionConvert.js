import { useState, useEffect, useRef } from "react";
import {
  get_company_suppliers_api,
  post_purchase_order_api,
  post_purchase_order_detail_api,
  put_purchase_requisition_api,
} from "../../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseRequisitionConvert = ({
  onFormSubmit,
  purchaseRequisition,
}) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: currentDate,
    itemDetails: [],
    status: 0,
    remark: "",
    attachments: [],
    totalAmount: 0,
    selectedSupplier: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [referenceNo, setReferenceNo] = useState(null);
  const alertRef = useRef(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false);
  const [showCreateSupplierMoalInParent, setShowCreateSupplierModalInParent] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const {
    data: suppliers,
    isLoading,
    isError,
    error,
    refetch: refetchSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    const deepCopyPurchaseRequisition = JSON.parse(
      JSON.stringify(purchaseRequisition)
    );
    setFormData({
      itemDetails:
        deepCopyPurchaseRequisition?.purchaseRequisitionDetails ?? [],
      attachments: deepCopyPurchaseRequisition?.attachments ?? [],
      totalAmount: deepCopyPurchaseRequisition?.totalAmount ?? "",
      supplierId: "",
      orderDate: currentDate,
      deliveryDate: "",
      status: 0,
      remark: "",
      selectedSupplier: "",
    });
  }, [purchaseRequisition]);

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

  const validateForm = () => {
    const isSupplierValid = validateField(
      "supplierId",
      "Supplier",
      formData.supplierId
    );

    const isOrderDateValid = validateField(
      "orderDate",
      "Order date",
      formData.orderDate
    );

    const isDeliveryDateValid = validateField(
      "deliveryDate",
      "Delivery date",
      formData.deliveryDate
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    return (
      isSupplierValid &&
      isOrderDateValid &&
      isDeliveryDateValid &&
      isAttachmentsValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();
      if (isFormValid) {
        const purchaseOrderData = {
          supplierId: formData.supplierId,
          orderDate: formData.orderDate,
          deliveryDate: formData.deliveryDate,
          totalAmount: formData.totalAmount,
          status: status,
          remark: formData.remark,
          orderedBy: sessionStorage?.getItem("username") ?? null,
          approvedBy: null,
          approvedDate: null,
          orderedUserId: sessionStorage?.getItem("userId") ?? null,
          approvedUserId: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          permissionId: 11,
        };

        const response = await post_purchase_order_api(purchaseOrderData);

        setReferenceNo(response.data.result.referenceNo);

        const purchaseOrderId = response.data.result.purchaseOrderId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            purchaseOrderId,
            itemCategory: item.itemCategory,
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            permissionId: 11,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_purchase_order_detail_api(
            detailsData
          );

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        // Update the purchase requisition status
        const purchaseRequisitionData = {
          requestedBy: purchaseRequisition.requestedBy,
          requestedUserId: purchaseRequisition.requestedUserId,
          department: purchaseRequisition.department,
          email: purchaseRequisition.email,
          contactNo: purchaseRequisition.contactNo,
          requisitionDate:
            purchaseRequisition?.requisitionDate?.split("T")[0] ?? "",
          purposeOfRequest: purchaseRequisition.purposeOfRequest,
          deliveryDate: purchaseRequisition?.deliveryDate?.split("T")[0] ?? "",
          deliveryLocation: purchaseRequisition.deliveryLocation,
          referenceNo: purchaseRequisition.referenceNo,
          totalAmount: purchaseRequisition.totalAmount,
          status: 4,
          approvedBy: purchaseRequisition.approvedBy,
          approvedUserId: purchaseRequisition.approvedUserId,
          approvedDate: purchaseRequisition?.approvedDate?.split("T")[0] ?? "",
          companyId: purchaseRequisition.companyId,
          permissionId: 16,
        };

        const putResponse = await put_purchase_requisition_api(
          purchaseRequisition.purchaseRequisitionId,
          purchaseRequisitionData
        );

        if (allDetailsSuccessful && putResponse.status === 200) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log(
              "Purchase requisition converted and saved as draft!",
              formData
            );
          } else {
            setSubmissionStatus("successSubmitted");
            console.log(
              "Purchase requisition converted successfully!",
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
      console.error("Error converting purchase requisition:", error);
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

  const handleSupplierChange = (supplierId) => {
    const SelectedSupplierId = parseInt(supplierId, 10);

    const selectedSupplier = suppliers.find(
      (supplier) => supplier.supplierId === SelectedSupplierId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId,
      selectedSupplier,
    }));
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

  const calculateTotalAmount = () => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleSelectSupplier = (selectedSupplier) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier.supplierId,
      selectedSupplier: selectedSupplier,
    }));
    setSupplierSearchTerm(""); // Clear the supplier search term
    setValidFields({});
    setValidationErrors({});
  };

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: "",
      supplierId: "",
    }));
  };

  const handleShowCreateSupplierModal = () => {
    setShowCreateSupplierModal(true);
    setShowCreateSupplierModalInParent(true);
  };

  const handleCloseCreateSupplierModal = () => {
    setShowCreateSupplierModal(false);
    handleCloseCreateSupplierModalInParent();
  };

  const handleCloseCreateSupplierModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowCreateSupplierModalInParent(false);
    }, delay);
  };

  const handleAddSupplier = (responseData) => {
    handleSelectSupplier(responseData);
    refetchSuppliers();
  };

  return {
    formData,
    suppliers,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    isLoading,
    isError,
    error,
    supplierSearchTerm,
    showCreateSupplierMoalInParent,
    showCreateSupplierModal,
    handleInputChange,
    handleSupplierChange,
    handleAttachmentChange,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
    setSupplierSearchTerm,
    handleSelectSupplier,
    handleResetSupplier,
    handleCloseCreateSupplierModal,
    handleAddSupplier,
    handleShowCreateSupplierModal,
  };
};

export default usePurchaseRequisitionConvert;
