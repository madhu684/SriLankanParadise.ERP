import { useState, useEffect, useMemo } from "react";
import { get_requisition_masters_with_out_drafts_api } from "../../../services/purchaseApi";

import { get_requisition_masters_by_user_id_api } from "../../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

const useMaterialRequisitionList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveMRModal, setShowApproveMRModal] = useState(false);
  const [showApproveMRModalInParent, setShowApproveMRModalInParent] =
    useState(false);
  const [showDetailMRModal, setShowDetailMRModal] = useState(false);
  const [showDetailMRModalInParent, setShowDetailMRModalInParent] =
    useState(false);
  const [showCreateMRForm, setShowCreateMRForm] = useState(false);
  const [openMINsList, setOpenMINsList] = useState(false);
  const [MRDetail, setMRDetail] = useState("");

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const {
    data: materialRequisitions = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["materialRequisitions", companyId],
    queryFn: async () => {
      const response = await get_requisition_masters_with_out_drafts_api(
        companyId
      );
      const filteredRequisitions = response?.data?.result?.filter(
        (rm) => rm.requisitionType === "MRN"
      );
      return filteredRequisitions || [];
    },
  });

  const handleShowApproveMRModal = () => {
    setShowApproveMRModal(true);
    setShowApproveMRModalInParent(true);
  };

  const handleCloseApproveMRModal = () => {
    setShowApproveMRModal(false);
    handleCloseApproveMRModalInParent();
  };

  const handleCloseApproveMRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveMRModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailMRModal = () => {
    setShowDetailMRModal(true);
    setShowDetailMRModalInParent(true);
  };

  const handleCloseDetailMRModal = () => {
    setShowDetailMRModal(false);
    handleCloseDetailMRModalInParent();
  };

  const handleCloseDetailMRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailMRModalInParent(false);
      setMRDetail("");
    }, delay);
  };

  const handleViewDetails = (materialRequisition) => {
    setMRDetail(materialRequisition);
    handleShowDetailMRModal();
  };
  const handleViewMinDetails = (mrnId) => {};
  const handleUpdated = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setMRDetail("");
    }, delay);
  };

  const handleClose = () => {
    setMRDetail("");
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = materialRequisitions.find(
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
        materialRequisitions.find((mr) => mr.requisitionMasterId === id)
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

  return {
    materialRequisitions,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveMRModal,
    showApproveMRModalInParent,
    showDetailMRModal,
    showDetailMRModalInParent,
    selectedRowData,
    showCreateMRForm,
    MRDetail,
    openMINsList,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveMRModal,
    handleCloseApproveMRModal,
    handleShowDetailMRModal,
    handleCloseDetailMRModal,
    handleApproved,
    setShowCreateMRForm,
    handleUpdated,
    handleClose,
    formatDateInTimezone,
    setOpenMINsList,
  };
};

export default useMaterialRequisitionList;
