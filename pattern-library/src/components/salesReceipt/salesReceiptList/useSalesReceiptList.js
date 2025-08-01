import { useState, useEffect } from "react";
import { get_sales_receipts_with_out_drafts_api } from "../../../services/salesApi";
import { get_sales_receipts_by_user_id_api } from "../../../services/salesApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useSalesReceiptList = () => {
  const [salesReceipts, setSalesReceipts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveSRModal, setShowApproveSRModal] = useState(false);
  const [showApproveSRModalInParent, setShowApproveSRModalInParent] =
    useState(false);
  const [showDetailSRModal, setShowDetailSRModal] = useState(false);
  const [showDetailSRModalInParent, setShowDetailSRModalInParent] =
    useState(false);
  const [showCreateSRForm, setShowCreateSRForm] = useState(false);
  const [showUpdateSRForm, setShowUpdateSRForm] = useState(false);
  const [SRDetail, setSRDetail] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'Outstanding', 'excess'

  const filteredSalesReceipts = salesReceipts.filter((receipt) => {
    if (filter === "all") return true;
    if (filter === "outstanding") return receipt.outstandingAmount > 0;
    if (filter === "excess") return receipt.excessAmount > 0;
    return true;
  });

  // Retrieve the cashier session from session storage
  const cashierSessionJson = sessionStorage.getItem("cashierSession");

  // Parse the JSON string to convert it into a JavaScript object
  const cashierSession = JSON.parse(cashierSessionJson);

  // Check if the cashier session is open
  const cashierSessionOpen = cashierSession !== null;

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
        if (hasPermission("View All Sales Receipts")) {
          const salesReceiptWithoutDraftsResponse =
            await get_sales_receipts_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const salesReceiptByUserIdResponse =
            await get_sales_receipts_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newSalesReceipts = [];
          if (
            salesReceiptWithoutDraftsResponse &&
            salesReceiptWithoutDraftsResponse.data.result
          ) {
            newSalesReceipts = salesReceiptWithoutDraftsResponse.data.result;
          }

          let additionalReceipts = [];
          if (
            salesReceiptByUserIdResponse &&
            salesReceiptByUserIdResponse.data.result
          ) {
            additionalReceipts = salesReceiptByUserIdResponse.data.result;
          }
          //let newSalesReceipts = salesReceiptWithoutDraftsResponse.data.result;
          // const additionalReceipts = salesReceiptByUserIdResponse.data.result;

          const uniqueNewReceipts = additionalReceipts.filter(
            (receipt) =>
              !newSalesReceipts.some(
                (existingReceipt) =>
                  existingReceipt.salesReceiptId === receipt.salesReceiptId
              )
          );

          newSalesReceipts = [...newSalesReceipts, ...uniqueNewReceipts];
          setSalesReceipts(newSalesReceipts);
        } else {
          const SalesReceiptResponse = await get_sales_receipts_by_user_id_api(
            sessionStorage.getItem("userId")
          );
          setSalesReceipts(SalesReceiptResponse.data.result || []);
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

  const handleShowApproveSRModal = () => {
    setShowApproveSRModal(true);
    setShowApproveSRModalInParent(true);
  };

  const handleCloseApproveSRModal = () => {
    setShowApproveSRModal(false);
    handleCloseApproveSRModalInParent();
  };

  const handleCloseApproveSRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveSRModalInParent(false);
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

  const handleShowDetailSRModal = () => {
    setShowDetailSRModal(true);
    setShowDetailSRModalInParent(true);
  };

  const handleCloseDetailSRModal = () => {
    setShowDetailSRModal(false);
    handleCloseDetailSRModalInParent();
  };

  const handleCloseDetailSRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailSRModalInParent(false);
      setSRDetail("");
    }, delay);
  };

  const handleViewDetails = (salesReceipt) => {
    setSRDetail(salesReceipt);
    handleShowDetailSRModal();
  };

  const handleUpdate = (salesReceipt) => {
    setSRDetail(salesReceipt);
    setShowUpdateSRForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setSRDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateSRForm(false);
    setSRDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = salesReceipts.find((sr) => sr.salesReceiptId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.salesReceiptId !== id)
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
      1: "Created",
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
      (id) => salesReceipts.find((sr) => sr.salesReceiptId === id)?.status === 1
    );
  };

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  const closeAlertAfterDelay = () => {
    setTimeout(() => {
      setShowCreateSRForm(false);
    }, 3000); // Close the alert after 3000 milliseconds (3 seconds)
  };

  return {
    salesReceipts,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveSRModal,
    showApproveSRModalInParent,
    showDetailSRModal,
    showDetailSRModalInParent,
    selectedRowData,
    showCreateSRForm,
    showUpdateSRForm,
    userPermissions,
    SRDetail,
    isPermissionsError,
    cashierSessionOpen,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveSRModal,
    handleCloseApproveSRModal,
    handleShowDetailSRModal,
    handleCloseDetailSRModal,
    handleApproved,
    setShowCreateSRForm,
    setShowUpdateSRForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    closeAlertAfterDelay,
    filter,
    setFilter,
    filteredSalesReceipts,
  };
};

export default useSalesReceiptList;
