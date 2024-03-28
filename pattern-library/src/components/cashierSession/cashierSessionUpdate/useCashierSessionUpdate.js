import { useState, useRef, useEffect } from "react";
import { put_cashier_session_api } from "../../../services/salesApi";

const useCashierSessionUpdate = ({ onFormSubmit, cashierSession }) => {
  const [formData, setFormData] = useState({
    closingBalance: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isClosingBalanceValid = validateField(
      "closingBalance",
      "Closing balance",
      formData.closingBalance
    );

    return isClosingBalanceValid;
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);
        const cashierSessionData = {
          userId: sessionStorage.getItem("userId"),
          sessionIn: cashierSession.sessionIn,
          sessionOut: currentDate,
          openingBalance: cashierSession.openingBalance,
          closingBalance: formData.closingBalance,
          companyId: sessionStorage.getItem("companyId"),
          permissionId: 1068,
        };

        const response = await put_cashier_session_api(
          cashierSession.cashierSessionId,
          cashierSessionData
        );

        if (response.status === 200) {
          setSubmissionStatus("success");
          console.log("Cashier session close successfully", cashierSessionData);
          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            onFormSubmit(response);
          }, 3000);
        } else {
          setSubmissionStatus("error");
        }
      }
    } catch (error) {
      console.error("Error closing cashier session", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 3000);
    }
  };

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    loading,
    alertRef,
    handleInputChange,
    handleSubmit,
  };
};

export default useCashierSessionUpdate;
