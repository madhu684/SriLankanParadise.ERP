import { useState, useEffect, useRef, useContext } from "react";
import { post_cashier_expense_out_api } from "../../services/salesApi";
import { UserContext } from "../../context/userContext";

const useCashierExpenseOut = ({ onFormSubmit, onClose }) => {
  const { activeCashierSession } = useContext(UserContext);
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

    const isAmountValid = validateField("amount", "Amount", formData.amount);

    return isreasonValid && isAmountValid;
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);

        const cashierExpenseOutData = {
          userId: sessionStorage.getItem("userId"),
          description: formData.reason,
          amount: formData.amount,
          createdDate: currentDate,
          companyId: sessionStorage.getItem("companyId"),
          cashierSessionId: activeCashierSession?.cashierSessionId,
          permissionId: 1069,
        };

        const response = await post_cashier_expense_out_api(
          cashierExpenseOutData
        );

        if (response.status === 201) {
          setSubmissionStatus("successSubmitted");
          console.log("Cashier expense out created successfully!", formData);

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
    if (onClose) {
      onClose();
    }
  };

  console.log("formData: ", formData);

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
};

export default useCashierExpenseOut;
