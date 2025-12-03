import { useState, useMemo } from "react";
import { get_grn_masters_with_out_drafts_api } from "../../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

const useGrnList = (userLocations) => {
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

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const locationId = userLocations?.[0]?.locationId;

  const {
    data: Grns = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["grns", companyId, locationId],
    queryFn: async () => {
      const GrnResponse = await get_grn_masters_with_out_drafts_api(companyId);
      const filteredGrns = GrnResponse.data.result.filter(
        (grn) => grn.warehouseLocationId === locationId
      );
      return filteredGrns || [];
    },
    enabled: !!companyId && !!locationId, // Only run query when both values exist
  });

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

  return {
    Grns,
    isLoadingData,
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
    GRNDetail,
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
    handleUpdate,
    handleUpdated,
    handleClose,
  };
};

export default useGrnList;
