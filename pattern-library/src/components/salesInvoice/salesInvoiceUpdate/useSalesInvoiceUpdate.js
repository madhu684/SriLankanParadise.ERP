import { useState, useEffect, useRef } from "react";
import {
  get_sales_orders_with_out_drafts_api,
  put_sales_invoice_api,
  put_sales_invoice_detail_api,
  post_sales_invoice_detail_api,
  delete_sales_invoice_detail_api,
} from "../../../services/salesApi";

const useSalesInvoiceUpdate = ({ salesInvoice, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    invoiceDate: "",
    dueDate: "",
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
    salesOrderId: "",
    referenceNo: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);
  const [salesOrderOptions, setSalesOrders] = useState([]);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);
  const [isLoadingSalesOrders, setIsLoadingSalesOrders] = useState(true);

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await get_sales_orders_with_out_drafts_api(
          sessionStorage?.getItem("companyId")
        );
        const filteredSalesOrders = response.data.result.filter(
          (si) => si.status === 2
        );
        setSalesOrders(filteredSalesOrders);
      } catch (error) {
        console.error("Error fetching slaes orders:", error);
      } finally {
        setIsLoadingSalesOrders(false);
      }
    };

    fetchSalesOrders();
  }, []);

  useEffect(() => {
    const deepCopySalesInvoice = JSON.parse(JSON.stringify(salesInvoice));
    setFormData({
      invoiceDate: deepCopySalesInvoice?.invoiceDate?.split("T")[0] ?? "",
      dueDate: deepCopySalesInvoice?.dueDate?.split("T")[0] ?? "",
      itemDetails: deepCopySalesInvoice?.salesInvoiceDetails ?? [],
      attachments: deepCopySalesInvoice?.attachments ?? [],
      totalAmount: deepCopySalesInvoice?.totalAmount ?? "",
      salesOrderId: deepCopySalesInvoice?.salesOrderId ?? "",
    });
  }, [salesInvoice]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    getRefernceNo();
  }, [isLoadingSalesOrders, salesOrderOptions]);

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
    const isInvoiceDateValid = validateField(
      "invoiceDate",
      "Invoice date",
      formData.invoiceDate
    );

    const isDueDateValid = validateField(
      "dueDate",
      "Due date",
      formData.dueDate
    );

    const isSalesOrderIdValid = validateField(
      "salesOrderId",
      "Sales order reference number",
      formData.salesOrderId
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    return (
      isInvoiceDateValid &&
      isDueDateValid &&
      isSalesOrderIdValid &&
      isAttachmentsValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        const salesInvoiceData = {
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: sessionStorage?.getItem("username") ?? null,
          createdUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          salesOrderId: formData.salesOrderId,
          amountDue: formData.totalAmount,
          permissionId: 31,
        };

        const response = await put_sales_invoice_api(
          salesInvoice.salesInvoiceId,
          salesInvoiceData
        );

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          let detailsApiResponse;
          const detailsData = {
            salesInvoiceId: salesInvoice.salesInvoiceId,
            itemBatchItemMasterId: item.itemMasterId,
            itemBatchBatchId: item.itemBatchId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            permissionId: 31,
          };

          if (item.salesInvoiceDetailId != null) {
            // Call put_sales_invoice_detail_api for each item
            detailsApiResponse = await put_sales_invoice_detail_api(
              item.salesInvoiceDetailId,
              detailsData
            );
          } else {
            // Call post_slaes_invocie_detail_api for each item
            detailsApiResponse = await post_sales_invoice_detail_api(
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
          const response = await delete_sales_invoice_detail_api(
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
            console.log("Sales invoice updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales invoice submitted successfully!", formData);
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
          quantity: 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index, salesInvoiceDetailId) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (salesInvoiceDetailId !== null && salesInvoiceDetailId !== undefined) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, salesInvoiceDetailId]);
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

  const handleSalesOrderChange = (referenceId) => {
    const selectedSalesOrder = salesOrderOptions.find(
      (salesOrder) => salesOrder.referenceNo === referenceId
    );
    setSelectedSalesOrder(selectedSalesOrder);

    setFormData((prevFormData) => ({
      ...prevFormData,
      salesOrderId: selectedSalesOrder?.salesOrderId ?? "",
      itemDetails: selectedSalesOrder?.salesOrderDetails ?? [],
      referenceNo: selectedSalesOrder?.referenceNo ?? "",
    }));
  };

  const getRefernceNo = () => {
    const selectedSalesOrder = salesOrderOptions.find(
      (salesOrder) => salesOrder.salesOrderId === salesInvoice.salesOrderId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      referenceNo: selectedSalesOrder?.referenceNo ?? "",
    }));
  };

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    salesOrderOptions,
    selectedSalesOrder,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleSalesOrderChange,
    getRefernceNo,
  };
};

export default useSalesInvoiceUpdate;
