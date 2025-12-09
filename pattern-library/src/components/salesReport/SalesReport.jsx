import React, { useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import { BsDroplet, BsFileEarmarkExcel } from "react-icons/bs";
import useSalesReport from "./useSalesReport";
import ErrorComponent from "../errorComponent/errorComponent";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import SummaryCard from "./components/SummaryCard";
import Pagination from "../common/Pagination/Pagination";

const SalesReport = () => {
  const {
    fromDate,
    toDate,
    reportData,
    isLoading,
    error,
    customers,
    regions,
    salesPersons,
    selectedCustomerId,
    selectedRegionId,
    selectedSalesPersonId,
    isCustomersLoading,
    isRegionsLoading,
    isSalesPersonsLoading,
    pagination,
    currentPage,
    pageSize,
    setCurrentPage,
    setSelectedCustomerId,
    setSelectedRegionId,
    setSelectedSalesPersonId,
    setFromDate,
    setToDate,
    exportToExcel,
    setPageSize,
  } = useSalesReport();

  const [expandedInvoice, setExpandedInvoice] = useState(null);

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
      5: { text: "Settled", class: "bg-primary" },
      8: { text: "Wright Off", class: "bg-danger" },
    };
    const statusInfo = statusMap[status] || {
      text: "Unknown",
      class: "bg-secondary",
    };
    return (
      <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
    );
  };

  const formatLargeNumber = (amount) => {
    const absAmount = Math.abs(amount);

    if (absAmount >= 1_000_000_000) {
      return `LKR ${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (absAmount >= 1_000_000) {
      return `LKR ${(amount / 1_000_000).toFixed(2)}M`;
    } else if (absAmount >= 1_000) {
      return `LKR ${(amount / 1_000).toFixed(2)}K`;
    } else {
      return formatCurrency(amount);
    }
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSelectedCustomerId("");
    setSelectedRegionId("");
    setSelectedSalesPersonId("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <div className="col-md-3">
              <label htmlFor="fromDate" className="form-label fw-semibold">
                <FiCalendar className="me-1" />
                From Date
              </label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="toDate" className="form-label fw-semibold">
                <FiCalendar className="me-1" />
                To Date
              </label>
              <input
                type="date"
                className="form-control"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate}
              />
            </div>
            <div className="col-md-2">
              <label
                htmlFor="customerFilter"
                className="form-label fw-semibold"
              >
                Customer
              </label>
              <select
                className="form-select"
                id="customerFilter"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                disabled={isCustomersLoading}
              >
                <option value="">All Customers</option>
                {customers?.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor="regionFilter" className="form-label fw-semibold">
                Region
              </label>
              <select
                className="form-select"
                id="regionFilter"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                disabled={isRegionsLoading}
              >
                <option value="">All Regions</option>
                {regions?.map((region) => (
                  <option key={region.regionId} value={region.regionId}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label
                htmlFor="salesPersonFilter"
                className="form-label fw-semibold"
              >
                Sales Person
              </label>
              <select
                className="form-select"
                id="salesPersonFilter"
                value={selectedSalesPersonId}
                onChange={(e) => setSelectedSalesPersonId(e.target.value)}
                disabled={isSalesPersonsLoading}
              >
                <option value="">All Sales Persons</option>
                {salesPersons?.map((sp) => (
                  <option key={sp.salesPersonId} value={sp.salesPersonId}>
                    {sp.firstName + " " + sp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {totals && (
        <div className="row g-3 mb-4">
          <SummaryCard
            title="Total Invoices"
            value={totals.totalInvoices}
            borderColor="primary"
            textColor="primary"
            icon={FiFileText}
          />

          <SummaryCard
            title="Total Amount"
            value={formatLargeNumber(totals.totalAmount)}
            subtitle={formatCurrency(totals.totalAmount)}
            borderColor="success"
            textColor="success"
            icon={FiDollarSign}
          />

          <SummaryCard
            title="Amount Due"
            value={formatLargeNumber(totals.totalDue)}
            subtitle={formatCurrency(totals.totalDue)}
            borderColor="warning"
            textColor="warning"
            icon={FiAlertCircle}
          />

          <SummaryCard
            title="Total Litres"
            value={`${totals.totalLitres.toFixed(2)} L`}
            borderColor="info"
            textColor="info"
            icon={BsDroplet}
          />
        </div>
      )}

      {/* Action Buttons */}
      {reportData.length > 0 && (
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
          {/* <div className="d-flex align-items-center gap-2">
            <label className="mb-0 text-muted small">Show:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-muted small">
              entries (Total: {pagination?.totalCount || 0})
            </span>
          </div> */}

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
        <>
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
                                <h5 className="mb-4 fw-bold">
                                  Invoice Details
                                </h5>

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
                                            <span>
                                              {invoice.customer.phone}
                                            </span>
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
                                              {formatCurrency(
                                                detail.totalPrice
                                              )}
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination
                itemsPerPage={pageSize}
                totalItems={pagination.totalCount}
                paginate={handlePageChange}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
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
