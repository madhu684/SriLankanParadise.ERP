import { useState, useEffect, useRef } from "react";
import {
  post_role_api,
  company_modules_api,
  get_roles_by_company_id_api,
} from "../../services/userManagementApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useUserRole = ({ onFormSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    status: "",
    systemModule: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const queryClient = useQueryClient();

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

  const fetchRoles = async () => {
    try {
      const response = await get_roles_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching Roles:", error);
    }
  };

  const {
    data: systemModules,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["systemModules"],
    queryFn: fetchSystemModules,
  });

  useEffect(() => {
    const fetchAndSetRoles = async () => {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    };

    fetchAndSetRoles();
  }, []);

  const handleInputChange = (field, value) => {
    setSubmissionStatus(null);
    setValidationErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
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
    const isStatusValid = validateField("status", "Status", formData.status);
    const isSystemModuleValid = validateField(
      "systemModule",
      "System module",
      formData.systemModule
    );

    return isRoleNameValid && isStatusValid && isSystemModuleValid;
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        // Check if role name already exists
        const roleNameExists = roles.some(
          (role) => role.roleName === formData.roleName
        );
        if (roleNameExists) {
          setSubmissionStatus("error");
          setValidationErrors((prev) => ({
            ...prev,
            roleName: "Role name already exists",
          }));
          setLoading(false);
          return;
        }

        const roleData = {
          roleName: formData.roleName,
          moduleId: formData.systemModule,
          companyId: sessionStorage.getItem("companyId"),
          status: formData.status === "1" ? true : false,
          permissionId: 1097,
        };

        const response = await post_role_api(roleData);

        if (response.status === 201) {
          setSubmissionStatus("successSubmitted");
          console.log("Role created successfully!", formData);
          queryClient.invalidateQueries(["roles"]);
          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            if (onFormSubmit) onFormSubmit();
            if (onClose) onClose();
          }, 1000);
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

  const handleClose = () => {
    setFormData({
      roleName: "",
      status: "",
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

export default useUserRole;
