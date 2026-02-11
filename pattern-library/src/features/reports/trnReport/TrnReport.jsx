import React from "react";
import useTrnReport from "./useTrnReport";
import {
  FiDownload,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiMapPin,
} from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";
import LoadingSpinner from "../../../common/components/loadingSpinner/loadingSpinner";
import Pagination from "../../../common/components/common/Pagination/Pagination";

const TrnReport = () => {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedWarehouse,
    setSelectedWarehouse,
    searchText,
    setSearchText,
    warehouseLocations,
    reportItems,
    isLoading,
    handleExportExcel,
    formatDateTime,
    getTrnStatusLabel,
    getTinStatusLabel,
    getTrnStatusBadgeClass,
    getTinStatusBadgeClass,
    totalTrnCount,
    totalTinCount,
    acceptedTinCount,
    pendingTinCount,
    users,
    createdUserId,
    setCreatedUserId,
    isPrivilegedUser,
    pageNumber,
    setPageNumber,
    totalPages,
    totalItems,
    pageSize,
    paginate,
  } = useTrnReport();

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="mb-3">
        <h1 className="h2 mb-0">TRN Report</h1>
        <hr className="mt-2" />
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <FiMapPin className="me-1" /> Locations
              </label>
              <select
                className="form-select"
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                {isPrivilegedUser && <option value="">All Locations</option>}
                {warehouseLocations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <FiCalendar className="me-1" /> From Date
              </label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <FiCalendar className="me-1" /> To Date
              </label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <FiSearch className="me-1" /> Search
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by TRN or TIN number..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {/* Total TRNs */}
        <div className="col-lg-3 col-md-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderLeft: "4px solid #0d6efd" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total TRNs</p>
                  <h4 className="mb-0 text-primary">{totalTrnCount}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FiFileText size={28} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total TINs */}
        <div className="col-lg-3 col-md-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderLeft: "4px solid #6c757d" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total TINs</p>
                  <h4 className="mb-0 text-secondary">{totalTinCount}</h4>
                </div>
                <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                  <BiTransfer size={28} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted TINs */}
        <div className="col-lg-3 col-md-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderLeft: "4px solid #198754" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Accepted TINs</p>
                  <h4 className="mb-0 text-success">{acceptedTinCount}</h4>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <FiCheckCircle size={28} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending TINs */}
        <div className="col-lg-3 col-md-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderLeft: "4px solid #ffc107" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Pending TINs</p>
                  <h4 className="mb-0 text-warning">{pendingTinCount}</h4>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <FiClock size={28} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 text-primary">Report Results</h5>
          <button
            className="btn btn-outline-success"
            onClick={handleExportExcel}
            disabled={reportItems.length === 0}
          >
            <FiDownload className="me-1" /> Export Excel
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th></th>
                  <th
                    colSpan="7"
                    className="text-center bg-primary bg-opacity-10"
                  >
                    Transfer Requisition (TRN)
                  </th>
                  <th
                    colSpan="8"
                    className="text-center bg-success bg-opacity-10"
                  >
                    Transfer Issue Note (TIN)
                  </th>
                </tr>
                <tr>
                  <th></th>
                  <th>TRN No</th>
                  <th>Created Date</th>
                  <th>Created User</th>
                  <th>From Warehouse</th>
                  <th>Status</th>
                  <th>Approved User</th>
                  <th>Approved Date</th>
                  <th>TIN No</th>
                  <th>Created Date</th>
                  <th>Created User</th>
                  <th>Warehouse</th>
                  <th>Status</th>
                  <th>Approved User</th>
                  <th>Approved Date</th>
                  <th>Accepted</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="16" className="text-center py-5">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : reportItems.length > 0 ? (
                  reportItems.map((item, index) => (
                    <tr key={index}>
                      {item.rowSpan > 0 && (
                        <>
                          <td
                            className="align-middle"
                            rowSpan={item.rowSpan}
                          >
                            {item.trnIndex}
                          </td>
                          <td
                            className="px-2 fw-bold align-middle"
                            rowSpan={item.rowSpan}
                          >
                            {item.trnReferenceNumber}
                          </td>
                          <td
                            className="align-middle text-nowrap"
                            rowSpan={item.rowSpan}
                          >
                            {formatDateTime(item.trnCreatedDate)}
                          </td>
                          <td
                            className="align-middle"
                            rowSpan={item.rowSpan}
                          >
                            {item.trnCreatedUser}
                          </td>
                          <td
                            className="align-middle"
                            rowSpan={item.rowSpan}
                          >
                            {item.trnWarehouse}
                          </td>
                          <td
                            className="align-middle"
                            rowSpan={item.rowSpan}
                          >
                            <span
                              className={`badge rounded-pill ${getTrnStatusBadgeClass(
                                item.trnStatus
                              )}`}
                            >
                              {getTrnStatusLabel(item.trnStatus)}
                            </span>
                          </td>
                          <td
                            className="align-middle"
                            rowSpan={item.rowSpan}
                          >
                            {item.trnApprovedUser || "-"}
                          </td>
                          <td
                            className="align-middle text-nowrap"
                            rowSpan={item.rowSpan}
                          >
                            {formatDateTime(item.trnApprovedDate)}
                          </td>
                        </>
                      )}
                      {/* TIN columns */}
                      <td className="fw-semibold">
                        {item.tinReferenceNumber}
                      </td>
                      <td className="text-nowrap">
                        {formatDateTime(item.tinCreatedDate)}
                      </td>
                      <td>{item.tinCreatedUser}</td>
                      <td>{item.tinWarehouse}</td>
                      <td>
                        {item.tinStatus !== null ? (
                          <span
                            className={`badge rounded-pill ${getTinStatusBadgeClass(
                              item.tinStatus
                            )}`}
                          >
                            {getTinStatusLabel(item.tinStatus)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{item.tinApprovedUser || "-"}</td>
                      <td className="text-nowrap">
                        {formatDateTime(item.tinApprovedDate)}
                      </td>
                      <td>
                        {item.tinAccepted === null ? (
                          "-"
                        ) : item.tinAccepted ? (
                          <span className="badge rounded-pill bg-success">
                            Accepted
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-danger">
                            Not Accepted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="text-center py-5 text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {!isLoading && reportItems && reportItems.length > 0 && (
        <div className="mt-4 d-flex justify-content-end">
          <Pagination
            itemsPerPage={pageSize}
            totalItems={totalItems}
            paginate={paginate}
            currentPage={pageNumber}
          />
        </div>
      )}
    </div>
  );
};

export default TrnReport;
