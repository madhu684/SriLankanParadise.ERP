import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_item_types_by_company_id_api } from "../../../services/inventoryApi";

const useItemTypeList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showCreateItemTypeForm, setShowCreateItemTypeForm] = useState(false);
  const [showUpdateItemTypeForm, setShowUpdateItemTypeForm] = useState(false);

  const [selectedItemType, setSelectedItemType] = useState(null);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const {
    data: itemTypes = [],
    isLoading: isLoadingItemTypes,
    error,
  } = useQuery({
    queryKey: ["itemTypes", companyId],
    queryFn: async () => {
      const response = await get_item_types_by_company_id_api(companyId);
      return response.data.result || [];
    },
    enabled: !!companyId,
  });

  const filteredItemTypes = itemTypes
    ? itemTypes?.filter((it) =>
        it.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  // Helpers
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

  return {
    searchQuery,
    currentPage,
    itemsPerPage,
    itemTypes,
    filteredItemTypes,

    // loading and error
    isLoadingItemTypes,
    error,

    // Modals
    showCreateItemTypeForm,
    setShowCreateItemTypeForm,
    showUpdateItemTypeForm,
    setShowUpdateItemTypeForm,

    // Handlers
    paginate,
    setSearchQuery,
    setCurrentPage,
    handleSearch,

    // Helpers
    getStatusLabel,
    getStatusBadgeClass,
  };
};

export default useItemTypeList;
