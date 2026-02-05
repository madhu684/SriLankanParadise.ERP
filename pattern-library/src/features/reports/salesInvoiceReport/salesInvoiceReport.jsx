import React from "react";
import useSalesInvoiceReport from "./useSalesInvoiceReport";
import { FiDownload, FiCalendar, FiDollarSign, FiActivity, FiFileText } from "react-icons/fi";
import { BiReceipt } from "react-icons/bi";
import LoadingSpinner from "../../../common/components/loadingSpinner/loadingSpinner";
import PermissionComponent from "../../../common/components/errorComponent/permissionComponent";

const SalesInvoiceReport = () => {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    reportItems,
    isLoading,
    handleExportExcel,
    formatCurrency,
    getStatusLabel,
    getStatusBadgeClass,
    formatDate,
    getReceiptStatusLabel,
    getReceiptStatusBadgeClass,
    filter,
    setFilter,
    totalInvoiceAmount,
    totalReceiptAmount,
    totalExcessAmount,
    totalOutstandingAmount,
    totalInvoiceCount,
    hasPermission,
  } = useSalesInvoiceReport();

  if (!hasPermission("View Invoice Report")) return <PermissionComponent />;

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="mb-3">
        <h1 className="h2 mb-0">Invoice Report</h1>
        <hr className="mt-2" />
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">            
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
                 Filter
              </label>
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Outstanding">Outstanding</option>
                <option value="Excess">Excess</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
         {/* Total Invoice Count */}
         <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #6c757d" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Invoices</p>
                  <h4 className="mb-0 text-secondary">{totalInvoiceCount}</h4>
                </div>
                <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                  <FiFileText size={28} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Invoice Amount */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #0d6efd" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Invoice Amount</p>
                  <h4 className="mb-0 text-primary">{formatCurrency(totalInvoiceAmount)}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FiDollarSign size={28} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Receipt Amount */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #198754" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Receipt Amount</p>
                  <h4 className="mb-0 text-success">{formatCurrency(totalReceiptAmount)}</h4>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <BiReceipt size={28} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Excess Amount */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #198754" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Excess Amount</p>
                  <h4 className="mb-0 text-success">{formatCurrency(totalExcessAmount)}</h4>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <BiReceipt size={28} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Outstanding Amount */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #f00d0dff" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Outstanding Amount</p>
                  <h4 className="mb-0 text-danger">{formatCurrency(totalOutstandingAmount)}</h4>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                  <FiActivity size={28} className="text-danger" />
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
                  <th>#</th>
                  <th className="px-3">Invoice No</th>
                  <th>Customer Name</th>
                  <th>Inv Status</th>
                  <th className="text-end">Inv Amount</th>
                  <th>Receipt No</th>
                  <th className="text-end">Rcpt Amount</th>
                  <th className="text-end">Excess Amount</th>
                  <th className="text-end">Due Amount</th>
                  <th>Pay Mode</th>
                  <th className="text-center">Rcpt Status</th>
                  <th>Rcpt Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="12" className="text-center py-5">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : reportItems.length > 0 ? (
                  reportItems.map((item, index) => (
                    <tr key={index}>
                      {item.rowSpan > 0 && (
                        <>
                          <td className="align-middle" rowSpan={item.rowSpan}>{item.invoiceIndex}</td>
                          <td className="px-3 fw-bold align-middle" rowSpan={item.rowSpan}>{item.invoiceNo}</td>
                          <td className="align-middle" rowSpan={item.rowSpan}>{item.customerName}</td>
                          <td className="align-middle" rowSpan={item.rowSpan}>
                            <span
                              className={`badge rounded-pill ${getStatusBadgeClass(
                                item.invoiceStatus
                              )}`}
                            >
                              {getStatusLabel(item.invoiceStatus)}
                            </span>
                          </td>
                          <td className="text-end fw-semibold align-middle" rowSpan={item.rowSpan}>
                            {formatCurrency(item.invoiceAmount)}
                          </td>
                        </>
                      )}
                      <td>{item.receiptNumber || "-"}</td>
                      <td className="text-end">
                        {item.receiptAmount ? formatCurrency(item.receiptAmount) : "-"}
                      </td>
                      <td className="text-end">
                        {item.excessAmount ? formatCurrency(item.excessAmount) : "-"}
                      </td>
                      <td className="text-end fw-semibold text-danger">
                        {item.dueAmount ? formatCurrency(item.dueAmount) : "-"}
                      </td>
                      <td>
                        <span
                              className={`badge ${
                                item.paymentMode === "Cash"
                                  ? "bg-success"
                                  : item.paymentMode === "Bank Transfer"
                                    ? "bg-info"
                                    : item.paymentMode === "Gift Voucher"
                                      ? "bg-secondary"
                                      : "bg-danger"
                              }`}
                            >
                              {item.paymentMode}
                            </span>
                      </td>
                      <td className="text-center">
                        {item.receiptStatus !== null ? (
                             <span className={`badge rounded-pill ${getReceiptStatusBadgeClass(item.receiptStatus)}`}>
                               {getReceiptStatusLabel(item.receiptStatus)}
                             </span>
                        ) : "-"}
                      </td>
                      <td>{formatDate(item.receiptDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center py-5 text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
              {reportItems.length > 0 && (
                <tfoot className="table-light fw-bold">
                  <tr>
                    <td colSpan="4" className="text-end pe-3">Total</td>
                    <td className="text-end">{formatCurrency(totalInvoiceAmount)}</td>
                    <td></td>
                    <td className="text-end">{formatCurrency(totalReceiptAmount)}</td>
                    <td className="text-end">{formatCurrency(totalExcessAmount)}</td>
                    <td className="text-end text-danger">{formatCurrency(totalOutstandingAmount)}</td>
                    <td colSpan="3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoiceReport;
