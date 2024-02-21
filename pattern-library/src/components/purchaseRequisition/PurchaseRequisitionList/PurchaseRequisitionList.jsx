import React from "react";
import usePurchaseRequisitionList from "./usePurchaseRequisitionList";
import PurchaseRequisitionApproval from "../PurchaseRequisitionApproval/PurchaseRequisitionApproval";
import PurchaseRequisition from "../purchaseRequisition";
import PurchaseRequisitionDetail from "../PurchaseRequisitionDetail/PurchaseRequisitionDetail";
import PurchaseRequisitionUpdate from "../purchaseRequisitionUpdate/purchaseRequisitionUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

const PurchaseRequisitionList = () => {
  const {
    purchaseRequisitions,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApprovePRModal,
    showApprovePRModalInParent,
    showDetailPRModal,
    showDetailPRModalInParent,
    showCreatePRForm,
    showUpdatePRForm,
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
    setShowUpdatePRForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
  } = usePurchaseRequisitionList();

  if (isLoadingData || isLoadingPermissions) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (showCreatePRForm) {
    return (
      <PurchaseRequisition
        handleClose={() => setShowCreatePRForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdatePRForm) {
    return (
      <PurchaseRequisitionUpdate
        handleClose={() => setShowUpdatePRForm(false)}
        purchaseRequisition={PRDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
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
          {hasPermission("Update Purchase Requisition") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdatePRForm(true)}
            >
              Edit
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
              <th>Details</th>
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
                  {pr.status === 0 ? (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(pr)}
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
                  ) : (
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
                  )}
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
