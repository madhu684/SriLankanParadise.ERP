import { useState, useMemo } from "react";
import { get_sales_orders_with_out_drafts_api } from "../../../services/salesApi";
import { useQuery } from "@tanstack/react-query";

const useSalesOrderList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showApproveSOModal, setShowApproveSOModal] = useState(false);
  const [showApproveSOModalInParent, setShowApproveSOModalInParent] =
    useState(false);
  const [showDetailSOModal, setShowDetailSOModal] = useState(false);
  const [showDetailSOModalInParent, setShowDetailSOModalInParent] =
    useState(false);
  const [showCreateSOForm, setShowCreateSOForm] = useState(false);
  const [showUpdateSOForm, setShowUpdateSOForm] = useState(false);
  const [SODetail, setSODetail] = useState("");
  const [showConvertSOForm, setShowConvertSOForm] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const {
    data: salesOrders = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["salesOrders", companyId],
    queryFn: async () => {
      const response = await get_sales_orders_with_out_drafts_api(companyId);
      return response.data.result || [];
    },
  });

  const handleShowApproveSOModal = () => {
    setShowApproveSOModal(true);
    setShowApproveSOModalInParent(true);
  };

  const handleCloseApproveSOModal = () => {
    setShowApproveSOModal(false);
    handleCloseApproveSOModalInParent();
  };

  const handleCloseApproveSOModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowApproveSOModalInParent(false);
    }, delay);
  };

  const handleApproved = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
    }, delay);
  };

  const handleShowDetailSOModal = () => {
    setShowDetailSOModal(true);
    setShowDetailSOModalInParent(true);
  };

  const handleCloseDetailSOModal = () => {
    setShowDetailSOModal(false);
    handleCloseDetailSOModalInParent();
  };

  const handleCloseDetailSOModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailSOModalInParent(false);
      setSODetail("");
    }, delay);
  };

  const handleViewDetails = (salesOrder) => {
    setSODetail(salesOrder);
    handleShowDetailSOModal();
  };

  const handleUpdate = (salesOrder) => {
    setSODetail(salesOrder);
    setShowUpdateSOForm(true);
  };

  const handleUpdated = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setSODetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateSOForm(false);
    setShowConvertSOForm(false);
    setSODetail("");
  };

  const handleConvert = (salesOrder) => {
    setSODetail(salesOrder);
    setShowConvertSOForm(true);
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = salesOrders.find((so) => so.salesOrderId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.salesOrderId !== id)
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
      (id) => salesOrders.find((so) => so.salesOrderId === id)?.status === 1
    );
  };

  const areAnySelectedRowsApproved = (selectedRows) => {
    return selectedRows.some(
      (id) => salesOrders.find((so) => so.salesOrderId === id)?.status === 2
    );
  };

  return {
    salesOrders,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveSOModal,
    showApproveSOModalInParent,
    showDetailSOModal,
    showDetailSOModalInParent,
    selectedRowData,
    showCreateSOForm,
    showUpdateSOForm,
    SODetail,
    showConvertSOForm,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveSOModal,
    handleCloseApproveSOModal,
    handleShowDetailSOModal,
    handleCloseDetailSOModal,
    handleApproved,
    setShowCreateSOForm,
    setShowUpdateSOForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    areAnySelectedRowsApproved,
    handleConvert,
    setShowConvertSOForm,
  };
};

export default useSalesOrderList;
