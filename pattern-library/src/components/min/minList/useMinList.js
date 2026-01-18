import { useState, useContext } from "react";
import { get_issue_masters_by_user_id_api } from "../../../services/purchaseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../../context/userContext";

const useMinList = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useContext(UserContext);
  const userId = sessionStorage.getItem("userId");

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveMinModal, setShowApproveMinModal] = useState(false);
  const [showApproveMinModalInParent, setShowApproveMinModalInParent] =
    useState(false);
  const [showDetailMinModal, setShowDetailMinModal] = useState(false);
  const [showDetailMinModalInParent, setShowDetailMinModalInParent] =
    useState(false);
  const [showCreateMinForm, setShowCreateMinForm] = useState(false);
  const [showUpdateMinForm, setShowUpdateMinForm] = useState(false);
  const [MinDetail, setMinDetail] = useState("");

  const {
    data: mins = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["mins", userId],
    queryFn: async () => {
      const response = await get_issue_masters_by_user_id_api(userId);
      return response.data.result?.filter((im) => im.issueType === "MIN") || [];
    },
    enabled: !!userId,
  });

  const handleShowApproveMinModal = () => {
    setShowApproveMinModal(true);
    setShowApproveMinModalInParent(true);
  };

  const handleCloseApproveMinModal = () => {
    setShowApproveMinModal(false);
    handleCloseApproveMinModalInParent();
  };

  const handleCloseApproveMinModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveMinModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    queryClient.invalidateQueries(["mins", userId]);
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailMinModal = () => {
    setShowDetailMinModal(true);
    setShowDetailMinModalInParent(true);
  };

  const handleCloseDetailMinModal = () => {
    setShowDetailMinModal(false);
    handleCloseDetailMinModalInParent();
  };

  const handleCloseDetailMinModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailMinModalInParent(false);
      setMinDetail("");
    }, delay);
  };

  const handleViewDetails = (min) => {
    setMinDetail(min);
    handleShowDetailMinModal();
  };

  const handleUpdated = async () => {
    queryClient.invalidateQueries(["mins", userId]);
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setMinDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateMinForm(false);
    setMinDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = mins.find((pr) => pr.issueMasterId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id),
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.issueMasterId !== id),
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
    if (statusCode === null || statusCode === undefined) {
      return "Unknown Status";
    }

    const secondDigit = parseInt(String(statusCode).charAt(1), 10);

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

    return statusLabels[secondDigit] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    if (statusCode === null || statusCode === undefined) {
      return "Unknown Status";
    }

    const secondDigit = parseInt(String(statusCode).charAt(1), 10);

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

    return statusClasses[secondDigit] || "bg-secondary";
  };

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some((id) => {
      const min = mins.find((min) => min.issueMasterId === id);
      return min && min.status && min.status.toString().charAt(1) === "1";
    });
  };

  return {
    mins,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveMinModal,
    showApproveMinModalInParent,
    showDetailMinModal,
    showDetailMinModalInParent,
    selectedRowData,
    showCreateMinForm,
    showUpdateMinForm,
    MinDetail,
    isPermissionsError: false,
    permissionError: null,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveMinModal,
    handleCloseApproveMinModal,
    handleShowDetailMinModal,
    handleCloseDetailMinModal,
    handleApproved,
    setShowCreateMinForm,
    setShowUpdateMinForm,
    hasPermission,
    handleUpdated,
    handleClose,
  };
};

export default useMinList;
