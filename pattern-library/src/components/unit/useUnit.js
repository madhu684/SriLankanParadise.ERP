import { useState, useEffect, useRef, useMemo } from "react";
import {
  post_unit_api,
  get_measurement_types_by_company_id_api,
} from "../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUnit = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    unitName: "",
    status: "",
    measurementType: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const queryClient = useQueryClient();

  const fetchMeasurementTypes = async () => {
    try {
      const response = await get_measurement_types_by_company_id_api(companyId);
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching measurement types:", error);
    }
  };

  const {
    data: measurementTypes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["measurementTypes"],
    queryFn: () => fetchMeasurementTypes(),
  });

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
    const isUnitNameValid = validateField(
      "unitName",
      "Unit name",
      formData.unitName
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    const isMeasurementTypeValid = validateField(
      "measurementType",
      "Measurement type",
      formData.measurementType
    );

    return isUnitNameValid && isStatusValid && isMeasurementTypeValid;
  };

  const handleSubmit = async () => {
    try {
      const status = formData.status === "1" ? true : false;
      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        const unitData = {
          unitName: formData.unitName,
          status: status,
          companyId: companyId,
          measurementTypeId: formData.measurementType,
          permissionId: 1037,
        };

        const response = await post_unit_api(unitData);

        if (response.status === 201) {
          if (status === false) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Unit created as inactive!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Unit created successfully!", formData);
          }

          queryClient.invalidateQueries(["units", companyId]);

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
          }, 3000);
          toast.success("Unit created successfully!");
        } else {
          setSubmissionStatus("error");
          toast.error("Unit creation failed!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 3000);
      toast.error("Unit creation failed!");
    }
  };

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    isLoading,
    isError,
    measurementTypes,
    handleInputChange,
    handleSubmit,
  };
};

export default useUnit;
