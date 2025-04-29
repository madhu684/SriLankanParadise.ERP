import { useState, useEffect, useRef } from "react";
import {
  put_permission_api,
  company_modules_api,
} from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useSystemPrivilegeUpdate = ({ permission, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    permissionName: "",
    permissionStatus: "",
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
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching system modules:", error);
    }
  };

  const {
    data: systemModules,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["systemModules"],
    queryFn: () => fetchSystemModules(),
  });

  useEffect(() => {
    if (permission) {
      setFormData({
        permissionName: permission.permissionName,
        permissionStatus: permission.permissionStatus === true ? "1" : "0",
        systemModule: permission.moduleId ?? "",
      });
    }
  }, [permission]);

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
    const isRoleNameValid = validateField(
      "permissionName",
      "Permission name",
      formData.permissionName
    );
    const isStatusValid = validateField(
      "permissionStatus",
      "Status",
      formData.permissionStatus
    );

    const isSystemModuleValid = validateField(
      "systemModule",
      "System module",
      formData.systemModule
    );

    return isRoleNameValid && isSystemModuleValid && isStatusValid;
  };

  const handleSubmit = async () => {
    try {
      const permissionStatus = formData.permissionStatus === "1" ? true : false;

      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        const permissionData = {
          permissionName: formData.permissionName,
          PermissionStatus: permissionStatus,
          moduleId: formData.systemModule,
          companyId: sessionStorage.getItem("companyId"),
          PermissionRequestId: 1096,
        };

        const putResponse = await put_permission_api(
          permission.permissionId,
          permissionData
        );

        console.log("API Response:", putResponse);

        if (putResponse.status === 200) {
          if (permissionStatus === false) {
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
    console.log(`Field: ${field}, Value: ${value}`);
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

export default useSystemPrivilegeUpdate;
