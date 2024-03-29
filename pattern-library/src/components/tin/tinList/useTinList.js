import { useState, useEffect } from "react";
import { get_issue_masters_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_issue_masters_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useTinList = () => {
  const [Tins, setTins] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveTinModal, setShowApproveTinModal] = useState(false);
  const [showApproveTinModalInParent, setShowApproveTinModalInParent] =
    useState(false);
  const [showDetailTinModal, setShowDetailTinModal] = useState(false);
  const [showDetailTinModalInParent, setShowDetailTinModalInParent] =
    useState(false);
  const [showCreateTinForm, setShowCreateTinForm] = useState(false);
  const [showUpdateTinForm, setShowUpdateTinForm] = useState(false);
  const [TinDetail, setTinDetail] = useState("");

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
        if (hasPermission("Approve Goods Received Note")) {
          const tinWithoutDraftsResponse =
            await get_issue_masters_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const tinByUserIdResponse = await get_issue_masters_by_user_id_api(
            sessionStorage.getItem("userId")
          );

          let newTins = [];
          if (
            tinWithoutDraftsResponse &&
            tinWithoutDraftsResponse.data.result
          ) {
            newTins = tinWithoutDraftsResponse.data.result?.filter(
              (im) => im.issueType === "TIN"
            );
          }

          let additionalTins = [];
          if (tinByUserIdResponse && tinByUserIdResponse.data.result) {
            additionalTins = tinByUserIdResponse.data.result?.filter(
              (im) => im.issueType === "TIN"
            );
          }

          const uniqueNewTins = additionalTins.filter(
            (tin) =>
              !newTins.some(
                (existingTin) => existingTin.issueMasterId === tin.issueMasterId
              )
          );

          newTins = [...newTins, ...uniqueNewTins];
          setTins(newTins);
        } else {
          const tinResponse = await get_issue_masters_by_user_id_api(
            sessionStorage.getItem("userId")
          );
          if (
            tinResponse.data.result?.filter((im) => im.issueType === "TIN") ===
            (null || undefined)
          ) {
            setTins([]);
          } else {
            setTins(
              tinResponse.data.result?.filter((im) => im.issueType === "TIN")
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

  const handleShowApproveTinModal = () => {
    setShowApproveTinModal(true);
    setShowApproveTinModalInParent(true);
  };

  const handleCloseApproveTinModal = () => {
    setShowApproveTinModal(false);
    handleCloseApproveTinModalInParent();
  };

  const handleCloseApproveTinModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveTinModalInParent(false);
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

  const handleShowDetailTinModal = () => {
    setShowDetailTinModal(true);
    setShowDetailTinModalInParent(true);
  };

  const handleCloseDetailTinModal = () => {
    setShowDetailTinModal(false);
    handleCloseDetailTinModalInParent();
  };

  const handleCloseDetailTinModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailTinModalInParent(false);
      setTinDetail("");
    }, delay);
  };

  const handleViewDetails = (Tin) => {
    setTinDetail(Tin);
    handleShowDetailTinModal();
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setTinDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateTinForm(false);
    setTinDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = Tins.find((pr) => pr.issueMasterId === id);

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
      const Tin = Tins.find((Tin) => Tin.issueMasterId === id);
      return Tin && Tin.status && Tin.status.toString().charAt(1) === "1";
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
    Tins,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveTinModal,
    showApproveTinModalInParent,
    showDetailTinModal,
    showDetailTinModalInParent,
    selectedRowData,
    showCreateTinForm,
    showUpdateTinForm,
    userPermissions,
    TinDetail,
    isLoadingPermissions,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveTinModal,
    handleCloseApproveTinModal,
    handleShowDetailTinModal,
    handleCloseDetailTinModal,
    handleApproved,
    setShowCreateTinForm,
    setShowUpdateTinForm,
    hasPermission,
    handleUpdated,
    handleClose,
  };
};

export default useTinList;
