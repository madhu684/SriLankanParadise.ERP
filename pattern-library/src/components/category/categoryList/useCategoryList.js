import { useMemo, useState } from "react";
import {
  get_all_categories_by_company_id_api,
  delete_category_api,
} from "../../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCategoryList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);
  const [showUpdateCategoryForm, setShowUpdateCategoryForm] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["categories", companyId],
    queryFn: async () => {
      const CategoryResponse = await get_all_categories_by_company_id_api(
        companyId
      );
      return CategoryResponse.data.result || [];
    },
    enabled: !!companyId,
  });

  const handleUpdate = (Category) => {
    setCategoryDetail(Category);
    setShowUpdateCategoryForm(true);
  };

  const handleUpdated = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setCategoryDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateCategoryForm(false);
    setCategoryDetail("");
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteCategory = async () => {
    try {
      setLoading(true);

      const deleteResponse = await delete_category_api(
        selectedRowData[0]?.categoryId
      );

      if (deleteResponse.status === 204) {
        setSubmissionStatus("success");
        setSubmissionMessage("Category deleted successfully!");

        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);

          queryClient.invalidateQueries(["categories", companyId]);
          handleCloseDeleteConfirmation();

          setSelectedRows([]);
          setSelectedRowData([]);
          setCategoryDetail("");
          setLoading(false);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting category. Please try again.");
        console.log("Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting category. Please try again.");

      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = categories.find((im) => im.categoryId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.categoryId !== id)
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
      (id) => categories.find((c) => c.categoryId === id)?.status === 1
    );
  };

  return {
    categories,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showCreateCategoryForm,
    showUpdateCategoryForm,
    categoryDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    setShowCreateCategoryForm,
    setShowUpdateCategoryForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteCategory,
  };
};

export default useCategoryList;
