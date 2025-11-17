import { useState, useEffect, useRef, useMemo } from "react";
import { post_category_api } from "../../services/inventoryApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useCategory = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    categoryName: "",
    status: "",
    isTreatment: "0",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
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
          companyId: companyId,
          permissionId: 1038,
        };

        const response = await post_category_api(categoryData);

        if (response.status === 201) {
          if (status === false) {
            setSubmissionStatus("successSavedAsDraft");
            toast.success("Category created and saved as draft!");
          } else {
            setSubmissionStatus("successSubmitted");
            toast.success("Category created successfully!");
          }

          queryClient.invalidateQueries(["categories", companyId]);

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
          }, 3000);
        } else {
          setSubmissionStatus("error");
          toast.error("Category creation failed!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 3000);
      toast.error("Category creation failed!");
    }
  };

  console.log("formData", formData);

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

export default useCategory;
