import React, { useContext } from "react";
import {
  FiCalendar,
  FiRefreshCw,
  FiAlertCircle,
  FiMapPin,
  FiTag,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";
import useMinReport from "./useMinReport";
import Pagination from "common/components/common/Pagination/Pagination";
import LoadingSpinner from "common/components/loadingSpinner/loadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import { UserContext } from "common/context/userContext";
import PermissionComponent from "common/components/errorComponent/permissionComponent";

const MinReport = () => {
  const {
    allLocations,
    locationId,
    setLocationId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    issueType,
    setIssueType,
    handleFilterChange,
    reportItems,
    isLoadingReport,
    reportError,
    pageNumber,
    setPageNumber,
    pageSize,
    totalItems,
    paginate,
    refetch,
    expandedIssueId,
    toggleIssueDetails,
    formatCurrency,
    formatDate,
    handleDownloadExcel,
    isExporting,
  } = useMinReport();

  const { hasPermission } = useContext(UserContext);

  if (!hasPermission("View MIN Report")) {
    return <PermissionComponent />;
  }

  const getStatusLabel = (statusCode) => {
    if (statusCode === null || statusCode === undefined) {
      return "Unknown Status";
    }

    const secondDigit = parseInt(String(statusCode).charAt(1), 10);

    const statusLabels = {
      0: "Draft",
      1: "Pending Approval",
      2: "Approved",
      3: "Rejected",
      4: "In Progress",
      5: "Completed",
      6: "Cancelled",
      7: "On Hold",
    };

    return statusLabels[secondDigit] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    if (statusCode === null || statusCode === undefined) {
      return "bg-secondary";
    }

    const secondDigit = parseInt(String(statusCode).charAt(1), 10);

    const statusClasses = {
      0: "bg-secondary",
      1: "bg-warning",
      2: "bg-success",
      3: "bg-danger",
      4: "bg-info",
      5: "bg-primary",
      6: "bg-dark",
      7: "bg-secondary",
    };

    return statusClasses[secondDigit] || "bg-secondary";
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="mb-3">
        <h1 className="h2 mb-0">MIN Report</h1>
        <hr className="mt-2" />
      </div>

      {/* Search and Filters Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label htmlFor="location" className="form-label fw-semibold">
                <FiMapPin className="me-1" /> Location
              </label>
              <select
                id="location"
                className="form-select"
                value={locationId}
                onChange={(e) => {
                  setLocationId(e.target.value);
                  setPageNumber(1);
                }}
              >
                <option value="">All Locations</option>
                {allLocations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
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
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPageNumber(1);
                }}
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
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPageNumber(1);
                }}
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="issueType" className="form-label fw-semibold">
                <FiTag className="me-1" /> Issue Type
              </label>
              <select
                id="issueType"
                className="form-select"
                value={issueType}
                onChange={(e) => {
                  setIssueType(e.target.value);
                  setPageNumber(1);
                }}
                disabled
              >
                <option value="MIN">MIN</option>
                <option value="TIN">TIN</option>
              </select>
            </div>

            <div className="col-md-3 d-flex justify-content-end gap-2">
              <button
                className="btn btn-outline-success"
                onClick={handleDownloadExcel}
                disabled={
                  isExporting || isLoadingReport || reportItems.length === 0
                }
              >
                <FiDownload className={`me-1 ${isExporting ? "spin" : ""}`} />
                {isExporting ? "Exporting..." : "Excel"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => refetch()}
                disabled={isLoadingReport}
              >
                <FiRefreshCw
                  className={`me-1 ${isLoadingReport ? "spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {reportError && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <FiAlertCircle className="me-2" />
          <div>{reportError.message || "Failed to fetch MIN report data."}</div>
        </div>
      )}

      {/* Report Table Section */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover">
              <thead className="table-light">
                <tr>
                  <th className="px-3" style={{ width: "50px" }}></th>
                  <th className="px-3">Reference</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Issued Date</th>
                  <th>Token No</th>
                  <th>Created User</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingReport ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : reportItems && reportItems.length > 0 ? (
                  reportItems.map((item) => (
                    <React.Fragment key={item.issueMasterId}>
                      <tr>
                        <td className="px-3">
                          <button
                            className="btn btn-sm btn-link text-decoration-none"
                            onClick={() =>
                              toggleIssueDetails(item.issueMasterId)
                            }
                          >
                            {expandedIssueId === item.issueMasterId ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </button>
                        </td>
                        <td className="px-3 fw-bold">
                          {item.referenceNumber || item.issueMasterId}
                        </td>
                        <td>
                          {allLocations.find(
                            (loc) => loc.locationId === item.issuedLocationId,
                          )?.locationName || item.issuedLocationId}
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {item.issueType}
                          </span>
                        </td>
                        <td>
                          {item.issueDate ? formatDate(item.issueDate) : "-"}
                        </td>
                        <td>{item.tokenNo || "-"}</td>
                        <td>{item.createdBy || "-"}</td>
                        <td>
                          <span
                            className={`badge rounded-pill ${getStatusBadgeClass(
                              item.status,
                            )}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                      </tr>
                      {/* Detailed Items Row */}
                      {expandedIssueId === item.issueMasterId && (
                        <tr>
                          <td colSpan="8" className="p-0">
                            <div className="bg-light px-3 py-3">
                              <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom py-2 px-3">
                                  <h6 className="mb-0 text-primary fw-semibold">
                                    Issue Details
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
                                          <th className="text-center">Unit</th>
                                          <th
                                            className="text-center"
                                            style={{ width: "150px" }}
                                          >
                                            Dispatched Qty
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {item.issueDetails &&
                                        item.issueDetails.length > 0 ? (
                                          item.issueDetails.map(
                                            (detail, idx) => (
                                              <tr key={detail.issueDetailId}>
                                                <td className="px-3">
                                                  {idx + 1}
                                                </td>
                                                <td>
                                                  {detail.itemMaster
                                                    ?.itemName ||
                                                    "Unknown Item"}
                                                </td>
                                                <td className="text-center">
                                                  {detail.itemMaster?.unit
                                                    ?.unitName || "-"}
                                                </td>
                                                <td className="text-center">
                                                  {detail.quantity}
                                                </td>
                                              </tr>
                                            ),
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="4"
                                              className="text-center py-3 text-muted"
                                            >
                                              No details found for this issue.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
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
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <FiFileText size={48} className="mb-2 opacity-50" />
                        <p>No records found for the selected filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoadingReport && reportItems && reportItems.length > 0 && (
        <div className="mt-4 d-flex justify-content-between align-items-center">
          {/* <div className="text-muted small">
            Showing {(pageNumber - 1) * pageSize + 1} to{" "}
            {Math.min(pageNumber * pageSize, totalItems)} of {totalItems}{" "}
            entries
          </div> */}
          <Pagination
            itemsPerPage={pageSize}
            totalItems={totalItems}
            paginate={paginate}
            currentPage={pageNumber}
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

export default MinReport;













