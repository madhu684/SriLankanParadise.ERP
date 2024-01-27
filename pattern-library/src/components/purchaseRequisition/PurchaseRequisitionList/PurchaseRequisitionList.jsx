import React from "react";
import usePurchaseRequisitionList from "./usePurchaseRequisitionList";
import { Spinner } from "react-bootstrap";
import PurchaseRequisitionApproval from "../PurchaseRequisitionApproval/PurchaseRequisitionApproval";
import PurchaseRequisition from "../purchaseRequisition";
import PurchaseRequisitionDetail from "../PurchaseRequisitionDetail/PurchaseRequisitionDetail";

const PurchaseRequisitionList = () => {
  const {
    purchaseRequisitions,
    isLoading,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApprovePRModal,
    showApprovePRModalInParent,
    showDetailPRModal,
    showDetailPRModalInParent,
    showCreatePRForm,
    userPermissions,
    PRDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApprovePRModal,
    handleCloseApprovePRModal,
    handleShowDetailPRModal,
    handleCloseDetailPRModal,
    handleApproved,
    handleViewDetails,
    setShowCreatePRForm,
    hasPermission,
  } = usePurchaseRequisitionList();

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ maxHeight: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Error: {error}
      </div>
    );
  }

  if (showCreatePRForm) {
    return (
      <PurchaseRequisition handleClose={() => setShowCreatePRForm(false)} />
    );
  }

  if (!purchaseRequisitions) {
    return (
      <div className="container mt-4">
        <h2>Purchase Requisitions</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any purchase requisition. Create a new one.</p>
          {hasPermission("Create Purchase Requisition") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePRForm(true)}
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
      <h2>Purchase Requisitions</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Purchase Requisition") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePRForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Purchase Requisition") &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApprovePRModal}
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
                <input type="checkbox" onChange={() => setSelectedRows([])} />
              </th>
              <th>ID</th>
              <th>Requested By</th>
              <th>Department</th>
              <th>Status</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {purchaseRequisitions.map((pr) => (
              <tr key={pr.purchaseRequisitionId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(pr.purchaseRequisitionId)}
                    onChange={() => handleRowSelect(pr.purchaseRequisitionId)}
                  />
                </td>
                <td>{pr.purchaseRequisitionId}</td>
                <td>{pr.requestedBy}</td>
                <td>{pr.department}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      pr.status
                    )}`}
                  >
                    {getStatusLabel(pr.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleViewDetails(pr)}
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
        {showApprovePRModalInParent && (
          <PurchaseRequisitionApproval
            show={showApprovePRModal}
            handleClose={handleCloseApprovePRModal}
            purchaseRequisition={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailPRModalInParent && (
          <PurchaseRequisitionDetail
            show={showDetailPRModal}
            handleClose={handleCloseDetailPRModal}
            purchaseRequisition={PRDetail}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseRequisitionList;
