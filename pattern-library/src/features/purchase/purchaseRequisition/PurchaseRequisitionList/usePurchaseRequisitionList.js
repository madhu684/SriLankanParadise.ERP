import { useState, useContext } from "react";
import { get_paginated_purchase_requisitions_with_out_drafts_api } from "common/services/purchaseApi";
import { get_purchase_requisitions_by_user_id_api } from "common/services/purchaseApi";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "common/context/userContext";

const usePurchaseRequisitionList = () => {
  const { user, hasPermission, isLoadingPermissions, isPermissionsError } =
    useContext(UserContext);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApprovePRModal, setShowApprovePRModal] = useState(false);
  const [showApprovePRModalInParent, setShowApprovePRModalInParent] =
    useState(false);
  const [showDetailPRModal, setShowDetailPRModal] = useState(false);
  const [showDetailPRModalInParent, setShowDetailPRModalInParent] =
    useState(false);
  const [showCreatePRForm, setShowCreatePRForm] = useState(false);
  const [showUpdatePRForm, setShowUpdatePRForm] = useState(false);
  const [showConvertPRForm, setShowConvertPRForm] = useState(false);
  const [PRDetail, setPRDetail] = useState("");
  const [showDeletePRForm, setShowDeletePRForm] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPurchaseRequisitions = async () => {
    if (hasPermission("Approve Purchase Requisition")) {
      const purchaseRequisitionWithoutDraftsResponse =
        await get_paginated_purchase_requisitions_with_out_drafts_api({
          companyId: user?.companyId,
          pageNumber,
          pageSize
        });

      setTotalCount(purchaseRequisitionWithoutDraftsResponse?.result?.pagination?.totalCount || 0);
      setTotalPages(purchaseRequisitionWithoutDraftsResponse?.result?.pagination?.totalPages || 0);

      return purchaseRequisitionWithoutDraftsResponse?.result?.data || [];

    } else {
      const purchaseRequisitionResponse =
        await get_purchase_requisitions_by_user_id_api(
          user?.userId
        );
      return purchaseRequisitionResponse?.data?.result || [];
    }
  };

  const {
    data: purchaseRequisitions = [],
    isLoading: isLoadingData,
    isError: isError,
    error: error,
    refetch,
  } = useQuery({
    queryKey: ["purchaseRequisitions", user?.companyId, user?.userId, pageNumber, pageSize],
    queryFn: fetchPurchaseRequisitions,
    enabled: !!user?.companyId && !isLoadingPermissions,
  });

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
    refetch();
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

  const handleUpdate = (purchaseRequisition) => {
    setPRDetail(purchaseRequisition);
    setShowUpdatePRForm(true);
  };

  const handleUpdated = async () => {
    refetch();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setPRDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdatePRForm(false);
    setShowConvertPRForm(false);
    setPRDetail("");
  };

  const handleConvert = (purchaseRequisition) => {
    setPRDetail(purchaseRequisition);
    setShowConvertPRForm(true);
  };

  const handleRowSelect = (id) => {
    const selectedRow = purchaseRequisitions.find(
      (pr) => pr.purchaseRequisitionId === id
    );
    const isSelected = selectedRows.includes(id);

    if (isSelected) {
      // If already selected, uncheck it
      setSelectedRows([]);
      setSelectedRowData([]);
    } else {
      // Deselect previous and select only the new one
      setSelectedRows([id]);
      setSelectedRowData([selectedRow]);
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
    return selectedRows.some((id) => {
      const po = purchaseRequisitions.find(
        (po) => po.purchaseRequisitionId === id
      );
      return po && (po.status === 0 || po.status === 1);
    });
  };

  const areAnySelectedRowsApproved = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        purchaseRequisitions.find((pr) => pr.purchaseRequisitionId === id)
          ?.status === 2
    );
  };

  return {
    purchaseRequisitions,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApprovePRModal,
    showApprovePRModalInParent,
    showDetailPRModal,
    showDetailPRModalInParent,
    selectedRowData,
    showCreatePRForm,
    showUpdatePRForm,
    PRDetail,
    showConvertPRForm,
    isPermissionsError,
    permissionError: error,
    showDeletePRForm,
    refetch,
    setShowDeletePRForm,
    areAnySelectedRowsPending,
    areAnySelectedRowsApproved,
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
    setShowUpdatePRForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConvert,
    setShowConvertPRForm,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    totalCount,
    totalPages,
  };
};

export default usePurchaseRequisitionList;













