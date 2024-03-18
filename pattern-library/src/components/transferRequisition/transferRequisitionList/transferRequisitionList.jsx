import React from "react";
import useTransferRequisitionList from "./useTransferRequisitionList";
import TransferRequisitionApproval from "../transferRequisitionApproval/transferRequisitionApproval";
import TransferRequisition from "../transferRequisition";
import TransferRequisitionDetail from "../transferRequisitionDetail/transferRequisitionDetail";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";

const TransferRequisitionList = () => {
  const {
    transferRequisitions,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveTRModal,
    showApproveTRModalInParent,
    showDetailTRModal,
    showDetailTRModalInParent,
    showCreateTRForm,
    TRDetail,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveTRModal,
    handleCloseApproveTRModal,
    handleShowDetailTRModal,
    handleCloseDetailTRModal,
    handleApproved,
    handleViewDetails,
    setShowCreateTRForm,
    hasPermission,
    handleUpdated,
    handleClose,
    formatDateInTimezone,
  } = useTransferRequisitionList();

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || permissionError.message} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (transferRequisitions && !(transferRequisitions.length >= 0))
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateTRForm) {
    return (
      <TransferRequisition
        handleClose={() => setShowCreateTRForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (transferRequisitions.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Transfer Requisition Notes</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>
            You haven't created any transfer requisition note. Create a new one.
          </p>
          {hasPermission("Create Transfer Requisition Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateTRForm(true)}
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
      <h2>Transfer Requisition Notes</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Transfer Requisition Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateTRForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Transfer Requisition Note") &&
            selectedRowData[0]?.requestedUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveTRModal}
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
              <th>Reference Number</th>
              <th>Requested By</th>
              <th>TRN Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {transferRequisitions.map((mr) => (
              <tr key={mr.requisitionMasterId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(mr.requisitionMasterId)}
                    onChange={() => handleRowSelect(mr.requisitionMasterId)}
                  />
                </td>
                <td>{mr.referenceNumber}</td>
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
        {showApproveTRModalInParent && (
          <TransferRequisitionApproval
            show={showApproveTRModal}
            handleClose={handleCloseApproveTRModal}
            transferRequisition={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailTRModalInParent && (
          <TransferRequisitionDetail
            show={showDetailTRModal}
            handleClose={handleCloseDetailTRModal}
            transferRequisition={TRDetail}
          />
        )}
      </div>
    </div>
  );
};

export default TransferRequisitionList;
