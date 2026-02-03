import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  company_modules_api,
  delete_role_permission_api,
  get_permissions_by_company_id_api,
  get_roles_by_company_id_api,
  role_permission_api,
  role_permissions_api,
} from "common/services/userManagementApi";

const useRolePermissionMapping = () => {
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissionId, setSelectedPermissionId] = useState("");
  const [roleMappings, setRoleMappings] = useState([]);
  const [mappingsLoading, setMappingsLoading] = useState(false);
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [mappingsError, setMappingsError] = useState(null);
  const [errors, setErrors] = useState({});

  const {
    data: systemModules,
    isLoading: modulesLoading,
    isError: modulesError,
  } = useQuery({
    queryKey: ["systemModules"],
    queryFn: async () => {
      const response = await company_modules_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    },
  });

  const {
    data: roles,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await get_roles_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    },
  });

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await get_permissions_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    },
  });

  const filteredRoles = useMemo(() => {
    if (!selectedModuleId || !roles) return [];
    return roles.filter((role) => role.moduleId === selectedModuleId);
  }, [selectedModuleId, roles]);

  const filteredPermissions = useMemo(() => {
    if (!selectedModuleId || !permissions) return [];
    const mappedPermissionIds = new Set(
      roleMappings.map((m) => m.permissionId)
    );
    return permissions.filter(
      (permission) =>
        permission.moduleId === selectedModuleId &&
        !mappedPermissionIds.has(permission.permissionId)
    );
  }, [selectedModuleId, permissions, roleMappings]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedModuleId) {
      newErrors.selectedModuleId = "Please select a module.";
    }
    if (!selectedRoleId) {
      newErrors.selectedRoleId = "Please select a role.";
    }
    if (roleMappings.length === 0) {
      newErrors.selectedPermissionId = "Please select a permission.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModuleChange = (e) => {
    setSelectedModuleId(parseInt(e.target.value));
    setSelectedRoleId("");
    setSelectedPermissionId("");
    setRoleMappings([]);
  };

  const handleRoleChange = async (e) => {
    const roleId = parseInt(e.target.value);
    setSelectedRoleId(roleId);
    setSelectedPermissionId("");
    if (!roleId) return;
    try {
      setMappingsLoading(true);
      setMappingsError(null);
      const response = await role_permissions_api([roleId]);
      const roleMappingsData = (response.data.result[roleId] || []).map(
        (item) => ({
          permissionId: item.permission.permissionId,
          permissionName: item.permission.permissionName,
        })
      );
      setRoleMappings(roleMappingsData);
    } catch (error) {
      setMappingsError("Failed to load role mappings.");
    } finally {
      setMappingsLoading(false);
    }
  };

  const handleRemove = async (permissionId) => {
    setRoleMappings((prevMappings) =>
      prevMappings.filter((m) => m.permissionId !== permissionId)
    );
  };

  const handlePermissionChange = (permissionId) => {
    const numericPermissionId = parseInt(permissionId, 10);
    setSelectedPermissionId(numericPermissionId);
    const permission = filteredPermissions.find(
      (permission) => permission.permissionId === numericPermissionId
    );
    if (permission) {
      const newPermission = {
        permissionId: permission.permissionId,
        permissionName: permission.permissionName,
      };
      setRoleMappings((prevMappings) => [...prevMappings, newPermission]);
      setSelectedPermissionId("");
    } else {
      console.error("Permission not found for ID:", numericPermissionId);
    }
  };

  const handleDelete = async () => {
    try {
      await delete_role_permission_api(selectedRoleId);
      return true;
    } catch (error) {
      console.error("Error deleting role permission:", error);
      return false;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const deleteSuccess = await handleDelete();
      if (deleteSuccess) {
        for (const mapping of roleMappings) {
          const payload = {
            roleId: selectedRoleId,
            permissionId: mapping.permissionId,
          };
          await role_permission_api(payload);
        }
        setSubmissionStatus("successSubmitted");
        setTimeout(() => {
          handleClear();
        }, 2000);
      } else {
        console.error(
          "Error deleting role permission. Cannot proceed with creating role permissions."
        );
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error creating role permissions:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedModuleId("");
    setSelectedRoleId("");
    setSelectedPermissionId("");
    setRoleMappings([]);
    setSubmissionStatus(null);
    setErrors({});
  };

  return {
    systemModules,
    filteredRoles,
    filteredPermissions,
    selectedModuleId,
    selectedRoleId,
    selectedPermissionId,
    roleMappings,
    mappingsLoading,
    mappingsError,
    errors,
    isLoading: modulesLoading || rolesLoading,
    isError: modulesError || rolesError,
    submissionStatus,
    isSubmiting,
    handleModuleChange,
    handleRoleChange,
    handleRemove,
    handlePermissionChange,
    handleCreate,
    handleClear,
  };
};

export default useRolePermissionMapping;













