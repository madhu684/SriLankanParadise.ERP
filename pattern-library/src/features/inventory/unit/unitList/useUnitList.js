import { useState, useEffect } from "react";
import {
  get_all_units_by_company_id_api,
  delete_unit_api,
} from "common/services/inventoryApi";
import { get_user_permissions_api } from "common/services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useUnitList = () => {
  const [units, setunits] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreateUnitForm, setShowCreateUnitForm] = useState(false);
  const [showUpdateUnitForm, setShowUpdateUnitForm] = useState(false);
  const [unitDetail, setUnitDetail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserPermissions = async () => {
    try {
      const response = await get_user_permissions_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  };

  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
    error: permissionError,
  } = useQuery({
    queryKey: ["userPermissions"],
    queryFn: fetchUserPermissions,
  });

  const fetchData = async () => {
    try {
      if (!isLoadingPermissions && userPermissions) {
        const UnitResponse = await get_all_units_by_company_id_api(
          sessionStorage.getItem("companyId")
        );
        setunits(UnitResponse.data.result || []);
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [isLoadingPermissions, userPermissions]);

  const handleUpdate = (unit) => {
    setUnitDetail(unit);
    setShowUpdateUnitForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setUnitDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateUnitForm(false);
    setUnitDetail("");
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteUnit = async () => {
    try {
      setLoading(true);
      const deleteResponse = await delete_unit_api(selectedRowData[0]?.unitId);

      if (deleteResponse.status === 204) {
        console.log("Unit deleted", selectedRowData[0]?.unitId);

        setSubmissionStatus("success");
        setSubmissionMessage("Unit deleted successfully!");

        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);

          handleCloseDeleteConfirmation();
          fetchData();

          setSelectedRows([]);
          setSelectedRowData([]);
          setUnitDetail("");
          setLoading(false);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting unit. Please try again.");
        console.log("Error deleting Unit");
      }
    } catch (error) {
      console.error("Error deleting Unit:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting unit. Please try again.");

      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = units.find((u) => u.unitId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.unitId !== id)
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
      (id) => units.find((c) => c.unitId === id)?.status === 1
    );
  };

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  return {
    units,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showCreateUnitForm,
    showUpdateUnitForm,
    userPermissions,
    unitDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    setShowCreateUnitForm,
    setShowUpdateUnitForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteUnit,
  };
};

export default useUnitList;













