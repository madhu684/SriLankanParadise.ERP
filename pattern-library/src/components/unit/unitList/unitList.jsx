import React from "react";
import useUnitList from "./useUnitList";
import Unit from "../unit";
import UnitUpdate from "../unitUpdate/unitUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";

const UnitList = () => {
  const {
    units,
    isLoadingData,
    isLoadingPermissions,
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
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    setShowCreateUnitForm,
    setShowUpdateUnitForm,
    setShowDeleteConfirmation,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteUnit,
    handleCloseDeleteConfirmation,
  } = useUnitList();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoadingData || isLoadingPermissions || (units && !units.length > 0)) {
    return <LoadingSpinner />;
  }

  if (showCreateUnitForm) {
    return (
      <Unit
        handleClose={() => setShowCreateUnitForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateUnitForm) {
    return (
      <UnitUpdate
        handleClose={handleClose}
        unit={unitDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (!units) {
    return (
      <div className="container mt-4">
        <h2>Units</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any unit. Create a new one.</p>
          {hasPermission("Create Unit") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateUnitForm(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Units</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Unit") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateUnitForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Update Unit") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateUnitForm(true)}
            >
              Edit
            </button>
          )}
          {hasPermission("Delete Unit") && isAnyRowSelected && (
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Unit Id</th>
              <th>Unit Name</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.unitId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(u.unitId)}
                    onChange={() => handleRowSelect(u.unitId)}
                  />
                </td>
                <td>{u.unitId}</td>
                <td>{u.unitName}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      u.status
                    )}`}
                  >
                    {getStatusLabel(u.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(u)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DeleteConfirmationModal
          show={showDeleteConfirmation}
          handleClose={handleCloseDeleteConfirmation}
          handleConfirmDelete={handleConfirmDeleteUnit}
          title={`Unit "${selectedRowData[0]?.unitName}"`}
          submissionStatus={submissionStatus}
          message={submissionMessage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UnitList;
