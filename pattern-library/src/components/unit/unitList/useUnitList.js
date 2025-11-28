import { useState, useEffect, useMemo } from "react";
import {
  get_all_units_by_company_id_api,
  delete_unit_api,
} from "../../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useUnitList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showCreateUnitForm, setShowCreateUnitForm] = useState(false);
  const [showUpdateUnitForm, setShowUpdateUnitForm] = useState(false);
  const [unitDetail, setUnitDetail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const queryClient = useQueryClient();

  const {
    data: units = [],
    isLoading: isLoadingData,
    error,
  } = useQuery({
    queryKey: ["units", companyId],
    queryFn: async () => {
      const UnitResponse = await get_all_units_by_company_id_api(companyId);
      return UnitResponse.data.result || [];
    },
  });

  const handleUpdate = (unit) => {
    setUnitDetail(unit);
    setShowUpdateUnitForm(true);
  };

  const handleUpdated = async () => {
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setUnitDetail("");
    }, delay);
  };

  const handleClose = () => {
    setShowUpdateUnitForm(false);
    setUnitDetail("");
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteUnit = async () => {
    try {
      setLoading(true);
      const deleteResponse = await delete_unit_api(selectedRowData[0]?.unitId);

      if (deleteResponse.status === 204) {
        console.log("Unit deleted", selectedRowData[0]?.unitId);

        setSubmissionStatus("success");
        setSubmissionMessage("Unit deleted successfully!");

        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage(null);

          queryClient.invalidateQueries(["units", companyId]);
          handleCloseDeleteConfirmation();

          setSelectedRows([]);
          setSelectedRowData([]);
          setUnitDetail("");
          setLoading(false);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage("Error deleting unit. Please try again.");
        console.log("Error deleting Unit");
      }
    } catch (error) {
      console.error("Error deleting Unit:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Error deleting unit. Please try again.");

      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage(null);
        setLoading(false);
      }, 3000);
    }
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = units.find((u) => u.unitId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.unitId !== id)
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
      (id) => units.find((c) => c.unitId === id)?.status === 1
    );
  };

  return {
    units,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showCreateUnitForm,
    showUpdateUnitForm,
    unitDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    setShowCreateUnitForm,
    setShowUpdateUnitForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteUnit,
  };
};

export default useUnitList;
