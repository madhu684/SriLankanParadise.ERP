import { useEffect, useState } from "react";
import {
  delete_item_master_api,
  get_paginated_item_masters_by_company_id_api,
} from "common/services/inventoryApi";
import { get_company_suppliers_api } from "common/services/purchaseApi";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add new states for pagination and filtering
  const [supplierFilter, setSupplierFilter] = useState(null);
  const [paginationMeta, setPaginationMeta] = useState({
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const queryClient = useQueryClient();

  const companyId = sessionStorage.getItem("companyId");

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchItems = async () => {
    try {
      const response = await get_paginated_item_masters_by_company_id_api({
        companyId: companyId,
        searchQuery: debouncedSearchQuery,
        supplierId: supplierFilter,
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });
      if (response.data.result) {
        setPaginationMeta(response.data.result.pagination);
        return response.data.result.data || [];
      } else {
        setPaginationMeta({
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        });
        return [];
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: itemMasters = [],
    isLoading: isLoadingItemMasters,
    isFetching,
    error: itemMastersError,
  } = useQuery({
    queryKey: [
      "itemMasters",
      companyId,
      debouncedSearchQuery,
      supplierFilter,
      currentPage,
      itemsPerPage,
    ],
    queryFn: fetchItems,
    placeholderData: keepPreviousData,
  });

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(companyId);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers", companyId],
    queryFn: fetchSuppliers,
    enabled: !!companyId,
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSupplierFilterChange = (value) => {
    setSupplierFilter(value === "" ? null : value);
    setCurrentPage(1);
  };

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

  const handleCustomerTypeFilterChange = (value) => {
    setSupplierFilter(value);
    setCurrentPage(1);
  };

  if (itemMasters.length > 0) console.log("itemMasters: ", itemMasters);

  return {
    itemsPerPage,
    itemMasters,
    isLoadingItemMasters,
    itemMastersError,
    isAnyRowSelected,
    selectedRows,
    showDetailIMModal,
    showDetailIMModalInParent,
    selectedRowData,
    showCreateIMForm,
    showUpdateIMForm,
    IMDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    searchQuery,
    currentPage,
    suppliers,
    supplierFilter,
    paginationMeta,
    isFetching,
    debouncedSearchQuery,
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
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteItemMaster,
    handleSearch,
    handlePageChange,
    handleSupplierFilterChange,
  };
};

export default useItemMasterList;













