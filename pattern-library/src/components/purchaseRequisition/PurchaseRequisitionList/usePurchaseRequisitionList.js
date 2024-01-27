import { useState, useEffect } from "react";
import { get_purchase_requisitions_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_purchase_requisitions_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";

const usePurchaseRequisitionList = () => {
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApprovePRModal, setShowApprovePRModal] = useState(false);
  const [showApprovePRModalInParent, setShowApprovePRModalInParent] =
    useState(false);
  const [showDetailPRModal, setShowDetailPRModal] = useState(false);
  const [showDetailPRModalInParent, setShowDetailPRModalInParent] =
    useState(false);
  const [showCreatePRForm, setShowCreatePRForm] = useState(false);
  const [PRDetail, setPRDetail] = useState("");

  const fetchUserPermissions = async () => {
    try {
      const userPermissionsResponse = await get_user_permissions_api(
        sessionStorage.getItem("userId")
      );
      setUserPermissions(userPermissionsResponse.data.result);
    } catch (error) {
      setError("Error fetching data");
    }
  };

  const fetchData = async () => {
    try {
      if (hasPermission("Approve Purchase Requisition")) {
        const purchaseRequisitionResponse =
          await get_purchase_requisitions_with_out_drafts_api();
        setPurchaseRequisitions(purchaseRequisitionResponse.data.result);
      } else {
        const purchaseRequisitionResponse =
          await get_purchase_requisitions_by_user_id_api(
            sessionStorage.getItem("userId")
          );
        setPurchaseRequisitions(purchaseRequisitionResponse.data.result);
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [userPermissions]);

  const handleShowApprovePRModal = () => {
    setShowApprovePRModal(true);
    setShowApprovePRModalInParent(true);
  };

  const handleCloseApprovePRModal = () => {
    setShowApprovePRModal(false);
    handleCloseApprovePRModalInParent();
  };

  const handleCloseApprovePRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApprovePRModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailPRModal = () => {
    setShowDetailPRModal(true);
    setShowDetailPRModalInParent(true);
  };

  const handleCloseDetailPRModal = () => {
    setShowDetailPRModal(false);
    handleCloseDetailPRModalInParent();
  };

  const handleCloseDetailPRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailPRModalInParent(false);
      setPRDetail("");
    }, delay);
  };

  const handleViewDetails = (purchaseRequisition) => {
    setPRDetail(purchaseRequisition);
    handleShowDetailPRModal();
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = purchaseRequisitions.find(
      (pr) => pr.purchaseRequisitionId === id
    );

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.purchaseRequisitionId !== id)
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
      0: "Draft",
      1: "Pending Approval",
      2: "Approved",
      3: "Rejected",
      4: "In Progress",
      5: "Completed",
      6: "Cancelled",
      7: "On Hold",
    };

    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      0: "bg-secondary",
      1: "bg-warning",
      2: "bg-success",
      3: "bg-danger",
      4: "bg-info",
      5: "bg-primary",
      6: "bg-dark",
      7: "bg-secondary",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        purchaseRequisitions.find((pr) => pr.purchaseRequisitionId === id)
          ?.status === 1
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
    purchaseRequisitions,
    isLoading,
    error,
    isAnyRowSelected,
    selectedRows,
    showApprovePRModal,
    showApprovePRModalInParent,
    showDetailPRModal,
    showDetailPRModalInParent,
    selectedRowData,
    showCreatePRForm,
    userPermissions,
    PRDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApprovePRModal,
    handleCloseApprovePRModal,
    handleShowDetailPRModal,
    handleCloseDetailPRModal,
    handleApproved,
    setShowCreatePRForm,
    hasPermission,
  };
};

export default usePurchaseRequisitionList;
