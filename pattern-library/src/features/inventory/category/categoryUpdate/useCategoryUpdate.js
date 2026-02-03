import { useState, useEffect, useRef } from "react";
import { put_category_api } from "common/services/inventoryApi";

const useCategoryUpdate = ({ category, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    categoryName: "",
    status: "",
    isTreatment: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const deepCopyCategory = JSON.parse(JSON.stringify(category));
    setFormData({
      categoryName: deepCopyCategory?.categoryName,
      status: deepCopyCategory?.status === true ? "1" : "0",
      isTreatment: deepCopyCategory?.isTreatment === true ? "1" : "0",
    });
  }, [category]);

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
    const isCategoryNameValid = validateField(
      "categoryName",
      "Category name",
      formData.categoryName
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    const isTreatmentValid = validateField(
      "isTreatment",
      "Treatment Category",
      formData.isTreatment
    );

    return isCategoryNameValid && isStatusValid && isTreatmentValid;
  };

  const handleSubmit = async () => {
    try {
      const status = formData.status === "1" ? true : false;

      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        const categoryData = {
          categoryName: formData.categoryName,
          status: status,
          isTreatment: formData.isTreatment === "1" ? true : false,
          companyId: sessionStorage.getItem("companyId"),
          permissionId: 1043,
        };

        const putResponse = await put_category_api(
          category.categoryId,
          categoryData
        );

        if (putResponse.status === 200) {
          if (status === false) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Category updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Category updated successfully!", formData);
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

export default useCategoryUpdate;













