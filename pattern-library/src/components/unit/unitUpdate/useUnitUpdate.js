import { useState, useEffect, useRef } from "react";
import { put_unit_api } from "../../../services/inventoryApi";

const useUnitUpdate = ({ unit, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    unitName: "",
    status: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const deepCopyUnit = JSON.parse(JSON.stringify(unit));
    setFormData({
      unitName: deepCopyUnit?.unitName,
      status: deepCopyUnit?.status == true ? "1" : "0",
    });
  }, [unit]);

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
        setLoading(true);

        const UnitData = {
          unitName: formData.unitName,
          status: status,
          companyId: sessionStorage.getItem("companyId"),
          permissionId: 1045,
        };

        const putResponse = await put_unit_api(unit.unitId, UnitData);

        if (putResponse.status === 200) {
          if (status === false) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Unit updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Unit updated successfully!", formData);
          }

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

export default useUnitUpdate;