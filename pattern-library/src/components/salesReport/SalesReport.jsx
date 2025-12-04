import React, { useState } from "react";
import { FiCalendar, FiPrinter, FiSearch } from "react-icons/fi";
import { BsFileEarmarkExcel } from "react-icons/bs";
import useSalesReport from "./useSalesReport";
import ErrorComponent from "../errorComponent/errorComponent";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import CurrentDateTime from "../currentDateTime/currentDateTime";

const SalesReport = () => {
  const {
    fromDate,
    toDate,
    reportData,
    isLoading,
    error,
    setFromDate,
    setToDate,
    exportToExcel,
  } = useSalesReport();

  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [localFromDate, setLocalFromDate] = useState("");
  const [localToDate, setLocalToDate] = useState("");

  // Calculate totals
  const calculateTotals = () => {
    const totalInvoices = reportData.length;
    const totalAmount = reportData.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );
    const totalDue = reportData.reduce((sum, inv) => sum + inv.amountDue, 0);
    const totalLitres = reportData.reduce(
      (sum, inv) => sum + inv.totalLitres,
      0
    );

    return { totalInvoices, totalAmount, totalDue, totalLitres };
  };

  const totals = reportData.length > 0 ? calculateTotals() : null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { text: "Pending", class: "bg-warning" },
      2: { text: "Approved", class: "bg-success" },
      3: { text: "Cancelled", class: "bg-danger" },
    };
    const statusInfo = statusMap[status] || {
      text: "Unknown",
      class: "bg-secondary",
    };
    return (
      <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
    );
  };

  const handleSearch = () => {
    setFromDate(localFromDate);
    setToDate(localToDate);
  };

  const handleClear = () => {
    setLocalFromDate("");
    setLocalToDate("");
    setFromDate("");
    setToDate("");
  };

  const handleExport = () => {
    exportToExcel();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorComponent error={error?.message || "Error fetching sales report"} />
    );
  }

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h2 mb-0">Sales Report</h1>
          <div className="text-muted small">
            <FiCalendar className="me-1" />
            <CurrentDateTime />
          </div>
        </div>
        <hr className="mt-2" />
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="fromDate" className="form-label fw-semibold">
                <FiCalendar className="me-1" />
                From Date
              </label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                value={localFromDate}
                onChange={(e) => setLocalFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="toDate" className="form-label fw-semibold">
                <FiCalendar className="me-1" />
                To Date
              </label>
              <input
                type="date"
                className="form-control"
                id="toDate"
                value={localToDate}
                onChange={(e) => setLocalToDate(e.target.value)}
                min={localFromDate}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary me-2"
                disabled={!localFromDate || !localToDate}
                onClick={handleSearch}
              >
                <FiSearch className="me-1" />
                Search
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {/* {totals && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-primary">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">
                  Total Invoices
                </h6>
                <h3 className="card-title text-primary mb-0">
                  {totals.totalInvoices}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-success">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Total Amount</h6>
                <h3 className="card-title text-success mb-0">
                  {formatCurrency(totals.totalAmount)}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-warning">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Amount Due</h6>
                <h3 className="card-title text-warning mb-0">
                  {formatCurrency(totals.totalDue)}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-info">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Total Litres</h6>
                <h3 className="card-title text-info mb-0">
                  {totals.totalLitres.toFixed(2)} L
                </h3>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Action Buttons */}
      {reportData.length > 0 && (
        <div className="d-flex justify-content-end gap-2 mb-3">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={handleExport}
          >
            <BsFileEarmarkExcel className="me-1" />
            Export to Excel
          </button>
        </div>
      )}

      {/* Report Table */}
      {reportData.length > 0 ? (
        <div className="card shadow-sm flex-fill">
          <div className="card-body p-0">
            <div
              className="table-responsive overflow-auto"
              style={{ maxHeight: "65vh" }}
            >
              <table className="table table-hover mb-0">
                <thead className="table-light sticky-top z-1">
                  <tr>
                    <th style={{ width: "50px" }}></th>
                    <th>Reference No</th>
                    <th>Invoiced Date</th>
                    <th>Customer</th>
                    <th>Sales Person</th>
                    <th>Region</th>
                    <th className="text-end">Amount</th>
                    <th className="text-end">Amount Due</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((invoice) => (
                    <React.Fragment key={invoice.salesInvoiceId}>
                      <tr
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedInvoice(
                            expandedInvoice === invoice.salesInvoiceId
                              ? null
                              : invoice.salesInvoiceId
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-link p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedInvoice(
                                expandedInvoice === invoice.salesInvoiceId
                                  ? null
                                  : invoice.salesInvoiceId
                              );
                            }}
                          >
                            {expandedInvoice === invoice.salesInvoiceId
                              ? "▼"
                              : "▶"}
                          </button>
                        </td>
                        <td>
                          <strong>{invoice.referenceNo}</strong>
                        </td>
                        <td>{formatDate(invoice.invoiceDate)}</td>
                        <td>
                          <div>{invoice.customer.customerName}</div>
                          <small className="text-muted">
                            {invoice.customer.customerCode}
                          </small>
                        </td>
                        <td>
                          {invoice.customer.salesPerson.firstName}{" "}
                          {invoice.customer.salesPerson.lastName}
                        </td>
                        <td>{invoice.customer.region.name}</td>
                        <td className="text-end">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="text-end text-danger fw-semibold">
                          {formatCurrency(invoice.amountDue)}
                        </td>
                        <td className="text-center">
                          {getStatusBadge(invoice.status)}
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {expandedInvoice === invoice.salesInvoiceId && (
                        <tr>
                          <td colSpan="9" className="bg-light p-0">
                            <div className="p-4">
                              <h5 className="mb-4 fw-bold">Invoice Details</h5>

                              {/* Customer Info */}
                              <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                  <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                      <h6
                                        className="card-subtitle mb-3 text-muted text-uppercase"
                                        style={{
                                          fontSize: "0.85rem",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Customer Information
                                      </h6>
                                      <div className="d-flex flex-column gap-2">
                                        <div className="d-flex">
                                          <span
                                            className="fw-semibold me-2"
                                            style={{ minWidth: "140px" }}
                                          >
                                            Customer Name:
                                          </span>
                                          <span>
                                            {invoice.customer.customerName}
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          <span
                                            className="fw-semibold me-2"
                                            style={{ minWidth: "140px" }}
                                          >
                                            Contact Person:
                                          </span>
                                          <span>
                                            {invoice.customer.contactPerson}
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          <span
                                            className="fw-semibold me-2"
                                            style={{ minWidth: "140px" }}
                                          >
                                            Phone:
                                          </span>
                                          <span>{invoice.customer.phone}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                      <h6
                                        className="card-subtitle mb-3 text-muted text-uppercase"
                                        style={{
                                          fontSize: "0.85rem",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Invoice Information
                                      </h6>
                                      <div className="d-flex flex-column gap-2">
                                        <div className="d-flex">
                                          <span
                                            className="fw-semibold me-2"
                                            style={{ minWidth: "140px" }}
                                          >
                                            Due Date:
                                          </span>
                                          <span>
                                            {formatDate(invoice.dueDate)}
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          <span
                                            className="fw-semibold me-2"
                                            style={{ minWidth: "140px" }}
                                          >
                                            Remarks:
                                          </span>
                                          <span>
                                            {invoice.remarks || "N/A"}
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          <span
                                            className="fw-semibold me-2"
                                            style={{ minWidth: "140px" }}
                                          >
                                            Total Litres:
                                          </span>
                                          <span>{invoice.totalLitres}</span> L
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Line Items */}
                              <h5 className="mb-3 fw-bold">Invoice Items</h5>
                              <div className="table-responsive">
                                <table className="table table-bordered mb-0 bg-white">
                                  <thead className="table-light">
                                    <tr>
                                      <th
                                        className="py-3"
                                        style={{ width: "15%" }}
                                      >
                                        Item Code
                                      </th>
                                      <th
                                        className="py-3"
                                        style={{ width: "35%" }}
                                      >
                                        Item Name
                                      </th>
                                      <th
                                        className="py-3 text-center"
                                        style={{ width: "15%" }}
                                      >
                                        Quantity
                                      </th>
                                      <th
                                        className="py-3 text-end"
                                        style={{ width: "17.5%" }}
                                      >
                                        Unit Price
                                      </th>
                                      <th
                                        className="py-3 text-end"
                                        style={{ width: "17.5%" }}
                                      >
                                        Total Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.salesInvoiceDetails.map(
                                      (detail, idx) => (
                                        <tr key={idx}>
                                          <td className="py-3">
                                            {detail.itemMaster.itemCode}
                                          </td>
                                          <td className="py-3">
                                            {detail.itemMaster.itemName}
                                          </td>
                                          <td className="py-3 text-center">
                                            {detail.quantity}
                                          </td>
                                          <td className="py-3 text-end">
                                            {formatCurrency(detail.unitPrice)}
                                          </td>
                                          <td className="py-3 text-end">
                                            {formatCurrency(detail.totalPrice)}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                  <tfoot className="table-light">
                                    <tr>
                                      <td
                                        colSpan="4"
                                        className="py-3 text-end fw-bold"
                                        style={{ fontSize: "1.05rem" }}
                                      >
                                        Total:
                                      </td>
                                      <td
                                        className="py-3 text-end fw-bold"
                                        style={{ fontSize: "1.05rem" }}
                                      >
                                        {formatCurrency(invoice.totalAmount)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : fromDate && toDate ? (
        <div className="alert alert-info text-center" role="alert">
          <h5 className="alert-heading">No Records Found</h5>
          <p className="mb-0">
            No sales invoices found for the selected date range.
          </p>
        </div>
      ) : (
        <div className="alert alert-secondary text-center" role="alert">
          <FiCalendar size={48} className="mb-3 text-muted" />
          <h5 className="alert-heading">Select Date Range</h5>
          <p className="mb-0">
            Please select a date range and click Search to view the sales
            report.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
