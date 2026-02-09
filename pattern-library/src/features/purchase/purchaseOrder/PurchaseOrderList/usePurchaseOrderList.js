import { useContext, useState } from "react";
import { get_purchase_orders_api } from "common/services/purchaseApi";

import { useQuery } from "@tanstack/react-query";
import { UserContext } from "common/context/userContext";

const usePurchaseOrderList = () => {
  const { user, hasPermission, isLoadingPermissions, isPermissionsError } =
    useContext(UserContext);

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
  const [showDeletePOForm, setShowDeletePOForm] = useState(false);
  const [PODetail, setPODetail] = useState("");

  const {
    data: purchaseOrderResponse,
    isLoading: isLoadingData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["purchaseOrders", user?.companyId],
    queryFn: () => get_purchase_orders_api(user?.companyId),
    enabled: !!user?.companyId && !isLoadingPermissions,
  });

  const purchaseOrders = purchaseOrderResponse?.data?.result || [];

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
    refetch();
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
    refetch();
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

  // const handleRowSelect = (id) => {
  //   const isSelected = selectedRows.includes(id);
  //   const selectedRow = purchaseOrders.find((pr) => pr.purchaseOrderId === id);

  //   if (isSelected) {
  //     setSelectedRows((prevSelected) =>
  //       prevSelected.filter((selectedId) => selectedId !== id)
  //     );
  //     setSelectedRowData((prevSelectedData) =>
  //       prevSelectedData.filter((data) => data.purchaseOrderId !== id)
  //     );
  //   } else {

  //     setSelectedRows((prevSelected) => [...prevSelected, id]);
  //     setSelectedRowData((prevSelectedData) => [
  //       ...prevSelectedData,
  //       selectedRow,
  //     ]);
  //   }
  // };

  const handleRowSelect = (id) => {
    const selectedRow = purchaseOrders.find((pr) => pr.purchaseOrderId === id);
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
    // return selectedRows.some(
    //   (id) =>
    //     purchaseOrders.find((po) => po.purchaseOrderId === id)?.status === 1
    // );
    return selectedRows.some((id) => {
      const po = purchaseOrders.find((po) => po.purchaseOrderId === id);
      return po && (po.status === 0 || po.status === 1);
    });
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
    PODetail,
    isPermissionsError,
    showDeletePOForm,
    refetch,
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
    setShowDeletePOForm,
  };
};

export default usePurchaseOrderList;













