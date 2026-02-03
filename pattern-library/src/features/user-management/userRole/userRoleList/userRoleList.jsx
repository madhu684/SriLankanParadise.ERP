import React, { useState } from "react";
import useUserRoleList from "./useUserRoleList";
import LoadingSpinner from "common/components/loadingSpinner/loadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import UserRoleUpdate from "features/user-management/userRole/userRoleUpdate/userRoleUpdate";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "common/components/confirmationModals/deleteConfirmationModal/deleteConfirmationModal";
import { FaSearch } from "react-icons/fa";
import Pagination from "common/components/common/Pagination/Pagination";
import UserRole from "features/user-management/userRole/userRole";
import "./userRoleList.css";

const UserRoleList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleToUpdate, setRoleToUpdate] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const {
    roles,
    isLoadingData,
    error,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    showUpdateRoleForm,
    showCreateRoleForm,
    selectedRowData,
    roleDetail,
    loading,
    updateRoleStatus,
    handleShowCreateForm,
    handleCloseCreateForm,
    handleCloseDeleteConfirmation,
    handleConfirmDeleteRole,
    getStatusLabel,
    getStatusBadgeClass,
    handleDelete,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleRowSelect,
  } = useUserRoleList();

  // Handler for search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handler for editing a role

  // Filter roles based on search query
  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading and error handling
  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoadingData || !(roles && roles.length >= 0)) {
    return <LoadingSpinner />;
  }

  // Render update role form if needed
  if (showUpdateRoleForm) {
    return (
      <UserRoleUpdate
        handleClose={handleClose}
        role={roleDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showCreateRoleForm) {
    return <UserRole handleClose={handleCloseCreateForm} />;
  }

  // Main render
  return (
    <div className="container mt-4">
      <h2>User Roles</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleShowCreateForm}
        >
          Create
        </button>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <div className="search-bar input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchQuery}
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
              <th>Role Name</th>
              <th>System Module</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleName}</td>
                  <td>{role?.module?.moduleName}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        role.status
                      )}`}
                    >
                      {getStatusLabel(role.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(role)}
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
                        handleRowSelect([role.roleId])
                        handleDelete(role)
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
          totalItems={filteredRoles.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          show={showDeleteConfirmation}
          handleClose={handleCloseDeleteConfirmation}
          handleConfirmDelete={handleConfirmDeleteRole}
          title={`Role "${roleDetail?.roleName}"`}
          submissionStatus={submissionStatus}
          message={submissionMessage}
          loading={loading}
        />
      )}
    </div>
  )
};

export default UserRoleList;













