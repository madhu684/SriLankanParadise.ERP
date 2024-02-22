import { useState, useEffect } from "react";
import { get_sales_orders_with_out_drafts_api } from "../../../services/salesApi";
import { get_sales_orders_by_user_id_api } from "../../../services/salesApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";

const useSalesOrderList = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveSOModal, setShowApproveSOModal] = useState(false);
  const [showApproveSOModalInParent, setShowApproveSOModalInParent] =
    useState(false);
  const [showDetailSOModal, setShowDetailSOModal] = useState(false);
  const [showDetailSOModalInParent, setShowDetailSOModalInParent] =
    useState(false);
  const [showCreateSOForm, setShowCreateSOForm] = useState(false);
  const [showUpdateSOForm, setShowUpdateSOForm] = useState(false);
  const [SODetail, setSODetail] = useState("");
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
        if (hasPermission("Approve Sales Order")) {
          const SalesOrderWithoutDraftsResponse =
            await get_sales_orders_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const SalesOrderByUserIdResponse =
            await get_sales_orders_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newSalesOrders = [];
          if (
            SalesOrderWithoutDraftsResponse &&
            SalesOrderWithoutDraftsResponse.data.result
          ) {
            newSalesOrders = SalesOrderWithoutDraftsResponse.data.result;
          }

          let additionalOrders = [];
          if (
            SalesOrderByUserIdResponse &&
            SalesOrderByUserIdResponse.data.result
          ) {
            additionalOrders = SalesOrderByUserIdResponse.data.result;
          }
          //let newSalesOrders = SalesOrderWithoutDraftsResponse.data.result;
          //const additionalOrders = SalesOrderByUserIdResponse.data.result;

          const uniqueNewOrders = additionalOrders.filter(
            (order) =>
              !newSalesOrders.some(
                (existingOrder) =>
                  existingOrder.salesOrderId === order.salesOrderId
              )
          );

          newSalesOrders = [...newSalesOrders, ...uniqueNewOrders];
          setSalesOrders(newSalesOrders);
        } else {
          const SalesOrderResponse = await get_sales_orders_by_user_id_api(
            sessionStorage.getItem("userId")
          );
          setSalesOrders(SalesOrderResponse.data.result);
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

  const handleShowApproveSOModal = () => {
    setShowApproveSOModal(true);
    setShowApproveSOModalInParent(true);
  };

  const handleCloseApproveSOModal = () => {
    setShowApproveSOModal(false);
    handleCloseApproveSOModalInParent();
  };

  const handleCloseApproveSOModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveSOModalInParent(false);
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

  const handleShowDetailSOModal = () => {
    setShowDetailSOModal(true);
    setShowDetailSOModalInParent(true);
  };

  const handleCloseDetailSOModal = () => {
    setShowDetailSOModal(false);
    handleCloseDetailSOModalInParent();
  };

  const handleCloseDetailSOModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailSOModalInParent(false);
      setSODetail("");
    }, delay);
  };

  const handleViewDetails = (salesOrder) => {
    setSODetail(salesOrder);
    handleShowDetailSOModal();
  };

  const handleUpdate = (salesOrder) => {
    setSODetail(salesOrder);
    setShowUpdateSOForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setSODetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateSOForm(false);
    setSODetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = salesOrders.find((so) => so.salesOrderId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.salesOrderId !== id)
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
      (id) => salesOrders.find((so) => so.salesOrderId === id)?.status === 1
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
    salesOrders,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveSOModal,
    showApproveSOModalInParent,
    showDetailSOModal,
    showDetailSOModalInParent,
    selectedRowData,
    showCreateSOForm,
    showUpdateSOForm,
    userPermissions,
    SODetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveSOModal,
    handleCloseApproveSOModal,
    handleShowDetailSOModal,
    handleCloseDetailSOModal,
    handleApproved,
    setShowCreateSOForm,
    setShowUpdateSOForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
  };
};

export default useSalesOrderList;
