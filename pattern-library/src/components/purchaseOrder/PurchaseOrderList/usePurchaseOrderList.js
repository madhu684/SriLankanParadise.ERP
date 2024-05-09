import { useState, useEffect } from "react";
import { get_purchase_orders_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_purchase_orders_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
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
  const [showUpdatePOForm, setShowUpdatePOForm] = useState(false);
  const [PODetail, setPODetail] = useState("");

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
        if (hasPermission("Approve Purchase Order")) {
          const purchaseOrderWithoutDraftsResponse =
            await get_purchase_orders_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const purchaseOrderByUserIdResponse =
            await get_purchase_orders_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newPurchaseOrders = [];
          if (
            purchaseOrderWithoutDraftsResponse &&
            purchaseOrderWithoutDraftsResponse.data.result
          ) {
            newPurchaseOrders = purchaseOrderWithoutDraftsResponse.data.result;
          }

          let additionalOrders = [];
          if (
            purchaseOrderByUserIdResponse &&
            purchaseOrderByUserIdResponse.data.result
          ) {
            additionalOrders = purchaseOrderByUserIdResponse.data.result;
          }

          const uniqueNewOrders = additionalOrders.filter(
            (order) =>
              !newPurchaseOrders.some(
                (existingOrder) =>
                  existingOrder.purchaseOrderId === order.purchaseOrderId
              )
          );

          newPurchaseOrders = [...newPurchaseOrders, ...uniqueNewOrders];
          setPurchaseOrders(newPurchaseOrders);
        } else {
          const purchaseOrderResponse =
            await get_purchase_orders_by_user_id_api(
              sessionStorage.getItem("userId")
            );
          setPurchaseOrders(purchaseOrderResponse.data.result || []);
        }
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoadingPermissions, userPermissions]);

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
      setPODetail("");
    }, delay);
  };

  const handleViewDetails = (purchaseOrder) => {
    setPODetail(purchaseOrder);
    handleShowDetailPOModal();
  };

  const handleUpdate = (purchaseOrder) => {
    setPODetail(purchaseOrder);
    setShowUpdatePOForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setPODetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdatePOForm(false);
    setPODetail("");
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
        purchaseOrders.find((po) => po.purchaseOrderId === id)?.status === 1
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
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApprovePOModal,
    showApprovePOModalInParent,
    showDetailPOModal,
    showDetailPOModalInParent,
    selectedRowData,
    showCreatePOForm,
    showUpdatePOForm,
    userPermissions,
    PODetail,
    isLoadingPermissions,
    isPermissionsError,
    permissionError,
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
    setShowUpdatePOForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
  };
};

export default usePurchaseOrderList;
