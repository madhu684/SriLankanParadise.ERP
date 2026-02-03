import { useState, useEffect } from "react";
import { delete_item_master_api } from "common/services/inventoryApi";
import {
  get_company_suppliers_api,
  get_purchase_orders_api,
  put_supplier_api,
} from "common/services/purchaseApi";
import { get_user_permissions_api } from "common/services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useSupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showDetailSupplierModal, setShowDetailSupplierModal] = useState(false);
  const [showDetailSupplierModalInParent, setShowDetailSupplierModalInParent] =
    useState(false);
  const [showCreateSupplierForm, setShowCreateSupplierForm] = useState(false);
  const [showUpdateSupplierForm, setShowUpdateSupplierForm] = useState(false);
  const [SupplierDetail, setSupplierDetail] = useState("");
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

  const fetchPurchaseOrders = async () => {
    try {
      const response = await get_purchase_orders_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching perchase orders:", error);
    }
  };

  const {
    data: purchaseOrders,
    isLoading: isLoadingPurchaseOrders,
    isError: isPurchaseOrdersError,
    error: purchaseOrdersError,
  } = useQuery({
    queryKey: ["purchaseOrders"],
    queryFn: fetchPurchaseOrders,
  });

  const fetchData = async () => {
    try {
      if (!isLoadingPermissions && userPermissions) {
        const supplierResponse = await get_company_suppliers_api(
          sessionStorage.getItem("companyId")
        );
        setSuppliers(
          supplierResponse.data.result?.filter(
            (supplier) => supplier.status !== -1
          ) || []
        );
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoadingPermissions, userPermissions]);

  const handleShowDetailSupplierModal = () => {
    setShowDetailSupplierModal(true);
    setShowDetailSupplierModalInParent(true);
  };

  const handleCloseDetailSupplierModal = () => {
    setShowDetailSupplierModal(false);
    handleCloseDetailSupplierModalInParent();
  };

  const handleCloseDetailSupplierModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowDetailSupplierModalInParent(false);
      setSupplierDetail("");
    }, delay);
  };

  const handleViewDetails = (Supplier) => {
    setSupplierDetail(Supplier);
    handleShowDetailSupplierModal();
  };

  const handleUpdate = (Supplier) => {
    setSupplierDetail(Supplier);
    setShowUpdateSupplierForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setSupplierDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateSupplierForm(false);
    setSupplierDetail("");
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteSupplier = async () => {
    try {
      setLoading(true);

      // Get the current date and time in UTC timezone in the specified format
      const currentDate = new Date().toISOString();

      const supplierData = {
        supplierName: selectedRowData[0]?.supplierName,
        contactPerson: selectedRowData[0]?.contactPerson,
        phone: selectedRowData[0]?.phone,
        email: selectedRowData[0]?.email,
        companyId: sessionStorage.getItem("companyId"),
        addressLine1: selectedRowData[0]?.addressLine1,
        addressLine2: selectedRowData[0]?.addressLine2,
        officeContactNo: selectedRowData[0]?.officeContactNo,
        businessRegistrationNo: selectedRowData[0]?.businessRegistrationNo,
        vatregistrationNo: selectedRowData[0]?.vatregistrationNo,
        companyTypeId: selectedRowData[0]?.companyTypeId,
        businessTypeId: selectedRowData[0]?.businessTypeId,
        supplierLogoPath: selectedRowData[0]?.supplierLogoPath,
        status: -1,
        rating: selectedRowData[0]?.rating,
        remarks: selectedRowData[0]?.remarks,
        createdDate: selectedRowData[0]?.createdDate,
        lastUpdatedDate: selectedRowData[0]?.lastUpdatedDate,
        deletedDate: currentDate,
        deletedUserId: sessionStorage.getItem("userId"),
        createdUserId: selectedRowData[0]?.createdUserId,
        permissionId: 1070,
      };

      const putResponse = await put_supplier_api(
        selectedRowData[0]?.supplierId,
        supplierData
      );

      if (putResponse.status === 200) {
        console.log("Supplier deleted", selectedRowData[0]?.supplierId);

        setSubmissionStatus("success");
        setSubmissionMessage("Supplier deleted successfully!");

        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);

          handleCloseDeleteConfirmation();
          fetchData();

          setSelectedRows([]);
          setSelectedRowData([]);
          setSupplierDetail("");
          setLoading(false);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting supplier. Please try again.");
        console.log("Error deleting supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting supplier. Please try again.");

      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = suppliers.find((im) => im.supplierId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.supplierId !== id)
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

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) => suppliers.find((im) => im.supplierId === id)?.status === 1
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
    suppliers,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    showDetailSupplierModal,
    showDetailSupplierModalInParent,
    selectedRowData,
    showCreateSupplierForm,
    showUpdateSupplierForm,
    userPermissions,
    SupplierDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    isPermissionsError,
    purchaseOrders,
    isLoadingPurchaseOrders,
    isPurchaseOrdersError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowDetailSupplierModal,
    handleCloseDetailSupplierModal,
    setShowCreateSupplierForm,
    setShowUpdateSupplierForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteSupplier,
  };
};

export default useSupplierList;













