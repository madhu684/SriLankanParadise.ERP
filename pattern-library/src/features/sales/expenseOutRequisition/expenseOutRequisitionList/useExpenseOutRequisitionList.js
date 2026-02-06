import { useState } from "react";
import { get_paginated_expense_out_requisitions_by_companyId_api } from "common/services/salesApi";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const useExpenseOutRequisitionList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveEORModal, setShowApproveEORModal] = useState(false);
  const [showApproveEORModalInParent, setShowApproveEORModalInParent] =
    useState(false);
  const [showDetailEORModal, setShowDetailEORModal] = useState(false);
  const [showDetailEORModalInParent, setShowDetailEORModalInParent] =
    useState(false);
  const [showCreateEORForm, setShowCreateEORForm] = useState(false);
  const [showUpdateEORForm, setShowUpdateEORForm] = useState(false);
  const [EORDetail, setEORDetail] = useState("");
  const [showConvertEORForm, setShowConvertEORForm] = useState(false);
  const [approvalType, setApprovalType] = useState("");

  // Pagination and Filter State
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterDate, setFilterDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchExpenseOutRequisitions = async () => {
    try {
      const response = await get_paginated_expense_out_requisitions_by_companyId_api({
        companyId: sessionStorage.getItem("companyId"),
        pageNumber,
        pageSize,
        date: filterDate,
      });

      // Handle nested structure: response.data.result or response.result
      const dataLayer = response.data || response.Data || response;
      const resultData = dataLayer.result || dataLayer.Result || dataLayer;

      if (resultData) {


        // Extract values with fallbacks
        const totalPages = resultData.totalPages || resultData.TotalPages || 0;
        const totalCount = resultData.totalCount || resultData.TotalCount || 0;
        const items = resultData.items || resultData.Items || [];

        setTotalPages(totalPages);
        setTotalCount(totalCount);


        return items;
      }


      return [];
    } catch (err) {
      console.error("Error fetching expense out requisitions:", err);
      throw err;
    }
  };

  const {
    data: expenseOutRequisitions = [],
    isLoading: isLoadingData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["expenseOutRequisitions", pageNumber, pageSize, filterDate],
    queryFn: fetchExpenseOutRequisitions,
    keepPreviousData: true,
  });

  const handleShowApproveEORModal = (approvalType) => {
    setApprovalType(approvalType);
    setShowApproveEORModal(true);
    setShowApproveEORModalInParent(true);
  };

  const handleCloseApproveEORModal = () => {
    setShowApproveEORModal(false);
    handleCloseApproveEORModalInParent();
  };

  const handleCloseApproveEORModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveEORModalInParent(false);
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

  const handleExpensedOut = async () => {
    refetch();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailEORModal = () => {
    setShowDetailEORModal(true);
    setShowDetailEORModalInParent(true);
  };

  const handleCloseDetailEORModal = () => {
    setShowDetailEORModal(false);
    handleCloseDetailEORModalInParent();
  };

  const handleCloseDetailEORModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailEORModalInParent(false);
      setEORDetail("");
    }, delay);
  };

  const handleViewDetails = (expenseOutRequisition) => {
    setEORDetail(expenseOutRequisition);
    handleShowDetailEORModal();
  };

  const handleUpdate = (expenseOutRequisition) => {
    setEORDetail(expenseOutRequisition);
    setShowUpdateEORForm(true);
  };

  const handleUpdated = async () => {
    refetch();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setEORDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateEORForm(false);
    setShowConvertEORForm(false);
    setEORDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = expenseOutRequisitions.find(
      (eor) => eor.expenseOutRequisitionId === id,
    );

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id),
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.expenseOutRequisitionId !== id),
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
      1: "Pending Recommendation",
      2: "Pending Approval",
      3: "Approved",
      4: "Expensed out",
    };

    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      0: "bg-secondary",
      1: "bg-warning",
      2: "bg-info",
      3: "bg-success",
      4: "bg-primary",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  const areAnySelectedRowsPendingRecommendation = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        expenseOutRequisitions.find((eor) => eor.expenseOutRequisitionId === id)
          ?.status === 1,
    );
  };

  const areAnySelectedRowsPendingApproval = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        expenseOutRequisitions.find((eor) => eor.expenseOutRequisitionId === id)
          ?.status === 2,
    );
  };

  return {
    expenseOutRequisitions,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveEORModal,
    showApproveEORModalInParent,
    showDetailEORModal,
    showDetailEORModalInParent,
    selectedRowData,
    showCreateEORForm,
    showUpdateEORForm,
    EORDetail,
    showConvertEORForm,
    approvalType,
    areAnySelectedRowsPendingRecommendation,
    areAnySelectedRowsPendingApproval,
    pageNumber,
    pageSize,
    filterDate,
    totalPages,
    totalCount,
    setPageNumber,
    setPageSize,
    setFilterDate,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveEORModal,
    handleCloseApproveEORModal,
    handleShowDetailEORModal,
    handleCloseDetailEORModal,
    handleApproved,
    setShowCreateEORForm,
    setShowUpdateEORForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    setShowConvertEORForm,
    handleExpensedOut,
  };
};

export default useExpenseOutRequisitionList;













