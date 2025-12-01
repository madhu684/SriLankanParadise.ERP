import { useState, useEffect, useMemo } from "react";
import {
  delete_requisition_master_api,
  get_requisition_masters_with_out_drafts_api,
} from "../../../services/purchaseApi";
import { get_user_locations_by_user_id_api } from "../../../services/purchaseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useTransferRequisitionList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveTRModal, setShowApproveTRModal] = useState(false);
  const [showApproveTRModalInParent, setShowApproveTRModalInParent] =
    useState(false);
  const [showDetailTRModal, setShowDetailTRModal] = useState(false);
  const [showDetailTRModalInParent, setShowDetailTRModalInParent] =
    useState(false);
  const [showCreateTRForm, setShowCreateTRForm] = useState(false);
  const [showTRNDeleteModal, setShowTRNDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [TRDetail, setTRDetail] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'incoming', 'outgoing'
  const [userWarehouses, setUserWarehouses] = useState([]);
  const [openTINsList, setOpenTINsList] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    userWarehouses[0]?.id || ""
  );

  const queryClient = useQueryClient();

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const {
    data: transferRequisitions = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["transferRequisitions", companyId],
    queryFn: async () => {
      const response = await get_requisition_masters_with_out_drafts_api(
        companyId
      );
      const filteredRequisitions = response?.data?.result?.filter(
        (rm) => rm.requisitionType === "TRN"
      );
      return filteredRequisitions || [];
    },
  });

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
        (location) => location?.location?.locationType.name === "Warehouse"
      );
      setUserWarehouses(locations);
      setSelectedWarehouse(locations[0]?.locationId);
    }
  }, [isUserLocationsLoading, userLocations]);

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

  const handleCloseDeleteConfirmation = () => {
    setShowTRNDeleteModal(false);
    setSubmissionMessage(null);
    setSubmissionStatus(null);
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

  const handleConfirmDeleteTRN = async () => {
    try {
      setIsLoading(true);

      const response = await delete_requisition_master_api(
        selectedRowData[0]?.requisitionMasterId
      );
      if (response.status === 204) {
        queryClient.invalidateQueries(["transferRequisitions", companyId]);
        setTimeout(() => {
          setSubmissionStatus("successSubmitted");
          setSubmissionMessage("TRN deleted successfully!");
          handleCloseDeleteConfirmation();
        }, 3000);
        setSelectedRows([]);
        setSelectedRowData([]);
      } else {
        setTimeout(() => {
          setSubmissionStatus("error");
          setSubmissionMessage("Error deleting TRN. Please try again.");
          handleCloseDeleteConfirmation();
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting TRN. Please try again.");
        handleCloseDeleteConfirmation();
      }, 3000);
    } finally {
      setIsLoading(false);
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
    isAnyRowSelected,
    selectedRows,
    showApproveTRModal,
    showApproveTRModalInParent,
    showDetailTRModal,
    showDetailTRModalInParent,
    selectedRowData,
    showCreateTRForm,
    TRDetail,
    selectedWarehouse,
    userWarehouses,
    filter,
    filteredRequisitions,
    openTINsList,
    showTRNDeleteModal,
    submissionMessage,
    submissionStatus,
    isLoading,
    isLoadingData,
    error,
    setShowTRNDeleteModal,
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
    handleUpdated,
    handleClose,
    formatDateInTimezone,
    setSelectedWarehouse,
    setFilter,
    setOpenTINsList,
    handleCloseDeleteConfirmation,
    handleConfirmDeleteTRN,
  };
};

export default useTransferRequisitionList;
