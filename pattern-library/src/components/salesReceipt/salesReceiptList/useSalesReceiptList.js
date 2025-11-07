import { useState, useMemo, useContext } from "react";
import { get_sales_receipts_with_out_drafts_api } from "../../../services/salesApi";
import { get_sales_receipts_by_user_id_api } from "../../../services/salesApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { UserContext } from "../../../context/userContext";

const useSalesReceiptList = () => {
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
  const [filter, setFilter] = useState("all");

  const queryClient = useQueryClient();

  const userId = sessionStorage.getItem("userId");
  const companyId = sessionStorage.getItem("companyId");

  const { activeCashierSession, activeCashierSessionLoading } =
    useContext(UserContext);

  // Retrieve the cashier session from session storage
  const isCashierSessionOpen = !!activeCashierSession;

  // Fetch User Permissions
  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
    error: permissionError,
  } = useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: async () => {
      const response = await get_user_permissions_api(userId);
      return response.data.result;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper function to check permissions
  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  // Check if user has "View All Sales Receipts" permission
  const canViewAllReceipts = hasPermission("View All Sales Receipts");

  // Fetch Sales Receipts Without Drafts (for users with "View All" permission)
  const {
    data: allSalesReceipts,
    isLoading: isLoadingAllReceipts,
    isError: isAllReceiptsError,
    error: allReceiptsError,
  } = useQuery({
    queryKey: ["salesReceiptsWithoutDrafts", companyId],
    queryFn: async () => {
      const response = await get_sales_receipts_with_out_drafts_api(companyId);
      return response.data.result || [];
    },
    enabled: !!companyId && !isLoadingPermissions && canViewAllReceipts,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch Sales Receipts by User ID
  const {
    data: userSalesReceipts,
    isLoading: isLoadingUserReceipts,
    isError: isUserReceiptsError,
    error: userReceiptsError,
  } = useQuery({
    queryKey: ["salesReceiptsByUserId", userId],
    queryFn: async () => {
      const response = await get_sales_receipts_by_user_id_api(userId);
      return response.data.result || [];
    },
    enabled: !!userId && !isLoadingPermissions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Combine and deduplicate sales receipts
  const salesReceipts = useMemo(() => {
    if (canViewAllReceipts) {
      const allReceipts = allSalesReceipts || [];
      const userReceipts = userSalesReceipts || [];

      // Find unique receipts from userReceipts that aren't in allReceipts
      const uniqueUserReceipts = userReceipts.filter(
        (receipt) =>
          !allReceipts.some(
            (existingReceipt) =>
              existingReceipt.salesReceiptId === receipt.salesReceiptId
          )
      );

      return [...allReceipts, ...uniqueUserReceipts];
    } else {
      return userSalesReceipts || [];
    }
  }, [allSalesReceipts, userSalesReceipts, canViewAllReceipts]);

  // Filter sales receipts based on selected filter
  const filteredSalesReceipts = useMemo(() => {
    return salesReceipts.filter((receipt) => {
      if (filter === "all") return true;
      if (filter === "outstanding") return receipt.outstandingAmount > 0;
      if (filter === "excess") return receipt.excessAmount > 0;
      return true;
    });
  }, [salesReceipts, filter]);

  // Determine loading state
  const isLoadingData = useMemo(() => {
    if (isLoadingPermissions) return true;
    if (canViewAllReceipts) {
      return isLoadingAllReceipts || isLoadingUserReceipts;
    }
    return isLoadingUserReceipts;
  }, [
    isLoadingPermissions,
    canViewAllReceipts,
    isLoadingAllReceipts,
    isLoadingUserReceipts,
  ]);

  // Determine error state
  const error = useMemo(() => {
    if (isPermissionsError) return "Error fetching permissions";
    if (isAllReceiptsError) return "Error fetching all receipts";
    if (isUserReceiptsError) return "Error fetching user receipts";
    return null;
  }, [isPermissionsError, isAllReceiptsError, isUserReceiptsError]);

  // Invalidate queries to refresh data
  const refreshData = () => {
    queryClient.invalidateQueries(["salesReceiptsWithoutDrafts", companyId]);
    queryClient.invalidateQueries(["salesReceiptsByUserId", userId]);
  };

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
    refreshData();
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
    refreshData();
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

  const closeAlertAfterDelay = () => {
    setTimeout(() => {
      setShowCreateSRForm(false);
    }, 3000);
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
    isCashierSessionOpen,
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
    refreshData,
  };
};

export default useSalesReceiptList;
