import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_roles_by_company_id_api, delete_role_api } from "common/services/userManagementApi";

const useUserRoleList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showUpdateRoleForm, setShowUpdateRoleForm] = useState(false);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);
  const [roleDetail, setRoleDetail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch roles using React Query
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await get_roles_by_company_id_api(sessionStorage.getItem("companyId"));
      return response.data.result || [];
    },
  });

  // Update and Delete Handlers
  const handleUpdate = (role) => {
    setRoleDetail(role);
    setShowUpdateRoleForm(true);
  };

  const handleShowCreateForm = () => setShowCreateRoleForm(true);
  const handleCloseCreateForm = () => setShowCreateRoleForm(false);

  const handleUpdated = async () => {
    await refetch(); // Refresh data after update
    setSelectedRows([]);
    setTimeout(() => {
      setSelectedRowData([]);
      setRoleDetail("");
    }, 300);
  };

  const handleClose = () => {
    setShowUpdateRoleForm(false);
    setRoleDetail("");
  };

  const handleDelete = (role) => {
    setShowDeleteConfirmation(true);
    setRoleDetail(role);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteRole = async () => {
    if (!roleDetail?.roleId) {
      console.error("Error: roleId is undefined");
      return;
    }

    try {
      setLoading(true);
      const deleteResponse = await delete_role_api(roleDetail.roleId);
      if (deleteResponse.status === 204) {
        setSubmissionStatus("success");
        setSubmissionMessage("Role deleted successfully!");
        setTimeout(async () => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);
          handleCloseDeleteConfirmation();
          await refetch(); // Refresh data after deletion
          setSelectedRows([]);
          setSelectedRowData([]);
          setRoleDetail("");
          setLoading(false);
        }, 3000);
      } else {
        throw new Error("Error deleting role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting role. Please try again.");
      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  // Row selection logic
  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = data?.find((r) => r.roleId === id);

    if (isSelected) {
      setSelectedRows((prev) => prev.filter((selectedId) => selectedId !== id));
      setSelectedRowData((prev) => prev.filter((data) => data.roleId !== id));
    } else {
      setSelectedRows((prev) => [...prev, id]);
      setSelectedRowData((prev) => [...prev, selectedRow]);
    }
  };

  const isAnyRowSelected = selectedRows.length === 1;

  // Helper functions
  const getStatusLabel = (statusCode) => {
    return statusCode ? "Active" : "Inactive";
  };

  const getStatusBadgeClass = (statusCode) => {
    return statusCode ? "bg-success" : "bg-secondary";
  };

  return {
    roles: data || [],
    isLoadingData: isLoading,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showUpdateRoleForm,
    roleDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    showCreateRoleForm,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    setShowUpdateRoleForm,
    handleUpdate,
    handleUpdated,
    handleDelete,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteRole,
    handleShowCreateForm,
    handleCloseCreateForm,
  };
};

export default useUserRoleList;












