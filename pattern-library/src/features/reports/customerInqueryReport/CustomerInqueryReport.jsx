import React, { useContext } from "react";
import {
  FiSearch,
  FiCalendar,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiPhone,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiX,
  FiDownload,
} from "react-icons/fi";
import useCustomerInqueryReport from "./useCustomerInqueryReport";
import Pagination from "common/components/common/Pagination/Pagination";
import LoadingSpinner from "common/components/loadingSpinner/loadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import { UserContext } from "common/context/userContext";
import PermissionComponent from "common/components/errorComponent/permissionComponent";

const CustomerInqueryReport = () => {
  const {
    invoices,
    isLoadingInvoices,
    isFetching,
    error,
    customerSearchQuery,
    setCustomerSearchQuery,
    searchResults,
    isLoadingCustomers,
    selectedCustomer,
    handleSelectCustomer,
    setSelectedCustomer,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    currentPage,
    setCurrentPage,
    paginationMeta,
    itemsPerPage,
    formatCurrency,
    formatDate,
    refetch,
    expandedInvoiceId,
    toggleInvoiceDetails,
    handleDownloadExcel,
    isExporting,
  } = useCustomerInqueryReport();

  const { hasPermission } = useContext(UserContext);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!hasPermission("View Customer Inquiry Report"))
    return <PermissionComponent />;

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="mb-3">
        <h1 className="h2 mb-0">Customer Inquiry Report</h1>
        <hr className="mt-2" />
      </div>

      {/* Search and Filters Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-semibold">
                <FiUser className="me-1" /> Search Customer (Name or Phone)
              </label>
              <div className="position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or phone..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    disabled={selectedCustomer}
                  />
                  {/* {selectedCustomer && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      Clear
                    </button>
                  )} */}
                </div>

                {/* Search Results Dropdown */}
                {customerSearchQuery && searchResults.length > 0 && (
                  <div
                    className="position-absolute w-100 mt-1 shadow rounded bg-white"
                    style={{
                      zIndex: 1000,
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    <ul className="list-group list-group-flush">
                      {searchResults.map((customer) => (
                        <li
                          key={customer.customerId}
                          className="list-group-item list-group-item-action cursor-pointer"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">
                                {customer.customerName}
                              </div>
                              <div className="text-muted small">
                                <FiPhone className="me-1" />
                                {customer.phone}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {customerSearchQuery &&
                  searchResults.length === 0 &&
                  !isLoadingCustomers && (
                    <div
                      className="position-absolute w-100 mt-1 shadow rounded bg-white p-3 text-center text-muted"
                      style={{ zIndex: 1000 }}
                    >
                      No matching customers found.
                    </div>
                  )}
              </div>
            </div>

            <div className="col-md-2">
              <label htmlFor="fromDate" className="form-label fw-semibold">
                <FiCalendar className="me-1" /> From Date
              </label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="toDate" className="form-label fw-semibold">
                <FiCalendar className="me-1" /> To Date
              </label>
              <input
                type="date"
                className="form-control"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-3 d-flex justify-content-end gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => refetch()}
                disabled={isLoadingInvoices || isFetching || !selectedCustomer}
                title="Refresh Data"
              >
                <FiRefreshCw className={`me-1 ${isFetching ? "spin" : ""}`} />
                Refresh
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={handleDownloadExcel}
                disabled={
                  isLoadingInvoices ||
                  isFetching ||
                  !selectedCustomer ||
                  isExporting
                }
                title="Download Excel"
              >
                <FiDownload className={`me-1 ${isExporting ? "spin" : ""}`} />
                {isExporting ? "Exporting..." : "Excel"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Customer Info Card - Outside Filter Section */}
      {selectedCustomer && (
        <div
          className="card shadow-sm mb-4 border-primary"
          style={{ borderWidth: "2px" }}
        >
          <div className="card-body py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center flex-wrap gap-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <FiUser className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="text-muted small mb-1">Customer Name</div>
                    <div className="fw-bold fs-5">
                      {selectedCustomer.customerName}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <FiPhone className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="text-muted small mb-1">Phone Number</div>
                    <div className="fw-bold fs-5">{selectedCustomer.phone}</div>
                  </div>
                </div>

                {!isLoadingInvoices && invoices && (
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <FiFileText className="text-success" size={24} />
                    </div>
                    <div>
                      <div className="text-muted small mb-1">
                        Total Invoices
                      </div>
                      <div className="fw-bold fs-5 text-success">
                        {paginationMeta.totalCount || invoices.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setSelectedCustomer(null)}
                title="Clear selection"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <FiAlertCircle className="me-2" />
          <div>{error}</div>
        </div>
      )}

      {/* Invoices Table Section */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-3" style={{ width: "50px" }}></th>
                  <th>Invoice No</th>
                  <th>Date</th>
                  <th>Token No</th>
                  <th>Total Amount</th>
                  <th>Amount Due</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingInvoices ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : invoices && invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <React.Fragment key={invoice.salesInvoiceId}>
                      <tr>
                        <td className="px-3">
                          <button
                            className="btn btn-sm btn-link text-decoration-none"
                            onClick={() =>
                              toggleInvoiceDetails(invoice.salesInvoiceId)
                            }
                          >
                            {expandedInvoiceId === invoice.salesInvoiceId ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </button>
                        </td>
                        <td className="fw-medium">
                          {invoice.referenceNo ||
                            invoice.referenceNumber ||
                            invoice.salesInvoiceId}
                        </td>
                        <td>{formatDate(invoice.invoiceDate)}</td>
                        <td>{invoice.tokenNo || "-"}</td>
                        <td>Rs. {formatCurrency(invoice.totalAmount)}</td>
                        <td>
                          <span
                            className={
                              invoice.amountDue > 0
                                ? "text-danger fw-bold"
                                : "text-success"
                            }
                          >
                            Rs. {formatCurrency(invoice.amountDue)}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              toggleInvoiceDetails(invoice.salesInvoiceId)
                            }
                          >
                            {expandedInvoiceId === invoice.salesInvoiceId
                              ? "Hide Items"
                              : "View Items"}
                          </button>
                        </td>
                      </tr>
                      {/* Detailed Items Row */}
                      {expandedInvoiceId === invoice.salesInvoiceId && (
                        <tr>
                          <td colSpan="7" className="p-0">
                            <div className="bg-light px-3 py-3">
                              <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom py-2 px-3">
                                  <h6 className="mb-0 text-primary fw-semibold">
                                    Invoice Items
                                  </h6>
                                </div>
                                <div className="card-body p-0">
                                  <div className="table-responsive">
                                    <table className="table table-sm mb-0">
                                      <thead className="table-secondary">
                                        <tr>
                                          <th
                                            className="px-3"
                                            style={{ width: "60px" }}
                                          ></th>
                                          <th>Item Name</th>
                                          <th
                                            className="text-center"
                                            style={{ width: "100px" }}
                                          >
                                            Qty
                                          </th>
                                          <th
                                            className="text-end"
                                            style={{ width: "150px" }}
                                          >
                                            Unit Price
                                          </th>
                                          <th
                                            className="text-end px-3"
                                            style={{ width: "150px" }}
                                          >
                                            Total
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {invoice.salesInvoiceDetails &&
                                        invoice.salesInvoiceDetails.length >
                                          0 ? (
                                          invoice.salesInvoiceDetails.map(
                                            (detail, idx) => (
                                              <tr
                                                key={
                                                  detail.salesInvoiceDetailId
                                                }
                                              >
                                                <td className="px-3">
                                                  {idx + 1}
                                                </td>
                                                <td>
                                                  {detail.itemMaster
                                                    ?.itemName ||
                                                    "Unknown Item"}
                                                </td>
                                                <td className="text-center">
                                                  {detail.quantity}
                                                </td>
                                                <td className="text-end">
                                                  Rs.{" "}
                                                  {formatCurrency(
                                                    detail.unitPrice,
                                                  )}
                                                </td>
                                                <td className="text-end px-3">
                                                  Rs.{" "}
                                                  {formatCurrency(
                                                    detail.totalPrice,
                                                  )}
                                                </td>
                                              </tr>
                                            ),
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="5"
                                              className="text-center py-3 text-muted"
                                            >
                                              No items found for this invoice.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                      {invoice.salesInvoiceDetails &&
                                        invoice.salesInvoiceDetails.length >
                                          0 && (
                                          <tfoot className="table-light">
                                            <tr className="fw-bold">
                                              <td
                                                colSpan="4"
                                                className="text-end py-2 px-3"
                                              >
                                                Discount Amount:
                                              </td>
                                              <td className="text-end px-3 py-2">
                                                Rs.{" "}
                                                {formatCurrency(
                                                  invoice.discountAmount || 0,
                                                )}
                                              </td>
                                            </tr>
                                            <tr className="fw-bold">
                                              <td
                                                colSpan="4"
                                                className="text-end py-2 px-3"
                                              >
                                                Total:
                                              </td>
                                              <td className="text-end px-3 py-2">
                                                Rs.{" "}
                                                {formatCurrency(
                                                  invoice.totalAmount,
                                                )}
                                              </td>
                                            </tr>
                                          </tfoot>
                                        )}
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      {selectedCustomer
                        ? "No invoices found for this customer and date range."
                        : "Please search and select a customer to view invoices."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoadingInvoices && invoices && invoices.length > 0 && (
        <div className="mt-4">
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={paginationMeta.totalCount}
            paginate={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Add CSS for spin animation */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerInqueryReport;













