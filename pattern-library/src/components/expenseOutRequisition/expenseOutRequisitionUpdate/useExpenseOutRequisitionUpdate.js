import { useState, useEffect, useRef } from "react";
import { put_expense_out_requisition_api } from "../../../services/salesApi";

const useExpenseOutRequisitionUpdate = ({
  expenseOutRequisition,
  onFormSubmit,
}) => {
  const [formData, setFormData] = useState({
    reason: "",
    amount: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const deepCopyExpenseOutRequisition = JSON.parse(
      JSON.stringify(expenseOutRequisition)
    );
    setFormData({
      reason: deepCopyExpenseOutRequisition?.reason ?? "",
      amount: deepCopyExpenseOutRequisition?.amount ?? "",
    });
  }, [expenseOutRequisition]);

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

  const validateForm = () => {
    const isreasonValid = validateField("reason", "Reason", formData.reason);

    const isAmountValid = validateField("amount", "Amount", formData.amount, {
      validationFunction: (value) => parseFloat(value) > 0,
      errorMessage: `Amount must be greater than 0`,
    });

    return isreasonValid && isAmountValid;
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);

        const expenseOutRequisionUpdateData = {
          requestedUserId: expenseOutRequisition.requestedUserId,
          requestedBy: expenseOutRequisition.requestedBy,
          reason: formData.reason,
          amount: formData.amount,
          createdDate: expenseOutRequisition.createdDate,
          lastUpdatedDate: currentDate,
          referenceNumber: expenseOutRequisition.referenceNumber,
          status: 1,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          recommendedBy: null,
          recommendedUserId: null,
          recommendedDate: null,
          companyId: expenseOutRequisition.companyId,
          permissionId: 1083,
        };

        const approvalResponse = await put_expense_out_requisition_api(
          expenseOutRequisition.expenseOutRequisitionId,
          expenseOutRequisionUpdateData
        );

        if (approvalResponse.status === 200) {
          setSubmissionStatus("successSubmitted");
          console.log(
            "Expense out requisition updated successfully!",
            formData
          );

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default useExpenseOutRequisitionUpdate;
