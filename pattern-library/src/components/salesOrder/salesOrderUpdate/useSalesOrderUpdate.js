import { useState, useEffect, useRef } from "react";
import {
  get_customers_by_company_id_api,
  put_sales_order_api,
  put_sales_order_detail_api,
  post_sales_order_detail_api,
  delete_sales_order_detail_api,
} from "../../../services/salesApi";

const useSalesOrderUpdate = ({ salesOrder, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    orderDate: "",
    deliveryDate: "",
    itemDetails: [],
    status: 0,
    attachments: [],
    totalAmount: 0,
    selectedCustomer: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [directOrder, setDirectOrder] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showCreateCustomerMoalInParent, setShowCreateCustomerModalInParent] =
    useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await get_customers_by_company_id_api(
          sessionStorage?.getItem("companyId")
        );
        setCustomers(response.data.result);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const deepCopySalesOrder = JSON.parse(JSON.stringify(salesOrder));
    setFormData({
      supplierId: deepCopySalesOrder?.supplierId ?? "",
      customerId: deepCopySalesOrder?.customerId ?? "",
      orderDate: deepCopySalesOrder?.orderDate?.split("T")[0] ?? "",
      deliveryDate: deepCopySalesOrder?.deliveryDate?.split("T")[0] ?? "",
      itemDetails: deepCopySalesOrder?.salesOrderDetails ?? [],
      attachments: deepCopySalesOrder?.attachments ?? [],
      totalAmount: deepCopySalesOrder?.totalAmount ?? "",
      selectedCustomer: deepCopySalesOrder?.customer ?? "",
    });
  }, [salesOrder]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount: calculateTotalAmount(),
    }));
  }, [formData.itemDetails]);

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
    let isCustomerValid = true;

    // Check customer validation only if it's not a direct order
    if (!directOrder) {
      isCustomerValid = validateField(
        "customerId",
        "Customer",
        formData.customerId
      );
    }

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
      isCustomerValid &&
      isOrderDateValid &&
      isDeliveryDateValid &&
      isAttachmentsValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const customerId = directOrder ? null : formData.customerId;
      const status = isSaveAsDraft ? 0 : 1;

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        const salesOrderData = {
          customerId: customerId,
          orderDate: formData.orderDate,
          deliveryDate: formData.deliveryDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: sessionStorage?.getItem("username") ?? null,
          createdUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          permissionId: 27,
        };

        const response = await put_sales_order_api(
          salesOrder.salesOrderId,
          salesOrderData
        );

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          let detailsApiResponse;
          const detailsData = {
            salesOrderId: salesOrder.salesOrderId,
            itemBatchItemMasterId: item.itemMasterId,
            itemBatchBatchId: item.itemBatchId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            permissionId: 27,
          };

          if (item.SalesOrderDetailId != null) {
            // Call put_slaes_Order_detail_api for each item
            detailsApiResponse = await put_sales_order_detail_api(
              item.salesOrderDetailId,
              detailsData
            );
          } else {
            // Call post_slaes_Order_detail_api for each item
            detailsApiResponse = await post_sales_order_detail_api(detailsData);
          }
          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201 || 200
        );

        for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
          const response = await delete_sales_order_detail_api(
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
            console.log("Sales order updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales order submitted successfully!", formData);
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

  const handleCustomerChange = (customerId) => {
    const selectedCustomerId = parseInt(customerId, 10);

    const selectedCustomer = customers.find(
      (customer) => customer.customerId === selectedCustomerId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId,
      selectedCustomer,
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
        totalAmount: calculateTotalAmount(),
      };
    });
  };

  const handleAddItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          itemMasterId: "",
          itemBatchId: "",
          name: "",
          quantity: 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index, salesOrderDetailId) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (salesOrderDetailId !== null && salesOrderDetailId !== undefined) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, salesOrderDetailId]);
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

  const calculateTotalAmount = () => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleShowCreateCustomerModal = () => {
    setShowCreateCustomerModal(true);
    setShowCreateCustomerModalInParent(true);
  };

  const handleCloseCreateCustomerModal = () => {
    setShowCreateCustomerModal(false);
    handleCloseCreateCustomerModalInParent();
  };

  const handleCloseCreateCustomerModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowCreateCustomerModalInParent(false);
    }, delay);
  };

  const handleAddCustomer = (responseData) => {
    setCustomers([...customers, responseData]);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: responseData,
      customerId: responseData.customerId,
    }));
  };

  return {
    formData,
    customers,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    showCreateCustomerModal,
    showCreateCustomerMoalInParent,
    directOrder,
    handleShowCreateCustomerModal,
    handleCloseCreateCustomerModal,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleCustomerChange,
    handleAddCustomer,
    setDirectOrder,
  };
};

export default useSalesOrderUpdate;
