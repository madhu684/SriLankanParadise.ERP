import React from "react";
import useMaterialRequisitionList from "./useMaterialRequisitionList";
import MaterialRequisitionApproval from "../materialRequisitionApproval/materialRequisitionApproval";
import MaterialRequisition from "../materialRequisition";
import MaterialRequisitionDetail from "../materialRequisitionDetail/materialRequisitionDetail";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";

const MaterialRequisitionList = () => {
  const {
    materialRequisitions,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveMRModal,
    showApproveMRModalInParent,
    showDetailMRModal,
    showDetailMRModalInParent,
    showCreateMRForm,
    MRDetail,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveMRModal,
    handleCloseApproveMRModal,
    handleShowDetailMRModal,
    handleCloseDetailMRModal,
    handleApproved,
    handleViewDetails,
    setShowCreateMRForm,
    hasPermission,
    handleUpdated,
    handleClose,
    formatDateInTimezone,
  } = useMaterialRequisitionList();

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || permissionError} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (materialRequisitions && !materialRequisitions.length > 0)
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateMRForm) {
    return (
      <MaterialRequisition
        handleClose={() => setShowCreateMRForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (!materialRequisitions) {
    return (
      <div className="container mt-4">
        <h2>Material Requisition Notes</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>
            You haven't created any material requisition note. Create a new one.
          </p>
          {hasPermission("Create Material Requisition Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateMRForm(true)}
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
      <h2>Material Requisition Notes</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Material Requisition Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateMRForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Material Requisition Note") &&
            selectedRowData[0]?.requestedUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveMRModal}
              >
                Approve
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
              <th>ID</th>
              <th>Requested By</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {materialRequisitions.map((mr) => (
              <tr key={mr.requisitionMasterId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(mr.requisitionMasterId)}
                    onChange={() => handleRowSelect(mr.requisitionMasterId)}
                  />
                </td>
                <td>{mr.requisitionMasterId}</td>
                <td>{mr.requestedBy}</td>
                <td>
                  {moment
                    .utc(mr.requisitionDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      mr.status
                    )}`}
                  >
                    {getStatusLabel(mr.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleViewDetails(mr)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>{" "}
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showApproveMRModalInParent && (
          <MaterialRequisitionApproval
            show={showApproveMRModal}
            handleClose={handleCloseApproveMRModal}
            materialRequisition={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailMRModalInParent && (
          <MaterialRequisitionDetail
            show={showDetailMRModal}
            handleClose={handleCloseDetailMRModal}
            materialRequisition={MRDetail}
          />
        )}
      </div>
    </div>
  );
};

export default MaterialRequisitionList;
