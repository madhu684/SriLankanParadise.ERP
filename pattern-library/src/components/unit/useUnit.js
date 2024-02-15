import { useState, useEffect, useRef } from "react";
import { post_unit_api } from "../../services/inventoryApi";

const useUnit = () => {
  const [formData, setFormData] = useState({
    unitName: "",
    status: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);

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
      additionalRules.validationFunctions &&
      additionalRules.validationFunctions.length > 0
    ) {
      additionalRules.validationFunctions.forEach((rule) => {
        if (!rule.validationFunction(value)) {
          isFieldValid = false;
          errorMessage = rule.errorMessage;
        }
      });
    }

    setValidFields((prev) => ({ ...prev, [fieldName]: isFieldValid }));
    setValidationErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));

    return isFieldValid;
  };

  const validateForm = () => {
    const isUnitNameValid = validateField(
      "unitName",
      "Unit name",
      formData.unitName
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    return isUnitNameValid && isStatusValid;
  };

  const handleSubmit = async () => {
    try {
      const status = formData.status === "1" ? true : false;
      const isFormValid = validateForm();
      if (isFormValid) {
        const UnitData = {
          unitName: formData.unitName,
          status: status,
          companyId: 1, //sessionStorage.getItem("companyId")
          permissionId: 1037,
        };

        const response = await post_unit_api(UnitData);

        if (response.status === 201) {
          if (status === false) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Unit created as inactive!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Unit created successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
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

  const formatDateTime = () => {
    const currentDateTime = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return currentDateTime.toLocaleDateString("en-US", options);
  };

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    formatDateTime,
    handleInputChange,
    handleSubmit,
  };
};

export default useUnit;
