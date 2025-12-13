import React from "react";
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiPlus,
  FiX,
  FiDownload,
} from "react-icons/fi";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import Pagination from "../common/Pagination/Pagination";
import MultiSelect from "./components/MultiSelect";
import useAgeAnalysisReport from "./useAgeAnalysisReport";
import { exportAgeAnalysisToExcel } from "./components/exportAgeAnalysisToExcel";
import toast from "react-hot-toast";
import CustomSelect from "./components/CustomSelect";

const AgeAnalysisReport = () => {
  const {
    // Filter states
    asOfDate,
    setAsOfDate,

    // Customer filter
    customerFilterType,
    setCustomerFilterType,
    selectedCustomers,
    setSelectedCustomers,
    customerCodeFrom,
    setCustomerCodeFrom,
    customerCodeTo,
    setCustomerCodeTo,

    // Region filter
    regionFilterType,
    setRegionFilterType,
    selectedRegions,
    setSelectedRegions,
    regionCodeFrom,
    setRegionCodeFrom,
    regionCodeTo,
    setRegionCodeTo,

    // Sales Person filter
    salesPersonFilterType,
    setSalesPersonFilterType,
    selectedSalesPersons,
    setSelectedSalesPersons,
    salesPersonCodeFrom,
    setSalesPersonCodeFrom,
    salesPersonCodeTo,
    setSalesPersonCodeTo,

    // Slab configuration
    useCustomSlabs,
    setUseCustomSlabs,
    customSlabs,
    setCustomSlabs,

    // Data and loading
    reportData,
    isLoading,
    isError,
    error,

    // Master data
    customers,
    regions,
    salesPersons,
    isCustomersLoading,
    isRegionsLoading,
    isSalesPersonsLoading,
    sortedCustomerCodes,
    sortedRegionCodes,
    sortedSalesPersonCodes,

    // Pagination
    currentPage,
    setCurrentPage,

    // Actions
    handleSearch,
    addCustomSlab,
    removeCustomSlab,
    updateCustomSlab,
    getCustomersByRange,
    getRegionsByRange,
    getSalesPersonsByRange,
    hasSearched,
    setHasSearched,
    setSearchParams,
  } = useAgeAnalysisReport();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Excel export
  const handleExportExcel = () => {
    if (!reportData || reportData.data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const filters = {
      asOfDate: new Date(asOfDate).toLocaleDateString("en-GB"),
      salesPersonFrom:
        salesPersonFilterType === "range" ? salesPersonCodeFrom : "",
      salesPersonTo: salesPersonFilterType === "range" ? salesPersonCodeTo : "",
      regionFrom: regionFilterType === "range" ? regionCodeFrom : "",
      regionTo: regionFilterType === "range" ? regionCodeTo : "",
      customerCodeFrom: customerFilterType === "range" ? customerCodeFrom : "",
      customerCodeTo: customerFilterType === "range" ? customerCodeTo : "",
    };

    try {
      exportAgeAnalysisToExcel(reportData, filters);
      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h2 mb-0">Age Analysis Report</h1>
          <div className="text-muted small">
            <FiCalendar className="me-1" />
            <CurrentDateTime />
          </div>
        </div>
        <hr className="mt-2" />
      </div>

      {/* As Of Date */}
      <div className="col-12 col-sm-6 col-md-4 col-xl-2 mb-3">
        <label className="form-label small fw-semibold mb-1">As Of Date</label>
        <input
          type="date"
          className="form-control form-control-sm"
          value={asOfDate}
          onChange={(e) => setAsOfDate(e.target.value)}
        />
      </div>

      {/* Filters Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <FiFilter className="me-2" />
          Filters
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Sales Person From */}
            <div className="col-6 col-sm-6 col-md-4 col-xl-2">
              <CustomSelect
                label="Sales Person From"
                value={salesPersonCodeFrom}
                onChange={(e) => setSalesPersonCodeFrom(e.target.value)}
                options={sortedSalesPersonCodes}
                placeholder="Select..."
                disabled={isSalesPersonsLoading}
                loading={isSalesPersonsLoading}
              />
            </div>

            {/* Sales Person To */}
            <div className="col-6 col-sm-6 col-md-4 col-xl-2">
              <CustomSelect
                label="Sales Person To"
                value={salesPersonCodeTo}
                onChange={(e) => setSalesPersonCodeTo(e.target.value)}
                options={sortedSalesPersonCodes}
                placeholder="Select..."
                disabled={isSalesPersonsLoading}
                loading={isSalesPersonsLoading}
              />
            </div>

            {/* Region From */}
            <div className="col-6 col-sm-6 col-md-4 col-xl-2">
              <CustomSelect
                label="Region From"
                value={regionCodeFrom}
                onChange={(e) => setRegionCodeFrom(e.target.value)}
                options={sortedRegionCodes}
                placeholder="Select..."
                disabled={isRegionsLoading}
                loading={isRegionsLoading}
              />
            </div>

            {/* Region To */}
            <div className="col-6 col-sm-6 col-md-4 col-xl-2">
              <CustomSelect
                label="Region To"
                value={regionCodeTo}
                onChange={(e) => setRegionCodeTo(e.target.value)}
                options={sortedRegionCodes}
                placeholder="Select..."
                disabled={isRegionsLoading}
                loading={isRegionsLoading}
              />
            </div>

            {/* Customer From */}
            <div className="col-6 col-sm-6 col-md-4 col-xl-2">
              <CustomSelect
                label="Customer From"
                value={customerCodeFrom}
                onChange={(e) => setCustomerCodeFrom(e.target.value)}
                options={sortedCustomerCodes}
                placeholder="Select..."
                disabled={isCustomersLoading}
                loading={isCustomersLoading}
              />
            </div>

            {/* Customer To */}
            <div className="col-6 col-sm-6 col-md-4 col-xl-2">
              <CustomSelect
                label="Customer To"
                value={customerCodeTo}
                onChange={(e) => setCustomerCodeTo(e.target.value)}
                options={sortedCustomerCodes}
                placeholder="Select..."
                disabled={isCustomersLoading}
                loading={isCustomersLoading}
              />
            </div>
          </div>

          {/* Range Info Alerts - Compact Version */}
          {(salesPersonCodeFrom && salesPersonCodeTo) ||
          (regionCodeFrom && regionCodeTo) ||
          (customerCodeFrom && customerCodeTo) ? (
            <div className="mt-3">
              <div className="card border-info">
                <div className="card-body py-2 px-3">
                  <small className="text-muted d-block mb-1">
                    <strong>Selected Ranges:</strong>
                  </small>
                  <div className="row g-2">
                    {salesPersonCodeFrom && salesPersonCodeTo && (
                      <div className="col-12 col-md-4">
                        <span className="badge bg-info">
                          Sales Person: {salesPersonCodeFrom} -{" "}
                          {salesPersonCodeTo} ({getSalesPersonsByRange().length}
                          )
                        </span>
                      </div>
                    )}
                    {regionCodeFrom && regionCodeTo && (
                      <div className="col-12 col-md-4">
                        <span className="badge bg-info">
                          Region: {regionCodeFrom} - {regionCodeTo} (
                          {getRegionsByRange().length})
                        </span>
                      </div>
                    )}
                    {customerCodeFrom && customerCodeTo && (
                      <div className="col-12 col-md-4">
                        <span className="badge bg-info">
                          Customer: {customerCodeFrom} - {customerCodeTo} (
                          {getCustomersByRange().length})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Custom Slabs Section */}
          <div className="mt-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="customSlabsCheck"
                checked={useCustomSlabs}
                onChange={(e) => setUseCustomSlabs(e.target.checked)}
              />
              <label
                className="form-check-label small"
                htmlFor="customSlabsCheck"
              >
                Use Custom Age Slabs
              </label>
            </div>

            {useCustomSlabs && (
              <div className="border rounded p-3 bg-light mt-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 small">Configure Custom Slabs (Max 5)</h6>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={addCustomSlab}
                    disabled={customSlabs.length >= 5}
                  >
                    <FiPlus className="me-1" />
                    Add
                  </button>
                </div>

                {customSlabs.map((slab, index) => (
                  <div key={index} className="row g-2 mb-2 align-items-end">
                    <div className="col-4 col-md-3">
                      <label className="form-label small mb-1">From Days</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={slab.fromDays}
                        onChange={(e) =>
                          updateCustomSlab(
                            index,
                            "fromDays",
                            Number(e.target.value)
                          )
                        }
                        min="0"
                      />
                    </div>
                    <div className="col-4 col-md-3">
                      <label className="form-label small mb-1">
                        To Days <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={slab.toDays || ""}
                        onChange={(e) =>
                          updateCustomSlab(
                            index,
                            "toDays",
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        placeholder="Leave empty"
                        min={slab.fromDays}
                      />
                    </div>
                    <div className="col-4 col-md-4">
                      <label className="form-label small mb-1">Label</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={slab.label}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="col-12 col-md-2">
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => removeCustomSlab(index)}
                        disabled={customSlabs.length === 1}
                        title="Remove slab"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search and Export Buttons */}
          <div className="mt-3 d-flex gap-2 flex-wrap">
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <FiSearch className="me-2" />
              {isLoading ? "Searching..." : "Search"}
            </button>

            {reportData && reportData.data.length > 0 && (
              <button
                className="btn btn-success"
                onClick={handleExportExcel}
                disabled={isLoading}
              >
                <FiDownload className="me-2" />
                Export to Excel
              </button>
            )}

            {hasSearched && (
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  setAsOfDate(new Date().toISOString().split("T")[0]);

                  // Reset Customer filter
                  setSelectedCustomers([]);
                  setCustomerCodeFrom("");
                  setCustomerCodeTo("");

                  // Reset Region filter
                  setSelectedRegions([]);
                  setRegionCodeFrom("");
                  setRegionCodeTo("");

                  // Reset Sales Person filter
                  setSelectedSalesPersons([]);
                  setSalesPersonCodeFrom("");
                  setSalesPersonCodeTo("");

                  setUseCustomSlabs(false);
                  setHasSearched(false);
                  setSearchParams(null);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong>{" "}
          {error?.message || "Failed to load report data"}
        </div>
      )}

      {/* Report Data */}
      {reportData && (
        <>
          {/* Summary Section */}
          {reportData.data.length > 0 && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-info text-white">
                <strong>Summary</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(reportData.summary.slabTotals).map(
                    ([label, amount]) => (
                      <div key={label} className="col-md-4 col-lg-2 mb-3">
                        <div className="border rounded p-2 text-center">
                          <small className="text-muted d-block">{label}</small>
                          <strong className="text-primary">
                            {formatCurrency(amount)}
                          </strong>
                        </div>
                      </div>
                    )
                  )}
                  <div className="col-md-4 col-lg-2 mb-3">
                    <div className="border rounded p-2 text-center bg-success text-white">
                      <small className="d-block">Total Amount Due</small>
                      <strong>
                        {formatCurrency(reportData.summary.totalAmountDue)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <strong>Invoice Details</strong>
              <span className="float-end">
                Total Records: {reportData.pagination.totalCount}
              </span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-success">
                    <tr>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ borderRight: "2px solid #198754" }}
                      >
                        Reference No
                      </th>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ borderRight: "2px solid #198754" }}
                      >
                        Customer
                      </th>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ borderRight: "2px solid #198754" }}
                      >
                        Sales Person
                      </th>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ borderRight: "2px solid #198754" }}
                      >
                        Region
                      </th>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ borderRight: "2px solid #198754" }}
                      >
                        Aging (Days)
                      </th>
                      <th
                        rowSpan="2"
                        className="align-middle text-end"
                        style={{ borderRight: "2px solid #198754" }}
                      >
                        Total Amount
                      </th>
                      <th
                        rowSpan="2"
                        className="align-middle text-end"
                        style={{ borderRight: "3px solid #0d6efd" }}
                      >
                        Amount Due
                      </th>
                      <th
                        colSpan={
                          Object.keys(reportData.data[0]?.slabAmounts || {})
                            .length
                        }
                        className="text-center bg-info bg-opacity-25"
                        style={{ borderLeft: "3px solid #0d6efd" }}
                      >
                        Age Slabs
                      </th>
                    </tr>
                    <tr>
                      {reportData.data[0] &&
                        Object.keys(reportData.data[0].slabAmounts).map(
                          (slabLabel, index, array) => (
                            <th
                              key={slabLabel}
                              className="text-end bg-info bg-opacity-25"
                              style={{
                                minWidth: "120px",
                              }}
                            >
                              {slabLabel}
                            </th>
                          )
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.length === 0 ? (
                      <tr>
                        <td
                          colSpan={
                            7 +
                            Object.keys(reportData.data[0]?.slabAmounts || {})
                              .length
                          }
                          className="text-center text-muted py-4"
                        >
                          No data available for the selected filters
                        </td>
                      </tr>
                    ) : (
                      reportData.data.map((invoice) => (
                        <tr key={invoice.salesInvoiceId}>
                          <td style={{ borderRight: "1px solid #dee2e6" }}>
                            {invoice.referenceNo}
                          </td>
                          <td style={{ borderRight: "1px solid #dee2e6" }}>
                            {invoice.customerName}
                          </td>
                          <td style={{ borderRight: "1px solid #dee2e6" }}>
                            {invoice.salesPersonName}
                          </td>
                          <td style={{ borderRight: "1px solid #dee2e6" }}>
                            {invoice.regionName}
                          </td>
                          <td style={{ borderRight: "1px solid #dee2e6" }}>
                            {invoice.agingDays}
                          </td>
                          <td
                            className="text-end"
                            style={{ borderRight: "1px solid #dee2e6" }}
                          >
                            {formatCurrency(invoice.totalAmount)}
                          </td>
                          <td
                            className="text-end"
                            style={{ borderRight: "3px solid #0d6efd" }}
                          >
                            <strong className="text-danger">
                              {formatCurrency(invoice.amountDue)}
                            </strong>
                          </td>
                          {Object.entries(invoice.slabAmounts).map(
                            ([slabLabel, amount], index) => (
                              <td
                                key={slabLabel}
                                className={`text-end ${
                                  amount > 0
                                    ? "bg-warning bg-opacity-25 fw-bold"
                                    : ""
                                }`}
                              >
                                {amount > 0 ? formatCurrency(amount) : "0.00"}
                              </td>
                            )
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {reportData.pagination.totalPages > 1 && (
              <div className="card-footer">
                <Pagination
                  itemsPerPage={reportData.pagination.pageSize}
                  totalItems={reportData.pagination.totalCount}
                  paginate={setCurrentPage}
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Loading State */}
      {isLoading && reportData === null && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading report data...</p>
        </div>
      )}
    </div>
  );
};

export default AgeAnalysisReport;
