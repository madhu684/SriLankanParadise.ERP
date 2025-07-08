import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_added_empty_items_api } from "../../../services/inventoryApi";
import AddEmpties from "../addEmpties/addEmpties.jsx";
import CreateEmptyReturn from "../createEmptyReturn/createEmptyReturn.jsx";

// Fetching added empty items data using React Query
const fetchAddedEmptyItems = async () => {
  try {
    const response = await get_added_empty_items_api(
      sessionStorage.getItem("companyId")
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching added empty items:", error);
  }
};

const useEmptyReturnsLogic = () => {
  // State for UI management
  const [selectedRows, setSelectedRows] = useState([]);
  const [pendingEmptyReturns, setPendingEmptyReturns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Define the currentPage state
  const [showAddEmptiesForm, setShowAddEmptiesForm] = useState(false);
  const [showCreateEmptyReturnForm, setShowCreateEmptyReturnForm] =
    useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetching data using React Query
  const {
    data: addedEmptyItems,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["addedEmptyItems"],
    queryFn: fetchAddedEmptyItems,
  });

  // Handle row selection for pending status
  // Handle row selection - toggle logic
  // Function to handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id); // Deselect the item
      } else {
        return [...prevSelectedRows, id]; // Select the item
      }
    });
  };

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); // Now it has setCurrentPage properly defined
  };

  // Fetch status labels
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Empty Added";
      case 1:
        return "Empty Transfered";
      case 2:
        return "Approved";
      default:
        return "Unknown";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 0:
        return "bg-warning text-dark";
      case 1:
        return "bg-danger";
      case 2:
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Handle actions
  const handleViewDetails = (emptyReturn) => {
    console.log("View details for:", emptyReturn);
  };

  //   const handleEmptyTransfer = (id, items) => {
  //     setSelectedItems(items);
  //     setShowCreateEmptyReturnForm(true);
  //     console.log("Empty Transfer initiated for ID:", id, items);
  //   };

  // Function to handle Empty Transfer and pass selected data to CreateEmptyReturn
  const handleEmptyTransfer = (item) => {
    console.log("Empty return:", item);
    setSelectedItems(item);
    setShowCreateEmptyReturnForm(true);
  };

  const handleApprove = (id) => {
    console.log("Approve initiated for ID:", id);
  };

  const handleEdit = (id) => {
    console.log("Edit initiated for ID:", id);
  };

  return {
    addedEmptyItems,
    isLoading,
    isError,
    error,
    selectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleViewDetails,
    handleEmptyTransfer,
    handleApprove,
    handleEdit,
    paginate,
    showAddEmptiesForm,
    setShowAddEmptiesForm,
    showCreateEmptyReturnForm,
    setShowCreateEmptyReturnForm,
    setSelectedItems,
    selectedItems,
    currentPage,
    selectedItems, // Don't forget to return currentPage if you need it in the JSX file
  };
};

export default useEmptyReturnsLogic;
