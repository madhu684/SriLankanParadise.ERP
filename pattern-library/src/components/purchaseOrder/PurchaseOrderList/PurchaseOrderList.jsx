import React from "react";
import usePurchaseOrderList from "./usePurchaseOrderList";
import { Spinner } from "react-bootstrap";
import PurchaseOrderApproval from "../PurchaseOrderApproval/PurchaseOrderApproval";
import PurchaseOrder from "../purchaseOrder";
import PurchaseOrderDetail from "../PurchaseOrderDetail/PurchaseOrderDetail";

const PurchaseOrderList = () => {
  const {
    purchaseOrders,
    isLoading,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApprovePOModal,
    showApprovePOModalInParent,
    showDetailPOModal,
    showDetailPOModalInParent,
    showCreatePOForm,
    userPermissions,
    PRDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApprovePOModal,
    handleCloseApprovePOModal,
    handleShowDetailPOModal,
    handleCloseDetailPOModal,
    handleApproved,
    handleViewDetails,
    setShowCreatePOForm,
    hasPermission,
  } = usePurchaseOrderList();

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
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ maxHeight: "80vh" }}
      >
        Error: {error}
      </div>
    );
  }

  if (showCreatePOForm) {
    return <PurchaseOrder handleClose={() => setShowCreatePOForm(false)} />;
  }

  if (!purchaseOrders) {
    return (
      <div className="container mt-4">
        <h2>Purchase Orders</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any purchase Order. Create a new one.</p>
          {hasPermission("Create Purchase Order") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePOForm(true)}
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
      <h2>Purchase Orders</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Purchase Order") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePOForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Purchase Order") &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApprovePOModal}
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
            {purchaseOrders.map((pr) => (
              <tr key={pr.purchaseOrderId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(pr.purchaseOrderId)}
                    onChange={() => handleRowSelect(pr.purchaseOrderId)}
                  />
                </td>
                <td>{pr.purchaseOrderId}</td>
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
        {showApprovePOModalInParent && (
          <PurchaseOrderApproval
            show={showApprovePOModal}
            handleClose={handleCloseApprovePOModal}
            purchaseOrder={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailPOModalInParent && (
          <PurchaseOrderDetail
            show={showDetailPOModal}
            handleClose={handleCloseDetailPOModal}
            purchaseOrder={PRDetail}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderList;
