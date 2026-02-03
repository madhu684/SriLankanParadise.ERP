import { useState, useEffect, useRef } from "react";
import {
  post_permission_api,
  company_modules_api,
  get_permissions_by_company_id_api,
} from "common/services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useSystemPrivilege = ({ onFormSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    permissionName: "",
    permissionStatus: "",
    systemModule: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const fetchSystemModules = async () => {
    try {
      const response = await company_modules_api(
        sessionStorage.getItem("companyId")
      );
      console.log("Fetched system modules:", response.data.result);
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching system modules:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await get_permissions_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      console.log("Fetched permissions:", response.data.result);
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw error;
    }
  };

  const {
    data: systemModules,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["systemModules"],
    queryFn: fetchSystemModules,
  });

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchAndSetPermissions = async () => {
      const permissions = await fetchPermissions();
      setPermissions(permissions);
      console.log("Set privileges:", permissions);
    };

    fetchAndSetPermissions();
  }, []);

  const handleInputChange = (field, value) => {
    console.log(`Field: ${field}, Value: ${value}`);
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
        console.log("Submitting form with data:", formData);
        const permissionNameExists = permissions.some(
          (permission) => permission.permissionName === formData.permissionName
        );

        if (permissionNameExists) {
          setSubmissionStatus("error");
          setValidationErrors((prev) => ({
            ...prev,
            permissionName: "Permission name already exists",
          }));
          setLoading(false);
          return;
        }

        const permissionData = {
          permissionName: formData.permissionName,
          permissionStatus: permissionStatus,
          moduleId: formData.systemModule,
          companyId: sessionStorage.getItem("companyId"),
          PermissionRequestId: 1095,
        };

        const response = await post_permission_api(permissionData);

        if (response.status === 201) {
          if (permissionStatus === false) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Privilege created as inactive!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Privilege created successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            if (onFormSubmit) onFormSubmit();
            if (onClose) onClose();
          }, 1000);
        } else {
          setSubmissionStatus("error");
          console.error("Failed to create privilege:", response);
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
      permissionName: "",
      permissionStatus: "",
      systemModule: "",
    });
    setValidFields({});
    setValidationErrors({});
    setSubmissionStatus(null);
    if (onClose) onClose();
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
    systemModules,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
};

export default useSystemPrivilege;













