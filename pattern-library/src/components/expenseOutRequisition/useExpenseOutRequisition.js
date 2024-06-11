import { useState, useEffect, useRef } from "react";
import { post_expense_out_requisition_api } from "../../services/salesApi";

const useExpenseOutRequisition = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    reason: "",
    amount: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

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
    const referenceNumber = `EOR_${formattedDate}_${randomNumber}`;

    return referenceNumber;
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);

        const expenseOutRequisionData = {
          requestedUserId: sessionStorage.getItem("userId"),
          requestedBy: sessionStorage.getItem("username"),
          reason: formData.reason,
          amount: formData.amount,
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          referenceNumber: generateReferenceNumber(),
          status: 1,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          recommendedBy: null,
          recommendedUserId: null,
          recommendedDate: null,
          companyId: sessionStorage.getItem("companyId"),
          permissionId: 1079,
        };

        const response = await post_expense_out_requisition_api(
          expenseOutRequisionData
        );

        if (response.status === 201) {
          setSubmissionStatus("successSubmitted");
          console.log("Expense out request submitted successfully!", formData);

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

  const handleClose = () => {
    setFormData({
      reason: "",
      amount: "",
    });
    setValidFields({});
    setValidationErrors({});
  };

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default useExpenseOutRequisition;
