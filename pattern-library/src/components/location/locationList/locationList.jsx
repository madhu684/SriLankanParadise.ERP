import React, { useState, useEffect } from "react";
import useLocationList from "./useLocationList";
//import Location from "../location";
import LocationUpdate from "../locationUpdate/locationUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";
import Pagination from "../../common/Pagination/Pagination";
import { FaSearch } from "react-icons/fa";

const LocationList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const {
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
    handleDelete,
    setShowCreateLocationForm,
    setShowUpdateLocationForm,
    setShowDeleteConfirmation,
    getStatusBadgeClass,
    getStatusLabel,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteLocation,
    handleCloseDeleteConfirmation,
  } = useLocationList();

  useEffect(() => {
    setCurrentPage(1);
  }, [locations]);

  const filteredLocations = locations.filter((location) =>
    location.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoadingData) {
    return <LoadingSpinner />;
  }

  //   if (showCreateLocationForm) {
  //     return (
  //       <Location
  //         handleClose={() => setShowCreateLocationForm(false)}
  //         handleUpdated={handleUpdated}
  //       />
  //     );
  //   }

  if (showUpdateLocationForm) {
    return (
      <LocationUpdate
        handleClose={handleClose}
        location={locationDetail}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (locations.length === 0) {
    return (
      <div className="container mt-4">
        <h2 className="text-black fw-bold">Locations</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any location. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateLocationForm(true)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-black fw-bold">Locations</h2>
        {
          <button
            type="button"
            className="btn bg-primary text-white"
            onClick={() => setShowCreateLocationForm(true)}
          >
            Create
          </button>
        }
      </div>
      <div className="d-flex justify-content-between mb-3">
        <div className="search-bar input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by location name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>
      {/* <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => setShowCreateLocationForm(true)}
          >
            Create
          </button>
        </div>
        <div className="input-group search-bar">
          <input
            type="text"
            className="form-control"
            placeholder="Search by location name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div> */}
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Location Name</th>
              <th>Location Type</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((l) => (
              <tr key={l.locationId}>
                <td>{l.locationName}</td>
                <td>{l?.locationType?.name}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      l.status
                    )}`}
                  >
                    {getStatusLabel(l.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(l)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                    </svg>{" "}
                    Edit
                  </button>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(l.locationId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DeleteConfirmationModal
          show={showDeleteConfirmation}
          handleClose={handleCloseDeleteConfirmation}
          handleConfirmDelete={handleConfirmDeleteLocation}
          title={`Location "${locationDetail?.locationName}"`}
          submissionStatus={submissionStatus}
          message={submissionMessage}
          loading={loading}
        />
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredLocations.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default LocationList;
