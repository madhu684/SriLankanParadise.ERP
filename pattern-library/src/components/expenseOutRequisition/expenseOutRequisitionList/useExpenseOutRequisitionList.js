import { useState, useEffect } from "react";
import { get_expense_out_requisitions_api } from "../../../services/salesApi";
import { get_expense_out_requisitions_by_user_id_api } from "../../../services/salesApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useExpenseOutRequisitionList = () => {
  const [expenseOutRequisitions, setExpenseOutRequisitions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
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
        if (hasPermission("View All Expense Out Requisitions")) {
          const ExpenseOutRequisitionWithoutDraftsResponse =
            await get_expense_out_requisitions_api(
              sessionStorage.getItem("companyId")
            );

          const ExpenseOutRequisitionByUserIdResponse =
            await get_expense_out_requisitions_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newExpenseOutRequisitions = [];
          if (
            ExpenseOutRequisitionWithoutDraftsResponse &&
            ExpenseOutRequisitionWithoutDraftsResponse.data.result
          ) {
            newExpenseOutRequisitions =
              ExpenseOutRequisitionWithoutDraftsResponse.data.result;
          }

          let additionalOrders = [];
          if (
            ExpenseOutRequisitionByUserIdResponse &&
            ExpenseOutRequisitionByUserIdResponse.data.result
          ) {
            additionalOrders =
              ExpenseOutRequisitionByUserIdResponse.data.result;
          }
          //let newExpenseOutRequisitions = ExpenseOutRequisitionWithoutDraftsResponse.data.result;
          //const additionalOrders = ExpenseOutRequisitionByUserIdResponse.data.result;

          const uniqueNewOrders = additionalOrders.filter(
            (order) =>
              !newExpenseOutRequisitions.some(
                (existingOrder) =>
                  existingOrder.ExpenseOutRequisitionId ===
                  order.ExpenseOutRequisitionId
              )
          );

          newExpenseOutRequisitions = [
            ...newExpenseOutRequisitions,
            ...uniqueNewOrders,
          ];
          setExpenseOutRequisitions(newExpenseOutRequisitions);
        } else {
          const ExpenseOutRequisitionResponse =
            await get_expense_out_requisitions_by_user_id_api(
              sessionStorage.getItem("userId")
            );
          setExpenseOutRequisitions(ExpenseOutRequisitionResponse.data.result);
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
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleExpensedOut = async () => {
    fetchData();
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
    fetchData();
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
      (eor) => eor.expenseOutRequisitionId === id
    );

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.expenseOutRequisitionId !== id)
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
          ?.status === 1
    );
  };

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  const areAnySelectedRowsPendingApproval = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        expenseOutRequisitions.find((eor) => eor.expenseOutRequisitionId === id)
          ?.status === 2
    );
  };

  return {
    expenseOutRequisitions,
    isLoadingData,
    isLoadingPermissions,
    isPermissionsError,
    permissionError,
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
    userPermissions,
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
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    setShowConvertEORForm,
    handleExpensedOut,
  };
};

export default useExpenseOutRequisitionList;
