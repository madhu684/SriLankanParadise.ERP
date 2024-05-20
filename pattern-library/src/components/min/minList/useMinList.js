import { useState, useEffect } from "react";
import { get_issue_masters_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_issue_masters_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useMinList = () => {
  const [mins, setMins] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
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
        if (hasPermission("Approve Material Issue Note")) {
          const minWithoutDraftsResponse =
            await get_issue_masters_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const minByUserIdResponse = await get_issue_masters_by_user_id_api(
            sessionStorage.getItem("userId")
          );

          let newMins = [];
          if (
            minWithoutDraftsResponse &&
            minWithoutDraftsResponse.data.result
          ) {
            newMins = minWithoutDraftsResponse.data.result?.filter(
              (im) => im.issueType === "MIN"
            );
          }

          let additionalMins = [];
          if (minByUserIdResponse && minByUserIdResponse.data.result) {
            additionalMins = minByUserIdResponse.data.result?.filter(
              (im) => im.issueType === "MIN"
            );
          }

          const uniqueNewMins = additionalMins.filter(
            (min) =>
              !newMins.some(
                (existingMin) => existingMin.issueMasterId === min.issueMasterId
              )
          );

          newMins = [...newMins, ...uniqueNewMins];
          setMins(newMins);
        } else {
          const minResponse = await get_issue_masters_by_user_id_api(
            sessionStorage.getItem("userId")
          );
          if (
            minResponse.data.result?.filter((im) => im.issueType === "MIN") ===
            (null || undefined)
          ) {
            setMins([]);
          } else {
            setMins(
              minResponse.data.result?.filter((im) => im.issueType === "MIN")
            );
          }
        }
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoadingPermissions, userPermissions]);

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
    fetchData();
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
    fetchData();
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
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.issueMasterId !== id)
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

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  return {
    mins,
    isLoadingData,
    isLoadingPermissions,
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
    userPermissions,
    MinDetail,
    isLoadingPermissions,
    isPermissionsError,
    permissionError,
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
