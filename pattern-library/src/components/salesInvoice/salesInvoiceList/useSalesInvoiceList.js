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
  const [showCreateSIForm, setShowCreateSIForm] = useState(false);
  const [showUpdateSIForm, setShowUpdateSIForm] = useState(false);
  const [SIDetail, setSIDetail] = useState("");

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
          //let newSalesInvoices = SalesInvoiceWithoutDraftsResponse.data.result;
          //const additionalInvoices = SalesInvoiceByUserIdResponse.data.result;

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
          setSalesInvoices(SalesInvoiceResponse.data.result);
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

  const handleApproved = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailSIModal = () => {
    setShowDetailSIModal(true);
    setShowDetailSIModalInParent(true);
  };

  const handleCloseDetailSIModal = () => {
    setShowDetailSIModal(false);
    handleCloseDetailSIModalInParent();
  };

  const handleCloseDetailSIModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailSIModalInParent(false);
      setSIDetail("");
    }, delay);
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
      (id) => salesInvoices.find((si) => si.salesInvoiceId === id)?.status === 1
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
    selectedRowData,
    showCreateSIForm,
    showUpdateSIForm,
    userPermissions,
    SIDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveSIModal,
    handleCloseApproveSIModal,
    handleShowDetailSIModal,
    handleCloseDetailSIModal,
    handleApproved,
    setShowCreateSIForm,
    setShowUpdateSIForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
  };
};

export default useSalesInvoiceList;
