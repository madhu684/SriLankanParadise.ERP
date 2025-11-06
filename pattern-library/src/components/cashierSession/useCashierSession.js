import { useState, useRef, useEffect } from "react";
import { post_cashier_session_api } from "../../services/salesApi";
import { useQueryClient } from "@tanstack/react-query";

const useCashierSession = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    openingBalance: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

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

    const isOpeningBalanceValid = validateField(
      "openingBalance",
      "Opening balance",
      formData.openingBalance
    );

    return isOpeningBalanceValid;
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
          sessionIn: currentDate,
          sessionOut: null,
          openingBalance: formData.openingBalance,
          companyId: sessionStorage.getItem("companyId"),
          actualCashInHand: null,
          actualChequesInHand: null,
          reasonCashInHandDifference: null,
          reasonChequesInHandDifference: null,
          isActiveSession: true,
          permissionId: 1067,
        };

        const response = await post_cashier_session_api(cashierSessionData);

        if (response.status === 201) {
          setSubmissionStatus("success");
          console.log("Cashier session open successfully", cashierSessionData);
          queryClient.invalidateQueries({
            queryKey: [
              "activeCashierSession",
              sessionStorage.getItem("userId"),
            ],
          });
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
      console.error("Error opening cashier session", error);
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

export default useCashierSession;
