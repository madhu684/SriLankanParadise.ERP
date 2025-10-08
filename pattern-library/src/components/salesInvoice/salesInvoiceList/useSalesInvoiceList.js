import { useState } from "react";
import { get_sales_invoices_with_out_drafts_api } from "../../../services/salesApi";
import { get_sales_invoices_by_user_id_api } from "../../../services/salesApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useSalesInvoiceList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveSIModal, setShowApproveSIModal] = useState(false);
  const [showApproveSIModalInParent, setShowApproveSIModalInParent] =
    useState(false);
  const [showDetailSIModal, setShowDetailSIModal] = useState(false);
  const [showDetailSIModalInParent, setShowDetailSIModalInParent] =
    useState(false);
  const [showRightOffSIModal, setShowRightOffSIModal] = useState(false);
  const [showRightOffSIModalInParent, setShowRightOffSIModalInParent] =
    useState(false);
  const [showCreateSIForm, setShowCreateSIForm] = useState(false);
  const [showUpdateSIForm, setShowUpdateSIForm] = useState(false);
  const [SIDetail, setSIDetail] = useState("");
  const [showDeleteSIForm, setShowDeleteSIForm] = useState(false);

  // Fetch user permissions
  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
    error: permissionError,
  } = useQuery({
    queryKey: ["userPermissions", sessionStorage.getItem("userId")],
    queryFn: async () => {
      const response = await get_user_permissions_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    },
    enabled: !!sessionStorage.getItem("userId"),
  });

  // Helper function to check permissions
  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  // Fetch sales invoices without drafts
  const {
    data: salesInvoicesWithoutDrafts,
    isLoading: isLoadingSalesInvoicesWithoutDrafts,
    error: salesInvoicesWithoutDraftsError,
  } = useQuery({
    queryKey: [
      "salesInvoicesWithoutDrafts",
      sessionStorage.getItem("companyId"),
    ],
    queryFn: async () => {
      const response = await get_sales_invoices_with_out_drafts_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    },
    enabled: !isLoadingPermissions && hasPermission("Approve Sales Invoice"),
  });

  // Fetch sales invoices by user ID
  const {
    data: salesInvoicesByUserId,
    isLoading: isLoadingSalesInvoicesByUserId,
    error: salesInvoicesByUserIdError,
    refetch: refetchSalesInvoices,
  } = useQuery({
    queryKey: ["salesInvoicesByUserId", sessionStorage.getItem("userId")],
    queryFn: async () => {
      const response = await get_sales_invoices_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result || [];
    },
    enabled: !isLoadingPermissions && !!userPermissions,
  });

  // Combine and process sales invoices data
  const salesInvoices = (() => {
    if (isLoadingPermissions || !userPermissions) {
      return [];
    }

    if (hasPermission("Approve Sales Invoice")) {
      const invoicesWithoutDrafts = salesInvoicesWithoutDrafts || [];
      const invoicesByUserId = salesInvoicesByUserId || [];

      // Filter out duplicates
      const uniqueInvoicesByUserId = invoicesByUserId.filter(
        (invoice) =>
          !invoicesWithoutDrafts.some(
            (existingInvoice) =>
              existingInvoice.salesInvoiceId === invoice.salesInvoiceId
          )
      );

      return [...invoicesWithoutDrafts, ...uniqueInvoicesByUserId];
    } else {
      return salesInvoicesByUserId || [];
    }
  })();

  // Calculate loading state
  const isLoadingData =
    isLoadingPermissions ||
    (hasPermission("Approve Sales Invoice")
      ? isLoadingSalesInvoicesWithoutDrafts || isLoadingSalesInvoicesByUserId
      : isLoadingSalesInvoicesByUserId);

  // Calculate error state
  const error =
    permissionError ||
    salesInvoicesWithoutDraftsError ||
    salesInvoicesByUserIdError;

  const handleShowApproveSIModal = () => {
    setShowApproveSIModal(true);
    setShowApproveSIModalInParent(true);
  };

  const handleCloseApproveSIModal = () => {
    setShowApproveSIModal(false);
    handleCloseApproveSIModalInParent();
  };

  const handleCloseApproveSIModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveSIModalInParent(false);
    }, delay);
  };

  const handleShowRightOffSIModal = () => {
    setShowRightOffSIModal(true);
    setShowRightOffSIModalInParent(true);
  };

  const handleCloseRightOffSIModal = () => {
    setShowRightOffSIModal(false);
    handleCloseRightOffSIModalInParent();
  };

  const handleCloseRightOffSIModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowRightOffSIModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    // Refetch the data after approval
    await refetchSalesInvoices();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleRightOff = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);

    // Refetch data after right off operation
    await refetchSalesInvoices();
  };

  const handleShowDetailSIModal = () => {
    setShowDetailSIModal(true);
    setShowDetailSIModalInParent(true);
  };

  const handleCloseDetailSIModal = () => {
    setShowDetailSIModal(false);
    setShowDetailSIModalInParent(false);
    setSIDetail("");
  };

  const handleViewDetails = (salesInvoice) => {
    setSIDetail(salesInvoice);
    handleShowDetailSIModal();
  };

  const handleUpdate = (salesInvoice) => {
    setSIDetail(salesInvoice);
    setShowUpdateSIForm(true);
  };

  const handleUpdated = async () => {
    // Refetch data after update
    await refetchSalesInvoices();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setSIDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateSIForm(false);
    setSIDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = salesInvoices.find((si) => si.salesInvoiceId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.salesInvoiceId !== id)
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
      5: "Settled",
      6: "Cancelled",
      7: "On Hold",
      8: "Write Offed",
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
      8: "bg-danger",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) => salesInvoices.find((si) => si.salesInvoiceId === id)?.status === 1
    );
  };

  const areAnySelectedRowsApproved = (selectedRows) => {
    return selectedRows.some(
      (id) => salesInvoices.find((si) => si.salesInvoiceId === id)?.status === 2
    );
  };

  // Expose refetch function for external use
  const refetch = () => {
    refetchSalesInvoices();
  };

  return {
    salesInvoices,
    isLoadingData,
    isLoadingPermissions,
    isPermissionsError,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveSIModal,
    showApproveSIModalInParent,
    showDetailSIModal,
    showDetailSIModalInParent,
    showRightOffSIModal,
    showRightOffSIModalInParent,
    selectedRowData,
    showCreateSIForm,
    showUpdateSIForm,
    userPermissions,
    SIDetail,
    showDeleteSIForm,
    refetch,
    setShowDeleteSIForm,
    areAnySelectedRowsPending,
    areAnySelectedRowsApproved,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveSIModal,
    handleCloseApproveSIModal,
    handleShowRightOffSIModal,
    handleCloseRightOffSIModal,
    handleApproved,
    handleRightOff,
    setShowCreateSIForm,
    setShowUpdateSIForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDetailSIModal,
  };
};

export default useSalesInvoiceList;
