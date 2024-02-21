import { useState, useEffect } from "react";
import { get_purchase_requisitions_with_out_drafts_api } from "../../../services/purchaseApi";
import { get_purchase_requisitions_by_user_id_api } from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";

const usePurchaseRequisitionList = () => {
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApprovePRModal, setShowApprovePRModal] = useState(false);
  const [showApprovePRModalInParent, setShowApprovePRModalInParent] =
    useState(false);
  const [showDetailPRModal, setShowDetailPRModal] = useState(false);
  const [showDetailPRModalInParent, setShowDetailPRModalInParent] =
    useState(false);
  const [showCreatePRForm, setShowCreatePRForm] = useState(false);
  const [showUpdatePRForm, setShowUpdatePRForm] = useState(false);
  const [PRDetail, setPRDetail] = useState("");
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const fetchUserPermissions = async () => {
    try {
      const userPermissionsResponse = await get_user_permissions_api(
        sessionStorage.getItem("userId")
      );
      setUserPermissions(Object.freeze(userPermissionsResponse.data.result));
    } catch (error) {
      setError("Error fetching permissions");
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const fetchData = async () => {
    try {
      if (!isLoadingPermissions && userPermissions) {
        if (hasPermission("Approve Purchase Requisition")) {
          // const purchaseRequisitionResponse =
          //   await get_purchase_requisitions_with_out_drafts_api(
          //     sessionStorage.getItem("companyId")
          //   );
          // setPurchaseRequisitions(purchaseRequisitionResponse.data.result);
          const purchaseRequisitionWithoutDraftsResponse =
            await get_purchase_requisitions_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const purchaseRequisitionByUserIdResponse =
            await get_purchase_requisitions_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newPurchaseRequisitions =
            purchaseRequisitionWithoutDraftsResponse.data.result;
          const additionalRequisitions =
            purchaseRequisitionByUserIdResponse.data.result;

          const uniqueNewRequisitions = additionalRequisitions.filter(
            (requisition) =>
              !newPurchaseRequisitions.some(
                (existingRequisition) =>
                  existingRequisition.purchaseRequisitionId ===
                  requisition.purchaseRequisitionId
              )
          );

          newPurchaseRequisitions = [
            ...newPurchaseRequisitions,
            ...uniqueNewRequisitions,
          ];
          setPurchaseRequisitions(newPurchaseRequisitions);
        } else {
          const purchaseRequisitionResponse =
            await get_purchase_requisitions_by_user_id_api(
              sessionStorage.getItem("userId")
            );
          setPurchaseRequisitions(purchaseRequisitionResponse.data.result);
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

  const handleShowApprovePRModal = () => {
    setShowApprovePRModal(true);
    setShowApprovePRModalInParent(true);
  };

  const handleCloseApprovePRModal = () => {
    setShowApprovePRModal(false);
    handleCloseApprovePRModalInParent();
  };

  const handleCloseApprovePRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApprovePRModalInParent(false);
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

  const handleShowDetailPRModal = () => {
    setShowDetailPRModal(true);
    setShowDetailPRModalInParent(true);
  };

  const handleCloseDetailPRModal = () => {
    setShowDetailPRModal(false);
    handleCloseDetailPRModalInParent();
  };

  const handleCloseDetailPRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailPRModalInParent(false);
      setPRDetail("");
    }, delay);
  };

  const handleViewDetails = (purchaseRequisition) => {
    setPRDetail(purchaseRequisition);
    handleShowDetailPRModal();
  };

  const handleUpdate = (purchaseRequisition) => {
    setPRDetail(purchaseRequisition);
    setShowUpdatePRForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = purchaseRequisitions.find(
      (pr) => pr.purchaseRequisitionId === id
    );

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.purchaseRequisitionId !== id)
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
        purchaseRequisitions.find((pr) => pr.purchaseRequisitionId === id)
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

  return {
    purchaseRequisitions,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApprovePRModal,
    showApprovePRModalInParent,
    showDetailPRModal,
    showDetailPRModalInParent,
    selectedRowData,
    showCreatePRForm,
    showUpdatePRForm,
    PRDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApprovePRModal,
    handleCloseApprovePRModal,
    handleShowDetailPRModal,
    handleCloseDetailPRModal,
    handleApproved,
    setShowCreatePRForm,
    setShowUpdatePRForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
  };
};

export default usePurchaseRequisitionList;
