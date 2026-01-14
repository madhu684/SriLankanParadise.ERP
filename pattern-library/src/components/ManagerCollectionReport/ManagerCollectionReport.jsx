import React from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";
import { RiBankLine, RiCurrencyLine } from "react-icons/ri";
import { BsCashStack, BsWallet2 } from "react-icons/bs";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useManagerCollectionReport from "./useManagerCollectionReport";
import ErrorComponent from "../errorComponent/errorComponent";

const ManagerCollectionReport = () => {
  const {
    date,
    reportData,
    loading,
    error,
    hasPermission,
    refetch,
    formatCurrency,
    setDate,
    handleExport,
  } = useManagerCollectionReport();

  if (!hasPermission("View Manager Collection Report"))
    return (
      <ErrorComponent error={"You don't have permission to view this page"} />
    );

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h2 mb-0">Collection Report</h1>
          <div className="text-muted small">
            <CurrentDateTime />
          </div>
        </div>
        <hr className="mt-2" />
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label htmlFor="date" className="form-label fw-semibold">
                <FiCalendar className="me-1" />
                Select Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={() => refetch()}
                disabled={loading}
              >
                <FiRefreshCw className={`me-1 ${loading ? "spin" : ""}`} />
                Refresh
              </button>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-success w-100"
                onClick={handleExport}
                disabled={loading || !reportData}
              >
                <FiDownload className="me-1" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>

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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && reportData && (
        <>
          <div className="row g-3 mb-4">
            {/* Total Amount */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderLeft: "4px solid #0d6efd" }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1 small uppercase fw-bold">
                    Overall Total Amount
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-primary">
                      Rs. {formatCurrency(reportData.totalAmount)}
                    </h4>
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                      <FiDollarSign size={24} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Cash */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderLeft: "4px solid #198754" }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1 small uppercase fw-bold">
                    Overall Cash Collection
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-success">
                      Rs. {formatCurrency(reportData.totalCash)}
                    </h4>
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                      <BsCashStack size={24} className="text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Bank */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderLeft: "4px solid #0dcaf0" }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1 small uppercase fw-bold">
                    Overall Bank Transfer
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-info">
                      Rs. {formatCurrency(reportData.totalBankTransfer)}
                    </h4>
                    <div className="bg-info bg-opacity-10 p-2 rounded-circle">
                      <RiBankLine size={24} className="text-info" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderLeft: "4px solid #6f42c1" }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1 small uppercase fw-bold">
                    Overall Cashier Expenses
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0" style={{ color: "#6f42c1" }}>
                      Rs. {formatCurrency(reportData.totalExpenses)}
                    </h4>
                    <div
                      className="bg-opacity-10 p-2 rounded-circle"
                      style={{ backgroundColor: "rgba(111, 66, 193, 0.1)" }}
                    >
                      <RiCurrencyLine size={24} style={{ color: "#6f42c1" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Cash in Hand */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderLeft: "4px solid #20c997" }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1 small uppercase fw-bold">
                    Overall Cash In Hand
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0" style={{ color: "#20c997" }}>
                      Rs. {formatCurrency(reportData.totalCashInHand)}
                    </h4>
                    <div
                      className="bg-opacity-10 p-2 rounded-circle"
                      style={{ backgroundColor: "rgba(32, 201, 151, 0.1)" }}
                    >
                      <BsWallet2 size={24} style={{ color: "#20c997" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Reports */}
          <h3 className="h4 mb-3 d-flex align-items-center">
            <FiUser className="me-2" />
            User Collection Summaries
          </h3>

          {reportData.userReports?.length > 0 ? (
            <div className="row g-4">
              {reportData.userReports.map((userReport) => (
                <div key={userReport.userId} className="col-12">
                  <div className="card shadow-sm overflow-hidden border-0">
                    <div className="card-header bg-dark text-white p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          <FiUser className="me-2" />
                          {userReport.userName}
                        </h5>
                        <div className="badge bg-primary fs-6">
                          Total Collected: Rs.{" "}
                          {formatCurrency(userReport.userTotalAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="ps-4">
                                <FiClock className="me-1" /> Session
                              </th>
                              <th className="text-end">Total Amount</th>
                              <th className="text-end text-danger">Short</th>
                              <th className="text-end text-warning">Excess</th>
                              <th className="text-end text-success">Cash</th>
                              <th className="text-end text-info">
                                Bank Transfer
                              </th>
                              <th className="text-end text-secondary">
                                Expenses
                              </th>
                              <th className="text-end fw-bold pe-4">
                                Cash In Hand
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {userReport.sessions.map((session, sIdx) => (
                              <tr key={sIdx}>
                                <td className="ps-4">
                                  <span className="badge bg-secondary">
                                    {session.sessionId
                                      ? `Session #${session.sessionId}`
                                      : "Main Session"}
                                  </span>
                                </td>
                                <td className="text-end fw-semibold">
                                  {formatCurrency(session.sessionTotalAmount)}
                                </td>
                                <td className="text-end text-danger">
                                  {formatCurrency(session.sessionTotalShort)}
                                </td>
                                <td className="text-end text-warning">
                                  {formatCurrency(session.sessionTotalExcess)}
                                </td>
                                <td className="text-end text-success">
                                  {formatCurrency(session.sessionTotalCash)}
                                </td>
                                <td className="text-end text-info">
                                  {formatCurrency(
                                    session.sessionTotalBankTransfer
                                  )}
                                </td>
                                <td className="text-end text-secondary">
                                  {formatCurrency(session.sessionTotalExpenses)}
                                </td>
                                <td className="text-end fw-bold pe-4">
                                  {formatCurrency(
                                    session.sessionTotalCashInHand
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-light border-top">
                            <tr className="fw-bold">
                              <td className="ps-4">User Totals</td>
                              <td className="text-end">
                                {formatCurrency(userReport.userTotalAmount)}
                              </td>
                              <td className="text-end text-danger">
                                {formatCurrency(userReport.userTotalShort)}
                              </td>
                              <td className="text-end text-warning">
                                {formatCurrency(userReport.userTotalExcess)}
                              </td>
                              <td className="text-end text-success">
                                {formatCurrency(userReport.userTotalCash)}
                              </td>
                              <td className="text-end text-info">
                                {formatCurrency(
                                  userReport.userTotalBankTransfer
                                )}
                              </td>
                              <td className="text-end text-secondary">
                                {formatCurrency(userReport.userTotalExpenses)}
                              </td>
                              <td className="text-end fw-bold pe-4">
                                {formatCurrency(userReport.userTotalCashInHand)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <p className="text-muted mb-0">
                  No collections found for any user on this date.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State when no data yet */}
      {!loading && !reportData && !error && (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <FiCalendar size={48} className="text-muted mb-3" />
          <p className="text-muted">
            Select a date to view the manager collection report.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManagerCollectionReport;
