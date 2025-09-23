import { useState } from "react";
import {
  get_item_masters_by_company_id_api,
  delete_item_master_api,
} from "../../../services/inventoryApi";
import { get_user_permissions_api } from "../../../services/userManagementApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useItemMasterList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showDetailIMModal, setShowDetailIMModal] = useState(false);
  const [showDetailIMModalInParent, setShowDetailIMModalInParent] =
    useState(false);
  const [showCreateIMForm, setShowCreateIMForm] = useState(false);
  const [showUpdateIMForm, setShowUpdateIMForm] = useState(false);
  const [IMDetail, setIMDetail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

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

  const fetchItems = async () => {
    try {
      const response = await get_item_masters_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: itemMasters = [],
    isLoading: isLoadingItemMasters,
    error: itemMastersError,
  } = useQuery({
    queryKey: ["itemMasters", sessionStorage.getItem("companyId")],
    queryFn: fetchItems,
  });

  const handleShowDetailIMModal = () => {
    setShowDetailIMModal(true);
    setShowDetailIMModalInParent(true);
  };

  const handleCloseDetailIMModal = () => {
    setShowDetailIMModal(false);
    handleCloseDetailIMModalInParent();
  };

  const handleCloseDetailIMModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailIMModalInParent(false);
      setIMDetail("");
    }, delay);
  };

  const handleViewDetails = (ItemMaster) => {
    setIMDetail(ItemMaster);
    handleShowDetailIMModal();
  };

  const handleUpdate = (ItemMaster) => {
    setIMDetail(ItemMaster);
    setShowUpdateIMForm(true);
  };

  const handleUpdated = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setIMDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateIMForm(false);
    setIMDetail("");
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteItemMaster = async () => {
    try {
      setLoading(true);

      const deleteResponse = await delete_item_master_api(
        selectedRowData[0]?.itemMasterId
      );

      if (deleteResponse.status === 204) {
        console.log("Item master deleted", selectedRowData[0]?.itemMasterId);

        setSubmissionStatus("success");
        setSubmissionMessage("Item master deleted successfully!");

        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);
          handleCloseDeleteConfirmation();
          setSelectedRows([]);
          setSelectedRowData([]);
          setIMDetail("");
          setLoading(false);
          queryClient.invalidateQueries([
            "itemMasters",
            sessionStorage.getItem("companyId"),
          ]);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting item master. Please try again.");
        console.log("Error deleting item master");
      }
    } catch (error) {
      console.error("Error deleting item master:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting item master. Please try again.");

      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = itemMasters.find((im) => im.itemMasterId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.itemMasterId !== id)
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
      false: "Inactive",
      true: "Active",
    };

    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      false: "bg-secondary",
      true: "bg-success",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) => itemMasters.find((im) => im.itemMasterId === id)?.status === 1
    );
  };

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  if (itemMasters.length > 0) console.log("itemMasters: ", itemMasters);

  return {
    itemMasters,
    isLoadingItemMasters,
    isLoadingPermissions,
    itemMastersError,
    isAnyRowSelected,
    selectedRows,
    showDetailIMModal,
    showDetailIMModalInParent,
    selectedRowData,
    showCreateIMForm,
    showUpdateIMForm,
    userPermissions,
    IMDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowDetailIMModal,
    handleCloseDetailIMModal,
    setShowCreateIMForm,
    setShowUpdateIMForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteItemMaster,
  };
};

export default useItemMasterList;
