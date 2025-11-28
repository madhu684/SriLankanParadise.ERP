import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useRef } from "react";
import {
  get_item_price_list_by_company_id_api,
  update_item_price_master_status_api,
} from "../../../services/inventoryApi";

const useItemPriceListList = () => {
  const [showCreateListForm, setShowCreateListForm] = useState(false);
  const [showViewList, setShowViewList] = useState(false);
  const [showUpdateListForm, setShowUpdateListForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedItemPriceList, setSelectedItemPriceList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const companyIdRef = useRef(sessionStorage.getItem("companyId"));
  const companyId = companyIdRef.current;

  const queryClient = useQueryClient();

  const {
    data: itemPriceList = [],
    isLoading: isLoadingItemPriceList,
    error: errorItemPriceList,
  } = useQuery({
    queryKey: ["itemPriceList", companyId],
    queryFn: async () => {
      const response = await get_item_price_list_by_company_id_api(companyId);
      return response.data.result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const paginatedList = useMemo(() => {
    if (!itemPriceList || itemPriceList.length === 0) return [];

    return itemPriceList.filter(
      (ip) =>
        ip.listName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ip.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [itemPriceList, searchQuery]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // ============================================================================
  // Modal Handlers
  // ============================================================================

  const handleOpenUpdateModal = useCallback((itemPriceListItem) => {
    const transformedData = {
      id: itemPriceListItem.id,
      listName: itemPriceListItem.listName,
      status: itemPriceListItem.status,
      effectiveDate: itemPriceListItem.effectiveDate,
      remark: itemPriceListItem.remark || "",
      companyId: itemPriceListItem.companyId,
      createdBy: itemPriceListItem.createdBy,
      createdUserId: itemPriceListItem.createdUserId,
      createdDate: itemPriceListItem.createdDate,
      itemDetails: Array.isArray(itemPriceListItem.itemPriceDetails)
        ? itemPriceListItem.itemPriceDetails.map((detail) => ({
            id: detail.id,
            itemMasterId: detail.itemMasterId,
            itemName: detail.itemMaster?.itemName || "",
            price: detail.price,
          }))
        : [],
    };

    setSelectedItemPriceList(transformedData);
    setShowUpdateListForm(true);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setShowUpdateListForm(false);
    setTimeout(() => {
      setSelectedItemPriceList(null);
    }, 100);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateListForm(false);
  }, []);

  const handleOpenDeleteModal = useCallback((itemPriceListItem) => {
    setSelectedItemPriceList(itemPriceListItem);
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedItemPriceList(null);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setShowViewList(false);
    setSelectedItemPriceList(null);
  }, []);

  const handleOpenViewModal = useCallback((itemPriceListItem) => {
    setSelectedItemPriceList(itemPriceListItem);
    setShowViewList(true);
  }, []);

  // ============================================================================
  // Submission
  // ============================================================================

  const handleActivateDeactivate = async () => {
    if (selectedItemPriceList !== null) {
      try {
        setLoading(true);
        const response = await update_item_price_master_status_api(
          selectedItemPriceList.id,
          {
            status: selectedItemPriceList.status === 1 ? 0 : 1,
          }
        );

        if (response.status === 200) {
          setTimeout(() => {
            queryClient.invalidateQueries(["itemPriceList", companyId]);
            setSubmissionStatus("successSubmitted");
            setSubmissionMessage("Item Price List updated successfully!");
          }, 3000);
          setShowDeleteModal(false);
          setSelectedItemPriceList(null);
        } else {
          setTimeout(() => {
            setSubmissionStatus("error");
            setSubmissionMessage(
              "Error updating Item Price List. Please try again."
            );
          }, 3000);
          setShowDeleteModal(false);
        }
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setSubmissionStatus("error");
          setSubmissionMessage(
            "Error updating Item Price List. Please try again."
          );
        }, 300);
        setShowDeleteModal(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    itemPriceList,
    isLoadingItemPriceList,
    errorItemPriceList,
    showViewList,
    searchQuery,
    currentPage,
    itemsPerPage,
    paginatedList,
    showCreateListForm,
    showUpdateListForm,
    selectedItemPriceList,
    showDeleteModal,
    loading,
    submissionStatus,
    submissionMessage,
    paginate,
    setShowCreateListForm,
    setCurrentPage,
    setSearchQuery,
    handleSearch,
    handleOpenViewModal,
    handleCloseViewModal,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
    handleCloseUpdateModal,
    handleCloseCreateModal,
    handleCloseDeleteModal,
    handleActivateDeactivate,
  };
};

export default useItemPriceListList;
