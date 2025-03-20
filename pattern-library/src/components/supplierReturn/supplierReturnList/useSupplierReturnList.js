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
  const [showUpdateSRForm, setShowUpdateSRForm] = useState(false);
  const [SRDetail, setSRDetail] = useState("");
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

  const handleViewDetails = (salesOrder) => {
    setSRDetail(salesOrder);
    handleShowDetailSRModal();
  };

  const handleUpdate = (supplyReturnMaster) => {
    setSRDetail(supplyReturnMaster);
    setShowUpdateSRForm(true);
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
    handleUpdate,
  };
};

export default useSupplierReturnList;
