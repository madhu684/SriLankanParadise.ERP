import { useState, useEffect } from "react";
import {
  get_all_categories_by_company_id_api,
  delete_category_api,
} from "common/services/inventoryApi";
import { get_user_permissions_api } from "common/services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);
  const [showUpdateCategoryForm, setShowUpdateCategoryForm] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchData = async () => {
    try {
      if (!isLoadingPermissions && userPermissions) {
        const CategoryResponse = await get_all_categories_by_company_id_api(
          sessionStorage.getItem("companyId")
        );
        setCategories(CategoryResponse.data.result || []);
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [isLoadingPermissions, userPermissions]);

  const handleUpdate = (Category) => {
    setCategoryDetail(Category);
    setShowUpdateCategoryForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
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
        console.log("Category deleted", selectedRowData[0]?.categoryId);

        setSubmissionStatus("success");
        setSubmissionMessage("Category deleted successfully!");

        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);

          handleCloseDeleteConfirmation();
          fetchData();

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

  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    );
  };

  return {
    categories,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showCreateCategoryForm,
    showUpdateCategoryForm,
    userPermissions,
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
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteCategory,
  };
};

export default useCategoryList;













