import { useState, useEffect } from "react";
import { get_grn_masters_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_grn_masters_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useGrnList = () => {
  const [Grns, setGrns] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveGrnModal, setShowApproveGrnModal] = useState(false);
  const [showApproveGrnModalInParent, setShowApproveGrnModalInParent] =
    useState(false);
  const [showDetailGrnModal, setShowDetailGrnModal] = useState(false);
  const [showDetailGrnModalInParent, setShowDetailGrnModalInParent] =
    useState(false);
  const [showCreateGrnForm, setShowCreateGrnForm] = useState(false);
  const [showUpdateGrnForm, setShowUpdateGrnForm] = useState(false);
  const [GRNDetail, setGRNDetail] = useState("");

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
          const GrnWithoutDraftsResponse =
            await get_grn_masters_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const GrnByUserIdResponse = await get_grn_masters_by_user_id_api(
            sessionStorage.getItem("userId")
          );

          let newGrns = [];
          if (
            GrnWithoutDraftsResponse &&
            GrnWithoutDraftsResponse.data.result
          ) {
            newGrns = GrnWithoutDraftsResponse.data.result;
          }

          let additionalGrns = [];
          if (GrnByUserIdResponse && GrnByUserIdResponse.data.result) {
            additionalGrns = GrnByUserIdResponse.data.result;
          }

          const uniqueNewGrns = additionalGrns.filter(
            (grn) =>
              !newGrns.some(
                (existingGrn) => existingGrn.grnMasterId === grn.grnMasterId
              )
          );

          newGrns = [...newGrns, ...uniqueNewGrns];
          setGrns(newGrns);
        } else {
          const GrnResponse = await get_grn_masters_by_user_id_api(
            sessionStorage.getItem("userId")
          );
          setGrns(GrnResponse.data.result || []);
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

  const handleShowApproveGrnModal = () => {
    setShowApproveGrnModal(true);
    setShowApproveGrnModalInParent(true);
  };

  const handleCloseApproveGrnModal = () => {
    setShowApproveGrnModal(false);
    handleCloseApproveGrnModalInParent();
  };

  const handleCloseApproveGrnModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveGrnModalInParent(false);
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

  const handleShowDetailGrnModal = () => {
    setShowDetailGrnModal(true);
    setShowDetailGrnModalInParent(true);
  };

  const handleCloseDetailGrnModal = () => {
    setShowDetailGrnModal(false);
    handleCloseDetailGrnModalInParent();
  };

  const handleCloseDetailGrnModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailGrnModalInParent(false);
      setGRNDetail("");
    }, delay);
  };

  const handleViewDetails = (Grn) => {
    setGRNDetail(Grn);
    handleShowDetailGrnModal();
  };

  const handleUpdate = (Grn) => {
    setGRNDetail(Grn);
    setShowUpdateGrnForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setGRNDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateGrnForm(false);
    setGRNDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = Grns.find((pr) => pr.grnMasterId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.grnMasterId !== id)
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
      const grn = Grns.find((grn) => grn.grnMasterId === id);
      return grn && grn.status && grn.status.toString().charAt(1) === "1";
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
    Grns,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveGrnModal,
    showApproveGrnModalInParent,
    showDetailGrnModal,
    showDetailGrnModalInParent,
    selectedRowData,
    showCreateGrnForm,
    showUpdateGrnForm,
    userPermissions,
    GRNDetail,
    isLoadingPermissions,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveGrnModal,
    handleCloseApproveGrnModal,
    handleShowDetailGrnModal,
    handleCloseDetailGrnModal,
    handleApproved,
    setShowCreateGrnForm,
    setShowUpdateGrnForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
  };
};

export default useGrnList;
