import { useState } from "react";
import { get_expense_out_requisitions_api } from "../../../services/salesApi";
import { useQuery } from "@tanstack/react-query";

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

  const fetchExpenseOutRequisitions = async () => {
    const response = await get_expense_out_requisitions_api(
      sessionStorage.getItem("companyId"),
    );
    return response.data.result || [];
  };

  const {
    data: expenseOutRequisitions = [],
    isLoading: isLoadingData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["expenseOutRequisitions"],
    queryFn: fetchExpenseOutRequisitions,
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
