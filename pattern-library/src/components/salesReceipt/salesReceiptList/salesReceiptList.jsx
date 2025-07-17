import React from "react";
import useSalesReceiptList from "./useSalesReceiptList";
import SalesReceipt from "../salesReceipt";
import SalesReceiptDetail from "../salesReceiptDetail/salesReceiptDetail";
import SalesReceiptUpdate from "../salesReceiptUpdate/salesReceiptUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

const SalesReceiptList = () => {
  const {
    salesReceipts,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showDetailSRModal,
    showDetailSRModalInParent,
    showCreateSRForm,
    showUpdateSRForm,
    SRDetail,
    isPermissionsError,
    cashierSessionOpen,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleCloseDetailSRModal,
    handleViewDetails,
    setShowCreateSRForm,
    setShowUpdateSRForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    closeAlertAfterDelay,
    filter,
    setFilter,
    filteredSalesReceipts,
  } = useSalesReceiptList();

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (salesReceipts && !(salesReceipts.length >= 0))
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateSRForm && cashierSessionOpen) {
    return (
      <SalesReceipt
        handleClose={() => setShowCreateSRForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateSRForm) {
    return (
      <SalesReceiptUpdate
        handleClose={handleClose}
        salesReceipt={SRDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (salesReceipts.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Sales Receipts</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any sales receipt. Create a new one.</p>
          {hasPermission("Create Sales Receipt") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSRForm(true)}
            >
              Create
            </button>
          )}
          {showCreateSRForm && !cashierSessionOpen && (
            <div className="alert alert-warning mt-3" role="alert">
              Please open a cashier session to create sales receipts.
              {closeAlertAfterDelay()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Sales Receipts</h2>
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Sales Receipt") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSRForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Update Sales Receipt") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateSRForm(true)}
            >
              Edit
            </button>
          )}
        </div>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-outline-primary ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${
              filter === "short" ? "active" : ""
            }`}
            onClick={() => setFilter("short")}
          >
            Outstanding
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${
              filter === "excess" ? "active" : ""
            }`}
            onClick={() => setFilter("excess")}
          >
            Excess
          </button>
        </div>
      </div>
      {showCreateSRForm && !cashierSessionOpen && (
        <div className="alert alert-warning mt-3 mb-3" role="alert">
          Please open a cashier session to create sales receipts.
          {closeAlertAfterDelay()}
        </div>
      )}
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Reference Number</th>
              <th>Created By</th>
              <th>Receipt Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesReceipts.map((sr) => (
              <tr key={sr.salesReceiptId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(sr.salesReceiptId)}
                    onChange={() => handleRowSelect(sr.salesReceiptId)}
                  />
                </td>
                <td>{sr.referenceNumber}</td>
                <td>{sr.createdBy}</td>
                <td>{sr?.receiptDate?.split("T")[0]}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      sr.status
                    )}`}
                  >
                    {getStatusLabel(sr.status)}
                  </span>
                </td>
                <td>
                  {sr.status === 0 ? (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(sr)}
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
                      onClick={() => handleViewDetails(sr)}
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
        {showDetailSRModalInParent && (
          <SalesReceiptDetail
            show={showDetailSRModal}
            handleClose={handleCloseDetailSRModal}
            salesReceipt={SRDetail}
          />
        )}
      </div>
    </div>
  );
};

export default SalesReceiptList;
