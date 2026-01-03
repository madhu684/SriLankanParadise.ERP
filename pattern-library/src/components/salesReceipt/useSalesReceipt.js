import { useState, useEffect, useRef } from "react";
import {
  get_sales_invoices_with_out_drafts_api,
  get_payment_modes_api,
  post_sales_receipt_api,
  post_sales_receipt_sales_invoice_api,
  put_sales_invoice_api,
} from "../../services/salesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useSalesReceipt = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    receiptDate: new Date().toISOString().split("T")[0],
    referenceNo: "",
    paymentModeId: "",
    attachments: [],
    salesInvoiceId: "",
    salesInvoiceIds: [],
    salesInvoiceReferenceNumbers: [],
    selectedSalesInvoices: [],
    totalAmountReceived: 0,
    excessAmount: 0,
    outstandingAmount: 0,
    totalAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  // const [selectedsalesInvoice, setSelectedsalesInvoice] = useState(null);
  // const [referenceNo, setReferenceNo] = useState(null);
  const [siSearchTerm, setSiSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const queryClient = useQueryClient();

  const fetchsalesInvoices = async () => {
    try {
      const response = await get_sales_invoices_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );

      // Get today's date at midnight in local timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredsalesInvoices = response.data.result?.filter((sr) => {
        if (sr.status !== 2 || !sr.invoiceDate) return false;

        // Parse the invoice date and set to midnight for comparison
        const invoiceDate = new Date(sr.invoiceDate);
        invoiceDate.setHours(0, 0, 0, 0);

        // Check if invoice date matches today
        return invoiceDate.getTime() === today.getTime();
      });

      return filteredsalesInvoices || [];
    } catch (error) {
      console.error("Error fetching sales invoices:", error);
      return [];
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
      return response.data.result || [];
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
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmountReceived: calculateTotalAmountReceived(),
      totalAmount: calculateTotalAmount(),
      excessAmount: calculateTotalExcessAmountAmount(),
      outstandingAmount: calculateTotalOutstandingAmountAmount(),
    }));
  }, [formData.selectedSalesInvoices]);

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

    const isPaymentReferenceValid = validateField(
      "referenceNo",
      "Payment reference",
      formData.referenceNo
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
      isPaymentReferenceValid &&
      isPaymentValid
    );
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
    const referenceNumber = `SR_${formattedDate}_${randomNumber}`;

    return referenceNumber;
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const salesReceiptData = {
          receiptDate: formData.receiptDate,
          amountReceived: formData.totalAmount,
          paymentReferenceNo: formData.referenceNo,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          paymentModeId: formData.paymentModeId,
          createdBy: sessionStorage?.getItem("username") ?? null,
          createdUserId: sessionStorage?.getItem("userId") ?? null,
          status: status,
          excessAmount: formData.excessAmount,
          outstandingAmount: formData.outstandingAmount,
          amountCollect: calculateTotalAmountCollected().toFixed(2),
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          referenceNumber: generateReferenceNumber(),
          permissionId: 34,
        };

        const response = await post_sales_receipt_api(salesReceiptData);
        const salesReceiptId = response.data.result.salesReceiptId;

        const selectedSalesInvoicesData = formData.selectedSalesInvoices.map(
          async (item) => {
            const salesReceiptSalesInvoiceData = {
              salesReceiptId,
              salesInvoiceId: item.salesInvoiceId,
              settledAmount: item.payment,
              excessAmount: item.excessAmount,
              outstandingAmount: item.outstandingAmount,
              amountCollect:
                item.payment -
                (item.customerBalance.toFixed(2) || 0) +
                (item.excessAmount || 0),
              customerBalance: item.customerBalance.toFixed(2),
              permissionId: 34,
            };

            const postResponse = await post_sales_receipt_sales_invoice_api(
              salesReceiptSalesInvoiceData
            );

            // Calculate new amount due after this payment, ensuring it's not negative
            const newAmountDue = Math.max(0, item.amountDue - item.payment);

            // Determine the new status
            let siStatus = item.status;
            if (newAmountDue <= 0) {
              siStatus = 5; // Settled - fully paid
            } else if (item.outstandingAmount <= 100) {
              // NEW LOGIC: If outstanding amount (outstanding amount) <= 100, set to settled
              siStatus = 5; // Settled - outstanding amount within tolerance
            } else {
              siStatus = 2; // Approved - partially paid
            }

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
              amountDue: newAmountDue.toFixed(2),
              createdDate: item.createdDate,
              lastUpdatedDate: currentDate,
              referenceNumber: item.referenceNumber,
              locationId: item.locationId,
              inVoicedPersonName: item.inVoicedPersonName,
              inVoicedPersonMobileNo: item.inVoicedPersonMobileNo,
              appointmentId: item.appointmentId,
              tokenNo: item.tokenNo,
              permissionId: 31,
            };

            const putResponse = await put_sales_invoice_api(
              item.salesInvoiceId,
              salesInvoiceData
            );

            return { postResponse: postResponse, putResponse };
          }
        );

        // Wait for all requests to complete
        const allResponses = await Promise.all(selectedSalesInvoicesData);

        // Check if all updates were successful
        const allUpdatesSuccessful = allResponses.every(
          ({ postResponse, putResponse }) => {
            return postResponse.status === 201 && putResponse.status === 200;
          }
        );

        if (allUpdatesSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
          } else {
            setSubmissionStatus("successSubmitted");
          }
          queryClient.invalidateQueries([
            "salesReceipts",
            sessionStorage.getItem("companyId"),
          ]);

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

      // Store previous values before changes
      const prevExcess = currentItem.excessAmount.toFixed(2) || 0;
      const prevCustomerBalance = currentItem.customerBalance.toFixed(2) || 0;

      // Update the changed field
      currentItem[field] = value;

      // Recalculate based on what changed
      if (field === "excessAmount") {
        const newExcess = value.toFixed(2) || 0;
        const payment = currentItem.payment.toFixed(2) || 0;
        const amountDue = currentItem.amountDue.toFixed(2) || 0;

        // Calculate available balance that could be converted back
        const totalAvailable = payment - amountDue;

        if (newExcess < prevExcess) {
          // When reducing excess, add difference back to customer balance
          const excessReduction = prevExcess - newExcess;
          currentItem.customerBalance = Math.min(
            prevCustomerBalance + excessReduction,
            totalAvailable
          );
        }
      }

      // Maintain all other existing calculations
      const payment = currentItem.payment || 0;
      const amountDue = currentItem.amountDue || 0;
      const excessAmount = currentItem.excessAmount || 0;

      // NEW LOGIC: Check if invoice is fully settled
      const totalReceived = payment; // Amount received for this invoice
      const invoiceTotal = currentItem.totalAmount || 0; // Original invoice total

      if (invoiceTotal <= totalReceived) {
        // Invoice is fully settled - Amount Due should be 0
        currentItem.updatedAmountDue = 0;
        currentItem.outstandingAmount = 0;
        // Customer balance is the excess amount received
        currentItem.customerBalance = Math.max(
          0,
          totalReceived - invoiceTotal - excessAmount
        );
      } else {
        // Invoice is partially settled - calculate normally
        currentItem.outstandingAmount = Math.max(
          0,
          amountDue - payment + excessAmount
        );
        // Ensure updatedAmountDue is not negative
        currentItem.updatedAmountDue = Math.max(
          0,
          amountDue - payment + excessAmount
        );
        currentItem.customerBalance = Math.max(
          0,
          payment - amountDue - excessAmount
        );
      }

      return {
        ...prevFormData,
        selectedSalesInvoices: updatedSelectedSalesInvoices,
        totalAmountReceived: calculateTotalAmount().toFixed(2),
      };
    });
  };

  const handleAddToExcess = (index) => {
    setFormData((prevFormData) => {
      const updatedSelectedSalesInvoices = [
        ...prevFormData.selectedSalesInvoices,
      ];
      const currentItem = updatedSelectedSalesInvoices[index];

      // Convert full customer balance to excess
      currentItem.excessAmount =
        (currentItem.excessAmount || 0) + (currentItem.customerBalance || 0);
      currentItem.customerBalance = 0;

      // Maintain other calculations
      const payment = currentItem.payment || 0;
      const amountDue = currentItem.amountDue || 0;
      currentItem.outstandingAmount = Math.max(0, amountDue - payment);
      currentItem.updatedAmountDue = Math.max(0, amountDue - payment);

      return {
        ...prevFormData,
        selectedSalesInvoices: updatedSelectedSalesInvoices,
      };
    });
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

  const calculateTotalAmountCollected = () => {
    return formData.selectedSalesInvoices.reduce(
      (total, item) =>
        total + ((item.payment || 0) - (item.customerBalance || 0)),
      0
    );
  };
  const calculateTotalAmount = () => {
    return formData.selectedSalesInvoices.reduce(
      (total, item) => total + parseFloat(item.payment || 0),
      0
    );
  };

  const calculateTotalExcessAmountAmount = () => {
    return formData.selectedSalesInvoices.reduce(
      (total, item) => total + parseFloat(item.excessAmount || 0),
      0
    );
  };

  const calculateTotalOutstandingAmountAmount = () => {
    return formData.selectedSalesInvoices.reduce(
      (total, item) => total + parseFloat(item.outstandingAmount || 0),
      0
    );
  };

  const calculateTotalAmountReceived = () => {
    return (
      calculateTotalAmount() +
      formData.excessAmount -
      formData.outstandingAmount
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
        selectedSalesInvoice.excessAmount = 0.0;
        selectedSalesInvoice.outstandingAmount = 0.0;
        selectedSalesInvoice.customerBalance = 0.0;
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
  };

  console.log(formData);

  return {
    formData,
    paymentModes,
    isPaymentModesLoading,
    isPaymentModesError,
    paymentModesError,
    submissionStatus,
    validFields,
    validationErrors,
    // referenceNo,
    // selectedsalesInvoice,
    alertRef,
    salesInvoiceOptions,
    isSalesInvoiceOptionsLoading,
    isSalesInvoiceOptionsError,
    salesInvoiceOptionsError,
    siSearchTerm,
    loading,
    loadingDraft,
    handleInputChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
    handleSalesInvoiceChange,
    handleRemoveSalesInvoice,
    setSiSearchTerm,
    calculateTotalAmountReceived,
    calculateTotalExcessAmountAmount,
    calculateTotalOutstandingAmountAmount,
    handleAddToExcess,
    calculateTotalAmountCollected,
  };
};

export default useSalesReceipt;
