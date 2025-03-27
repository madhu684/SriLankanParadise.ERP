import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { get_supply_return_masters_by_companyId } from "../../../services/purchaseApi";

const useSupplierReturnList = () => {
  const [showCreateSRForm, setShowCreateSRForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showDetailSRModal, setShowDetailSRModal] = useState(false);
  const [showDetailSRModalInParent, setShowDetailSRModalInParent] =
    useState(false);
  const [showApproveSRModal, setShowApproveSRModal] = useState(false);
  const [showApproveSRModalInParent, setShowApproveSRModalInParent] =
    useState(false);
  const [showUpdateSRForm, setShowUpdateSRForm] = useState(false);
  const [SRDetail, setSRDetail] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  //set up pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchSupplierReturns = async () => {
    try {
      const response = await get_supply_return_masters_by_companyId(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching supplier returns:", error);
    }
  };

  const {
    data: supplyReturns = [],
    isLoading: isLoadingSupplyReturns,
    isError: isErrorSupplyReturns,
    error: errorSupplyReturns,
  } = useQuery({
    queryKey: ["supplierReturns", sessionStorage.getItem("companyId")],
    queryFn: fetchSupplierReturns,
  });

  const filteredData = supplyReturns?.filter((data) =>
    data.referenceNo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = supplyReturns.find(
      (so) => so.supplyReturnMasterId === id
    );

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.supplyReturnMasterId !== id)
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
      1: "Pending Approval",
      2: "Approved",
      3: "Rejected",
      4: "Goods Received",
      5: "Completed",
      6: "Cancelled",
      7: "On Hold",
    };

    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
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
        supplyReturns.find((so) => so.supplyReturnMasterId === id)?.status === 1
    );
  };

  const areAnySelectedRowsApproved = (selectedRows) => {
    return selectedRows.some(
      (id) =>
        supplyReturns.find((so) => so.supplyReturnMasterId === id)?.status === 2
    );
  };

  const handleShowDetailSRModal = () => {
    setShowDetailSRModal(true);
    setShowDetailSRModalInParent(true);
  };

  const handleCloseDetailSRModal = () => {
    setShowDetailSRModal(false);
    handleCloseDetailSRModalInParent();
  };

  const handleCloseDetailSRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailSRModalInParent(false);
      setSRDetail("");
    }, delay);
  };

  const handleViewDetails = (supplyReturnMaster) => {
    setSRDetail(supplyReturnMaster);
    handleShowDetailSRModal();
  };

  const handleShowApproveSRModal = (supplyReturnMaster) => {
    setSRDetail(supplyReturnMaster);
    setShowApproveSRModal(true);
    setShowApproveSRModalInParent(true);
  };

  const handleCloseApproveSRModal = () => {
    setShowApproveSRModal(false);
    handleCloseApproveSRModalInParent();
  };

  const handleCloseApproveSRModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveSRModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleUpdate = (supplyReturnMaster) => {
    setSRDetail(supplyReturnMaster);
    setShowUpdateSRForm(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return {
    supplyReturns,
    isLoadingSupplyReturns,
    isErrorSupplyReturns,
    errorSupplyReturns,
    showCreateSRForm,
    selectedRows,
    selectedRowData,
    isAnyRowSelected,
    showDetailSRModal,
    showDetailSRModalInParent,
    SRDetail,
    showUpdateSRForm,
    showApproveSRModal,
    showApproveSRModalInParent,
    currentItems,
    itemsPerPage,
    currentPage,
    filteredData,
    searchTerm,
    setShowUpdateSRForm,
    setShowCreateSRForm,
    areAnySelectedRowsPending,
    areAnySelectedRowsApproved,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowDetailSRModal,
    handleCloseDetailSRModal,
    handleViewDetails,
    handleShowApproveSRModal,
    handleCloseApproveSRModal,
    handleUpdate,
    paginate,
    handleSearchChange,
  };
};

export default useSupplierReturnList;
