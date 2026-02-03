import { useState, useEffect, useRef } from "react";
import {
  put_role_api,
  company_modules_api,
} from "common/services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useUserRoleUpdate = ({ role, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    status: "",
    systemModule: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const fetchSystemModules = async () => {
    try {
      const response = await company_modules_api(
        sessionStorage.getItem("companyId")
      );
      console.log("API Response:", response); // Inspect API response

      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching system modules:", error);
      return []; // Return an empty array on error
    }
  };

  const {
    data: systemModules = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["systemModules"],
    queryFn: fetchSystemModules,
  });

  useEffect(() => {
    if (role) {
      setFormData({
        roleName: role?.roleName || "",
        status: role.status === true ? "1" : "0",
        systemModule: role?.moduleId ?? "",
      });
    }
  }, [role]);

  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
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
    const isRoleNameValid = validateField(
      "roleName",
      "Role name",
      formData.roleName
    );
    const isSystemModuleValid = validateField(
      "systemModule",
      "System module",
      formData.systemModule
    );
    const isStatusValid = validateField("status", "Status", formData.status);
    return isRoleNameValid && isSystemModuleValid && isStatusValid;
  };

  const handleSubmit = async () => {
    try {
      const status = formData.status === "1" ? true : false;
      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        const roleData = {
          roleName: formData.roleName,
          moduleId: formData.systemModule,
          companyId: sessionStorage.getItem("companyId"),
          status: status,
          permissionId: 1098,
        };

        const putResponse = await put_role_api(role.roleId, roleData);
        if (putResponse.status === 200) {
          if (status === false) {
            setSubmissionStatus("successSavedAsDraft");
          } else {
            setSubmissionStatus("successSubmitted");
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
    isLoading,
    isError,
    systemModules,
    handleInputChange,
    handleSubmit,
  };
};

export default useUserRoleUpdate;













