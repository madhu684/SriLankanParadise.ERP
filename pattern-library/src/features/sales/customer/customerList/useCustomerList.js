import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  activate_deactivate_customer_api,
  get_paginated_customers_by_companyId_api,
} from "common/services/salesApi";
import { useEffect, useState } from "react";

const useCustomerList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreateCustomerForm, setShowCreateCustomerForm] = useState(false);
  const [showCustomerUpdateForm, setShowCustomerUpdateForm] = useState(false);
  const [showCustomerViewModal, setShowCustomerViewModal] = useState(false);
  const [showCustomerDeleteModal, setShowCustomerDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add new states for pagination and filtering
  const [customerTypeFilter, setCustomerTypeFilter] = useState(null);
  const [paginationMeta, setPaginationMeta] = useState({
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const queryClient = useQueryClient();

  const companyId = sessionStorage.getItem("companyId");

  // Customer types configuration
  const customerTypes = [
    {
      value: "patient",
      label: "Patient",
    },
    {
      value: "salesCustomer",
      label: "Sales Customer",
    },
  ];

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCustomers = async () => {
    try {
      const response = await get_paginated_customers_by_companyId_api({
        companyId: sessionStorage.getItem("companyId"),
        customerType: customerTypeFilter,
        searchQuery: debouncedSearchQuery || null,
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
      console.error("Error fetching customers:", error);
      throw error;
    }
  };

  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "customers",
      companyId,
      currentPage,
      itemsPerPage,
      customerTypeFilter,
      debouncedSearchQuery,
    ],
    queryFn: fetchCustomers,
    placeholderData: keepPreviousData,
  });

  const handleRowSelect = (id) => {
    const selectedRow = customers.find((cm) => cm.customerId === id);
    const isSelected = selectedRows.includes(id);

    if (isSelected) {
      // If already selected, uncheck it
      setSelectedRows([]);
      setSelectedRowData([]);
    } else {
      // Deselect previous and select only the new one
      setSelectedRows([id]);
      setSelectedRowData([selectedRow]);
    }
  };

  const isAnyRowSelected = selectedRows.length === 1;

  const handleConfirmDeleteCustomer = async () => {
    try {
      setIsLoading(true);

      const response = await activate_deactivate_customer_api(
        selectedRowData[0]?.customerId,
        { status: selectedRowData[0]?.status === 1 ? 0 : 1 }
      );

      if (response.status === 200) {
        setTimeout(() => {
          setSubmissionStatus("successSubmitted");
          setSubmissionMessage("Customer updated successfully!");
          queryClient.invalidateQueries(["customers", companyId]);
        }, 3000);
        setShowCustomerDeleteModal(false);
        setSelectedRows([]);
        setSelectedRowData([]);
      } else {
        setTimeout(() => {
          setSubmissionStatus("error");
          setSubmissionMessage("Error updating customer. Please try again.");
        }, 3000);
        setShowCustomerDeleteModal(false);
      }
    } catch (error) {
      setTimeout(() => {
        setSubmissionStatus("error");
        setSubmissionMessage("Error updating customer. Please try again.");
      }, 3000);
      setShowCustomerDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowCustomerUpdateForm(false);
    setSelectedCustomer(null);
  };

  const handleCloseCustomerViewModal = () => {
    setShowCustomerViewModal(false);
    setSelectedCustomer(null);
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerViewModal(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowCustomerDeleteModal(false);
    setSelectedCustomer(null);
  };

  const getStatusLabel = (statusCode) => {
    const statusLabels = {
      0: "Inactive",
      1: "Active",
      99: "Blacklist",
    };

    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      0: "bg-secondary",
      1: "bg-success",
      99: "bg-dark",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  // New handler for customer type filter
  const handleCustomerTypeFilterChange = (value) => {
    setCustomerTypeFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  console.log("Selected customer: ", selectedCustomer);

  return {
    isAnyRowSelected,
    selectedRows,
    customers,
    isLoadingCustomers,
    error,
    searchQuery,
    itemsPerPage,
    currentPage,
    showCreateCustomerForm,
    showCustomerUpdateForm,
    selectedRowData,
    showCustomerViewModal,
    selectedCustomer,
    submissionMessage,
    submissionStatus,
    isLoading,
    showCustomerDeleteModal,
    customerTypeFilter,
    customerTypes,
    paginationMeta,
    getStatusLabel,
    getStatusBadgeClass,
    setShowCustomerDeleteModal,
    setShowCreateCustomerForm,
    setShowCustomerUpdateForm,
    setSearchQuery,
    setCurrentPage,
    handleCloseDeleteConfirmation,
    handleConfirmDeleteCustomer,
    handleRowSelect,
    handleClose,
    handleCloseCustomerViewModal,
    handleViewDetails,
    handleCustomerTypeFilterChange,
    debouncedSearchQuery,
    isFetching,
  };
};

export default useCustomerList;













