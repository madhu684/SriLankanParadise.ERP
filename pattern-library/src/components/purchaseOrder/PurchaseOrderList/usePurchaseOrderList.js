import { useState, useEffect } from "react";
import { get_purchase_orders_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_purchase_orders_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";

const usePurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApprovePOModal, setShowApprovePOModal] = useState(false);
  const [showApprovePOModalInParent, setShowApprovePOModalInParent] =
    useState(false);
  const [showDetailPOModal, setShowDetailPOModal] = useState(false);
  const [showDetailPOModalInParent, setShowDetailPOModalInParent] =
    useState(false);
  const [showCreatePOForm, setShowCreatePOForm] = useState(false);
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
      if (hasPermission("Approve Purchase Order")) {
        const purchaseOrderResponse =
          await get_purchase_orders_with_out_drafts_api();
        setPurchaseOrders(purchaseOrderResponse.data.result);
      } else {
        const purchaseOrderResponse = await get_purchase_orders_by_user_id_api(
          sessionStorage.getItem("userId")
        );
        setPurchaseOrders(purchaseOrderResponse.data.result);
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

  const handleShowApprovePOModal = () => {
    setShowApprovePOModal(true);
    setShowApprovePOModalInParent(true);
  };

  const handleCloseApprovePOModal = () => {
    setShowApprovePOModal(false);
    handleCloseApprovePOModalInParent();
  };

  const handleCloseApprovePOModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApprovePOModalInParent(false);
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

  const handleShowDetailPOModal = () => {
    setShowDetailPOModal(true);
    setShowDetailPOModalInParent(true);
  };

  const handleCloseDetailPOModal = () => {
    setShowDetailPOModal(false);
    handleCloseDetailPOModalInParent();
  };

  const handleCloseDetailPOModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailPOModalInParent(false);
      setPRDetail("");
    }, delay);
  };

  const handleViewDetails = (purchaseOrder) => {
    setPRDetail(purchaseOrder);
    handleShowDetailPOModal();
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = purchaseOrders.find((pr) => pr.purchaseOrderId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.purchaseOrderId !== id)
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
        purchaseOrders.find((pr) => pr.purchaseOrderId === id)?.status === 1
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
    purchaseOrders,
    isLoading,
    error,
    isAnyRowSelected,
    selectedRows,
    showApprovePOModal,
    showApprovePOModalInParent,
    showDetailPOModal,
    showDetailPOModalInParent,
    selectedRowData,
    showCreatePOForm,
    userPermissions,
    PRDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApprovePOModal,
    handleCloseApprovePOModal,
    handleShowDetailPOModal,
    handleCloseDetailPOModal,
    handleApproved,
    setShowCreatePOForm,
    hasPermission,
  };
};

export default usePurchaseOrderList;
