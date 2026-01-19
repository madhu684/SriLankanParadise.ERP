import React, { useContext, useState } from "react";
import useSalesReceiptList from "./useSalesReceiptList";
import SalesReceipt from "../salesReceipt";
import SalesReceiptDetail from "../salesReceiptDetail/salesReceiptDetail";
import SalesReceiptUpdate from "../salesReceiptUpdate/salesReceiptUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import Pagination from "../../common/Pagination/Pagination";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { UserContext } from "../../../context/userContext";
import moment from "moment";
import useFormatCurrency from "../../../utility/useFormatCurrency";

const SalesReceiptList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    salesReceipts,
    invoices,
    isLoadingInvoices,
    isLoadingData,
    error,
    showDetailSRModal,
    showDetailSRModalInParent,
    selectedRowData,
    showCreateSRForm,
    showUpdateSRForm,
    SRDetail,
    isCashierSessionOpen,
    filter,
    filteredSalesReceipts,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleCloseDetailSRModal,
    setShowCreateSRForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    closeAlertAfterDelay,
    setFilter,
  } = useSalesReceiptList();

  const { hasPermission } = useContext(UserContext);

  const formatCurrency = useFormatCurrency();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const paginatedSalesReceipts = filteredSalesReceipts.filter(
    (sr) =>
      sr.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sr.createdBy.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (isLoadingData || (salesReceipts && !(salesReceipts.length >= 0))) {
    return <LoadingSpinner />;
  }

  if (showCreateSRForm && isCashierSessionOpen) {
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
      <div className="container-fluid px-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4 fw-bold">Sales Receipts</h2>
            {invoices.length > 0 && (
              <div className="card border-0 shadow-sm mb-4">
                <div
                  className="card-header bg-secondary text-white py-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-clipboard-check"></i>
                      Available Approved Sales Invoices
                    </h5>
                    <span className="badge bg-white text-dark fw-semibold px-3 py-2">
                      {invoices.length} Available
                    </span>
                  </div>
                </div>
                <div className="card-body p-0">
                  {invoices.length > 0 ? (
                    <div
                      className="table-responsive"
                      style={{
                        maxHeight: "320px",
                        overflowY: "auto",
                      }}
                    >
                      <table className="table table-hover mb-0">
                        <thead className="table-light sticky-top">
                          <tr>
                            <th className="text-nowrap py-3 px-4 border-bottom">
                              Reference Number
                            </th>
                            <th className="text-nowrap py-3 px-4 border-bottom">
                              Customer
                            </th>
                            <th className="text-nowrap py-3 px-4 border-bottom">
                              Invoiced Date
                            </th>
                            <th className="text-nowrap py-3 px-4 border-bottom">
                              Amount Due
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((trn) => (
                            <tr
                              key={trn.salesInvoiceId}
                              className="border-bottom"
                            >
                              <td className="fw-semibold py-3 px-4 text-dark">
                                {trn.referenceNo}
                              </td>
                              <td className="py-3 px-4">
                                {trn.inVoicedPersonName || "N/A"}
                              </td>
                              <td className="py-3 px-4 text-muted">
                                {moment
                                  .utc(trn.invoiceDate)
                                  .tz("Asia/Colombo")
                                  .format("YYYY-MM-DD")}
                              </td>
                              <td className="py-3 px-4 text-danger">
                                {formatCurrency(trn.amountDue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-0">
                        No approved Transfer Requisitions available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="d-flex flex-column justify-content-center align-items-center text-center py-1">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="currentColor"
                  className="bi bi-receipt text-muted"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                </svg>
              </div>
              <h5 className="text-muted mb-3">No Sales Receipts Yet</h5>
              <p className="text-muted mb-4">
                You haven't created any sales receipt. Create a new one to get
                started.
              </p>
              {hasPermission("Create Sales Receipt") && (
                <button
                  type="button"
                  className="btn btn-primary btn-md px-4"
                  onClick={() => setShowCreateSRForm(true)}
                >
                  <FaPlus className="me-2" />
                  Create
                </button>
              )}
              {showCreateSRForm && !isCashierSessionOpen && (
                <div className="alert alert-warning mt-4 mb-0" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Please open a cashier session to create sales receipts.
                  {closeAlertAfterDelay()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title mb-0 fw-bold">Sales Receipts</h2>
            {hasPermission("Create Sales Receipt") && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCreateSRForm(true)}
              >
                <FaPlus className="me-2" />
                Create
              </button>
            )}
            {/* {hasPermission("Update Sales Receipt") && isAnyRowSelected && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => setShowUpdateSRForm(true)}
            >
              Edit
            </button>
          )} */}
          </div>

          {invoices.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div
                className="card-header bg-secondary text-white py-3"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-clipboard-check"></i>
                    Available Approved Sales Invoices
                  </h5>
                  <span className="badge bg-white text-dark fw-semibold px-3 py-2">
                    {invoices.length} Available
                  </span>
                </div>
              </div>
              <div className="card-body p-0">
                {invoices.length > 0 ? (
                  <div
                    className="table-responsive"
                    style={{
                      maxHeight: "320px",
                      overflowY: "auto",
                    }}
                  >
                    <table className="table table-hover mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="text-nowrap py-3 px-4 border-bottom">
                            Reference Number
                          </th>
                          <th className="text-nowrap py-3 px-4 border-bottom">
                            Customer
                          </th>
                          <th className="text-nowrap py-3 px-4 border-bottom">
                            Invoiced Date
                          </th>
                          <th className="text-nowrap py-3 px-4 border-bottom">
                            Amount Due
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((trn) => (
                          <tr
                            key={trn.salesInvoiceId}
                            className="border-bottom"
                          >
                            <td className="fw-semibold py-3 px-4 text-dark">
                              {trn.referenceNo}
                            </td>
                            <td className="py-3 px-4">
                              {trn.inVoicedPersonName || "N/A"}
                            </td>
                            <td className="py-3 px-4 text-muted">
                              {moment
                                .utc(trn.invoiceDate)
                                .tz("Asia/Colombo")
                                .format("YYYY-MM-DD hh:mm:ss A")}
                            </td>
                            <td className="py-3 px-4 text-danger">
                              {formatCurrency(trn.amountDue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">
                      No approved Transfer Requisitions available
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCreateSRForm && !isCashierSessionOpen && (
            <div
              className="alert alert-warning d-flex align-items-center mb-3"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                Please open a cashier session to create sales receipts.
                {closeAlertAfterDelay()}
              </div>
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by reference number or creator..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex justify-content-md-end gap-2">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Filter receipts"
                >
                  <button
                    type="button"
                    className={`btn btn-outline-primary ${
                      filter === "all" ? "active" : ""
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    <FaFilter className="me-1" />
                    All
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-danger ${
                      filter === "outstanding" ? "active" : ""
                    }`}
                    onClick={() => setFilter("outstanding")}
                  >
                    Outstanding
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${
                      filter === "excess" ? "active" : ""
                    }`}
                    onClick={() => setFilter("excess")}
                  >
                    Excess
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {/* <th>
                    <input type="checkbox" />
                  </th> */}
                  <th className="fw-semibold">Reference Number</th>
                  <th className="fw-semibold">Created By</th>
                  <th className="fw-semibold">Receipt Date</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSalesReceipts
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((sr) => (
                    <tr key={sr.salesReceiptId}>
                      {/* <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(sr.salesReceiptId)}
                          onChange={() => handleRowSelect(sr.salesReceiptId)}
                        />
                      </td> */}
                      <td className="fw-medium">{sr.referenceNumber}</td>
                      <td>{sr.createdBy}</td>
                      <td>{sr?.receiptDate?.split("T")[0]}</td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(sr.status)}`}
                        >
                          {getStatusLabel(sr.status)}
                        </span>
                      </td>
                      <td className="text-end">
                        {sr.status === 0 ? (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleUpdate(sr)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              className="bi bi-pencil-fill me-1"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                            </svg>
                            Edit
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewDetails(sr)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              className="bi bi-arrow-right me-1"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                              />
                            </svg>
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {paginatedSalesReceipts.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={paginatedSalesReceipts.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}

          {showDetailSRModalInParent && (
            <SalesReceiptDetail
              show={showDetailSRModal}
              handleClose={handleCloseDetailSRModal}
              salesReceipt={SRDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReceiptList;
