import { useState, useMemo, useContext, useEffect, useCallback } from "react";
import {
  get_sales_invoices_with_out_drafts_api,
  get_sales_receipts_with_out_drafts_api,
} from "common/services/salesApi";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { UserContext } from "common/context/userContext";

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
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReverseSRForm, setShowReverseSRForm] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const { activeCashierSession, user } = useContext(UserContext);

  // Retrieve the cashier session
  const isCashierSessionOpen = !!activeCashierSession;

  // Debounce search query to prevent excessive API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch Sales Receipts Without Drafts (for users with "View All" permission)
  const {
    data: salesReceiptsData,
    isLoading: isLoadingData,
    isFetching: isFetchingReceipts,
    error,
  } = useQuery({
    queryKey: [
      "salesReceipts",
      companyId,
      filter,
      debouncedSearchQuery,
      pageNumber,
      pageSize,
    ],
    queryFn: async () => {
      const response = await get_sales_receipts_with_out_drafts_api({
        companyId,
        date: new Date().toISOString().split("T")[0],
        createdUserId: user?.userId,
        filter: filter,
        searchQuery: debouncedSearchQuery,
        pageNumber,
        pageSize,
      });
      return response.data.result;
    },
    enabled: !!companyId && !!user?.userId,
    placeholderData: keepPreviousData,
  });

  const salesReceipts = useMemo(
    () => salesReceiptsData?.data || [],
    [salesReceiptsData],
  );
  const paginationData = useMemo(
    () => salesReceiptsData?.pagination || null,
    [salesReceiptsData],
  );

  // Fetch Sales Invoices Without Drafts
  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
  } = useQuery({
    queryKey: ["salesInvoiceOptions", companyId],
    queryFn: async () => {
      const response = await get_sales_invoices_with_out_drafts_api({
        companyId,
        date: new Date().toISOString().split("T")[0],
        filter: "outstanding",
        status: 2,
      });

      return response.data.result || [];
    },
    enabled: !!companyId,
    placeholderData: keepPreviousData,
  });

  const approvedInvoices = invoices;
  const filteredSalesReceipts = salesReceipts;

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

  const handlePageChange = (page) => {
    setPageNumber(page);
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

  const handleReverseSR = () => {
    setShowReverseSRForm(true);
  };

  const handleCloseReverseSRForm = () => {
    setShowReverseSRForm(false);
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = salesReceipts.find((sr) => sr.salesReceiptId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id),
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.salesReceiptId !== id),
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
      (id) =>
        salesReceipts.find((sr) => sr.salesReceiptId === id)?.status === 1,
    );
  };

  const closeAlertAfterDelay = () => {
    setTimeout(() => {
      setShowCreateSRForm(false);
    }, 3000);
  };

  console.log(approvedInvoices);

  return {
    salesReceipts,
    invoices,
    approvedInvoices,
    isLoadingInvoices,
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
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    paginationData,
    handlePageChange,
    searchQuery,
    setSearchQuery,
    isFetchingData: isFetchingReceipts,
    showReverseSRForm,
    handleReverseSR,
    handleCloseReverseSRForm,
  };
};

export default useSalesReceiptList;
