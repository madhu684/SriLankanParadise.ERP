import { useState, useMemo, useContext } from "react";
import { get_sales_receipts_with_out_drafts_api } from "../../../services/salesApi";
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

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const { activeCashierSession } = useContext(UserContext);

  // Retrieve the cashier session
  const isCashierSessionOpen = !!activeCashierSession;

  // Fetch Sales Receipts Without Drafts (for users with "View All" permission)
  const {
    data: salesReceipts,
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["salesReceipts", companyId],
    queryFn: async () => {
      const response = await get_sales_receipts_with_out_drafts_api(companyId);
      return response.data.result || [];
    },
    enabled: !!companyId,
  });

  // Filter sales receipts based on selected filter
  const filteredSalesReceipts = useMemo(() => {
    return salesReceipts
      ? salesReceipts?.filter((receipt) => {
          if (filter === "all") return true;
          if (filter === "outstanding") return receipt.outstandingAmount > 0;
          if (filter === "excess") return receipt.excessAmount > 0;
          return true;
        })
      : [];
  }, [salesReceipts, filter]);

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
    SRDetail,
    isCashierSessionOpen,
    filter,
    filteredSalesReceipts,
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
    handleUpdate,
    handleUpdated,
    handleClose,
    closeAlertAfterDelay,
    setFilter,
  };
};

export default useSalesReceiptList;
