import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSystemPrivilegeList from "./useSystemPrivilageList";
//import SystemPrivilege from "../systemPrivilege";
//import SystemPrivilegeUpdate from "../systemPrivilegeUpdate/systemPrivilegeUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../common/Pagination/Pagination";

const SystemPrivilegeList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const {
    permissions,
    isLoadingData,
    error,
    showCreatePermissionForm,
    showUpdatePermissionForm,
    getStatusBadgeClass,
    getStatusLabel,
    selectedRowData,
    permissionDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    setSelectedRowData,
    setShowCreatePermissionForm,
    setShowUpdatePermissionForm,
    setShowDeleteConfirmation,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleDelete,
    handleRowSelect,
    handleConfirmDeletePermission,
    handleCloseDeleteConfirmation,
    loading,
    updatePermissionStatus,
  } = useSystemPrivilegeList();

  const handleSearch = (event) => setSearchTerm(event.target.value);

  useEffect(() => {
    if (submissionStatus) {
      setShowMessage(true); // Show message when submissionStatus changes

      const timer = setTimeout(() => {
        setShowMessage(false); // Hide message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount or when submissionStatus changes
    }
  }, [submissionStatus]); // Run effect when submissionStatus changes

  const filteredPermissions = permissions.filter((p) =>
    p.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculations
  const totalItems = filteredPermissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPermissions = filteredPermissions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (error) return <ErrorComponent error={error} />;
  if (isLoadingData) return <LoadingSpinner />;

  //   if (showCreatePermissionForm) {
  //     return (
  //       <SystemPrivilege
  //         handleClose={() => setShowCreatePermissionForm(false)}
  //         handleUpdated={handleUpdated}
  //       />
  //     );
  //   }

  //   if (showUpdatePermissionForm) {
  //     return (
  //       <SystemPrivilegeUpdate
  //         handleClose={handleClose}
  //         permission={permissionDetail || selectedRowData[0]}
  //         handleUpdated={handleUpdated}
  //       />
  //     );
  //   }

  if (permissions.length === 0) {
    return (
      <div className="container mt-4">
        <h2>System Privileges</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any system privilege. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/systemPrivileges/create")}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>System Privileges</h2>
      {/* Display success or error message at the top */}
      {submissionStatus && showMessage && (
        <div className={`alert alert-${submissionStatus}`} role="alert">
          {submissionMessage}
        </div>
      )}

      <div className="mt-3 d-flex justify-content-start align-items-center">
        {
          <button
            type="button"
            className="btn bg-primary text-white"
            onClick={() => navigate('/systemPrivileges/create')}
          >
            Create
          </button>
        }
      </div>

      <div className="d-flex justify-content-end mb-3">
        <div className="search-bar input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Permission Name</th>
              <th>System Module</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPermissions.map((p) => (
              <tr key={p.permissionId}>
                <td>{p.permissionName}</td>
                <td>{p?.module?.moduleName}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      p.permissionStatus
                    )}`}
                  >
                    {getStatusLabel(p.permissionStatus)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(p)}
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
                    </svg>{' '}
                    Edit
                  </button>

                  <button
                    className="btn btn-danger me-2"
                    onClick={() => {
                      handleRowSelect([p.permissionId])
                      handleDelete(p)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          show={showDeleteConfirmation}
          handleClose={handleCloseDeleteConfirmation}
          handleConfirmDelete={handleConfirmDeletePermission}
          title={`Permission "${permissionDetail?.permissionName}"`}
          submissionStatus={submissionStatus}
          message={submissionMessage}
          loading={loading}
        />
      )}
    </div>
  )
};

export default SystemPrivilegeList;
