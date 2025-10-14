import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activate_deactivate_customer_api,
  get_customers_by_company_id_api,
} from "../../../services/salesApi";
import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const companyId = sessionStorage.getItem("companyId");

  const fetchCustomers = async () => {
    try {
      const response = await get_customers_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    error,
  } = useQuery({
    queryKey: ["customers", companyId],
    queryFn: fetchCustomers,
  });

  // const handleRowSelect = (id) => {
  //   const isSelected = selectedRows.includes(id);
  //   const selectedRow = customers.find((im) => im.customerId === id);

  //   if (isSelected) {
  //     setSelectedRows((prevSelected) =>
  //       prevSelected.filter((selectedId) => selectedId !== id)
  //     );
  //     setSelectedRowData((prevSelectedData) =>
  //       prevSelectedData.filter((data) => data.supplierId !== id)
  //     );
  //   } else {
  //     setSelectedRows((prevSelected) => [...prevSelected, id]);
  //     setSelectedRowData((prevSelectedData) => [
  //       ...prevSelectedData,
  //       selectedRow,
  //     ]);
  //   }
  // };

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
  };
};

export default useCustomerList;
