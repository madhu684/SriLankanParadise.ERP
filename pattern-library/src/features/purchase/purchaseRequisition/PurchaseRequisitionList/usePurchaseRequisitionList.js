import { useState, useEffect } from "react";
import { get_purchase_requisitions_with_out_drafts_api } from "common/services/purchaseApi";
import { get_purchase_requisitions_by_user_id_api } from "common/services/purchaseApi";
import { get_user_permissions_api } from "common/services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseRequisitionList = () => {
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
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
  const [showConvertPRForm, setShowConvertPRForm] = useState(false);
  const [PRDetail, setPRDetail] = useState("");
  const [showDeletePRForm, setShowDeletePRForm] = useState(false);

  const [refetch, setRefetch] = useState(false);

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
        if (hasPermission("Approve Purchase Requisition")) {
          const purchaseRequisitionWithoutDraftsResponse =
            await get_purchase_requisitions_with_out_drafts_api(
              sessionStorage.getItem("companyId")
            );

          const purchaseRequisitionByUserIdResponse =
            await get_purchase_requisitions_by_user_id_api(
              sessionStorage.getItem("userId")
            );

          let newPurchaseRequisitions = [];
          if (
            purchaseRequisitionWithoutDraftsResponse &&
            purchaseRequisitionWithoutDraftsResponse.data.result
          ) {
            newPurchaseRequisitions =
              purchaseRequisitionWithoutDraftsResponse.data.result;
          }

          let additionalRequisitions = [];
          if (
            purchaseRequisitionByUserIdResponse &&
            purchaseRequisitionByUserIdResponse.data.result
          ) {
            additionalRequisitions =
              purchaseRequisitionByUserIdResponse.data.result;
          }

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
          setPurchaseRequisitions(
            purchaseRequisitionResponse.data.result || []
          );
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
  }, [isLoadingPermissions, userPermissions, refetch]);

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
      setPRDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdatePRForm(false);
    setShowConvertPRForm(false);
    setPRDetail("");
  };

  const handleConvert = (purchaseRequisition) => {
    setPRDetail(purchaseRequisition);
    setShowConvertPRForm(true);
  };

  // const handleRowSelect = (id) => {
  //   const selectedRow = purchaseRequisitions.find(
  //     (pr) => pr.purchaseRequisitionId === id
  //   );
  //   const isSelected = selectedRows.includes(id);

  //   if (isSelected) {
  //     setSelectedRows((prevSelected) =>
  //       prevSelected.filter((selectedId) => selectedId !== id)
  //     );
  //     setSelectedRowData((prevSelectedData) =>
  //       prevSelectedData.filter((data) => data.purchaseRequisitionId !== id)
  //     );
  //   } else {
  //     setSelectedRows((prevSelected) => [...prevSelected, id]);
  //     setSelectedRowData((prevSelectedData) => [
  //       ...prevSelectedData,
  //       selectedRow,
  //     ]);
  //   }
  // };
  const handleRowSelect = (id) => {
    const selectedRow = purchaseRequisitions.find(
      (pr) => pr.purchaseRequisitionId === id
    );
    const isSelected = selectedRows.includes(id);

    if (isSelected) {
      // If already selected, uncheck it
      setSelectedRows([]);
      setSelectedRowData([]);
    } else {
      // Deselect previous and select only the new one
      setSelectedRows([id]);
      setSelectedRowData([selectedRow]);
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
    // return selectedRows.some(
    //   (id) =>
    //     purchaseRequisitions.find((pr) => pr.purchaseRequisitionId === id)
    //       ?.status === 1
    // );
    return selectedRows.some((id) => {
      const po = purchaseRequisitions.find(
        (po) => po.purchaseRequisitionId === id
      );
      return po && (po.status === 0 || po.status === 1);
    });
  };

  const areAnySelectedRowsApproved = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        purchaseRequisitions.find((pr) => pr.purchaseRequisitionId === id)
          ?.status === 2
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
    showConvertPRForm,
    isPermissionsError,
    permissionError,
    showDeletePRForm,
    refetch,
    setRefetch,
    setShowDeletePRForm,
    areAnySelectedRowsPending,
    areAnySelectedRowsApproved,
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
    handleClose,
    handleConvert,
    setShowConvertPRForm,
  };
};

export default usePurchaseRequisitionList;













