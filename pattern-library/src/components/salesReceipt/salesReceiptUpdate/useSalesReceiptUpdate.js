import { useState, useEffect, useRef } from "react";
import {
  get_sales_invoices_with_out_drafts_api,
  get_payment_modes_api,
  put_sales_receipt_api,
  put_sales_receipt_sales_invoice_api,
  post_sales_receipt_sales_invoice_api,
  put_sales_invoice_api,
  delete_sales_receipt_sales_invoice_api,
} from "../../../services/salesApi";
import SalesReceipt from "../salesReceipt";
import { useQuery } from "@tanstack/react-query";

const useSalesReceiptUpdate = ({ salesReceipt, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    receiptDate: "",
    referenceNo: "",
    paymentModeId: "",
    attachments: [],
    salesInvoiceId: "",
    salesInvoiceIds: [],
    salesInvoiceReferenceNumbers: [],
    selectedSalesInvoices: [],
    totalAmountReceived: 0,
    salesReceiptSalesInvoices: [],
    excessAmount: 0,
    shortAmount: 0,
    totalAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);
  const [isLoadingSalesOrders, setIsLoadingSalesOrders] = useState(true);
  const [showPaymentRemovalConfirmation, setShowPaymentRemovalConfirmation] =
    useState(false);
  const [selectedInvoiceIdToRemove, setSelectedInvoiceIdToRemove] =
    useState(null);
  const [selectedInvoiceIdToFilter, setSelectedInvoiceIdToFilter] =
    useState(null);
  const [siSearchTerm, setSiSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const fetchsalesInvoices = async () => {
    try {
      const response = await get_sales_invoices_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );

      const filteredsalesInvoices = response.data.result.filter(
        (sr) => sr.status === 2 || sr.status === 5
      );
      return filteredsalesInvoices;
    } catch (error) {
      console.error("Error fetching slaes invoices:", error);
    }
  };

  const {
    data: salesInvoiceOptions,
    isLoading: isSalesInvoiceOptionsLoading,
    isError: isSalesInvoiceOptionsError,
    error: salesInvoiceOptionsError,
  } = useQuery({
    queryKey: ["salesInvoiceOptions"],
    queryFn: fetchsalesInvoices,
  });

  const fetchPaymentModes = async () => {
    try {
      const response = await get_payment_modes_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching payment modes:", error);
    }
  };

  const {
    data: paymentModes,
    isLoading: isPaymentModesLoading,
    isError: isPaymentModesError,
    error: paymentModesError,
  } = useQuery({
    queryKey: ["paymentModes"],
    queryFn: fetchPaymentModes,
  });

  useEffect(() => {
    const deepCopySalesReceipt = JSON.parse(JSON.stringify(salesReceipt));

    // Initialize arrays to store sales invoice data
    const salesInvoiceIds = [];
    const salesInvoiceReferenceNumbers = [];
    const selectedSalesInvoices = [];

    // Iterate through each sales receipt sales invoice and extract relevant data
    deepCopySalesReceipt.salesReceiptSalesInvoices.forEach((salesInvoice) => {
      salesInvoiceIds.push(salesInvoice.salesInvoiceId);
      salesInvoiceReferenceNumbers.push(salesInvoice.salesInvoice.referenceNo);

      // Extract other relevant data if needed for selected sales invoices
      selectedSalesInvoices.push({
        salesInvoiceId: salesInvoice.salesInvoice.salesInvoiceId,
        invoiceDate: salesInvoice.salesInvoice.invoiceDate,
        dueDate: salesInvoice.salesInvoice.dueDate,
        totalAmount: salesInvoice.salesInvoice.totalAmount,
        status: salesInvoice.salesInvoice.status,
        createdBy: salesInvoice.salesInvoice.createdBy,
        createdUserId: salesInvoice.salesInvoice.createdUserId,
        approvedBy: salesInvoice.salesInvoice.approvedBy,
        approvedUserId: salesInvoice.salesInvoice.approvedUserId,
        approvedDate: salesInvoice.salesInvoice.approvedDate,
        companyId: salesInvoice.salesInvoice.companyId,
        salesOrderId: salesInvoice.salesInvoice.salesOrderId,
        referenceNo: salesInvoice.salesInvoice.referenceNo,
        amountDue:
          salesInvoice.salesInvoice.amountDue + salesInvoice.settledAmount,
        payment:
          salesInvoice.settledAmount +
          salesInvoice.customerBalance +
          salesInvoice.excessAmount -
          salesInvoice.shortAmount,
        updatedAmountDue: salesInvoice.salesInvoice.amountDue,
        salesReceiptSalesInvoiceId: salesInvoice.salesReceiptSalesInvoiceId,
        excessAmount: salesInvoice.excessAmount,
        shortAmount: salesInvoice.shortAmount,
        customerBalance: salesInvoice.customerBalance,
      });
    });

    setFormData({
      receiptDate: deepCopySalesReceipt?.receiptDate?.split("T")[0] ?? "",
      referenceNo: deepCopySalesReceipt?.referenceNo ?? "",
      paymentModeId: deepCopySalesReceipt?.paymentModeId ?? "",
      attachments: deepCopySalesReceipt?.attachments ?? [],
      totalAmountReceived: deepCopySalesReceipt?.amountReceived ?? "",
      salesInvoiceId: "",
      salesInvoiceIds: salesInvoiceIds,
      salesInvoiceReferenceNumbers: salesInvoiceReferenceNumbers,
      selectedSalesInvoices: selectedSalesInvoices,
      salesReceiptSalesInvoices:
        deepCopySalesReceipt?.salesReceiptSalesInvoices ?? [],
      excessAmount: deepCopySalesReceipt?.excessAmount ?? "",
      shortAmount: deepCopySalesReceipt?.shortAmount ?? "",
      totalAmount: deepCopySalesReceipt?.totalAmount ?? "",
    });
  }, [salesReceipt]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmountReceived: calculateTotalAmountReceived(),
      totalAmount: calculateTotalAmount(),
    }));
  }, [
    formData.selectedSalesInvoices,
    formData.excessAmount,
    formData.shortAmount,
  ]);

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
    const isReceiptDateValid = validateField(
      "receiptDate",
      "Receipt date",
      formData.receiptDate
    );

    const isPaymentModeIdValid = validateField(
      "paymentModeId",
      "Payment mode",
      formData.paymentModeId
    );

    const isSalesInvoiceIdValid = validateField(
      "salesInvoiceId",
      "Sales invoice reference number",
      formData.salesInvoiceIds
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    // Validate each payment value
    let isPaymentValid = true;
    formData.selectedSalesInvoices.forEach((invoice, index) => {
      const paymentFieldName = `payment_${index}`;
      const paymentDisplayName = `Payment for ${invoice.referenceNo}`;

      // Define additional rules for payment validation
      const additionalRules = {
        validationFunction: (value) => parseFloat(value) > 0, // Check if payment is greater than 0
        errorMessage: `Payment for ${invoice.referenceNo} must be greater than 0`,
      };

      // Call validateField for each payment value
      const isValidPayment = validateField(
        paymentFieldName,
        paymentDisplayName,
        invoice.payment,
        additionalRules
      );

      // Update isPaymentValid based on the validation result
      isPaymentValid = isPaymentValid && isValidPayment;
    });

    return (
      isReceiptDateValid &&
      isPaymentModeIdValid &&
      isSalesInvoiceIdValid &&
      isAttachmentsValid &&
      isPaymentValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const currentDate = new Date().toISOString();

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const SalesReceiptData = {
          receiptDate: formData.receiptDate,
          amountReceived: formData.totalAmount,
          paymentReferenceNo: formData.referenceNo,
          companyId: salesReceipt.companyId,
          paymentModeId: formData.paymentModeId,
          createdBy: salesReceipt.createdBy,
          createdUserId: salesReceipt.createdUserId,
          status: status,
          excessAmount: formData.excessAmount,
          shortAmount: formData.shortAmount,
          createdDate: salesReceipt.createdDate,
          lastUpdatedDate: currentDate,
          referenceNumber: salesReceipt.referenceNumber,
          permissionId: 1033,
        };

        const response = await put_sales_receipt_api(
          salesReceipt.salesReceiptId,
          SalesReceiptData
        );

        // Extract itemDetails from formData
        const selectedSalesInvoicesData = formData.selectedSalesInvoices.map(
          async (item) => {
            let detailsApiResponse;
            const salesReceiptSalesInvoiceData = {
              salesReceiptId: salesReceipt.salesReceiptId,
              salesInvoiceId: item.salesInvoiceId,
              settledAmount:
                item.payment -
                item.excessAmount +
                item.shortAmount -
                item.customerBalance,
              excessAmount: item.excessAmount,
              shortAmount: item.shortAmount,
              customerBalance: item.customerBalance,
              permissionId: 1033,
            };

            if (item.salesReceiptSalesInvoiceId != null) {
              // Call put_sales_invoice_detail_api for each item
              detailsApiResponse = await put_sales_receipt_sales_invoice_api(
                item.salesReceiptSalesInvoiceId,
                salesReceiptSalesInvoiceData
              );
            } else {
              // Call post_slaes_invocie_detail_api for each item
              detailsApiResponse = await post_sales_receipt_sales_invoice_api(
                salesReceiptSalesInvoiceData
              );
            }

            const siStatus = item.updatedAmountDue === 0 ? 5 : 2;

            const salesInvoiceData = {
              invoiceDate: item.invoiceDate,
              dueDate: item.dueDate,
              totalAmount: item.totalAmount,
              status: siStatus,
              createdBy: item.createdBy,
              createdUserId: item.createdUserId,
              approvedBy: item.approvedBy,
              approvedUserId: item.approvedUserId,
              approvedDate: item.approvedDate,
              companyId: item.companyId,
              salesOrderId: item.salesOrderId,
              amountDue: item.updatedAmountDue,
              permissionId: 31,
            };

            const putResponse = await put_sales_invoice_api(
              item.salesInvoiceId,
              salesInvoiceData
            );

            return detailsApiResponse;
          }
        );

        const detailsResponses = await Promise.all(selectedSalesInvoicesData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201 || 200
        );

        for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
          const response = await delete_sales_receipt_sales_invoice_api(
            itemIdToBeDeleted
          );

          const selectedSalesReceiptSalesInvoice =
            formData.salesReceiptSalesInvoices.find(
              (salesReceiptSalesInvoice) =>
                salesReceiptSalesInvoice.salesReceiptSalesInvoiceId ===
                itemIdToBeDeleted
            );

          const salesInvoiceToBeUpdated =
            selectedSalesReceiptSalesInvoice.salesInvoice;

          const salesInvoiceData = {
            invoiceDate: salesInvoiceToBeUpdated.invoiceDate,
            dueDate: salesInvoiceToBeUpdated.dueDate,
            totalAmount: salesInvoiceToBeUpdated.totalAmount,
            status: salesInvoiceToBeUpdated.status,
            createdBy: salesInvoiceToBeUpdated.createdBy,
            createdUserId: salesInvoiceToBeUpdated.createdUserId,
            approvedBy: salesInvoiceToBeUpdated.approvedBy,
            approvedUserId: salesInvoiceToBeUpdated.approvedUserId,
            approvedDate: salesInvoiceToBeUpdated.approvedDate,
            companyId: salesInvoiceToBeUpdated.companyId,
            salesOrderId: salesInvoiceToBeUpdated.salesOrderId,
            amountDue:
              salesInvoiceToBeUpdated.amountDue +
              selectedSalesReceiptSalesInvoice.settledAmount,
            permissionId: 31,
          };

          const putResponse = await put_sales_invoice_api(
            salesInvoiceToBeUpdated.salesInvoiceId,
            salesInvoiceData
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
            console.log("Sales receipt updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales receipt updated successfully!", formData);
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
      const updatedSelectedSalesInvoices = [
        ...prevFormData.selectedSalesInvoices,
      ];
      const currentItem = updatedSelectedSalesInvoices[index];

      // Update the field value
      currentItem[field] = value;

      // Calculate updated amount due
      currentItem.updatedAmountDue =
        currentItem.amountDue -
        currentItem.payment +
        currentItem.excessAmount -
        currentItem.shortAmount;

      // Calculate customer balance
      const customerBalance = currentItem.payment - currentItem.amountDue;

      // Check if customer balance is negative (indicating credit)
      if (customerBalance < 0) {
        if (field === "shortAmount") {
          // Ensure shortAmount does not exceed the positive customerBalance
          currentItem.shortAmount = Math.min(value, -customerBalance);
        }
        if (field === "excessAmount") {
          currentItem.excessAmount = 0;
        }
      } else {
        if (field === "excessAmount") {
          // Ensure excessAmount does not exceed the positive customerBalance
          currentItem.excessAmount = Math.min(value, customerBalance);
        }
        if (field === "shortAmount") {
          currentItem.shortAmount = 0;
        }
      }

      if (field === "payment") {
        currentItem.excessAmount = 0;
        currentItem.shortAmount = 0;
      }

      // Recalculate updatedAmountDue
      currentItem.updatedAmountDue =
        currentItem.amountDue -
        currentItem.payment +
        currentItem.excessAmount -
        currentItem.shortAmount;

      if (currentItem.updatedAmountDue < 0) {
        currentItem.updatedAmountDue = 0;
      }

      currentItem.customerBalance =
        currentItem.payment -
        currentItem.amountDue +
        currentItem.shortAmount -
        currentItem.excessAmount;

      if (currentItem.customerBalance < 0) {
        currentItem.customerBalance = 0;
      }

      // Update the state
      return {
        ...prevFormData,
        selectedSalesInvoices: updatedSelectedSalesInvoices,
        totalAmountReceived: calculateTotalAmount(),
      };
    });
  };

  const calculateTotalExcessAmountAmount = () => {
    return formData.selectedSalesInvoices.reduce(
      (total, item) => total + parseFloat(item.excessAmount || 0),
      0
    );
  };

  const calculateTotalShortAmountAmount = () => {
    return formData.selectedSalesInvoices.reduce(
      (total, item) => total + parseFloat(item.shortAmount || 0),
      0
    );
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmountReceived: calculateTotalAmountReceived(),
      totalAmount: calculateTotalAmount(),
      excessAmount: calculateTotalExcessAmountAmount(),
      shortAmount: calculateTotalShortAmountAmount(),
    }));
  }, [formData.selectedSalesInvoices]);

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
    return formData.selectedSalesInvoices.reduce(
      (total, item) => total + parseFloat(item.payment || 0),
      0
    );
  };

  const calculateTotalAmountReceived = () => {
    return (
      calculateTotalAmount() + formData.excessAmount - formData.shortAmount
    );
  };

  const handleSalesInvoiceChange = (referenceId) => {
    if (referenceId && referenceId.trim() !== "") {
      const isSelected =
        formData.salesInvoiceReferenceNumbers.includes(referenceId);

      if (!isSelected) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          salesInvoiceReferenceNumbers: [
            ...prevFormData.salesInvoiceReferenceNumbers,
            referenceId,
          ],
        }));

        const selectedSalesInvoice = salesInvoiceOptions.find(
          (salesInvoice) => salesInvoice.referenceNo === referenceId
        );

        selectedSalesInvoice.payment = 0.0;
        selectedSalesInvoice.updatedAmountDue = selectedSalesInvoice.amountDue;

        setFormData((prevFormData) => ({
          ...prevFormData,
          salesInvoiceIds: [
            ...prevFormData.salesInvoiceIds,
            selectedSalesInvoice?.salesInvoiceId ?? "",
          ],
          selectedSalesInvoices: [
            ...prevFormData.selectedSalesInvoices,
            selectedSalesInvoice,
          ],
        }));
      }
    }
    setSiSearchTerm("");
  };

  const handleRemoveSalesInvoice = (selectedId) => {
    const selectedSalesInvoice = salesInvoiceOptions.find(
      (salesInvoice) => salesInvoice.referenceNo === selectedId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      salesInvoiceReferenceNumbers:
        prevFormData.salesInvoiceReferenceNumbers.filter(
          (id) => id !== selectedId
        ),
      salesInvoiceIds: prevFormData.salesInvoiceIds.filter(
        (id) => id !== selectedSalesInvoice.salesInvoiceId
      ),
      selectedSalesInvoices: prevFormData.selectedSalesInvoices.filter(
        (salesInvoice) =>
          salesInvoice.salesInvoiceId !== selectedSalesInvoice.salesInvoiceId
      ),
    }));

    // Find the corresponding salesReceiptSalesInvoiceId using the salesInvoiceId
    const salesReceiptSalesInvoiceId = formData.salesReceiptSalesInvoices.find(
      (salesReceiptSalesInvoice) =>
        salesReceiptSalesInvoice.salesInvoiceId ===
        selectedSalesInvoice.salesInvoiceId
    )?.salesReceiptSalesInvoiceId;

    // If salesReceiptSalesInvoiceId is found, add it to the setItemIdsToBeDeleted
    if (salesReceiptSalesInvoiceId) {
      setItemIdsToBeDeleted((prevItemIds) => [
        ...prevItemIds,
        salesReceiptSalesInvoiceId,
      ]);
    }
  };

  const handleRemovePayment = (selectedId) => {
    const selectedSalesInvoice = salesInvoiceOptions.find(
      (salesInvoice) => salesInvoice.referenceNo === selectedId
    );
    setSelectedInvoiceIdToRemove(selectedId);
    // Find the corresponding salesReceiptSalesInvoiceId using the salesInvoiceId
    const salesReceiptSalesInvoiceId = formData.salesReceiptSalesInvoices.find(
      (salesReceiptSalesInvoice) =>
        salesReceiptSalesInvoice.salesInvoiceId ===
        selectedSalesInvoice.salesInvoiceId
    )?.salesReceiptSalesInvoiceId;

    if (salesReceiptSalesInvoiceId) {
      setShowPaymentRemovalConfirmation(true);
    } else {
      handleRemoveSalesInvoice(selectedId);
    }
  };

  const handleConfirmPaymentRemoval = () => {
    handleRemoveSalesInvoice(selectedInvoiceIdToRemove);
    setSelectedInvoiceIdToFilter(selectedInvoiceIdToRemove);
    setSelectedInvoiceIdToRemove(null);
    setShowPaymentRemovalConfirmation(false);
  };

  const handleClosePaymentRemovalConfirmation = () => {
    setShowPaymentRemovalConfirmation(false);
    setSelectedInvoiceIdToRemove(null);
  };

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    salesInvoiceOptions,
    paymentModes,
    showPaymentRemovalConfirmation,
    isPaymentModesLoading,
    isPaymentModesError,
    paymentModesError,
    isSalesInvoiceOptionsLoading,
    isSalesInvoiceOptionsError,
    salesInvoiceOptionsError,
    siSearchTerm,
    loading,
    loadingDraft,
    selectedInvoiceIdToFilter,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleSalesInvoiceChange,
    handleRemoveSalesInvoice,
    handleClosePaymentRemovalConfirmation,
    handleConfirmPaymentRemoval,
    handleRemovePayment,
    setSiSearchTerm,
    calculateTotalAmountReceived,
    calculateTotalExcessAmountAmount,
    calculateTotalShortAmountAmount,
  };
};

export default useSalesReceiptUpdate;
