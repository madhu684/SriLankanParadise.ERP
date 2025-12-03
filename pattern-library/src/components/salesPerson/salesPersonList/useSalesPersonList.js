import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  get_sales_persons_api,
  patch_sales_person_api,
} from "../../../services/salesApi";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const useSalesPersonList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreateSPForm, setShowCreateSPForm] = useState(false);
  const [showUpdateSPForm, setShowUpdateSPForm] = useState(false);
  const [showSPViewModal, setShowSPViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const {
    data: salesPerson = [],
    isLoading: isLoadingSalesPersons,
    error,
  } = useQuery({
    queryKey: ["salesPerson"],
    queryFn: async () => {
      const res = await get_sales_persons_api();
      return res.data.result || [];
    },
  });

  // Helpers
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

  // Handlers
  const handleRowSelect = (id) => {
    const selectedRow = salesPerson.find((cm) => cm.salesPersonId === id);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCloseUpdate = () => {
    setShowUpdateSPForm(false);
    setSelectedRowData([]);
  };

  const handleCloseSPViewModal = () => {
    setShowSPViewModal(false);
    setSelectedSalesPerson(null);
  };

  const handleViewDetails = (customer) => {
    setShowSPViewModal(true);
    setSelectedSalesPerson(customer);
  };

  const filteredSalesPerson = salesPerson
    ? salesPerson?.filter(
        (si) =>
          si.salesPersonCode
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          si.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          si.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Submission
  const handleDelete = async () => {
    try {
      setLoading(true);
      const patchData = {
        contactNo: selectedRowData[0].contactNo,
        email: selectedRowData[0].email,
        isActive: selectedRowData[0].isActive === true ? false : true,
      };
      const response = await patch_sales_person_api(
        selectedRowData[0].salesPersonId,
        patchData
      );
      if (response.status === 200) {
        toast.success(
          `Sales person ${
            selectedRowData[0].isActive === true ? "activated" : "deactivated"
          } successfully!`
        );
        queryClient.invalidateQueries(["salesPerson"]);
        setTimeout(() => {
          setShowDeleteModal(false);
          setSelectedRowData([]);
          setSelectedRows([]);
        }, 3000);
      } else {
        toast.error(
          `Error ${
            selectedRowData[0].isActive === true ? "activating" : "deactivating"
          } sales person. Please try again.`
        );
        setTimeout(() => {
          setShowDeleteModal(false);
          setSelectedRowData([]);
          setSelectedRows([]);
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedRowData([]);
        setSelectedRows([]);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return {
    salesPerson,
    isLoadingSalesPersons,
    error,
    isAnyRowSelected,
    selectedRows,
    searchQuery,
    itemsPerPage,
    currentPage,
    selectedRowData,
    filteredSalesPerson,
    showCreateSPForm,
    showUpdateSPForm,
    showSPViewModal,
    showDeleteModal,
    selectedSalesPerson,
    loading,
    setShowDeleteModal,
    setShowUpdateSPForm,
    setShowCreateSPForm,
    handleSearch,
    handleCloseUpdate,
    handleViewDetails,
    handleCloseSPViewModal,
    paginate,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleDelete,
  };
};

export default useSalesPersonList;
