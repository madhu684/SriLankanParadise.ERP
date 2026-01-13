import React from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";
import { RiCurrencyLine } from "react-icons/ri";
import { BsFileEarmarkExcel } from "react-icons/bs";
import CurrentDateTime from "../../components/currentDateTime/currentDateTime";
import useCollectionReport from "./useCollectionReport";

const CollectionReport = () => {
  const {
    user,
    date,
    reportData,
    loading,
    error,
    setDate,
    refetch,
    handleExport,
    formatDateTime,
    formatCurrency,
  } = useCollectionReport();

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

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label htmlFor="user" className="form-label fw-semibold">
                <FiUser className="me-1" />
                User
              </label>
              <input
                type="text"
                className="form-control"
                id="user"
                value={user?.username || ""}
                disabled
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="date" className="form-label fw-semibold">
                <FiCalendar className="me-1" />
                Date
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
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="card shadow-sm border-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Amount</p>
                      <h4 className="mb-0">
                        Rs. {formatCurrency(reportData.totalAmount)}
                      </h4>
                    </div>
                    <div className="text-primary">
                      <FiDollarSign size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-success">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Cash Collection</p>
                      <h4 className="mb-0">
                        Rs. {formatCurrency(reportData.totalCashCollection)}
                      </h4>
                    </div>
                    <div className="text-success">
                      <FiDollarSign size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-info">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Bank Transfer</p>
                      <h4 className="mb-0">
                        Rs. {formatCurrency(reportData.totalBankTransferAmount)}
                      </h4>
                    </div>
                    <div className="text-info">
                      <FiDollarSign size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-secondary">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Receipts</p>
                      <h4 className="mb-0">
                        {reportData.items && reportData.items.length > 0
                          ? new Set(reportData.items.map((item) => item.billNo))
                              .size
                          : 0}
                      </h4>
                    </div>
                    <div className="text-secondary">
                      <FiFileText size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(reportData.totalShortAmount > 0 ||
              reportData.totalExcessAmount > 0) && (
              <>
                <div className="col-md-3">
                  <div className="card shadow-sm border-danger">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-muted mb-1 small">Short Amount</p>
                          <h4 className="mb-0">
                            Rs. {formatCurrency(reportData.totalShortAmount)}
                          </h4>
                        </div>
                        <div className="text-danger">
                          <FiAlertCircle size={32} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow-sm border-warning">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-muted mb-1 small">Excess Amount</p>
                          <h4 className="mb-0">
                            Rs. {formatCurrency(reportData.totalExcessAmount)}
                          </h4>
                        </div>
                        <div className="text-warning">
                          <FiAlertCircle size={32} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {reportData.totalCashierExpenseOutAmount > 0 && (
              <div className="col-md-3">
                <div className="card shadow-sm border-dark">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-1 small">
                          Cashier Expenses
                        </p>
                        <h4 className="mb-0">
                          Rs.{" "}
                          {formatCurrency(
                            reportData.totalCashierExpenseOutAmount
                          )}
                        </h4>
                      </div>
                      <div className="text-dark">
                        <RiCurrencyLine size={32} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <button
              className="btn btn-outline-success btn-sm"
              onClick={handleExport}
            >
              <BsFileEarmarkExcel className="me-1" />
              Export to Excel
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => refetch()}
              disabled={loading}
            >
              <FiRefreshCw className={`me-1 ${loading ? "spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Report Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              {reportData.items && reportData.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center"></th>
                        <th>Bill No</th>
                        <th className="text-center">Channel No</th>
                        <th>Patient Name</th>
                        <th>Telephone</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Short</th>
                        <th className="text-end">Excess</th>
                        <th>Payment Mode</th>
                        <th>Entered Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <strong>{item.billNo}</strong>
                          </td>
                          <td className="text-center">
                            {item.channelNo || "-"}
                          </td>
                          <td>{item.patientName}</td>
                          <td>{item.telephoneNo || "-"}</td>
                          <td className="text-end fw-semibold">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="text-end">
                            {item.shortAmount > 0 ? (
                              <span className="text-danger fw-semibold">
                                {formatCurrency(item.shortAmount)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-end">
                            {item.excessAmount > 0 ? (
                              <span className="text-success fw-semibold">
                                {formatCurrency(item.excessAmount)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.modeOfPayment === "Cash"
                                  ? "bg-success"
                                  : "bg-info"
                              }`}
                            >
                              {item.modeOfPayment}
                            </span>
                          </td>
                          <td className="small">
                            {formatDateTime(item.enteredTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr className="fw-bold">
                        <td colSpan="5" className="text-end">
                          Totals:
                        </td>
                        <td className="text-end">
                          {formatCurrency(reportData.totalAmount)}
                        </td>
                        <td className="text-end">
                          {reportData.totalShortAmount > 0
                            ? `${formatCurrency(reportData.totalShortAmount)}`
                            : "-"}
                        </td>
                        <td className="text-end">
                          {reportData.totalExcessAmount > 0
                            ? `${formatCurrency(reportData.totalExcessAmount)}`
                            : "-"}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FiFileText size={48} className="text-muted mb-3" />
                  <p className="text-muted">
                    No records found for the User on selected date.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionReport;
