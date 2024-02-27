import React from "react";
import useSalesInvoiceList from "./useSalesInvoiceList";
import SalesInvoiceApproval from "../salesInvoiceApproval/salesInvoiceApproval";
import SalesInvoice from "../salesInvoice";
import SalesInvoiceDetail from "../salesInvoiceDetail/salesInvoiceDetail";
import SalesInvoiceUpdate from "../salesInvoiceUpdate/salesInvoiceUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

const SalesInvoiceList = () => {
  const {
    salesInvoices,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveSIModal,
    showApproveSIModalInParent,
    showDetailSIModal,
    showDetailSIModalInParent,
    showCreateSIForm,
    showUpdateSIForm,
    SIDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveSIModal,
    handleCloseApproveSIModal,
    handleCloseDetailSIModal,
    handleApproved,
    handleViewDetails,
    setShowCreateSIForm,
    setShowUpdateSIForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
  } = useSalesInvoiceList();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (salesInvoices && !salesInvoices.length > 0)
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateSIForm) {
    return (
      <SalesInvoice
        handleClose={() => setShowCreateSIForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateSIForm) {
    return (
      <SalesInvoiceUpdate
        handleClose={handleClose}
        salesInvoice={SIDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (!salesInvoices) {
    return (
      <div className="container mt-4">
        <h2>Sales Invoices</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any sales invoice. Create a new one.</p>
          {hasPermission("Create Sales Invoice") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSIForm(true)}
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
      <h2>Sales Invoices</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Sales Invoice") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSIForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Sales Invoice") &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveSIModal}
              >
                Approve
              </button>
            )}
          {hasPermission("Update Sales Invoice") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateSIForm(true)}
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
                <input type="checkbox" />
              </th>
              <th>Reference No</th>
              <th>Created By</th>
              <th>Invoice Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {salesInvoices.map((si) => (
              <tr key={si.salesInvoiceId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(si.salesInvoiceId)}
                    onChange={() => handleRowSelect(si.salesInvoiceId)}
                  />
                </td>
                <td>{si.referenceNo}</td>
                <td>{si.createdBy}</td>
                <td>{si?.invoiceDate?.split("T")[0]}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      si.status
                    )}`}
                  >
                    {getStatusLabel(si.status)}
                  </span>
                </td>
                <td>
                  {si.status === 0 ? (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(si)}
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
                      onClick={() => handleViewDetails(si)}
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
        {showApproveSIModalInParent && (
          <SalesInvoiceApproval
            show={showApproveSIModal}
            handleClose={handleCloseApproveSIModal}
            salesInvoice={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailSIModalInParent && (
          <SalesInvoiceDetail
            show={showDetailSIModal}
            handleClose={handleCloseDetailSIModal}
            salesInvoice={SIDetail}
          />
        )}
      </div>
    </div>
  );
};

export default SalesInvoiceList;
