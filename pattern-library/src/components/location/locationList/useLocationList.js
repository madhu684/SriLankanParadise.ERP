import { useState, useEffect } from "react";
import {
  get_company_locations_api,
  //   delete_company_location_api,
} from "../../../services/purchaseApi";

const useLocationList = () => {
  const [locations, setLocations] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateLocationForm, setShowCreateLocationForm] = useState(false);
  const [showUpdateLocationForm, setShowUpdateLocationForm] = useState(false);
  const [locationDetail, setLocationDetail] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const locationResponse = await get_company_locations_api(
        sessionStorage.getItem("companyId")
      );
      // console.log("Location Response:", locationResponse.data.result); // Debug log
      setLocations(locationResponse.data.result || []);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (location) => {
    setLocationDetail(location);
    setShowUpdateLocationForm(true);
  };

  const handleUpdated = async () => {
    fetchData();
    const delay = 300;
    setTimeout(() => {
      setLocationDetail(null);
    }, delay);
  };

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

  const handleClose = () => {
    setShowUpdateLocationForm(false);
    setLocationDetail(null);
  };

  const handleDelete = (locationId) => {
    setLocationDetail(
      locations.find((location) => location.locationId === locationId)
    );
    console.log("locationDetail", locationId);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteLocation = async () => {
    // try {
    //   setLoading(true);
    //   const deleteResponse = await delete_company_location_api(
    //     locationDetail.locationId
    //   );
    //   if (deleteResponse.status === 204) {
    //     setSubmissionStatus("success");
    //     setSubmissionMessage("Unit deleted successfully!");
    //     setTimeout(() => {
    //       setSubmissionStatus(null);
    //       setSubmissionMessage(null);
    //       setShowDeleteConfirmation(false);
    //     }, 1000);
    //     fetchData();
    //   } else {
    //     setSubmissionStatus("error");
    //     setSubmissionMessage("Error deleting unit");
    //     setTimeout(() => {
    //       setSubmissionStatus(null);
    //       setSubmissionMessage(null);
    //       setShowDeleteConfirmation(false);
    //     }, 1000);
    //   }
    // } catch (error) {
    //   console.error("Error deleting unit:", error);
    //   setSubmissionStatus("error");
    //   setSubmissionMessage("Error deleting unit");
    //   setTimeout(() => {
    //     setSubmissionStatus(null);
    //     setSubmissionMessage(null);
    //     setShowDeleteConfirmation(false);
    //   }, 1000);
    // } finally {
    //   setLoading(false);
    // }
  };

  return {
    locations,
    isLoadingData,
    error,
    showCreateLocationForm,
    showUpdateLocationForm,
    locationDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    setLocationDetail,
    setShowCreateLocationForm,
    setShowUpdateLocationForm,
    setShowDeleteConfirmation,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteLocation,
    handleCloseDeleteConfirmation,
    getStatusBadgeClass,
    getStatusLabel,
    handleDelete,
  };
};

export default useLocationList;
