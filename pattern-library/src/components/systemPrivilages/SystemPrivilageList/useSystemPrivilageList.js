import { useState, useEffect } from "react";
import {
  get_permissions_by_company_id_api,
  delete_permission_api,
} from "../../../services/userManagementApi";

const useSystemPrivilegeList = () => {
  const [permissions, setPermissions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreatePermissionForm, setShowCreatePermissionForm] =
    useState(false);
  const [showUpdatePermissionForm, setShowUpdatePermissionForm] =
    useState(false);
  const [permissionDetail, setPermissionDetail] = useState(null); // Initialize as null
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const permissionResponse = await get_permissions_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      setPermissions(permissionResponse.data.result || []);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (permission) => {
    setPermissionDetail(permission);
    setShowUpdatePermissionForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setPermissionDetail(null);
    }, delay);
  };

  const handleClose = () => {
    setShowUpdatePermissionForm(false);
    setPermissionDetail(null);
  };
  const handleDelete = (permission) => {
    setShowDeleteConfirmation(true);
    setPermissionDetail(permission);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeletePermission = async () => {
    try {
      setLoading(true);
      const deleteResponse = await delete_permission_api(
        selectedRowData[0]?.permissionId
      );
      if (deleteResponse.status === 204) {
        console.log("Permission deleted", selectedRowData[0]?.permissionId);
        setSubmissionStatus("success");
        setSubmissionMessage("Permission deleted successfully!");
        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);
          handleCloseDeleteConfirmation();
          fetchData();
          setSelectedRows([]);
          setSelectedRowData([]);
          setPermissionDetail(null);
          setLoading(false);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting permission. Please try again.");
        console.log("Error deleting permission");
      }
    } catch (error) {
      console.error("Error deleting permission:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting permission. Please try again.");

      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = permissions.find((p) => p.permissionId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.permissionId !== id)
      );
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, id]);
      setSelectedRowData((prevSelectedData) => [
        ...prevSelectedData,
        selectedRow,
      ]);
    }
  };

  const isAnyRowSelected = selectedRows.length === 1;

  const getStatusLabel = (statusCode) => {
    const statusLabels = {
      false: "Inactive",
      true: "Active",
    };

    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      false: "bg-secondary",
      true: "bg-success",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) => permissions.find((p) => p.permissionId === id)?.status === 1
    );
  };

  return {
    permissions,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showCreatePermissionForm,
    showUpdatePermissionForm,
    permissionDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    setShowCreatePermissionForm,
    setShowUpdatePermissionForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleDelete,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeletePermission,
  };
};

export default useSystemPrivilegeList;
