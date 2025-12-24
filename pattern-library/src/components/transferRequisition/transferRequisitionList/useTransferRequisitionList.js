import { useState, useEffect, useMemo } from "react";
import { get_requisition_masters_with_out_drafts_api } from "../../../services/purchaseApi";
import {
  get_requisition_masters_by_user_id_api,
  get_user_locations_by_user_id_api,
} from "../../../services/purchaseApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useTransferRequisitionList = () => {
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveTRModal, setShowApproveTRModal] = useState(false);
  const [showApproveTRModalInParent, setShowApproveTRModalInParent] =
    useState(false);
  const [showDetailTRModal, setShowDetailTRModal] = useState(false);
  const [showDetailTRModalInParent, setShowDetailTRModalInParent] =
    useState(false);
  const [showCreateTRForm, setShowCreateTRForm] = useState(false);
  const [TRDetail, setTRDetail] = useState("");
  const [filter, setFilter] = useState("all");
  const [userWarehouses, setUserWarehouses] = useState([]);
  const [openTINsList, setOpenTINsList] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    userWarehouses[0]?.id || ""
  );
  const [refetch, setRefetch] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user locations:", error);
    }
  };

  const {
    data: userLocations,
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", sessionStorage.getItem("userId")],
    queryFn: fetchUserLocations,
  });

  useEffect(() => {
    if (!isUserLocationsLoading && userLocations) {
      const locations = userLocations?.filter(
        (location) => location?.location?.locationTypeId === 2
      );
      console.log("locations: ", locations);
      setUserWarehouses(locations);
      setSelectedWarehouse(locations[0]?.locationId);
    }
  }, [isUserLocationsLoading, userLocations]);

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

  const {
    data: transferRequisitions = [],
    isLoading: isLoadingTrn,
    error: trnError,
  } = useQuery({
    queryKey: ["transferRequisitions", companyId],
    queryFn: async () => {
      const response = await get_requisition_masters_with_out_drafts_api(
        companyId
      );
      const filteredRequisitions = response?.data?.result?.filter(
        (rm) =>
          rm.requisitionType === "TRN" &&
          rm.requestedFromLocationId ===
            userLocations.filter((l) => l.location.locationTypeId === 2)[0]
              ?.locationId
      );
      return filteredRequisitions || [];
    },
  });

  const handleShowApproveTRModal = () => {
    setShowApproveTRModal(true);
    setShowApproveTRModalInParent(true);
  };

  const handleCloseApproveTRModal = () => {
    setShowApproveTRModal(false);
    handleCloseApproveTRModalInParent();
  };

  const handleCloseApproveTRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveTRModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailTRModal = () => {
    setShowDetailTRModal(true);
    setShowDetailTRModalInParent(true);
  };

  const handleCloseDetailTRModal = () => {
    setShowDetailTRModal(false);
    handleCloseDetailTRModalInParent();
  };

  const handleCloseDetailTRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailTRModalInParent(false);
      setTRDetail("");
    }, delay);
  };

  const handleViewDetails = (TransferRequisition) => {
    setTRDetail(TransferRequisition);
    handleShowDetailTRModal();
  };

  const handleUpdated = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setTRDetail("");
    }, delay);
  };

  const handleClose = () => {
    setTRDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = transferRequisitions.find(
      (mr) => mr.requisitionMasterId === id
    );

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.requisitionMasterId !== id)
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
        transferRequisitions.find((mr) => mr.requisitionMasterId === id)
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

  const formatDateInTimezone = (dateString, timezone) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: timezone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return formattedDate;
  };

  const filteredRequisitions = transferRequisitions.filter((tr) => {
    if (filter === "incoming") {
      return tr.requestedFromLocationId === parseInt(selectedWarehouse);
    } else if (filter === "outgoing") {
      return tr.requestedToLocationId === parseInt(selectedWarehouse);
    } else
      return (
        tr.requestedFromLocationId === parseInt(selectedWarehouse) ||
        tr.requestedToLocationId === parseInt(selectedWarehouse)
      ); // 'all' filter
  });

  return {
    transferRequisitions,
    isLoadingTrn,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveTRModal,
    showApproveTRModalInParent,
    showDetailTRModal,
    showDetailTRModalInParent,
    selectedRowData,
    showCreateTRForm,
    TRDetail,
    isPermissionsError,
    permissionError,
    selectedWarehouse,
    userWarehouses,
    filter,
    filteredRequisitions,
    openTINsList,
    refetch,
    setRefetch,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveTRModal,
    handleCloseApproveTRModal,
    handleShowDetailTRModal,
    handleCloseDetailTRModal,
    handleApproved,
    setShowCreateTRForm,
    hasPermission,
    handleUpdated,
    handleClose,
    formatDateInTimezone,
    setSelectedWarehouse,
    setFilter,
    setOpenTINsList,
  };
};

export default useTransferRequisitionList;
