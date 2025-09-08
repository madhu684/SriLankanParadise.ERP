import { useState, useEffect } from "react";
import { get_sales_invoices_with_out_drafts_api } from "../../../services/salesApi";
import { get_sales_invoices_by_user_id_api } from "../../../services/salesApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useSalesInvoiceList = () => {
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
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

  const [refetch, setRefetch] = useState(false);

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
        if (hasPermission("Approve Sales Invoice")) {
          const SalesInvoiceWithoutDraftsResponse =
            await get_sales_invoices_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const SalesInvoiceByUserIdResponse =
            await get_sales_invoices_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newSalesInvoices = [];
          if (
            SalesInvoiceWithoutDraftsResponse &&
            SalesInvoiceWithoutDraftsResponse.data.result
          ) {
            newSalesInvoices = SalesInvoiceWithoutDraftsResponse.data.result;
          }

          let additionalInvoices = [];
          if (
            SalesInvoiceByUserIdResponse &&
            SalesInvoiceByUserIdResponse.data.result
          ) {
            additionalInvoices = SalesInvoiceByUserIdResponse.data.result;
          }

          const uniqueNewInvoices = additionalInvoices.filter(
            (invoice) =>
              !newSalesInvoices.some(
                (existinginvoice) =>
                  existinginvoice.salesInvoiceId === invoice.salesInvoiceId
              )
          );

          newSalesInvoices = [...newSalesInvoices, ...uniqueNewInvoices];
          setSalesInvoices(newSalesInvoices);
        } else {
          const SalesInvoiceResponse = await get_sales_invoices_by_user_id_api(
            sessionStorage.getItem("userId")
          );
          setSalesInvoices(SalesInvoiceResponse.data.result || []);
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
  }, [isLoadingPermissions, userPermissions, refetch]);

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
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleRightOff = async () => {
    // Update local state immediately to show the "Write Offed" status
    setSalesInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        selectedRows.includes(invoice.salesInvoiceId)
          ? { ...invoice, status: 8 } // Set to Write Offed status
          : invoice
      )
    );

    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);

    // Remove this line - don't call fetchData()
    // fetchData(); // <-- REMOVE THIS LINE
  };

  const handleShowDetailSIModal = () => {
    setShowDetailSIModal(true);
    setShowDetailSIModalInParent(true);
  };

  // const handleCloseDetailSIModal = () => {
  //   setShowDetailSIModal(false);
  //   handleCloseDetailSIModalInParent();
  // };

  // const handleCloseDetailSIModalInParent = () => {
  //   const delay = 300;
  //   setTimeout(() => {
  //     setShowDetailSIModalInParent(false);
  //     setSIDetail("");
  //   }, delay);
  // };

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
    fetchData();
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
      8: "Write Offed", // Add this new status
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
      8: "bg-danger", // Red color for Write Offed
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

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
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
    setRefetch,
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
