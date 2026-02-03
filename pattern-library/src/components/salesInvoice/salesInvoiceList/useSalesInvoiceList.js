import { useEffect, useState, useMemo } from "react";
import { get_paginated_sales_invoice_by_companyId } from "../../../services/salesApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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

  // New states for pagination and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page number when search or filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [debouncedSearchQuery, filterType]);

  // Get companyId from session storage
  const companyId = sessionStorage.getItem("companyId") || 1;

  // Calculate date based on filter
  // const currentDate =
  //   filterType === "outstanding"
  //     ? null
  //     : new Date().toISOString().split("T")[0];
  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch sales invoices using React Query
  const {
    data,
    isLoading: isLoadingData,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "salesInvoices",
      companyId,
      debouncedSearchQuery,
      filterType,
      pageNumber,
    ],
    queryFn: () =>
      get_paginated_sales_invoice_by_companyId({
        companyId,
        date: currentDate,
        searchQuery: debouncedSearchQuery || null,
        filter: filterType === "outstanding" ? "outstanding" : "all",
        pageNumber,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  // Extract sales invoices and pagination from response
  const salesInvoices = useMemo(
    () => data?.data?.result?.data || [],
    [data],
  );
  const pagination = useMemo(
    () =>
      data?.data?.result?.pagination || {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    [data],
  );

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
    await refetch();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleRightOff = async () => {
    await refetch();
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
    await refetch();
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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setFilterType(filter);
    setPageNumber(1);
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  return {
    salesInvoices,
    isLoadingData,
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
    SIDetail,
    showDeleteSIForm,
    searchQuery,
    filterType,
    pagination,
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
    handleSearch,
    handleFilterChange,
    handlePageChange,
    isFetchingData: isFetching,
    refetch,
  };
};

export default useSalesInvoiceList;
