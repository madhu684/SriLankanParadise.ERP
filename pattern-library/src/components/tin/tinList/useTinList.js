import { useState, useMemo } from "react";
import {
  // delete_issue_master_api,
  get_issue_masters_with_out_drafts_api,
  get_requisition_masters_with_out_drafts_api,
} from "../../../services/purchaseApi";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";

const useTinList = () => {
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
  const [showTINDeleteModal, setShowTINDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  ); // YYYY-MM-DD format
  const [TinDetail, setTinDetail] = useState("");

  const queryClient = useQueryClient();

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const { userLocations } = useContext(UserContext);

  const warehouseUserLocation = userLocations
    ? userLocations
        .filter((loc) => loc.location.locationTypeId === 2)
        .map((l) => l.locationId)
    : null;

  const {
    data: transferRequisitions = [],
    isLoading: isLoadingTrn,
    error: trnError,
  } = useQuery({
    queryKey: [
      "transferRequisitions",
      companyId,
      warehouseUserLocation ? warehouseUserLocation[0] : null,
    ],
    queryFn: async () => {
      if (!warehouseUserLocation || warehouseUserLocation.length === 0) {
        return [];
      }
      const response =
        await get_requisition_masters_with_out_drafts_api(companyId);
      const filteredRequisitions = response?.data?.result?.filter(
        (rm) =>
          rm.requisitionType === "TRN" &&
          rm.status === 2 &&
          rm.requestedToLocationId === warehouseUserLocation[0],
      );
      return filteredRequisitions;
    },
    enabled:
      !!companyId &&
      !!warehouseUserLocation &&
      warehouseUserLocation.length > 0,
    placeholderData: keepPreviousData,
  });

  const {
    data: Tins = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: [
      "tinList",
      companyId,
      warehouseUserLocation ? warehouseUserLocation[0] : null,
      selectedDate,
    ],
    queryFn: async () => {
      if (!warehouseUserLocation || warehouseUserLocation.length === 0) {
        return [];
      }
      const TinResponse = await get_issue_masters_with_out_drafts_api(
        companyId,
        selectedDate,
        warehouseUserLocation[0],
        "TIN",
      );
      return TinResponse?.data?.result || [];
    },
    enabled:
      !!companyId &&
      !!warehouseUserLocation &&
      warehouseUserLocation.length > 0,
    placeholderData: keepPreviousData,
  });

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

  const handleCloseDeleteConfirmation = () => {
    setShowTINDeleteModal(false);
    setSubmissionMessage(null);
    setSubmissionStatus(null);
  };

  const handleUpdated = async () => {
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

  const handleConfirmDeleteTIN = async () => {
    // try {
    //   setIsLoading(true);
    //   const response = await delete_issue_master_api(
    //     selectedRowData[0]?.issueMasterId
    //   );
    //   if (response.status === 204) {
    //     queryClient.invalidateQueries(["tinList", companyId]);
    //     setTimeout(() => {
    //       setSubmissionStatus("successSubmitted");
    //       setSubmissionMessage("TIN deleted successfully!");
    //       handleCloseDeleteConfirmation();
    //     }, 3000);
    //     setSelectedRows([]);
    //     setSelectedRowData([]);
    //   } else {
    //     setTimeout(() => {
    //       setSubmissionStatus("error");
    //       setSubmissionMessage("Error deleting TIN. Please try again.");
    //       handleCloseDeleteConfirmation();
    //     }, 3000);
    //   }
    // } catch (error) {
    //   setTimeout(() => {
    //     setSubmissionStatus("error");
    //     setSubmissionMessage("Error deleting TIN. Please try again.");
    //     handleCloseDeleteConfirmation();
    //   }, 3000);
    // } finally {
    //   setIsLoading(false);
    // }
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

  return {
    Tins,
    isLoadingData,
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
    TinDetail,
    submissionMessage,
    submissionStatus,
    isLoading,
    showTINDeleteModal,
    transferRequisitions,
    isLoadingTrn,
    setShowTINDeleteModal,
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
    handleUpdated,
    handleClose,
    handleConfirmDeleteTIN,
    handleCloseDeleteConfirmation,
    selectedDate,
    setSelectedDate,
  };
};

export default useTinList;
