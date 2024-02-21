import { useState, useEffect } from "react";
import { get_purchase_orders_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_purchase_orders_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";

const usePurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
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
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const fetchUserPermissions = async () => {
    try {
      const userPermissionsResponse = await get_user_permissions_api(
        sessionStorage.getItem("userId")
      );
      setUserPermissions(Object.freeze(userPermissionsResponse.data.result));
    } catch (error) {
      setError("Error fetching permissions");
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const fetchData = async () => {
    try {
      if (!isLoadingPermissions && userPermissions) {
        if (hasPermission("Approve Purchase Order")) {
          // const purchaseOrderResponse =
          //   await get_purchase_orders_with_out_drafts_api();
          // setPurchaseOrders(purchaseOrderResponse.data.result);

          const purchaseOrderWithoutDraftsResponse =
            await get_purchase_orders_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const purchaseOrderByUserIdResponse =
            await get_purchase_orders_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newPurchaseOrders =
            purchaseOrderWithoutDraftsResponse.data.result;
          const additionalOrders = purchaseOrderByUserIdResponse.data.result;

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
          setPurchaseOrders(purchaseOrderResponse.data.result);
        }
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
    }, delay);
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
  };
};

export default usePurchaseOrderList;
