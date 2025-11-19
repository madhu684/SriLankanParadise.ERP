import { useCallback, useMemo, useState } from "react";
import { get_sales_invoices_with_out_drafts_api } from "../../../services/salesApi";
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

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  // Fetch sales invoices without drafts
  const {
    data: salesInvoices = [],
    isLoading: isLoadingSalesInvoices,
    error,
  } = useQuery({
    queryKey: ["salesInvoices", companyId],
    queryFn: async () => {
      const response = await get_sales_invoices_with_out_drafts_api(companyId);
      return response.data.result || [];
    },
    enabled: !!companyId,
  });

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

  const handleRowSelect = useCallback(
    (id) => {
      const isSelected = selectedRows.includes(id);
      const selectedRow = salesInvoices?.find((si) => si.salesInvoiceId === id);

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
    },
    [salesInvoices, selectedRows]
  );

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

  const areAnySelectedRowsPending = useCallback(
    (selectedRows) => {
      return selectedRows.some(
        (id) =>
          salesInvoices?.find((si) => si.salesInvoiceId === id)?.status === 1
      );
    },
    [salesInvoices]
  );

  const areAnySelectedRowsApproved = useCallback(
    (selectedRows) => {
      return selectedRows.some(
        (id) =>
          salesInvoices?.find((si) => si.salesInvoiceId === id)?.status === 2
      );
    },
    [salesInvoices]
  );

  return {
    salesInvoices,
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
    SIDetail,
    showDeleteSIForm,
    isLoadingSalesInvoices,
    error,
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
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDetailSIModal,
  };
};

export default useSalesInvoiceList;
