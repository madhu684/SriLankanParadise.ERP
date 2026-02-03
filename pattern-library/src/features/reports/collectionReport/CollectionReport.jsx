import React from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
} from "react-icons/fi";
import { RiCurrencyLine, RiBankLine, RiCoupon2Line } from "react-icons/ri";
import { BsFileEarmarkExcel, BsCashStack, BsWallet2 } from "react-icons/bs";
import { BiReceipt } from "react-icons/bi";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import useCollectionReport from "./useCollectionReport";

const CollectionReport = () => {
  const {
    user,
    activeCashierSession,
    date,
    reportData,
    loading,
    error,
    setDate,
    refetch,
    handleExport,
    formatDateTime,
    formatCurrency,
    selectedSessionId,
    setSelectedSessionId,
    userCashierSessions,
  } = useCollectionReport();

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h2 mb-0">User Collection Report</h1>
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
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <FiClock className="me-1" />
                Session
              </label>
              <select
                className="form-select"
                value={selectedSessionId || ""}
                onChange={(e) => setSelectedSessionId(Number(e.target.value))}
                disabled={
                  !userCashierSessions || userCashierSessions.length === 0
                }
              >
                {userCashierSessions && userCashierSessions.length > 0 ? (
                  userCashierSessions.map((session) => (
                    <option
                      key={session.cashierSessionId}
                      value={session.cashierSessionId}
                    >
                      {formatDateTime(session.sessionIn)}
                    </option>
                  ))
                ) : (
                  <option value="">No Sessions Found</option>
                )}
              </select>
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
            {/* Total Receipts */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0"
                style={{ borderLeft: "4px solid #6c757d" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Receipts</p>
                      <h4 className="mb-0 text-secondary">
                        {reportData.items && reportData.items.length > 0
                          ? new Set(reportData.items.map((item) => item.billNo))
                              .size
                          : 0}
                      </h4>
                    </div>
                    <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                      <BiReceipt size={28} className="text-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0"
                style={{ borderLeft: "4px solid #0d6efd" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Amount</p>
                      <h4 className="mb-0 text-primary">
                        Rs. {formatCurrency(reportData.totalAmount)}
                      </h4>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <FiDollarSign size={28} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Collection */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0"
                style={{ borderLeft: "4px solid #198754" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Cash Collection</p>
                      <h4 className="mb-0 text-success">
                        Rs. {formatCurrency(reportData.totalCashCollection)}
                      </h4>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                      <BsCashStack size={28} className="text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0"
                style={{ borderLeft: "4px solid #0dcaf0" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Bank Transfer</p>
                      <h4 className="mb-0 text-info">
                        Rs. {formatCurrency(reportData.totalBankTransferAmount)}
                      </h4>
                    </div>
                    <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                      <RiBankLine size={28} className="text-info" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Voucher */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0"
                style={{ borderLeft: "4px solid #fd7e14" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Gift Vouchers</p>
                      <h4
                        className="mb-0 text-orange"
                        style={{ color: "#fd7e14" }}
                      >
                        Rs. {formatCurrency(reportData.totalGiftVoucherAmount)}
                      </h4>
                    </div>
                    <div
                      className="p-3 rounded-circle"
                      style={{ backgroundColor: "rgba(253, 126, 20, 0.1)" }}
                    >
                      <RiCoupon2Line size={28} style={{ color: "#fd7e14" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash in Hand */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-0"
                style={{ borderLeft: "4px solid #20c997" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Cash in Hand</p>
                      <h4 className="mb-0" style={{ color: "#20c997" }}>
                        Rs. {formatCurrency(reportData.totalCashInHandAmount)}
                      </h4>
                    </div>
                    <div
                      className="p-3 rounded-circle"
                      style={{ backgroundColor: "rgba(32, 201, 151, 0.1)" }}
                    >
                      <BsWallet2 size={28} style={{ color: "#20c997" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Amount */}
            {reportData.totalShortAmount > 0 && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div
                  className="card shadow-sm border-0"
                  style={{ borderLeft: "4px solid #dc3545" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-1 small">Short Amount</p>
                        <h4 className="mb-0 text-danger">
                          Rs. {formatCurrency(reportData.totalShortAmount)}
                        </h4>
                      </div>
                      <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                        <FiTrendingDown size={28} className="text-danger" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Excess Amount */}
            {reportData.totalExcessAmount > 0 && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div
                  className="card shadow-sm border-0"
                  style={{ borderLeft: "4px solid #ffc107" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-1 small">Excess Amount</p>
                        <h4 className="mb-0 text-warning">
                          Rs. {formatCurrency(reportData.totalExcessAmount)}
                        </h4>
                      </div>
                      <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                        <FiTrendingUp size={28} className="text-warning" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cashier Expenses */}
            {reportData.totalCashierExpenseOutAmount > 0 && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div
                  className="card shadow-sm border-0"
                  style={{ borderLeft: "4px solid #6f42c1" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-1 small">
                          Cashier Expenses
                        </p>
                        <h4 className="mb-0" style={{ color: "#6f42c1" }}>
                          Rs.{" "}
                          {formatCurrency(
                            reportData.totalCashierExpenseOutAmount,
                          )}
                        </h4>
                      </div>
                      <div
                        className="p-3 rounded-circle"
                        style={{ backgroundColor: "rgba(111, 66, 193, 0.1)" }}
                      >
                        <RiCurrencyLine
                          size={28}
                          style={{ color: "#6f42c1" }}
                        />
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
                        <th>Invoice Reference</th>
                        <th className="text-center">Token No</th>
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
                          <td>
                            <strong>{item.invoiceReference || "-"}</strong>
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
                                  : item.modeOfPayment === "Bank Transfer"
                                    ? "bg-info"
                                    : item.modeOfPayment === "Gift Voucher"
                                      ? "bg-warning"
                                      : "bg-secondary"
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
                        <td colSpan="6" className="text-end">
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

          {/* Daily Summary Section */}
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                Daily Summary of {user.username} (Full Day)
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="p-3 border rounded bg-light">
                    <p className="text-muted mb-1 small">Total Amount</p>
                    <h5 className="mb-0 text-primary">
                      Rs. {formatCurrency(reportData.dailyTotalAmount)}
                    </h5>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded bg-light">
                    <p className="text-muted mb-1 small">Cash Collection</p>
                    <h5 className="mb-0 text-success">
                      Rs. {formatCurrency(reportData.dailyTotalCashCollection)}
                    </h5>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded bg-light">
                    <p className="text-muted mb-1 small">Bank Transfer</p>
                    <h5 className="mb-0 text-info">
                      Rs.{" "}
                      {formatCurrency(reportData.dailyTotalBankTransferAmount)}
                    </h5>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded bg-light">
                    <p className="text-muted mb-1 small">Gift Vouchers</p>
                    <h5 className="mb-0" style={{ color: "#fd7e14" }}>
                      Rs.{" "}
                      {formatCurrency(reportData.dailyTotalGiftVoucherAmount)}
                    </h5>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 border rounded bg-light">
                    <p className="text-muted mb-1 small">Cash In Hand</p>
                    <h5 className="mb-0">
                      Rs.{" "}
                      {formatCurrency(reportData.dailyTotalCashInHandAmount)}
                    </h5>
                  </div>
                </div>

                {(reportData.dailyTotalShortAmount > 0 ||
                  reportData.dailyTotalExcessAmount > 0 ||
                  reportData.dailyTotalCashierExpenseOutAmount > 0) && (
                  <>
                    <div className="col-12">
                      <hr className="my-1" />
                    </div>
                    {reportData.dailyTotalShortAmount > 0 && (
                      <div className="col-md-3">
                        <div className="p-3 border rounded bg-light">
                          <p className="text-muted mb-1 small">Short Amount</p>
                          <h5 className="mb-0 text-danger">
                            Rs.{" "}
                            {formatCurrency(reportData.dailyTotalShortAmount)}
                          </h5>
                        </div>
                      </div>
                    )}
                    {reportData.dailyTotalExcessAmount > 0 && (
                      <div className="col-md-3">
                        <div className="p-3 border rounded bg-light">
                          <p className="text-muted mb-1 small">Excess Amount</p>
                          <h5 className="mb-0 text-warning">
                            Rs.{" "}
                            {formatCurrency(reportData.dailyTotalExcessAmount)}
                          </h5>
                        </div>
                      </div>
                    )}
                    {reportData.dailyTotalCashierExpenseOutAmount > 0 && (
                      <div className="col-md-3">
                        <div className="p-3 border rounded bg-light">
                          <p className="text-muted mb-1 small">
                            Cashier Expenses
                          </p>
                          <h5 className="mb-0 text-secondary">
                            Rs.{" "}
                            {formatCurrency(
                              reportData.dailyTotalCashierExpenseOutAmount,
                            )}
                          </h5>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionReport;













